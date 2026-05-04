// ============================================================
// STATE & SAVE
// ============================================================
let state = {
  coins: 0, name: '', age: 9, avatarIdx: 0, inventory: [],
  equippedIcon: null, gamesPlayed: 0, wins: 0, usedPromos: [], lang: 'kk',
  snakeBest: 0, unlockedSecretAvatars: []
};
let currentLang = 'kk';
let selectedAge = null;
let tempAvIdx = 0;

function capitalize(s){ if(!s) return s; s=String(s).trim(); return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase(); }

function save() { try { localStorage.setItem('botaoy_v3', JSON.stringify(state)); } catch(e){} }
function load() {
  try {
    const s = localStorage.getItem('botaoy_v3');
    if (s) { state = {...state, ...JSON.parse(s)}; currentLang = state.lang || 'kk'; }
  } catch(e){}
}

// ============================================================
// TRANSLATIONS
// ============================================================
const T = {
  kk: {
    wt:'BotaOy', ws:'Ботамен бірге оқы және ойна!', wbtn:'Бастау!',
    ob_title:'Атың кім?', ob_age_lbl:'Жасыңды таңда:', ob_btn:'Бастайық!',
    menu_title:'Ойын таңда', menu_sub:'Ботакоин жина!',
    gc1:'Карта ойыны',gc2:'Қазақ тілі',gc3:'Математика',gc4:'Пазл',gc5:'Сөз табу',gc6:'Жылан ойыны',
    mem_title:'Карта ойыны', mem_sub:'Бірдей карталарды тауып жұпта',
    ml_moves:'Қадам',ml_match:'Жұп',mem_restart:'Жаңадан',
    quiz_title:'Қазақ тілі тесті',
    math_title:'Математика',math_sub:'Дұрыс жауапты тап',
    ml_score:'Ұпай',ml_streak:'Қатар',
    puz_title:'Пазл',ml_pmoves:'Қадам',ml_ptime:'Сек',puz_restart:'Жаңадан',
    word_title:'Сөз табу',word_sub:'Шатастырылған сөзді тап',
    ml_correct:'Дұрыс',ml_skip:'Өткізу',
    skip_btn:'Өткізу',submit_word:'Тексеру',
    shop_title:'Дүкен',shop_sub:'Ботакоинмен сатып ал',
    st1:'Кейстер',st2:'Иконкалар',st3:'Промокод',st4:'Рейтинг',
    cn1:'Қола кейс',cd1:'Стандартты кейс',
    cn2:'Күміс кейс',cd2:'Жақсы шанстар',
    cn3:'Алтын кейс',cd3:'Ең жоғары шанс',
    promo_title:'Промокод',promo_desc:'Промокодты енгіз және Ботакоин жина',
    promo_btn:'Активтендіру',promo_list_title:'ПРОМОКОДТАР',
    prof_title:'Менің профилім',prof_sub:'Менің статистикам',
    ps_games:'Ойын',ps_wins:'Жеңіс',ps_items:'Зат',
    inv_title:'Инвентарь',changename_btn:'Атымды өзгерту',
    nm_title:'Атымды өзгерту',nm_cancel:'Бас тарту',nm_save:'Сақтау',
    av_title:'Аватар таңда',av_cancel:'Бас тарту',av_save:'Сақтау',
    win_ok:'Жарайды!',
    nav1:'Басты',nav2:'Дүкен',nav3:'Профиль',
    case_spinning:'Кейс ашылуда...',case_btn:'Алу!',
    back_mem:'Артқа',back_quiz:'Артқа',back_math:'Артқа',back_puz:'Артқа',back_word:'Артқа',
    lv1:'Оңай',lv2:'Орта',lv3:'Қиын',
    rank0:'Жаңадан бастаушы',rank1:'Тәжірибелі',rank2:'Шебер',rank3:'Батыр',rank4:'Аңыз',
    owned_lbl:'Меніңді',equip_lbl:'Тағу',equipped_lbl:'Тағылған',locked_lbl:'Жоқ',
    toast_nocoins:'Ботакоин жетіспейді!',
    toast_promo_ok:'+{n} BC есептелді!',toast_promo_fail:'Жарамсыз промокод',toast_promo_used:'Промокод бұрын пайдаланылды',
    toast_icon_equip:' тағылды',toast_icon_buy:' сатып алынды!',toast_icon_locked:'Иконканы алдымен ашу керек!',
    toast_wrong:'Қате жауап',toast_correct:'Дұрыс! ',
    empty_inv:'Зат жоқ. Кейс аш!',
    puzzle_solved:'Пазл шешілді!',
    quiz_done:'Тест аяқталды!'
  },
  ru: {
    wt:'BotaOy', ws:'Учись и играй вместе с Ботой!', wbtn:'Начать!',
    ob_title:'Как тебя зовут?', ob_age_lbl:'Выбери возраст:', ob_btn:'Поехали!',
    menu_title:'Выбери игру', menu_sub:'Зарабатывай Ботакоины!',
    gc1:'Карточки',gc2:'Казахский',gc3:'Математика',gc4:'Пазл',gc5:'Слова',gc6:'Змейка',
    mem_title:'Карточная игра', mem_sub:'Найди одинаковые карточки',
    ml_moves:'Ходы',ml_match:'Пары',mem_restart:'Заново',
    quiz_title:'Тест по казахскому',
    math_title:'Математика',math_sub:'Найди правильный ответ',
    ml_score:'Очки',ml_streak:'Серия',
    puz_title:'Пазл',ml_pmoves:'Ходы',ml_ptime:'Сек',puz_restart:'Заново',
    word_title:'Угадай слово',word_sub:'Разгадай перепутанное слово',
    ml_correct:'Верно',ml_skip:'Пропуск',
    skip_btn:'Пропустить',submit_word:'Проверить',
    shop_title:'Магазин',shop_sub:'Трать Ботакоины',
    st1:'Кейсы',st2:'Иконки',st3:'Промокод',st4:'Рейтинг',
    cn1:'Бронзовый кейс',cd1:'Стандартный кейс',
    cn2:'Серебряный кейс',cd2:'Хорошие шансы',
    cn3:'Золотой кейс',cd3:'Максимальный шанс',
    promo_title:'Промокод',promo_desc:'Введи промокод и получи Ботакоины',
    promo_btn:'Активировать',promo_list_title:'ПРОМОКОДЫ',
    prof_title:'Мой профиль',prof_sub:'Моя статистика',
    ps_games:'Игры',ps_wins:'Победы',ps_items:'Предметы',
    inv_title:'Инвентарь',changename_btn:'Изменить имя',
    nm_title:'Изменить имя',nm_cancel:'Отмена',nm_save:'Сохранить',
    av_title:'Выбрать аватар',av_cancel:'Отмена',av_save:'Сохранить',
    win_ok:'Отлично!',
    nav1:'Главная',nav2:'Магазин',nav3:'Профиль',
    case_spinning:'Открываем кейс...',case_btn:'Забрать!',
    back_mem:'Назад',back_quiz:'Назад',back_math:'Назад',back_puz:'Назад',back_word:'Назад',
    lv1:'Легко',lv2:'Средне',lv3:'Сложно',
    rank0:'Новичок',rank1:'Опытный',rank2:'Мастер',rank3:'Батыр',rank4:'Легенда',
    owned_lbl:'Есть',equip_lbl:'Надеть',equipped_lbl:'Надето',locked_lbl:'Нет',
    toast_nocoins:'Не хватает Ботакоинов!',
    toast_promo_ok:'+{n} BC зачислено!',toast_promo_fail:'Неверный промокод',toast_promo_used:'Промокод уже использован',
    toast_icon_equip:' надета',toast_icon_buy:' куплена!',toast_icon_locked:'Сначала получи иконку!',
    toast_wrong:'Неверный ответ',toast_correct:'Верно! ',
    empty_inv:'Нет предметов. Открой кейс!',
    puzzle_solved:'Пазл собран!',
    quiz_done:'Тест завершён!'
  },
  en: {
    wt:'BotaOy', ws:'Learn and play with Bota!', wbtn:'Start!',
    ob_title:'What\'s your name?', ob_age_lbl:'Choose your age:', ob_btn:'Let\'s go!',
    menu_title:'Choose a game', menu_sub:'Earn Botacoins!',
    gc1:'Memory Cards',gc2:'Kazakh',gc3:'Math',gc4:'Puzzle',gc5:'Word Finder',gc6:'Snake',
    mem_title:'Memory Game', mem_sub:'Match the cards',
    ml_moves:'Moves',ml_match:'Pairs',mem_restart:'Restart',
    quiz_title:'Kazakh Language Quiz',
    math_title:'Math',math_sub:'Find the correct answer',
    ml_score:'Score',ml_streak:'Streak',
    puz_title:'Puzzle',ml_pmoves:'Moves',ml_ptime:'Sec',puz_restart:'Restart',
    word_title:'Word Finder',word_sub:'Unscramble the word',
    ml_correct:'Correct',ml_skip:'Skips',
    skip_btn:'Skip',submit_word:'Check',
    shop_title:'Shop',shop_sub:'Spend your Botacoins',
    st1:'Cases',st2:'Icons',st3:'Promo',st4:'Ranking',
    cn1:'Bronze Case',cd1:'Standard case',
    cn2:'Silver Case',cd2:'Better chances',
    cn3:'Gold Case',cd3:'Highest chance',
    promo_title:'Promo Code',promo_desc:'Enter a promo code and get Botacoins',
    promo_btn:'Activate',promo_list_title:'PROMO CODES',
    prof_title:'My Profile',prof_sub:'My statistics',
    ps_games:'Games',ps_wins:'Wins',ps_items:'Items',
    inv_title:'Inventory',changename_btn:'Change name',
    nm_title:'Change name',nm_cancel:'Cancel',nm_save:'Save',
    av_title:'Choose avatar',av_cancel:'Cancel',av_save:'Save',
    win_ok:'Great!',
    nav1:'Home',nav2:'Shop',nav3:'Profile',
    case_spinning:'Opening case...',case_btn:'Collect!',
    back_mem:'Back',back_quiz:'Back',back_math:'Back',back_puz:'Back',back_word:'Back',
    lv1:'Easy',lv2:'Medium',lv3:'Hard',
    rank0:'Beginner',rank1:'Experienced',rank2:'Master',rank3:'Batyr',rank4:'Legend',
    owned_lbl:'Owned',equip_lbl:'Equip',equipped_lbl:'Equipped',locked_lbl:'Locked',
    toast_nocoins:'Not enough Botacoins!',
    toast_promo_ok:'+{n} BC added!',toast_promo_fail:'Invalid promo code',toast_promo_used:'Promo code already used',
    toast_icon_equip:' equipped',toast_icon_buy:' purchased!',toast_icon_locked:'Get this icon first!',
    toast_wrong:'Wrong answer',toast_correct:'Correct! ',
    empty_inv:'No items. Open a case!',
    puzzle_solved:'Puzzle solved!',
    quiz_done:'Quiz complete!'
  }
};

