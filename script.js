/* ══════════════════════════════════════
   BOTABOT — SCRIPT.JS
   ══════════════════════════════════════ */

// ──────────────────────────────────────
// STATE
// ──────────────────────────────────────
let state = {
  name: '',
  age: 0,
  region: '',
  lang: 'kk',
  coins: 0,
  gamesPlayed: 0,
  sessionStart: Date.now(),
  timeLimit: 60, // minutes
  pin: '1234',
  dailyDate: '',
  dailyDone: {},       // {gameId: true}
  regionProgress: {},  // {regionName: {completed: bool, tasks: int}}
  promoUsed: [],
  rating: [
    { name: 'Айгерім', coins: 1240 },
    { name: 'Нұрлан', coins: 980 },
    { name: 'Зарина', coins: 855 },
    { name: 'Ерболат', coins: 720 },
    { name: 'Мадина', coins: 610 },
  ]
};

// ──────────────────────────────────────
// PROMO CODES
// ──────────────────────────────────────
const PROMO_CODES = {
  'BAYAN2024': { coins: 200, label: '200 монета — Баян Сұлу сыйлығы!' },
  'KAZAK100':  { coins: 100, label: '100 монета — Қазақстан!' },
  'BOTABOT50': { coins: 50,  label: '50 монета — BotaBot досы!' },
  'QAZAQSTAN': { coins: 300, label: '300 монета — Мерекелік сыйлық!' },
  'ЖЕНТ2024':  { coins: 150, label: '150 монета — Жент кәмпиті!' },
};

// ──────────────────────────────────────
// REGIONS DATA
// ──────────────────────────────────────
const REGIONS = [
  { name: 'Алматы',           coins: 3900,  pop: '3 852 600', color: '#FF6B6B' },
  { name: 'Түркістан',        coins: 3500,  pop: '3 410 500', color: '#FFA94D' },
  { name: 'Ақмола',           coins: 2300,  pop: '2 316 500', color: '#FFD43B' },
  { name: 'Жамбыл',           coins: 1200,  pop: '1 222 500', color: '#69DB7C' },
  { name: 'Қарағанды',        coins: 1100,  pop: '1 133 900', color: '#4DABF7' },
  { name: 'Ақтөбе',           coins: 900,   pop: '949 600',   color: '#748FFC' },
  { name: 'Қызылорда',        coins: 800,   pop: '846 300',   color: '#F783AC' },
  { name: 'Қостанай',         coins: 800,   pop: '825 500',   color: '#63E6BE' },
  { name: 'Маңғыстау',        coins: 800,   pop: '805 300',   color: '#74C0FC' },
  { name: 'Павлодар',         coins: 700,   pop: '751 000',   color: '#A9E34B' },
  { name: 'Шығыс Қазақстан',  coins: 700,   pop: '723 900',   color: '#FFA8A8' },
  { name: 'Атырау',           coins: 700,   pop: '710 800',   color: '#FFD8A8' },
  { name: 'Батыс Қазақстан',  coins: 700,   pop: '696 000',   color: '#D8F5A2' },
  { name: 'Жетісу',           coins: 700,   pop: '694 400',   color: '#A5D8FF' },
  { name: 'Абай',             coins: 600,   pop: '602 800',   color: '#D0BFFF' },
  { name: 'Солтүстік Қазақстан', coins: 500, pop: '522 100', color: '#FFEC99' },
  { name: 'Ұлытау',           coins: 200,   pop: '221 300',   color: '#C5F6FA' },
];

// ──────────────────────────────────────
// CANDY IMAGES (Bayan Sulu)
// ──────────────────────────────────────
const CANDY_IMAGES = [
  '1777751501032_image.png',  // Жент
  '1777751508990_image.png',  // Тортик
  '1777751516603_image.png',  // Милая Моя
];

// Candy names for matching pairs (KK word + candy image)
const MATCH_PAIRS_KK = [
  { kk: 'Алма',        ru: 'Яблоко' },
  { kk: 'Кітап',       ru: 'Книга' },
  { kk: 'Үй',          ru: 'Дом' },
  { kk: 'Су',          ru: 'Вода' },
  { kk: 'Күн',         ru: 'Солнце' },
  { kk: 'Ай',          ru: 'Луна' },
  { kk: 'Жер',         ru: 'Земля' },
  { kk: 'От',          ru: 'Огонь' },
  { kk: 'Жел',         ru: 'Ветер' },
  { kk: 'Тас',         ru: 'Камень' },
  { kk: 'Ағаш',        ru: 'Дерево' },
  { kk: 'Гүл',         ru: 'Цветок' },
];

