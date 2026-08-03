# Credit Risk Prediction & Financial Cost Optimization

## Overview

This project presents an end-to-end machine learning solution for **credit default risk prediction** with a strong emphasis on **financial decision optimization**. Rather than focusing solely on predictive accuracy, the system incorporates a cost-sensitive framework that minimizes real-world economic losses by optimizing the loan approval threshold according to business objectives.

The solution combines predictive modeling, financial cost analysis, and explainable AI (XAI) to support transparent and economically informed lending decisions.

---

## Data Source

This project uses the "Credit Risk Dataset" from Kaggle. You can find the dataset here:
[https://www.kaggle.com/datasets/laotse/credit-risk-dataset](https://www.kaggle.com/datasets/laotse/credit-risk-dataset)

---

## Key Features

### Credit Risk Prediction

- Predicts the probability of borrower default using a calibrated XGBoost classifier.
- Produces reliable probability estimates for risk-based decision making.

### Financial Cost Optimization

- Determines the optimal approval threshold based on business costs instead of accuracy alone.
- Minimizes expected financial losses by balancing:
  - **Loss Given Default (LGD)** for risky borrowers.
  - **Opportunity Cost** from rejecting creditworthy applicants.

### Explainable AI (SHAP)

- Generates transparent explanations for every prediction.
- Identifies the key factors influencing approval or rejection decisions.
- Provides human-readable decision rationales for end users.

### Data Quality & Reliability

- Automated handling of missing values and outliers.
- Stratified cross-validation for model stability assessment.
- Probability calibration to improve prediction reliability.

---

## Technology Stack

| Category         | Technology                  |
| ---------------- | --------------------------- |
| **Backend**      |                             |
| Language         | Python                      |
| Web Framework    | FastAPI                     |
| Machine Learning | Scikit-Learn, XGBoost, SHAP |
| Data Processing  | Pandas, NumPy               |
| **Frontend**     |                             |
| Language         | TypeScript                  |
| Framework        | React                       |
| Styling          | Tailwind CSS                |
| Build Tool       | Vite                        |

---

## Setup and Installation

### Backend (Python/FastAPI)

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**

    ```bash
    python -m venv .venv
    ```

3.  **Activate the virtual environment:**
    - **Windows:**
      ```bash
      .venv\Scripts\activate
      ```
    - **macOS/Linux:**
      ```bash
      source .venv/bin/activate
      ```

4.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

5.  **Run the FastAPI server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The server will be running at `http://127.0.0.1:8000`.

### Frontend (React)

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

---

## Project Workflow

```text
Raw Applicant Data
        │
        ▼
Data Cleaning & Preprocessing
        │
        ▼
Feature Engineering
        │
        ▼
XGBoost Training
        │
        ▼
Probability Calibration
        │
        ▼
Cost-Based Threshold Optimization
        │
        ▼
SHAP Explainability Layer
        │
        ▼
Final Loan Decision
```

---

## Model Outputs

The system produces:

- Default probability score.
- Risk classification.
- Loan approval recommendation.
- Financial cost assessment.
- SHAP-based explanation of decision factors.

Example:

```json
{
  "default_probability": 0.23,
  "risk_level": "High Risk",
  "decision": "Rejected",
  "top_factors": [
    "Income-to-Loan Ratio",
    "Credit History Length",
    "Interest Rate"
  ]
}
```

---

## Application Interface

### 1. Loan Application Form

![Loan Application Form](frontend/src/components/form.png)

### 2. Applicant Profile Summary

![Applicant Profile Summary](frontend/src/components/profile-summary.png)

### 3. Loan Approval Result (Accepted)

![Loan Approval Result - Accepted](frontend/src/components/result-accepted.png)

### 4. Loan Approval Result (Rejected)

![Loan Approval Result - Rejected](frontend/src/components/result-rejected.png)

---

## Results Summary

### Strategic Threshold

After cost-sensitive optimization and cross-validation analysis, a threshold of **0.18** was selected for deployment.

### Economic Impact

Compared to the default threshold of 0.50, the optimized threshold helps reduce losses from risky loans while maintaining strong lending performance.

### Stability Analysis

A 5-Fold Cross-Validation threshold audit demonstrated that optimal thresholds consistently fall within the range:

```text
0.17 – 0.21
```

This indicates that the selected threshold remains robust across different data partitions.

---

## Financial Cost Optimization Framework

![Cost Optimization Framework](frontend/src/components/cost-optimization.png)

Most classification models focus on prediction performance, measured by:

- Accuracy
- Precision
- Recall
- F1-Score
- ROC-AUC

However, banks and lenders are mainly concerned with financial results.

Therefore, this project uses a cost-sensitive approach to minimize expected financial losses

### Cost Components

#### False Negative (FN)

The model approves a borrower who eventually defaults.

```text
Cost(FN) = Loan Amount × 0.60
```

Where:

- 60% = Loss Given Default (LGD)

#### False Positive (FP)

The model rejects a borrower who would have repaid successfully.

```text
Cost(FP) = Loan Amount × 0.15
```

Where:

- 15% = Estimated Interest Margin / Opportunity Cost

### Total Cost Function

```text
Total Cost =
Σ(False Negatives × LGD Cost)
+
Σ(False Positives × Opportunity Cost)
```

The optimal threshold is selected by minimizing this total expected cost.

---

## Why Was Threshold 0.18 Selected?

![Model Error Analysis](frontend/src/components/Model%20Error%20Analysis.png)

![Optimal Threshold](frontend/src/components/optimal-threshold.png)

Although the mathematically optimal threshold was approximately **0.17**, a deployment threshold of **0.18** was chosen based on business and operational considerations. If the standard threshold of 0.50 is used, the number of False Negatives will increase because more high-risk customers will pass the credit approval process.
Therefore, a strategic threshold of 0.18 was selected based on the optimization of financial costs to mitigate the risk of losses from bad debt (Loss Given Default), even though this results in a higher number of rejected customers (False Positives).

### 1. Business Growth vs. Risk Management

The 0.18 threshold maintains a higher approval rate while remaining extremely close to the minimum-cost solution.

Benefits:

- Increased loan approvals.
- Greater market reach.
- Minimal additional financial risk.

### 2. Cross-Validation Stability

![Cross-Validation Stability](frontend/src/components/Cross-Validation%20Stability.png)

Threshold optimization across five validation folds showed consistent results:

| Fold | Optimal Threshold |
| ---- | ----------------- |
| 1    | 0.19              |
| 2    | 0.17              |
| 3    | 0.19              |
| 4    | 0.18              |
| 5    | 0.21              |

The average threshold is approximately:

```text
0.188
```

making **0.18** a practical and stable deployment choice.

### 3. Financial Trade-Off Optimization

The threshold is designed to balance risk and growth:

#### Default Loss (False Negatives)

A risky borrower is approved and later defaults.

```text
Cost = Loan Amount × 60%
```

#### Opportunity Cost (False Positives)

A safe borrower is incorrectly rejected.

```text
Cost = Loan Amount × 15%
```

This approach helps reduce losses while still approving enough good borrowers to support business growth.

---

## Model Performance with Threshold 0.18

![Model Performance](frontend/src/components/model-performence.png)

---

## Explainable AI with SHAP

To improve transparency and trust, the project integrates SHAP (SHapley Additive exPlanations).

SHAP explanations allow stakeholders to understand:

- Why a loan was approved or rejected.
- Which features most influenced the prediction.
- Whether each feature increased or decreased risk.

Example decision rationale:

- Income-to-Loan Ratio → Increased risk.
- Credit History Length → Reduced risk.
- Interest Rate → Increased risk.
- Previous Default History → Strongly increased risk.

This approach supports responsible AI practices and enhances model interpretability for business users.

---

## Deployment Assets

The notebook exports the following production-ready files:

```text
models/
├── credit_risk_model.pkl
├── trained_preprocessor.joblib
├── model_config.json

```

These assets can be loaded directly into a backend service for real-time inference.

---

## Future Improvements

- Add automated monitoring to track model performance over time.
- Evaluate the model for fairness and potential bias.
- Additional explainability methods besides SHAP.
