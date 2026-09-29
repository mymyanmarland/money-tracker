// ပိုက်ဆံမှတ်တမ်း (Money Tracker) — Tech Stack 2: Node/Express + node:sqlite + vanilla JS
const express = require('express');
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- Database ----
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, 'money.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK (type IN ('income','expense')),
    amount INTEGER NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL,
    note TEXT DEFAULT '',
    date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(date);
`);

const VALID_CATEGORIES = new Set([
  'food','transport','shopping','bills','health','entertainment',
  'salary','business','other'
]);

function validDate(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));
}

function validateTx(body) {
  const errors = [];
  if (body.type !== 'income' && body.type !== 'expense') errors.push('type must be income|expense');
  const amount = Number(body.amount);
  if (!Number.isInteger(amount) || amount <= 0) errors.push('amount must be a positive integer (kyat)');
  if (!VALID_CATEGORIES.has(body.category)) errors.push('invalid category');
  if (!validDate(body.date)) errors.push('date must be YYYY-MM-DD');
  if (body.note !== undefined && typeof body.note !== 'string') errors.push('note must be a string');
  return errors;
}

// ---- API ----

// GET /api/transactions?month=YYYY-MM&type=&category=
app.get('/api/transactions', (req, res) => {
  const { month, type, category } = req.query;
  const conds = [];
  const params = [];
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    conds.push("substr(date,1,7) = ?");
    params.push(month);
  }
  if (type === 'income' || type === 'expense') {
    conds.push("type = ?");
    params.push(type);
  }
  if (category && VALID_CATEGORIES.has(category)) {
    conds.push("category = ?");
    params.push(category);
  }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  const rows = db.prepare(
    `SELECT * FROM transactions ${where} ORDER BY date DESC, id DESC`
  ).all(...params);
  res.json({ transactions: rows });
});

// POST /api/transactions
app.post('/api/transactions', (req, res) => {
  const errors = validateTx(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join('; ') });
  const { type, amount, category, date, note } = req.body;
  const r = db.prepare(
    `INSERT INTO transactions (type, amount, category, note, date) VALUES (?, ?, ?, ?, ?)`
  ).run(type, Number(amount), category, (note || '').slice(0, 500), date);
  const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json(row);
});

// PUT /api/transactions/:id
app.put('/api/transactions/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });
  const errors = validateTx(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join('; ') });
  const exists = db.prepare('SELECT id FROM transactions WHERE id = ?').get(id);
  if (!exists) return res.status(404).json({ error: 'not found' });
  const { type, amount, category, date, note } = req.body;
  db.prepare(
    `UPDATE transactions SET type=?, amount=?, category=?, note=?, date=? WHERE id=?`
  ).run(type, Number(amount), category, (note || '').slice(0, 500), date, id);
  res.json(db.prepare('SELECT * FROM transactions WHERE id = ?').get(id));
});

// DELETE /api/transactions/:id
app.delete('/api/transactions/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });
  const r = db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
  if (r.changes === 0) return res.status(404).json({ error: 'not found' });
  res.json({ deleted: id });
});

// GET /api/summary?month=YYYY-MM
app.get('/api/summary', (req, res) => {
  let month = req.query.month;
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    month = new Date().toISOString().slice(0, 7);
  }
  const totals = db.prepare(`
    SELECT type, COALESCE(SUM(amount),0) AS total
    FROM transactions WHERE substr(date,1,7) = ?
    GROUP BY type
  `).all(month);
  let income = 0, expense = 0;
  for (const t of totals) {
    if (t.type === 'income') income = t.total;
    if (t.type === 'expense') expense = t.total;
  }
  const byCategory = db.prepare(`
    SELECT type, category, COALESCE(SUM(amount),0) AS total, COUNT(*) AS count
    FROM transactions WHERE substr(date,1,7) = ?
    GROUP BY type, category ORDER BY total DESC
  `).all(month);
  res.json({ month, income, expense, balance: income - expense, byCategory });
});

// GET /api/months — distinct YYYY-MM values present (for reports range)
app.get('/api/months', (req, res) => {
  const rows = db.prepare(
    `SELECT DISTINCT substr(date,1,7) AS month FROM transactions ORDER BY month DESC`
  ).all();
  res.json({ months: rows.map(r => r.month) });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`ပိုက်ဆံမှတ်တမ်း running on http://localhost:${PORT}`);
});