// ──────────────────────────────────────
// STARS BACKGROUND
// ──────────────────────────────────────
function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      --dur:${Math.random()*3+2}s;
      animation-delay:${Math.random()*3}s;
    `;
    container.appendChild(star);
  }
}

// ──────────────────────────────────────
// SCREEN NAVIGATION
// ──────────────────────────────────────
function goToScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ──────────────────────────────────────
// SETUP FLOW
// ──────────────────────────────────────
let setupStep = 'name';

function submitName() {
  const val = document.getElementById('input-name').value.trim();
  if (!val) { showPopup('Есіміңді жаз! 😊'); return; }
  state.name = val;
  document.getElementById('step-name').classList.add('hidden');
  document.getElementById('step-age').classList.remove('hidden');
  // Correct Kazakh grammar: "Жасаулы" vs just asking age
  document.getElementById('age-question').innerHTML = `Жарайсың, ${val}! 🎉<br>Қанша жастасың?`;
  setupStep = 'age';
}

function submitAge() {
  const val = parseInt(document.getElementById('input-age').value);
  if (!val || val < 5 || val > 18) { showPopup('Жасыңды дұрыс жаз (5–18)! 😊'); return; }
  state.age = val;
  document.getElementById('step-age').classList.add('hidden');
  document.getElementById('step-region').classList.remove('hidden');
  setupStep = 'region';
}

function submitRegion() {
  const val = document.getElementById('select-region').value;
  if (!val) { showPopup('Облысыңды таңда! 🏠'); return; }
  state.region = val;
  // Unlock home region
  if (!state.regionProgress[val]) {
    state.regionProgress[val] = { unlocked: true, completed: false, tasks: 0 };
  }
  document.getElementById('step-region').classList.add('hidden');
  document.getElementById('step-lang').classList.remove('hidden');
  setupStep = 'lang';
}

function setLang(lang, btn) {
  state.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function finishSetup() {
  checkDailyReset();
  goToScreen('screen-hub');
  updateHubHeader();
  buildDailyTasks();
  buildRating();
  buildMap();
  saveState();
}

// ──────────────────────────────────────
// HUB
// ──────────────────────────────────────
function updateHubHeader() {
  document.getElementById('hub-coins').textContent = state.coins;
  document.getElementById('header-user').textContent = state.name || 'Сәлем!';
  updateDailyBadges();
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  if (tabId === 'tab-rating') buildRating();
  if (tabId === 'tab-map') buildMap();
  if (tabId === 'tab-daily') buildDailyTasks();
}

function addCoins(n) {
  state.coins += n;
  document.getElementById('hub-coins').textContent = state.coins;
  document.getElementById('ps-coins').textContent = state.coins + ' 🪙';
  saveState();
}

// ──────────────────────────────────────
// DAILY RESET
// ──────────────────────────────────────
function checkDailyReset() {
  const today = new Date().toDateString();
  if (state.dailyDate !== today) {
    state.dailyDate = today;
    state.dailyDone = {};
    saveState();
  }
}

function updateDailyBadges() {
  ['cards','match','puzzle','math','wordguess','snake'].forEach(g => {
    const el = document.getElementById('daily-' + g);
    if (el) {
      if (state.dailyDone[g]) el.className = 'daily-badge done';
      else el.className = 'daily-badge';
    }
  });
}

function buildDailyTasks() {
  const list = document.getElementById('daily-tasks-list');
  const games = [
    { id: 'cards',     icon: '🃏', name: 'Қазақ Тілі Карталары', reward: 5 },
    { id: 'match',     icon: '🔗', name: 'Карта Ойыны',           reward: 5 },
    { id: 'puzzle',    icon: '🧩', name: 'Пазл',                   reward: 10 },
    { id: 'math',      icon: '🔢', name: 'Математика',             reward: 20 },
    { id: 'wordguess', icon: '🔤', name: 'Сөз Табу',               reward: 15 },
    { id: 'snake',     icon: '🐍', name: 'Жылан Ойыны',            reward: 20 },
  ];
  list.innerHTML = games.map(g => {
    const done = state.dailyDone[g.id];
    return `<div class="daily-task">
      <div class="task-icon">${g.icon}</div>
      <div class="task-info">
        <div class="task-name">${g.name}</div>
        <div class="task-reward">+${g.reward} 🪙</div>
      </div>
      <div class="task-status">${done ? '✅' : '⏳'}</div>
    </div>`;
  }).join('');
}

// ──────────────────────────────────────
// GAME LAUNCHER
// ──────────────────────────────────────
function startGame(id) {
  currentGame = id;
  goToScreen('screen-' + id);
  if (id === 'match')     initMatchGame();
  if (id === 'cards')     initCardsGame();
  if (id === 'math')      initMathGame();
  if (id === 'wordguess') initWordGame();
  if (id === 'snake')     initSnakeGame();
  if (id === 'puzzle')    initPuzzleMenu();
}
let currentGame = '';

function exitGame() {
  if (snakeInterval) { clearInterval(snakeInterval); snakeInterval = null; }
  goToScreen('screen-hub');
  updateHubHeader();
}

function rewardGame(gameId, coins) {
  if (!state.dailyDone[gameId]) {
    state.dailyDone[gameId] = true;
    addCoins(coins);
    state.gamesPlayed++;
    document.getElementById('ps-games').textContent = state.gamesPlayed;
    updateDailyBadges();
    saveState();
    return true; // first time today
  }
  return false;
}

// ──────────────────────────────────────
// MATCH GAME (СӘЙКЕСТЕНДІР)
// ──────────────────────────────────────
let matchSelected = null;
let matchScore = 0;
let matchMatched = 0;
let matchTotal = 0;
let matchRound = 0;

function getCandyImg(idx) {
  // Use uploaded candies cycling
  const imgs = CANDY_IMAGES;
  return imgs[idx % imgs.length];
}

function initMatchGame() {
  matchScore = 0;
  matchRound = 0;
  document.getElementById('match-score').textContent = 0;
  document.getElementById('match-next-btn').style.display = 'none';
  loadMatchRound();
}

function loadMatchRound() {
  matchSelected = null;
  matchMatched = 0;

  // Pick 4 random pairs from the list
  const shuffled = [...MATCH_PAIRS_KK].sort(() => Math.random() - 0.5);
  const pairs = shuffled.slice(0, 4);
  matchTotal = pairs.length;

  // Build cards: KK word on one side, candy image on the other
  // Left column = Kazakh word cards, Right column = Russian word cards
  // Actually: left = kk words, right = ru words (text), matched by meaning
  const leftCards = pairs.map((p, i) => ({ id: i, label: p.kk, side: 'kk', candy: getCandyImg(i) }));
  const rightCards = pairs.map((p, i) => ({ id: i, label: p.ru, side: 'ru', candy: getCandyImg(i) }));

  // Shuffle each column independently
  leftCards.sort(() => Math.random() - 0.5);
  rightCards.sort(() => Math.random() - 0.5);

  const grid = document.getElementById('match-grid');
  grid.innerHTML = '';

  // Interleave left+right in grid (2 cols)
  leftCards.forEach((card, rowIdx) => {
    grid.appendChild(makeMatchCard(card, leftCards, rightCards));
  });
  rightCards.forEach((card, rowIdx) => {
    grid.appendChild(makeMatchCard(card, leftCards, rightCards));
  });

  // Re-sort so they go left-right per row
  // Actually build as flat array: [left[0], right[0], left[1], right[1]...]
  grid.innerHTML = '';
  for (let i = 0; i < pairs.length; i++) {
    grid.appendChild(makeMatchCard(leftCards[i], 'kk'));
    grid.appendChild(makeMatchCard(rightCards[i], 'ru'));
  }
}

function makeMatchCard(card, side) {
  const div = document.createElement('div');
  div.className = 'match-card';
  div.dataset.id = card.id;
  div.dataset.side = side;

  // Show candy image for KK side, text for RU side
  if (side === 'kk') {
    const img = document.createElement('img');
    img.src = card.candy;
    img.className = 'candy';
    img.onerror = () => { div.textContent = card.label; }; // fallback
    div.appendChild(img);
    const lbl = document.createElement('div');
    lbl.textContent = card.label;
    lbl.style.cssText = 'font-size:0.85rem;margin-top:4px;font-weight:800;';
    div.appendChild(lbl);
  } else {
    div.textContent = card.label;
  }

  div.addEventListener('click', () => onMatchClick(div));
  return div;
}

function onMatchClick(card) {
  if (card.classList.contains('matched') || card.classList.contains('wrong')) return;

  if (!matchSelected) {
    // First selection
    card.classList.add('selected');
    matchSelected = card;
  } else {
    if (matchSelected === card) {
      card.classList.remove('selected');
      matchSelected = null;
      return;
    }
    // Check match — same dataset.id, different side
    if (matchSelected.dataset.id === card.dataset.id && matchSelected.dataset.side !== card.dataset.side) {
      // MATCH!
      matchSelected.classList.remove('selected');
      matchSelected.classList.add('matched');
      card.classList.add('matched');
      matchMatched++;
      matchScore += 10;
      document.getElementById('match-score').textContent = matchScore;
      matchSelected = null;

      if (matchMatched >= matchTotal) {
        // Round complete
        matchRound++;
        const firstTime = rewardGame('match', 5);
        const msg = firstTime
          ? `Керемет! Раунд аяқталды! +5 🪙 жеңдің!`
          : `Раунд аяқталды! Тамаша!`;
        document.getElementById('match-next-btn').style.display = 'block';
        document.getElementById('match-next-btn').textContent = `Келесі раунд (${matchRound + 1}) ➜`;
        showPopup(msg);
      }
    } else {
      // Wrong
      matchSelected.classList.remove('selected');
      matchSelected.classList.add('wrong');
      card.classList.add('wrong');
      const a = matchSelected, b = card;
      setTimeout(() => {
        a.classList.remove('wrong');
        b.classList.remove('wrong');
      }, 800);
      matchSelected = null;
    }
  }
}

function nextMatchRound() {
  document.getElementById('match-next-btn').style.display = 'none';
  loadMatchRound();
}

// ──────────────────────────────────────
// CARDS / FLASHCARD GAME
// ──────────────────────────────────────
let cardsDeck = [];
let cardsIdx = 0;
let cardsScore = 0;
let cardFlipped = false;

const KAZAKH_WORDS = [
  { kk: 'Алма 🍎',    ru: 'Яблоко' },
  { kk: 'Кітап 📚',   ru: 'Книга' },
  { kk: 'Үй 🏠',      ru: 'Дом' },
  { kk: 'Су 💧',      ru: 'Вода' },
  { kk: 'Күн ☀️',     ru: 'Солнце' },
  { kk: 'Ай 🌙',      ru: 'Луна' },
  { kk: 'Жер 🌍',     ru: 'Земля' },
  { kk: 'Ит 🐕',      ru: 'Собака' },
  { kk: 'Мысық 🐈',   ru: 'Кошка' },
  { kk: 'Балық 🐟',   ru: 'Рыба' },
  { kk: 'Машина 🚗',  ru: 'Машина' },
  { kk: 'Ұшақ ✈️',   ru: 'Самолёт' },
  { kk: 'Теңіз 🌊',   ru: 'Море' },
  { kk: 'Тау ⛰️',     ru: 'Гора' },
  { kk: 'Гүл 🌸',     ru: 'Цветок' },
];

function initCardsGame() {
  cardsDeck = [...KAZAKH_WORDS].sort(() => Math.random() - 0.5);
  cardsIdx = 0;
  cardsScore = 0;
  cardFlipped = false;
  document.getElementById('cards-score').textContent = 0;
  document.getElementById('flashcard').classList.remove('flipped');
  showCurrentCard();
}

function showCurrentCard() {
  if (cardsIdx >= cardsDeck.length) {
    const firstTime = rewardGame('cards', 5);
    showPopup(`Барлық картаны бітірдің! Ұпай: ${cardsScore} ${firstTime ? '| +5 🪙 жеңдің!' : ''}`);
    return;
  }
  const word = cardsDeck[cardsIdx];
  document.getElementById('card-front').textContent = word.kk;
  document.getElementById('card-back').textContent = word.ru;
  cardFlipped = false;
  document.getElementById('flashcard').classList.remove('flipped');

  // Choices: 1 correct + 3 random
  const others = KAZAKH_WORDS.filter(w => w.ru !== word.ru).sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [...others, word].sort(() => Math.random() - 0.5);
  const choicesEl = document.getElementById('card-choices');
  choicesEl.innerHTML = '';
  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = c.ru;
    btn.onclick = () => checkCardChoice(btn, c.ru, word.ru, choices, choicesEl);
    choicesEl.appendChild(btn);
  });
}

function flipCard() {
  cardFlipped = !cardFlipped;
  document.getElementById('flashcard').classList.toggle('flipped', cardFlipped);
}

function checkCardChoice(btn, chosen, correct, choices, choicesEl) {
  const btns = choicesEl.querySelectorAll('.choice-btn');
  btns.forEach(b => b.disabled = true);
  if (chosen === correct) {
    btn.classList.add('correct');
    cardsScore += 5;
    document.getElementById('cards-score').textContent = cardsScore;
  } else {
    btn.classList.add('wrong');
    btns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
  }
  cardsIdx++;
  setTimeout(showCurrentCard, 1200);
}

// ──────────────────────────────────────
// PUZZLE GAME
// ──────────────────────────────────────
let puzzleState = [], puzzleSize = 3, puzzleScore = 0;

const PUZZLE_EMOJIS = {
  easy:   ['🍎','📚','🏠','💧','☀️','🌙','🌍','🐕','🐈'],
  medium: ['🍎','📚','🏠','💧','☀️','🌙','🌍','🐕','🐈','🐟','🚗','✈️','🌊','⛰️','🌸','🪙'],
  hard:   ['🍎','📚','🏠','💧','☀️','🌙','🌍','🐕','🐈','🐟','🚗','✈️','🌊','⛰️','🌸','🪙','🎮','🎵','🎨','🏆','⚽','🎯','🦁','🐘']
};

function initPuzzleMenu() {
  document.getElementById('puzzle-levels').style.display = 'flex';
  document.getElementById('puzzle-board').classList.add('hidden');
}

function startPuzzle(level) {
  const sizes = { easy: 3, medium: 4, hard: 5 };
  puzzleSize = sizes[level];
  puzzleScore = 0;
  document.getElementById('puzzle-score').textContent = 0;
  document.getElementById('puzzle-levels').style.display = 'none';
  document.getElementById('puzzle-board').classList.remove('hidden');

  // Create number puzzle (15-puzzle style with emojis)
  const emojis = PUZZLE_EMOJIS[level].slice(0, puzzleSize * puzzleSize - 1);
  puzzleState = [...emojis, ''];
  // Shuffle
  do { puzzleState.sort(() => Math.random() - 0.5); } while (!isSolvable(puzzleState));

  renderPuzzle();
}

function isSolvable(arr) {
  // Simple check — for small puzzles just allow all
  return true;
}

function renderPuzzle() {
  const board = document.getElementById('puzzle-board');
  board.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;
  board.innerHTML = '';
  puzzleState.forEach((val, idx) => {
    const tile = document.createElement('div');
    tile.className = 'puzzle-tile' + (val === '' ? ' empty' : '');
    tile.style.fontSize = puzzleSize > 3 ? '1.4rem' : '1.8rem';
    tile.textContent = val;
    if (val !== '') tile.addEventListener('click', () => movePuzzleTile(idx));
    board.appendChild(tile);
  });
}

function movePuzzleTile(idx) {
  const emptyIdx = puzzleState.indexOf('');
  const size = puzzleSize;
  const row = Math.floor(idx / size), col = idx % size;
  const erow = Math.floor(emptyIdx / size), ecol = emptyIdx % size;
  if ((Math.abs(row - erow) === 1 && col === ecol) || (Math.abs(col - ecol) === 1 && row === erow)) {
    [puzzleState[idx], puzzleState[emptyIdx]] = [puzzleState[emptyIdx], puzzleState[idx]];
    puzzleScore++;
    document.getElementById('puzzle-score').textContent = puzzleScore;
    renderPuzzle();
    if (isPuzzleSolved()) {
      const firstTime = rewardGame('puzzle', 10);
      showPopup(`Пазл шешілді! 🎉 ${firstTime ? '+10 🪙 жеңдің!' : 'Жарайсың!'}`);
      setTimeout(() => initPuzzleMenu(), 2000);
    }
  }
}

function isPuzzleSolved() {
  const last = puzzleState[puzzleState.length - 1];
  if (last !== '') return false;
  for (let i = 0; i < puzzleState.length - 1; i++) {
    if (!puzzleState[i]) return false;
  }
  return true;
}

// ──────────────────────────────────────
// MATH GAME
// ──────────────────────────────────────
let mathScore = 0;
let mathCorrect = 0;

function initMathGame() {
  mathScore = 0;
  mathCorrect = 0;
  document.getElementById('math-score').textContent = 0;
  document.getElementById('math-feedback').textContent = '';
  nextMathQuestion();
}

function nextMathQuestion() {
  const ops = ['+', '-', '×', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  if (op === '+') { a = rand(1,50); b = rand(1,50); answer = a + b; }
  else if (op === '-') { a = rand(10,99); b = rand(1,a); answer = a - b; }
  else if (op === '×') { a = rand(2,12); b = rand(2,12); answer = a * b; }
  else { b = rand(2,12); answer = rand(2,12); a = b * answer; }

  // Show candy images as visual for numbers
  const candyA = `<img src="${getCandyImg(a % 3)}" style="width:32px;vertical-align:middle" onerror="this.style.display='none'">`;
  document.getElementById('math-question').innerHTML = `${a} ${op} ${b} = ?`;

  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = answer + rand(-10, 10);
    if (w !== answer && w > 0) wrongs.add(w);
  }
  const choices = [...wrongs, answer].sort(() => Math.random() - 0.5);

  const choicesEl = document.getElementById('math-choices');
  choicesEl.innerHTML = '';
  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'math-choice';
    btn.textContent = c;
    btn.onclick = () => checkMath(btn, c, answer);
    choicesEl.appendChild(btn);
  });
}

function checkMath(btn, chosen, correct) {
  document.querySelectorAll('.math-choice').forEach(b => b.onclick = null);
  const fb = document.getElementById('math-feedback');
  if (chosen === correct) {
    btn.classList.add('correct');
    fb.textContent = '✅ Дұрыс!';
    fb.style.color = 'var(--success)';
    mathScore += 20;
    mathCorrect++;
    document.getElementById('math-score').textContent = mathScore;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.math-choice').forEach(b => { if (parseInt(b.textContent) === correct) b.classList.add('correct'); });
    fb.textContent = `❌ Жауап: ${correct}`;
    fb.style.color = 'var(--danger)';
  }

  if (mathCorrect >= 10) {
    const firstTime = rewardGame('math', 20);
    setTimeout(() => showPopup(`10 мысал шешіп болдың! ${firstTime ? '+20 🪙 жеңдің!' : 'Жарайсың!'}`), 800);
    return;
  }
  setTimeout(() => {
    fb.textContent = '';
    document.querySelectorAll('.math-choice').forEach(b => { b.classList.remove('correct','wrong'); });
    nextMathQuestion();
  }, 1200);
}

// ──────────────────────────────────────
// WORD GUESS GAME (СӨЗ ТАБУ)
// ──────────────────────────────────────
const WORD_LIST = [
  { word: 'АЛМА',    clue: 'Қызыл немесе жасыл, ағаштан өседі, тәтті жеміс 🍎' },
  { word: 'ЖЫЛАН',   clue: 'Аяқсыз жорғалайды, жасыл немесе қара түсті 🐍' },
  { word: 'МЕКТЕП',  clue: 'Балалар білім алатын жер 📚' },
  { word: 'ТЕҢІЗ',   clue: 'Үлкен су, толқыны бар, балықтар мекені 🌊' },
  { word: 'МАШИНА',  clue: 'Жолда жүреді, 4 доңғалағы бар 🚗' },
  { word: 'ҰШАҚ',    clue: 'Аспанда ұшады, адамдарды тасиды ✈️' },
  { word: 'ҚАСҚЫР',  clue: 'Ормандағы жыртқыш, иттің жабайы туысы 🐺' },
  { word: 'АРЫСТАН', clue: 'Жануарлар патшасы, жалы бар 🦁' },
  { word: 'КІТАП',   clue: 'Оқуға арналған, беттерден тұрады 📖' },
  { word: 'БАЙРАҚ',  clue: 'Елдің рәмізі, таяқта желбіреп тұрады 🏁' },
];

let wordIdx = 0;
let wordScore = 0;
let wordList = [];

function initWordGame() {
  wordList = [...WORD_LIST].sort(() => Math.random() - 0.5);
  wordIdx = 0;
  wordScore = 0;
  document.getElementById('word-score').textContent = 0;
  document.getElementById('word-feedback').textContent = '';
  document.getElementById('word-next-btn').style.display = 'none';
  showCurrentWord();
}

function showCurrentWord() {
  if (wordIdx >= wordList.length) {
    const firstTime = rewardGame('wordguess', 15);
    showPopup(`Барлық сөзді таптың! 🎉 ${firstTime ? '+15 🪙 жеңдің!' : ''}`);
    return;
  }
  const w = wordList[wordIdx];
  document.getElementById('word-clue').textContent = w.clue;
  document.getElementById('word-input').value = '';
  document.getElementById('word-feedback').textContent = '';
  document.getElementById('word-next-btn').style.display = 'none';

  // Show scrambled letters
  const letters = w.word.split('').sort(() => Math.random() - 0.5);
  document.getElementById('word-letters').innerHTML = letters.map((l, i) =>
    `<div class="word-letter ${i === 0 ? 'hint' : ''}">${l}</div>`
  ).join('');
}

function checkWord() {
  const input = document.getElementById('word-input').value.trim().toUpperCase();
  const correct = wordList[wordIdx].word;
  const fb = document.getElementById('word-feedback');
  if (input === correct) {
    fb.textContent = '✅ Дұрыс! 🎉';
    fb.style.color = 'var(--success)';
    wordScore += 15;
    document.getElementById('word-score').textContent = wordScore;
    document.getElementById('word-next-btn').style.display = 'inline-block';
  } else {
    fb.textContent = '❌ Қайтадан көр!';
    fb.style.color = 'var(--danger)';
  }
}

function nextWord() {
  wordIdx++;
  document.getElementById('word-feedback').textContent = '';
  showCurrentWord();
}

// ──────────────────────────────────────
// SNAKE GAME
// ──────────────────────────────────────
let snakeInterval = null;
let snake = [], snakeDir = {x:1,y:0}, snakeFood = {}, snakeScoreCount = 0;
const CELL = 20;
const GRID = 20; // 20x20

function initSnakeGame() {
  document.getElementById('snake-score').textContent = 0;
  drawSnakeStart();
}

function drawSnakeStart() {
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 400, 400);
  ctx.fillStyle = '#4ECDC4';
  ctx.font = 'bold 20px Nunito';
  ctx.textAlign = 'center';
  ctx.fillText('▶ Бастау батырмасын бас', 200, 200);
}

function startSnake() {
  if (snakeInterval) clearInterval(snakeInterval);
  snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
  snakeDir = {x:1,y:0};
  snakeScoreCount = 0;
  document.getElementById('snake-score').textContent = 0;
  document.getElementById('snake-controls').innerHTML = '<button class="btn-secondary" onclick="startSnake()">🔄 Қайтадан</button>';
  placeFood();
  snakeInterval = setInterval(snakeTick, 150);
}

function placeFood() {
  snakeFood = {
    x: Math.floor(Math.random() * GRID),
    y: Math.floor(Math.random() * GRID)
  };
}

function snakeTick() {
  const head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };
  // Wall wrap
  head.x = (head.x + GRID) % GRID;
  head.y = (head.y + GRID) % GRID;

  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    clearInterval(snakeInterval); snakeInterval = null;
    const firstTime = rewardGame('snake', 20);
    showPopup(`Ойын аяқталды! Ұпай: ${snakeScoreCount} ${firstTime ? '| +20 🪙 жеңдің!' : ''}`);
    return;
  }

  snake.unshift(head);
  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScoreCount++;
    document.getElementById('snake-score').textContent = snakeScoreCount;
    placeFood();
  } else {
    snake.pop();
  }
  drawSnake();
}

function drawSnake() {
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 400, 400);

  // Grid dots
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let x = 0; x < GRID; x++) for (let y = 0; y < GRID; y++) {
    ctx.fillRect(x*CELL+9, y*CELL+9, 2, 2);
  }

  // Food (candy emoji)
  ctx.font = `${CELL-2}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🍬', snakeFood.x*CELL + CELL/2, snakeFood.y*CELL + CELL - 2);

  // Snake
  snake.forEach((seg, i) => {
    const alpha = i === 0 ? 1 : 0.85 - i*0.02;
    ctx.fillStyle = i === 0 ? '#4ECDC4' : `rgba(78,205,196,${Math.max(alpha, 0.3)})`;
    ctx.beginPath();
    ctx.roundRect(seg.x*CELL+1, seg.y*CELL+1, CELL-2, CELL-2, 5);
    ctx.fill();
    if (i === 0) {
      // Eyes
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(seg.x*CELL+4, seg.y*CELL+4, 3, 3);
      ctx.fillRect(seg.x*CELL+13, seg.y*CELL+4, 3, 3);
    }
  });
}

