"""
Script pour importer les données CSV dans la base de données MySQL AlwaysData
Base de données : marwan-ipssi_predict-jo2024
"""

import mysql.connector
import pandas as pd
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration de la connexion
config = {
    'host': os.getenv('MYSQL_HOST'),
    'user': os.getenv('MYSQL_USER'),
    'password': os.getenv('MYSQL_PASSWORD'),
    'database': os.getenv('MYSQL_DB')
}

def connect_to_database():
    """Établir la connexion à la base de données"""
    try:
        conn = mysql.connector.connect(**config)
        print(f"✅ Connecté à la base de données: {config['database']}")
        return conn
    except mysql.connector.Error as err:
        print(f"❌ Erreur de connexion: {err}")
        return None

def import_olympic_games(conn):
    """Importer les données dans la table olympic_games"""
    print("\n📊 Import de olympic_games...")
    
    # Lire le CSV
    csv_path = '../csv/olympic_data_cleaned.csv'
    df = pd.read_csv(csv_path)
    
    cursor = conn.cursor()
    
    # Vider la table d'abord
    cursor.execute("TRUNCATE TABLE olympic_games")
    
    # Préparer la requête d'insertion
    insert_query = """
        INSERT INTO olympic_games 
        (game_year, country_name, total_medals, gold_medals, silver_medals, 
         bronze_medals, sports, epreuves, game_part, prec_game_medal, 
         prec_game_gold, prec_game_silver, prec_game_bronze)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    # Insérer les données
    count = 0
    for _, row in df.iterrows():
        values = (
            int(row['game_year']),
            str(row['country_name']),
            int(row['total_medals']),
            int(row['gold_medals']),
            int(row['silver_medals']),
            int(row['bronze_medals']),
            int(row['sports']),
            int(row['epreuves']),
            int(row['game_part']),
            int(row['prec_game_medal']),
            int(row['prec_game_gold']),
            int(row['prec_game_silver']),
            int(row['prec_game_bronze'])
        )
        cursor.execute(insert_query, values)
        count += 1
    
    conn.commit()
    cursor.close()
    print(f"✅ {count} lignes importées dans olympic_games")

def import_olympic_medals(conn):
    """Importer les données dans la table olympic_medals"""
    print("\n🏅 Import de olympic_medals...")
    
    # Lire le CSV
    csv_path = '../csv/olympic_medals.csv'
    df = pd.read_csv(csv_path)
    
    cursor = conn.cursor()
    
    # Vider la table d'abord
    cursor.execute("TRUNCATE TABLE olympic_medals")
    
    # Préparer la requête d'insertion
    insert_query = """
        INSERT INTO olympic_medals 
        (discipline_title, slug_game, event_title, event_gender, medal_type,
         participant_type, participant_title, athlete_url, athlete_full_name,
         country_name, country_code, country_3_letter_code)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    # Insérer les données par batch pour plus de performance
    batch_size = 1000
    count = 0
    
    for i in range(0, len(df), batch_size):
        batch = df.iloc[i:i+batch_size]
        values_list = []
        
        for _, row in batch.iterrows():
            values = (
                str(row['discipline_title']) if pd.notna(row['discipline_title']) else '',
                str(row['slug_game']) if pd.notna(row['slug_game']) else '',
                str(row['event_title']) if pd.notna(row['event_title']) else '',
                str(row['event_gender']) if pd.notna(row['event_gender']) else '',
                str(row['medal_type']) if pd.notna(row['medal_type']) else '',
                str(row['participant_type']) if pd.notna(row['participant_type']) else '',
                str(row['participant_title']) if pd.notna(row['participant_title']) else '',
                str(row['athlete_url']) if pd.notna(row['athlete_url']) else '',
                str(row['athlete_full_name']) if pd.notna(row['athlete_full_name']) else '',
                str(row['country_name']) if pd.notna(row['country_name']) else '',
                str(row['country_code']) if pd.notna(row['country_code']) else '',
                str(row['country_3_letter_code']) if pd.notna(row['country_3_letter_code']) else ''
            )
            values_list.append(values)
        
        cursor.executemany(insert_query, values_list)
        count += len(values_list)
        print(f"  Progression: {count} lignes...", end='\r')
    
    conn.commit()
    cursor.close()
    print(f"\n✅ {count} lignes importées dans olympic_medals")

def import_olympic_results(conn):
    """Importer les données dans la table olympic_results"""
    print("\n🎯 Import de olympic_results...")
    
    # Lire le CSV
    csv_path = '../csv/olympic_results.csv'
    df = pd.read_csv(csv_path)
    
    cursor = conn.cursor()
    
    # Vider la table d'abord
    cursor.execute("TRUNCATE TABLE olympic_results")
    
    # Préparer la requête d'insertion
    insert_query = """
        INSERT INTO olympic_results 
        (discipline_title, event_title, slug_game, participant_type, medal_type,
         athletes, rank_equal, rank_position, country_name, country_code,
         country_3_letter_code, athlete_url, athlete_full_name, value_unit, value_type)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    # Insérer les données par batch
    batch_size = 1000
    count = 0
    
    for i in range(0, len(df), batch_size):
        batch = df.iloc[i:i+batch_size]
        values_list = []
        
        for _, row in batch.iterrows():
            # Gérer rank_position qui peut contenir des valeurs non numériques comme 'DNS'
            try:
                rank_pos = int(row['rank_position']) if pd.notna(row['rank_position']) else 0
            except (ValueError, TypeError):
                rank_pos = 0
            
            values = (
                str(row['discipline_title']) if pd.notna(row['discipline_title']) else '',
                str(row['event_title']) if pd.notna(row['event_title']) else '',
                str(row['slug_game']) if pd.notna(row['slug_game']) else '',
                str(row['participant_type']) if pd.notna(row['participant_type']) else '',
                str(row['medal_type']) if pd.notna(row['medal_type']) else '',
                str(row['athletes']) if pd.notna(row['athletes']) else '',
                bool(row['rank_equal']) if pd.notna(row['rank_equal']) else False,
                rank_pos,
                str(row['country_name']) if pd.notna(row['country_name']) else '',
                str(row['country_code']) if pd.notna(row['country_code']) else '',
                str(row['country_3_letter_code']) if pd.notna(row['country_3_letter_code']) else '',
                str(row['athlete_url']) if pd.notna(row['athlete_url']) else '',
                str(row['athlete_full_name']) if pd.notna(row['athlete_full_name']) else '',
                str(row['value_unit']) if pd.notna(row['value_unit']) else '',
                str(row['value_type']) if pd.notna(row['value_type']) else ''
            )
            values_list.append(values)
        
        cursor.executemany(insert_query, values_list)
        count += len(values_list)
        print(f"  Progression: {count} lignes...", end='\r')
    
    conn.commit()
    cursor.close()
    print(f"\n✅ {count} lignes importées dans olympic_results")

def main():
    """Fonction principale"""
    print("=" * 60)
    print("🚀 Import des données CSV vers MySQL AlwaysData")
    print("=" * 60)
    
    # Connexion à la base de données
    conn = connect_to_database()
    if not conn:
        print("❌ Impossible de se connecter à la base de données")
        return
    
    try:
        # Import des données
        import_olympic_games(conn)
        import_olympic_medals(conn)
        import_olympic_results(conn)
        
        print("\n" + "=" * 60)
        print("✅ Import terminé avec succès!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Erreur lors de l'import: {e}")
        conn.rollback()
    
    finally:
        conn.close()
        print("\n🔒 Connexion fermée")

if __name__ == "__main__":
    main()
