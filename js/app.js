/* ============================================================
   ЛогоЗверята — логика интерфейса
   ============================================================ */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const D = window.LM_DATA;
  const STORE_KEY = 'logomir_v1';
  const STAGES = [
    ['syllables', 'Слоги'],
    ['words', 'Слова'],
    ['phrases', 'Фразы'],
    ['twisters', 'Скороговорки']
  ];

  // ---------- Хранилище ----------
  function store() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { name: '', sessions: [], mastery: {} };
  }
  function save(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) { /* ignore */ }
  }

  // ---------- Состояние ----------
  const state = {
    nav: 'home',
    soundId: null, stage: 'syllables', i: 0,
    playId: null
  };

  const screens = {
    home: $('#scr-home'), sounds: $('#scr-sounds'), sound: $('#scr-sound'),
    artic: $('#scr-artic'), play: $('#scr-play'), progress: $('#scr-progress')
  };

  // ---------- Озвучка ----------
  let voices = [];
  function loadVoices() { voices = speechSynthesis.getVoices(); }
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  function ruVoice() {
    return voices.find(v => v.lang && v.lang.toLowerCase().indexOf('ru') === 0) || null;
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) return false;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ru-RU';
      const v = ruVoice();
      if (v) u.voice = v;
      u.rate = 0.8; u.pitch = 1.1;
      speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }

  // ---------- Утилиты ----------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function todayISO() { return new Date().toISOString().slice(0, 10); }
  function shortDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }

  function record(section, soundId, ok) {
    const p = store();
    p.sessions.push({ d: todayISO(), s: section, sound: soundId || '', ok: ok ? 1 : 0, at: Date.now() });
    if (soundId && ok) {
      const m = p.mastery[soundId] = p.mastery[soundId] || { ok: 0, total: 0 };
      m.ok++; m.total++;
    } else if (soundId) {
      const m = p.mastery[soundId] = p.mastery[soundId] || { ok: 0, total: 0 };
      m.total++;
    }
    save(p);
  }

  function totalSessions() {
    const p = store();
    return [...new Set(p.sessions.filter(s => s.s === 'sound').map(s => s.d))].length;
  }
  function masteredCount() {
    const p = store();
    return D.sounds.filter(s => {
      const m = p.mastery[s.id];
      return m && m.total >= 6 && m.ok / m.total >= 0.7;
    }).length;
  }

  // ---------- Навигация ----------
  function navigate(target) {
    state.nav = target;
    $$('.screen').forEach(el => el.classList.remove('active'));
    const scr = screens[target];
    if (scr) scr.classList.add('active');
    $$('#nav button').forEach(b => b.classList.toggle('on', b.dataset.nav === target));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    render();
  }

  // ---------- Экран: ГЛАВНАЯ ----------
  function renderHome() {
    const p = store();
    const name = p.name ? ', ' + esc(p.name) : '';
    const sessions = totalSessions();
    const mastered = masteredCount();
    screens.home.innerHTML = `
      <div class="hero">
        <div class="hi">Привет${name}!</div>
        <h1>Поговорим<br>сегодня?</h1>
        <div class="sub">Лисёнок Ля и зверята помогут звукам зазвучать правильно.</div>
        <span class="mascot wob">🦊</span>
      </div>
      <div class="sections">
        <div class="sec" data-go="sounds"><span class="ico">🔊</span><b>Учим звуки</b><small>слоги, слова, фразы</small></div>
        <div class="sec" data-go="artic"><span class="ico">😝</span><b>Гимнастика</b><small>язычок-силач</small></div>
        <div class="sec" data-go="play"><span class="ico">🦆</span><b>Кто говорит?</b><small>запуск речи</small></div>
        <div class="sec" data-go="progress"><span class="ico">⭐</span><b>Наши успехи</b><small>для родителей</small></div>
      </div>
      ${sessions || mastered ? `
      <div class="card" style="margin-top:14px">
        <p class="card-title">Заметка для родителей</p>
        <p class="card-sub">Короткая сводка за сегодня.</p>
        <div class="stat-row" style="margin:0">
          <div class="stat"><div class="n">${sessions}</div><div class="l">дней занятий</div></div>
          <div class="stat"><div class="n">${mastered}</div><div class="l">звуков почти освоено</div></div>
        </div>
      </div>` : ''}
    `;
    $$('[data-go]', screens.home).forEach(b => b.onclick = () => navigate(b.dataset.go));
  }

  // ---------- Экран: ЗВУКИ ----------
  function renderSounds() {
    const p = store();
    screens.sounds.innerHTML = `
      <div class="card">
        <p class="card-title">Выбери зверёнка-звук</p>
        <p class="card-sub">Нажми на зверька, чей звук тренируем. Сначала — слоги, потом слова и фразы.</p>
      </div>
      <div class="grid-3">
        ${D.sounds.map(s => {
          const m = p.mastery[s.id];
          const pct = m && m.total ? Math.round(m.ok / m.total * 100) : 0;
          return `
            <button class="pill sound-pill" data-sound="${s.id}">
              <span class="m">${s.emoji}</span>
              <span class="t">${s.letter}</span>
              <span class="k">${s.animal}${m && m.total ? ' · ' + pct + '%' : ''}</span>
            </button>`;
        }).join('')}
      </div>
    `;
    $$('.sound-pill', screens.sounds).forEach(b => {
      b.onclick = () => { state.soundId = b.dataset.sound; state.stage = 'syllables'; state.i = 0; navigate('sound'); };
    });
  }

  // ---------- Экран: ЗАНЯТИЕ ПО ЗВУКУ ----------
  function soundItems(sound, stage) {
    const list = sound.stages[stage];
    return list.map(it => {
      if (stage === 'words' && Array.isArray(it)) return { art: it[1], txt: it[0], say: it[0] };
      if (stage === 'syllables') return { art: `<span class="colorLetter" style="background:${sound.color}">${sound.letter}${it}</span>`, txt: '', say: it };
      return { art: stage === 'phrases' ? '🎤' : '📖', txt: it, say: it };
    });
  }

  function renderSound() {
    const sound = D.sounds.find(s => s.id === state.soundId);
    if (!sound) { navigate('sounds'); return; }
    const items = soundItems(sound, state.stage);
    const total = items.length;
    const done = state.i;
    const current = items[Math.min(done, total - 1)];
    const finished = done >= total;
    const stageIndex = STAGES.findIndex(s => s[0] === state.stage);

    let body = '';
    if (finished) {
      body = `
        <div class="sound-head">
          <span class="big" style="background:${sound.color}">${sound.emoji}</span>
          <span><b>Молодец!</b><small>${STAGES[stageIndex][1]} готовы</small></span>
        </div>
        <div class="play-big pop">
          <div class="face">🎉</div>
          <div class="said" style="color:${sound.color}">Звук «${sound.letter}» — супер!</div>
          <div class="hint">Немного отдохни — и продолжим.</div>
        </div>
        <div class="ctrl">
          ${stageIndex < STAGES.length - 1
            ? `<button class="btn ok" id="nextStage">Дальше: ${STAGES[stageIndex + 1][1]}</button>`
            : `<button class="btn ok" id="toSounds">К звукам</button>`}
        </div>
        <div style="height:14px"></div>
        <div class="ctrl">
          <button class="btn again" id="againAll">🔁 Ещё круг</button>
        </div>`;
    } else {
      body = `
        <div class="sound-head">
          <span class="big" style="background:${sound.color}">${sound.emoji}</span>
          <span><b>Звук «${sound.letter}»</b><small>${sound.animal} ${STAGES[stageIndex][0] === 'twisters' ? 'тараторит' : 'помогает'}</small></span>
        </div>
        <div class="stage-tabs">
          ${STAGES.map((st, idx) => `
            <button class="stage-tab ${idx === stageIndex ? 'on' : ''}" data-stage="${st[0]}">${st[1]}</button>`).join('')}
        </div>
        <div class="word-card pop">
          <div class="stage-label">${STAGES[stageIndex][1]} · ${done + 1} из ${total}</div>
          <div class="art">${current.art}</div>
          ${current.txt ? `<div class="txt">${esc(current.txt)}</div>` : ''}
          <button class="btn-speak" id="say">🔊</button>
        </div>
        <div class="ctrl">
          <button class="btn ok" id="gotIt">✅ Получилось!</button>
          <button class="btn again" id="again">🔁 Ещё раз</button>
        </div>
        <div style="text-align:center;margin-top:10px">
          <button class="skip" id="skip">пропустить ›</button>
        </div>
        <div class="progress-dots">
          ${items.map((_, idx) => `<span class="dot ${idx < done ? 'done' : (idx === done ? 'now' : '')}"></span>`).join('')}
        </div>`;
    }

    screens.sound.innerHTML = `
      <div class="backrow">
        <button class="btn back" id="back">‹</button>
        <span class="crumb">${finished ? 'Поздравляем!' : (sound.animal + ' · звук «' + sound.letter + '»')}</span>
      </div>
      ${body}
    `;

    $('#back', screens.sound).onclick = () => navigate('sounds');
    $$('.stage-tab', screens.sound).forEach(b => {
      b.onclick = () => { state.stage = b.dataset.stage; state.i = 0; renderSound(); };
    });
    const say = $('#say', screens.sound);
    if (say) { say.onclick = () => { speak(current.say || current.txt); say.classList.add('pop'); setTimeout(() => say.classList.remove('pop'), 300); }; }
    const got = $('#gotIt', screens.sound);
    if (got) {
      got.onclick = () => {
        record('sound', sound.id, true);
        burst();
        renderSoundNext();
      };
    }
    const again = $('#again', screens.sound);
    if (again) again.onclick = () => { showHint(); speak(current.say || current.txt); };
    const skip = $('#skip', screens.sound);
    if (skip) skip.onclick = () => { state.i++; renderSound(); };
    const nextStage = $('#nextStage', screens.sound);
    if (nextStage) nextStage.onclick = () => { state.stage = STAGES[stageIndex + 1][0]; state.i = 0; renderSound(); };
    const toSounds = $('#toSounds', screens.sound);
    if (toSounds) toSounds.onclick = () => navigate('sounds');
    const againAll = $('#againAll', screens.sound);
    if (againAll) againAll.onclick = () => { state.i = 0; renderSound(); };
  }

  function renderSoundNext() {
    state.i++;
    renderSound();
  }

  let hintTimer = null;
  function showHint() {
    const say = $('#say', screens.sound);
    if (say) {
      say.classList.add('wob');
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => say.classList.remove('wob'), 900);
    }
  }

  function burst() {
    const c = document.createElement('div');
    c.className = 'confetti';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1100);
  }

  // ---------- Экран: АРТИКУЛЯЦИЯ ----------
  // ---------- Рисунок-подсказка для каждого упражнения ----------
  function mouthSVG(type) {
    const F =
      '<circle cx="110" cy="118" r="84" fill="#FFDFC4" stroke="#E8B98C" stroke-width="6"/>' +
      '<circle cx="79" cy="96" r="6.5" fill="#3D2C2E"/><circle cx="141" cy="96" r="6.5" fill="#3D2C2E"/>' +
      '<circle cx="82" cy="94" r="2" fill="#fff"/><circle cx="138" cy="94" r="2" fill="#fff"/>';
    const S =
      '<style>@keyframes ud{0%,100%{transform:translateY(-7px)}50%{transform:translateY(7px)}}' +
      '@keyframes lr{0%,100%{transform:translateX(-9px)}50%{transform:translateX(9px)}}' +
      '@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}' +
      '@keyframes spin{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}</style>';
    let B = '';
    switch (type) {
      case 'gorka':
        B =
          '<ellipse cx="110" cy="142" rx="46" ry="26" fill="#8A4A57" stroke="#6E3542" stroke-width="4"/>' +
          '<ellipse class="ud" cx="110" cy="112" rx="32" ry="14" fill="#E15B5B"/>' +
          '<path d="M110 92 V74 m-8 8 8-8 8 8" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        break;
      case 'cha':
        B =
          '<ellipse cx="110" cy="142" rx="46" ry="26" fill="#8A4A57" stroke="#6E3542" stroke-width="4"/>' +
          '<rect class="lr" x="62" y="130" width="96" height="22" rx="11" fill="#E15B5B" stroke="#C94A4A" stroke-width="3"/>' +
          '<path d="M52 141 H34 m8 -8 0 16 -8 -8" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M168 141 h18 m-8 -8 0 16 8 -8" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        break;
      case 'kacheli':
        B =
          '<ellipse cx="110" cy="142" rx="46" ry="26" fill="#8A4A57" stroke="#6E3542" stroke-width="4"/>' +
          '<ellipse class="ud" cx="110" cy="140" rx="34" ry="15" fill="#E15B5B"/>' +
          '<path d="M72 152 v-18 m-7 8 7 -8 7 8" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M148 152 v-18 m-7 8 7 -8 7 8" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        break;
      case 'zlob':
        B =
          '<ellipse class="ud" cx="110" cy="100" rx="30" ry="14" fill="#E15B5B"/>' +
          '<ellipse cx="110" cy="142" rx="46" ry="26" fill="#8A4A57" stroke="#6E3542" stroke-width="4"/>' +
          '<path d="M110 74 V60 m-7 7 7 -7 7 7" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M66 74 l-10 -6 m-2 16 12 0" stroke="#3D2C2E" stroke-width="4" fill="none" stroke-linecap="round"/>' +
          '<path d="M154 74 l10 -6 m2 16 -12 0" stroke="#3D2C2E" stroke-width="4" fill="none" stroke-linecap="round"/>';
        break;
      case 'tubka':
        B =
          '<path d="M96 122 C112 150 128 150 144 122 L138 112 C122 128 118 128 102 112 Z" fill="#E15B5B" stroke="#C94A4A" stroke-width="3"/>' +
          '<ellipse cx="144" cy="122" rx="7" ry="12" fill="#F05B5B"/>' +
          '<ellipse cx="110" cy="138" rx="40" ry="20" fill="#8A4A57" stroke="#6E3542" stroke-width="4"/>' +
          '<path d="M150 106 c8 -10 14 -4 8 5 M148 112 c10 -8 16 -2 8 6" stroke="#3D2C2E" stroke-width="3" fill="none" stroke-linecap="round"/>';
        break;
      case 'bublik':
        B =
          '<circle cx="110" cy="138" r="34" fill="#C94A4A" stroke="#8A4A57" stroke-width="4"/>' +
          '<circle cx="110" cy="138" r="16" fill="#FFDFC4"/>' +
          '<path class="spin" d="M160 118 a26 26 0 1 1 -20 -34" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round"/>';
        break;
      case 'kormit':
        B =
          '<ellipse cx="110" cy="142" rx="46" ry="26" fill="#8A4A57" stroke="#6E3542" stroke-width="4"/>' +
          '<ellipse class="ud" cx="110" cy="106" rx="40" ry="16" fill="#E15B5B"/>' +
          '<path d="M110 78 V62 m-8 8 8 -8 8 8" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        break;
      case 'krepost':
        B =
          '<ellipse cx="110" cy="142" rx="46" ry="26" fill="#8A4A57" stroke="#6E3542" stroke-width="4"/>' +
          '<rect class="pulse" x="78" y="128" width="64" height="26" rx="13" fill="#E15B5B" stroke="#C94A4A" stroke-width="3"/>' +
          '<path d="M52 141 H70 m-6 -7 0 14 -6 -7" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M168 141 h-18 m6 -7 0 14 6 -7" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        break;
      default:
        B = '<ellipse cx="110" cy="140" rx="46" ry="26" fill="#8A4A57" stroke="#6E3542" stroke-width="4"/>';
    }
    return '<svg viewBox="0 0 220 172" xmlns="http://www.w3.org/2000/svg">' + F + B + S + '</svg>';
  }

  function renderArtic() {
    screens.artic.innerHTML = `
      <div class="card">
        <p class="card-title">Зарядка для язычка</p>
        <p class="card-sub">Делай вместе со взрослым — по 2–3 упражнения, каждое 5 раз.</p>
      </div>
      ${D.articulation.map(a => `
        <div class="arti-card" data-a="${a.id}">
          <div class="row">
            <span class="m">${a.emoji}</span>
            <span style="flex:1"><b>${esc(a.name)}</b><p>${esc(a.desc)}</p></span>
            <span id="chev-${a.id}" style="font-weight:800;color:var(--ink-soft)">▶</span>
          </div>
          <div id="body-${a.id}" class="arti-body" style="display:none">
            <div class="demo">${mouthSVG(a.id)}</div>
            <ol class="arti-steps">
              ${a.steps.map((s, i) => `<li><span class="num">${i + 1}</span><span>${esc(s)}</span></li>`).join('')}
            </ol>
          </div>
        </div>`).join('')}
    `;
    $$('.arti-card', screens.artic).forEach(card => {
      card.onclick = () => {
        const id = card.dataset.a;
        const body = $('#body-' + id, screens.artic);
        const chev = $('#chev-' + id, screens.artic);
        const open = body.style.display !== 'none';
        body.style.display = open ? 'none' : 'block';
        chev.textContent = open ? '▶' : '▼';
      };
    });
  }

  // ---------- Экран: ИГРА «КТО ГОВОРИТ?» ----------
  function renderPlay() {
    const item = D.play.find(p => p.id === state.playId) || D.play[state.playId != null ? Math.min(D.play.length - 1, Math.floor(state.playId)) : 0];
    screens.play.innerHTML = `
      <div class="card">
        <p class="card-title">Кто так говорит?</p>
        <p class="card-sub">Покажи картинку, нажми на громкоговоритель, малыш повторяет. Потом отметь — получилось ли.</p>
      </div>
      <div class="play-big pop">
        <div class="who">${esc(item.name)}</div>
        <div class="hint">нажми и повтори за зверьком</div>
        <div class="face wob">${item.emoji}</div>
        <div class="said" id="saidText"></div>
        <button class="btn-speak big" id="pSay">🔊</button>
      </div>
      <div class="ctrl">
        <button class="btn ok" id="pOk">✅ Повторил!</button>
        <button class="btn again" id="pAgain">🔁 Ещё раз</button>
      </div>
      <div style="height:14px"></div>
      <div class="ctrl">
        <button class="btn back" id="pPrev" style="flex:1">‹ Другой</button>
        <button class="btn back" id="pNext" style="flex:1">Другой ›</button>
      </div>
    `;

    const said = $('#saidText', screens.play);
    const show = (reveal) => { said.textContent = reveal ? item.sound : ''; };
    const sayBtn = $('#pSay', screens.play);
    if (sayBtn) sayBtn.onclick = () => { show(true); speak(item.sound); };
    $('#pOk', screens.play).onclick = () => { record('play', '', true); burst(); nextPlay(1); };
    $('#pAgain', screens.play).onclick = () => { show(true); speak(item.sound); };
    $('#pPrev', screens.play).onclick = () => nextPlay(-1);
    $('#pNext', screens.play).onclick = () => nextPlay(1);
  }

  function nextPlay(dir) {
    const idx = D.play.findIndex(p => p.id === state.playId);
    let n = idx < 0 ? 0 : idx + dir;
    if (n < 0) n = D.play.length - 1;
    if (n >= D.play.length) n = 0;
    state.playId = D.play[n].id;
    renderPlay();
  }

  // ---------- Экран: ПРОГРЕСС ----------
  function renderProgress() {
    const p = store();
    const days = totalSessions();
    const mastered = masteredCount();
    const recent = p.sessions.slice(-30).reverse();

    const sectionName = (s) => ({ sound: 'Звуки', play: 'Игра', artic: 'Гимнастика' }[s] || s);
    const soundLabel = (id) => {
      const s = D.sounds.find(x => x.id === id);
      return s ? s.emoji + ' ' + s.letter : '';
    };

    screens.progress.innerHTML = `
      <div class="card">
        <p class="card-title">Наши успехи</p>
        <p class="card-sub">Это раздел для родителей: чтобы увидеть, какие звуки уже «получаются».</p>
        <div class="stat-row">
          <div class="stat"><div class="n">${days}</div><div class="l">дней занятий</div></div>
          <div class="stat"><div class="n">${mastered}</div><div class="l">звуков почти освоено</div></div>
          <div class="stat"><div class="n">${p.sessions.length}</div><div class="l">отметок</div></div>
        </div>
      </div>
      <div class="card">
        <p class="card-title">Освоение звуков</p>
        <div class="mastery">
          ${D.sounds.map(s => {
            const m = p.mastery[s.id];
            const pct = m && m.total ? Math.round(m.ok / m.total * 100) : 0;
            return `<span class="ms">${s.emoji} <span class="bar"><i style="width:${pct}%"></i></span> ${pct}%</span>`;
          }).join('')}
        </div>
      </div>
      <div class="card">
        <p class="card-title">Недавние занятия</p>
        ${recent.length ? `
        <ul class="history">
          ${recent.map(s => `
            <li>
              <span class="when">${shortDate(s.d)}</span>
              <span class="what">${sectionName(s.s)} ${s.s === 'sound' ? soundLabel(s.sound) : ''}</span>
              <span class="res ${s.ok ? 'good' : ''}">${s.ok ? '✅' : '—'}</span>
            </li>`).join('')}
        </ul>` : `<p class="empty-hint">Пока нет занятий. Потренируйте первый звук — и он появится здесь.</p>`}
      </div>
    `;
  }

  // ---------- Имя ребёнка ----------
  function askName() {
    const p = store();
    const name = prompt('Как зовут малыша?', p.name || '');
    if (name != null) {
      p.name = name.trim();
      save(p);
      updateChip();
      renderHome();
    }
  }
  function updateChip() {
    const p = store();
    $('#nameChip').textContent = p.name ? '👶 ' + p.name : '👶 Настроить';
  }

  // ---------- Инициализация ----------
  function render() {
    if (state.nav === 'home') renderHome();
    else if (state.nav === 'sounds') renderSounds();
    else if (state.nav === 'sound') renderSound();
    else if (state.nav === 'artic') renderArtic();
    else if (state.nav === 'play') renderPlay();
    else if (state.nav === 'progress') renderProgress();
  }

  $$('#nav button').forEach(b => b.onclick = () => navigate(b.dataset.nav));
  $('#nameChip').onclick = askName;
  updateChip();
  navigate('home');
})();
