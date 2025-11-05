from pyspark.sql import SparkSession

# Initialize Spark Session
spark = SparkSession.builder \
    .appName("Olympic Data Processing") \
    .getOrCreate()

# Load HTML and convert to CSV
html_file_path = '../olympic_results.html'
html_df = spark.read.format("html").option("inferSchema", "true").load(html_file_path)
html_df.write.csv('../csv/olympic_results.csv', header=True, mode='overwrite')

# Load xlsx and convert to CSV
xlsx_file_path = '../olympic_medals.xlsx'
xlsx_df = spark.read.format("com.crealytics.spark.excel") \
    .option("useHeader", "true") \
    .option("treatEmptyValuesAsNulls", "true") \
    .option("inferSchema", "true") \
    .option("addColorColumns", "False") \
    .load(xlsx_file_path)
xlsx_df.write.csv('../csv/olympic_medals.csv', header=True, mode='overwrite')

# Load JSON, clean/preprocess, and convert to CSV
json_file_path = '../olympic_athletes.json'
json_df = spark.read.json(json_file_path)


# Define a function to clean text fields
def clean_text(text):
    if text is not None:
        return text.strip().replace('\n', ' ').replace('"', "'")
    else:
        return ""


# Register the UDF
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType

clean_text_udf = udf(clean_text, StringType())

# Apply cleaning
json_df = json_df.withColumn("athlete_medals", clean_text_udf(json_df["athlete_medals"]))
json_df = json_df.withColumn("bio", clean_text_udf(json_df["bio"]))
json_df.write.csv('../csv/olympic_athletes.csv', header=True, mode='overwrite', quote='')

# Load XML and convert to CSV
xml_file_path = '../olympic_hosts.xml'
xml_df = spark.read.format("xml").option("rowTag", "olympic_host").load(xml_file_path)
xml_df.write.csv('../csv/olympic_hosts.csv', header=True, mode='overwrite')
