/* ပိုက်ဆံမှတ်တမ်း — frontend logic (vanilla JS) */
'use strict';

const CATS = [
  { id: 'food',         emoji: '🍜', my: 'အစားအသောက်', en: 'Food',         types: ['expense'] },
  { id: 'transport',    emoji: '🛵', my: 'သွားလာရေး',   en: 'Transport',    types: ['expense'] },
  { id: 'shopping',     emoji: '🛍️', my: 'ဈေးဝယ်',       en: 'Shopping',     types: ['expense'] },
  { id: 'bills',        emoji: '💡', my: 'ဘေလ်များ',     en: 'Bills',        types: ['expense'] },
  { id: 'health',       emoji: '💊', my: 'ကျန်းမာရေး',   en: 'Health',       types: ['expense'] },
  { id: 'entertainment',emoji: '🎬', my: 'ဖျော်ဖြေရေး',   en: 'Entertainment',types: ['expense'] },
  { id: 'salary',       emoji: '💼', my: 'လစာ',          en: 'Salary',       types: ['income'] },
  { id: 'business',     emoji: '🏪', my: 'လုပ်ငန်း',      en: 'Business',     types: ['income'] },
  { id: 'other',        emoji: '📦', my: 'အခြား',         en: 'Other',        types: ['income', 'expense'] },
];

