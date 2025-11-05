from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, sum as _sum, lit, when, lag
from pyspark.sql.window import Window

# Initialiser la session Spark
spark = SparkSession.builder.appName("OlympicDataAnalysis").getOrCreate()

# Charger les jeux de données
athlete_dataset = spark.read.json('../olympic_athletes.json')
athlete_dataset.show()
print((athlete_dataset.count(), len(athlete_dataset.columns)))
athlete_dataset.select([count(when(col(c).isNull(), c)).alias(c) for c in athlete_dataset.columns]).show()

hosts_dataset = spark.read.format('xml').options(rowTag='row').load('../olympic_hosts.xml')
hosts_dataset = hosts_dataset.drop('index')
hosts_dataset.show()
print((hosts_dataset.count(), len(hosts_dataset.columns)))
hosts_dataset.select([count(when(col(c).isNull(), c)).alias(c) for c in hosts_dataset.columns]).show()

medals_dataset = spark.read.format('excel').option('header', 'true').load('../olympic_medals.xlsx')
print((medals_dataset.count(), len(medals_dataset.columns)))
medals_dataset.select([count(when(col(c).isNull(), c)).alias(c) for c in medals_dataset.columns]).show()
medals_dataset = medals_dataset.withColumnRenamed('slug_game', 'game_slug')
medals_dataset = medals_dataset.dropDuplicates()
medals_dataset = medals_dataset.drop('Unnamed: 0', 'participant_title', 'athlete_url')

results_dataset = spark.read.format('html').option('inferSchema', 'true').load('../olympic_results.html')
results_dataset.show()
print((results_dataset.count(), len(results_dataset.columns)))
results_dataset.select([count(when(col(c).isNull(), c)).alias(c) for c in results_dataset.columns]).show()
results_dataset = results_dataset.withColumnRenamed('slug_game', 'game_slug').drop('Unnamed: 0', 'athlete_url')

# Séparer les jeux d'été et d'hiver
game_types = hosts_dataset.select('game_slug', 'game_season', 'game_year')
merged_hosts_results = results_dataset.join(game_types, on='game_slug')
merged_hosts_results.show()
print((merged_hosts_results.count(), len(merged_hosts_results.columns)))

summer_results = merged_hosts_results.filter(col('game_season') == 'Summer').drop('game_season')
summer_results.show()
print((summer_results.count(), len(summer_results.columns)))
summer_results.select([count(when(col(c).isNull(), c)).alias(c) for c in summer_results.columns]).show()

# Calculer le nombre total de médailles par type pour chaque pays
summer_results = summer_results.withColumn('medal_type',
                                           when(col('medal_type').isNull(), 'None').otherwise(col('medal_type')))
summer_results = summer_results.withColumn('total_medals', when(col('medal_type') == 'None', 0).otherwise(1))
summer_results = summer_results.withColumn('gold_medals', when(col('medal_type') == 'GOLD', 1).otherwise(0))
summer_results = summer_results.withColumn('silver_medals', when(col('medal_type') == 'SILVER', 1).otherwise(0))
summer_results = summer_results.withColumn('bronze_medals', when(col('medal_type') == 'BRONZE', 1).otherwise(0))

medals_by_country = summer_results.groupBy('game_year', 'country_name').agg(
    _sum('total_medals').alias('total_medals'),
    _sum('gold_medals').alias('gold_medals'),
    _sum('silver_medals').alias('silver_medals'),
    _sum('bronze_medals').alias('bronze_medals')
).orderBy('game_year', 'total_medals', ascending=[True, False])

# Calculer le nombre total de disciplines pour chaque pays
sports_by_country = summer_results.groupBy('game_year', 'country_name', 'discipline_title').count().select(
    'game_year', 'country_name', col('discipline_title').alias('sports')).groupBy('game_year', 'country_name').agg(
    count('sports').alias('sports'))

events_by_country = summer_results.groupBy('game_year', 'country_name', 'event_title').count().select(
    'game_year', 'country_name', col('event_title').alias('events')).groupBy('game_year', 'country_name').agg(
    count('events').alias('events'))

olympic_data = medals_by_country.join(sports_by_country, on=['game_year', 'country_name']).join(events_by_country,
                                                                                                on=['game_year',
                                                                                                    'country_name']).orderBy(
    'game_year', 'total_medals', ascending=[True, False])

# Participations aux jeux par pays
games_participation = summer_results.groupBy('country_name', 'game_year').agg(
    _sum('total_medals').alias('total_medals'),
    _sum('gold_medals').alias('gold_medals'),
    _sum('silver_medals').alias('silver_medals'),
    _sum('bronze_medals').alias('bronze_medals')
).orderBy('country_name', 'game_year')

windowSpec = Window.partitionBy('country_name').orderBy('game_year')
games_participation = games_participation.withColumn('previous_game_medal', lag('total_medals', 1, 0).over(windowSpec))
games_participation = games_participation.withColumn('previous_game_gold', lag('gold_medals', 1, 0).over(windowSpec))
games_participation = games_participation.withColumn('previous_game_silver',
                                                     lag('silver_medals', 1, 0).over(windowSpec))
games_participation = games_participation.withColumn('previous_game_bronze',
                                                     lag('bronze_medals', 1, 0).over(windowSpec))

games_participation_france = games_participation.filter(col('country_name') == 'France')
country_list = [c['country_name'] for c in games_participation.select('country_name').distinct().collect() if
                c['country_name'] != 'France']

for country in country_list:
    temp_games_participation = games_participation.filter(col('country_name') == country)
    games_participation_france = games_participation_france.union(temp_games_participation)

games_participation_france = games_participation_france.select(
    'game_year', 'country_name', 'game_part', 'previous_game_medal', 'previous_game_gold', 'previous_game_silver',
    'previous_game_bronze')

olympic_data = olympic_data.join(games_participation_france, on=['game_year', 'country_name']).orderBy('game_year',
                                                                                                       'total_medals',
                                                                                                       ascending=[True,
                                                                                                                  False])

olympic_data.show()
