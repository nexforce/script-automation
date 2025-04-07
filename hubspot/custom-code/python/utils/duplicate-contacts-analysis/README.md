# HubSpot Duplicate Contacts Analysis

This repository contains two Python utilities for analyzing and identifying duplicate contacts in HubSpot CRM. These tools help businesses clean their contact database by identifying and managing duplicate records.

## Overview

The repository includes two different implementations for duplicate contact analysis:

1. **EXCEL_ContactsDuplicated.py**: A lightweight implementation that exports duplicate contacts to CSV files. Ideal for smaller contact databases (1 million contacts).
2. **DB_ContatoDuplicado.py**: A more robust implementation that uses a PostgreSQL database for storing and analyzing contacts

Both tools connect to the HubSpot API, retrieve contacts, standardize contact data, and identify duplicates based on email, name, and phone number.

## Features

### Common Features (Both Implementations)

- Connect to HubSpot API (both GraphQL and REST API)
- Retrieve all contacts from HubSpot
- Standardize contact data (email, name, phone)
- Identify duplicates based on:
  - Email address
  - Full name
  - Phone number
- Generate summary statistics about duplicates
- Export duplicate contacts to CSV files

### EXCEL_ContactsDuplicated.py (CSV-based)

- Lightweight implementation using pandas DataFrames
- Stores all data in memory
- Exports results directly to CSV files
- Suitable for smaller contact databases
- Generates JSON summary of duplicate analysis
- Includes analytics on contact data quality

### DB_ContatoDuplicado.py (Database-based)

- Uses PostgreSQL database for storing and analyzing contacts
- Handles large contact databases efficiently
- Implements connection pooling for better performance
- Includes rate limiting for API requests
- Tracks progress for long-running operations
- Provides detailed database statistics
- Supports exporting empty field contacts
- Includes quick summary generation directly from database

## Requirements

- Python 3.6+
- pandas
- numpy
- requests
- tqdm
- psycopg2 (for DB_ContatoDuplicado.py)
- SQLAlchemy (for DB_ContatoDuplicado.py)
- PostgreSQL database (for DB_ContatoDuplicado.py)

## Usage

### EXCEL_ContactsDuplicated.py

```python
# Run the script directly
python EXCEL_ContactsDuplicated.py
```

### DB_ContatoDuplicado.py

```python
# Run the script directly
python DB_ContatoDuplicado.py
```

## Output Files

Both implementations generate:

1. CSV file with duplicate contacts
2. JSON summary file with statistics
3. Log file with detailed execution information

## How Duplicates Are Identified

The tools identify duplicates using the following process:

1. Standardize contact data:
   - Emails: Convert to lowercase, strip whitespace
   - Names: Combine first and last name, convert to lowercase, strip whitespace
   - Phones: Extract only digits

2. Generate hash values for standardized fields

3. Group contacts by hash values to identify duplicates

4. Prioritize duplicates in this order:
   - Email duplicates
   - Name duplicates (excluding those already identified by email)
   - Phone duplicates (excluding those already identified by email or name)
