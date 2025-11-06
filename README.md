# Hackathon IPSSI - Olympics Predictions

**Équipe** : Marwan GHRAIRI & Khalil JAOUANI

## Notebooks

### Deeplearning
Le notebook de Deep Learning est disponible dans le dossier `./deeplearning/` et s'appelle `train_deepl.ipynb`.

Il contient le code pour l'entraînement de 3 modèles de Deep Learning:
- Un RNN simple
- Un CNN
- Un DNN

En ce qui concerne le modèle ANN, le notebook est également situé dans le même dossier et est nommé 'ann.ipynb'.

### Machine Learning
Le notebook de Machine Learning est disponible dans le dossier `./machinelearning/` et s'appelle `train_ml.ipynb`.

Il contient le code pour l'entraînement du modèle de Linear Regression


### Spark
Le notebook de Spark est disponible dans le dossier `./volume_spark/spark_data_treatment.py`.

## Web App
### Front-end
Le front-end est disponible dans le dossier `./front-end/`.

### Lancer le front-end

```bash
cd front-end
npm install
npm run start
```

Accéder à l'application sur `http://localhost:3000/`.

### Back-end
L'API Flask est disponible dans le dossier `./back-end/` et s'appelle `main.py`.

### Lancer l'API

```bash
cd back-end
pip install -r requirements.txt
python main.py
```

L'API est accessible sur `http://localhost:8080/`.

