// App.jsx
import React, { useEffect, useState } from "react";

// --- Mock async API call to fetch transaction data ---
function fetchTransactions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // Customer 1
        { customer: "Alice", date: "2025-06-15", amount: 120 },
        { customer: "Alice", date: "2025-07-03", amount: 75 },
        { customer: "Alice", date: "2025-07-20", amount: 200 },
        { customer: "Alice", date: "2025-08-01", amount: 50 },

        // Customer 2
        { customer: "Bob", date: "2025-06-10", amount: 45 },
        { customer: "Bob", date: "2025-07-14", amount: 130 },
        { customer: "Bob", date: "2025-08-22", amount: 90 },

        // Customer 3
        { customer: "Carol", date: "2025-06-25", amount: 220 },
        { customer: "Carol", date: "2025-07-11", amount: 95 },
        { customer: "Carol", date: "2025-08-05", amount: 180 },
      ]);
    }, 800);
  });
}

// --- Function to calculate points for a single transaction ---
function calculatePoints(amount) {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2; // over $100
    points += 50; // between $50-$100
  } else if (amount > 50) {
    points += (amount - 50) * 1;
  }
  return points;
}

export default function App() {
  const [rewards, setRewards] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function processRewards() {
      const transactions = await fetchTransactions();
      const results = {};

      transactions.forEach(({ customer, date, amount }) => {
        const points = calculatePoints(amount);
        const month = new Date(date).toLocaleString("default", {
          month: "short",
        });

        if (!results[customer]) results[customer] = { total: 0 };
        if (!results[customer][month]) results[customer][month] = 0;

        results[customer][month] += points;
        results[customer].total += points;
      });

      setRewards(results);
      setLoading(false);
    }

    processRewards();
  }, []);

  if (loading) return <div className="p-6 text-lg">Loading rewards...</div>;

  // Collect all months for table headers
  const months = Array.from(
    new Set(
      Object.values(rewards)
        .flatMap((data) => Object.keys(data))
        .filter((k) => k !== "total")
    )
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reward Points Summary</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Customer</th>
              {months.map((m) => (
                <th key={m} className="border p-2">
                  {m}
                </th>
              ))}
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rewards).map(([customer, data]) => (
              <tr key={customer} className="text-center">
                <td className="border p-2 font-semibold">{customer}</td>
                {months.map((m) => (
                  <td key={m} className="border p-2">
                    {data[m] || 0}
                  </td>
                ))}
                <td className="border p-2 font-bold">{data.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