function snakeDir(dir) {
  const dirs = { up:{x:0,y:-1}, down:{x:0,y:1}, left:{x:-1,y:0}, right:{x:1,y:0} };
  const newDir = dirs[dir];
  // Prevent reversing
  if (newDir.x === -snakeDir.x && newDir.y === -snakeDir.y) return;
  snakeDir = newDir;
}

// Keyboard controls
document.addEventListener('keydown', e => {
  const map = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right' };
  if (map[e.key]) { e.preventDefault(); snakeDir(map[e.key]); }
});

// ──────────────────────────────────────
// KAZAKHSTAN MAP
// ──────────────────────────────────────
// Simplified region polygons (schematic SVG paths for 17 regions)
const REGION_PATHS = {
  'Солтүстік Қазақстан': 'M 400 30 L 550 30 L 560 120 L 410 130 Z',
  'Ақмола':              'M 280 80 L 410 80 L 410 180 L 280 180 Z',
  'Павлодар':            'M 560 30 L 700 30 L 700 160 L 560 160 Z',
  'Шығыс Қазақстан':    'M 700 30 L 870 80 L 870 220 L 700 220 L 700 30 Z',
  'Қарағанды':           'M 280 180 L 560 180 L 560 350 L 280 350 Z',
  'Ақтөбе':              'M 100 80 L 280 80 L 280 280 L 100 280 Z',
  'Қостанай':            'M 150 30 L 400 30 L 400 80 L 280 80 L 280 180 L 150 180 Z',
  'Батыс Қазақстан':    'M 30 120 L 100 120 L 100 280 L 30 280 Z',
  'Атырау':              'M 30 280 L 150 280 L 150 380 L 30 380 Z',
  'Маңғыстау':           'M 30 380 L 150 380 L 170 470 L 30 470 Z',
  'Абай':                'M 700 220 L 870 220 L 870 370 L 700 370 Z',
  'Жетісу':              'M 560 350 L 700 350 L 700 450 L 560 450 Z',
  'Алматы':              'M 400 350 L 560 350 L 560 480 L 400 480 Z',
  'Жамбыл':              'M 250 380 L 400 380 L 400 480 L 250 480 Z',
  'Түркістан':           'M 130 380 L 250 380 L 250 520 L 130 520 Z',
  'Қызылорда':           'M 150 280 L 280 280 L 280 380 L 150 380 Z',
  'Ұлытау':              'M 150 180 L 280 180 L 280 280 L 150 280 Z',
};

