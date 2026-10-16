
# 1. Import the required libraries
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 2. Load the dataset
data = pd.read_csv("dataset/Crop_recommendation.csv")

# 3. Separate inputs (features) and answers (target)
X = data.drop("label", axis=1)
y = data["label"]

# 4. Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# 5. Create the Random Forest model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# 6. Train the model
model.fit(X_train, y_train)

# 7. Predict crops for the test data
y_pred = model.predict(X_test)

# 8. Evaluate the model
accuracy = accuracy_score(y_test, y_pred)

print("\n--- Model Evaluation ---")
print(f"Accuracy: {accuracy:.4f} ({accuracy * 100:.2f}%)")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# 9. Save the trained model
joblib.dump(model, "models/crop_model.pkl")

print("\nModel saved to models/crop_model.pkl")
