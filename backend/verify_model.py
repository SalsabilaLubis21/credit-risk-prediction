import os
import sys

# Add backend directory to sys.path to allow running directly
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, CURRENT_DIR)

from app.services.risk_engine import predict_credit_risk_with_shap

test_input = {
    "person_age": 30,
    "person_income": 60000,
    "person_emp_length": 5.0,
    "person_home_ownership": "RENT",
    "cb_person_cred_hist_length": 3,
    "cb_person_default_on_file": "N",
    "loan_amnt": 10000,
    "loan_int_rate": 8.5,
    "loan_intent": "PERSONAL",
    "loan_grade": "B"
}

print("Running credit risk model verification...")
try:
    res = predict_credit_risk_with_shap(test_input)
    print("SUCCESS: Prediction runs successfully!")
    print("Risk Probability:", res["risk_probability"])
    print("Decision:", res["decision"])
    print("Rationale factors:")
    for idx, rat in enumerate(res["rationale"]):
        print(f"  {idx+1}. Feature: {rat['feature']} | Expl: {rat['explanation']}")
except Exception as e:
    import traceback
    print("ERROR: Verification failed!")
    traceback.print_exc()