const MONTHS = {
  my: ['ဇန်နဝါရီ','ဖေဖော်ဝါရီ','မတ်','ဧပြီ','မေ','ဇွန်','ဇူလိုင်','ဩဂုတ်','စက်တင်ဘာ','အောက်တိုဘာ','နိုဝင်ဘာ','ဒီဇင်ဘာ'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
};

const I18N = {
  my: {
    appName: 'ပိုက်ဆံမှတ်တမ်း', navHome: 'ပင်မ', navAdd: 'ထည့်ရန်', navHist: 'မှတ်တမ်း', navRep: 'အစီရင်ခံစာ',
    income: 'အဝင်', expense: 'အထွက်', balance: 'လက်ကျန်',
    recent: 'လတ်တလော မှတ်တမ်းများ', seeAll: 'အားလုံးကြည့်ရန်',
    emptyDash: 'ဒီလအတွက် မှတ်တမ်းမရှိသေးပါ။<br>အောက်က + ခလုတ်နဲ့ စတင်မှတ်ပါ။',
    addTitle: 'မှတ်တမ်းအသစ် ထည့်ရန်', editTitle: 'မှတ်တမ်း ပြင်ဆင်ရန်',
    amount: 'ပမာဏ (ကျပ်)', amountPh: 'ဥပမာ 5000', category: 'အမျိုးအစား',
    date: 'ရက်စွဲ', note: 'မှတ်ချက်', notePh: 'ဥပမာ နေ့လည်စာ',
    save: '💾 သိမ်းမည်', update: '💾 ပြင်ဆင်သိမ်းမည်', cancel: 'မလုပ်တော့ပါ',
    history: 'မှတ်တမ်းများ', allTypes: 'အဝင်အထွက် အားလုံး', allCats: 'ကဏ္ဍအားလုံး',
    emptyHist: 'မှတ်တမ်း မတွေ့ပါ။',
    reports: 'အစီရင်ခံစာ', last6: 'နောက်ဆုံး ၆ လ', byCat: 'ကဏ္ဍအလိုက် အထွက်',
    emptyRep: 'အစီရင်ခံစာအတွက် မှတ်တမ်းမရှိသေးပါ။',
    errAmount: 'ပမာဏ မှန်ကန်စွာ ထည့်ပါ (ကျပ်)။',
    errCat: 'အမျိုးအစား ရွေးပါ။',
    errDate: 'ရက်စွဲ မှန်ကန်စွာ ရွေးပါ။',
    confirmDelete: 'ဒီမှတ်တမ်းကို ဖျက်မှာ သေချာပါသလား?',
    del: 'ဖျက်မည်', edit: 'ပြင်မည်',
    today: 'ဒီနေ့', yesterday: 'မနေ့က',
    noNote: '—', kyat: 'ကျပ်',
    monthFmt: (y, m) => `${MONTHS.my[m - 1]} ${y}`,
    dateFmt: (d) => d,
  },
  en: {
    appName: 'Money Tracker', navHome: 'Home', navAdd: 'Add', navHist: 'History', navRep: 'Reports',
    income: 'Income', expense: 'Expense', balance: 'Balance',
    recent: 'Recent transactions', seeAll: 'See all',
    emptyDash: 'No records for this month yet.<br>Tap + below to add one.',
    addTitle: 'Add new record', editTitle: 'Edit record',
    amount: 'Amount (kyat)', amountPh: 'e.g. 5000', category: 'Category',
    date: 'Date', note: 'Note', notePh: 'e.g. lunch',
    save: '💾 Save', update: '💾 Update', cancel: 'Cancel',
    history: 'History', allTypes: 'All types', allCats: 'All categories',
    emptyHist: 'No records found.',
    reports: 'Reports', last6: 'Last 6 months', byCat: 'Expenses by category',
    emptyRep: 'No records for reports yet.',
    errAmount: 'Please enter a valid amount (kyat).',
    errCat: 'Please pick a category.',
    errDate: 'Please pick a valid date.',
    confirmDelete: 'Delete this record?',
    del: 'Delete', edit: 'Edit',
    today: 'Today', yesterday: 'Yesterday',
    noNote: '—', kyat: 'Ks',
    monthFmt: (y, m) => `${MONTHS.en[m - 1]} ${y}`,
    dateFmt: (d) => d,
  },
};

// ---------- state ----------
let lang = localStorage.getItem('mt-lang') || 'my';
let curMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
let formType = 'expense';
let formCat = '';
let editingId = null;
let curView = 'dashboard';

// ---------- helpers ----------
const $ = (id) => document.getElementById(id);
const t = (key) => I18N[lang][key];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function fmtKyat(n) {
  const num = Number(n) || 0;
  return num.toLocaleString('en-US') + ' ' + t('kyat');
}
function catOf(id) { return CATS.find((c) => c.id === id) || CATS[CATS.length - 1]; }
function catLabel(id) { return lang === 'my' ? catOf(id).my : catOf(id).en; }
function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return I18N[lang].monthFmt(y, m);
}
function dayLabel(dateStr) {
  const today = new Date().toISOString().slice(0, 10);
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yest = y.toISOString().slice(0, 10);
  if (dateStr === today) return t('today');
  if (dateStr === yest) return t('yesterday');
  return dateStr;
}
function shiftMonth(ym, delta) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

async function api(method, url, body) {
  const r = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data;
}

// ---------- i18n ----------
function applyLang() {
  document.documentElement.lang = lang === 'my' ? 'my' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = I18N[lang][el.dataset.i18n];
    if (typeof v === 'string') el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    el.placeholder = I18N[lang][el.dataset.i18nPh] || '';
  });
  $('langToggle').textContent = lang === 'my' ? 'EN' : 'မြန်မာ';
  renderCatGrid();
  renderCatFilter();
}

// ---------- navigation ----------
function showView(name) {
  curView = name;
  document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
  $('view-' + name).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach((b) =>
    b.classList.toggle('active', b.dataset.view === name));
  $('fab').style.display = name === 'add' ? 'none' : '';
  if (name === 'dashboard') loadDashboard();
  if (name === 'history') loadHistory();
  if (name === 'reports') loadReports();
  window.scrollTo(0, 0);
}