function t(key) { return (T[currentLang] || T.kk)[key] || key; }

// ============================================================
// RANDOM SEQUENCE GENERATOR - ANTI-BOT PROTECTION
// ============================================================
function generateRandomSequence(length = 10) {
  const chars = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦШЩЪЫЬЭЮЯ0123456789';
  let seq = '';
  for (let i = 0; i < length; i++) {
    seq += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return seq;
}

function generateRandomQuizPool() {
  const allQuestions = [
    {q:'Қазақстанның астанасы?',opts:['Алматы','Астана','Қарағанды','Ақтөбе'],a:1},
    {q:'Ең ұзын өзен?',opts:['Іле','Сыр','Ертіс','Ишим'],a:2},
    {q:'"Мектеп" дегеніміз?',opts:['Дүкен','Оқу орны','Ауруханасы','Кітапхана'],a:1},
    {q:'Қазақстан неше облысты?',opts:['14','15','16','17'],a:2},
    {q:'Құран ерте қай жылы?',opts:['632','705','1991','1453'],a:0},
    {q:'Алтын Орда құрылған жылы?',opts:['1200','1236','1300','1400'],a:1},
    {q:'Қожа Ахмет Ясауи өмірі?',opts:['1093-1166','1200-1300','1150-1220','1100-1150'],a:0},
    {q:'Түркістан елінің население?',opts:['1млн','2млн','3млн','4млн'],a:2},
    {q:'Балқаш көлі қай облыста?',opts:['Қарағанды','Алматы','Түркістан','Жамбыл'],a:0},
    {q:'Тянь-Шань таулары?',opts:['Түркістан','Алматы','Жамбыл','Түргістан'],a:1},
  ];
  return allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
}

function generateRandomMathProblems() {
  const problems = [];
  for (let i = 0; i < 10; i++) {
    const type = Math.floor(Math.random() * 3);
    let a, b, op, ans;
    
    if (type === 0) { // Addition
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      op = '+';
      ans = a + b;
    } else if (type === 1) { // Subtraction
      a = Math.floor(Math.random() * 100) + 50;
      b = Math.floor(Math.random() * a);
      op = '-';
      ans = a - b;
    } else { // Multiplication
      a = Math.floor(Math.random() * 15) + 2;
      b = Math.floor(Math.random() * 15) + 2;
      op = '×';
      ans = a * b;
    }
    
    problems.push({ expr: `${a} ${op} ${b}`, answer: ans });
  }
  return problems;
}

function generateRandomWords() {
  const wordPool = [
    {word:'ҚАЗАҚ',hint:'Ұлт'},
    {word:'КОМПЬЮТЕР',hint:'Технология'},
    {word:'МЕКТЕП',hint:'Оқу орны'},
    {word:'ДОСТАР',hint:'Ағындарың'},
    {word:'ОЙЫН',hint:'Ойнау'},
    {word:'ҚАЛАМ',hint:'Жазу құралы'},
    {word:'КІТАП',hint:'Оқу'},
    {word:'БАЛАЛАР',hint:'Жас адамдар'},
    {word:'ОТБАСЫ',hint:'Ана-әке'},
    {word:'ҰСТАЗ',hint:'Мектептің'},
    {word:'ЕРТІС',hint:'Өзен'},
    {word:'АСТАНА',hint:'Елдің'},
    {word:'БАТЫР',hint:'Ерлі'},
    {word:'ДҮНИЕ',hint:'Дүние'},
    {word:'ӨНДІРІС',hint:'Тауар'},
  ];
  return wordPool.sort(() => Math.random() - 0.5);
}

// ============================================================
// UTILS
// ============================================================
function addCoins(n) {
  state.coins += n; save();
  document.getElementById('coinDisplay').textContent = state.coins;
  showCoinFloat(n); updateLeaderboard();
}

function showCoinFloat(n) {
  const el = document.getElementById('coinFloat');
  if (!el) return;
  el.textContent = '+' + n + ' BC';
  el.classList.remove('show'); 
  void el.offsetWidth; 
  el.classList.add('show');
}

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg; 
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function closeModal(id) { 
  const el = document.getElementById(id);
  if (el) el.classList.remove('open'); 
}

function showWin(title, msg, coins, emoji='🏆') {
  document.getElementById('winEmoji').textContent = emoji;
  document.getElementById('winTitle').textContent = title;
  document.getElementById('winMsg').textContent = msg;
  document.getElementById('winCoinsDisp').textContent = '+' + coins + ' BC';
  document.getElementById('win_ok').textContent = t('win_ok');
  document.getElementById('winModal').classList.add('open');
  addCoins(coins); 
  state.wins++; 
  state.gamesPlayed++; 
  save();
  launchConfetti(); 
}

function launchConfetti() {
  const wrap = document.getElementById('confettiWrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  const colors = ['#FF6B35','#4ECDC4','#FFD700','#9B59B6','#27AE60','#FF69B4','#2980B9'];
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.width = (8 + Math.random() * 8) + 'px';
    p.style.height = (12 + Math.random() * 12) + 'px';
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    p.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    p.style.animationDelay = Math.random() * 0.5 + 's';
    wrap.appendChild(p); 
    setTimeout(() => p.remove(), 4000);
  }
}

// ============================================================
// NAVIGATION
// ============================================================
var switchPage = function(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');
}

function setActiveNav(btn) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function openGame(name) {
  switchPage(name);
  state.gamesPlayed++; save();
  
  if (name === 'memory') initMemory();
  if (name === 'quiz') initQuiz();
  if (name === 'math') initMath();
  if (name === 'word') initWord();
}

function goBack() { switchPage('menu'); }

// ============================================================
// MEMORY GAME - 15 COINS PER MATCH
// ============================================================
let memCards=[], memFlipped=[], memMatchCount=0, memMoveCount=0, memLock=false, memEarned=0;

function initMemory() {
  const MEM_EMOJIS = ['🍎','🍊','🍋','🍌','🍇','🍓','🍒','🍑'];
  const pairs = [...MEM_EMOJIS,...MEM_EMOJIS].sort(() => Math.random()-0.5);
  memCards = pairs; 
  memFlipped=[]; 
  memMatchCount=0; 
  memMoveCount=0; 
  memEarned=0; 
  memLock=false;
  
  document.getElementById('memMoves').textContent = 0;
  document.getElementById('memMatches').textContent = 0;
  document.getElementById('memCoins').textContent = 0;
  
  const grid = document.getElementById('memGrid');
  grid.innerHTML = '';
  
  pairs.forEach((sym,i) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.innerHTML = `<div class="mem-card-inner"><div class="mem-back">?</div><div class="mem-front">${sym}</div></div>`;
    card.dataset.sym = sym;
    card.onclick = () => flipMem(card, i);
    grid.appendChild(card);
  });
}

