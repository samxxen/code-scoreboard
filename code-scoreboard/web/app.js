let cachedItems = [];
let lastCops    = 0;

const CATEGORIES = {
  robberies:  { label: 'ROBBERIES',  icon: 'fa-solid fa-mask' },
  kidnapping: { label: 'KIDNAPPING', icon: 'fa-solid fa-handcuffs' },
  other:      { label: 'OTHER',      icon: 'fa-solid fa-list-ul' },
};

function getCatKey(item) {
  if (item.category) return item.category;
  const l = (item.label || '').toLowerCase();
  if (l.includes('kidnap'))                                    return 'kidnapping';
  if (l.includes('rob') || l.includes('bank') ||
      l.includes('store') || l.includes('jewel') ||
      l.includes('atm')  || l.includes('cash') ||
      l.includes('laund')|| l.includes('house') ||
      l.includes('fleeca'))                                    return 'robberies';
  return 'other';
}

function iconFor(item) {
  if (item.icon) return item.icon;
  const l = (item.label || '').toLowerCase();
  if (l.includes('store'))                               return 'fa-solid fa-store';
  if (l.includes('atm'))                                 return 'fa-solid fa-credit-card';
  if (l.includes('cash'))                                return 'fa-solid fa-money-bill-transfer';
  if (l.includes('laund'))                               return 'fa-solid fa-shirt';
  if (l.includes('jewel') || l.includes('vangelico'))    return 'fa-solid fa-gem';
  if (l.includes('fleeca') || l.includes('bank'))        return 'fa-solid fa-building-columns';
  if (l.includes('house') || l.includes('luxury'))       return 'fa-solid fa-house';
  if (l.includes('blaine') || l.includes('county'))      return 'fa-solid fa-flag';
  if (l.includes('art') || l.includes('gallery'))        return 'fa-solid fa-paintbrush';
  if (l.includes('kidnap'))                              return 'fa-solid fa-handcuffs';
  if (l.includes('officer') || l.includes('cop'))        return 'fa-solid fa-shield-halved';
  if (l.includes('money') || l.includes('storm'))        return 'fa-solid fa-sack-dollar';
  if (l.includes('paleto'))                              return 'fa-solid fa-vault';
  return 'fa-solid fa-circle-dot';
}

function stateFor(item, cops) {
  if (item.busy) return 'busy';
  if (cops >= (item.minimumPolice || 0)) return 'available';
  return 'locked';
}

window.addEventListener('message', (event) => {
  const d = event.data || {};
  if      (d.action === 'setup') Setup(d);
  else if (d.action === 'open')  Open(d);
  else if (d.action === 'close') Close();
  else if (d.action === 'setBusy') SetBusy(d);
});

function Setup(data) {
  cachedItems = data.items || [];
  RenderList(cachedItems, 0);
}

function Open(data) {
  lastCops = data.currentCops || 0;

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

  $('#total-players').text(`${data.players || 0}/${data.maxPlayers || 0}`);
  $('#total-time').text(data.time || '0H:00M');
  $('#total-cops').text(lastCops);
  $('#total-ambulance').text(data.currentAmbulance || 0);
  $('#ca-cops').text(lastCops);
  $('#ca-ems').text(data.currentAmbulance || 0);

  if (lastCops < 3) {
    $('#police-status').attr('class', 'status-badge status-low');
    $('#status-label').text('Low Police');
  } else {
    $('#police-status').attr('class', 'status-badge status-ok');
    $('#status-label').text('Police Active');
  }

  if (data.requiredCops) {
    $.each(data.requiredCops, (key, cfg) => {
      UpdateCard(key, cfg.busy, cfg.minimumPolice);
    });
  }

  $('.sb-panel').fadeIn(140);
}

function Close() { $('.sb-panel').fadeOut(110); }

function SetBusy(d) {
  const card = $(`.act-card[data-id="${d.activity}"]`);
  if (!card.length) return;
  const minPolice = parseInt(card.attr('data-min') || 0);
  UpdateCard(d.activity, d.busy, minPolice);
}

function UpdateCard(id, busy, minPolice) {
  const card = $(`.act-card[data-id="${id}"]`);
  if (!card.length) return;
  let state;
  if (busy)                    state = 'busy';
  else if (lastCops >= (minPolice || 0)) state = 'available';
  else                         state = 'locked';
  const label = state === 'available' ? 'AVAILABLE' : state === 'busy' ? 'BUSY' : 'LOCKED';
  card.attr('data-state', state);
  card.find('.act-status').html(`<span class="act-dot"></span>${label}`);
}

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
      const state  = stateFor(item, cops);
      const label  = state === 'available' ? 'AVAILABLE' : state === 'busy' ? 'BUSY' : 'LOCKED';
      const ic     = iconFor(item);
      html += `
        <div class="act-card" data-id="${item.id}" data-state="${state}" data-min="${item.minimumPolice || 0}">
          <div class="act-strip"><i class="${ic}"></i></div>
          <div class="act-body">
            <div class="act-name">${item.label}</div>
            <div class="act-status"><span class="act-dot"></span>${label}</div>
          </div>
        </div>`;
    });

    html += '</div>';
  });

  $('#activity-list').html(html);
}
