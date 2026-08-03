interface TopBarProps {
  activeTab: "new-loan" | "dashboard";
  onTabChange: (tab: "new-loan" | "dashboard") => void;
}

export function TopBar({ activeTab, onTabChange }: TopBarProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-[#f8f9ff] flex items-center px-8 ml-64 sticky top-0 z-10">
      <div
        className={`flex items-center w-full mx-auto h-full ${activeTab === "dashboard" ? "max-w-5xl" : "max-w-[1280px]"}`}
      >
        <div
          className={`text-[11px] font-semibold text-slate-500 tracking-wider mr-12 uppercase ${activeTab === "new-loan" ? "invisible" : ""}`}
        >
          APPLICATION #APP-2023-9948
        </div>
        <nav
          className={`flex gap-8 h-full ${activeTab === "new-loan" ? "mx-auto -ml-32" : ""}`}
        >
          <button
            onClick={() => onTabChange("new-loan")}
            className={`h-full border-b-[3px] font-semibold text-sm px-1 pt-1 ${
              activeTab === "new-loan"
                ? "border-black text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            New Loan Application
          </button>
          <button
            onClick={() => onTabChange("dashboard")}
            className={`h-full border-b-[3px] font-semibold text-sm px-1 pt-1 ${
              activeTab === "dashboard"
                ? "border-black text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Decision Dashboard
          </button>
        </nav>
      </div>
    </header>
  );
}