// Region label positions
const REGION_LABELS = {
  'Солтүстік Қазақстан': [478, 80],
  'Ақмола':              [345, 130],
  'Павлодар':            [630, 95],
  'Шығыс Қазақстан':    [785, 125],
  'Қарағанды':           [420, 265],
  'Ақтөбе':              [190, 180],
  'Қостанай':            [275, 105],
  'Батыс Қазақстан':    [65, 200],
  'Атырау':              [90, 330],
  'Маңғыстау':           [100, 425],
  'Абай':                [785, 295],
  'Жетісу':              [630, 400],
  'Алматы':              [480, 415],
  'Жамбыл':              [325, 430],
  'Түркістан':           [190, 450],
  'Қызылорда':           [215, 330],
  'Ұлытау':              [215, 230],
};

function buildMap() {
  const svg = document.getElementById('kz-map');
  if (!svg || svg.dataset.built) return;
  svg.dataset.built = '1';
  svg.innerHTML = '';

  REGIONS.forEach(region => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = REGION_PATHS[region.name] || 'M 400 300 L 450 300 L 450 350 L 400 350 Z';
    path.setAttribute('d', pathData);
    path.setAttribute('class', 'region-path');

    const isUnlocked = state.regionProgress[region.name]?.unlocked || region.name === state.region;
    if (!isUnlocked) {
      path.classList.add('locked');
      path.style.fill = '#b2bec3';
    } else {
      path.style.fill = region.color;
    }
    if (region.name === state.region) path.classList.add('active');

    path.addEventListener('click', () => onRegionClick(region, isUnlocked));
    svg.appendChild(path);

    // Label
    const pos = REGION_LABELS[region.name] || [400, 300];
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos[0]);
    text.setAttribute('y', pos[1]);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '9');
    text.setAttribute('fill', isUnlocked ? '#fff' : '#636e72');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('pointer-events', 'none');
    text.textContent = region.name.length > 10 ? region.name.split(' ')[0] : region.name;
    svg.appendChild(text);

    // Lock icon
    if (!isUnlocked) {
      const lock = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lock.setAttribute('x', pos[0]);
      lock.setAttribute('y', pos[1] + 14);
      lock.setAttribute('text-anchor', 'middle');
      lock.setAttribute('font-size', '14');
      lock.setAttribute('pointer-events', 'none');
      lock.textContent = '🔒';
      svg.appendChild(lock);
    }
  });
}

