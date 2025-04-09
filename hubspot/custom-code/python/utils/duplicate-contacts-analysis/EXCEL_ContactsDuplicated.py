import os
import time
import json
import pandas as pd
import numpy as np
import requests
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import logging
from tqdm import tqdm
import hashlib


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("hubspot_contacts_analysis.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class HubSpotContactAnalyzer:

    def __init__(self, api_key: str):

        self.api_key = api_key
        self.base_url = "https://api.hubspot.com"
        self.graphql_url = "https://api.hubspot.com/collector/graphql"
        self.all_contacts = []
        self.contacts_df = None
        self.duplicates = []
    
    def _make_graphql_request(self, query: str) -> Dict:

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
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"GraphQL request failed: {e}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response text: {e.response.text}")
            raise

    def get_all_contacts(self, batch_size: int = 100) -> List[Dict]:

        logger.info("Starting contact retrieval from HubSpot via GraphQL")
        self.all_contacts = []
        max_records = 10000
        
        query = f"""
        query {{
        CRM {{
            contact_collection(limit: {batch_size}) {{
            items {{
                hs_object_id
                email
                firstname
                lastname
                phone
                createdate
            }}
            total
            }}
        }}
        }}
        """
        
        try:
            response = self._make_graphql_request(query)
            
            if "errors" in response:
                logger.error(f"GraphQL errors: {response['errors']}")
                raise Exception(f"GraphQL errors: {response['errors']}")
            
            contact_data = response.get("data", {}).get("CRM", {}).get("contact_collection", {})
            contacts = contact_data.get("items", [])
            

            total_contacts = contact_data.get("total", 0)
            if total_contacts > max_records:
                logger.warning(f"Total contacts ({total_contacts}) exceeds GraphQL API limit of {max_records}. Will use REST API instead.")
                return []  
            

            self.all_contacts.extend(contacts)
            

            with tqdm(desc="Retrieving contacts", unit="contacts", initial=len(contacts), total=total_contacts) as pbar:
                offset = batch_size  
                has_more = len(contacts) == batch_size  
                

                while has_more and len(self.all_contacts) < max_records:
                    next_query = f"""
                    query {{
                    CRM {{
                        contact_collection(limit: {batch_size}, offset: {offset}) {{
                        items {{
                            hs_object_id
                            email
                            firstname
                            lastname
                            phone
                            createdate
                        }}
                        }}
                    }}
                    }}
                    """
                    
                    time.sleep(0.2)
                    
                    response = self._make_graphql_request(next_query)
                    
                    if "errors" in response:
                        error_messages = [error.get('message', '') for error in response.get('errors', [])]

                        if any('10,000 records' in msg for msg in error_messages):
                            logger.warning("Reached HubSpot GraphQL API limit of 10,000 records")
                            self.all_contacts = []
                            return self.all_contacts
                        
                        logger.error(f"GraphQL errors: {response['errors']}")
                        raise Exception(f"GraphQL errors: {response['errors']}")
                    
                    contact_data = response.get("data", {}).get("CRM", {}).get("contact_collection", {})
                    contacts = contact_data.get("items", [])
                    current_count = len(contacts)
                    

                    self.all_contacts.extend(contacts)
                    

                    pbar.update(current_count)
                    

                    has_more = current_count == batch_size
                    
                    offset += batch_size
                    
                    if current_count == 0:
                        break
                    
                    if len(self.all_contacts) + batch_size > max_records:
                        logger.warning(f"Approaching GraphQL API limit of {max_records} records. Will switch to REST API.")
                        self.all_contacts = []
                        return self.all_contacts
            
            logger.info(f"Successfully retrieved {len(self.all_contacts)} contacts via GraphQL")
            return self.all_contacts
            
        except Exception as e:
            logger.error(f"Error retrieving contacts: {str(e)}")
            self.all_contacts = []
            raise
    
    def get_all_contacts_rest(self, batch_size: int = 100) -> List[Dict]:

        logger.info("Starting contact retrieval from HubSpot via REST API")
        self.all_contacts = []
        
        endpoint = "crm/v3/objects/contacts"
        properties = ["hs_object_id", "email", "firstname", "lastname", "phone", "createdate"]
        
        try:
            url = f"{self.base_url}/{endpoint}"
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            params = {
                "limit": batch_size,
                "properties": properties,
                "archived": False
            }
            
            has_more = True
            after_token = None
            

            with tqdm(desc="Retrieving contacts", unit="contacts") as pbar:
                while has_more:
                    if after_token:
                        params["after"] = after_token
                    
                    response = requests.get(url, headers=headers, params=params)
                    response.raise_for_status()
                    data = response.json()
                    
                    contacts = data.get("results", [])
                    
                    processed_contacts = []
                    for contact in contacts:
                        properties = contact.get("properties", {})
                        processed_contact = {
                            "hs_object_id": contact.get("id"),
                            "email": properties.get("email"),
                            "firstname": properties.get("firstname"),
                            "lastname": properties.get("lastname"),
                            "phone": properties.get("phone"),
                            "createdate": properties.get("createdate")
                        }
                        processed_contacts.append(processed_contact)
                    
                    self.all_contacts.extend(processed_contacts)
                    pbar.update(len(contacts))
                    
                    if "paging" in data and "next" in data["paging"]:
                        after_token = data["paging"]["next"]["after"]
                    else:
                        has_more = False
                    
                    time.sleep(0.1)
            
            logger.info(f"Successfully retrieved {len(self.all_contacts)} contacts")
            return self.all_contacts
            
        except Exception as e:
            logger.error(f"Error retrieving contacts: {str(e)}")
            raise
    
    def _standardize_phone(self, phone: Optional[str]) -> Optional[str]:

        if not phone or pd.isna(phone) or phone == "":
            return None
        
        digits = ''.join(char for char in str(phone) if char.isdigit())

        if not digits:
            return None
            
        return digits
    
    def _standardize_name(self, first: Optional[str], last: Optional[str]) -> Optional[str]:

        first = "" if first is None or pd.isna(first) else str(first).strip().lower()
        last = "" if last is None or pd.isna(last) else str(last).strip().lower()
        
        full_name = f"{first} {last}".strip()
        
        if not full_name:
            return None
            
        return full_name
    
    def _standardize_email(self, email: Optional[str]) -> Optional[str]:

        if not email or pd.isna(email) or email == "":
            return None
            
        return str(email).strip().lower()
    
    def prepare_data(self) -> pd.DataFrame:

        logger.info("Preparing contact data for analysis")
        
        if not self.all_contacts:
            logger.warning("No contacts to prepare. Call get_all_contacts() first.")
            return pd.DataFrame()
        
        contacts_data = []
        for contact in self.all_contacts:
            contact_data = {
                "id": contact.get("hs_object_id", ""),
                "email_original": contact.get("email", None),
                "firstname_original": contact.get("firstname", None),
                "lastname_original": contact.get("lastname", None),
                "phone_original": contact.get("phone", None),
                "createdate": contact.get("createdate", None),
                "raw_data": json.dumps(contact)
            }
            contacts_data.append(contact_data)
        
        df = pd.DataFrame(contacts_data)
        
        df["email"] = df["email_original"].apply(self._standardize_email)
        df["name"] = df.apply(lambda x: self._standardize_name(x["firstname_original"], x["lastname_original"]), axis=1)
        df["phone"] = df["phone_original"].apply(self._standardize_phone)
        
        df["email_hash"] = df["email"].apply(lambda x: hashlib.md5(str(x).encode()).hexdigest() if x else None)
        df["name_hash"] = df["name"].apply(lambda x: hashlib.md5(str(x).encode()).hexdigest() if x else None)
        df["phone_hash"] = df["phone"].apply(lambda x: hashlib.md5(str(x).encode()).hexdigest() if x else None)
        
        self.contacts_df = df
        
        logger.info("Data preparation complete")
        return df
    
    def find_duplicates(self) -> Tuple[pd.DataFrame, Dict]:
        logger.info("Finding duplicate contacts")
        
        if self.contacts_df is None:
            logger.warning("No DataFrame to analyze. Call prepare_data() first.")
            return pd.DataFrame(), {}
        
        all_duplicates = []
        stats = {"email": 0, "name": 0, "phone": 0}
        

        email_dups = self.contacts_df[self.contacts_df["email"].notna()]
        email_dups = email_dups[email_dups.duplicated(subset=["email_hash"], keep=False)]
        email_groups = email_dups.groupby("email_hash")
        
        for email_hash, group in email_groups:
            duplicate_records = []
            for _, row in group.iterrows():
                duplicate_records.append({
                    "id": row["id"],
                    "email": row["email_original"],
                    "name": f"{row['firstname_original'] or ''} {row['lastname_original'] or ''}".strip(),
                    "phone": row["phone_original"],
                    "createdate": row["createdate"],
                    "raw_data": row["raw_data"],
                    "duplicate_type": "email"
                })
            all_duplicates.append(duplicate_records)
            stats["email"] += 1
        
        name_dups = self.contacts_df[self.contacts_df["name"].notna()]
        name_dups = name_dups[name_dups.duplicated(subset=["name_hash"], keep=False)]
        name_groups = name_dups.groupby("name_hash")
        
        for name_hash, group in name_groups:
            if any(group["email_hash"].duplicated(keep=False).tolist()):
                continue
                
            duplicate_records = []
            for _, row in group.iterrows():
                duplicate_records.append({
                    "id": row["id"],
                    "email": row["email_original"],
                    "name": f"{row['firstname_original'] or ''} {row['lastname_original'] or ''}".strip(),
                    "phone": row["phone_original"],
                    "createdate": row["createdate"],
                    "raw_data": row["raw_data"],
                    "duplicate_type": "name"
                })
            all_duplicates.append(duplicate_records)
            stats["name"] += 1
        
        phone_dups = self.contacts_df[self.contacts_df["phone"].notna()]
        phone_dups = phone_dups[phone_dups.duplicated(subset=["phone_hash"], keep=False)]
        phone_groups = phone_dups.groupby("phone_hash")
        
        for phone_hash, group in phone_groups:
            if any(group["email_hash"].duplicated(keep=False).tolist()) or any(group["name_hash"].duplicated(keep=False).tolist()):
                continue
                
            duplicate_records = []
            for _, row in group.iterrows():
                duplicate_records.append({
                    "id": row["id"],
                    "email": row["email_original"],
                    "name": f"{row['firstname_original'] or ''} {row['lastname_original'] or ''}".strip(),
                    "phone": row["phone_original"],
                    "createdate": row["createdate"],
                    "raw_data": row["raw_data"],
                    "duplicate_type": "phone"
                })
            all_duplicates.append(duplicate_records)
            stats["phone"] += 1
        
        for field, field_hash in [("email", "email_hash"), ("name", "name_hash"), ("phone", "phone_hash")]:
            empty_field = self.contacts_df[self.contacts_df[field].isna()]
            if len(empty_field) > 1:  
                duplicate_records = []
                for _, row in empty_field.iterrows():
                    duplicate_records.append({
                        "id": row["id"],
                        "email": row["email_original"],
                        "name": f"{row['firstname_original'] or ''} {row['lastname_original'] or ''}".strip(),
                        "phone": row["phone_original"],
                        "createdate": row["createdate"],
                        "raw_data": row["raw_data"],
                        "duplicate_type": f"empty_{field}"
                    })
                all_duplicates.append(duplicate_records)
                stats[field] += 1
        
        flat_duplicates = []
        for i, group in enumerate(all_duplicates):
            for record in group:
                record["group_id"] = i
                flat_duplicates.append(record)
        
        duplicates_df = pd.DataFrame(flat_duplicates) if flat_duplicates else pd.DataFrame()
        
        logger.info(f"Found duplicate contacts: {len(all_duplicates)} groups, {len(flat_duplicates)} records")
        logger.info(f"Duplicate stats: {stats}")
        
        return duplicates_df, stats
    
    def export_duplicates(self, output_file: str = "hubspot_duplicate_contacts.csv") -> str:

        logger.info(f"Exporting duplicates to {output_file}")
        
        duplicates_df, stats = self.find_duplicates()
        
        empty_stats = {}
        if self.contacts_df is not None:
            empty_stats = {
                "empty_email": int(self.contacts_df["email"].isna().sum()),
                "empty_name": int(self.contacts_df["name"].isna().sum()),
                "empty_phone": int(self.contacts_df["phone"].isna().sum())
            }
        
        output_dir = os.path.dirname(output_file)
        if output_dir and not os.path.exists(output_dir):
            try:
                os.makedirs(output_dir)
            except Exception as e:
                logger.warning(f"Could not create directory {output_dir}: {str(e)}")
        
        if len(duplicates_df) == 0:
            logger.info("No duplicates found to export")
            return output_file
        
        try:
            duplicates_df.to_csv(output_file, index=False, encoding='utf-8-sig')
            logger.info(f"Successfully exported {len(duplicates_df)} records to {output_file}")
        except Exception as e:
            logger.error(f"Failed to export to CSV: {str(e)}")
            return output_file
        
        summary = {
            "total_contacts": int(len(self.contacts_df)) if self.contacts_df is not None else 0,
            "duplicate_groups": int(stats.get("total_groups", duplicates_df["group_id"].nunique() if not duplicates_df.empty else 0)),
            "duplicate_records": int(len(duplicates_df)),
            "duplicate_stats": {
                "email": int(stats.get("email", 0)),
                "name": int(stats.get("name", 0)), 
                "phone": int(stats.get("phone", 0))
            },
            "empty_stats": empty_stats,
            "analysis_timestamp": datetime.now().isoformat()
        }
        
        summary_file = output_file.replace(".csv", "_summary.json")
        try:
            with open(summary_file, 'w') as f:
                json.dump(summary, f, indent=2)
            logger.info(f"Summary file generated: {summary_file}")
        except Exception as e:
            logger.error(f"Failed to create summary file: {str(e)}")
        
        logger.info(f"Export complete. Files: {output_file}, {summary_file}")
        return output_file
        
    def generate_analytics(self, duplicates_df: pd.DataFrame, dup_stats: Dict, output_file: str = "hubspot_contacts_analytics.json") -> str:

        logger.info(f"Generating analytics to {output_file}")
        

        def convert_to_native_type(obj):
            if isinstance(obj, (np.integer, np.int64, np.int32)):
                return int(obj)
            elif isinstance(obj, (np.float64, np.float32)):
                return float(obj)
            elif isinstance(obj, np.bool_):
                return bool(obj)
            elif isinstance(obj, (np.ndarray, list)):
                return [convert_to_native_type(x) for x in obj]
            elif isinstance(obj, dict):
                return {key: convert_to_native_type(value) for key, value in obj.items()}
            else:
                return obj
        
        total_contacts = len(self.contacts_df) if self.contacts_df is not None else 0
        
        duplicates_count = len(duplicates_df) if not duplicates_df.empty else 0
        duplicate_groups = duplicates_df["group_id"].nunique() if not duplicates_df.empty else 0
        
        email_dupes = len(duplicates_df[duplicates_df["duplicate_type"] == "email"]) if not duplicates_df.empty else 0
        name_dupes = len(duplicates_df[duplicates_df["duplicate_type"] == "name"]) if not duplicates_df.empty else 0
        phone_dupes = len(duplicates_df[duplicates_df["duplicate_type"] == "phone"]) if not duplicates_df.empty else 0
        
        empty_email_dupes = len(duplicates_df[duplicates_df["duplicate_type"] == "empty_email"]) if not duplicates_df.empty else 0
        empty_name_dupes = len(duplicates_df[duplicates_df["duplicate_type"] == "empty_name"]) if not duplicates_df.empty else 0
        empty_phone_dupes = len(duplicates_df[duplicates_df["duplicate_type"] == "empty_phone"]) if not duplicates_df.empty else 0
        
        pct_with_duplicates = (duplicates_count / total_contacts * 100) if total_contacts > 0 else 0
        
        if self.contacts_df is not None:
            email_present = int(self.contacts_df["email"].notna().sum())
            name_present = int(self.contacts_df["name"].notna().sum())
            phone_present = int(self.contacts_df["phone"].notna().sum())
            
            pct_with_email = (email_present / total_contacts * 100) if total_contacts > 0 else 0
            pct_with_name = (name_present / total_contacts * 100) if total_contacts > 0 else 0
            pct_with_phone = (phone_present / total_contacts * 100) if total_contacts > 0 else 0
        else:
            email_present = name_present = phone_present = 0
            pct_with_email = pct_with_name = pct_with_phone = 0
        
        age_distribution = {}
        if self.contacts_df is not None and "createdate" in self.contacts_df.columns:
            try:
                self.contacts_df["createdate_dt"] = pd.to_datetime(self.contacts_df["createdate"], errors="coerce")
                
                year_counts = self.contacts_df.groupby(self.contacts_df["createdate_dt"].dt.year).size().to_dict()
                age_distribution["by_year"] = {str(k): int(v) for k, v in year_counts.items() if not pd.isna(k)}
                
                current_year = datetime.now().year
                current_year_contacts = self.contacts_df[self.contacts_df["createdate_dt"].dt.year == current_year]
                if not current_year_contacts.empty:
                    month_counts = current_year_contacts.groupby(current_year_contacts["createdate_dt"].dt.month).size().to_dict()
                    age_distribution["current_year_by_month"] = {str(k): int(v) for k, v in month_counts.items()}
            except Exception as e:
                logger.warning(f"Could not calculate age distribution: {str(e)}")
                age_distribution = {"error": str(e)}
        
        top_groups = []
        if not duplicates_df.empty:
            group_sizes = duplicates_df.groupby("group_id").size().sort_values(ascending=False).head(10)
            for group_id, size in group_sizes.items():
                group_data = duplicates_df[duplicates_df["group_id"] == group_id]
                first_record = group_data.iloc[0]
                duplicate_type = first_record["duplicate_type"]
                
                top_groups.append({
                    "group_id": int(group_id),
                    "count": int(size),
                    "type": duplicate_type,
                    "example": {
                        "email": first_record["email"] if not pd.isna(first_record["email"]) else None,
                        "name": first_record["name"] if not pd.isna(first_record["name"]) else None,
                        "phone": first_record["phone"] if not pd.isna(first_record["phone"]) else None
                    }
                })
        
        analytics = {
            "summary": {
                "total_contacts": int(total_contacts),
                "duplicated_contacts": int(duplicates_count),
                "duplicate_groups": int(duplicate_groups),
                "percentage_duplicated": float(round(pct_with_duplicates, 2))
            },
            "duplicate_counts": {
                "by_type": {
                    "email": int(email_dupes),
                    "name": int(name_dupes),
                    "phone": int(phone_dupes),
                    "empty_email": int(empty_email_dupes),
                    "empty_name": int(empty_name_dupes),
                    "empty_phone": int(empty_phone_dupes)
                },
                "by_group_stats": {
                    "min_group_size": int(duplicates_df.groupby("group_id").size().min()) if not duplicates_df.empty else 0,
                    "max_group_size": int(duplicates_df.groupby("group_id").size().max()) if not duplicates_df.empty else 0,
                    "avg_group_size": float(round(duplicates_df.groupby("group_id").size().mean(), 2)) if not duplicates_df.empty else 0
                }
            },
            "data_quality": {
                "field_completeness": {
                    "with_email": int(email_present),
                    "with_name": int(name_present),
                    "with_phone": int(phone_present),
                    "percent_with_email": float(round(pct_with_email, 2)),
                    "percent_with_name": float(round(pct_with_name, 2)),
                    "percent_with_phone": float(round(pct_with_phone, 2))
                },
                "contacts_with_all_fields": int(self.contacts_df[(self.contacts_df["email"].notna()) & 
                                                            (self.contacts_df["name"].notna()) & 
                                                            (self.contacts_df["phone"].notna())].shape[0]) if self.contacts_df is not None else 0
            },
            "age_distribution": age_distribution,
            "top_duplicate_groups": top_groups,
            "analysis_timestamp": datetime.now().isoformat(),
            "hubspot_api_used": "GraphQL" if len(self.all_contacts) > 0 else "None"
        }
        
        analytics = convert_to_native_type(analytics)
        
        try:
            output_dir = os.path.dirname(output_file)
            if output_dir and not os.path.exists(output_dir):
                os.makedirs(output_dir)
                
            with open(output_file, 'w') as f:
                json.dump(analytics, f, indent=2)
            logger.info(f"Analytics generated: {output_file}")
            return output_file
        except Exception as e:
            logger.error(f"Failed to write analytics to {output_file}: {str(e)}")
            raise

