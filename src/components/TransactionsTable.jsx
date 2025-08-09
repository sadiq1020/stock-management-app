import React, { useState } from "react";

const columns = [
    { key: "datetime", label: "Date & Time", width: "w-40" },
    { key: "action", label: "Action", width: "w-20" },
    { key: "symbol", label: "Symbol", width: "w-20" },
    { key: "assetType", label: "Asset Type", width: "w-24" },
    { key: "qty", label: "Qty", width: "w-16" },
    { key: "price", label: "Price", width: "w-24" },
    { key: "grossAmount", label: "Gross Amount", width: "w-32" },
    { key: "fees", label: "Fees", width: "w-24" },
    { key: "netCashFlow", label: "Net Cash Flow", width: "w-32" },
    { key: "positionAfter", label: "Position", width: "w-20" },
    { key: "realizedPL", label: "Realized P/L", width: "w-28" },
    { key: "currency", label: "Currency", width: "w-20" },
    { key: "platform", label: "Platform", width: "w-24" },
    { key: "sourceOfCash", label: "Source", width: "w-24" },
];

const data = [
    {
        datetime: "2025-07-10 09:35:00",
        action: "Buy",
        symbol: "AAPL",
        assetType: "Stock",
        qty: 100,
        price: "$190.00",
        grossAmount: "$19,000.00",
        fees: "$4.95",
        netCashFlow: "−$19,004.95",
        positionAfter: 100,
        realizedPL: "—",
        currency: "USD",
        platform: "Questrade",
        sourceOfCash: "Cash Account",
        investmentType: "Long Term",
    },
    {
        datetime: "2025-07-10 13:47:00",
        action: "Sell",
        symbol: "AAPL",
        assetType: "Stock",
        qty: 100,
        price: "$193.50",
        grossAmount: "$19,350.00",
        fees: "$4.95",
        netCashFlow: "+$19,345.05",
        positionAfter: 0,
        realizedPL: "+$340.10",
        currency: "USD",
        platform: "Questrade",
        sourceOfCash: "Cash Account",
        investmentType: "Long Term",
    },
    {
        datetime: "2025-07-11 10:15:00",
        action: "Buy",
        symbol: "TSLA",
        assetType: "Stock",
        qty: 50,
        price: "$245.80",
        grossAmount: "$12,290.00",
        fees: "$4.95",
        netCashFlow: "−$12,294.95",
        positionAfter: 50,
        realizedPL: "—",
        currency: "USD",
        platform: "Questrade",
        sourceOfCash: "Cash Account",
        investmentType: "Short Term",
    },
    {
        datetime: "2025-07-11 14:22:00",
        action: "Sell",
        symbol: "TSLA",
        assetType: "Stock",
        qty: 25,
        price: "$248.90",
        grossAmount: "$6,222.50",
        fees: "$4.95",
        netCashFlow: "+$6,217.55",
        positionAfter: 25,
        realizedPL: "+$77.50",
        currency: "USD",
        platform: "Questrade",
        sourceOfCash: "Cash Account",
        investmentType: "Short Term",
    },
];

const TransactionsTable = () => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [activeTab, setActiveTab] = useState("Long Term");

    const tabs = ["Long Term", "Short Term"];

    const formatCellValue = (value, key) => {
        if (key === 'action') {
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'Buy'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {value}
                </span>
            );
        }

        if (key === 'symbol') {
            return <span className="font-semibold text-blue-600">{value}</span>;
        }

        if (key === 'realizedPL' && value !== '—') {
            return (
                <span className={`font-semibold ${value.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {value}
                </span>
            );
        }

        if (key === 'netCashFlow') {
            return (
                <span className={`font-medium ${value.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {value}
                </span>
            );
        }

        if (key === 'datetime') {
            const [date, time] = value.split(' ');
            return (
                <div className="text-left">
                    <div className="font-medium text-gray-900">{date}</div>
                    <div className="text-xs text-gray-500">{time}</div>
                </div>
            );
        }

        return value;
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter data based on active tab
    const filteredData = React.useMemo(() => {
        return data.filter(item => item.investmentType === activeTab);
    }, [activeTab]);

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Calculate summary stats for filtered data
    const summaryStats = React.useMemo(() => {
        const totalTransactions = filteredData.length;
        const totalRealizedPL = filteredData
            .filter(item => item.realizedPL !== '—')
            .reduce((sum, item) => {
                const value = parseFloat(item.realizedPL.replace(/[+$,]/g, ''));
                return sum + value;
            }, 0);
        const totalFees = filteredData.reduce((sum, item) => {
            const value = parseFloat(item.fees.replace(/[$,]/g, ''));
            return sum + value;
        }, 0);

        return {
            totalTransactions,
            totalRealizedPL: totalRealizedPL > 0 ? `+$${totalRealizedPL.toFixed(2)}` : `$${totalRealizedPL.toFixed(2)}`,
            totalFees: `$${totalFees.toFixed(2)}`
        };
    }, [filteredData]);

    return (
        <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* ADD THE TABLE TITLE HERE */}
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Transaction History</h2>
                <p className="text-gray-100 text-sm mt-1">View and analyze your trading transactions</p>
            </div>
            
           {/* Tabs */}
 <div className="border-b border-gray-200">
 <nav className="-mb-px flex">
     {tabs.map((tab) => (
         <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
                 activeTab === tab
                     ? 'border-blue-500 text-blue-600 bg-blue-50'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
             }`}
         >
             {tab === "Long Term" ? "Long-term Investment" : "Short-term Investment"}
             <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                 {data.filter(item => item.investmentType === tab).length}
             </span>
         </button>
     ))}
 </nav>
</div>

<div className="overflow-x-auto">
 <table className="min-w-full divide-y divide-gray-200">
     <thead className="bg-gray-50">
         <tr>
             {columns.map((col) => (
                 <th
                     key={col.key}
                     className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${col.width}`}
                     onClick={() => handleSort(col.key)}
                 >
                     <div className="flex items-center space-x-1">
                         <span>{col.label}</span>
                         {sortConfig.key === col.key && (
                             <span className="text-blue-500">
                                 {sortConfig.direction === 'asc' ? '↑' : '↓'}
                             </span>
                         )}
                     </div>
                 </th>
             ))}
         </tr>
     </thead>
     <tbody className="bg-white divide-y divide-gray-200">
         {sortedData.map((row, idx) => (
             <tr
                 key={idx}
                 className="hover:bg-gray-50 transition-colors duration-150"
             >
                 {columns.map((col) => (
                     <td
                         key={col.key}
                         className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                     >
                         {formatCellValue(row[col.key], col.key)}
                     </td>
                 ))}
             </tr>
         ))}
     </tbody>
 </table>
</div>

{/* Summary Stats */}
<div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
 <div className="flex flex-wrap gap-6 text-sm">
     <div className="flex items-center space-x-2">
         <span className="text-gray-500">Total Transactions:</span>
         <span className="font-semibold text-gray-900">{summaryStats.totalTransactions}</span>
     </div>
     <div className="flex items-center space-x-2">
         <span className="text-gray-500">Total Realized P/L:</span>
         <span className={`font-semibold ${summaryStats.totalRealizedPL.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
             {summaryStats.totalRealizedPL}
         </span>
     </div>
     <div className="flex items-center space-x-2">
         <span className="text-gray-500">Total Fees:</span>
         <span className="font-semibold text-red-600">{summaryStats.totalFees}</span>
     </div>
 </div>
</div>
        </div>
    </div>
    );
};

export default TransactionsTable;
