# 📊 ANALYSE COMPLÈTE DU PROJET HACKATHON OLYMPICS

## 🎯 VUE D'ENSEMBLE DU PROJET

**Nom du projet** : Hackathon IPSSI - Application de prédiction et visualisation des Jeux Olympiques  
**Équipe** : Marwan GHRAIRI & Khalil JAOUANI  
**Objectif** : Créer une plateforme web full-stack permettant de visualiser les données historiques des JO et de prédire les médailles futures grâce au Machine Learning et Deep Learning.

---

## 🏗️ ARCHITECTURE GLOBALE

### Stack Technique

#### Backend (Python/Flask)
- **Framework** : Flask 2.0.2 avec Flask-CORS
- **Base de données** : MySQL 5.7 (AlwaysData)
- **IA/ML** : TensorFlow 2.20.0, Keras 3.12.0, scikit-learn 1.3.2
- **Port** : 8080

#### Frontend (React/TypeScript)
- **Framework** : React 18.3.1 avec TypeScript 4.9.5
- **UI** : Reactstrap 8.9.0, Bootstrap 4.6.0
- **Graphiques** : Chart.js 3.9.1, react-chartjs-2 4.0.0
- **Routing** : React Router DOM 6.23.1
- **Port** : 3000

#### Big Data
- **Apache Spark 3.3.0** avec Hadoop 3.3 (Docker)
- 1 Master + 2 Workers
- Traitement de données multi-formats (HTML, JSON, XML, XLSX)

---

## 💾 ARCHITECTURE BASE DE DONNÉES

### Tables MySQL (5 au total)

#### 1. olympic_games (2,889 enregistrements)
```sql
- game_year, country_name
- total_medals, gold_medals, silver_medals, bronze_medals
- sports, epreuves, game_part
- prec_game_medal, prec_game_gold, prec_game_silver, prec_game_bronze
```
**Utilisation** : Données agrégées pour l'entraînement des modèles de prédiction ML/DL

#### 2. olympic_medals (21,697 enregistrements)
```sql
- discipline_title, slug_game, event_title, event_gender
- medal_type, participant_type, participant_title
- athlete_url, athlete_full_name
- country_name, country_code, country_3_letter_code
```
**Utilisation** : Médailles détaillées par événement et athlète, utilisé pour les visualisations

#### 3. olympic_results (162,804 enregistrements)
```sql
- discipline_title, event_title, slug_game
- medal_type, participant_type, athletes
- rank_equal, rank_position
- country_name, country_code, country_3_letter_code
- athlete_url, athlete_full_name
- value_unit, value_type
```
**Utilisation** : Résultats complets avec classements, affichage paginé dans le frontend

#### 4. olympic_hosts (53 enregistrements)
```sql
- index, game_slug, game_year
- game_start_date, game_end_date
- game_location, game_name, game_season
```
**Utilisation** : Informations sur les villes hôtes, dates et saisons des JO

#### 5. olympic_athletes (75,904 enregistrements)
```sql
- athlete_url, athlete_full_name
- games_participations, first_game
- athlete_year_birth, athlete_medals, bio
```
**Utilisation** : Profils détaillés des athlètes olympiques

---

## 🔄 FLUX DE DONNÉES

### Pipeline de traitement des données

```
1. DONNÉES BRUTES (formats multiples)
   ├── olympic_results.html
   ├── olympic_medals.xlsx  
   ├── olympic_athletes.json
   └── olympic_hosts.xml

2. TRAITEMENT SPARK (volume_spark/spark_data_treatment.py)
   ├── Chargement multi-format
   ├── Nettoyage (suppression \n, guillemets, etc.)
   ├── Transformation
   └── Export CSV unifié

3. FICHIERS CSV NETTOYÉS (csv/)
   ├── olympic_data_cleaned.csv (pour ML)
   ├── olympic_medals.csv
   ├── olympic_results.csv
   ├── olympic_hosts.csv
   └── olympic_athletes.csv

4. IMPORT MYSQL (scripts Python)
   ├── import_data.py (games, medals, results)
   ├── import_olympic_hosts.py
   └── import_olympic_athletes.py

5. BASE DE DONNÉES MySQL AlwaysData
   └── 5 tables opérationnelles (263,347 lignes totales)
```

