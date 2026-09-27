const cfg = window.EVENT_CONFIG || {};
const by = (sel) => document.querySelector(sel);
const all = (sel) => [...document.querySelectorAll(sel)];

all('[data-property-name]').forEach(el => el.textContent = cfg.propertyName || 'Your Apartment Community Name Here');
all('[data-event-name]').forEach(el => el.textContent = cfg.eventName || 'Resident 360° Experience');
all('[data-event-date]').forEach(el => el.textContent = cfg.date || 'Date coming soon');
all('[data-event-time]').forEach(el => el.textContent = cfg.time || 'Time coming soon');
all('[data-event-location]').forEach(el => el.textContent = cfg.location || 'Community / Party Room');

const slot = by('#timeSlotSelect');
if (slot) {
  slot.innerHTML = '<option value="">Choose</option>' + (cfg.timeSlots || []).map(s => `<option>${s}</option>`).join('');
}

function getArray(key){
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function setArray(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

by('#rsvpForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget).entries());
  data.updatesOk = new FormData(e.currentTarget).has('updatesOk');
  data.createdAt = new Date().toISOString();
  data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  const rows = getArray('residentPopUpRsvps');
  rows.push(data);
  setArray('residentPopUpRsvps', rows);
  by('#confirmText').textContent = `Thanks, ${data.firstName}! Your ${data.timeSlot} preference is saved for a party of ${data.partySize}.`;
  const d = by('#confirmDialog');
  if (d?.showModal) d.showModal(); else alert('RSVP saved. Thank you!');
  e.currentTarget.reset();
});

by('#closeDialog')?.addEventListener('click', () => by('#confirmDialog')?.close());

by('#socialForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const row = {socialUrl: fd.get('socialUrl'), permission: fd.has('permission'), createdAt:new Date().toISOString()};
  const rows = getArray('residentPopUpSocial');
  rows.push(row); setArray('residentPopUpSocial', rows);
  by('#socialMessage').hidden = false;
  e.currentTarget.reset();
});
