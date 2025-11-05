import mysql.connector
import csv
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
db_config = {
    'host': os.getenv('MYSQL_HOST'),
    'user': os.getenv('MYSQL_USER'),
    'password': os.getenv('MYSQL_PASSWORD'),
    'database': os.getenv('MYSQL_DB')
}

def import_olympic_hosts():
    """Import Olympic hosts data from CSV to MySQL"""
    print("Connecting to database...")
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    
    csv_file = '../csv/olympic_hosts.csv'
    
    print(f"Importing data from {csv_file}...")
    
    # Read CSV and import data
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        rows = list(csv_reader)
        
        print(f"Found {len(rows)} rows to import")
        
        # Prepare batch insert
        insert_query = """
        INSERT INTO olympic_hosts 
        (`index`, game_slug, game_end_date, game_start_date, game_location, 
         game_name, game_season, game_year)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        data_to_insert = []
        for row in rows:
            data_to_insert.append((
                int(row['index']),
                row['game_slug'],
                row['game_end_date'],
                row['game_start_date'],
                row['game_location'],
                row['game_name'],
                row['game_season'],
                int(row['game_year'])
            ))
        
        # Execute batch insert
        cursor.executemany(insert_query, data_to_insert)
        conn.commit()
        
        print(f"✓ Successfully imported {len(data_to_insert)} Olympic host records")
    
    cursor.close()
    conn.close()
    print("Database connection closed")

if __name__ == "__main__":
    import_olympic_hosts()
