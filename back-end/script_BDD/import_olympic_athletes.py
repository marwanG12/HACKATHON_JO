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

def import_olympic_athletes():
    """Import Olympic athletes data from CSV to MySQL"""
    print("Connecting to database...")
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    
    csv_file = '../csv/olympic_athletes.csv'
    
    print(f"Importing data from {csv_file}...")
    
    # Read CSV and import data
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        
        # Prepare batch insert
        insert_query = """
        INSERT INTO olympic_athletes 
        (athlete_url, athlete_full_name, games_participations, first_game, 
         athlete_year_birth, athlete_medals, bio)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        data_to_insert = []
        count = 0
        
        for row in csv_reader:
            # Handle empty values
            games_participations = int(row['games_participations']) if row['games_participations'] else None
            athlete_year_birth = float(row['athlete_year_birth']) if row['athlete_year_birth'] else None
            
            data_to_insert.append((
                row['athlete_url'],
                row['athlete_full_name'],
                games_participations,
                row['first_game'],
                athlete_year_birth,
                row['athlete_medals'],
                row['bio']
            ))
            
            count += 1
            
            # Batch insert every 1000 rows
            if len(data_to_insert) >= 1000:
                cursor.executemany(insert_query, data_to_insert)
                conn.commit()
                print(f"  Imported {count} rows...")
                data_to_insert = []
        
        # Insert remaining rows
        if data_to_insert:
            cursor.executemany(insert_query, data_to_insert)
            conn.commit()
        
        print(f"✓ Successfully imported {count} athlete records")
    
    cursor.close()
    conn.close()
    print("Database connection closed")

if __name__ == "__main__":
    import_olympic_athletes()