function flipMem(card, idx) {
  if (memLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped'); 
  memFlipped.push(card);
  
  if (memFlipped.length === 2) {
    memMoveCount++;
    document.getElementById('memMoves').textContent = memMoveCount;
    memLock = true;
    
    setTimeout(() => {
      const [a,b] = memFlipped;
      if (a.dataset.sym === b.dataset.sym) {
        a.classList.add('matched'); 
        b.classList.add('matched');
        a.classList.remove('flipped'); 
        b.classList.remove('flipped');
        memMatchCount++; 
        memEarned += 15; // 15 COINS PER MATCH
        document.getElementById('memMatches').textContent = memMatchCount;
        document.getElementById('memCoins').textContent = memEarned;
        addCoins(15);
        
        if (memMatchCount === 8) {
          setTimeout(() => showWin(t('mem_title'),'🎉 '+memMatchCount+' '+t('ml_match'), memEarned,'🃏'), 300);
        }
      } else {
        a.classList.remove('flipped'); 
        b.classList.remove('flipped');
      }
      memFlipped=[]; 
      memLock=false;
    }, 800);
  }
}

// ============================================================
// QUIZ GAME - 15 COINS PER CORRECT
// ============================================================
let quizIdx=0, quizOrder=[], quizAnswered=false, quizEarned=0, quizQuestions=[];

function initQuiz() {
  quizQuestions = generateRandomQuizPool();
  quizOrder = [...Array(quizQuestions.length).keys()];
  quizIdx=0; 
  quizAnswered=false; 
  quizEarned=0;
  document.getElementById('quizCoinsLabel').textContent = '0 BC';
  showQuizQ();
}

function showQuizQ() {
  if (quizIdx >= quizOrder.length) { 
    showWin(t('quiz_done'),'🎉',quizEarned,'📚'); 
    setTimeout(initQuiz, 500); 
    return; 
  }
  
  const q = quizQuestions[quizOrder[quizIdx]];
  quizAnswered = false;
  document.getElementById('quizScoreLabel').textContent = (currentLang==='kk'?'Сұрақ ':'Вопрос ') + (quizIdx+1) + '/' + quizOrder.length;
  document.getElementById('quizProg').style.width = ((quizIdx+1)/quizOrder.length*100)+'%';
  document.getElementById('quizQ').textContent = q.q;
  
  const opts = document.getElementById('quizOpts');
  opts.innerHTML = '';
  ['A','B','C','D'].forEach((l,i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerHTML = `<span class="quiz-opt-letter">${l}</span>${q.opts[i]}`;
    btn.onclick = () => answerQuiz(i, q.a, btn);
    opts.appendChild(btn);
  });
}

function answerQuiz(sel, correct, btn) {
  if (quizAnswered) return;
  quizAnswered = true;
  document.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);
  
  if (sel === correct) {
    btn.classList.add('correct');
    quizEarned += 15; // 15 COINS PER CORRECT
    addCoins(15);
    document.getElementById('quizCoinsLabel').textContent = quizEarned + ' BC';
    showToast(t('toast_correct') + '+15 BC');
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.quiz-opt-btn')[correct].classList.add('correct');
    showToast(t('toast_wrong'));
  }
  setTimeout(() => { quizIdx++; showQuizQ(); }, 1400);
}

