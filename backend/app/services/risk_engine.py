import joblib
import pandas as pd
import numpy as np
import shap
import json
import os

# 1. Load Artifak (Resolve paths relative to this file)
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "models"))

model_path = os.path.join(MODELS_DIR, 'credit_risk_model_20260802_1218_DEPLOY.pkl')
preprocessor_path = os.path.join(MODELS_DIR, 'trained_preprocessor_20260802_1218_DEPLOY.joblib')

model = joblib.load(model_path)
preprocessor = joblib.load(preprocessor_path)

# Inisialisasi SHAP
base_xgb = model.calibrated_classifiers_[0].estimator
explainer = shap.TreeExplainer(base_xgb)

# Kamus Penjelasan Rationale (Approved Cases - Positive Signals)
rationale_descriptions_approved = {
    'person_home_ownership_OWN': "Owning your home shows you have a stable place to live and good financial health, which makes you a safer borrower.",
    'person_home_ownership_MORTGAGE': "Having a mortgage shows you have passed credit screening with a major lender, which is a positive sign.",
    'person_income': "Your income is high enough to comfortably pay back the loan without causing you financial stress.",
    'loan_int_rate': "The low interest rate on your loan shows that you are seen as a trustworthy person who is likely to pay on time.",
    'loan_percent_income': "The amount you want to borrow is only a small part of what you earn, so it should be easy for you to manage payments.",
    'person_emp_length': "Having a steady job for a long time shows that you have a reliable source of money to pay back the loan.",
    'cb_person_default_on_file_Y': "No history of default shows you have a strong record of paying back debts on time.",
    'income_loan_ratio': "Your total income compared to the loan amount looks good, which means the loan size fits your budget well.",
    'cb_person_cred_hist_length': "A long credit history demonstrates a proven track record of managing credit responsibly over time.",
    'age_emp_ratio': "A solid ratio of employment length to age shows career stability and reliable earnings.",
    'cred_hist_age_ratio': "A long credit history relative to age indicates early and consistent financial maturity.",
    'is_high_risk_intent': "The loan purpose is considered low risk, adding safety to your application."
}

# Kamus Penjelasan Rationale (Rejected Cases - Warning Signals)
rationale_descriptions_rejected = {
    'person_home_ownership_OWN': "Not owning your home may indicate lower asset reserves to back the loan in case of financial distress.",
    'person_home_ownership_RENT': "Renting your home is associated with higher residential mobility and higher statistical default risk.",
    'person_home_ownership_OTHER': "Having housing ownership status classified as 'Other' represents a higher risk profile for underwriters.",
    'person_home_ownership_MORTGAGE': "Your existing mortgage payment obligations increase your overall monthly debt burden.",
    'person_income': "Your stated annual income is too low to comfortably support the repayments for this loan size.",
    'loan_int_rate': "The high interest rate on this loan significantly increases the monthly payment burden and risk of default.",
    'loan_percent_income': "The requested loan amount is too large relative to your annual income, leading to an unsafe debt ratio.",
    'person_emp_length': "Your employment duration is short, which suggests potential instability in your source of income.",
    'cb_person_default_on_file_Y': "Your record shows past payment defaults, which indicates a high risk of repeating late payments.",
    'income_loan_ratio': "Your income compared to the requested loan amount is low, making the loan size exceed a safe budget.",
    'cb_person_cred_hist_length': "Your credit history is too short, which provides insufficient historical data to assess creditworthiness.",
    'age_emp_ratio': "Your employment history is short relative to your age, which may indicate career transitions or income instability.",
    'cred_hist_age_ratio': "Your credit history is short relative to your age, indicating a late start in building credit.",
    'is_high_risk_intent': "The purpose of this loan (e.g., Debt Consolidation or Medical) carries a higher statistical likelihood of default."
}

def predict_credit_risk_with_shap(raw_input_dict):
    df_input = pd.DataFrame([raw_input_dict])

    # Feature Engineering
    if 'loan_percent_income' not in df_input.columns:
        df_input['loan_percent_income'] = df_input['loan_amnt'] / df_input['person_income']
    df_input['age_emp_ratio'] = df_input['person_emp_length'] / df_input['person_age']
    df_input['income_loan_ratio'] = df_input['person_income'] / df_input['loan_amnt']
    df_input['cred_hist_age_ratio'] = df_input['cb_person_cred_hist_length'] / df_input['person_age']
    high_risk_intents = ['DEBTCONSOLIDATION', 'MEDICAL']
    df_input['is_high_risk_intent'] = df_input['loan_intent'].apply(lambda x: 1 if x in high_risk_intents else 0)

    # Transformasi
    X_processed_array = preprocessor.transform(df_input)
    training_feature_order = ['person_age', 'person_income', 'person_emp_length', 'loan_amnt', 'loan_int_rate', 'loan_percent_income', 'cb_person_cred_hist_length', 'age_emp_ratio', 'income_loan_ratio', 'cred_hist_age_ratio', 'is_high_risk_intent', 'person_home_ownership_OTHER', 'person_home_ownership_OWN', 'person_home_ownership_RENT', 'loan_intent_EDUCATION', 'loan_intent_HOMEIMPROVEMENT', 'loan_intent_MEDICAL', 'loan_intent_PERSONAL', 'loan_intent_VENTURE', 'loan_grade_B', 'loan_grade_C', 'loan_grade_D', 'loan_grade_E', 'loan_grade_F', 'loan_grade_G', 'cb_person_default_on_file_Y']

    X_processed = pd.DataFrame(X_processed_array, columns=preprocessor.get_feature_names_out())
    X_processed.columns = [col.split('__')[-1] for col in X_processed.columns]
    X_final = X_processed[training_feature_order].astype(float)

    # Prediksi
    prob = model.predict_proba(X_final)[:, 1][0]
    decision = "Rejected" if prob >= 0.18 else "Approved"

    # SHAP Rationale
    shap_values = explainer.shap_values(X_final)
    feature_importance = pd.Series(shap_values[0], index=training_feature_order)

    if decision == "Rejected":
        top_features = feature_importance.sort_values(ascending=False).head(3).index.tolist()
        descriptions_dict = rationale_descriptions_rejected
    else:
        top_features = feature_importance.sort_values(ascending=True).head(3).index.tolist()
        descriptions_dict = rationale_descriptions_approved

    # Membuat list rationale dengan penjelasan
    rationale_with_desc = []
    for feat in top_features:
        # Check if the feature name matches a one-hot encoded suffix
        desc_key = feat
        # If it doesn't match directly, check base prefixes for categories
        if desc_key not in descriptions_dict:
            for prefix in ['person_home_ownership_', 'loan_intent_', 'loan_grade_', 'cb_person_default_on_file_']:
                if feat.startswith(prefix):
                    desc_key = feat  # Key is specific one-hot feature (like person_home_ownership_RENT)
                    break
        
        desc = descriptions_dict.get(desc_key, f"The factor '{feat}' was important in making this decision based on your profile.")
        rationale_with_desc.append({"feature": feat, "explanation": desc})

    return {
        "risk_probability": round(float(prob), 4),
        "decision": decision,
        "rationale": rationale_with_desc
    }