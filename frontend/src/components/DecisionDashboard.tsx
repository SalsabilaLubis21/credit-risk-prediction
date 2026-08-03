import { Printer, Check, AlertTriangle, Info, TrendingDown, Clock, Building2, ShieldCheck, Sparkles, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PredictionResult, ApplicantProfile } from '../App';

interface DecisionDashboardProps {
  predictionResult: PredictionResult | null;
  applicantProfile: ApplicantProfile | null;
  onNavigateToApply: () => void;
}

export function DecisionDashboard({ predictionResult, applicantProfile, onNavigateToApply }: DecisionDashboardProps) {
  // Empty state if no prediction has been made
  if (!predictionResult || !applicantProfile) {
    return (
      <div className="max-w-[1280px] mx-auto w-full flex flex-col items-center justify-center min-h-[500px] border border-dashed border-slate-300 rounded-2xl bg-white p-12 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-blue-600 mb-6 animate-pulse">
          <Sparkles size={28} />
        </div>
        <h2 className="text-[28px] font-semibold text-slate-900 tracking-tight mb-2">No Active Decision Report</h2>
        <p className="text-slate-500 max-w-lg mb-8 leading-relaxed">
          Please submit a new loan application first. The ML model and SHAP underwriting engine will assess the applicant risk profile and generate a decision report here.
        </p>
        <button
          onClick={onNavigateToApply}
          className="px-6 py-3 rounded-lg bg-black text-white hover:bg-slate-800 transition-colors shadow-sm text-[14px] font-semibold flex items-center gap-2 cursor-pointer"
        >
          Create Application
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const { risk_probability, decision, rationale } = predictionResult;
  const isApproved = decision === "Approved";

  // Circular gauge calculations
  // Circumference = 2 * PI * r = 2 * PI * 45 = 282.7 (represented as 283)
  const circumference = 283;
  
  // Danger limit is 0.18. High risk is above 0.18.
  const limitOffset = circumference * (1 - 0.18);
  
  // Actual score offset
  const scoreOffset = circumference * (1 - risk_probability);

  // Map features to readable names and icons
  const getFeatureMeta = (feat: string) => {
    const defaultMeta = { title: feat.replace(/_/g, ' '), icon: Sparkles };
    const mappings: Record<string, { title: string; icon: any }> = {
      'person_income': { title: 'Annual Income', icon: TrendingDown },
      'loan_amnt': { title: 'Loan Amount', icon: FileText },
      'loan_int_rate': { title: 'Interest Rate', icon: Clock },
      'person_emp_length': { title: 'Employment Length', icon: Building2 },
      'cb_person_default_on_file_Y': { title: 'Payment Default History', icon: ShieldCheck },
      'income_loan_ratio': { title: 'Income-to-Loan Ratio', icon: TrendingDown },
      'age_emp_ratio': { title: 'Age-Employment Ratio', icon: Clock },
      'cred_hist_age_ratio': { title: 'Credit History Age Ratio', icon: ShieldCheck },
      'is_high_risk_intent': { title: 'High-Risk Intent', icon: ShieldCheck },
      'person_home_ownership_OWN': { title: 'Home Ownership Status', icon: Building2 },
      'person_home_ownership_RENT': { title: 'Home Ownership Status', icon: Building2 },
      'person_home_ownership_OTHER': { title: 'Home Ownership Status', icon: Building2 },
      'loan_intent_EDUCATION': { title: 'Loan Purpose Type', icon: FileText },
      'loan_intent_HOMEIMPROVEMENT': { title: 'Loan Purpose Type', icon: FileText },
      'loan_intent_MEDICAL': { title: 'Loan Purpose Type', icon: FileText },
      'loan_intent_PERSONAL': { title: 'Loan Purpose Type', icon: FileText },
      'loan_intent_VENTURE': { title: 'Loan Purpose Type', icon: FileText },
    };
    return mappings[feat] || defaultMeta;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-12">
      {/* Header Section */}
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h2 className="text-[32px] font-semibold text-slate-900 mb-2 tracking-tight">Decision Report</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700 cursor-pointer"
          >
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      {/* 1. Status Alert Banner */}
      {isApproved ? (
        <div className="bg-[#e6fbf1] border border-[#a3f0c9] rounded-xl p-6 flex items-start gap-4 shadow-[0px_4px_6px_-1px_rgba(15,23,42,0.1),0px_2px_4px_-2px_rgba(15,23,42,0.05)]">
          <CheckCircle2 className="text-[#00714d] text-[32px] shrink-0 mt-0.5" size={32} />
          <div>
            <h3 className="text-[24px] font-semibold text-[#005236] mb-1 tracking-tight">Approved - Low Risk</h3>
            <p className="text-[16px] text-[#00714d]/90 max-w-3xl leading-relaxed">
              The loan application for ${applicantProfile.loan_amnt.toLocaleString()} has successfully passed the automated underwriting checks with a low credit risk score of {risk_probability}.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-xl p-6 flex items-start gap-4 shadow-[0px_4px_6px_-1px_rgba(15,23,42,0.1),0px_2px_4px_-2px_rgba(15,23,42,0.05)]">
          <AlertTriangle className="text-[#ba1a1a] text-[32px] shrink-0 mt-0.5" size={32} />
          <div>
            <h3 className="text-[24px] font-semibold text-[#93000a] mb-1 tracking-tight">Rejected - High Risk</h3>
            <p className="text-[16px] text-[#93000a]/80 max-w-3xl leading-relaxed">
              This application has been automatically declined by the risk assessment engine. The composite risk score of {risk_probability} significantly exceeds the institutional safety threshold of 0.18. Manual override is not recommended.
            </p>
          </div>
        </div>
      )}

      {/* Bento Grid Layout for Dashboard Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Risk Meter Card (Span 4) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-6 flex flex-col items-center justify-center border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgb(11, 28, 48) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="w-full flex justify-between items-center mb-8 relative z-10">
            <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest opacity-70">Composite Risk Score</h4>
            <div className="group relative">
              <Info size={20} className="text-slate-400 cursor-help hover:text-slate-900 transition-colors" />
              <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block w-64 p-3 bg-slate-900 text-white text-[12px] rounded-lg shadow-lg z-50">
                Probability of default. If the score is less than the threshold (0.18), the application is approved.
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center py-4">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* SVG Gauge representation */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background track */}
                <circle cx="50" cy="50" fill="none" r="45" stroke="#E2E8F0" strokeDasharray="283" strokeDashoffset="0" strokeWidth="10"></circle>
                {/* Safe zone highlight (0 to 0.18) */}
                <circle className="opacity-30" cx="50" cy="50" fill="none" r="45" stroke={isApproved ? "#00714d" : "#ef4444"} strokeDasharray="283" strokeDashoffset={limitOffset} strokeWidth="10"></circle>
                {/* Actual Score */}
                <circle className="transition-all duration-1000 ease-out" cx="50" cy="50" fill="none" r="45" stroke={isApproved ? "#00714d" : "#ba1a1a"} strokeDasharray="283" strokeDashoffset={scoreOffset} strokeWidth="10"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-[64px] font-bold tracking-tighter ${isApproved ? 'text-[#00714d]' : 'text-[#ba1a1a]'}`}>{risk_probability}</span>
                <span className="text-[14px] font-semibold text-slate-500 mt-2">Limit: 0.18</span>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-around text-slate-500 mt-8 border-t border-slate-200 pt-4">
            <div className="flex flex-col items-center">
              <span className="opacity-60 uppercase text-[10px] tracking-widest mb-1 font-semibold">Strategic Decision</span>
              <span className={`font-bold text-[16px] ${isApproved ? 'text-[#00714d]' : 'text-[#ba1a1a]'}`}>
                {isApproved ? 'Approved (Low Risk)' : 'Rejected (High Risk)'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Decision Rationale (Span 8) */}
        <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-3">
            <h4 className="text-[24px] font-semibold text-slate-900 tracking-tight">Decision Rationale</h4>
            <span className="px-3 py-1 bg-[#eff4ff] text-[#3f465c] rounded-full text-[12px] font-bold flex items-center gap-1 border border-[#dce9ff]">
              <Sparkles size={14} className="text-[#3f465c]" />
              Explainable AI (SHAP)
            </span>
          </div>

          <div className="flex flex-col gap-6 flex-1 justify-center">
            {rationale.map((item, index) => {
              const meta = getFeatureMeta(item.feature);
              const Icon = meta.icon;
              
              // Custom colors depending on approved vs rejected
              const cardBgClass = isApproved 
                ? 'bg-[#e6fbf1]/40 border-[#a3f0c9]/40 text-[#0b5434]' 
                : 'bg-[#ffdad6]/20 border-[#ffdad6] text-[#7a1e1e]';
              const iconClass = isApproved ? 'text-[#00714d]' : 'text-[#ba1a1a]';

              return (
                <div key={index} className={`p-6 rounded-lg border flex gap-4 items-start ${cardBgClass}`}>
                  {isApproved ? (
                    <Check className={`${iconClass} mt-0.5 shrink-0`} size={20} />
                  ) : (
                    <AlertTriangle className={`${iconClass} mt-0.5 shrink-0`} size={20} />
                  )}
                  <div>
                    <h5 className="text-[16px] font-bold text-slate-900">{meta.title}</h5>
                    <p className="text-[14px] text-slate-600 mt-2 leading-relaxed">{item.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Customer Profile Summary (Span 12) */}
        <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#f8f9ff] px-6 py-4 border-b border-slate-200">
            <h4 className="text-[20px] font-semibold text-slate-900 tracking-tight">Applicant Profile Summary</h4>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-6">
             <div className="flex flex-col gap-1">
               <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Requested Amount</span>
               <span className="text-[20px] font-semibold text-slate-900">${applicantProfile.loan_amnt.toLocaleString()}</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Loan Purpose</span>
               <span className="text-[16px] font-medium text-slate-900">{applicantProfile.loan_intent}</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Loan Grade</span>
               <span className="text-[16px] font-medium text-slate-900">Grade {applicantProfile.loan_grade}</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Interest Rate</span>
               <span className="text-[16px] font-medium text-slate-900">{applicantProfile.loan_int_rate}%</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Stated Income</span>
               <span className="text-[16px] font-medium text-slate-900">${applicantProfile.person_income.toLocaleString()} / yr</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Employment Duration</span>
               <span className="text-[16px] font-medium text-slate-900">{applicantProfile.person_emp_length} Years</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Home Ownership</span>
               <span className="text-[16px] font-medium text-slate-900">{applicantProfile.person_home_ownership}</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Credit History Length</span>
               <span className="text-[16px] font-medium text-slate-900">{applicantProfile.cb_person_cred_hist_length} Years</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">History of Payment Default</span>
               <span className="text-[16px] font-medium text-slate-900">{applicantProfile.cb_person_default_on_file === 'Y' ? 'Yes' : 'No'}</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Age</span>
               <span className="text-[16px] font-medium text-slate-900">{applicantProfile.person_age} Years old</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
