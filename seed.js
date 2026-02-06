require("dotenv").config();
const db = require("./src/config/mysql");

async function seed() {
  console.log("🚀 Starting Seed Process...");
  try {
    // 1. Create test data
    const categories = ["Fresh Produce", "Dairy", "Bakery", "Meat"];
    const values = [];
    
    for (let i = 0; i < 50; i++) {
      values.push([
        `Product ${i}`,
        categories[Math.floor(Math.random() * categories.length)],
        (Math.random() * 100).toFixed(2),
        "FarmLokal Hyperlocal Item"
      ]);
    }

    // 2. Insert into DB
    const query = "INSERT INTO products (name, category, price, description) VALUES ?";
    await db.query(query, [values]);
    
    console.log("✅ Success! 50 products inserted. You can now test your API.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.log("Tip: Make sure your MySQL is running and the 'products' table exists.");
  } finally {
    process.exit();
  }
}

seed();