export function AdminTabs({ activeTab, onTabChange, tabs }: { activeTab: string, onTabChange: (t: string) => void, tabs: string[] }) {
    return (
        <div className="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`
            px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap
            ${activeTab === tab
                            ? "bg-white border-x border-t border-gray-200 text-earth-green"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}
          `}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