// ============================================================
// MATH GAME - 10 COINS PER CORRECT
// ============================================================
let mathScore=0, mathStreak=0, mathEarned=0, mathProblems=[], mathIdx=0;

function initMath() {
  mathProblems = generateRandomMathProblems();
  mathScore=0; 
  mathStreak=0; 
  mathEarned=0; 
  mathIdx=0;
  updateMathUI(); 
  genMath();
}

function updateMathUI() {
  document.getElementById('mathScore').textContent = mathScore;
  document.getElementById('mathStreak').textContent = mathStreak;
  document.getElementById('mathCoins').textContent = mathEarned;
  const badge = document.getElementById('mathStreakBadge');
  if (mathStreak >= 3) {
    badge.style.display = 'inline-block';
    badge.textContent = '🔥 ' + mathStreak;
  } else badge.style.display = 'none';
}

function genMath() {
  if (mathIdx >= mathProblems.length) {
    showWin(t('math_title'), mathScore + ' correct', mathEarned, '🔢');
    return;
  }
  
  const prob = mathProblems[mathIdx];
  document.getElementById('mathExpr').textContent = prob.expr + ' = ?';
  
  const wrongs = new Set([prob.answer]);
  while (wrongs.size < 4) { 
    const w = prob.answer+Math.floor(Math.random()*20)-10; 
    if (w!==prob.answer && w>=0) wrongs.add(w); 
  }
  
  const choices = [...wrongs].sort(()=>Math.random()-0.5);
  const div = document.getElementById('mathAnswers');
  div.innerHTML = '';
  
  choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'math-ans-btn'; 
    btn.textContent = ch;
    btn.onclick = () => answerMath(ch, prob.answer, btn);
    div.appendChild(btn);
  });
}