// ---------- transaction row ----------
function txRowHtml(tx) {
  const c = catOf(tx.category);
  const sign = tx.type === 'expense' ? '−' : '+';
  return `
    <div class="tx-item" data-id="${tx.id}">
      <div class="tx-emoji">${c.emoji}</div>
      <div class="tx-info">
        <div class="tx-cat">${esc(lang === 'my' ? c.my : c.en)}</div>
        <div class="tx-note">${esc(tx.note || t('noNote'))}</div>
      </div>
      <div class="tx-amt ${tx.type}">${sign} ${fmtKyat(tx.amount)}</div>
      ${curView === 'history' ? `
      <div class="tx-actions">
        <button class="mini-btn" data-act="edit" title="${esc(t('edit'))}">✏️</button>
        <button class="mini-btn" data-act="del" title="${esc(t('del'))}">🗑️</button>
      </div>` : ''}
    </div>`;
}

// ---------- dashboard ----------
async function loadDashboard() {
  $('monthLabel').textContent = monthLabel(curMonth);
  const s = await api('GET', `/api/summary?month=${curMonth}`);
  $('statIncome').textContent = fmtKyat(s.income);
  $('statExpense').textContent = fmtKyat(s.expense);
  $('statBalance').textContent = fmtKyat(s.balance);
  const data = await api('GET', `/api/transactions?month=${curMonth}`);
  const list = $('recentList');
  const txs = data.transactions.slice(0, 10);
  $('dashEmpty').classList.toggle('hidden', txs.length > 0);
  list.innerHTML = txs.map(txRowHtml).join('');
}

// ---------- add / edit form ----------
function renderCatGrid() {
  const grid = $('catGrid');
  grid.innerHTML = CATS.filter((c) => c.types.includes(formType)).map((c) => `
    <button type="button" class="cat-btn ${formCat === c.id ? 'selected' : ''}" data-cat="${c.id}">
      <span class="ce">${c.emoji}</span><span>${esc(lang === 'my' ? c.my : c.en)}</span>
    </button>`).join('');
  grid.querySelectorAll('.cat-btn').forEach((b) =>
    b.addEventListener('click', () => { formCat = b.dataset.cat; renderCatGrid(); }));
}

function resetForm() {
  editingId = null;
  formType = 'expense';
  formCat = '';
  $('fAmount').value = '';
  $('fNote').value = '';
  $('fDate').value = new Date().toISOString().slice(0, 10);
  $('formError').classList.add('hidden');
  $('addTitle').innerHTML = t('addTitle');
  $('saveBtn').innerHTML = t('save');
  $('cancelEditBtn').classList.add('hidden');
  syncTypeButtons();
  renderCatGrid();
}
function syncTypeButtons() {
  $('typeExpense').classList.toggle('active', formType === 'expense');
  $('typeIncome').classList.toggle('active', formType === 'income');
  $('typeExpense').dataset.t = 'expense';
  $('typeIncome').dataset.t = 'income';
}

async function saveTx() {
  const err = $('formError');
  err.classList.add('hidden');
  const amount = Number($('fAmount').value);
  if (!Number.isInteger(amount) || amount <= 0) { err.textContent = t('errAmount'); err.classList.remove('hidden'); return; }
  if (!formCat) { err.textContent = t('errCat'); err.classList.remove('hidden'); return; }
  const date = $('fDate').value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { err.textContent = t('errDate'); err.classList.remove('hidden'); return; }
  const body = { type: formType, amount, category: formCat, date, note: $('fNote').value.trim() };
  try {
    if (editingId) await api('PUT', `/api/transactions/${editingId}`, body);
    else await api('POST', '/api/transactions', body);
    curMonth = date.slice(0, 7);
    resetForm();
    showView('dashboard');
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  }
}

function startEdit(tx) {
  editingId = tx.id;
  formType = tx.type;
  formCat = tx.category;
  $('fAmount').value = tx.amount;
  $('fNote').value = tx.note || '';
  $('fDate').value = tx.date;
  $('addTitle').innerHTML = t('editTitle');
  $('saveBtn').innerHTML = t('update');
  $('cancelEditBtn').classList.remove('hidden');
  syncTypeButtons();
  renderCatGrid();
  showView('add');
}