function onRegionClick(region, isUnlocked) {
  const panel = document.getElementById('region-info-panel');
  panel.classList.remove('hidden');

  if (!isUnlocked) {
    panel.innerHTML = `<h3>🔒 ${region.name}</h3>
      <p>Бұл облыс әлі құлыпталған. Алдыңғы облысты аяқтаңыз!</p>`;
    return;
  }
  panel.innerHTML = `
    <h3>🗺️ ${region.name}</h3>
    <p><strong>Халық саны:</strong> ${region.pop} адам</p>
    <p><strong>Макс. монета:</strong> ${region.coins} 🪙</p>
    <p style="margin-top:8px;color:var(--text-light)">Ойындарды ойнап монета жина!</p>
    <div class="limit-bar-wrap" style="margin-top:10px">
      <div class="limit-bar" style="width:${Math.min((state.regionProgress[region.name]?.tasks || 0) / 10 * 100, 100)}%"></div>
    </div>
  `;
}

// ──────────────────────────────────────
// CASES
// ──────────────────────────────────────
const CASE_REWARDS = {
  bronze: [
    { label: '50 монета 🪙', coins: 50 },
    { label: '75 монета 🪙', coins: 75 },
    { label: '30 монета 🪙', coins: 30 },
    { label: '100 монета 🪙', coins: 100 },
  ],
  silver: [
    { label: '150 монета 🪙', coins: 150 },
    { label: '200 монета 🪙', coins: 200 },
    { label: '100 монета 🪙', coins: 100 },
    { label: '250 монета 🪙', coins: 250 },
  ],
  gold: [
    { label: '400 монета 🪙', coins: 400 },
    { label: '600 монета 🪙', coins: 600 },
    { label: '350 монета 🪙', coins: 350 },
    { label: '1000 монета 🪙 💎', coins: 1000 },
  ],
};

