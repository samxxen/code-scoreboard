// ── State ──────────────────────────────────────────────
let cachedItems = [];   // populated once by "setup"
let lastCops    = 0;

// ── Category config ────────────────────────────────────
const CATEGORIES = {
  robberies:  { label: 'ROBBERIES',  icon: 'fa-solid fa-mask' },
  kidnapping: { label: 'KIDNAPPING', icon: 'fa-solid fa-handcuffs' },
  other:      { label: 'OTHER',      icon: 'fa-solid fa-list' },
};

function getCatKey(item) {
  if (item.category) return item.category;
  const l = (item.label || '').toLowerCase();
  if (l.includes('kidnap'))              return 'kidnapping';
  if (l.includes('rob') || l.includes('bank') ||
      l.includes('store') || l.includes('jewel') ||
      l.includes('atm')  || l.includes('cash') ||
      l.includes('laund')|| l.includes('house') ||
      l.includes('fleeca'))              return 'robberies';
  return 'other';
}

// ── Message listener ───────────────────────────────────
window.addEventListener('message', (event) => {
  const d = event.data || {};
  if      (d.action === 'setup') Setup(d);
  else if (d.action === 'open')  Open(d);
  else if (d.action === 'close') Close();
});

// ── Setup — called once on resource start ──────────────
function Setup(data) {
  cachedItems = data.items || [];
  RenderList(cachedItems, 0); // render with 0 cops initially (dots = locked)
}

// ── Open — called every time player opens scoreboard ───
function Open(data) {
  lastCops = data.currentCops || 0;

  // If cards not yet rendered (timing edge-case), render now
  if (cachedItems.length === 0 && data.requiredCops) {
    const items = [];
    for (const [id, cfg] of Object.entries(data.requiredCops)) {
      items.push({ id, label: cfg.label, icon: cfg.icon,
                   category: cfg.category, order: cfg.order || 99,
                   minimumPolice: cfg.minimumPolice, busy: cfg.busy });
    }
    items.sort((a, b) => a.order - b.order);
    cachedItems = items;
    RenderList(cachedItems, lastCops);
  }

  // Stats
  $('#total-players').text(`${data.players || 0}/${data.maxPlayers || 0}`);
  $('#total-time').text(data.time || '0H:00M');
  $('#total-cops').text(lastCops);
  $('#total-ambulance').text(data.currentAmbulance || 0);
  $('#ca-cops').text(lastCops);
  $('#ca-ems').text(data.currentAmbulance || 0);

  // Police status badge
  if (lastCops < 3) {
    $('#police-status').attr('class', 'status-badge status-low');
    $('#status-label').text('Low Police');
  } else {
    $('#police-status').attr('class', 'status-badge status-ok');
    $('#status-label').text('Police Active');
  }

  // Update card dots
  if (data.requiredCops) {
    $.each(data.requiredCops, (key, cfg) => {
      const card = $(`.act-card[data-id="${key}"]`);
      if (!card.length) return;
      if (cfg.busy) {
        card.attr('data-state', 'busy');
        card.find('.act-status').html('<span class="act-dot"></span> BUSY');
      } else if (lastCops >= (cfg.minimumPolice || 0)) {
        card.attr('data-state', 'available');
        card.find('.act-status').html('<span class="act-dot"></span> AVAILABLE');
      } else {
        card.attr('data-state', 'locked');
        card.find('.act-status').html('<span class="act-dot"></span> LOCKED');
      }
    });
  }

  $('.sb-panel').fadeIn(140);
}

// ── Close ───────────────────────────────────────────────
function Close() { $('.sb-panel').fadeOut(110); }

// ── Icon map per activity id / label keywords ──────────
function iconFor(item) {
  if (item.icon) return item.icon;
  const l = (item.label || '').toLowerCase();
  if (l.includes('store'))                         return 'fa-solid fa-store';
  if (l.includes('atm'))                           return 'fa-solid fa-credit-card';
  if (l.includes('cash') || l.includes('laund'))   return 'fa-solid fa-money-bill-transfer';
  if (l.includes('jewel') || l.includes('vangelico')) return 'fa-solid fa-gem';
  if (l.includes('fleeca') || l.includes('bank'))  return 'fa-solid fa-building-columns';
  if (l.includes('house') || l.includes('luxury')) return 'fa-solid fa-house';
  if (l.includes('blaine') || l.includes('county'))return 'fa-solid fa-flag';
  if (l.includes('art') || l.includes('gallery'))  return 'fa-solid fa-paintbrush';
  if (l.includes('kidnap'))                        return 'fa-solid fa-handcuffs';
  if (l.includes('officer') || l.includes('cop'))  return 'fa-solid fa-shield-halved';
  if (l.includes('money') || l.includes('storm'))  return 'fa-solid fa-sack-dollar';
  if (l.includes('paleto'))                        return 'fa-solid fa-vault';
  return 'fa-solid fa-circle-dot';
}

// ── Render list grouped by category ────────────────────
function RenderList(items, cops) {
  const groups = {};
  items.forEach(item => {
    const cat = getCatKey(item);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });

  const catOrder = ['robberies', 'kidnapping', 'other'];
  Object.keys(groups).forEach(k => { if (!catOrder.includes(k)) catOrder.push(k); });

  let html = '';
  catOrder.forEach(cat => {
    if (!groups[cat] || groups[cat].length === 0) return;
    const catCfg = CATEGORIES[cat] || { label: cat.toUpperCase(), icon: 'fa-solid fa-list' };
    html += `<div class="sec-label"><i class="${catCfg.icon}"></i><span>${catCfg.label}</span></div>`;
    html += '<div class="cards-grid">';
    groups[cat].forEach(item => {
      const state      = stateFor(item, cops);
      const statusText = state === 'available' ? 'AVAILABLE' : state === 'busy' ? 'BUSY' : 'LOCKED';
      const ic         = iconFor(item);
      html += `
        <div class="act-card" data-id="${item.id}" data-state="${state}">
          <div class="act-top">
            <div class="act-icon"><i class="${ic}"></i></div>
            <div class="act-name">${item.label}</div>
          </div>
          <div class="act-status"><span class="act-dot"></span>${statusText}</div>
        </div>`;
    });
    html += '</div>';
  });

  $('#activity-list').html(html);
}

function stateFor(item, cops) {
  if (item.busy) return 'busy';
  if (cops >= (item.minimumPolice || 0)) return 'available';
  return 'locked';
}

// ── Net event for busy toggle ───────────────────────────
// (mirrored from client.lua SetActivityBusy)
window.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d.action === 'setBusy') {
    const card = $(`.act-card[data-id="${d.activity}"]`);
    if (!card.length) return;
    if (d.busy) {
      card.attr('data-state', 'busy');
      card.find('.act-status').html('<span class="act-dot"></span> BUSY');
    } else {
      // re-evaluate based on last known cop count
      const minPolice = parseInt(card.attr('data-min') || 0);
      const state = lastCops >= minPolice ? 'available' : 'locked';
      card.attr('data-state', state);
      card.find('.act-status').html(`<span class="act-dot"></span> ${state.toUpperCase()}`);
    }
  }
});
