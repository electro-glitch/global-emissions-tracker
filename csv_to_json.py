import csv
import json
import os

# Directory where your CSV files are stored
csv_directory = "C:/Users/victus/climate-data-clone"

# List of your CSV files
csv_files = [
    "table1.csv", "table2.csv", "table3.csv",
    "table4.csv", "table5.csv", "table6.csv",
    "table7_ch4.csv", "table7_co2.csv", "table7_f-gas.csv", "table7_n2o.csv"
]

# Convert each CSV file to JSON
for csv_file in csv_files:
    json_data = []
    csv_path = os.path.join(csv_directory, csv_file)
    
    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            json_data.append(row)

    # Save JSON file
    json_path = csv_path.replace(".csv", ".json")
    with open(json_path, "w", encoding="utf-8") as json_file:
        json.dump(json_data, json_file, indent=4)

    print(f"Converted {csv_file} to JSON.")