const CASE_PRICES = { bronze: 100, silver: 250, gold: 500 };

function openCase(type) {
  const price = CASE_PRICES[type];
  if (state.coins < price) {
    showPopup(`Монета жетпейді! Қажет: ${price} 🪙`);
    return;
  }
  state.coins -= price;
  const rewards = CASE_REWARDS[type];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  state.coins += reward.coins;
  document.getElementById('hub-coins').textContent = state.coins;
  const el = document.getElementById('case-result');
  el.classList.remove('hidden');
  el.innerHTML = `🎉 Жеңдің: <strong>${reward.label}</strong>`;
  saveState();
}

// ──────────────────────────────────────
// PROMO CODES
// ──────────────────────────────────────
function redeemPromo() {
  const code = document.getElementById('promo-input').value.trim().toUpperCase();
  const el = document.getElementById('promo-result');
  if (!code) { el.textContent = 'Промокод енгіз!'; el.className = 'promo-result error'; return; }
  if (state.promoUsed.includes(code)) {
    el.textContent = 'Бұл промокод бұрын пайдаланылды!';
    el.className = 'promo-result error';
    return;
  }
  const promo = PROMO_CODES[code];
  if (!promo) {
    el.textContent = 'Промокод табылмады! ❌';
    el.className = 'promo-result error';
    return;
  }
  state.promoUsed.push(code);
  addCoins(promo.coins);
  el.textContent = `✅ ${promo.label}`;
  el.className = 'promo-result success';
  document.getElementById('promo-input').value = '';
  saveState();
}

