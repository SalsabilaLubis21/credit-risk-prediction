import { LayoutDashboard, PlusSquare } from "lucide-react";

import logoImg from "./image.png";

interface SidebarProps {
  activeTab: "new-loan" | "dashboard";
  onTabChange: (tab: "new-loan" | "dashboard") => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col justify-between p-4 fixed left-0 top-0">
      <div>
        <div className="flex items-center gap-3 mb-10 pl-2">
          <img
            src={logoImg}
            alt="Logo"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-900">
              Loan Decision
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Institutional Access
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => onTabChange("new-loan")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
              activeTab === "new-loan"
                ? "bg-[#6cf8bb] text-[#005236] font-semibold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <PlusSquare size={18} />
            New Loan Application
          </button>
          <button
            onClick={() => onTabChange("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
              activeTab === "dashboard"
                ? "bg-[#6cf8bb] text-[#005236] font-semibold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard size={18} />
            Decision Dashboard
          </button>
        </nav>
      </div>

      <button
        onClick={() => onTabChange("new-loan")}
        className="w-full bg-black text-white rounded-lg py-3 font-medium hover:bg-slate-800 transition-colors text-sm mb-2"
      >
        Process New Loan
      </button>
    </aside>
  );
}
