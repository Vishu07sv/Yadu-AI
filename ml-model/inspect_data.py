
import pandas as pd

# 1. Location of our dataset
file_path = "dataset/Crop_recommendation.csv"

# 2. Read the CSV file
data = pd.read_csv(file_path)

# 3. Display the first 5 rows
print("\n--- First 5 Rows ---")
print(data.head())

# 4. Display dataset dimensions
print("\n--- Dataset Size ---")
print("Rows and columns:", data.shape)

# 5. Display column names
print("\n--- Column Names ---")
print(data.columns.tolist())

# 6. Check for missing values
print("\n--- Missing Values ---")
print(data.isnull().sum())

# 7. Display the number of examples for each crop
print("\n--- Crop Distribution ---")
print(data["label"].value_counts())
