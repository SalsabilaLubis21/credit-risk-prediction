from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from app.services.risk_engine import predict_credit_risk_with_shap
import uvicorn

app = FastAPI(
    title="Credit Risk Decisioning API",
    description="API for credit risk prediction and rationale using ML & SHAP",
    version="1.0.0"
)

# Enable CORS for frontend application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoanApplicationRequest(BaseModel):
    person_age: int = Field(..., ge=18, le=100, description="Age of the borrower")
    person_income: float = Field(..., ge=0, description="Annual income of the borrower")
    person_emp_length: float = Field(..., ge=0, description="Employment length in years")
    person_home_ownership: str = Field(..., description="Home ownership status (RENT, MORTGAGE, OWN, OTHER)")
    cb_person_cred_hist_length: int = Field(..., ge=0, description="Credit history length in years")
    cb_person_default_on_file: str = Field(..., description="History of payment default (Y/N)")
    loan_amnt: float = Field(..., ge=0, description="Requested loan amount")
    loan_int_rate: float = Field(..., ge=0, description="Loan interest rate percentage")
    loan_intent: str = Field(..., description="Loan intent purpose")
    loan_grade: str = Field(..., description="Loan grade (A-G)")

@app.post("/api/predict")
def predict_risk(application: LoanApplicationRequest):
    try:
        # Convert request to raw dictionary
        input_data = application.model_dump()
        
        # Invoke the risk engine
        result = predict_credit_risk_with_shap(input_data)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
