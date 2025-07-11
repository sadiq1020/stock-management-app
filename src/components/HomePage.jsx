import React from "react";
import TransactionsTable from "./TransactionsTable";

const HomePage = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Transactions
        </h1>
        <TransactionsTable />
    </div>
);

export default HomePage;
