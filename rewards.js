// rewards.js

// --- Mock async API call to fetch transaction data ---
function fetchTransactions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // Customer 1 transactions
        { customer: "Alice", date: "2025-06-15", amount: 120 },
        { customer: "Alice", date: "2025-07-03", amount: 75 },
        { customer: "Alice", date: "2025-07-20", amount: 200 },
        { customer: "Alice", date: "2025-08-01", amount: 50 },

        // Customer 2 transactions
        { customer: "Bob", date: "2025-06-10", amount: 45 },
        { customer: "Bob", date: "2025-07-14", amount: 130 },
        { customer: "Bob", date: "2025-08-22", amount: 90 },

        // Customer 3 transactions
        { customer: "Carol", date: "2025-06-25", amount: 220 },
        { customer: "Carol", date: "2025-07-11", amount: 95 },
        { customer: "Carol", date: "2025-08-05", amount: 180 },
      ]);
    }, 1000); // Simulate API delay
  });
}

// --- Function to calculate points for a single transaction ---
function calculatePoints(amount) {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2; // 2 points for every dollar over $100
    points += 50;                 // 1 point for each dollar between $50 and $100
  } else if (amount > 50) {
    points += (amount - 50) * 1;  // 1 point for each dollar between $50 and $100
  }
  return points;
}

// --- Main function to process rewards ---
async function processRewards() {
  const transactions = await fetchTransactions();

  // Aggregate results: { customer: { month: points, total: points } }
  const rewards = {};

  transactions.forEach(({ customer, date, amount }) => {
    const points = calculatePoints(amount);
    const month = new Date(date).toLocaleString("default", { month: "short" });

    if (!rewards[customer]) {
      rewards[customer] = { total: 0 };
    }
    if (!rewards[customer][month]) {
      rewards[customer][month] = 0;
    }

    rewards[customer][month] += points;
    rewards[customer].total += points;
  });

  return rewards;
}

// --- Run and print results ---
processRewards().then((rewards) => {
  console.log("Reward Points Summary:\n");
  for (const [customer, data] of Object.entries(rewards)) {
    console.log(`Customer: ${customer}`);
    for (const [key, value] of Object.entries(data)) {
      if (key !== "total") {
        console.log(`   ${key}: ${value} points`);
      }
    }
    console.log(`   Total: ${data.total} points\n`);
  }
});
