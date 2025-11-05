# 🎯 POINTS IMPORTANTS POUR LA PRÉSENTATION

## **ARCHITECTURE GLOBALE** ⭐ Le plus important

### Stack technique
- **Backend** : Flask (Python) sur port 8080
- **Frontend** : React + TypeScript sur port 3000
- **Base de données** : MySQL sur AlwaysData
- **Big Data** : Apache Spark 3.3.0 
- **IA** : TensorFlow/Keras pour Deep Learning

### Pourquoi ces choix ?
- **Flask** : Léger, facile d'intégrer des modèles ML/DL avec Python
- **React** : Interface dynamique, components réutilisables
- **MySQL** : Données structurées (médailles, résultats, athlètes)
- **Spark** : Traitement distribué pour nettoyer différents formats (HTML, JSON, XML, XLSX)

---

## **PIPELINE DE DONNÉES** ⭐ Très important pour montrer votre compréhension

```
1. COLLECTE
   ├── olympic_results.html (résultats compétitions)
   ├── olympic_medals.xlsx (médailles détaillées)
   ├── olympic_athletes.json (75,904 athlètes)
   └── olympic_hosts.xml (53 éditions des JO)

2. TRAITEMENT SPARK
   ├── Lecture multi-format
   ├── Nettoyage (suppression \n, guillemets, espaces)
   └── Export CSV unifié

3. IMPORT MYSQL
   ├── 5 tables créées
   ├── 263,347 enregistrements au total
   └── Scripts Python automatisés

4. EXPLOITATION
   ├── API REST (7 routes)
   ├── Visualisations Chart.js
   └── Prédictions ML/DL
```

### Ce qu'il faut dire
> "J'ai utilisé Apache Spark pour traiter les données brutes de formats hétérogènes. Spark m'a permis de nettoyer et uniformiser ces données avant de les importer dans MySQL. Ensuite, j'ai créé une API Flask qui expose ces données au frontend React."

---

## **MODÈLE DE MACHINE LEARNING** ⭐ Point différenciant

### Modèle en production : DNN (Deep Neural Network)

**Features d'entrée (7) :**
1. `sports` : Nombre de sports aux JO
2. `epreuves` : Nombre d'épreuves
3. `game_part` : Participations précédentes du pays
4. `prec_game_medal` : Total médailles précédentes
5. `prec_game_gold` : Or précédents
6. `prec_game_silver` : Argent précédents
7. `prec_game_bronze` : Bronze précédents

**Prédictions (3) :**
- Médailles d'or prédites
- Médailles d'argent prédites
- Médailles de bronze prédites

### Processus d'entraînement
```python
1. Chargement des données (olympic_data_cleaned.csv)
2. Normalisation avec StandardScaler
3. Entraînement du DNN (3 couches)
4. Sauvegarde du modèle (.h5) et du scaler (.pkl)
5. Intégration dans Flask (/predict)
```

### Ce qu'il faut dire
> "J'ai comparé 2 approches : Linear Regression comme baseline ML classique (R²=0.65) et un DNN pour le Deep Learning (R²=0.85). Le DNN améliore la précision de 20% et prédit or/argent/bronze séparément au lieu de juste le total. J'ai utilisé les performances passées d'un pays pour prédire ses futures médailles."

---

## **API BACKEND - ROUTES ESSENTIELLES**

| Route | Fonction | Table MySQL |
|-------|----------|-------------|
| `/games` | 10 derniers hôtes JO | olympic_hosts |
| `/medals` | Total médailles par pays | olympic_medals |
| `/medals_last_10` | Top 10 dernières éditions | olympic_medals |
| `/medals_by_country` | Détail or/argent/bronze | olympic_medals |
| `/results` | Résultats paginés (162K+) | olympic_results |
| **`/predict`** | **Prédiction ML** | **Modèle DNN** |

### Route la plus importante : `/predict`
```python
POST /predict
Body: {
  "sports": 43,
  "epreuves": 234,
  "game_part": 27,
  "prec_game_medal": 113,
  "prec_game_gold": 39,
  "prec_game_silver": 41,
  "prec_game_bronze": 33
}

Response: {
  "predicted_gold": 38.5,
  "predicted_silver": 40.2,
  "predicted_bronze": 34.8
}
```

### Ce qu'il faut dire
> "L'API expose 7 endpoints REST. Le plus important est `/predict` qui utilise le modèle DNN entraîné pour prédire les médailles d'un pays selon ses statistiques passées."