function answerMath(chosen, correct, btn) {
  document.querySelectorAll('.math-ans-btn').forEach(b => b.disabled = true);
  
  if (chosen === correct) {
    btn.classList.add('correct');
    mathStreak++; 
    mathScore++;
    const earn = 10; // 10 COINS PER CORRECT
    mathEarned += earn; 
    addCoins(earn);
    updateMathUI();
    showToast(t('toast_correct') + '+10 BC');
    mathIdx++;
    setTimeout(genMath, 900);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.math-ans-btn').forEach(b => { if(parseInt(b.textContent)===correct) b.classList.add('correct'); });
    mathStreak = 0; 
    updateMathUI();
    showToast(t('toast_wrong'));
    mathIdx++;
    setTimeout(genMath, 1300);
  }
}

// ============================================================
// WORD GAME - 10 COINS PER CORRECT
// ============================================================
let wordIdx=0, wordScore=0, wordSkips=3, wordEarned=0, wordOrder=[], wordWords=[];

function initWord() {
  wordWords = generateRandomWords();
  wordOrder = [...Array(wordWords.length).keys()];
  wordIdx=0; 
  wordScore=0; 
  wordSkips=3; 
  wordEarned=0;
  document.getElementById('wordScore').textContent=0;
  document.getElementById('wordSkips').textContent=3;
  document.getElementById('wordCoins').textContent=0;
  showWord();
}

