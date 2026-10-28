(() => {
  'use strict';
  const records = window.PARPAL_RESULTS || [];
  const verified = records.filter(r => r.distance !== null && r.official && r.net);
  const pending = records.filter(r => !verified.includes(r));
  let distance = '21';
  const body = document.querySelector('#results-body');
  const search = document.querySelector('#search');
  const sort = document.querySelector('#sort');
  const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const seconds = time => time.split(':').reduce((total, n) => total * 60 + Number(n), 0);
  const fullName = name => name.toLocaleLowerCase('es').replace(/(^|[\s-])\p{L}/gu, letter => letter.toLocaleUpperCase('es'));
  const km = n => `${String(n).replace('.', ',')} km`;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  document.querySelector('#total-count').textContent = verified.length;
  for (const [value, id] of [[21, 'count-21'], [10.5, 'count-10'], [6, 'count-6']]) {
    document.getElementById(id).textContent = verified.filter(r => r.distance === value).length;
  }
  document.querySelector('#pending-count').textContent = pending.length;
  document.querySelector('#pending-list').replaceChildren(...pending.map(r => make('li', '', fullName(r.name))));
  document.querySelector('.pending').hidden = !pending.length;

  function render() {
    const query = normalize(search.value.trim());
    const rows = verified.filter(r => (distance === 'all' || String(r.distance) === distance) && (!query || normalize(r.name).includes(query) || String(r.bib).includes(query)));
    rows.sort((a, b) => {
      if (distance === 'all' && a.distance !== b.distance) return b.distance - a.distance;
      if (sort.value === 'name') return a.name.localeCompare(b.name, 'es');
      return seconds(a[sort.value]) - seconds(b[sort.value]) || a.name.localeCompare(b.name, 'es');
    });
    const fragment = document.createDocumentFragment();
    rows.forEach(r => {
      const tr = make('tr');
      const nameCell = make('td', 'name-cell');
      const person = make('div', 'person');
      const initials = r.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('');
      const avatar = make('span', 'avatar', initials);
      avatar.setAttribute('aria-hidden', 'true');
      person.append(avatar, make('span', '', fullName(r.name)));
      nameCell.append(person);
      const distanceCell = make('td', 'distance-cell');
      distanceCell.append(make('span', 'distance-badge', km(r.distance)));
      const bib = make('td', 'bib', r.bib);
      const official = make('td', 'time', r.official);
      official.dataset.label = 'TIEMPO OFICIAL';
      const net = make('td', 'time net', r.net);
      net.dataset.label = 'TIEMPO REAL';
      tr.append(nameCell, distanceCell, bib, official, net);
      fragment.append(tr);
    });
    body.replaceChildren(fragment);
    const scope = distance === 'all' ? 'todas las distancias' : km(distance);
    document.querySelector('#result-count').textContent = `${rows.length} ${rows.length === 1 ? 'resultado' : 'resultados'} · ${scope}`;
    document.querySelector('#empty-state').hidden = rows.length !== 0;
    document.querySelector('table').hidden = rows.length === 0;
  }

  function selectDistance(value) {
    distance = value;
    document.querySelectorAll('[data-distance]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.distance === value)));
    render();
  }
  document.querySelectorAll('[data-distance]').forEach(button => button.addEventListener('click', () => selectDistance(button.dataset.distance)));
  document.querySelectorAll('[data-distance-link]').forEach(link => link.addEventListener('click', () => { search.value = ''; selectDistance(link.dataset.distanceLink); }));
  document.querySelector('#reset-search').addEventListener('click', () => { search.value = ''; selectDistance('all'); search.focus(); });
  search.addEventListener('input', render);
  sort.addEventListener('change', render);
  render();
})();
