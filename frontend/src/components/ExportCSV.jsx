function ExportCSV({ transactions }) {
  const downloadCSV = () => {
    if (transactions.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = ["Date", "Description", "Category", "Type", "Amount(₹)"];

    const csvRows = transactions.map((t) => {
      const date = new Date(t.date).toLocaleDateString();
      const escapedDescription = `"${t.description.replace(/"/g, '""')}"`;

      return `${date},${escapedDescription},${t.category},${t.type},${t.amount}`;
    });

    const csvString = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "finance_report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadCSV}
      style={{
        padding: "10px 15px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "15px",
      }}
    >
      Export to CSV
    </button>
  );
}

export default ExportCSV;