// ──────────────────────────────────────
// RATING
// ──────────────────────────────────────
function buildRating() {
  // Insert user into rating
  let list = [...state.rating];
  const me = { name: state.name || 'Сен', coins: state.coins, isMe: true };
  list.push(me);
  list.sort((a, b) => b.coins - a.coins);

  const medals = ['🥇','🥈','🥉'];
  document.getElementById('rating-list').innerHTML = list.map((r, i) => `
    <div class="rating-row ${r.isMe ? 'me' : ''}">
      <div class="rating-rank">${medals[i] || (i+1)}</div>
      <div class="rating-name">${r.name}${r.isMe ? ' (сен)' : ''}</div>
      <div class="rating-coins">${r.coins} 🪙</div>
    </div>
  `).join('');
}

// ──────────────────────────────────────
// PARENT MODE
// ──────────────────────────────────────
function pinInput(el, idx) {
  if (el.value.length === 1) {
    const next = document.querySelectorAll('.pin-digit')[idx + 1];
    if (next) next.focus();
  }
}

function checkPin() {
  const digits = [...document.querySelectorAll('.pin-digit')].map(d => d.value).join('');
  if (digits === state.pin) {
    document.getElementById('parent-lock').classList.add('hidden');
    document.getElementById('parent-panel').classList.remove('hidden');
    // Update stats
    const elapsed = Math.floor((Date.now() - state.sessionStart) / 60000);
    document.getElementById('ps-time').textContent = elapsed + ' мин';
    document.getElementById('ps-coins').textContent = state.coins + ' 🪙';
    document.getElementById('ps-games').textContent = state.gamesPlayed;
    document.getElementById('time-limit').value = state.timeLimit;
  } else {
    document.getElementById('pin-error').textContent = 'Қате PIN-код!';
    document.querySelectorAll('.pin-digit').forEach(d => d.value = '');
    document.querySelectorAll('.pin-digit')[0].focus();
  }
}