---

## 🤖 MACHINE LEARNING / DEEP LEARNING

### Modèles testés
Le projet compare **2 approches** pour prédire les médailles :

**Machine Learning classique** (`machinelearning/train_ml.ipynb`) :
1. **Linear Regression** : Régression linéaire simple (baseline, R²=0.65)

**Deep Learning** (`deeplearning/train_deepl.ipynb`) :
1. **DNN** (Dense Neural Network) - **MODÈLE EN PRODUCTION** ✅ (R²=0.85)

### Modèle en production : DNN
- **Fichier** : `back-end/ai/olympic_medals_dnn.h5`
- **Scaler** : `back-end/ai/olympic_medals_scaler.pkl` (StandardScaler)
- **Features d'entrée** (7) :
  - `sports` : Nombre de sports
  - `epreuves` : Nombre d'épreuves
  - `game_part` : Participations précédentes aux JO
  - `prec_game_medal` : Médailles totales précédentes
  - `prec_game_gold` : Or précédents
  - `prec_game_silver` : Argent précédents
  - `prec_game_bronze` : Bronze précédents

- **Prédictions** (3) :
  - Médailles d'or prédites
  - Médailles d'argent prédites
  - Médailles de bronze prédites

---

## 🌐 API BACKEND - ROUTES

### Endpoint : `/games`
- **Méthode** : GET
- **Fonction** : Récupère les 10 derniers hôtes des JO
- **Table** : `olympic_hosts`
- **SQL** : `SELECT * FROM olympic_hosts ORDER BY game_year DESC LIMIT 10`
- **Frontend** : Utilisé dans `pages/data.tsx` (tableau des hôtes)

### Endpoint : `/medals`
- **Méthode** : GET
- **Fonction** : Total médailles par pays (tous les temps)
- **Table** : `olympic_medals`
- **SQL** : `SELECT country_name, COUNT(*) FROM olympic_medals GROUP BY country_name ORDER BY total_medals DESC`
- **Frontend** : `visualisations/medals1.tsx` (top 10 historique)

### Endpoint : `/medals_last_10`
- **Méthode** : GET
- **Fonction** : Médailles par pays (10 dernières éditions)
- **Table** : `olympic_medals`
- **Logique** : 
  1. Sous-requête pour identifier les 10 derniers `slug_game`
  2. Comptage médailles filtrées sur ces éditions
- **Frontend** : `visualisations/medals2.tsx`

### Endpoint : `/countries`
- **Méthode** : GET
- **Fonction** : Liste unique des pays participants
- **Table** : `olympic_medals`
- **SQL** : `SELECT DISTINCT country_name FROM olympic_medals`
- **Frontend** : Sélecteur dans `medals3.tsx`

### Endpoint : `/medals_by_country`
- **Méthode** : GET
- **Paramètre** : `?country=NomDuPays`
- **Fonction** : Détail médailles (or/argent/bronze) par pays
- **Table** : `olympic_medals`
- **SQL** : Utilise `SUM(CASE WHEN...)` pour comptage par type
- **Frontend** : `visualisations/medals3.tsx` (graphique par pays)

### Endpoint : `/results`
- **Méthode** : GET
- **Paramètres** : `?page=1&page_size=10`
- **Fonction** : Résultats paginés des compétitions
- **Table** : `olympic_results`
- **Pagination** : 
  - Total résultats : 162,804
  - Par défaut : 10 résultats/page
  - Retourne : `page`, `page_size`, `total_results`, `total_pages`, `results`
- **Frontend** : `pages/data.tsx` (tableau des résultats)

### Endpoint : `/predict` ⭐
- **Méthode** : POST
- **Body JSON** :
```json
{
  "sports": 43,
  "epreuves": 234,
  "game_part": 27,
  "prec_game_medal": 113,
  "prec_game_gold": 39,
  "prec_game_silver": 41,
  "prec_game_bronze": 33
}
```
- **Traitement** :
  1. Extraction des features
  2. Transformation avec `scaler.transform()`
  3. Prédiction avec `model.predict()`
  4. Conversion en types Python standards
