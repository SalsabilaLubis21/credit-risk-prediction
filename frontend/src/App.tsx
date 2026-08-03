import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { NewLoanApplication } from './components/NewLoanApplication';
import { DecisionDashboard } from './components/DecisionDashboard';

export interface PredictionResult {
  risk_probability: number;
  decision: string;
  rationale: Array<{ feature: string; explanation: string }>;
}

export interface ApplicantProfile {
  person_age: number;
  person_income: number;
  person_emp_length: number;
  person_home_ownership: string;
  cb_person_cred_hist_length: number;
  cb_person_default_on_file: string;
  loan_amnt: number;
  loan_int_rate: number;
  loan_intent: string;
  loan_grade: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'new-loan' | 'dashboard'>('dashboard');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [applicantProfile, setApplicantProfile] = useState<ApplicantProfile | null>(null);

  const handlePredictionSuccess = (result: PredictionResult, profile: ApplicantProfile) => {
    setPredictionResult(result);
    setApplicantProfile(profile);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-sans text-[#0b1c30]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="ml-64 p-10 pt-8">
        {activeTab === 'new-loan' ? (
          <NewLoanApplication onPredictionSuccess={handlePredictionSuccess} />
        ) : (
          <DecisionDashboard 
            predictionResult={predictionResult} 
            applicantProfile={applicantProfile}
            onNavigateToApply={() => setActiveTab('new-loan')}
          />
        )}
      </main>
    </div>
  );
}
