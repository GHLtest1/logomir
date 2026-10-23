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
    playId: null,
    libTab: 'cats',
    libCat: null,
    gameCat: null,
    gameRound: null,
    gamePicks: { correct: 0, wrong: 0 }
  };

  const screens = {
    home: $('#scr-home'), sounds: $('#scr-sounds'), sound: $('#scr-sound'),
    artic: $('#scr-artic'), play: $('#scr-play'), progress: $('#scr-progress'),
    library: $('#scr-library')
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
        <div class="sec" data-go="library"><span class="ico">🔊</span><b>Звуки</b><small>библиотека звуков</small></div>
        <div class="sec" data-go="sounds"><span class="ico">🗣️</span><b>Проработка</b><small>слоги, слова, фразы</small></div>
        <div class="sec" data-go="artic"><span class="ico">😝</span><b>Гимнастика</b><small>язычок-силач</small></div>
        <div class="sec" data-go="play"><span class="ico">🦆</span><b>Кто говорит?</b><small>запуск речи</small></div>
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
      '<circle cx="110" cy="112" r="68" fill="#FFDFC4" stroke="#E8B98C" stroke-width="6"/>' +
      '<circle cx="70" cy="118" r="12" fill="#F8C9A6" opacity="0.7"/>' +
      '<circle cx="150" cy="118" r="12" fill="#F8C9A6" opacity="0.7"/>' +
      '<circle cx="82" cy="90" r="7" fill="#3D2C2E"/><circle cx="138" cy="90" r="7" fill="#3D2C2E"/>' +
      '<circle cx="84" cy="88" r="2.4" fill="#fff"/><circle cx="136" cy="88" r="2.4" fill="#fff"/>' +
      '<path d="M76 82 q6 -6 12 0 M132 82 q6 -6 12 0" stroke="#C98A5C" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M100 99 Q110 94 120 99 Q123 112 110 114 Q98 112 100 99 Z" fill="#EFAE77" stroke="#D98A50" stroke-width="2"/>' +
      '<path d="M105 105 q3 4 6 0" stroke="#C9793E" stroke-width="2" fill="none" stroke-linecap="round"/>';
    const MOUTH =
      '<path d="M60 140 Q110 98 160 140 Q110 178 60 140 Z" fill="#7A3B47" stroke="#5C2732" stroke-width="4"/>';
    const TEETH =
      '<rect x="80" y="128" width="12" height="16" rx="4" fill="#FFFDF5" stroke="#E3D4C0" stroke-width="2"/>' +
      '<rect x="95" y="124" width="15" height="22" rx="4" fill="#FFFDF5" stroke="#E3D4C0" stroke-width="2"/>' +
      '<rect x="114" y="124" width="15" height="22" rx="4" fill="#FFFDF5" stroke="#E3D4C0" stroke-width="2"/>' +
      '<rect x="132" y="128" width="12" height="16" rx="4" fill="#FFFDF5" stroke="#E3D4C0" stroke-width="2"/>';
    const ARG =
      '<g stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round">';
    let B = '';
    switch (type) {
      case 'gorka':
        B = MOUTH + TEETH +
          '<ellipse class="t-up" cx="110" cy="120" rx="33" ry="14" fill="#E15B5B"/>' +
          ARG + '<path d="M110 100 V82 m-7 8 7 -8 7 8"/></g>';
        break;
      case 'cha':
        B = MOUTH + TEETH +
          '<rect class="t-sid" x="58" y="136" width="104" height="20" rx="10" fill="#E15B5B" stroke="#C94A4A" stroke-width="3"/>' +
          ARG + '<path d="M42 146 H26 m8 -7 0 14 -8 -7"/><path d="M178 146 h16 m-8 -7 0 14 8 -7"/></g>';
        break;
      case 'kacheli':
        B = MOUTH + TEETH +
          '<ellipse class="t-up" cx="110" cy="142" rx="37" ry="16" fill="#E15B5B"/>' +
          ARG + '<path d="M74 156 v-22 m-7 10 7 -10 7 10"/><path d="M146 118 v22 m-7 -10 7 10 7 -10"/></g>';
        break;
      case 'zlob':
        B = MOUTH + TEETH +
          '<ellipse class="t-up" cx="110" cy="108" rx="31" ry="13" fill="#E15B5B"/>' +
          ARG + '<path d="M110 76 V60 m-7 8 7 -8 7 8"/><path d="M58 78 l-12 -8 m-2 18 15 0"/><path d="M162 78 l12 -8 m2 18 -15 0"/></g>';
        break;
      case 'tubka':
        B = MOUTH + TEETH +
          '<rect class="t-pulse" x="86" y="100" width="48" height="58" rx="24" fill="#E15B5B" stroke="#C94A4A" stroke-width="3"/>' +
          '<ellipse cx="110" cy="138" rx="12" ry="17" fill="#7A3B47"/>' +
          ARG + '<path d="M124 96 q16 4 10 18 M132 86 q22 8 14 30" stroke-width="3.5"/></g>';
        break;
      case 'bublik':
        B =
          '<ellipse class="t-pulse" cx="110" cy="140" rx="42" ry="29" fill="#E88A73" stroke="#C95F4C" stroke-width="4"/>' +
          '<ellipse cx="110" cy="140" rx="19" ry="12" fill="#7A3B47"/>' +
          '<path d="M62 140 h-22 m7 -7 0 14 -7 -7 M158 140 h22 m-7 -7 0 14 7 -7" stroke="#3D2C2E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        break;
      case 'kormit':
        B = MOUTH + TEETH +
          '<ellipse class="t-up" cx="110" cy="98" rx="42" ry="14" fill="#E15B5B"/>' +
          ARG + '<path d="M110 76 V58 m-7 9 7 -9 7 9"/></g>';
        break;
      case 'krepost':
        B = MOUTH + TEETH +
          '<rect class="t-pulse" x="70" y="124" width="80" height="30" rx="15" fill="#E15B5B" stroke="#C94A4A" stroke-width="3"/>' +
          ARG + '<path d="M36 139 H58 m-7 -8 0 16 -7 -8 M184 139 h-22 m7 -8 0 16 7 -8"/></g>';
        break;
      default:
        B = MOUTH + TEETH;
    }
    return '<svg viewBox="0 0 220 182" xmlns="http://www.w3.org/2000/svg">' + F + B + '</svg>';
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

  // ---------- Озвучка звуков (TTS + Web Audio) ----------
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) { try { audioCtx = new AC(); } catch (e) { audioCtx = null; } }
    }
    if (audioCtx && audioCtx.state === 'suspended') { try { audioCtx.resume(); } catch (e) {} }
    return audioCtx;
  }
  function tone(f, type, dur, g, w) {
    const c = ensureAudio(); if (!c) return;
    const o = c.createOscillator(), v = c.createGain();
    o.type = type; o.frequency.value = f;
    v.gain.setValueAtTime(0.0001, w);
    v.gain.exponentialRampToValueAtTime(g, w + 0.02);
    v.gain.exponentialRampToValueAtTime(0.0001, w + dur);
    o.connect(v); v.connect(c.destination); o.start(w); o.stop(w + dur + 0.05);
  }
  function vtone(f, dur, g, w, rate, type) {
    const c = ensureAudio(); if (!c) return;
    const o = c.createOscillator(), l = c.createOscillator(), lg = c.createGain(), v = c.createGain();
    o.type = type || 'sawtooth'; o.frequency.value = f;
    l.frequency.value = rate || 6; lg.gain.value = 6; l.connect(lg); lg.connect(o.frequency);
    v.gain.setValueAtTime(0.0001, w);
    v.gain.exponentialRampToValueAtTime(g, w + 0.05);
    v.gain.setValueAtTime(g, w + 0.12);
    v.gain.exponentialRampToValueAtTime(0.0001, w + dur);
    o.connect(v); v.connect(c.destination); o.start(w); o.stop(w + dur + 0.05);
    l.start(w); l.stop(w + dur + 0.05);
  }
  function noiseBurst(dur, g, w, cut) {
    const c = ensureAudio(); if (!c) return;
    const n = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource(); src.buffer = buf;
    const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = cut || 1200;
    const v = c.createGain(); v.gain.value = g;
    src.connect(fl); fl.connect(v); v.connect(c.destination); src.start(w);
  }
  function sirenGen(w, dur, f1, f2, rate, g) {
    const c = ensureAudio(); if (!c) return;
    const o = c.createOscillator(); o.type = 'sawtooth';
    const l = c.createOscillator(); l.frequency.value = rate || 0.6;
    const lg = c.createGain(); lg.gain.value = (f2 - f1) / 2;
    const base = c.createGain(); base.gain.value = (f1 + f2) / 2;
    l.connect(lg); lg.connect(o.frequency); base.connect(o.frequency);
    const v = c.createGain();
    v.gain.setValueAtTime(0.0001, w);
    v.gain.exponentialRampToValueAtTime(g, w + 0.05);
    v.gain.setValueAtTime(g, w + 0.1);
    v.gain.exponentialRampToValueAtTime(0.0001, w + dur);
    o.connect(v); v.connect(c.destination);
    o.start(w); o.stop(w + dur + 0.05); l.start(w); l.stop(w + dur + 0.05);
  }
  function windGen(w, dur, cut, g, rate) {
    const c = ensureAudio(); if (!c) return;
    const n = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = cut || 800;
    const l = c.createOscillator(); l.frequency.value = rate || 0.4;
    const lg = c.createGain(); lg.gain.value = 0.35;
    const m = c.createGain(); m.gain.value = 0.5;
    l.connect(lg); lg.connect(m.gain);
    const v = c.createGain(); v.gain.value = g;
    src.connect(fl); fl.connect(m); m.connect(v); v.connect(c.destination);
    src.start(w); src.stop(w + dur + 0.05); l.start(w); l.stop(w + dur + 0.05);
  }
  function synth(key) {
    const c = ensureAudio(); if (!c) return false;
    const t = c.currentTime + 0.02;
    switch (key) {
      case 'rain':
        noiseBurst(2.6, 0.5, t, 6000);
        for (let i = 0; i < 8; i++) tone(1700 + Math.random() * 1500, 'sine', 0.03, 0.06, t + Math.random() * 2.4);
        break;
      case 'wind': windGen(t, 2.6, 700, 0.6, 0.45); break;
      case 'thunder': noiseBurst(3, 0.7, t, 160); tone(46, 'sine', 2.6, 0.8, t); tone(62, 'sine', 2.2, 0.5, t + 0.2); break;
      case 'siren': sirenGen(t, 2.0, 560, 950, 0.7, 0.5); break;
      case 'vacuum': noiseBurst(2.6, 0.6, t, 900); break;
      case 'washer': tone(100, 'sine', 2.6, 0.4, t); noiseBurst(2.6, 0.3, t, 1400); break;
      case 'fridge': tone(70, 'sine', 1.1, 0.32, t); tone(70, 'sine', 1.1, 0.3, t + 1.3); break;
      case 'kettle': noiseBurst(2.6, 0.5, t, 5000); break;
      case 'squeak': vtone(1300, 0.5, 0.3, t, 12, 'sine'); vtone(900, 0.5, 0.25, t + 0.3, 10, 'sine'); break;
      case 'bphone': tone(420, 'square', 0.9, 0.3, t); tone(320, 'square', 0.9, 0.3, t + 1.1); break;
      case 'ticktock': tone(2100, 'square', 0.03, 0.22, t); tone(2100, 'square', 0.03, 0.22, t + 0.5); tone(2100, 'square', 0.03, 0.22, t + 1.0); break;
      case 'dingdong': tone(523, 'sine', 0.5, 0.3, t); tone(784, 'sine', 0.6, 0.3, t + 0.35); break;
      case 'steps': for (let i = 0; i < 3; i++) tone(95, 'sine', 0.07, 0.45, t + i * 0.28); break;
      case 'engine': tone(78, 'sawtooth', 1.6, 0.32, t); noiseBurst(1.6, 0.2, t, 500); break;
      case 'horn': tone(392, 'square', 0.5, 0.3, t); tone(392, 'square', 0.5, 0.3, t + 0.7); break;
      case 'train': noiseBurst(2, 0.25, t, 400); tone(500, 'sine', 1.2, 0.14, t); tone(700, 'sine', 1.2, 0.14, t); break;
      case 'firework': noiseBurst(0.9, 0.5, t, 1400); tone(1600, 'sine', 0.6, 0.22, t + 0.15); tone(1200, 'sine', 0.7, 0.2, t + 0.3); break;
      case 'jingle': tone(1568, 'sine', 0.6, 0.24, t); tone(2093, 'sine', 0.6, 0.2, t + 0.12); tone(1568, 'sine', 0.6, 0.2, t + 0.24); break;
      case 'sparkle': tone(2000, 'sine', 0.2, 0.16, t); tone(2400, 'sine', 0.2, 0.14, t + 0.1); tone(2600, 'sine', 0.2, 0.13, t + 0.2); break;
      case 'bounce': tone(500, 'sine', 0.12, 0.3, t); tone(400, 'sine', 0.12, 0.25, t + 0.12); tone(320, 'sine', 0.14, 0.2, t + 0.24); break;
      case 'chirp': tone(3000, 'sine', 0.05, 0.15, t); tone(3400, 'sine', 0.05, 0.15, t + 0.07); tone(2800, 'sine', 0.06, 0.13, t + 0.14); tone(3200, 'sine', 0.05, 0.13, t + 0.2); break;
      case 'midnight': for (let i = 0; i < 3; i++) tone(220, 'sine', 1.5, 0.35, t + i * 0.9); break;
      case 'drum':
        noiseBurst(0.16, 0.5, t, 200); tone(110, 'sine', 0.16, 0.5, t);
        noiseBurst(0.16, 0.4, t + 0.28, 200); tone(110, 'sine', 0.16, 0.4, t + 0.28);
        break;
      case 'piano':
        tone(523, 'triangle', 0.7, 0.30, t); tone(659, 'triangle', 0.7, 0.30, t + 0.1); tone(784, 'triangle', 0.8, 0.30, t + 0.2);
        break;
      case 'guitar':
        tone(196, 'sawtooth', 0.4, 0.22, t); tone(294, 'sawtooth', 0.4, 0.22, t + 0.12); tone(329, 'sawtooth', 0.45, 0.2, t + 0.24);
        break;
      case 'violin':
        vtone(440, 1.0, 0.28, t, 6, 'sawtooth'); vtone(659, 1.0, 0.18, t, 6, 'sawtooth');
        break;
      case 'trumpet':
        tone(466, 'sawtooth', 0.7, 0.26, t); tone(466, 'square', 0.7, 0.14, t); tone(698, 'sawtooth', 0.7, 0.22, t + 0.12);
        break;
      case 'flute':
        tone(784, 'sine', 0.5, 0.22, t); tone(880, 'sine', 0.5, 0.22, t + 0.06); tone(988, 'sine', 0.55, 0.2, t + 0.12);
        break;
      case 'bell':
        [1, 2.7, 5.4].forEach((m, i) => tone(1046 * m, 'sine', 1.2, 0.22 / (i + 1), t));
        break;
      case 'harmonica':
        tone(392, 'square', 0.6, 0.16, t); tone(392, 'square', 0.6, 0.16, t + 0.25); tone(523, 'square', 0.6, 0.18, t + 0.5);
        break;
      case 'maracas':
        noiseBurst(0.07, 0.4, t, 4000); noiseBurst(0.07, 0.4, t + 0.18, 4000); noiseBurst(0.07, 0.4, t + 0.36, 4000);
        break;
      default:
        return false;
    }
    return true;
  }
  function playFile(path, onFail) {
    if (window.__libAudio) { try { window.__libAudio.pause(); } catch (e) {} }
    const a = new Audio(path);
    const fail = () => { try { onFail && onFail(); } catch (e) {} };
    a.onerror = fail;
    a.play().catch(fail);
    window.__libAudio = a;
    return true;
  }
  function playLibSound(item) {
    if (item && item.file) {
      return playFile(item.file, () => {
        const s = item.sound;
        if (s && s.indexOf('synth:') === 0) synth(s.slice(6));
        else speak(s || item.name || '');
      });
    }
    const s = item && item.sound;
    if (s && s.indexOf('synth:') === 0) return synth(s.slice(6));
    return speak(s || (item && item.name) || '');
  }

  // ---------- БИБЛИОТЕКА ЗВУКОВ ----------
  function libStats() { try { const r = localStorage.getItem('logomir_lib'); return r ? JSON.parse(r) : {}; } catch (e) { return {}; } }
  function saveLib(st) { try { localStorage.setItem('logomir_lib', JSON.stringify(st)); } catch (e) {} }
  function catById(id) { return D.library.categories.find(c => c.id === id); }
  function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = r[i]; r[i] = r[j]; r[j] = t; } return r; }
  function itemImg(it) {
    if (!it || !it.file) return '';
    return it.file.replace('sounds/', 'images/').replace(/\.ogg$/, '.webp');
  }
  function wireImages(root) {
    $$('[data-img]', root).forEach(span => {
      const url = span.dataset.img;
      const im = new Image();
      im.onload = () => {
        span.textContent = '';
        const img = document.createElement('img');
        img.src = url; img.alt = '';
        span.appendChild(img);
      };
      im.src = url;
    });
  }
  function showFull(it) {
    if (!it) return;
    playLibSound(it);
    const ov = document.createElement('div');
    ov.className = 'fullov';
    ov.innerHTML = `
      <button class="full-close">✕</button>
      <div class="full-box">
        <span class="full-art"${it.file ? ` data-img="${itemImg(it)}"` : ''}>${it.emoji}</span>
        <div class="full-name">${esc(it.name)}</div>
        <button class="btn-speak big" id="fullPlay">🔊</button>
      </div>
      <div class="full-tap"></div>`;
    document.body.appendChild(ov);
    const art = ov.querySelector('.full-art');
    if (art && art.dataset.img) {
      const im = new Image();
      im.onload = () => {
        art.textContent = '';
        const img = document.createElement('img');
        img.src = art.dataset.img; img.alt = '';
        art.appendChild(img);
      };
      im.src = art.dataset.img;
    }
    $('#fullPlay', ov).onclick = () => playLibSound(it);
    const close = () => { if (ov.parentNode) ov.parentNode.removeChild(ov); };
    ov.querySelector('.full-close').onclick = close;
    ov.addEventListener('click', (e) => {
      if (e.target === ov || e.target.classList.contains('full-tap')) close();
    });
  }

  function renderLibrary() {
    const onCats = state.libTab !== 'games';
    screens.library.innerHTML = `
      <div class="seg">
        <button class="seg-btn ${onCats ? 'on' : ''}" id="segCats">🔊 Звуки</button>
        <button class="seg-btn ${!onCats ? 'on' : ''}" id="segGames">🎮 Игры</button>
      </div>
      <div id="libBody"></div>`;
    $('#segCats', screens.library).onclick = () => { state.libTab = 'cats'; state.libCat = null; state.gameCat = null; state.gameRound = null; renderLibrary(); };
    $('#segGames', screens.library).onclick = () => { state.libTab = 'games'; state.libCat = null; state.gameCat = null; state.gameRound = null; renderLibrary(); };
    renderLibBody();
  }
  function renderLibBody() {
    const body = $('#libBody', screens.library);
    if (!body) return;
    if (state.libTab === 'games') {
      if (state.gameRound) { renderGame(body); return; }
      renderGameCats(body);
    } else {
      if (state.libCat) { renderLibItems(body); return; }
      renderLibCats(body);
    }
  }
  function renderLibCats(body) {
    body.innerHTML = `<div class="lib-note">Выбери раздел и нажимай на картинку — услышишь, как она звучит.</div>
      <div class="cat-grid">
        ${D.library.categories.map(c => `<button class="cat-card" data-cat="${c.id}"><span class="ico">${c.emoji}</span><b>${esc(c.name)}</b></button>`).join('')}
      </div>`;
    $$('.cat-card', body).forEach(b => b.onclick = () => { state.libCat = b.dataset.cat; renderLibBody(); });
  }
  function renderLibItems(body) {
    const cat = catById(state.libCat);
    if (!cat) { state.libCat = null; renderLibBody(); return; }
    body.innerHTML = `
      <div class="backrow"><button class="btn back" id="libBack">‹</button><span class="crumb">${esc(cat.name)}</span></div>
      <div class="lib-grid">
        ${cat.items.map((it, i) => `<button class="lib-item" data-i="${i}"><span class="art"${it.file ? ` data-img="${itemImg(it)}"` : ''}>${it.emoji}</span><span class="t">${esc(it.name)}</span></button>`).join('')}
      </div>`;
    $('#libBack', body).onclick = () => { state.libCat = null; renderLibBody(); };
    $$('.lib-item', body).forEach(b => b.onclick = () => { const it = cat.items[+b.dataset.i]; if (it) showFull(it); });
    wireImages(body);
  }

  // Игра «угадай звук»
  function pickWeighted(cat, items, st) {
    const ws = items.map(it => { const s = (st[cat.id] && st[cat.id][it.name]) || { c: 0, w: 0 }; return Math.max(0.6, 1 + s.w - s.c); });
    const total = ws.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
    return items[0];
  }
  function newRound(cat) {
    const st = libStats();
    const target = pickWeighted(cat, cat.items, st);
    const others = cat.items.filter(it => it !== target);
    const picked = [];
    const pool = others.slice();
    while (picked.length < 3 && pool.length) {
      const item = pickWeighted(cat, pool, st);
      picked.push(item); pool.splice(pool.indexOf(item), 1);
    }
    return { cat: cat, target: target, options: shuffle([target].concat(picked)) };
  }
  function bump(cat, item, ok) {
    const st = libStats();
    st[cat.id] = st[cat.id] || {};
    const s = st[cat.id][item.name] = st[cat.id][item.name] || { c: 0, w: 0 };
    if (ok) s.c++; else s.w++;
    saveLib(st);
  }
  function renderGameCats(body) {
    body.innerHTML = `<div class="lib-note">Выбери категорию. Я сыграю звук — угадай, что звучало, по картинкам.</div>
      <div class="cat-grid">
        ${D.library.categories.map(c => `<button class="cat-card" data-cat="${c.id}"><span class="ico">${c.emoji}</span><b>${esc(c.name)}</b></button>`).join('')}
      </div>`;
    $$('.cat-card', body).forEach(b => b.onclick = () => {
      state.gameCat = b.dataset.cat;
      state.gamePicks = { correct: 0, wrong: 0 };
      state.gameRound = newRound(catById(b.dataset.cat));
      renderLibBody();
    });
  }
  function renderGame(body) {
    const r = state.gameRound;
    if (!r) { state.gameRound = null; renderLibBody(); return; }
    const p = state.gamePicks;
    body.innerHTML = `
      <div class="backrow">
        <button class="btn back" id="gExit">‹</button>
        <span class="crumb">Угадай: ${esc(r.cat.name)}</span>
      </div>
      <div class="game-card">
        <div class="score">Верно: <b>${p.correct}</b> · Промахов: <b>${p.wrong}</b></div>
        <div class="game-hint">Слушай и нажимай на картинку</div>
        <button class="btn-speak big" id="gPlay">🔊</button>
      </div>
      <div class="game-grid">
        ${r.options.map((it, idx) => `<button class="game-opt" data-o="${idx}"><span class="art"${it.file ? ` data-img="${itemImg(it)}"` : ''}>${it.emoji}</span><span class="t">${esc(it.name)}</span></button>`).join('')}
      </div>
      <div class="ctrl" style="margin-top:14px">
        <button class="btn again" id="gNext">Дальше ›</button>
      </div>`;
    playLibSound(r.target);
    $('#gPlay', body).onclick = () => playLibSound(r.target);
    $('#gExit', body).onclick = () => { state.gameCat = null; state.gameRound = null; renderLibBody(); };
    $('#gNext', body).onclick = () => { state.gameRound = newRound(r.cat); renderLibBody(); };
    $$('.game-opt', body).forEach(b => b.onclick = () => {
      const chosen = r.options[+b.dataset.o];
      if (b.classList.contains('locked')) return;
      if (chosen === r.target) {
        b.classList.add('ok', 'locked');
        p.correct++; bump(r.cat, r.target, 1); burst();
        setTimeout(() => { state.gameRound = newRound(r.cat); renderLibBody(); }, 1100);
      } else {
        b.classList.add('no', 'locked');
        p.wrong++; bump(r.cat, chosen, 0);
      }
    });
    wireImages(body);
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
    else if (state.nav === 'library') renderLibrary();
    else if (state.nav === 'sounds') renderSounds();
    else if (state.nav === 'sound') renderSound();
    else if (state.nav === 'artic') renderArtic();
    else if (state.nav === 'play') renderPlay();
    else if (state.nav === 'progress') renderProgress();
  }

  $$('#nav button').forEach(b => b.onclick = () => navigate(b.dataset.nav));
  $('#nameChip').onclick = askName;
  $('#progChip').onclick = () => navigate('progress');
  updateChip();
  navigate('home');
})();