// ---------- history ----------
function renderCatFilter() {
  const sel = $('hCat');
  const cur = sel.value;
  sel.innerHTML = `<option value="">${esc(I18N[lang].allCats)}</option>` +
    CATS.map((c) => `<option value="${c.id}">${c.emoji} ${esc(lang === 'my' ? c.my : c.en)}</option>`).join('');
  sel.value = cur;
}

async function loadHistory() {
  if (!$('hMonth').value) $('hMonth').value = curMonth;
  const month = $('hMonth').value;
  const type = $('hType').value;
  const category = $('hCat').value;
  let q = `/api/transactions?month=${month}`;
  if (type) q += `&type=${type}`;
  if (category) q += `&category=${category}`;
  const data = await api('GET', q);
  const txs = data.transactions;
  $('histEmpty').classList.toggle('hidden', txs.length > 0);
  // group by date
  const groups = {};
  for (const tx of txs) { (groups[tx.date] = groups[tx.date] || []).push(tx); }
  $('historyList').innerHTML = Object.keys(groups).sort().reverse().map((d) => `
    <div class="tx-day">
      <div class="tx-day-label">${esc(dayLabel(d))} · ${esc(d)}</div>
      <div class="tx-list">${groups[d].map(txRowHtml).join('')}</div>
    </div>`).join('');
  $('historyList').querySelectorAll('.tx-item').forEach((el) => {
    const id = Number(el.dataset.id);
    el.querySelector('[data-act="edit"]').addEventListener('click', async () => {
      const all = await api('GET', '/api/transactions');
      startEdit(all.transactions.find((x) => x.id === id));
    });
    el.querySelector('[data-act="del"]').addEventListener('click', async () => {
      if (!confirm(t('confirmDelete'))) return;
      await api('DELETE', `/api/transactions/${id}`);
      loadHistory();
    });
  });
}

