import { User, FileText, Calculator, Info, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { ApplicantProfile, PredictionResult } from "../App";

interface NewLoanApplicationProps {
  onPredictionSuccess: (
    result: PredictionResult,
    profile: ApplicantProfile,
  ) => void;
}

export function NewLoanApplication({
  onPredictionSuccess,
}: NewLoanApplicationProps) {
  const [age, setAge] = useState<number | "">("");
  const [income, setIncome] = useState<number | "">("");
  const [employmentDuration, setEmploymentDuration] = useState<number | "">("");
  const [homeOwnership, setHomeOwnership] = useState<string>("");
  const [creditHistoryLength, setCreditHistoryLength] = useState<number | "">(
    "",
  );
  const [defaultHistory, setDefaultHistory] = useState<string>("N");
  const [loanAmount, setLoanAmount] = useState<number | "">("");
  const [interestRate, setInterestRate] = useState<number | "">("");
  const [loanPurpose, setLoanPurpose] = useState<string>("");
  const [loanGrade, setLoanGrade] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const ratio = useMemo(() => {
    if (
      typeof income === "number" &&
      typeof loanAmount === "number" &&
      income > 0
    ) {
      return ((loanAmount / income) * 100).toFixed(2);
    }
    return "0.00";
  }, [income, loanAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      age === "" ||
      income === "" ||
      employmentDuration === "" ||
      !homeOwnership ||
      creditHistoryLength === "" ||
      !defaultHistory ||
      loanAmount === "" ||
      interestRate === "" ||
      !loanPurpose ||
      !loanGrade
    ) {
      setError("Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: ApplicantProfile = {
      person_age: Number(age),
      person_income: Number(income),
      person_emp_length: Number(employmentDuration),
      person_home_ownership: homeOwnership,
      cb_person_cred_hist_length: Number(creditHistoryLength),
      cb_person_default_on_file: defaultHistory,
      loan_amnt: Number(loanAmount),
      loan_int_rate: Number(interestRate),
      loan_intent: loanPurpose,
      loan_grade: loanGrade,
    };

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Server error: ${response.statusText}`,
        );
      }

      const result: PredictionResult = await response.json();
      onPredictionSuccess(result, payload);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Failed to connect to the backend server. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto w-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-[32px] font-semibold text-slate-900 tracking-tight mb-2">
            New Loan Application
          </h2>
          <p className="text-slate-500">
            Enter customer data for preliminary decisioning.
          </p>
        </div>
        <div className="hidden sm:block">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#eff4ff] text-slate-700 text-[12px] font-semibold border border-[#dce9ff]">
            <Info size={14} className="mr-1.5" />
            No Personal Data Stored
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[14px] font-medium animate-fadeIn">
            {error}
          </div>
        )}

        {/* Personal Data Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-[20px] font-semibold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User size={20} className="text-slate-700" />
            Personal Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-slate-900 block">
                Age
              </label>
              <input
                type="number"
                min="18"
                max="100"
                required
                placeholder="e.g. 35"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[16px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
              />
              <p className="text-[12px] text-slate-500 font-medium">
                Must be 18-100
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-slate-900 block">
                Annual Income
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="75000"
                  value={income}
                  onChange={(e) =>
                    setIncome(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-[16px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                />
              </div>
              <p className="text-[12px] text-slate-500 font-medium">
                Cannot be negative
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-slate-900 block">
                Employment Duration (Years)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                required
                placeholder="e.g. 5"
                value={employmentDuration}
                onChange={(e) =>
                  setEmploymentDuration(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[16px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-slate-900 block">
                Home Ownership
              </label>
              <select
                required
                value={homeOwnership}
                onChange={(e) => setHomeOwnership(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[16px] text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select ownership status
                </option>
                <option value="RENT">RENT</option>
                <option value="MORTGAGE">MORTGAGE</option>
                <option value="OWN">OWN</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-slate-900 block">
                Credit History Length
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="e.g. 7"
                value={creditHistoryLength}
                onChange={(e) =>
                  setCreditHistoryLength(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[16px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-slate-900 block mb-2">
                History of Payment Default
              </label>
              <div className="flex items-center gap-6 h-10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="default_history"
                    value="Y"
                    checked={defaultHistory === "Y"}
                    onChange={() => setDefaultHistory("Y")}
                    className="w-4 h-4 text-black focus:ring-black border-slate-300"
                  />
                  <span className="text-[16px] text-slate-900">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="default_history"
                    value="N"
                    checked={defaultHistory === "N"}
                    onChange={() => setDefaultHistory("N")}
                    className="w-4 h-4 text-black focus:ring-black border-slate-300"
                  />
                  <span className="text-[16px] text-slate-900">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Details Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mt-6">
          <h3 className="text-[20px] font-semibold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText size={20} className="text-slate-700" />
            Loan Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-slate-900 block">
                Loan Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="25000"
                  value={loanAmount}
                  onChange={(e) =>
                    setLoanAmount(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-[16px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                />
              </div>
              <p className="text-[12px] text-slate-500 font-medium">
                Cannot be negative
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-slate-900 block">
                Interest Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="5.25"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(
                      e.target.value ? Number(e.target.value) : "",
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 pr-8 pl-3 py-2 text-[16px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                  %
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-slate-900 block">
                Loan Purpose
              </label>
              <select
                required
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[16px] text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select loan purpose
                </option>
                <option value="EDUCATION">EDUCATION</option>
                <option value="MEDICAL">MEDICAL</option>
                <option value="VENTURE">VENTURE</option>
                <option value="PERSONAL">PERSONAL</option>
                <option value="DEBTCONSOLIDATION">DEBTCONSOLIDATION</option>
                <option value="HOMEIMPROVEMENT">HOMEIMPROVEMENT</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-slate-900 block">
                Loan Grade
              </label>
              <select
                required
                value={loanGrade}
                onChange={(e) => setLoanGrade(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[16px] text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select loan grade
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>
          </div>

          {/* Real-time Ratio Indicator */}
          <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#dce9ff] flex items-center justify-between">
            <div>
              <h4 className="text-[14px] font-bold text-slate-900">
                Loan-to-Income Ratio
              </h4>
              <p className="text-[12px] font-medium text-slate-500 mt-0.5">
                Real-time calculation (Loan Amount / Annual Income)
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm min-w-[120px] text-right">
              <span className="text-[24px] font-semibold text-slate-900 tabular-nums">
                {ratio}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex justify-end pt-4 pb-12 border-t border-slate-200 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-black text-white hover:bg-slate-800 disabled:bg-slate-400 transition-colors shadow-sm text-[14px] font-semibold flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Calculator size={18} />
            )}
            {loading ? "Calculating..." : "Calculate Decision"}
          </button>
        </div>
      </form>
    </div>
  );
}
