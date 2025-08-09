import React, { useState } from "react";
import TransactionsTable from "./TransactionsTable";
import AddTransactionForm from "./AddTransactionForm";

const HomePage = () => {
    const [transactions, setTransactions] = useState([]);

    const handleAddTransaction = async (transactionData) => {
        // Here you would typically save to DynamoDB
        // For now, we'll just add to local state
        setTransactions(prev => [...prev, transactionData]);
        console.log("Transaction added:", transactionData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Trading Transactions
                    </h1>
                    <p className="text-gray-600">
                        Track and analyze your trading performance
                    </p>
                </div>
                <AddTransactionForm onSubmit={handleAddTransaction} />
                <TransactionsTable />
            </div>
        </div>
    );
};

export default HomePage;