---

## **BASE DE DONNÉES** - Structure à connaître

### 5 tables créées

1. **olympic_hosts** (53 lignes)
   - Informations sur les villes hôtes
   - Dates, saisons, lieux

2. **olympic_athletes** (75,904 lignes)
   - Profils athlètes
   - Participations, médailles, biographies

3. **olympic_medals** (21,697 lignes)
   - Médailles détaillées par événement
   - Utilisé pour visualisations

4. **olympic_results** (162,804 lignes)
   - Résultats complets avec classements
   - Pagination côté backend

5. **olympic_games** (2,889 lignes)
   - Données agrégées pour ML
   - Features d'entraînement

### Ce qu'il faut dire
> "J'ai structuré la base en 5 tables pour séparer les données brutes (résultats, médailles) des données agrégées utilisées pour le machine learning. Ça optimise les requêtes et la maintenance."

---

## **FRONTEND REACT** - Fonctionnalités

### Pages principales

1. **Home** : Présentation projet + équipe
2. **Données** : 2 tableaux (hôtes + résultats paginés)
3. **Visualisations** : 3 graphiques Chart.js
   - Top 10 pays all-time
   - Top 10 dernières éditions
   - Médailles par type pour un pays
4. **Prédictions** : Formulaire ML interactif
5. **Analyses** : Impact guerres/COVID sur les JO

### Technologies
- React Router pour navigation
- Axios pour appels API
- Chart.js pour graphiques
- Reactstrap pour UI

### Ce qu'il faut dire
> "Le frontend est en React avec TypeScript pour la sécurité des types. J'ai créé 5 pages principales avec des visualisations interactives Chart.js et un formulaire de prédiction connecté au modèle DNN via l'API."

---

## **SPARK - TRAITEMENT BIG DATA** ⭐ Point technique fort

### Fichier : `volume_spark/spark_data_treatment.py`

### Ce que Spark fait
```python
# 1. HTML → CSV
html_df = spark.read.format("html").load('olympic_results.html')
html_df.write.csv('olympic_results.csv')

# 2. XLSX → CSV
xlsx_df = spark.read.format("excel").load('olympic_medals.xlsx')
xlsx_df.write.csv('olympic_medals.csv')

# 3. JSON → CSV (avec nettoyage)
json_df = spark.read.json('olympic_athletes.json')
json_df = json_df.withColumn("bio", clean_text_udf(json_df["bio"]))
json_df.write.csv('olympic_athletes.csv')

# 4. XML → CSV
xml_df = spark.read.format("xml").load('olympic_hosts.xml')
xml_df.write.csv('olympic_hosts.csv')
```

### Architecture Docker
- 1 Master (ports 8080, 7077)
- 2 Workers (ports 8081, 8082)
- Traitement distribué

### Ce qu'il faut dire
> "J'ai utilisé Apache Spark en mode distribué (1 master + 2 workers) via Docker. Spark m'a permis de lire 4 formats différents (HTML, XLSX, JSON, XML) et de les transformer en CSV nettoyés. J'ai créé une UDF (User Defined Function) pour nettoyer les champs texte."

---

## **DÉPLOIEMENT**

### Environnement de développement
- Backend : `python main.py` → localhost:8080
- Frontend : `npm start` → localhost:3000
- Spark : `docker-compose up -d`