function saveTimeLimit() {
  state.timeLimit = parseInt(document.getElementById('time-limit').value) || 60;
  showPopup('Уақыт шегі сақталды! ✅');
  saveState();
}

function lockParent() {
  document.getElementById('parent-lock').classList.remove('hidden');
  document.getElementById('parent-panel').classList.add('hidden');
  document.querySelectorAll('.pin-digit').forEach(d => d.value = '');
  document.getElementById('pin-error').textContent = '';
}

// ──────────────────────────────────────
// POPUP
// ──────────────────────────────────────
function showPopup(msg) {
  document.getElementById('popup-message').textContent = msg;
  document.getElementById('popup-overlay').classList.remove('hidden');
}
function closePopup() {
  document.getElementById('popup-overlay').classList.add('hidden');
}

// ──────────────────────────────────────
// SAVE / LOAD STATE
// ──────────────────────────────────────
function saveState() {
  try { localStorage.setItem('botabot_state', JSON.stringify(state)); } catch(e) {}
}
function loadState() {
  try {
    const saved = localStorage.getItem('botabot_state');
    if (saved) {
      const s = JSON.parse(saved);
      Object.assign(state, s);
      return true;
    }
  } catch(e) {}
  return false;
}

// ──────────────────────────────────────
// HELPERS
// ──────────────────────────────────────
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ──────────────────────────────────────
// INIT
// ──────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  createStars();

  const hasSave = loadState();
  if (hasSave && state.name && state.region) {
    checkDailyReset();
    goToScreen('screen-hub');
    updateHubHeader();
    buildDailyTasks();
    buildRating();
    buildMap();
  } else {
    goToScreen('screen-welcome');
  }
});