function scrambleWord(w) {
  const arr = w.split('');
  do { arr.sort(()=>Math.random()-0.5); } while(arr.join('')===w && w.length>1);
  return arr.join('');
}

function showWord() {
  if (wordIdx >= wordOrder.length) {
    showWin(t('word_title'), wordScore + ' correct', wordEarned, '📝');
    return;
  }
  
  const w = wordWords[wordOrder[wordIdx]];
  document.getElementById('scrambledDisplay').textContent = scrambleWord(w.word);
  document.getElementById('wordHintTxt').textContent = (currentLang==='kk'?'Кеңес: ':currentLang==='ru'?'Подсказка: ':'Hint: ') + w.hint;
  
  const inp = document.getElementById('wordInput');
  if (inp) {
    inp.value=''; 
    inp.className='word-input';
    inp.focus();
  }
}

function checkWordLive() {
  if (wordIdx >= wordOrder.length) return;
  const w = wordWords[wordOrder[wordIdx]];
  if (document.getElementById('wordInput').value.toUpperCase().trim() === w.word) submitWord();
}

function submitWord() {
  if (wordIdx >= wordOrder.length) return;
  const w = wordWords[wordOrder[wordIdx]];
  const val = document.getElementById('wordInput').value.toUpperCase().trim();
  
  if (val === w.word) {
    wordScore++; 
    wordEarned+=10; // 10 COINS PER CORRECT
    document.getElementById('wordScore').textContent=wordScore;
    document.getElementById('wordCoins').textContent=wordEarned;
    document.getElementById('wordInput').classList.add('correct-input');
    addCoins(10); 
    showToast(t('toast_correct')+'+10 BC');
    wordIdx++; 
    setTimeout(showWord, 700);
  } else {
    showToast(t('toast_wrong'));
    document.getElementById('wordInput').value='';
  }
}

