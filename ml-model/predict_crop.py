
import pandas as pd
import joblib

# 1. Load the trained model
model = joblib.load("models/crop_model.pkl")

# 2. Collect input values from the user
N = float(input("Enter Nitrogen (N): "))
P = float(input("Enter Phosphorus (P): "))
K = float(input("Enter Potassium (K): "))
temperature = float(input("Enter temperature in Celsius: "))
humidity = float(input("Enter humidity percentage: "))
ph = float(input("Enter soil pH: "))
rainfall = float(input("Enter rainfall in mm: "))

# 3. Arrange the inputs in the correct format
input_data = pd.DataFrame([{
    "N": N,
    "P": P,
    "K": K,
    "temperature": temperature,
    "humidity": humidity,
    "ph": ph,
    "rainfall": rainfall
}])

# 4. Predict the crop
prediction = model.predict(input_data)

# 5. Display the result
print("\n--- YADU AI Recommendation ---")
print("Recommended crop:", prediction[0])
