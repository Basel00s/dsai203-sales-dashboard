// generate-mock.js
// Generates fake data for "Nexora Global" (DSAI 203 sales dashboard).
// Usage:  node generate-mock.js   -> writes JSON files into ./mock/
// A fixed random seed means everyone gets exactly the same data.
const fs = require("fs");
const path = require("path");

// ---- seeded random number generator (mulberry32) ----
let s = 20260121;
const rand = () => {
  s |= 0; s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const between = (a, b) => a + rand() * (b - a);
const round2 = (n) => Math.round(n * 100) / 100;

// ---- branches: 10 branches in 10 countries ----
// size = how big the branch is; growth = yearly growth trend
const branches = [
  { branch_id: 1,  country: "Egypt",        city: "Cairo",     region: "Middle East & Africa", lat: 30.0444,  lng: 31.2357,  manager: "Omar Hassan",     employees: 85,  opened_year: 2012, size: 1.0, growth: 1.14 },
  { branch_id: 2,  country: "Saudi Arabia", city: "Riyadh",    region: "Middle East & Africa", lat: 24.7136,  lng: 46.6753,  manager: "Khalid Al-Otaibi", employees: 110, opened_year: 2014, size: 1.5, growth: 1.10 },
  { branch_id: 3,  country: "UAE",          city: "Dubai",     region: "Middle East & Africa", lat: 25.2048,  lng: 55.2708,  manager: "Layla Mansour",   employees: 95,  opened_year: 2013, size: 1.7, growth: 1.09 },
  { branch_id: 4,  country: "Germany",      city: "Berlin",    region: "Europe",               lat: 52.52,    lng: 13.405,   manager: "Jonas Becker",    employees: 130, opened_year: 2010, size: 2.2, growth: 1.04 },
  { branch_id: 5,  country: "United Kingdom", city: "London",  region: "Europe",               lat: 51.5072,  lng: -0.1276,  manager: "Emma Clarke",     employees: 140, opened_year: 2009, size: 2.4, growth: 1.03 },
  { branch_id: 6,  country: "United States", city: "New York", region: "North America",        lat: 40.7128,  lng: -74.006,  manager: "Michael Turner",  employees: 190, opened_year: 2008, size: 3.2, growth: 1.06 },
  { branch_id: 7,  country: "Canada",       city: "Toronto",   region: "North America",        lat: 43.6532,  lng: -79.3832, manager: "Sophie Tremblay", employees: 90,  opened_year: 2015, size: 1.6, growth: 1.05 },
  { branch_id: 8,  country: "Brazil",       city: "São Paulo", region: "Latin America",        lat: -23.5505, lng: -46.6333, manager: "Rafael Souza",    employees: 105, opened_year: 2016, size: 1.8, growth: 0.97 },
  { branch_id: 9,  country: "India",        city: "Mumbai",    region: "Asia Pacific",         lat: 19.076,   lng: 72.8777,  manager: "Priya Sharma",    employees: 120, opened_year: 2017, size: 1.9, growth: 1.18 },
  { branch_id: 10, country: "Japan",        city: "Tokyo",     region: "Asia Pacific",         lat: 35.6762,  lng: 139.6503, manager: "Kenji Tanaka",    employees: 100, opened_year: 2011, size: 2.0, growth: 0.99 },
];

// ---- categories and products (price and cost per unit, in USD) ----
const categories = [
  { category_id: 1, category_name: "Electronics" },
  { category_id: 2, category_name: "Home & Kitchen" },
  { category_id: 3, category_name: "Fashion" },
  { category_id: 4, category_name: "Sports & Outdoors" },
  { category_id: 5, category_name: "Beauty & Care" },
];
const products = [
  { product_id: 1,  product_name: "Smartphone X",     category_id: 1, price: 650, cost: 520 },
  { product_id: 2,  product_name: "Laptop Pro 14",    category_id: 1, price: 1200, cost: 980 },
  { product_id: 3,  product_name: "Wireless Earbuds", category_id: 1, price: 90,  cost: 55 },
  { product_id: 4,  product_name: "Air Fryer",        category_id: 2, price: 110, cost: 68 },
  { product_id: 5,  product_name: "Coffee Machine",   category_id: 2, price: 180, cost: 118 },
  { product_id: 6,  product_name: "Vacuum Cleaner",   category_id: 2, price: 240, cost: 160 },
  { product_id: 7,  product_name: "Winter Jacket",    category_id: 3, price: 130, cost: 62 },
  { product_id: 8,  product_name: "Running Shoes",    category_id: 3, price: 95,  cost: 48 },
  { product_id: 9,  product_name: "Denim Jeans",      category_id: 3, price: 60,  cost: 27 },
  { product_id: 10, product_name: "Yoga Mat Set",     category_id: 4, price: 45,  cost: 20 },
  { product_id: 11, product_name: "Mountain Bike",    category_id: 4, price: 520, cost: 390 },
  { product_id: 12, product_name: "Fitness Tracker",  category_id: 4, price: 120, cost: 70 },
  { product_id: 13, product_name: "Skincare Set",     category_id: 5, price: 75,  cost: 24 },
  { product_id: 14, product_name: "Perfume 100ml",    category_id: 5, price: 105, cost: 38 },
  { product_id: 15, product_name: "Hair Dryer Pro",   category_id: 5, price: 85,  cost: 41 },
];

// How popular each product is (base units per month for a size-1 branch)
const baseUnits = { 1: 60, 2: 25, 3: 150, 4: 90, 5: 55, 6: 35, 7: 70, 8: 95, 9: 120, 10: 110, 11: 12, 12: 80, 13: 130, 14: 85, 15: 75 };

// Category preference per branch (some branches lean to certain categories)
// index = category_id - 1
const affinity = {
  1: [0.8, 1.2, 0.9, 0.9, 1.3], 2: [1.2, 1.0, 0.8, 0.7, 1.4],
  3: [1.4, 1.1, 0.7, 0.7, 1.3], 4: [1.1, 1.3, 1.0, 1.2, 0.8],
  5: [1.0, 1.1, 1.3, 1.0, 0.9], 6: [1.4, 0.8, 1.1, 1.2, 0.9],
  7: [1.0, 1.0, 1.0, 1.4, 0.8], 8: [0.8, 0.9, 1.4, 1.3, 1.2],
  9: [1.5, 0.8, 1.2, 0.7, 1.0], 10: [1.5, 1.1, 0.8, 0.9, 1.0],
};

// Seasonality by month (Jan..Dec): dip in summer, big peak in Nov/Dec
const season = [0.85, 0.82, 0.92, 0.95, 0.98, 0.9, 0.88, 0.92, 1.0, 1.08, 1.3, 1.45];

// ---- sales rows + targets ----
const sales = [];
const targets = [];
let sale_id = 1, target_id = 1;

for (const b of branches) {
  for (let y = 2024; y <= 2025; y++) {
    for (let m = 1; m <= 12; m++) {
      const monthIndex = (y - 2024) * 12 + (m - 1);
      const yearGrowth = Math.pow(b.growth, monthIndex / 12);
      const month = `${y}-${String(m).padStart(2, "0")}`;
      let monthRevenue = 0;

      for (const p of products) {
        const aff = affinity[b.branch_id][p.category_id - 1];
        const noise = between(0.85, 1.15);
        const units = Math.max(1, Math.round(baseUnits[p.product_id] * b.size * aff * season[m - 1] * yearGrowth * noise));
        // small discounts in Nov/Dec reduce margin a bit
        const discount = m >= 11 ? between(0.92, 0.97) : between(0.97, 1.0);
        const revenue = round2(units * p.price * discount);
        const cost = round2(units * p.cost);
        sales.push({ sale_id: sale_id++, month, branch_id: b.branch_id, product_id: p.product_id,
                     units, revenue, cost, profit: round2(revenue - cost) });
        monthRevenue += revenue;
      }

      // Target: usually a bit ABOVE or BELOW the real revenue, so some months miss it.
      // Branches 8 (Brazil) and 10 (Japan) get ambitious targets and miss often.
      const ambition = (b.branch_id === 8 || b.branch_id === 10) ? between(1.0, 1.15) : between(0.88, 1.06);
      targets.push({ target_id: target_id++, month, branch_id: b.branch_id,
                     target_revenue: Math.round(monthRevenue * ambition / 100) * 100 });
    }
  }
}

// ---- write files (drop internal fields from branches) ----
const outDir = path.join(__dirname, "mock");
fs.mkdirSync(outDir, { recursive: true });
const write = (name, data) => fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2));

write("branches.json", branches.map(({ size, growth, ...rest }) => rest));
write("categories.json", categories);
write("products.json", products);
write("sales.json", sales);
write("targets.json", targets);

console.log(`branches: ${branches.length}, products: ${products.length}, sales rows: ${sales.length}, targets: ${targets.length}`);