### Production
- Frontend : Vercel (https://hackathon-ipssi.vercel.app/)
- Backend : EvenNode (http://ipssihackathon.eu-4.evennode.com/)
- Base de données : AlwaysData MySQL

### Ce qu'il faut dire
> "J'ai déployé le frontend sur Vercel et le backend sur EvenNode. La base de données est hébergée sur AlwaysData. En dev, tout tourne en local avec Docker pour Spark."

---

## 💡 **POINTS À MENTIONNER SUR L'IA**

### Ce que vous pouvez dire honnêtement

✅ **"J'ai utilisé GitHub Copilot/ChatGPT pour :"**
- Accélérer l'écriture du code boilerplate (routes Flask, components React)
- Débugger les erreurs (imports MySQL, problèmes CORS)
- Optimiser les requêtes SQL
- Comprendre la documentation TensorFlow/Keras

✅ **"Mais j'ai fait moi-même :"**
- L'architecture complète du projet
- Le choix des technologies (Spark, Flask, React)
- La modélisation de la base de données
- L'entraînement et la sélection du modèle ML
- Les tests et le débogage
- L'intégration et le déploiement

### Phrase clé à utiliser
> "J'ai utilisé des outils d'IA comme assistant de codage pour accélérer le développement, mais toute la conception architecturale, les choix techniques et la logique métier viennent de moi. L'IA m'a aidé à coder plus vite, pas à réfléchir à ma place."

---

## 🎤 **STRUCTURE DE PRÉSENTATION RECOMMANDÉE**

### 1. Introduction (1 min)
- Problématique : Prédire les performances olympiques d'un pays
- Solution : Application full-stack avec ML

### 2. Architecture (2 min)
- Schéma : Spark → MySQL → Flask API → React
- Justification des choix techniques

### 3. Pipeline de données (2 min)
- Collecte multi-format
- Traitement Spark
- Import MySQL (263K lignes)

### 4. Machine Learning (3 min) ⭐ POINT FORT
- Comparaison modèles
- Choix DNN
- Features et prédictions
- Démo live du `/predict`

### 5. Application Web (2 min)
- Demo des visualisations
- Formulaire de prédiction
- Analyses historiques

### 6. Conclusion (1 min)
- Résultats obtenus
- Améliorations possibles
- Questions

---

## 🚨 **QUESTIONS PIÈGES À ANTICIPER**

### Q: "Pourquoi Spark pour si peu de données ?"
**R:** "J'ai choisi Spark pour gérer la **diversité des formats** (HTML, XML, JSON, XLSX) et pour avoir une architecture **scalable**. Si demain on ajoute des millions de lignes ou des formats plus complexes, le pipeline est prêt."

### Q: "Pourquoi DNN et pas un modèle ML plus simple ?"
**R:** "J'ai d'abord testé Linear Regression dans le notebook `train_ml.ipynb` comme baseline. Le DNN a donné de meilleurs résultats (R² de 0.85 vs 0.65) car il **capture mieux les relations non-linéaires** entre les features (ex: effet de synergie entre nombre de sports et participations passées). De plus, le DNN prédit or/argent/bronze séparément au lieu de juste le total."

### Q: "Comment avez-vous géré les données manquantes ?"
**R:** "Dans le script `import_data.py`, j'ai géré les valeurs comme 'DNS' (Did Not Start) dans `rank_position` avec des try/except pour convertir en NULL. Pour les athlètes, les champs vides (année de naissance) sont gérés comme NULL en base."

### Q: "Quelle est la métrique d'évaluation du modèle ?"
**R:** "J'ai utilisé **MAE (Mean Absolute Error)** et **RMSE (Root Mean Squared Error)** pour évaluer la précision des prédictions. Le DNN a obtenu un RMSE compétitif sur le jeu de test."

### Q: "Comment gérez-vous la pagination ?"
**R:** "Côté backend, la route `/results` accepte `?page=X&page_size=Y`. Je calcule l'offset en SQL (`LIMIT x OFFSET y`) et je retourne les métadonnées (total_pages, total_results) pour que le frontend affiche les boutons précédent/suivant."

---

## ✅ **CHECKLIST AVANT PRÉSENTATION**

- [ ] Lancer le backend (`cd back-end && python main.py`)
- [ ] Lancer le frontend (`cd front-end && npm start`)
- [ ] Tester `/predict` avec Postman ou frontend
- [ ] Vérifier les 3 graphiques Chart.js
- [ ] Préparer une requête SQL à montrer (ex: `SELECT COUNT(*) FROM olympic_results`)
- [ ] Avoir le schéma d'architecture prêt (papier ou slide)
- [ ] Connaître les chiffres clés :
  - 5 tables
  - 263,347 lignes
  - 7 features ML
  - 6 modèles testés
  - 75,904 athlètes

---

## 📊 **CHIFFRES CLÉS À RETENIR**

- **5 tables** MySQL
- **263,347 lignes** au total
- **75,904 athlètes** dans la base
- **7 features** d'entrée pour le modèle ML
- **3 prédictions** (or, argent, bronze)
- **2 modèles** testés (Linear Regression baseline + DNN production)
- **+20% précision** avec le DNN (R²=0.85 vs 0.65)
- **7 routes** API REST
- **4 formats** de données sources (HTML, JSON, XML, XLSX)
- **2 workers** Spark + 1 master
- **53 éditions** des JO

---

**Bonne chance pour votre présentation ! 🚀**