function skipWord() {
  if (wordSkips<=0) { showToast(currentLang==='kk'?'Өткізу аяқталды':currentLang==='ru'?'Пропуски закончились':'No skips left'); return; }
  wordSkips--; 
  document.getElementById('wordSkips').textContent=wordSkips;
  wordIdx++; 
  showWord();
}

// ============================================================
// PROFILE & AVATAR
// ============================================================
const AVATAR_SVGS = [
  {char:'🦁',color:'#FF6B35'},{char:'🐯',color:'#F39C12'},{char:'🦅',color:'#2C3E50'},
  {char:'🐺',color:'#7F8C8D'},{char:'🦊',color:'#E67E22'},{char:'🐲',color:'#27AE60'},
  {char:'🦋',color:'#9B59B6'},{char:'🦑',color:'#1ABC9C'},{char:'⭐',color:'#F1C40F'},
  {char:'🌈',color:'#E74C3C'},{char:'🎨',color:'#8E44AD'},{char:'🚀',color:'#2980B9'},
];

function openAvatarModal() {
  tempAvIdx = state.avatarIdx || 0;
  const grid = document.getElementById('avatarPickGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  AVATAR_SVGS.forEach((av, i) => {
    const div = document.createElement('div');
    div.className = 'avatar-pick-opt' + (i===tempAvIdx?' sel':'');
    div.innerHTML = `<svg viewBox="0 0 56 56" width="44" height="44"><circle cx="28" cy="28" r="26" fill="${av.color}33"/><text x="28" y="36" text-anchor="middle" font-size="24">${av.char}</text></svg>`;
    div.onclick = () => {
      tempAvIdx=i;
      document.querySelectorAll('.avatar-pick-opt').forEach(d=>d.classList.remove('sel'));
      div.classList.add('sel');
    };
    grid.appendChild(div);
  });
  
  document.getElementById('avatarModal').classList.add('open');
}

