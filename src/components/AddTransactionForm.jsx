import React, { useState } from "react";

const AddTransactionForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        datetime: "",
        action: "",
        symbol: "",
        assetType: "",
        qty: "",
        price: "",
        currency: "USD",
        sourceOfCash: "Cash Account"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!isFormValid) return;
        
        setIsSubmitting(true);

        try {
            // Calculate gross amount
            const qty = parseFloat(formData.qty);
            const price = parseFloat(formData.price);
            const grossAmount = qty * price;

            // Prepare transaction data
            const transactionData = {
                ...formData,
                qty: qty,
                price: `$${price.toFixed(2)}`,
                grossAmount: `$${grossAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                fees: "$4.95", // Default fee
                netCashFlow: formData.action === "Buy" 
                    ? `−$${(grossAmount + 4.95).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                    : `+$${(grossAmount - 4.95).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                positionAfter: formData.action === "Buy" ? qty : 0, // Simplified logic
                realizedPL: formData.action === "Sell" ? "+$0.00" : "—", // Placeholder
                platform: "Questrade", // Default platform
                investmentType: "Long Term" // Default investment type
            };

            // Call the onSubmit prop (this would typically save to DynamoDB)
            if (onSubmit) {
                await onSubmit(transactionData);
            }

            // Reset form
            setFormData({
                datetime: "",
                action: "",
                symbol: "",
                assetType: "",
                qty: "",
                price: "",
                currency: "USD",
                sourceOfCash: "Cash Account"
            });

            alert("Transaction added successfully!");
        } catch (error) {
            console.error("Error submitting transaction:", error);
            alert("Error adding transaction. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.datetime && formData.action && formData.symbol && 
                       formData.assetType && formData.qty && formData.price;

    return (
        <div className="w-full max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Add New Transaction</h2>
                    <p className="text-blue-100 text-sm mt-1">Enter transaction details to add to your portfolio</p>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Date and Time */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                name="datetime"
                                value={formData.datetime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Action */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Action *
                            </label>
                            <select
                                name="action"
                                value={formData.action}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="">Select Action</option>
                                <option value="Buy">Buy</option>
                                <option value="Sell">Sell</option>
                            </select>
                        </div>

                        {/* Symbol */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Symbol *
                            </label>
                            <input
                                type="text"
                                name="symbol"
                                value={formData.symbol}
                                onChange={handleChange}
                                placeholder="e.g., AAPL, TSLA"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors uppercase"
                                style={{ textTransform: 'uppercase' }}
                            />
                        </div>

                        {/* Asset Type */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Asset Type *
                            </label>
                            <select
                                name="assetType"
                                value={formData.assetType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="">Select Asset Type</option>
                                <option value="Crypto">Crypto</option>
                                <option value="GICBOND">GIC/Bond</option>
                                <option value="Option">Option</option>
                                <option value="Currency">Currency</option>
                                <option value="Stock">Stock</option>
                            </select>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                name="qty"
                                value={formData.qty}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Price */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Currency */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Currency
                            </label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="USD">USD</option>
                                <option value="CAD">CAD</option>
                            </select>
                        </div>

                        {/* Source */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Source
                            </label>
                            <select
                                name="sourceOfCash"
                                value={formData.sourceOfCash}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="Cash Account">Cash Account</option>
                            </select>
                        </div>
                    </div>

                    {/* Preview Section */}
                    {formData.qty && formData.price && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Transaction Preview</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Gross Amount:</span>
                                    <span className="ml-2 font-medium">
                                        ${(parseFloat(formData.qty || 0) * parseFloat(formData.price || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Fees:</span>
                                    <span className="ml-2 font-medium">$4.95</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Net Cash Flow:</span>
                                    <span className={`ml-2 font-medium ${formData.action === 'Buy' ? 'text-red-600' : 'text-green-600'}`}>
                                        {formData.action === 'Buy' ? '−' : '+'}$
                                        {formData.action === 'Buy' 
                                            ? (parseFloat(formData.qty || 0) * parseFloat(formData.price || 0) + 4.95).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : (parseFloat(formData.qty || 0) * parseFloat(formData.price || 0) - 4.95).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isSubmitting}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Adding Transaction...</span>
                                </div>
                            ) : (
                                "Submit Transaction"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionForm;