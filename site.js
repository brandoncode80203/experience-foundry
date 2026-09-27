function readRows(key){ try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } }
function saveRows(key, rows){ localStorage.setItem(key, JSON.stringify(rows)); }

document.querySelector('#propertyForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const row = Object.fromEntries(new FormData(form).entries());
  row.createdAt = new Date().toISOString();
  row.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  const rows = readRows('popUpExperienceLeads');
  rows.push(row);
  saveRows('popUpExperienceLeads', rows);
  document.querySelector('#propertyMessage').hidden = false;
  form.reset();
});