- **Réponse** :
```json
{
  "predicted_gold": 38.5,
  "predicted_silver": 40.2,
  "predicted_bronze": 34.8
}
```
- **Frontend** : `components/prediction/prediction.tsx`

---

## 🎨 FRONTEND - PAGES ET COMPOSANTS

### Routing (App.tsx)
```typescript
/ → Home (Accueil + présentation équipe)
/data → DataPage (Tableaux de données)
/medalVizualisation → MedalVisualization (3 graphiques)
/prediction → PredictionPage (Interface ML)
/analyses → AnalysisPage (Analyses historiques)
```

### Pages principales

#### 1. Home (`components/home.tsx`)
- Composite : `ProjectPage` + `TeamPage`
- Présentation du projet et de l'équipe

#### 2. DataPage (`pages/data.tsx`)
- **Tableau 1** : "Les 10 derniers hôtes des JO"
  - Source : `/games`
  - Colonnes : Date début/fin, Localisation, Nom, Saison, Année
  - Formatage : `new Date().toLocaleDateString()`
  
- **Tableau 2** : "Résultats des Jeux Olympiques"
  - Source : `/results?page=X&page_size=10`
  - Pagination : Boutons précédent/suivant
  - 162,804 résultats totaux

#### 3. MedalVisualization (`pages/medalsvisualization.tsx`)
- **3 graphiques Chart.js** :
  1. `medals1.tsx` : Top 10 pays (tous les temps)
  2. `medals2.tsx` : Top 10 pays (10 dernières éditions)
  3. `medals3.tsx` : Médailles par type pour un pays sélectionné

#### 4. PredictionPage (`components/prediction/prediction.tsx`)
- **Formulaire de prédiction ML** :
  - 7 champs numériques (sports, épreuves, participations, médailles précédentes)
  - Valeurs par défaut pré-remplies
  - Bouton "Prédire"
- **Affichage résultats** :
  - Médailles d'or/argent/bronze prédites
  - Arrondissement avec `Math.trunc()`
- **Gestion erreurs** : Affichage message d'erreur si échec

#### 5. AnalysisPage (`components/analysis/analysis.tsx`)
- **Analyse historique** : Impact événements mondiaux sur les JO
- **Événements marqués** :
  - 1916 : Annulé (Première Guerre mondiale)
  - 1940 : Annulé (Seconde Guerre mondiale)
  - 1944 : Annulé (Seconde Guerre mondiale)
  - 2020 : Reporté 2021 (COVID-19)
- **Tableau interactif** : Bouton Afficher/Cacher détails
- **Données** : Fusion `/games` + années annulées

### Navigation (`components/navbar.tsx`)
- **Fixed top navbar** avec scroll effect
- **Sections** :
  - Données
  - Visualisations (dropdown)
  - Analyses
  - Prédictions
- **Responsive** : Collapse pour mobile

---

## 🔧 CONFIGURATION ET ENVIRONNEMENT

### Backend (.env)
```properties
MYSQL_HOST=mysql-marwan-ipssi.alwaysdata.net
MYSQL_USER=438951
MYSQL_PASSWORD=Hfhnmfz2003?
MYSQL_DB=marwan-ipssi_predict-jo2024
PORT=8080
```

### Frontend (config.ts)
```typescript
export const API_BASE_URL = 'http://localhost:8080'
```
**Utilisation** : Importé dans tous les composants faisant des appels API

---

## 📦 SCRIPTS D'IMPORTATION

### import_data.py (Tables principales)
1. **olympic_games** : 2,889 lignes de `olympic_data_cleaned.csv`
2. **olympic_medals** : 21,697 lignes de `olympic_medals.csv`
3. **olympic_results** : 162,804 lignes de `olympic_results.csv`
   - Gestion erreurs : `rank_position` peut être 'DNS' → convertir en NULL

### import_olympic_hosts.py
- 53 hôtes olympiques de `olympic_hosts.csv`
- Champs dates en format ISO 8601

### import_olympic_athletes.py
- 75,904 athlètes de `olympic_athletes.csv`
- Batch insertion par 1000 lignes
- Gestion valeurs vides (games_participations, athlete_year_birth)

---

## 🐳 DOCKER SPARK (docker-compose.yml)

