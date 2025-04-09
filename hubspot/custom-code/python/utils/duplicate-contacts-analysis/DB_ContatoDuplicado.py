import os
import time
import json
import queue
import pandas as pd
import numpy as np
import requests
import psycopg2
from psycopg2.extras import execute_batch
from sqlalchemy import create_engine, Table, MetaData
import sqlalchemy
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
import logging
from tqdm import tqdm
import hashlib
import sys
import math
import traceback
from configparser import ConfigParser
from concurrent.futures import ThreadPoolExecutor
import threading
import signal


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("hubspot_contacts_analysis.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class DatabaseManager:
    """Manages PostgreSQL database connections and operations"""
    
    def __init__(self, config_file='database.ini', section='postgresql', pool_size=20):
        self.config_file = config_file
        self.section = section
        self.conn = None
        self.engine = None
        self.api_calls_today = 0
        self.rate_limit_lock = threading.Lock()
        self.pool_size = pool_size
        self._setup_db()
    
    def _get_config(self):
        """Read database configuration from file"""
        try:
            parser = ConfigParser()
            parser.read(self.config_file)
            
            if parser.has_section(self.section):
                db_config = {param[0]: param[1] for param in parser.items(self.section)}
            else:
                # Default configuration if no config file exists
                db_config = {
                    'host': 'localhost',
                    'database': 'hubspot_contacts', 
                    'user': 'postgres',
                    'password': 'postgres',
                    'port': '5432'
                }
                # Create config file with default values
                self._create_default_config(db_config)
                
            return db_config
        except Exception as e:
            logger.error(f"Error reading database config: {str(e)}")
            raise
    
    def _create_default_config(self, config):
        """Create default config file"""
        try:
            parser = ConfigParser()
            parser.add_section(self.section)
            for key, value in config.items():
                parser.set(self.section, key, value)
            
            with open(self.config_file, 'w') as f:
                parser.write(f)
            logger.info(f"Created default database config at {self.config_file}")
        except Exception as e:
            logger.warning(f"Could not create config file: {str(e)}")
    
    def _setup_db(self):
        """Connect to PostgreSQL and initialize database schema"""
        try:
            db_config = self._get_config()
            
            # Create connection pool with SQLAlchemy
            conn_string = f"postgresql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
            self.engine = create_engine(
                conn_string, 
                pool_size=self.pool_size, 
                max_overflow=10,
                pool_pre_ping=True,
                pool_recycle=3600
            )
            
            # Create core tables if they don't exist
            self._create_tables()
            
            # Also create a standard connection for more complex operations
            self.conn = psycopg2.connect(**db_config)
            
            # Alter existing table columns if needed
            self._fix_existing_tables()
            
            # Reset API call counter at midnight
            self._reset_api_call_counter_if_needed()
            
            logger.info(f"Database connection established with connection pool of {self.pool_size}")
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            raise
    
    def _fix_existing_tables(self):
        """Fix column sizes in existing tables if needed"""
        try:
            with self.conn.cursor() as cursor:
                # Check if hubspot_duplicates exists and has contact_id with wrong size
                cursor.execute("""
                SELECT column_name, character_maximum_length 
                FROM information_schema.columns 
                WHERE table_name = 'hubspot_duplicates' AND column_name = 'contact_id'
                """)
                
                result = cursor.fetchone()
                if result and result[1] < 255:
                    logger.info("Altering hubspot_duplicates.contact_id to increase column size")
                    # First drop foreign key constraint if it exists
                    cursor.execute("""
                    DO $$
                    BEGIN
                        IF EXISTS (
                            SELECT 1 FROM information_schema.table_constraints 
                            WHERE constraint_type = 'FOREIGN KEY' 
                            AND table_name = 'hubspot_duplicates'
                        ) THEN
                            ALTER TABLE hubspot_duplicates DROP CONSTRAINT IF EXISTS hubspot_duplicates_contact_id_fkey;
                        END IF;
                    END $$;
                    """)
                    
                    # Then alter the column
                    cursor.execute("ALTER TABLE hubspot_duplicates ALTER COLUMN contact_id TYPE VARCHAR(255)")
                    
                    # Recreate the foreign key constraint
                    cursor.execute("""
                    ALTER TABLE hubspot_duplicates 
                    ADD CONSTRAINT hubspot_duplicates_contact_id_fkey 
                    FOREIGN KEY (contact_id) REFERENCES hubspot_contacts (id)
                    """)
                    
                    logger.info("Successfully altered hubspot_duplicates.contact_id column size")
                
                # Check if column sizes for phone and createdate need to be increased
                cursor.execute("""
                SELECT column_name, character_maximum_length 
                FROM information_schema.columns 
                WHERE table_name = 'hubspot_duplicates' AND column_name = 'phone'
                """)
                
                result = cursor.fetchone()
                if result and result[1] < 255:
                    logger.info("Altering hubspot_duplicates.phone to increase column size")
                    cursor.execute("ALTER TABLE hubspot_duplicates ALTER COLUMN phone TYPE VARCHAR(255)")
                
                cursor.execute("""
                SELECT column_name, character_maximum_length 
                FROM information_schema.columns 
                WHERE table_name = 'hubspot_duplicates' AND column_name = 'createdate'
                """)
                
                result = cursor.fetchone()
                if result and result[1] < 255:
                    logger.info("Altering hubspot_duplicates.createdate to increase column size")
                    cursor.execute("ALTER TABLE hubspot_duplicates ALTER COLUMN createdate TYPE VARCHAR(255)")
                
                # Check if duplicate_type column needs to be increased
                cursor.execute("""
                SELECT column_name, character_maximum_length 
                FROM information_schema.columns 
                WHERE table_name = 'hubspot_duplicates' AND column_name = 'duplicate_type'
                """)
                
                result = cursor.fetchone()
                if result and result[1] < 50:
                    logger.info("Altering hubspot_duplicates.duplicate_type to increase column size")
                    cursor.execute("ALTER TABLE hubspot_duplicates ALTER COLUMN duplicate_type TYPE VARCHAR(50)")
                
                self.conn.commit()
        except Exception as e:
            logger.error(f"Error fixing existing tables: {str(e)}")
            self.conn.rollback()
    
    def _create_tables(self):
        """Create necessary tables if they don't exist"""
        try:
            with self.engine.connect() as connection:
                # Contacts table
                connection.execute(sqlalchemy.text("""
                CREATE TABLE IF NOT EXISTS hubspot_contacts (
                    id VARCHAR(100) PRIMARY KEY,
                    email VARCHAR(255),
                    firstname VARCHAR(255),
                    lastname VARCHAR(255), 
                    phone VARCHAR(100),
                    createdate VARCHAR(100),
                    email_standardized VARCHAR(255),
                    name_standardized TEXT,
                    phone_standardized VARCHAR(100),
                    email_hash VARCHAR(32),
                    name_hash VARCHAR(32),
                    phone_hash VARCHAR(32),
                    raw_data JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """))
                
                # Create indexes for faster duplicate detection
                connection.execute(sqlalchemy.text("""
                CREATE INDEX IF NOT EXISTS idx_email_hash ON hubspot_contacts (email_hash)
                WHERE email_hash IS NOT NULL
                """))
                
                connection.execute(sqlalchemy.text("""
                CREATE INDEX IF NOT EXISTS idx_name_hash ON hubspot_contacts (name_hash)
                WHERE name_hash IS NOT NULL
                """))
                
                connection.execute(sqlalchemy.text("""
                CREATE INDEX IF NOT EXISTS idx_phone_hash ON hubspot_contacts (phone_hash)
                WHERE phone_hash IS NOT NULL
                """))
                
                # Duplicates table
                connection.execute(sqlalchemy.text("""
                CREATE TABLE IF NOT EXISTS hubspot_duplicates (
                    id SERIAL PRIMARY KEY,
                    contact_id VARCHAR(255),
                    email VARCHAR(255),
                    name TEXT,
                    phone VARCHAR(255),
                    createdate VARCHAR(255),
                    duplicate_type VARCHAR(50),
                    group_id INTEGER,
                    raw_data JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (contact_id) REFERENCES hubspot_contacts (id)
                )
                """))
                
                # Progress tracking table
                connection.execute(sqlalchemy.text("""
                CREATE TABLE IF NOT EXISTS hubspot_progress (
                    id SERIAL PRIMARY KEY,
                    last_after_token TEXT,
                    total_contacts_fetched INTEGER,
                    total_api_calls INTEGER,
                    last_run_date DATE,
                    api_calls_today INTEGER,
                    api_limit_reached BOOLEAN DEFAULT FALSE,
                    is_finished BOOLEAN DEFAULT FALSE,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """))
                
                # Stats table
                connection.execute(sqlalchemy.text("""
                CREATE TABLE IF NOT EXISTS hubspot_stats (
                    id SERIAL PRIMARY KEY,
                    total_contacts INTEGER DEFAULT 0,
                    duplicate_groups INTEGER DEFAULT 0,
                    duplicate_records INTEGER DEFAULT 0,
                    email_duplicates INTEGER DEFAULT 0,
                    name_duplicates INTEGER DEFAULT 0,
                    phone_duplicates INTEGER DEFAULT 0,
                    empty_email INTEGER DEFAULT 0, 
                    empty_name INTEGER DEFAULT 0,
                    empty_phone INTEGER DEFAULT 0,
                    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """))
                
                # Insert initial progress record if none exists
                connection.execute(sqlalchemy.text("""
                INSERT INTO hubspot_progress (last_after_token, total_contacts_fetched, total_api_calls, 
                                             last_run_date, api_calls_today, api_limit_reached, is_finished)
                SELECT NULL, 0, 0, CURRENT_DATE, 0, FALSE, FALSE
                WHERE NOT EXISTS (SELECT 1 FROM hubspot_progress)
                """))
                
                # Insert initial stats record if none exists
                connection.execute(sqlalchemy.text("""
                INSERT INTO hubspot_stats (total_contacts, duplicate_groups, duplicate_records)
                SELECT 0, 0, 0
                WHERE NOT EXISTS (SELECT 1 FROM hubspot_stats)
                """))
                
                connection.commit()
                
            logger.info("Database tables created/verified")
        except Exception as e:
            logger.error(f"Error creating database tables: {str(e)}")
            raise
    
    def _reset_api_call_counter_if_needed(self):
        """Reset API call counter if it's a new day"""
        try:
            with self.conn.cursor() as cursor:
                cursor.execute("SELECT last_run_date, api_calls_today FROM hubspot_progress ORDER BY id DESC LIMIT 1")
                result = cursor.fetchone()
                
                if result:
                    last_date, calls = result
                    today = datetime.now().date()
                    
                    if last_date and last_date < today:
                        cursor.execute("""
                        UPDATE hubspot_progress 
                        SET last_run_date = %s, api_calls_today = 0, api_limit_reached = FALSE
                        WHERE id = (SELECT id FROM hubspot_progress ORDER BY id DESC LIMIT 1)
                        """, (today,))
                        self.conn.commit()
                        logger.info(f"Reset API call counter for new day {today}")
                        self.api_calls_today = 0
                    else:
                        self.api_calls_today = calls or 0
        except Exception as e:
            logger.error(f"Error resetting API call counter: {str(e)}")
    
    def get_api_calls_today(self) -> int:
        """Get the current number of API calls made today"""
        with self.rate_limit_lock:
            return self.api_calls_today
    
    def increment_api_calls(self, count: int = 1):
        """Increment API call counter"""
        with self.rate_limit_lock:
            self.api_calls_today += count
            try:
                with self.conn.cursor() as cursor:
                    cursor.execute("""
                    UPDATE hubspot_progress 
                    SET api_calls_today = %s
                    WHERE id = (SELECT id FROM hubspot_progress ORDER BY id DESC LIMIT 1)
                    """, (self.api_calls_today,))
                    self.conn.commit()
            except Exception as e:
                logger.error(f"Error updating API call count: {str(e)}")
    
    def check_api_limit(self, daily_limit: int) -> bool:
        """Check if API limit has been reached"""
        with self.rate_limit_lock:
            if self.api_calls_today >= daily_limit:
                try:
                    with self.conn.cursor() as cursor:
                        cursor.execute("""
                        UPDATE hubspot_progress 
                        SET api_limit_reached = TRUE
                        WHERE id = (SELECT id FROM hubspot_progress ORDER BY id DESC LIMIT 1)
                        """)
                        self.conn.commit()
                except Exception as e:
                    logger.error(f"Error updating API limit status: {str(e)}")
                return True
            return False
    
    def _sanitize_string(self, value):
        """Remove NULL bytes from strings and handle other problematic characters"""
        if value is None:
            return None
        if isinstance(value, str):
            # Replace NULL bytes and other control characters
            return value.replace('\x00', '').replace('\x01', '').replace('\x02', '').replace('\x03', '').replace('\x04', '')
        return value
    
    def store_contacts(self, contacts: List[Dict]):
        """Store contacts in the database with improved batch handling"""
        if not contacts:
            return
            
        try:
            # Use connection pooling
            with self.engine.connect() as conn:
                # Prepare data for batch insertion
                values = []
                for contact in contacts:
                    # Sanitize all string fields before standardization
                    email = self._sanitize_string(contact.get("email"))
                    firstname = self._sanitize_string(contact.get("firstname"))
                    lastname = self._sanitize_string(contact.get("lastname"))
                    phone = self._sanitize_string(contact.get("phone"))
                    createdate = self._sanitize_string(contact.get("createdate"))
                    
                    # Standardize fields first
                    email_std = self._standardize_email(email)
                    email_hash = hashlib.md5(str(email_std).encode()).hexdigest() if email_std else None
                    
                    name_std = self._standardize_name(firstname, lastname)
                    name_hash = hashlib.md5(str(name_std).encode()).hexdigest() if name_std else None
                    
                    phone_std = self._standardize_phone(phone)
                    phone_hash = hashlib.md5(str(phone_std).encode()).hexdigest() if phone_std else None
                    
                    # Sanitize raw_data JSON - use minimal data to improve performance
                    try:
                        # Only store essential fields instead of full raw data
                        minimal_data = {
                            "id": contact.get("hs_object_id"),
                            "email": email,
                            "name": f"{firstname or ''} {lastname or ''}".strip(),
                            "phone": phone,
                            "createdate": createdate
                        }
                        raw_data = json.dumps(minimal_data)
                    except Exception:
                        raw_data = json.dumps({"id": contact.get("hs_object_id")})
                    
                    values.append({
                        "id": self._sanitize_string(contact.get("hs_object_id")),
                        "email": email,
                        "firstname": firstname,
                        "lastname": lastname,
                        "phone": phone,
                        "createdate": createdate,
                        "email_standardized": email_std,
                        "name_standardized": name_std,
                        "phone_standardized": phone_std,
                        "email_hash": email_hash,
                        "name_hash": name_hash,
                        "phone_hash": phone_hash,
                        "raw_data": raw_data
                    })
                
                # Use SQLAlchemy Core for bulk insert - faster than execute_batch
                if values:
                    table = Table(
                        'hubspot_contacts', 
                        MetaData(), 
                        autoload_with=self.engine
                    )
                    
                    # Execute in a transaction
                    with conn.begin():
                        # Use the faster bulk insert with conflict resolution
                        stmt = sqlalchemy.dialects.postgresql.insert(table).values(values)
                        stmt = stmt.on_conflict_do_update(
                            index_elements=['id'],
                            set_={
                                'email': stmt.excluded.email,
                                'firstname': stmt.excluded.firstname,
                                'lastname': stmt.excluded.lastname,
                                'phone': stmt.excluded.phone,
                                'createdate': stmt.excluded.createdate,
                                'email_standardized': stmt.excluded.email_standardized,
                                'name_standardized': stmt.excluded.name_standardized,
                                'phone_standardized': stmt.excluded.phone_standardized,
                                'email_hash': stmt.excluded.email_hash,
                                'name_hash': stmt.excluded.name_hash,
                                'phone_hash': stmt.excluded.phone_hash,
                                'raw_data': stmt.excluded.raw_data
                            }
                        )
                        conn.execute(stmt)
                    
                    # Update total contacts count - do this less frequently
                    conn.execute(sqlalchemy.text(
                        "UPDATE hubspot_stats SET total_contacts = (SELECT COUNT(*) FROM hubspot_contacts), last_updated = CURRENT_TIMESTAMP"
                    ))
            
        except Exception as e:
            logger.error(f"Error storing contacts in database: {str(e)}")
            # Try inserting one by one for problematic batches
            self._insert_contacts_individually(contacts)
    
    def _insert_contacts_individually(self, contacts: List[Dict]):
        """Fallback method to insert contacts one by one when batch insert fails"""
        logger.info(f"Attempting to insert {len(contacts)} contacts individually")
        
        success_count = 0
        fail_count = 0
        
        with self.conn.cursor() as cursor:
            for contact in contacts:
                try:
                    # Sanitize all string fields
                    contact_id = self._sanitize_string(contact.get("hs_object_id"))
                    email = self._sanitize_string(contact.get("email"))
                    firstname = self._sanitize_string(contact.get("firstname"))
                    lastname = self._sanitize_string(contact.get("lastname"))
                    phone = self._sanitize_string(contact.get("phone"))
                    createdate = self._sanitize_string(contact.get("createdate"))
                    
                    # Standardize fields
                    email_std = self._standardize_email(email)
                    email_hash = hashlib.md5(str(email_std).encode()).hexdigest() if email_std else None
                    
                    name_std = self._standardize_name(firstname, lastname)
                    name_hash = hashlib.md5(str(name_std).encode()).hexdigest() if name_std else None
                    
                    phone_std = self._standardize_phone(phone)
                    phone_hash = hashlib.md5(str(phone_std).encode()).hexdigest() if phone_std else None
                    
                    # Minimal raw data
                    raw_data = json.dumps({"id": contact_id})
                    
                    # Insert with upsert
                    cursor.execute("""
                    INSERT INTO hubspot_contacts 
                        (id, email, firstname, lastname, phone, createdate, 
                        email_standardized, name_standardized, phone_standardized, 
                        email_hash, name_hash, phone_hash, raw_data)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        email = EXCLUDED.email,
                        firstname = EXCLUDED.firstname,
                        lastname = EXCLUDED.lastname,
                        phone = EXCLUDED.phone,
                        createdate = EXCLUDED.createdate,
                        email_standardized = EXCLUDED.email_standardized,
                        name_standardized = EXCLUDED.name_standardized,
                        phone_standardized = EXCLUDED.phone_standardized,
                        email_hash = EXCLUDED.email_hash,
                        name_hash = EXCLUDED.name_hash,
                        phone_hash = EXCLUDED.phone_hash,
                        raw_data = EXCLUDED.raw_data
                    """, (
                        contact_id, email, firstname, lastname, phone, createdate,
                        email_std, name_std, phone_std, 
                        email_hash, name_hash, phone_hash, raw_data
                    ))
                    self.conn.commit()
                    success_count += 1
                    
                except Exception as e:
                    self.conn.rollback()
                    fail_count += 1
                    logger.error(f"Failed to insert contact {contact.get('hs_object_id')}: {str(e)}")
            
        logger.info(f"Individual insert results: {success_count} successful, {fail_count} failed")
    
    def _standardize_email(self, email: Optional[str]) -> Optional[str]:
        if not email or pd.isna(email) or email == "":
            return None
        return str(email).strip().lower()
    
    def _standardize_name(self, first: Optional[str], last: Optional[str]) -> Optional[str]:
        first = "" if first is None or pd.isna(first) else str(first).strip().lower()
        last = "" if last is None or pd.isna(last) else str(last).strip().lower()
        
        full_name = f"{first} {last}".strip()
        
        if not full_name:
            return None
            
        return full_name
    
    def _standardize_phone(self, phone: Optional[str]) -> Optional[str]:
        if not phone or pd.isna(phone) or phone == "":
            return None
        
        digits = ''.join(char for char in str(phone) if char.isdigit())
        
        if not digits:
            return None
            
        return digits
    
    def update_progress(self, after_token: str, contacts_fetched: int):
        """Update progress tracking information"""
        try:
            with self.conn.cursor() as cursor:
                cursor.execute("""
                UPDATE hubspot_progress 
                SET last_after_token = %s, total_contacts_fetched = total_contacts_fetched + %s,
                    total_api_calls = total_api_calls + 1, updated_at = CURRENT_TIMESTAMP
                WHERE id = (SELECT id FROM hubspot_progress ORDER BY id DESC LIMIT 1)
                """, (after_token, contacts_fetched))
                self.conn.commit()
        except Exception as e:
            logger.error(f"Error updating progress: {str(e)}")
            self.conn.rollback()
    
    def get_progress(self) -> Dict:
        """Get current progress information"""
        try:
            with self.conn.cursor() as cursor:
                cursor.execute("""
                SELECT last_after_token, total_contacts_fetched, total_api_calls, 
                       api_calls_today, api_limit_reached, is_finished
                FROM hubspot_progress 
                ORDER BY id DESC LIMIT 1
                """)
                result = cursor.fetchone()
                
                if result:
                    return {
                        'last_after_token': result[0],
                        'total_contacts_fetched': result[1],
                        'total_api_calls': result[2],
                        'api_calls_today': result[3],
                        'api_limit_reached': result[4],
                        'is_finished': result[5]
                    }
                return {}
        except Exception as e:
            logger.error(f"Error getting progress: {str(e)}")
            return {}
    
    def mark_finished(self):
        """Mark the import process as finished"""
        try:
            with self.conn.cursor() as cursor:
                cursor.execute("""
                UPDATE hubspot_progress 
                SET is_finished = TRUE, updated_at = CURRENT_TIMESTAMP
                WHERE id = (SELECT id FROM hubspot_progress ORDER BY id DESC LIMIT 1)
                """)
                self.conn.commit()
        except Exception as e:
            logger.error(f"Error marking progress as finished: {str(e)}")
            self.conn.rollback()
    
    def close(self):
        """Close database connections"""
        if self.conn:
            self.conn.close()


class HubSpotContactAnalyzer:

    def __init__(self, api_key: str, db_manager: DatabaseManager = None):
        self.api_key = api_key
        self.base_url = "https://api.hubspot.com"
        self.graphql_url = "https://api.hubspot.com/collector/graphql"
        self.daily_api_limit = 1200000  # 60% of 2M daily limit
        self.batch_size = 100  # Max batch size for the REST API
        self.max_requests_per_second = 50  # Increased from 8, will be dynamically adjusted
        self.min_request_interval = 1.0 / self.max_requests_per_second
        self.last_request_time = 0
        self.recent_response_times = []
        self.rate_limit_lock = threading.RLock()
        self.all_contacts = []  # Used temporarily during batch processing
        self.db = db_manager or DatabaseManager()
        self.stop_signal_received = False
        
        # Register signal handler for graceful shutdown
        signal.signal(signal.SIGINT, self._handle_signal)
        signal.signal(signal.SIGTERM, self._handle_signal)

    def _adjust_rate_limit(self, response_time):
        """Dynamically adjust rate limiting based on response times"""
        with self.rate_limit_lock:
            # Keep track of recent response times (last 10)
            self.recent_response_times.append(response_time)
            if len(self.recent_response_times) > 10:
                self.recent_response_times.pop(0)
            
            # Calculate average response time
            avg_response_time = sum(self.recent_response_times) / len(self.recent_response_times)
            
            # Adjust rate limiting based on response time
            if avg_response_time < 0.1:  # Very fast responses
                self.max_requests_per_second = min(self.max_requests_per_second + 5, 100)
            elif avg_response_time > 0.5:  # Slow responses
                self.max_requests_per_second = max(self.max_requests_per_second - 5, 10)
            
            self.min_request_interval = 1.0 / self.max_requests_per_second
    
    def _handle_signal(self, signum, frame):
        """Handle termination signals gracefully"""
        print("\nReceived termination signal. Finishing current batch before stopping...")
        self.stop_signal_received = True
    
    def _sleep_for_rate_limit(self):
        """Sleep to maintain the requests per second rate limit"""
        current_time = time.time()
        elapsed = current_time - self.last_request_time
        
        with self.rate_limit_lock:
            if elapsed < self.min_request_interval:
                sleep_time = self.min_request_interval - elapsed
                if sleep_time > 0.01:  # Only sleep for meaningful amounts
                    time.sleep(sleep_time)
            
            self.last_request_time = time.time()
    
    def _make_graphql_request(self, query: str) -> Dict:
        """Make a GraphQL request to HubSpot API with rate limiting"""
        if self.db.check_api_limit(self.daily_api_limit):
            raise Exception(f"Daily API limit of {self.daily_api_limit} calls reached")
        
        self._sleep_for_rate_limit()
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "query": query
        }
        
        try:
            logger.info("Making GraphQL request")
            response = requests.post(self.graphql_url, headers=headers, json=payload)
            self.db.increment_api_calls()
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"GraphQL request failed: {e}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response text: {e.response.text}")
            raise

    def generate_quick_summary(self, output_file: str = "hubspot_quick_summary.json") -> str:
        """Generate a quick summary directly from database tables without running duplicate detection"""
        logger.info("Generating quick summary from database tables")
        
        try:
            # Create direct database queries to get basic counts
            with self.db.conn.cursor() as cursor:
                # Get total contacts count
                cursor.execute("SELECT COUNT(*) FROM hubspot_contacts")
                total_contacts = cursor.fetchone()[0] or 0
                
                # Get empty fields counts using direct SQL for better performance
                cursor.execute("""
                SELECT 
                    SUM(CASE WHEN email_standardized IS NULL THEN 1 ELSE 0 END) AS empty_email,
                    SUM(CASE WHEN name_standardized IS NULL THEN 1 ELSE 0 END) AS empty_name,
                    SUM(CASE WHEN phone_standardized IS NULL THEN 1 ELSE 0 END) AS empty_phone
                FROM hubspot_contacts
                """)
                
                empty_fields = cursor.fetchone()
                empty_email = empty_fields[0] or 0
                empty_name = empty_fields[1] or 0
                empty_phone = empty_fields[2] or 0
                
                # Get duplicate counts using basic queries
                # Email duplicates - just count how many emails appear more than once
                cursor.execute("""
                SELECT COUNT(*) FROM (
                    SELECT email_hash, COUNT(*) as dupes
                    FROM hubspot_contacts
                    WHERE email_hash IS NOT NULL
                    GROUP BY email_hash
                    HAVING COUNT(*) > 1
                ) AS email_duplicates
                """)
                email_dup_groups = cursor.fetchone()[0] or 0
                
                cursor.execute("""
                SELECT COUNT(*) FROM (
                    SELECT email_hash, COUNT(*) - 1 as extra_dupes
                    FROM hubspot_contacts
                    WHERE email_hash IS NOT NULL
                    GROUP BY email_hash
                    HAVING COUNT(*) > 1
                ) AS email_dup_count
                """)
                email_dup_records = cursor.fetchone()[0] or 0
                
                # Name duplicates - count how many names appear more than once
                cursor.execute("""
                SELECT COUNT(*) FROM (
                    SELECT name_hash, COUNT(*) as dupes
                    FROM hubspot_contacts
                    WHERE name_hash IS NOT NULL
                    GROUP BY name_hash
                    HAVING COUNT(*) > 1
                ) AS name_duplicates
                """)
                name_dup_groups = cursor.fetchone()[0] or 0
                
                cursor.execute("""
                SELECT SUM(extra_dupes) FROM (
                    SELECT name_hash, COUNT(*) - 1 as extra_dupes
                    FROM hubspot_contacts
                    WHERE name_hash IS NOT NULL
                    GROUP BY name_hash
                    HAVING COUNT(*) > 1
                ) AS name_dup_count
                """)
                name_dup_records = cursor.fetchone()[0] or 0
                
                # Phone duplicates - count how many phones appear more than once
                cursor.execute("""
                SELECT COUNT(*) FROM (
                    SELECT phone_hash, COUNT(*) as dupes
                    FROM hubspot_contacts
                    WHERE phone_hash IS NOT NULL
                    GROUP BY phone_hash
                    HAVING COUNT(*) > 1
                ) AS phone_duplicates
                """)
                phone_dup_groups = cursor.fetchone()[0] or 0
                
                cursor.execute("""
                SELECT SUM(extra_dupes) FROM (
                    SELECT phone_hash, COUNT(*) - 1 as extra_dupes
                    FROM hubspot_contacts
                    WHERE phone_hash IS NOT NULL
                    GROUP BY phone_hash
                    HAVING COUNT(*) > 1
                ) AS phone_dup_count
                """)
                phone_dup_records = cursor.fetchone()[0] or 0
                
                # Get total duplicate groups (approximate, may double-count)
                total_dup_groups = email_dup_groups + name_dup_groups + phone_dup_groups
                total_dup_records = email_dup_records + name_dup_records + phone_dup_records
                
                # Get top 5 email duplicates as examples
                cursor.execute("""
                SELECT 
                    email, 
                    COUNT(*) as count
                FROM 
                    hubspot_contacts 
                WHERE 
                    email IS NOT NULL 
                GROUP BY 
                    email 
                HAVING 
                    COUNT(*) > 1 
                ORDER BY 
                    COUNT(*) DESC 
                LIMIT 5
                """)
                
                top_email_dupes = []
                for row in cursor.fetchall():
                    top_email_dupes.append({
                        "email": row[0],
                        "count": row[1]
                    })
                
                # Get some example duplicate contacts
                cursor.execute("""
                WITH email_dupes AS (
                    SELECT 
                        email_hash, 
                        MIN(email) as sample_email,
                        COUNT(*) as count
                    FROM 
                        hubspot_contacts
                    WHERE 
                        email_hash IS NOT NULL
                    GROUP BY 
                        email_hash
                    HAVING 
                        COUNT(*) > 1
                    ORDER BY 
                        COUNT(*) DESC
                    LIMIT 5
                )
                SELECT 
                    d.sample_email, 
                    d.count, 
                    array_agg(c.id) as contact_ids,
                    array_agg(CONCAT(COALESCE(c.firstname, ''), ' ', COALESCE(c.lastname, ''))) as names,
                    array_agg(c.phone) as phones
                FROM 
                    email_dupes d
                JOIN 
                    hubspot_contacts c ON c.email_hash = d.email_hash
                GROUP BY 
                    d.email_hash, d.sample_email, d.count
                LIMIT 5
                """)
                
                example_dupes = []
                for row in cursor.fetchall():
                    try:
                        sample_contacts = []
                        # Get up to 3 samples per group
                        for i in range(min(3, len(row[2]))):
                            sample_contacts.append({
                                "id": row[2][i],
                                "name": row[3][i],
                                "phone": row[4][i] if row[4] and i < len(row[4]) else None
                            })
                            
                        example_dupes.append({
                            "email": row[0],
                            "total_matches": row[1],
                            "samples": sample_contacts
                        })
                    except Exception as ex:
                        logger.error(f"Error processing example: {str(ex)}")
            
            # Calculate percentages
            email_present = total_contacts - empty_email
            name_present = total_contacts - empty_name
            phone_present = total_contacts - empty_phone
            
            pct_with_email = (email_present / total_contacts * 100) if total_contacts > 0 else 0
            pct_with_name = (name_present / total_contacts * 100) if total_contacts > 0 else 0
            pct_with_phone = (phone_present / total_contacts * 100) if total_contacts > 0 else 0
            pct_duplicated = ((email_dup_records + name_dup_records + phone_dup_records) / total_contacts * 100) if total_contacts > 0 else 0
            
            # Create summary dictionary
            summary = {
                "total_contacts": total_contacts,
                "duplicate_summary": {
                    "total_duplicate_groups": total_dup_groups,
                    "total_duplicate_records": total_dup_records,
                    "email_duplicate_groups": email_dup_groups,
                    "name_duplicate_groups": name_dup_groups,
                    "phone_duplicate_groups": phone_dup_groups,
                    "percentage_duplicated": round(pct_duplicated, 2)
                },
                "data_quality": {
                    "with_email_count": email_present,
                    "with_name_count": name_present,
                    "with_phone_count": phone_present,
                    "empty_email_count": empty_email,
                    "empty_name_count": empty_name,
                    "empty_phone_count": empty_phone,
                    "percent_with_email": round(pct_with_email, 2),
                    "percent_with_name": round(pct_with_name, 2),
                    "percent_with_phone": round(pct_with_phone, 2)
                },
                "example_duplicates": example_dupes,
                "top_email_duplicates": top_email_dupes,
                "timestamp": datetime.now().isoformat()
            }
            
            # Create output directory if needed
            output_dir = os.path.dirname(output_file)
            if output_dir and not os.path.exists(output_dir):
                os.makedirs(output_dir)
            
            # Save to file
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(summary, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Quick summary saved to {output_file}")
            return summary
            
        except Exception as e:
            logger.error(f"Error generating quick summary: {str(e)}")
            traceback.print_exc()
            
            # Fallback to minimal summary if something fails
            try:
                # Get the most basic data possible
                with self.db.conn.cursor() as cursor:
                    cursor.execute("SELECT COUNT(*) FROM hubspot_contacts")
                    total = cursor.fetchone()[0] or 0
                
                minimal_summary = {
                    "total_contacts": total,
                    "error": f"Error during full summary generation: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                }
                
                output_dir = os.path.dirname(output_file)
                if output_dir and not os.path.exists(output_dir):
                    os.makedirs(output_dir)
                
                with open(output_file, 'w') as f:
                    json.dump(minimal_summary, f, indent=2)
                
                logger.info(f"Minimal fallback summary saved to {output_file}")
                return minimal_summary
            except Exception:
                logger.error("Failed to create even minimal summary")
                return {"error": "Summary generation failed completely"}

    def get_direct_database_stats(self):
        """Get basic statistics directly from database tables, avoiding any complex analysis"""
        print("\nExtracting basic database statistics...")
        
        try:
            with self.db.conn.cursor() as cursor:
                # Get total contacts count
                cursor.execute("SELECT COUNT(*) FROM hubspot_contacts")
                total_contacts = cursor.fetchone()[0] or 0
                print(f"Total Contacts: {total_contacts:,}")
                
                # Get empty fields counts
                cursor.execute("""
                SELECT 
                    SUM(CASE WHEN email IS NULL OR email = '' THEN 1 ELSE 0 END) AS empty_email,
                    SUM(CASE WHEN (firstname IS NULL OR firstname = '') AND (lastname IS NULL OR lastname = '') THEN 1 ELSE 0 END) AS empty_name,
                    SUM(CASE WHEN phone IS NULL OR phone = '' THEN 1 ELSE 0 END) AS empty_phone
                FROM hubspot_contacts
                """)
                
                empty_fields = cursor.fetchone()
                if empty_fields:
                    empty_email = empty_fields[0] or 0
                    empty_name = empty_fields[1] or 0
                    empty_phone = empty_fields[2] or 0
                    
                    email_pct = (empty_email / total_contacts * 100) if total_contacts > 0 else 0
                    name_pct = (empty_name / total_contacts * 100) if total_contacts > 0 else 0
                    phone_pct = (empty_phone / total_contacts * 100) if total_contacts > 0 else 0
                    
                    print("\nData Quality:")
                    print(f"  Empty Email: {empty_email:,} contacts ({email_pct:.1f}% of total)")
                    print(f"  Empty Name: {empty_name:,} contacts ({name_pct:.1f}% of total)")
                    print(f"  Empty Phone: {empty_phone:,} contacts ({phone_pct:.1f}% of total)")
                
                # Get quick count of duplicate emails
                cursor.execute("""
                SELECT COUNT(*) FROM (
                    SELECT email, COUNT(*) as count 
                    FROM hubspot_contacts 
                    WHERE email IS NOT NULL AND email != ''
                    GROUP BY email 
                    HAVING COUNT(*) > 1
                ) AS email_dupes
                """)
                
                email_dup_count = cursor.fetchone()[0] or 0
                
                # Get quick count of duplicate names (combined first+last)
                cursor.execute("""
                SELECT COUNT(*) FROM (
                    SELECT CONCAT(COALESCE(firstname, ''), ' ', COALESCE(lastname, '')) as full_name, COUNT(*) 
                    FROM hubspot_contacts 
                    WHERE (firstname IS NOT NULL AND firstname != '') OR (lastname IS NOT NULL AND lastname != '')
                    GROUP BY full_name 
                    HAVING COUNT(*) > 1
                ) AS name_dupes
                """)
                
                name_dup_count = cursor.fetchone()[0] or 0
                
                # Get quick count of duplicate phones
                cursor.execute("""
                SELECT COUNT(*) FROM (
                    SELECT phone, COUNT(*) 
                    FROM hubspot_contacts 
                    WHERE phone IS NOT NULL AND phone != ''
                    GROUP BY phone 
                    HAVING COUNT(*) > 1
                ) AS phone_dupes
                """)
                
                phone_dup_count = cursor.fetchone()[0] or 0
                
                # Get estimate of total duplicates
                cursor.execute("""
                SELECT 
                    SUM(dupe_count - 1) as total_dupes
                FROM (
                    SELECT email, COUNT(*) as dupe_count 
                    FROM hubspot_contacts 
                    WHERE email IS NOT NULL AND email != ''
                    GROUP BY email 
                    HAVING COUNT(*) > 1
                ) AS email_dupes
                """)
                
                total_dupes = cursor.fetchone()[0] or 0
                
                print("\nDuplicate Summary:")
                print(f"  Approximate Email Duplicates: {email_dup_count:,} groups")
                print(f"  Approximate Name Duplicates: {name_dup_count:,} groups")
                print(f"  Approximate Phone Duplicates: {phone_dup_count:,} groups")
                print(f"  Approximate Total Duplicate Records: {total_dupes:,}")
                
                # Get some example duplicates
                print("\nExample Duplicate Emails:")
                cursor.execute("""
                SELECT email, COUNT(*) as count 
                FROM hubspot_contacts 
                WHERE email IS NOT NULL AND email != ''
                GROUP BY email 
                HAVING COUNT(*) > 1
                ORDER BY COUNT(*) DESC
                LIMIT 5
                """)
                
                for row in cursor.fetchall():
                    print(f"  {row[0]} - {row[1]:,} duplicates")
                
            return True
        except Exception as e:
            print(f"Error extracting database statistics: {str(e)}")
            traceback.print_exc()
            return False

    def get_empty_field_contacts(self, output_format='both', max_records=1000000, chunk_size=100000):
        """Extract contacts with empty name, email, and phone fields
        
        Args:
            output_format: 'csv', 'json', or 'both'
            max_records: Maximum number of records to export
            chunk_size: Number of records to process at once
        
        Returns:
            Tuple of (csv_path, json_path) with paths to the output files
        """
        print(f"\nExtracting contacts with all three fields (name, email, phone) empty...")
        
        # Create output directory
        output_dir = "hubspot_results/empty_contacts"
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        csv_path = f"{output_dir}/empty_contacts_{timestamp}.csv"
        json_path = f"{output_dir}/empty_contacts_{timestamp}.json"
        
        try:
            # Count total empty contacts first
            with self.db.conn.cursor() as cursor:
                cursor.execute("""
                SELECT COUNT(*) 
                FROM hubspot_contacts 
                WHERE (email IS NULL OR email = '') 
                AND (firstname IS NULL OR firstname = '') 
                AND (lastname IS NULL OR lastname = '')
                AND (phone IS NULL OR phone = '')
                """)
                total_count = cursor.fetchone()[0] or 0
                
                if total_count == 0:
                    print("No contacts found with all three fields empty.")
                    return None, None
                
                print(f"Found {total_count:,} contacts with all three fields empty")
                
                # For very large sets, warn about potential memory issues
                if total_count > max_records:
                    print(f"Warning: Found {total_count:,} contacts, limiting export to {max_records:,} to avoid memory issues")
                    limit_clause = f"LIMIT {max_records}"
                else:
                    limit_clause = ""
                
                # Handle large data by processing in chunks
                if output_format in ['csv', 'both']:
                    # Set up CSV file
                    with open(csv_path, 'w', newline='', encoding='utf-8-sig') as csv_file:
                        writer = None  # Will initialize on first chunk
                        
                        # Process data in manageable chunks
                        for offset in range(0, min(total_count, max_records), chunk_size):
                            print(f"Processing records {offset+1:,} to {min(offset+chunk_size, total_count):,}...")
                            
                            cursor.execute(f"""
                            SELECT 
                                id,
                                email,
                                firstname,
                                lastname,
                                phone,
                                createdate,
                                raw_data
                            FROM 
                                hubspot_contacts 
                            WHERE 
                                (email IS NULL OR email = '') 
                                AND (firstname IS NULL OR firstname = '') 
                                AND (lastname IS NULL OR lastname = '')
                                AND (phone IS NULL OR phone = '')
                            ORDER BY
                                id
                            OFFSET {offset}
                            LIMIT {chunk_size}
                            """)
                            
                            # Get column names for the first chunk
                            if writer is None:
                                columns = [desc[0] for desc in cursor.description]
                                writer = csv.writer(csv_file)
                                writer.writerow(columns)
                            
                            # Write chunk data
                            for row in cursor:
                                writer.writerow(row)
                
                # JSON output
                if output_format in ['json', 'both']:
                    # For JSON, we'll build an array of objects
                    with open(json_path, 'w', encoding='utf-8') as json_file:
                        # Write the JSON file header
                        json_file.write('[\n')
                        
                        # Track if we need to add commas between records
                        first_record = True
                        
                        # Process data in manageable chunks
                        for offset in range(0, min(total_count, max_records), chunk_size):
                            if output_format == 'json':  # Only print if not already printed for CSV
                                print(f"Processing records {offset+1:,} to {min(offset+chunk_size, total_count):,}...")
                            
                            cursor.execute(f"""
                            SELECT 
                                id,
                                email,
                                firstname,
                                lastname,
                                phone,
                                createdate
                            FROM 
                                hubspot_contacts 
                            WHERE 
                                (email IS NULL OR email = '') 
                                AND (firstname IS NULL OR firstname = '') 
                                AND (lastname IS NULL OR lastname = '')
                                AND (phone IS NULL OR phone = '')
                            ORDER BY
                                id
                            OFFSET {offset}
                            LIMIT {chunk_size}
                            """)
                            
                            # Get column names
                            columns = [desc[0] for desc in cursor.description]
                            
                            # Write chunk data to JSON
                            for row in cursor:
                                # Create a dictionary for the current record
                                record = {columns[i]: row[i] for i in range(len(columns))}
                                
                                # Add comma if not first record
                                if not first_record:
                                    json_file.write(',\n')
                                else:
                                    first_record = False
                                
                                # Write the record
                                json_file.write(json.dumps(record, default=str))
                        
                        # Write the JSON array closing bracket
                        json_file.write('\n]')
                
                # Provide summary
                print("\nExport complete!")
                if output_format in ['csv', 'both']:
                    print(f"CSV file saved to: {csv_path}")
                if output_format in ['json', 'both']:
                    print(f"JSON file saved to: {json_path}")
                
                # Provide recommendations for large datasets
                if total_count > 1000000:
                    print("\nRecommendation for large dataset:")
                    print("1. For analysis, the CSV format is usually more efficient.")
                    print("2. You can load the CSV file in chunks using pandas:")
                    print("   ```")
                    print("   import pandas as pd")
                    print("   for chunk in pd.read_csv('path/to/file.csv', chunksize=10000):")
                    print("       # Process each chunk")
                    print("       print(chunk.head())")
                    print("   ```")
                    
                return csv_path, json_path
        
        except Exception as e:
            print(f"Error extracting empty field contacts: {str(e)}")
            traceback.print_exc()
            return None, None

def main():
    """Main function to run the HubSpot contact analyzer with PostgreSQL support"""
    # Default API key - replace with your own or prompt the user
    api_key = "api_key_here"  # Replace with your actual API key
    
    if not api_key:
        api_key = input("Enter your HubSpot API key: ")
    
    try:
        print("\n=== HubSpot Contact Analyzer for Large Datasets ===")
        print("This tool will analyze contacts in your HubSpot account to identify duplicates.")
        print("Using PostgreSQL database for storing 46 million contacts.")
        
        # Performance tuning parameters - adjust based on your system
        db_pool_size = 20
        batch_size = 100
        worker_threads = 10
        
        # Check for command line arguments to override defaults
        if len(sys.argv) > 1:
            for arg in sys.argv[1:]:
                if arg.startswith('--workers='):
                    worker_threads = int(arg.split('=')[1])
                elif arg.startswith('--batch='):
                    batch_size = int(arg.split('=')[1])
                elif arg.startswith('--db-pool='):
                    db_pool_size = int(arg.split('=')[1])
        
        print(f"\nPerformance settings:")
        print(f"- Worker threads: {worker_threads}")
        print(f"- Batch size: {batch_size}")
        print(f"- DB connection pool: {db_pool_size}")
        
        # Initialize database with connection pool
        db_manager = DatabaseManager(pool_size=db_pool_size)
        
        # Check progress from previous runs
        progress = db_manager.get_progress()
        contacts_fetched = progress.get('total_contacts_fetched', 0)
        api_limit_reached = progress.get('api_limit_reached', False)
        is_finished = progress.get('is_finished', False)
        
        # Create output directory
        output_dir = "hubspot_results"
        try:
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
                print(f"Created output directory: {output_dir}")
        except Exception as e:
            print(f"Warning: Could not create output directory: {str(e)}")
            output_dir = "."
            print("Falling back to current directory for outputs.")
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Create analyzer
        analyzer = HubSpotContactAnalyzer(api_key, db_manager)
        
        # Check if quick summary mode was requested
        quick_summary_only = any(arg == '--quick-summary' for arg in sys.argv)
        
        # Step 1: Import contacts if not completed
        if not is_finished and not quick_summary_only:
            print(f"\nCurrent progress: {contacts_fetched:,} contacts fetched so far")
            
            if api_limit_reached:
                print("\n⚠️ API limit was reached in the previous run.")
                print(f"You can fetch approximately {analyzer.daily_api_limit:,} contacts per day (60% of 2M limit).")
                
                resume = input("\nDo you want to continue importing contacts? (y/n): ")
                if resume.lower() != 'y':
                    print("Import paused. You can run the script again tomorrow to continue.")
                    return
            
            print("\nRetrieving contacts from HubSpot using parallel REST API requests...")
            print(f"Using up to {worker_threads} parallel workers and batches of {batch_size} contacts")
            print(f"Aiming for up to 60% of your daily API limit ({analyzer.daily_api_limit:,} calls).")
            
            try:
                total_contacts = analyzer.get_all_contacts_rest_paginated(
                    batch_size=batch_size,
                    max_workers=worker_threads
                )
                
                if db_manager.check_api_limit(analyzer.daily_api_limit):
                    print("\n⚠️ Daily API limit reached. Run the script again tomorrow to continue.")
                    print(f"Progress saved: {total_contacts:,} contacts imported so far.")
                    return
                    
            except KeyboardInterrupt:
                print("\n\nImport paused by user. Progress has been saved.")
                print("Run the script again later to continue.")
                return
                
            except Exception as e:
                logger.error(f"Error during import: {str(e)}")
                print(f"\nError during import: {str(e)}")
                print("Check the log file for more details. Progress has been saved.")
                return
        elif quick_summary_only:
            print("\nGenerating quick summary (skipping duplicate detection)...")
            
            # Generate quick summary
            summary_path = os.path.join(output_dir, f"hubspot_quick_summary_{timestamp}.json")
            summary_data = analyzer.generate_quick_summary(summary_path)
            
            print(f"\n✅ Quick summary generated!")
            print(f"📊 Summary saved to: {summary_path}")
            
            print("\n=== Database Summary ===")
            print(f"Total Contacts: {summary_data['total_contacts']:,}")
            
            dup_summary = summary_data.get('duplicate_summary', {})
            print(f"Approximate Duplicate Records: {dup_summary.get('total_duplicate_records', 0):,}")
            print(f"Approximate Duplicate Groups: {dup_summary.get('total_duplicate_groups', 0):,}")
            
            print("\nApproximate Duplicate Types:")
            print(f"  By Email: {dup_summary.get('email_duplicate_groups', 0):,} groups")
            print(f"  By Name: {dup_summary.get('name_duplicate_groups', 0):,} groups")
            print(f"  By Phone: {dup_summary.get('phone_duplicate_groups', 0):,} groups")
            
            quality = summary_data.get('data_quality', {})
            print("\nData Quality:")
            print(f"  Empty Email: {quality.get('empty_email_count', 0):,} contacts ({100-quality.get('percent_with_email', 0):.1f}% of total)")
            print(f"  Empty Name: {quality.get('empty_name_count', 0):,} contacts ({100-quality.get('percent_with_name', 0):.1f}% of total)")
            print(f"  Empty Phone: {quality.get('empty_phone_count', 0):,} contacts ({100-quality.get('percent_with_phone', 0):.1f}% of total)")
            
            examples = summary_data.get('example_duplicates', [])
            if examples:
                print("\nExample Duplicate Groups:")
                for i, example in enumerate(examples[:3]):
                    print(f"  Group {i+1}: {example.get('email')} - {example.get('total_matches')} contacts")
                    samples = example.get('samples', [])
                    for j, sample in enumerate(samples[:2]):
                        print(f"    - {sample.get('name', 'N/A')} | {sample.get('phone', 'N/A')}")
                    if len(samples) > 2:
                        print(f"    - ...and {len(samples) - 2} more")
            
            return
            
        else:
            print(f"\nAll contacts have already been imported: {contacts_fetched:,} contacts in database")
        
        
        # Step 2: Find duplicates
        print("\nAnalyzing contacts for duplicates...")
        
        # Define output paths
        output_path = os.path.join(output_dir, f"hubspot_duplicates_{timestamp}.csv")
        try:
            with open(output_path, 'w') as test_file:
                pass
            os.remove(output_path)
        except PermissionError:
            user_home = os.path.expanduser("~")
            output_dir = os.path.join(user_home, "hubspot_results")
            try:
                if not os.path.exists(output_dir):
                    os.makedirs(output_dir)
                output_path = os.path.join(output_dir, f"hubspot_duplicates_{timestamp}.csv")
                print(f"Permission denied for original path. Using: {output_path}")
            except Exception:
                import tempfile
                output_dir = tempfile.gettempdir()
                output_path = os.path.join(output_dir, f"hubspot_duplicates_{timestamp}.csv")
                print(f"Using temporary directory: {output_path}")
        
        # Find duplicates directly in the database
        try:
            total_duplicates, stats = analyzer.find_duplicates_in_db()
            print(f"Found {total_duplicates:,} duplicate contacts in {stats['total_groups']:,} groups")
        except Exception as e:
            logger.error(f"Error during duplicate detection: {str(e)}")
            print(f"Error during duplicate detection: {str(e)}")
            print("Will continue with summary generation anyway...")
        
        # Generate summary directly
        summary_path = os.path.join(output_dir, f"hubspot_summary_{timestamp}.json")
        analyzer._generate_summary_from_db(summary_path)
        print(f"\nGenerated direct database summary: {summary_path}")
        
        # Export results if needed
        try:
            output_path = analyzer.export_duplicates(output_path)
            analytics_path = os.path.join(output_dir, f"hubspot_analytics_{timestamp}.json")
            analyzer.generate_analytics(analytics_path)
            
            print(f"\n✅ Analysis complete!")
            print(f"📊 Summary saved to: {summary_path}")
            print(f"📊 Analytics saved to: {analytics_path}")
            print(f"📋 Duplicate contacts saved to: {output_path}")
            print("\nCheck the log file for detailed information.")
        except Exception as exp_error:
            print(f"Error exporting full results: {str(exp_error)}")
            print(f"But summary was generated at: {summary_path}")
        
        # Print summary information
        try:
            with open(summary_path, 'r') as f:
                summary = json.load(f)
                
                print("\n=== Database Summary ===")
                print(f"Total Contacts: {summary['total_contacts']:,}")
                print(f"Duplicate Records: {summary['duplicate_records']:,}")
                print(f"Duplicate Groups: {summary['duplicate_groups']:,}")
                
                if "duplicate_stats" in summary:
                    dup_stats = summary["duplicate_stats"]
                    print("\nDuplicate Types:")
                    print(f"  By Email: {dup_stats.get('email', 0):,}")
                    print(f"  By Name: {dup_stats.get('name', 0):,}")
                    print(f"  By Phone: {dup_stats.get('phone', 0):,}")
                
                if "empty_stats" in summary:
                    empty_stats = summary["empty_stats"]
                    print("\nEmpty Fields:")
                    print(f"  Empty Email: {empty_stats.get('empty_email', 0):,} contacts")
                    print(f"  Empty Name: {empty_stats.get('empty_name', 0):,} contacts")
                    print(f"  Empty Phone: {empty_stats.get('empty_phone', 0):,} contacts")
                
                if "data_quality" in summary:
                    quality = summary["data_quality"]
                    print("\nData Quality:")
                    print(f"  Contacts with Email: {quality.get('percent_with_email', 0):.1f}%")
                    print(f"  Contacts with Name: {quality.get('percent_with_name', 0):.1f}%")
                    print(f"  Contacts with Phone: {quality.get('percent_with_phone', 0):.1f}%")
                    print(f"  Duplicate Percentage: {quality.get('percent_duplicated', 0):.1f}%")
                
                if "top_duplicate_groups" in summary and summary["top_duplicate_groups"]:
                    print("\nTop Duplicate Groups:")
                    for group in summary["top_duplicate_groups"][:3]:
                        print(f"  Group {group['group_id']}: {group['count']} contacts ({group['type']})")
                        print(f"    Sample: {group.get('sample_email', 'N/A')} / {group.get('sample_name', 'N/A')}")
            
        except Exception as e:
            print(f"\nCould not read summary: {str(e)}")
            # Try direct database query as last resort
            try:
                with db_manager.conn.cursor() as cursor:
                    cursor.execute("SELECT COUNT(*) FROM hubspot_contacts")
                    total = cursor.fetchone()[0]
                    print("\n=== Basic Database Information ===")
                    print(f"Total Contacts: {total:,}")
                    
                    # Try to get empty field counts
                    cursor.execute("""
                    SELECT 
                        COUNT(CASE WHEN email_standardized IS NULL THEN 1 END) AS empty_email,
                        COUNT(CASE WHEN name_standardized IS NULL THEN 1 END) AS empty_name,
                        COUNT(CASE WHEN phone_standardized IS NULL THEN 1 END) AS empty_phone
                    FROM hubspot_contacts
                    """)
                    empty = cursor.fetchone()
                    if empty:
                        print(f"Empty Email: {empty[0]:,} contacts")
                        print(f"Empty Name: {empty[1]:,} contacts")
                        print(f"Empty Phone: {empty[2]:,} contacts")
            except Exception:
                print("Could not retrieve basic database information.")
                
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        print(f"\nError: {str(e)}")
        print("Check the log file for more details.")
    finally:
        # Ensure proper database cleanup
        if 'db_manager' in locals():
            db_manager.close()

if __name__ == "__main__":
    # Check for special commands
    if len(sys.argv) > 1:
        if '--db-stats' in sys.argv:
            try:
                print("\n=== Database Statistics ===")
                db_manager = DatabaseManager(pool_size=5)
                analyzer = HubSpotContactAnalyzer("", db_manager)
                analyzer.get_direct_database_stats()
            except Exception as e:
                print(f"Error: {str(e)}")
            finally:
                if 'db_manager' in locals():
                    db_manager.close()
        elif '--empty-contacts' in sys.argv:
            try:
                db_manager = DatabaseManager(pool_size=5)
                analyzer = HubSpotContactAnalyzer("", db_manager)
                
                # Parse output format
                format_arg = next((arg for arg in sys.argv if arg.startswith('--format=')), None)
                output_format = format_arg.split('=')[1] if format_arg else 'both'
                
                # Parse max records
                max_arg = next((arg for arg in sys.argv if arg.startswith('--max=')), None)
                max_records = int(max_arg.split('=')[1]) if max_arg else 1000000
                
                analyzer.get_empty_field_contacts(output_format, max_records)
            except Exception as e:
                print(f"Error: {str(e)}")
            finally:
                if 'db_manager' in locals():
                    db_manager.close()
        else:
            main()
    else:
        main()