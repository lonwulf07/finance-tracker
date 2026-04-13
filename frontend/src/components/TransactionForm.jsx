import { useState } from "react";
import { motion } from 'framer-motion';
import api from "../api/axios";

function TransactionForm({ onTransactionAdded }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount || !category) {
      alert("Please fill out all fields");
      return;
    }

    const newTransaction = {
      description,
      amount: Number(amount),
      type,
      category,
    };

    try {
      const response = await api.post("/transactions", newTransaction);
      onTransactionAdded(response.data.data);

      setDescription("");
      setAmount("");
      setCategory("");
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Add New Transaction</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "15px",
        }}
      >
        <input
          type="text"
          placeholder="Description (e.g., Groceries)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "10px" }}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "10px" }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="text"
          placeholder="Category (e.g., Food, Salary)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "10px" }}
        />

        <motion.button
          type="submit"
          style={{
            padding: "10px",
            background: "#333",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Transaction
        </motion.button>
      </form>
    </div>
  );
}

export default TransactionForm;