### Architecture
- **spark-master** : 
  - Ports : 8080 (UI), 7077 (cluster)
  - Volume : `./volume_spark:/volume_spark`
  
- **spark-worker-1** : Port 8081
- **spark-worker-2** : Port 8082

### Traitement Spark (spark_data_treatment.py)
```python
HTML → CSV  : olympic_results.html → olympic_results.csv
XLSX → CSV  : olympic_medals.xlsx → olympic_medals.csv
JSON → CSV  : olympic_athletes.json → olympic_athletes.csv (nettoyage texte)
XML  → CSV  : olympic_hosts.xml → olympic_hosts.csv
```

---

## 🚀 DÉMARRAGE DU PROJET

### Backend
```bash
cd back-end
pip install -r requirements.txt
python main.py
# → http://localhost:8080
```

### Frontend
```bash
cd front-end
npm install
npm start
# → http://localhost:3000
```

### Spark (optionnel)
```bash
docker-compose up -d
# Master UI → http://localhost:8080
# Worker 1 → http://localhost:8081
# Worker 2 → http://localhost:8082
```

---

## 📊 FLUX DE TRAVAIL COMPLET

```
1. COLLECTE DONNÉES
   └── Sources multiples (HTML, JSON, XML, XLSX)

2. TRAITEMENT BIG DATA
   └── Apache Spark → Nettoyage → CSV uniformisés

3. STOCKAGE BASE DE DONNÉES
   └── Scripts Python → Import MySQL (5 tables, 263,347 lignes)

4. ENTRAÎNEMENT MODÈLES
   ├── Notebooks Jupyter (ML + DL)
   ├── Sélection meilleur modèle (DNN)
   └── Export .h5 + scaler.pkl

5. API BACKEND
   ├── Routes REST (Flask)
   ├── Connexion MySQL
   └── Endpoint /predict avec DNN

6. INTERFACE FRONTEND
   ├── Visualisations Chart.js
   ├── Tableaux de données paginés
   ├── Formulaire prédiction ML
   └── Analyses historiques

7. DÉPLOIEMENT
   ├── Frontend : Vercel (https://hackathon-ipssi.vercel.app/)
   └── Backend : EvenNode (http://ipssihackathon.eu-4.evennode.com/)
```

---

## 🎯 FONCTIONNALITÉS PRINCIPALES

✅ **Visualisation de données** : 3 graphiques interactifs  
✅ **Prédiction ML** : Estimation médailles futures avec DNN  
✅ **Données historiques** : 263,347 enregistrements olympiques  
✅ **Analyses** : Impact guerres mondiales et COVID sur les JO  
✅ **Big Data** : Traitement multi-format avec Spark  
✅ **Pagination** : Navigation efficace dans 162K+ résultats  
✅ **Responsive** : Interface adaptée mobile/desktop  

---

## 🔍 POINTS TECHNIQUES CLÉS

### Gestion des données manquantes
- CSV : `rank_position` peut être 'DNS' → try/except conversion int
- Athletes : `athlete_year_birth` peut être vide → NULL en DB

### Performance
- Batch insertion 1000 lignes (athletes, results)
- Index MySQL sur colonnes de recherche (country_name, slug_game, etc.)
- Pagination backend pour résultats volumineux

### Sécurité
- Variables d'environnement (.env)
- CORS configuré (`origins='*'` pour dev)
- Pas de credentials dans le code

### Scalabilité
- Spark distribué (1 master + 2 workers)
- Architecture REST stateless
- Frontend build optimisé (React production)

---

## 👥 ÉQUIPE

**Développeurs** : Marwan GHRAIRI & Khalil JAOUANI  
**Établissement** : IPSSI  
**Date** : 2025

---

## 📝 RÉSUMÉ STATISTIQUES

- **Total lignes DB** : 263,347
- **Tables** : 5
- **Routes API** : 7
- **Modèles ML/DL** : 6 (1 en production)
- **Formats traités** : 4 (HTML, JSON, XML, XLSX)
- **Pages frontend** : 5
- **Graphiques** : 3
- **Technos utilisées** : 15+

---

**Projet réalisé dans le cadre du Hackathon IPSSI 2025**
