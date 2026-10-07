const tableList = document.getElementById('table-list');
const tableContent = document.getElementById('table-content');
const activeTable = document.getElementById('active-table');
const rowCount = document.getElementById('row-count');
const connectionStatus = document.getElementById('connection-status');
const databasePath = document.getElementById('database-path');
let selectedTable = '';

async function loadTables() {
  try {
    const response = await fetch('/api/tables');
    if (!response.ok) throw new Error('Backend is not responding.');
    const result = await response.json();
    connectionStatus.textContent = 'Database connected';
    const health = await fetch('/api/health').then((item) => item.json());
    databasePath.textContent = health.database;
    tableList.innerHTML = result.tables.map((table) => `
      <button class="table-link ${table.name === selectedTable ? 'active' : ''}" data-table="${escapeHTML(table.name)}" type="button">
        <span>${escapeHTML(table.name)}</span><span>${table.count}</span>
      </button>
    `).join('');
    tableList.querySelectorAll('[data-table]').forEach((button) => {
      button.addEventListener('click', () => loadRecords(button.dataset.table));
    });
    if (selectedTable) await loadRecords(selectedTable);
  } catch (error) {
    connectionStatus.textContent = 'Backend unavailable';
    tableContent.innerHTML = `<p class="error-state">${escapeHTML(error.message)} Run <code>python server.py</code> from the backend folder.</p>`;
  }
}

async function loadRecords(table) {
  selectedTable = table;
  activeTable.textContent = table;
  tableContent.innerHTML = '<p class="empty-state">Loading rows...</p>';
  const response = await fetch(`/api/records?table=${encodeURIComponent(table)}`);
  const result = await response.json();
  if (!response.ok) {
    tableContent.innerHTML = `<p class="error-state">${escapeHTML(result.error || 'Could not load table.')}</p>`;
    return;
  }
  rowCount.textContent = `${result.rows.length} row${result.rows.length === 1 ? '' : 's'} shown (latest 500)`;
  if (!result.rows.length) {
    tableContent.innerHTML = '<p class="empty-state">This table has no records yet.</p>';
    return;
  }
  tableContent.innerHTML = `<table><thead><tr>${result.columns.map((column) => `<th>${escapeHTML(column)}</th>`).join('')}</tr></thead><tbody>${result.rows.map((row) => `<tr>${result.columns.map((column) => `<td>${escapeHTML(formatCell(row[column]))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  tableList.querySelectorAll('[data-table]').forEach((button) => button.classList.toggle('active', button.dataset.table === table));
}

function formatCell(value) {
  return value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);
}

document.getElementById('refresh-button').addEventListener('click', loadTables);
loadTables();