def main():
    api_key = "api_key_here"  # Replace with your HubSpot API key
    
    if not api_key:
        api_key = input("Enter your HubSpot API key: ")
    
    try:
        print("\n=== HubSpot Contact Analyzer ===")
        print("This tool will analyze contacts in your HubSpot account to identify duplicates.")
        
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
        output_path = os.path.join(output_dir, f"hubspot_duplicates_{timestamp}.csv")
        
        analyzer = HubSpotContactAnalyzer(api_key)
        
        print("\nRetrieving contacts from HubSpot using GraphQL...")
        try:
            contacts = analyzer.get_all_contacts(batch_size=100)
            
            if len(contacts) == 0:
                print("\nSwitching to REST API for better handling of large contact databases...")
                analyzer.get_all_contacts_rest(batch_size=100)
            
        except Exception as e:
            logger.error(f"GraphQL fetch failed: {str(e)}")
            logger.info("Falling back to REST API")
            print("\nGraphQL API failed. Trying REST API instead...")
            
            analyzer.get_all_contacts_rest(batch_size=100)
        
        print(f"\nPreparing data for {len(analyzer.all_contacts)} contacts...")
        analyzer.prepare_data()
        
        print("\nAnalyzing contacts for duplicates...")
        
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
        

        output_path = analyzer.export_duplicates(output_path)
        

        summary_path = output_path.replace(".csv", "_summary.json")
        
        print(f"\n✅ Analysis complete!")
        print(f"📊 Summary saved to: {summary_path}")
        print(f"📋 Duplicate contacts saved to: {output_path}")
        print("\nCheck the log file for detailed information.")
        

        try:
            with open(summary_path, 'r') as f:
                summary = json.load(f)
                
                print("\n=== Quick Summary ===")
                print(f"Total Contacts: {summary['total_contacts']}")
                print(f"Duplicate Records: {summary['duplicate_records']}")
                print(f"Duplicate Groups: {summary['duplicate_groups']}")
                

                if "duplicate_stats" in summary:
                    dup_stats = summary["duplicate_stats"]
                    print("\nDuplicate Types:")
                    print(f"  By Email: {dup_stats.get('email', 0)}")
                    print(f"  By Name: {dup_stats.get('name', 0)}")
                    print(f"  By Phone: {dup_stats.get('phone', 0)}")
                

                if "empty_stats" in summary:
                    empty_stats = summary["empty_stats"]
                    print("\nEmpty Fields:")
                    print(f"  Empty Email: {empty_stats.get('empty_email', 0)} contacts")
                    print(f"  Empty Name: {empty_stats.get('empty_name', 0)} contacts")
                    print(f"  Empty Phone: {empty_stats.get('empty_phone', 0)} contacts")
            
        except Exception as e:
            print(f"\nCould not read summary: {str(e)}")
        
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        print(f"\nError: {str(e)}")
        print("Check the log file for more details.")
if __name__ == "__main__":
    main()