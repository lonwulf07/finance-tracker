import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "./api/axios";
import TransactionForm from "./components/TransactionForm";
import ExpenseChart from "./components/ExpenseChart";
import ExportCSV from "./components/ExportCSV";
import AuthForm from "./components/AuthForm";

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
      fetchTransactions();
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data.data);

      // NEW: Fetch anomalies from the Python microservice
      const userData = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1]),
      );
      const anomalyResponse = await fetch(
        `http://localhost:5001/api/anomalies/${userData.id}`,
      );
      const anomalyData = await anomalyResponse.json();

      if (anomalyData.success) {
        setAnomalies(anomalyData.anomalies);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleAddTransaction = async (newTransaction) => {
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      newTransaction,
    ]);
    try {
      const userData = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1]),
      );
      const anomalyResponse = await fetch(
        `http://localhost:5001/api/anomalies/${userData.id}`,
      );
      const anomalyData = await anomalyResponse.json();

      if (anomalyData.success) {
        setAnomalies(anomalyData.anomalies);
      }
    } catch (error) {
      console.error("Failed to fetch updated anomalies:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);

      setTransactions(transactions.filter((t) => t._id !== id));

      const userData = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1]),
      );
      const anomalyResponse = await fetch(
        `http://localhost:5001/api/anomalies/${userData.id}`,
      );
      const anomalyData = await anomalyResponse.json();

      if (anomalyData.success) {
        setAnomalies(anomalyData.anomalies);
      }
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTransactions([]);
  };

  if (!user) {
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            textAlign: "center",
            marginBottom: "40px",
            marginTop: "40px",
            color: "white",
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "900" }}>Finance Flow</h1>
        </motion.header>
        <AuthForm
          onLogin={(userData) => {
            setUser(userData);
            fetchTransactions();
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900" }}>Finance Flow</h1>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid white",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </motion.header>

      <main style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="glass-card">
            <TransactionForm onTransactionAdded={handleAddTransaction} />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="glass-card">
            <ExpenseChart transactions={transactions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="glass-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h2>Transaction History</h2>
              <ExportCSV transactions={transactions} />
            </div>

            <ul style={{ listStyle: "none", marginTop: "20px", padding: 0 }}>
              <AnimatePresence>
                {transactions.map((t) => {
                  const isAnomaly = anomalies.includes(t._id);

                  return (
                    <motion.li
                      key={t._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -100 }}
                      style={{
                        padding: "15px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: isAnomaly
                          ? "rgba(255, 165, 0, 0.2)"
                          : "rgba(255,255,255,0.7)", // Highlight orange if anomaly
                        borderLeft: isAnomaly ? "4px solid #FF9933" : "none",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "1.1em", fontWeight: "bold" }}>
                          {t.description}
                          {isAnomaly && (
                            <span
                              style={{
                                fontSize: "0.7em",
                                background: "#FF9933",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: "10px",
                                marginLeft: "10px",
                              }}
                            >
                              Unusual Activity
                            </span>
                          )}
                        </span>
                        <span
                          style={{
                            color: "#666",
                            fontSize: "0.85em",
                            textTransform: "uppercase",
                          }}
                        >
                          {t.category}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "900",
                            fontSize: "1.2em",
                            color: t.type === "expense" ? "#FF3366" : "#00C49F",
                          }}
                        >
                          {t.type === "expense" ? "-" : "+"}${t.amount}
                        </span>
                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "#ff1919",
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(t._id)}
                          style={{
                            background: "#FF3366",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          ✕
                        </motion.button>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
