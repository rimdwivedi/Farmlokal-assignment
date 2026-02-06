const db = require("../config/mysql");

async function getProducts({ cursor, limit, category, search, sort }) {
  let query = "SELECT * FROM products WHERE id > ?";
  let params = [cursor];

  // filter by category
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  // search by product name
  if (search) {
    query += " AND name LIKE ?";
    params.push(`%${search}%`);
  }

  // sorting
  if (sort === "price") {
    query += " ORDER BY price";
  } else {
    query += " ORDER BY id";
  }

  query += " LIMIT ?";
  params.push(limit);

  const [rows] = await db.query(query, params);
  return rows;
}

module.exports = { getProducts };