function saveAvatarPick() {
  state.avatarIdx = tempAvIdx; 
  save(); 
  updateProfileUI(); 
  closeModal('avatarModal');
}

function openNameModal() {
  const inp = document.getElementById('nameChangeInput');
  if (inp) inp.value = state.name||'';
  document.getElementById('nameModal').classList.add('open');
}

function saveName() {
  const n = document.getElementById('nameChangeInput').value.trim();
  if (!n) return;
  state.name = n; 
  save(); 
  updateProfileUI(); 
  closeModal('nameModal');
}

function updateProfileUI() {
  const av = AVATAR_SVGS[state.avatarIdx||0];
  document.getElementById('profileAvatarRing').innerHTML = `<svg viewBox="0 0 56 56" width="64" height="64"><circle cx="28" cy="28" r="26" fill="${av.color}33"/><text x="28" y="36" text-anchor="middle" font-size="28">${av.char}</text></svg>`;
  document.getElementById('pName').textContent = state.name || 'Қолданушы';
  
  const ranks = [{min:0,key:'rank0'},{min:200,key:'rank1'},{min:800,key:'rank2'},{min:2000,key:'rank3'},{min:6000,key:'rank4'}];
  let rk = ranks[0].key;
  for(const r of ranks) { if(state.coins>=r.min) rk=r.key; }
  document.getElementById('pRank').textContent = t(rk);
  document.getElementById('pGames').textContent = state.gamesPlayed;
  document.getElementById('pWins').textContent = state.wins;
  document.getElementById('pItems').textContent = state.inventory.length;
  document.getElementById('coinDisplay').textContent = state.coins;
}

// ============================================================
// ONBOARDING
// ============================================================
function selectAge(age, btn) {
  selectedAge = age;
  document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');
}

function goToOnboardStep2() {
  const name = document.getElementById('nameInputOnb').value.trim();
  if (!name) {
    showToast(currentLang==='kk'?'Атыңды жаз!':currentLang==='ru'?'Напиши своё имя!':'Write your name!');
    return;
  }
  document.querySelectorAll('.onboard-step').forEach(s => s.classList.remove('active'));
  document.getElementById('onboard-step2-age').classList.add('active');
}

function finishOnboard() {
  const name = document.getElementById('nameInputOnb').value.trim();
  if (!name) { 
    showToast(currentLang==='kk'?'Атыңды жаз!':currentLang==='ru'?'Напиши имя!':'Write name!'); 
    return; 
  }
  if (!selectedAge) { 
    showToast(currentLang==='kk'?'Жасыңды таңда!':currentLang==='ru'?'Выбери возраст!':'Choose age!'); 
    return; 
  }
  
  state.name = name;
  state.age = selectedAge;
  save();
  enterMainApp();
}

function enterMainApp() {
  document.getElementById('topBar').style.display = 'flex';
  document.getElementById('langBar').style.display = 'flex';
  document.getElementById('mainNav').style.display = 'flex';
  document.getElementById('coinDisplay').textContent = state.coins;
  switchPage('menu');
  applyLang();
}

function applyLang() {
  const keys = Object.keys(T.kk);
  keys.forEach(k => { const el = document.getElementById(k); if (el) el.textContent = t(k); });
}

function setLang(lang, btn) {
  currentLang = lang; 
  state.lang = lang; 
  save();
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyLang();
}

function updateLeaderboard() { save(); }

// ============================================================
// INIT
// ============================================================
load();

if (state.name) {
  enterMainApp();
  updateProfileUI();
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase().startsWith(currentLang.substring(0,2)));
  });
} else {
  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById('page-onboard').classList.add('active');
    document.querySelectorAll('.onboard-step').forEach(s=>s.classList.remove('active'));
    document.getElementById('onboard-step1').classList.add('active');
  }, 100);
}

applyLang();
