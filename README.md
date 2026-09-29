# ပိုက်ဆံမှတ်တမ်း (Money Tracker)

Myanmar-first personal expense tracker. Tech Stack 2: Node.js + Express + node:sqlite + vanilla JS. Bilingual Myanmar/English (Myanmar default), mobile-first.

## Run

```bash
npm install
npm start
```

Open http://localhost:3000 (or `$PORT`).

## Features

- **Dashboard** — current-month income / expense / balance cards + recent transactions, month navigator
- **Add** — expense/income toggle, kyat amount, emoji category grid, date (defaults today), note; edit existing records
- **History** — grouped by date, filter by month / type / category, edit + delete (with confirm)
- **Reports** — last-6-months income-vs-expense bar chart + expense-by-category donut (inline SVG, no external libs)
- Amounts formatted with thousands separators + ကျပ် suffix
- SQLite persistence at `data/money.db`

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions?month=YYYY-MM&type=&category=` | list transactions |
| POST | `/api/transactions` | create `{type, amount, category, date, note}` |
| PUT | `/api/transactions/:id` | update |
| DELETE | `/api/transactions/:id` | delete |
| GET | `/api/summary?month=YYYY-MM` | totals + per-category breakdown |
| GET | `/api/months` | distinct months present |
| GET | `/api/health` | health check |

## License

MIT