// ---------- reports ----------
function barChartSVG(months) {
  // months: [{month, income, expense}]
  const W = 560, H = 240, padL = 8, padB = 34, padT = 14;
  const maxV = Math.max(1, ...months.map((m) => Math.max(m.income, m.expense)));
  const n = months.length;
  const slot = (W - padL * 2) / n;
  const barW = Math.min(26, slot / 3);
  let bars = '';
  months.forEach((m, i) => {
    const x = padL + slot * i + slot / 2;
    const ih = (m.income / maxV) * (H - padT - padB);
    const eh = (m.expense / maxV) * (H - padT - padB);
    const short = monthLabel(m.month).split(' ')[0].slice(0, 6);
    bars += `
      <rect x="${x - barW - 2}" y="${H - padB - ih}" width="${barW}" height="${Math.max(ih, 2)}" rx="3" fill="#16a34a"/>
      <rect x="${x + 2}" y="${H - padB - eh}" width="${barW}" height="${Math.max(eh, 2)}" rx="3" fill="#dc2626"/>
      <text x="${x}" y="${H - 10}" text-anchor="middle" font-size="11" fill="#6b7689">${esc(short)}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="100%">
    ${bars}
    <line x1="${padL}" y1="${H - padB}" x2="${W - padL}" y2="${H - padB}" stroke="#e5e9f2"/>
  </svg>
  <div class="chart-legend">
    <span><span class="legend-dot" style="background:#16a34a"></span>${esc(t('income'))}</span>
    <span><span class="legend-dot" style="background:#dc2626"></span>${esc(t('expense'))}</span>
  </div>`;
}

function donutSVG(items) {
  // items: [{category, total}]
  const total = items.reduce((a, b) => a + b.total, 0);
  if (!total) return '';
  const R = 70, C = 2 * Math.PI * R;
  const COLORS = ['#7c3aed','#2563eb','#16a34a','#dc2626','#f59e0b','#ec4899','#06b6d4','#84cc16','#f97316'];
  let off = 0;
  const segs = items.map((it, i) => {
    const frac = it.total / total;
    const s = `<circle cx="90" cy="90" r="${R}" fill="none" stroke="${COLORS[i % COLORS.length]}"
      stroke-width="28" stroke-dasharray="${(frac * C).toFixed(1)} ${C.toFixed(1)}"
      stroke-dashoffset="${(-off * C).toFixed(1)}" transform="rotate(-90 90 90)"/>`;
    off += frac;
    return s;
  }).join('');
  return `<svg viewBox="0 0 180 180" width="180" height="180">${segs}
    <text x="90" y="86" text-anchor="middle" font-size="15" font-weight="700" fill="#1a2233">${fmtKyat(total).split(' ').slice(0,-1).join(' ')}</text>
    <text x="90" y="106" text-anchor="middle" font-size="12" fill="#6b7689">${esc(t('kyat'))}</text>
  </svg>`;
}

async function loadReports() {
  const months = [];
  for (let i = 5; i >= 0; i--) months.push(shiftMonth(curMonth, -i));
  const sums = await Promise.all(months.map((m) => api('GET', `/api/summary?month=${m}`)));
  const series = months.map((m, i) => ({ month: m, income: sums[i].income, expense: sums[i].expense }));
  const hasAny = series.some((s) => s.income > 0 || s.expense > 0);
  $('repEmpty').classList.toggle('hidden', hasAny);
  $('barChart').innerHTML = hasAny ? barChartSVG(series) : '';
  // donut for current month expenses
  const cur = sums[5];
  $('donutMonth').textContent = monthLabel(curMonth);
  const expCats = cur.byCategory.filter((c) => c.type === 'expense');
  $('donutChart').innerHTML = expCats.length ? donutSVG(expCats) : `<div class="empty"><p>${esc(t('emptyRep'))}</p></div>`;
  const tot = expCats.reduce((a, b) => a + b.total, 0) || 1;
  $('catTotals').innerHTML = expCats.map((c) => {
    const cat = catOf(c.category);
    const pct = Math.round((c.total / tot) * 100);
    return `<div class="cat-total-row">
      <div class="tx-emoji">${cat.emoji}</div>
      <div class="tx-info"><div class="tx-cat">${esc(catLabel(c.category))}</div></div>
      <div class="cat-bar"><div style="width:${pct}%;background:#7c3aed"></div></div>
      <div class="tx-amt expense">${fmtKyat(c.total)}</div>
    </div>`;
  }).join('');
}

// ---------- wire up ----------
document.addEventListener('DOMContentLoaded', () => {
  $('langToggle').addEventListener('click', () => {
    lang = lang === 'my' ? 'en' : 'my';
    localStorage.setItem('mt-lang', lang);
    applyLang();
    if (curView === 'dashboard') loadDashboard();
    if (curView === 'history') loadHistory();
    if (curView === 'reports') loadReports();
  });

  document.querySelectorAll('.nav-btn').forEach((b) =>
    b.addEventListener('click', () => {
      if (b.dataset.view === 'add') resetForm();
      showView(b.dataset.view);
    }));

  $('fab').addEventListener('click', () => { resetForm(); showView('add'); });
  $('seeAllBtn').addEventListener('click', () => showView('history'));

  $('monthPrev').addEventListener('click', () => { curMonth = shiftMonth(curMonth, -1); loadDashboard(); });
  $('monthNext').addEventListener('click', () => { curMonth = shiftMonth(curMonth, 1); loadDashboard(); });

  $('typeExpense').addEventListener('click', () => { formType = 'expense'; formCat = ''; syncTypeButtons(); renderCatGrid(); });
  $('typeIncome').addEventListener('click', () => { formType = 'income'; formCat = ''; syncTypeButtons(); renderCatGrid(); });
  $('saveBtn').addEventListener('click', saveTx);
  $('cancelEditBtn').addEventListener('click', () => { resetForm(); showView('history'); });

  ['hMonth', 'hType', 'hCat'].forEach((id) =>
    $(id).addEventListener('change', loadHistory));

  applyLang();
  resetForm();
  showView('dashboard');
});
