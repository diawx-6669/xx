// ============================================================
// STATE & SAVE
// ============================================================
let state = {
  coins: 0, name: '', age: 9, avatarIdx: 0, inventory: [],
  equippedIcon: null, gamesPlayed: 0, wins: 0, usedPromos: [], lang: 'kk',
  snakeBest: 0, unlockedSecretAvatars: [],
  homeRegion: '', // Домашний регион
  unlockedRegions: [], // Открытые регионы
  completedRegions: [], // Полностью завершённые регионы
  regionProgress: {}, // { regionKey: { tasksToday: 0, lastDate: '', totalCompleted: 0 } }
  parentPin: '', screenTimeStart: null, totalScreenTime: 0,
  dailyCoinsToday: 0, dailyDate: ''
};
let currentLang = 'kk';

function capitalize(s){ if(!s) return s; s=String(s).trim(); return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase(); }

let selectedAge = null;
let tempAvIdx = 0;

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
// REGION DATA — население и монеты
// ============================================================
const REGION_DATA = {
  'Алматинская': { pop: 3852600, maxCoins: 3852, kk: 'Алматы обл.', ru: 'Алматинская обл.', en: 'Almaty Region',
    cities: ['Алматы қаласы','Қапшағай','Талдықорған','Жаркент','Қасқелең'],
    facts: ['Қазақстандағы ең үлкен облыс', 'Тянь-Шань таулары бар', 'Алматы – бұрынғы астана', 'Шарын каньоны бар'] },
  'Туркестанская': { pop: 3410500, maxCoins: 3410, kk: 'Түркістан обл.', ru: 'Туркестанская обл.', en: 'Turkistan Region',
    cities: ['Шымкент','Түркістан','Кентау','Арыс','Сарыағаш'],
    facts: ['Қожа Ахмет Ясауи кесенесі бар', 'Ежелгі Жібек жолы өтеді', 'Ең жылы облыс', 'Шымкент – 3-ші үлкен қала'] },
  'Ақмолинская': { pop: 2316500, maxCoins: 2316, kk: 'Ақмола обл.', ru: 'Акмолинская обл.', en: 'Akmola Region',
    cities: ['Астана','Көкшетау','Степногорск','Атбасар'],
    facts: ['Астана – Қазақстан астанасы', 'Боровое курорты бар', 'Дала мен орман аймағы'] },
  'Жамбылская': { pop: 1222500, maxCoins: 1222, kk: 'Жамбыл обл.', ru: 'Жамбылская обл.', en: 'Zhambyl Region',
    cities: ['Тараз','Шу','Қаратау','Жанатас'],
    facts: ['Тараз – 2000 жылдық қала', 'Айша-бибі кесенесі бар', 'Фосфор өндірісі дамыған'] },
  'Карагандинская': { pop: 1133900, maxCoins: 1133, kk: 'Қарағанды обл.', ru: 'Карагандинская обл.', en: 'Karaganda Region',
    cities: ['Қарағанды','Теміртау','Балқаш','Жезқазған'],
    facts: ['Балқаш көлі бар', 'Болат өндірісі орталығы', 'Дала жануарлары мекені'] },
  'Актюбинская': { pop: 949600, maxCoins: 949, kk: 'Ақтөбе обл.', ru: 'Актюбинская обл.', en: 'Aktobe Region',
    cities: ['Ақтөбе','Хромтау','Кандыағаш'],
    facts: ['Мұнай мен газ байлығы', 'Хром кені бар', 'Батыс Қазақстан орталығы'] },
  'Кызылординская': { pop: 846300, maxCoins: 846, kk: 'Қызылорда обл.', ru: 'Кызылординская обл.', en: 'Kyzylorda Region',
    cities: ['Қызылорда','Байқоңыр','Арал'],
    facts: ['Байқоңыр ғарыш айлағы бар', 'Сырдария өзені ағады', 'Күріш егіледі'] },
  'Костанайская': { pop: 825500, maxCoins: 825, kk: 'Қостанай обл.', ru: 'Костанайская обл.', en: 'Kostanay Region',
    cities: ['Қостанай','Рудный','Лисаков','Аркалық'],
    facts: ['Темір кені байлығы', 'Астық амбары деп аталады', 'Тобыл өзені бар'] },
  'Мангистауская': { pop: 805300, maxCoins: 805, kk: 'Маңғыстау обл.', ru: 'Мангистауская обл.', en: 'Mangistau Region',
    cities: ['Ақтау','Жаңаөзен','Форт-Шевченко'],
    facts: ['Каспий теңізі жағасында', 'Мұнай өндірісі', 'Бозжыра каньоны бар'] },
  'Павлодарская': { pop: 751000, maxCoins: 751, kk: 'Павлодар обл.', ru: 'Павлодарская обл.', en: 'Pavlodar Region',
    cities: ['Павлодар','Екібастұз','Ақсу'],
    facts: ['Ертіс өзені жағасы', 'Көмір өндірісі', 'Баянауыл табиғат паркі'] },
  'Восточно-Казахстанская': { pop: 723900, maxCoins: 723, kk: 'ШҚО', ru: 'Восточно-Казахстанская обл.', en: 'East Kazakhstan Region',
    cities: ['Өскемен','Семей','Риддер','Аягөз'],
    facts: ['Алтай таулары бар', 'Ертіс өзенінің бастауы', 'Абай Құнанбаев мекені'] },
  'Атырауская': { pop: 710800, maxCoins: 710, kk: 'Атырау обл.', ru: 'Атырауская обл.', en: 'Atyrau Region',
    cities: ['Атырау','Қарабалық'],
    facts: ['Каспий теңізінде мұнай', 'Жайық өзені ағады', 'Европа мен Азияның шекарасы'] },
  'Западно-Казахстанская': { pop: 696000, maxCoins: 696, kk: 'БҚО', ru: 'Западно-Казахстанская обл.', en: 'West Kazakhstan Region',
    cities: ['Орал','Ақсай'],
    facts: ['Жайық өзенінде балық', 'Пугачёв тарихи орны', 'Атырау мен Ресейге жақын'] },
  'Область Жетісу': { pop: 694400, maxCoins: 694, kk: 'Жетісу обл.', ru: 'Область Жетісу', en: 'Zhetysu Region',
    cities: ['Талдықорған','Текелі','Сарқан','Ескелді'],
    facts: ['«Жеті су» — жеті өзен', 'Жоңғар Алатауы', 'Алма өсіретін жер'] },
  'Область Абай': { pop: 602800, maxCoins: 602, kk: 'Абай обл.', ru: 'Область Абай', en: 'Abai Region',
    cities: ['Семей','Аягөз','Шарбақты'],
    facts: ['Ұлы Абайдың туған жері', 'Семей ядролық сынақ алаңы болған', 'Дала мен тау аралығы'] },
  'Северо-Казахстанская': { pop: 522100, maxCoins: 522, kk: 'СҚО', ru: 'Северо-Казахстанская обл.', en: 'North Kazakhstan Region',
    cities: ['Петропавл','Мамлют'],
    facts: ['Сибирьге жақын', 'Астық дақылдары', 'Ишим өзені ағады'] },
  'Область Ұлытау': { pop: 221300, maxCoins: 221, kk: 'Ұлытау обл.', ru: 'Область Улытау', en: 'Ulytau Region',
    cities: ['Жезқазған','Ұлытау','Сатпаев'],
    facts: ['Ұлытау — Қазақстанның жүрегі', 'Ханның тарихи ордасы', 'Алаша хан кесенесі'] }
};

// Нормализация ключей регионов
function normalizeRegion(r) {
  const map = {
    'Ақмолинская': 'Ақмолинская', 'Акмолинская':'Ақмолинская',
    'Алматинская':'Алматинская', 'Атырауская':'Атырауская',
    'Актюбинская':'Актюбинская', 'Восточно-Казахстанская':'Восточно-Казахстанская',
    'Жамбылская':'Жамбылская', 'Западно-Казахстанская':'Западно-Казахстанская',
    'Карагандинская':'Карагандинская', 'Костанайская':'Костанайская',
    'Кызылординская':'Кызылординская', 'Мангистауская':'Мангистауская',
    'Павлодарская':'Павлодарская', 'Северо-Казахстанская':'Северо-Казахстанская',
    'Туркестанская':'Туркестанская', 'Область Жетісу':'Область Жетісу',
    'Область Абай':'Область Абай', 'Область Ұлытау':'Область Ұлытау'
  };
  return map[r] || r;
}

function getRegionMaxCoins(region) {
  const r = REGION_DATA[normalizeRegion(region)];
  return r ? r.maxCoins : 100;
}

// 20% ежедневный лимит по региону
function getDailyLimit(region) {
  return Math.floor(getRegionMaxCoins(region) * 0.20);
}

function getTodayStr() {
  return new Date().toISOString().slice(0,10);
}

function getRegionCoinsToday(region) {
  const k = normalizeRegion(region);
  const rp = state.regionProgress[k] || {};
  if (rp.lastDate !== getTodayStr()) return 0;
  return rp.coinsToday || 0;
}

function addRegionCoins(region, n) {
  const k = normalizeRegion(region);
  if (!state.regionProgress[k]) state.regionProgress[k] = {};
  const rp = state.regionProgress[k];
  const today = getTodayStr();
  if (rp.lastDate !== today) { rp.coinsToday = 0; rp.lastDate = today; }
  const limit = getDailyLimit(region);
  const already = rp.coinsToday || 0;
  const canAdd = Math.max(0, limit - already);
  const actual = Math.min(n, canAdd);
  if (actual <= 0) { showToast(currentLang==='kk'?'Бүгінгі лимит толды! ⏰':currentLang==='ru'?'Дневной лимит исчерпан! ⏰':'Daily limit reached! ⏰'); return 0; }
  rp.coinsToday = already + actual;
  save();
  addCoins(actual);
  if (actual < n) showToast(currentLang==='kk'?'Лимит: +'+actual+' BC ғана':currentLang==='ru'?'Лимит: только +'+actual+' BC':'Limit: only +'+actual+' BC');
  return actual;
}

// Определение языка системы
function detectSystemLang() {
  const sysLang = (navigator.language || navigator.userLanguage || 'kk').toLowerCase();
  if (sysLang.startsWith('ru')) return 'ru';
  if (sysLang.startsWith('en')) return 'en';
  return 'kk'; // По умолчанию казахский
}

function applySystemLangGreeting() {
  const sysLang = detectSystemLang();
  const greetings = { kk: 'Қалайсың! 🐪', ru: 'Привет! 🐪', en: 'Hello! 🐪' };
  const wsub = { kk: 'Ботамен бірге оқы және ойна!', ru: 'Учись и играй вместе с Ботой!', en: 'Learn and play with Bota!' };
  const el = document.getElementById('ws');
  if (el) el.textContent = greetings[sysLang] || greetings.kk;
  const el2 = document.getElementById('wsub2');
  if (el2) el2.textContent = wsub[sysLang] || wsub.kk;
}

function applyLang() {
  try { translateWelcomeScreen(); } catch(e){}
  const keys = Object.keys(T.kk);
  keys.forEach(k => { const el = document.getElementById(k); if (el) el.textContent = t(k); });
  ['lv1','lv2','lv3'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = t(id); });
  // Nav5 (Parent)
  const nav5 = document.getElementById('nav5');
  if (nav5) nav5.textContent = currentLang==='kk'?'Ата-ана':currentLang==='ru'?'Родитель':'Parent';
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setLang(lang, btn) {
  currentLang = lang; state.lang = lang; save();
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyLang(); renderPromoList();
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
  el.textContent = '+' + n + ' BC';
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
}

// Похвалы от боты
const BOTA_PRAISES = [
  'Жарайсың! 🌟','Өте жақсы! 🎉','Керемет! ✨','Тамаша! 🏆','Сен ең жақсысың! 💪',
  'Адемі! 🌈','Жасадың! 🎊','Суперсің! 🚀','Жарайсың, батыр! ⭐','Мықтысың! 🔥'
];
let botaSpeechTimeout;
function showBotaPraise() {
  const el = document.getElementById('botaSpeech');
  el.textContent = BOTA_PRAISES[Math.floor(Math.random()*BOTA_PRAISES.length)];
  el.classList.add('show');
  clearTimeout(botaSpeechTimeout);
  botaSpeechTimeout = setTimeout(() => el.classList.remove('show'), 2800);
}
function toggleBotaSpeech() {
  const el = document.getElementById('botaSpeech');
  if (el.classList.contains('show')) { el.classList.remove('show'); } else { showBotaPraise(); }
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function showWin(title, msg, coins, emoji='🏆') {
  document.getElementById('winEmoji').textContent = emoji;
  document.getElementById('winTitle').textContent = title;
  document.getElementById('winMsg').textContent = msg;
  document.getElementById('winCoinsDisp').textContent = '+' + coins + ' BC';
  document.getElementById('win_ok').textContent = t('win_ok');
  document.getElementById('winModal').classList.add('open');
  addCoins(coins); state.wins++; state.gamesPlayed++; save();
  launchConfetti(); showBotaPraise();
}

function launchConfetti() {
  const wrap = document.getElementById('confettiWrap');
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
    wrap.appendChild(p); setTimeout(() => p.remove(), 4000);
  }
}

function launchSmallConfetti() {
  const wrap = document.getElementById('confettiWrap');
  const colors = ['#FF6B35','#4ECDC4','#FFD700'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = (30 + Math.random() * 40) + 'vw';
    p.style.background = colors[i%3];
    p.style.width = p.style.height = '8px';
    p.style.borderRadius = '50%';
    p.style.animationDuration = (1 + Math.random()) + 's';
    wrap.appendChild(p); setTimeout(() => p.remove(), 2000);
  }
}

// ============================================================
// NAVIGATION
// ============================================================
var switchPage = function(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
}

function setActiveNav(btn) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function openGame(name) {
  switchPage(name);
  state.gamesPlayed++; save();
  if (name === 'memory') initMemory();
  if (name === 'quiz') initQuiz();
  if (name === 'math') { mathScore=0; mathStreak=0; mathEarned=0; updateMathUI(); genMath(); }
  if (name === 'puzzle') initPuzzle();
  if (name === 'word') initWord();
  if (name === 'snake') initSnake();
}

function goBack() { if (snakeLoop) stopSnake(); switchPage('menu'); }

function goToOnboard() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-onboard').classList.add('active');
  // Reset to step 1
  document.querySelectorAll('.onboard-step').forEach(s => s.classList.remove('active'));
  document.getElementById('onboard-step1').classList.add('active');
}

// Старая функция для совместимости
function backToStep1() { backToStep1Onboard(); }

// ============================================================
// WELCOME & ONBOARD
// ============================================================
function selectAge(age, btn) {
  selectedAge = age;
  document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

// ============================================================
// WELCOME & ONBOARD — 3-шаговый диалог с маскотом
// ============================================================

function backToStep1Onboard() {
  document.querySelectorAll('.onboard-step').forEach(s => s.classList.remove('active'));
  document.getElementById('onboard-step1').classList.add('active');
}

function backToAgeStep() {
  document.querySelectorAll('.onboard-step').forEach(s => s.classList.remove('active'));
  document.getElementById('onboard-step2-age').classList.add('active');
}

// ШАГ 1 → ШАГ 2: получили имя, спрашиваем возраст
function goToOnboardStep2() {
  const name = document.getElementById('nameInputOnb').value.trim();
  if (!name) {
    showToast(currentLang==='kk'?'Атыңды жаз!':currentLang==='ru'?'Напиши своё имя!':'Write your name!');
    return;
  }
  // Маскот обращается по имени и спрашивает возраст
  const greets = {
    kk: `Қош келдің, ${capitalize(name)}! 🎉 Қане, нешедесің?`,
    ru: `Привет, ${capitalize(name)}! 🎉 А сколько тебе лет?`,
    en: `Hi, ${capitalize(name)}! 🎉 How old are you?`
  };
  const el = document.getElementById('ob_age_question');
  if (el) el.textContent = greets[currentLang] || greets.kk;
  document.querySelectorAll('.onboard-step').forEach(s => s.classList.remove('active'));
  document.getElementById('onboard-step2-age').classList.add('active');
}

// ШАГ 2 → ШАГ 3: получили возраст, спрашиваем регион
function goToOnboardStep3() {
  if (!selectedAge) {
    showToast(currentLang==='kk'?'Жасыңды таңда!':currentLang==='ru'?'Выбери возраст!':'Choose your age!');
    return;
  }
  const name = document.getElementById('nameInputOnb').value.trim();
  const regionQ = {
    kk: `Тамаша, ${capitalize(name)}! Сен қай облыстан боласың? 📍`,
    ru: `Здорово, ${capitalize(name)}! Из какой ты области? 📍`,
    en: `Great, ${capitalize(name)}! Which region are you from? 📍`
  };
  const el = document.getElementById('ob2_title');
  if (el) el.textContent = regionQ[currentLang] || regionQ.kk;
  document.querySelectorAll('.onboard-step').forEach(s => s.classList.remove('active'));
  document.getElementById('onboard-step3').classList.add('active');
}

function finishOnboard() {
  const name = document.getElementById('nameInputOnb').value.trim();
  if (!name) { showToast(currentLang==='kk'?'Атыңды жаз!':currentLang==='ru'?'Напиши имя!':'Write name!'); return; }
  if (!selectedAge) { showToast(currentLang==='kk'?'Жасыңды таңда!':currentLang==='ru'?'Выбери возраст!':'Choose age!'); return; }
  const region = document.getElementById('regionSelect').value;
  if (!region) { showToast(currentLang==='kk'?'Облысты таңда!':currentLang==='ru'?'Выбери область!':'Choose region!'); return; }
  state.name = name;
  state.age = selectedAge;
  state.homeRegion = normalizeRegion(region);
  state.unlockedRegions = [normalizeRegion(region)];
  if (!state.regionProgress[normalizeRegion(region)]) state.regionProgress[normalizeRegion(region)] = {};
  save();
  enterMainApp();
}

function enterMainApp() {
  document.getElementById('topBar').style.display = 'flex';
  document.getElementById('langBar').style.display = 'flex';
  document.getElementById('mainNav').style.display = 'flex';
  document.getElementById('botaBot').style.display = 'block';
  document.getElementById('coinDisplay').textContent = state.coins;
  switchPage('menu'); applyLang(); generateStars();
  startScreenTimer();
}

// ============================================================
// STARS
// ============================================================
function generateStars() {
  const bg = document.getElementById('starsBg');
  for (let i = 0; i < 12; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDuration = (8 + Math.random() * 12) + 's';
    s.style.animationDelay = Math.random() * 8 + 's';
    s.style.width = s.style.height = (6 + Math.random() * 10) + 'px';
    bg.appendChild(s);
  }
}

// ============================================================
// MEMORY GAME
// ============================================================
const MEM_CANDIES = ['candy1.png','candy2.png','candy3.png','candy4.png','candy5.png','candy6.png','candy7.png','candy8.png'];
const MEM_EMOJIS = MEM_CANDIES; // совместимость
let memCards=[], memFlipped=[], memMatchCount=0, memMoveCount=0, memLock=false, memEarned=0;

function initMemory() {
  const pairs = [...MEM_EMOJIS,...MEM_EMOJIS].sort(() => Math.random()-0.5);
  memCards = pairs; memFlipped=[]; memMatchCount=0; memMoveCount=0; memEarned=0; memLock=false;
  document.getElementById('memMoves').textContent = 0;
  document.getElementById('memMatches').textContent = 0;
  document.getElementById('memCoins').textContent = 0;
  const grid = document.getElementById('memGrid');
  grid.innerHTML = '';
  pairs.forEach((sym,i) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.innerHTML = `<div class="mem-card-inner"><div class="mem-face mem-back"><svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="rgba(255,255,255,0.6)"/></svg></div><div class="mem-face mem-front"><img src="./bota/${sym}" alt="candy" style="width:80%;height:80%;object-fit:contain;pointer-events:none"></div></div>`;
    card.dataset.sym = sym;
    card.onclick = () => flipMem(card, i);
    grid.appendChild(card);
  });
}

function flipMem(card, idx) {
  if (memLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped'); memFlipped.push(card);
  if (memFlipped.length === 2) {
    memMoveCount++;
    document.getElementById('memMoves').textContent = memMoveCount;
    memLock = true;
    setTimeout(() => {
      const [a,b] = memFlipped;
      if (a.dataset.sym === b.dataset.sym) {
        a.classList.add('matched'); b.classList.add('matched');
        a.classList.remove('flipped'); b.classList.remove('flipped');
        memMatchCount++; memEarned += 10;
        document.getElementById('memMatches').textContent = memMatchCount;
        document.getElementById('memCoins').textContent = memEarned;
        addCoins(10); showBotaPraise();
        if (memMatchCount === MEM_EMOJIS.length) setTimeout(() => showWin(t('mem_title'),'🎉 '+memMatchCount+' '+t('ml_match'),50,'🃏'),300);
      } else {
        a.classList.remove('flipped'); b.classList.remove('flipped');
      }
      memFlipped=[]; memLock=false;
    }, 800);
  }
}

// ============================================================
// QUIZ GAME
// ============================================================
const QUIZ_ALL = {
  kk: [
    {q:'"Мектеп" сөзінің мағынасы қандай?',opts:['Оқу орны','Дүкен','Ауруxана','Кітапхана'],a:0},
    {q:'Қазақстанның астанасы қай қала?',opts:['Алматы','Шымкент','Астана','Ақтөбе'],a:2},
    {q:'"Достық" сөзінің антонимі?',opts:['Сүйіспеншілік','Жаулық','Бірлік','Татулық'],a:1},
    {q:'"Батыр" сөзінің мағынасы?',opts:['Қорқақ','Ер жүрек','Ақылды','Жылдам'],a:1},
    {q:'Қазақ тілінде неше дауысты дыбыс бар?',opts:['6','7','9','12'],a:2},
    {q:'"Мен" сөзі қай септікте тұр: "Менің кітабым"?',opts:['Атау','Ілік','Барыс','Табыс'],a:1},
    {q:'"Сәлем" сөзінің мағынасы?',opts:['Хош бол','Амандасу сөзі','Рахмет','Кешір'],a:1},
    {q:'Қазақ тілінде "апа" кімді білдіреді?',opts:['Інің','Сіңліңің','Үлкен әйел туыс','Анаң'],a:2},
    {q:'Қазақ алфавитіндегі әріп саны?',opts:['32','36','42','28'],a:2},
    {q:'"Кеше" сөзі қай уақытты білдіреді?',opts:['Ертең','Биыл','Өткен күн','Бүгін'],a:2},
    {q:'"Жайлау" деген не?',opts:['Жазғы шабындық','Тау шыңы','Өзен','Орман'],a:0},
    {q:'Қазақ тілінде "шешесі" деген кімді білдіреді?',opts:['Баласы','Анасы','Ағасы','Қызы'],a:1},
  ],
  ru: [
    {q:'Что означает слово "мектеп"?',opts:['Школа','Магазин','Больница','Библиотека'],a:0},
    {q:'Столица Казахстана?',opts:['Алматы','Шымкент','Астана','Актобе'],a:2},
    {q:'Антоним слова "достық" (дружба)?',opts:['Любовь','Вражда','Единство','Согласие'],a:1},
    {q:'Что означает "батыр"?',opts:['Трус','Храбрец','Умный','Быстрый'],a:1},
    {q:'Сколько гласных в казахском?',opts:['6','7','9','12'],a:2},
    {q:'Что означает "сәлем"?',opts:['До свидания','Приветствие','Спасибо','Прости'],a:1},
    {q:'Кто такая "апа"?',opts:['Брат','Сестра','Старшая родственница','Мама'],a:2},
    {q:'Сколько букв в казахском алфавите?',opts:['32','36','42','28'],a:2},
    {q:'Что означает "кеше"?',opts:['Завтра','В этом году','Вчера','Сегодня'],a:2},
    {q:'Что такое "жайлау"?',opts:['Летнее пастбище','Вершина горы','Река','Лес'],a:0},
    {q:'Казахстан находится в Центральной Азии?',opts:['Да','Нет','Частично','Не знаю'],a:0},
    {q:'"Шешесі" означает?',opts:['Сын','Мама','Брат','Дочь'],a:1},
  ],
  en: [
    {q:'What does "mektep" mean?',opts:['School','Shop','Hospital','Library'],a:0},
    {q:'Capital of Kazakhstan?',opts:['Almaty','Shymkent','Astana','Aktobe'],a:2},
    {q:'Opposite of "dostyk" (friendship)?',opts:['Love','Enmity','Unity','Harmony'],a:1},
    {q:'What does "batyr" mean?',opts:['Coward','Hero','Smart','Fast'],a:1},
    {q:'How many vowels in Kazakh?',opts:['6','7','9','12'],a:2},
    {q:'What does "salem" mean?',opts:['Goodbye','Hello/Greeting','Thank you','Sorry'],a:1},
    {q:'Who is "apa"?',opts:['Brother','Sister','Elder female relative','Mother'],a:2},
    {q:'Letters in Kazakh alphabet?',opts:['32','36','42','28'],a:2},
    {q:'"Keshe" means?',opts:['Tomorrow','This year','Yesterday','Today'],a:2},
    {q:'What is "zhailau"?',opts:['Summer pasture','Mountain peak','River','Forest'],a:0},
    {q:'Is Kazakhstan in Central Asia?',opts:['Yes','No','Partly','Don\'t know'],a:0},
    {q:'"Sheshesi" means?',opts:['Son','Mother','Brother','Daughter'],a:1},
  ]
};

let quizIdx=0, quizOrder=[], quizAnswered=false, quizEarned=0;

function initQuiz() {
  const qs = QUIZ_ALL[currentLang] || QUIZ_ALL.kk;
  quizOrder = [...Array(qs.length).keys()].sort(()=>Math.random()-0.5).slice(0,10);
  quizIdx=0; quizAnswered=false; quizEarned=0;
  document.getElementById('quizCoinsLabel').textContent = '0 BC';
  showQuizQ();
}

function showQuizQ() {
  const qs = QUIZ_ALL[currentLang] || QUIZ_ALL.kk;
  if (quizIdx >= quizOrder.length) { showWin(t('quiz_done'),'🎉',60,'📚'); setTimeout(initQuiz, 500); return; }
  const q = qs[quizOrder[quizIdx]];
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
    quizEarned += 15; addCoins(15);
    document.getElementById('quizCoinsLabel').textContent = quizEarned + ' BC';
    showToast(t('toast_correct') + '+15 BC');
    launchSmallConfetti(); showBotaPraise();
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.quiz-opt-btn')[correct].classList.add('correct');
    showToast(t('toast_wrong'));
  }
  setTimeout(() => { quizIdx++; showQuizQ(); }, 1400);
}

// ============================================================
// MATH GAME
// ============================================================
let mathScore=0, mathStreak=0, mathEarned=0;

function updateMathUI() {
  document.getElementById('mathScore').textContent = mathScore;
  document.getElementById('mathStreak').textContent = mathStreak;
  document.getElementById('mathCoins').textContent = mathEarned;
  const badge = document.getElementById('mathStreakBadge');
  if (mathStreak >= 3) {
    badge.style.display = 'inline-block';
    badge.textContent = '🔥 ' + (currentLang==='kk'?'Қатар: ':currentLang==='ru'?'Серия: ':'Streak: ') + mathStreak;
  } else badge.style.display = 'none';
}

function genMath() {
  const ops = ['+','-','*'];
  const op = ops[Math.floor(Math.random()*3)];
  let a,b,ans;
  if (op==='+'){a=Math.floor(Math.random()*50)+1;b=Math.floor(Math.random()*50)+1;ans=a+b;}
  if (op==='-'){a=Math.floor(Math.random()*50)+20;b=Math.floor(Math.random()*(a-1))+1;ans=a-b;}
  if (op==='*'){a=Math.floor(Math.random()*12)+1;b=Math.floor(Math.random()*12)+1;ans=a*b;}
  document.getElementById('mathExpr').textContent = `${a} ${op==='*'?'×':op} ${b} = ?`;
  const wrongs = new Set([ans]);
  while (wrongs.size < 4) { const w = ans+Math.floor(Math.random()*20)-10; if (w!==ans && w>=0) wrongs.add(w); }
  const choices = [...wrongs].sort(()=>Math.random()-0.5);
  const div = document.getElementById('mathAnswers');
  div.innerHTML = '';
  choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'math-ans-btn'; btn.textContent = ch;
    btn.onclick = () => answerMath(ch, ans, btn);
    div.appendChild(btn);
  });
}

function answerMath(chosen, correct, btn) {
  document.querySelectorAll('.math-ans-btn').forEach(b => b.disabled = true);
  if (chosen === correct) {
    btn.classList.add('correct');
    mathStreak++; mathScore++;
    const earn = 12 + (mathStreak>=3?8:0);
    mathEarned += earn; addCoins(earn);
    updateMathUI();
    showToast(t('toast_correct') + '+' + earn + ' BC');
    launchSmallConfetti(); showBotaPraise();
    setTimeout(genMath, 900);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.math-ans-btn').forEach(b => { if(parseInt(b.textContent)===correct) b.classList.add('correct'); });
    mathStreak = 0; updateMathUI();
    showToast(t('toast_wrong'));
    setTimeout(genMath, 1300);
  }
}

// ============================================================
// PUZZLE GAME (Сложный режим — 5x5, 24 плитки!)
// ============================================================
let puzzleSize=3, puzzleTiles=[], puzzleMoves=0, puzzleTime=0, puzzleInterval=null, puzzleEarned=0, puzzleSolved=false;

function setPuzzleLevel(size, btn) {
  document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  puzzleSize = size; initPuzzle();
}

function initPuzzle() {
  const n = puzzleSize * puzzleSize;
  const tiles = [...Array(n).keys()];
  let attempts = 0;
  do { tiles.sort(()=>Math.random()-0.5); attempts++; } while ((!isSolvable(tiles,puzzleSize) || isSolved(tiles)) && attempts < 1000);
  puzzleTiles = tiles; puzzleMoves=0; puzzleTime=0; puzzleEarned=0; puzzleSolved=false;
  clearInterval(puzzleInterval);
  document.getElementById('puzMoves').textContent=0;
  document.getElementById('puzTime').textContent=0;
  document.getElementById('puzCoins').textContent=0;
  puzzleInterval = setInterval(()=>{ if(!puzzleSolved){ puzzleTime++; document.getElementById('puzTime').textContent=puzzleTime; }},1000);
  renderPuzzle();
}

function isSolvable(tiles, n) {
  let inv=0;
  for(let i=0;i<tiles.length;i++)
    for(let j=i+1;j<tiles.length;j++)
      if(tiles[i]&&tiles[j]&&tiles[i]>tiles[j]) inv++;
  if(n%2===1) return inv%2===0;
  const emptyRow = Math.floor(tiles.indexOf(0)/n);
  return (inv+emptyRow)%2===1;
}

function isSolved(tiles) { return tiles.every((v,i)=>v===(i===tiles.length-1?0:i+1)); }

function renderPuzzle() {
  const board = document.getElementById('puzzleBoard');
  board.className = 'puzzle-board size-' + puzzleSize;
  board.style.maxWidth = (puzzleSize * (puzzleSize===5?76:80)) + 'px';
  board.innerHTML = '';
  puzzleTiles.forEach((val,i) => {
    const tile = document.createElement('div');
    tile.className = 'p-tile' + (val===0?' empty':'');
    tile.textContent = val || '';
    tile.style.fontSize = puzzleSize>=5 ? '14px' : puzzleSize>=4 ? '18px' : '24px';
    if (val!==0) tile.onclick = () => movePuzzle(i);
    board.appendChild(tile);
  });
}

function movePuzzle(idx) {
  if (puzzleSolved) return;
  const empty = puzzleTiles.indexOf(0);
  const n = puzzleSize;
  const dr = Math.abs(Math.floor(idx/n)-Math.floor(empty/n));
  const dc = Math.abs((idx%n)-(empty%n));
  if (dr+dc!==1) return;
  [puzzleTiles[idx], puzzleTiles[empty]] = [puzzleTiles[empty], puzzleTiles[idx]];
  puzzleMoves++;
  document.getElementById('puzMoves').textContent = puzzleMoves;
  renderPuzzle();
  if (isSolved(puzzleTiles)) {
    puzzleSolved=true; clearInterval(puzzleInterval);
    const bonus = Math.max(25, 200 - puzzleMoves*3 - puzzleTime);
    puzzleEarned = bonus;
    document.getElementById('puzCoins').textContent = bonus;
    document.querySelectorAll('.p-tile').forEach(t=>t.classList.add('solved'));
    setTimeout(()=>showWin(t('puzzle_solved'), puzzleMoves+' '+t('ml_pmoves')+', '+puzzleTime+'s', bonus,'🧩'), 400);
  }
}

// ============================================================
// WORD GAME
// ============================================================
const WORDS_DB = {
  kk: [
    {word:'МЕКТЕП',hint:'Балалар оқитын жер'},{word:'КІТАП',hint:'Оқуға арналған зат'},
    {word:'ДОСТЫҚ',hint:'Адамдардың жақсы қарым-қатынасы'},{word:'АСТАНА',hint:'Елдің астанасы'},
    {word:'БАТЫР',hint:'Ер жүрек адам'},{word:'ДАЛА',hint:'Кең жазық жер'},
    {word:'ЖАЙЛАУ',hint:'Жаздық шабындық'},{word:'АЛТЫН',hint:'Сары металл'},
    {word:'БОТА',hint:'Жас верблюд баласы'},{word:'БҰЛТ',hint:'Аспандағы ақ зат'},
  ],
  ru: [
    {word:'ШКОЛА',hint:'Место учёбы'},{word:'КНИГА',hint:'Для чтения'},
    {word:'ДРУЖБА',hint:'Хорошие отношения'},{word:'СТОЛИЦА',hint:'Главный город'},
    {word:'ГЕРОЙ',hint:'Храбрый человек'},{word:'СТЕПЬ',hint:'Широкая равнина'},
    {word:'ЗОЛОТО',hint:'Жёлтый металл'},{word:'ОБЛАКО',hint:'В небе'},
    {word:'ВЕРБЛЮД',hint:'Животное с горбом'},{word:'КАЗАХСТАН',hint:'Страна в Центральной Азии'},
  ],
  en: [
    {word:'SCHOOL',hint:'Place of learning'},{word:'BOOK',hint:'For reading'},
    {word:'FRIEND',hint:'Someone you like'},{word:'CAPITAL',hint:'Main city'},
    {word:'HERO',hint:'A brave person'},{word:'STEPPE',hint:'Wide flat land'},
    {word:'GOLD',hint:'Yellow metal'},{word:'CLOUD',hint:'In the sky'},
    {word:'CAMEL',hint:'Animal with a hump'},{word:'KAZAKHSTAN',hint:'Country in Central Asia'},
  ]
};

function scrambleWord(w) {
  const arr = w.split('');
  do { arr.sort(()=>Math.random()-0.5); } while(arr.join('')===w && w.length>1);
  return arr.join('');
}

let wordIdx=0, wordScore=0, wordSkips=3, wordEarned=0, wordOrder=[];

function initWord() {
  const db = WORDS_DB[currentLang] || WORDS_DB.kk;
  wordOrder = [...Array(db.length).keys()].sort(()=>Math.random()-0.5);
  wordIdx=0; wordScore=0; wordSkips=3; wordEarned=0;
  document.getElementById('wordScore').textContent=0;
  document.getElementById('wordSkips').textContent=3;
  document.getElementById('wordCoins').textContent=0;
  showWord();
}

function showWord() {
  const db = WORDS_DB[currentLang] || WORDS_DB.kk;
  const w = db[wordOrder[wordIdx % wordOrder.length]];
  document.getElementById('scrambledDisplay').textContent = scrambleWord(w.word);
  document.getElementById('wordHintTxt').textContent = (currentLang==='kk'?'Кеңес: ':currentLang==='ru'?'Подсказка: ':'Hint: ') + w.hint;
  const inp = document.getElementById('wordInput');
  inp.value=''; inp.className='word-input';
}

function checkWordLive() {
  const db = WORDS_DB[currentLang] || WORDS_DB.kk;
  const w = db[wordOrder[wordIdx % wordOrder.length]];
  if (document.getElementById('wordInput').value.toUpperCase().trim() === w.word) submitWord();
}

function submitWord() {
  const db = WORDS_DB[currentLang] || WORDS_DB.kk;
  const w = db[wordOrder[wordIdx % wordOrder.length]];
  const val = document.getElementById('wordInput').value.toUpperCase().trim();
  if (val === w.word) {
    wordScore++; wordEarned+=20;
    document.getElementById('wordScore').textContent=wordScore;
    document.getElementById('wordCoins').textContent=wordEarned;
    document.getElementById('wordInput').classList.add('correct-input');
    addCoins(20); showToast(t('toast_correct')+'+20 BC');
    launchSmallConfetti(); showBotaPraise();
    wordIdx++; setTimeout(showWord, 700);
  } else {
    showToast(t('toast_wrong'));
    document.getElementById('wordInput').value='';
  }
}

function skipWord() {
  if (wordSkips<=0) { showToast(currentLang==='kk'?'Өткізу аяқталды':currentLang==='ru'?'Пропуски закончились':'No skips left'); return; }
  wordSkips--; document.getElementById('wordSkips').textContent=wordSkips;
  wordIdx++; showWord();
}

// ============================================================
// SNAKE GAME 🐍
// ============================================================
let snakeLoop = null, snakeBody = [], snakeDirection = 'right', snakeNext = 'right';
let snakeFood = {x:10,y:10}, snakeScoreVal = 0, snakePaused = false, snakeCoinsEarned = 0;
const SNAKE_COLS = 20, SNAKE_ROWS = 20, SNAKE_CELL = 16;

function initSnake() {
  snakeBody = [{x:5,y:10},{x:4,y:10},{x:3,y:10}];
  snakeDirection = 'right'; snakeNext = 'right';
  snakeScoreVal = 0; snakeCoinsEarned = 0; snakePaused = false;
  placeSnakeFood();
  document.getElementById('snakeScore').textContent = 0;
  document.getElementById('snakeBest').textContent = state.snakeBest || 0;
  document.getElementById('snakeCoins').textContent = 0;
  document.getElementById('snakePauseBtn').textContent = '⏸';
  document.getElementById('snakeStartBtn').style.display = 'none';
  if (snakeLoop) clearInterval(snakeLoop);
  snakeLoop = setInterval(tickSnake, 130);
}

function placeSnakeFood() {
  do {
    snakeFood = {x: Math.floor(Math.random()*SNAKE_COLS), y: Math.floor(Math.random()*SNAKE_ROWS)};
  } while (snakeBody.some(s=>s.x===snakeFood.x&&s.y===snakeFood.y));
}

function snakeDir(d) {
  const opp = {up:'down',down:'up',left:'right',right:'left'};
  if (d !== opp[snakeDirection]) snakeNext = d;
}

function snakePauseToggle() {
  snakePaused = !snakePaused;
  document.getElementById('snakePauseBtn').textContent = snakePaused ? '▶' : '⏸';
}

function tickSnake() {
  if (snakePaused) return;
  snakeDirection = snakeNext;
  const head = {...snakeBody[0]};
  if (snakeDirection==='up') head.y--;
  if (snakeDirection==='down') head.y++;
  if (snakeDirection==='left') head.x--;
  if (snakeDirection==='right') head.x++;
  // Wall wrap
  head.x = (head.x + SNAKE_COLS) % SNAKE_COLS;
  head.y = (head.y + SNAKE_ROWS) % SNAKE_ROWS;
  // Self collision
  if (snakeBody.some(s=>s.x===head.x&&s.y===head.y)) {
    stopSnake(); snakeGameOver(); return;
  }
  snakeBody.unshift(head);
  if (head.x===snakeFood.x && head.y===snakeFood.y) {
    snakeScoreVal++; snakeCoinsEarned += 3;
    document.getElementById('snakeScore').textContent = snakeScoreVal;
    document.getElementById('snakeCoins').textContent = snakeCoinsEarned;
    addCoins(3); placeSnakeFood();
    if (snakeScoreVal > (state.snakeBest||0)) {
      state.snakeBest = snakeScoreVal; save();
      document.getElementById('snakeBest').textContent = state.snakeBest;
    }
  } else {
    snakeBody.pop();
  }
  drawSnake();
}

function drawSnake() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const cw = canvas.width / SNAKE_COLS;
  const ch = canvas.height / SNAKE_ROWS;
  ctx.fillStyle = '#0d1f2d';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  // Grid dots
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for(let x=0;x<SNAKE_COLS;x++) for(let y=0;y<SNAKE_ROWS;y++) {
    ctx.fillRect(x*cw+cw/2-1,y*ch+ch/2-1,2,2);
  }
  // Food
  ctx.fillStyle = '#FF6B35';
  ctx.beginPath();
  ctx.arc(snakeFood.x*cw+cw/2, snakeFood.y*ch+ch/2, cw/2-2, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(snakeFood.x*cw+cw/2-2, snakeFood.y*ch+ch/2-2, cw/5, 0, Math.PI*2);
  ctx.fill();
  // Snake
  snakeBody.forEach((seg, i) => {
    const isHead = i === 0;
    ctx.fillStyle = isHead ? '#4ECDC4' : `hsl(${170 + i*2}, 60%, ${55 - i*0.5}%)`;
    const r = isHead ? cw/2-1 : cw/2-2;
    ctx.beginPath();
    ctx.roundRect(seg.x*cw+1, seg.y*ch+1, cw-2, ch-2, r);
    ctx.fill();
    if (isHead) {
      // Eyes
      ctx.fillStyle = '#0d1f2d';
      const eyeOffX = snakeDirection==='left'?-2:snakeDirection==='right'?2:0;
      const eyeOffY = snakeDirection==='up'?-2:snakeDirection==='down'?2:0;
      ctx.beginPath(); ctx.arc(seg.x*cw+cw/2+eyeOffX-2, seg.y*ch+ch/2+eyeOffY-2, 1.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(seg.x*cw+cw/2+eyeOffX+2, seg.y*ch+ch/2+eyeOffY+2, 1.5, 0, Math.PI*2); ctx.fill();
    }
  });
}

function stopSnake() {
  if (snakeLoop) { clearInterval(snakeLoop); snakeLoop = null; }
}

function snakeGameOver() {
  document.getElementById('snakeStartBtn').style.display = 'block';
  document.getElementById('snakeStartBtn').textContent = currentLang==='kk'?'Қайта ойна':currentLang==='ru'?'Играть снова':'Play Again';
  showWin('🐍 '+(currentLang==='kk'?'Ойын аяқталды!':currentLang==='ru'?'Игра окончена!':'Game Over!'), snakeScoreVal+' '+(currentLang==='kk'?'ұпай':currentLang==='ru'?'очков':'points'), snakeCoinsEarned, '🐍');
}

// Keyboard support for snake — WASD + Arrow keys
document.addEventListener('keydown', e => {
  const onSnakePage = document.getElementById('page-snake') && document.getElementById('page-snake').classList.contains('active');
  // Prevent page scroll on snake page
  if (onSnakePage && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','w','W','a','A','s','S','d','D'].includes(e.key)) {
    e.preventDefault();
  }
  // W = up, A = left, S = down, D = right
  if (e.key === 'ArrowUp'   || e.key === 'w' || e.key === 'W') snakeDir('up');
  if (e.key === 'ArrowDown'  || e.key === 's' || e.key === 'S') snakeDir('down');
  if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') snakeDir('left');
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') snakeDir('right');
});

// ============================================================
// ICONS - SVG ONLY
// ============================================================
const ICONS = [
  { id:1, name:{kk:'Арыстан',ru:'Лев',en:'Lion'}, rarity:'rare', price:200,
    svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#FFF3E0"/><ellipse cx="28" cy="34" rx="14" ry="12" fill="#E67E22"/><ellipse cx="28" cy="26" rx="12" ry="11" fill="#F39C12"/><circle cx="22" cy="22" r="4" fill="#2C3E50"/><circle cx="34" cy="22" r="4" fill="#2C3E50"/><circle cx="23" cy="21" r="1.5" fill="white"/><circle cx="35" cy="21" r="1.5" fill="white"/><ellipse cx="28" cy="30" rx="5" ry="3" fill="#FDEBD0"/><circle cx="25" cy="30" r="1.5" fill="#C0392B"/><circle cx="31" cy="30" r="1.5" fill="#C0392B"/><path d="M24 34 Q28 37 32 34" stroke="#C0392B" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="28" cy="14" rx="16" ry="8" fill="#E67E22" opacity="0.7"/><ellipse cx="14" cy="20" rx="5" ry="7" fill="#D35400" opacity="0.8"/><ellipse cx="42" cy="20" rx="5" ry="7" fill="#D35400" opacity="0.8"/></svg>` },
  { id:2, name:{kk:'Айдахар',ru:'Дракон',en:'Dragon'}, rarity:'legendary', price:900,
    svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#E8F8F5"/><ellipse cx="28" cy="36" rx="14" ry="10" fill="#1ABC9C"/><ellipse cx="28" cy="26" rx="12" ry="11" fill="#2ECC71"/><ellipse cx="20" cy="18" rx="7" ry="9" fill="#27AE60" transform="rotate(-20 20 18)"/><ellipse cx="36" cy="18" rx="7" ry="9" fill="#27AE60" transform="rotate(20 36 18)"/><circle cx="23" cy="24" r="4" fill="#F39C12"/><circle cx="33" cy="24" r="4" fill="#F39C12"/><circle cx="23" cy="24" r="2" fill="#2C3E50"/><circle cx="33" cy="24" r="2" fill="#2C3E50"/><path d="M23 31 Q28 35 33 31" stroke="#1ABC9C" stroke-width="1.5" fill="none"/><polygon points="28,34 26,42 28,40 30,42" fill="#E74C3C"/><circle cx="14" cy="14" r="3" fill="#FFD700"/><circle cx="42" cy="14" r="3" fill="#FFD700"/></svg>` },
  { id:3, name:{kk:'Бүркіт',ru:'Орёл',en:'Eagle'}, rarity:'rare', price:220,
    svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#EBF5FB"/><ellipse cx="28" cy="32" rx="12" ry="10" fill="#2C3E50"/><ellipse cx="28" cy="22" rx="10" ry="10" fill="#34495E"/><circle cx="23" cy="20" r="3.5" fill="#F1C40F"/><circle cx="33" cy="20" r="3.5" fill="#F1C40F"/><circle cx="23" cy="20" r="2" fill="#2C3E50"/><circle cx="33" cy="20" r="2" fill="#2C3E50"/><polygon points="28,26 25,30 28,29 31,30" fill="#E67E22"/><path d="M8 28 Q18 18 28 22" stroke="#2C3E50" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M48 28 Q38 18 28 22" stroke="#2C3E50" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M8 28 Q18 22 28 26" stroke="#ECF0F1" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M48 28 Q38 22 28 26" stroke="#ECF0F1" stroke-width="3" fill="none" stroke-linecap="round"/><polygon points="22,40 26,36 30,36 34,40 31,44 25,44" fill="#E67E22"/></svg>` },
  { id:4, name:{kk:'Жолбарыс',ru:'Тигр',en:'Tiger'}, rarity:'epic', price:420,
    svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#FEF9E7"/><ellipse cx="28" cy="34" rx="13" ry="11" fill="#E67E22"/><ellipse cx="28" cy="24" rx="12" ry="12" fill="#F39C12"/><circle cx="22" cy="21" r="4" fill="#2C3E50"/><circle cx="34" cy="21" r="4" fill="#2C3E50"/><circle cx="23" cy="20" r="1.5" fill="white"/><circle cx="35" cy="20" r="1.5" fill="white"/><ellipse cx="28" cy="30" rx="5" ry="3.5" fill="#FDEBD0"/><path d="M23 34 Q28 38 33 34" stroke="#C0392B" stroke-width="1.5" fill="none" stroke-linecap="round"/><line x1="20" y1="18" x2="18" y2="14" stroke="#2C3E50" stroke-width="1.5"/><line x1="24" y1="16" x2="23" y2="12" stroke="#2C3E50" stroke-width="1.5"/><line x1="32" y1="16" x2="33" y2="12" stroke="#2C3E50" stroke-width="1.5"/><line x1="36" y1="18" x2="38" y2="14" stroke="#2C3E50" stroke-width="1.5"/></svg>` },
  { id:5, name:{kk:'Ботам',ru:'Бота',en:'Bota'}, rarity:'legendary', price:1000,
    svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#FFF9F0"/><ellipse cx="28" cy="36" rx="11" ry="9" fill="#C8A876"/><ellipse cx="28" cy="26" rx="10" ry="10" fill="#D4B896"/><ellipse cx="21" cy="18" rx="4" ry="5" fill="#D4B896"/><ellipse cx="35" cy="18" rx="4" ry="5" fill="#D4B896"/><circle cx="23" cy="24" r="3.5" fill="white"/><circle cx="33" cy="24" r="3.5" fill="white"/><circle cx="23" cy="24" r="2" fill="#2C3E50"/><circle cx="33" cy="24" r="2" fill="#2C3E50"/><circle cx="24" cy="23" r="0.8" fill="white"/><circle cx="34" cy="23" r="0.8" fill="white"/><ellipse cx="28" cy="30" rx="4" ry="2.5" fill="#FFCBA4"/><path d="M24 33 Q28 36 32 33" stroke="#8B6349" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="20" cy="26" rx="4" ry="3" fill="#C8A876"/><ellipse cx="36" cy="26" rx="4" ry="3" fill="#C8A876"/><polygon points="28,12 29.5,16 34,16 30.5,18.5 32,23 28,20.5 24,23 25.5,18.5 22,16 26.5,16" fill="#FFD700" opacity="0.9"/></svg>` },
  { id:6, name:{kk:'Ай',ru:'Луна',en:'Moon'}, rarity:'common', price:80,
    svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#1a1a3e"/><path d="M22 14 A16 16 0 1 0 22 42 A12 12 0 1 1 22 14" fill="#FFD700"/><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.3)"/><circle cx="16" cy="32" r="1.5" fill="rgba(255,255,255,0.2)"/><circle cx="38" cy="16" r="1" fill="white" opacity="0.8"/><circle cx="42" cy="28" r="1.5" fill="white" opacity="0.6"/><circle cx="36" cy="40" r="1" fill="white" opacity="0.8"/></svg>` },
  { id:7, name:{kk:'Жұлдыз',ru:'Звезда',en:'Star'}, rarity:'rare', price:180,
    svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#2C3E50"/><polygon points="28,8 32,20 44,20 35,28 38,40 28,33 18,40 21,28 12,20 24,20" fill="#FFD700"/><polygon points="28,12 31,21 40,21 33,26 35,36 28,31 21,36 23,26 16,21 25,21" fill="#FFF176"/><circle cx="28" cy="26" r="3" fill="white" opacity="0.8"/></svg>` },
  { id:8, name:{kk:'Найзағай',ru:'Молния',en:'Thunder'}, rarity:'epic', price:380,
    svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#1C2833"/><polygon points="32,8 20,30 27,30 24,48 40,24 32,24" fill="#FFD700"/><polygon points="30,11 20,30 26,30 24,44 38,26 31,26" fill="#FFF176" opacity="0.6"/><circle cx="14" cy="14" r="2" fill="white" opacity="0.5"/><circle cx="42" cy="42" r="2" fill="white" opacity="0.5"/></svg>` },
  { id:9, name:{kk:'Алмаз',ru:'Алмаз',en:'Diamond'}, rarity:'legendary', price:850,
    svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#EBF5FB"/><polygon points="28,10 44,22 36,46 20,46 12,22" fill="#5DADE2"/><polygon points="28,10 44,22 28,20" fill="#AED6F1"/><polygon points="28,20 44,22 36,46 20,46 12,22" fill="#2980B9"/><polygon points="28,20 20,46 36,46" fill="#1A5276"/><polygon points="22,16 28,10 34,16 28,18" fill="white" opacity="0.5"/></svg>` },
];

// Секретные аватарки (только через промокод, не покупаются)
const SECRET_AVATARS = [
  { id:'s1', name:'🌟 Алтын Бота', svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="url(#sg1)"/><defs><radialGradient id="sg1"><stop offset="0%" stop-color="#FFD700"/><stop offset="100%" stop-color="#FF6B35"/></radialGradient></defs><ellipse cx="28" cy="36" rx="11" ry="9" fill="#C8A876"/><ellipse cx="28" cy="26" rx="10" ry="10" fill="#D4B896"/><ellipse cx="21" cy="18" rx="4" ry="5" fill="#D4B896"/><ellipse cx="35" cy="18" rx="4" ry="5" fill="#D4B896"/><circle cx="23" cy="24" r="3.5" fill="white"/><circle cx="33" cy="24" r="3.5" fill="white"/><circle cx="23" cy="24" r="2" fill="#1a1a3e"/><circle cx="33" cy="24" r="2" fill="#1a1a3e"/><path d="M24 33 Q28 36 32 33" stroke="#8B6349" stroke-width="1.5" fill="none" stroke-linecap="round"/><polygon points="28,8 30,14 36,14 31,18 33,24 28,20 23,24 25,18 20,14 26,14" fill="white" opacity="0.9"/></svg>` },
  { id:'s2', name:'🌌 Ғарыш', svg:`<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#0d0d2b"/><circle cx="28" cy="28" r="14" fill="#1a0a5e"/><ellipse cx="28" cy="28" rx="22" ry="8" fill="none" stroke="#9B59B6" stroke-width="3" opacity="0.8"/><ellipse cx="28" cy="28" rx="18" ry="5" fill="none" stroke="#4ECDC4" stroke-width="1.5" opacity="0.6"/><circle cx="28" cy="28" r="8" fill="#2980B9"/><circle cx="26" cy="26" r="3" fill="#5DADE2" opacity="0.7"/><circle cx="10" cy="10" r="1.5" fill="white"/><circle cx="44" cy="12" r="1" fill="white"/><circle cx="42" cy="42" r="1.5" fill="white"/><circle cx="14" cy="40" r="1" fill="white"/><circle cx="8" cy="28" r="1" fill="#FFD700"/></svg>` },
];

const RARITY_COLORS = {common:'#95A5A6',rare:'#2980B9',epic:'#9B59B6',legendary:'#F39C12'};
const RARITY_LABELS = {
  kk:{common:'Қарапайым',rare:'Сирек',epic:'Эпик',legendary:'Аңыз'},
  ru:{common:'Обычная',rare:'Редкая',epic:'Эпическая',legendary:'Легендарная'},
  en:{common:'Common',rare:'Rare',epic:'Epic',legendary:'Legendary'}
};

function renderIcons() {
  const grid = document.getElementById('iconsGrid');
  grid.innerHTML = '';
  ICONS.forEach(ic => {
    const owned = state.inventory.some(i=>i.id===ic.id);
    const equipped = state.equippedIcon === ic.id;
    const div = document.createElement('div');
    div.className = 'icon-shop-item' + (equipped?' equipped-item':owned?' owned-item':'');
    const rarityLabel = (RARITY_LABELS[currentLang]||RARITY_LABELS.kk)[ic.rarity];
    const name = ic.name[currentLang]||ic.name.kk;
    let priceOrStatus;
    if (equipped) priceOrStatus = `<span style="color:var(--gold2);font-size:11px">${t('equipped_lbl')}</span>`;
    else if (owned) priceOrStatus = `<button style="background:var(--green);color:white;border:none;border-radius:10px;padding:4px 10px;font-size:11px;font-weight:800;cursor:pointer" onclick="equipIcon(${ic.id})">${t('equip_lbl')}</button>`;
    else priceOrStatus = `<span style="color:#B8860B;font-weight:900;font-size:12px">★ ${ic.price}</span>`;
    div.innerHTML = `<div class="icon-svg-wrap">${ic.svg}</div><div class="icon-shop-name">${name}</div><div class="icon-shop-rarity" style="color:${RARITY_COLORS[ic.rarity]}">${rarityLabel}</div><div style="margin-top:4px">${priceOrStatus}</div>`;
    if (!owned && !equipped) div.onclick = () => buyIcon(ic);
    grid.appendChild(div);
  });
}

function equipIcon(id) {
  state.equippedIcon = id; save(); renderIcons(); updateProfileUI();
  const ic = ICONS.find(i=>i.id===id);
  if (ic) showToast((ic.name[currentLang]||ic.name.kk) + t('toast_icon_equip'));
}

function buyIcon(ic) {
  if (state.coins < ic.price) { showToast(t('toast_nocoins')); return; }
  state.coins -= ic.price;
  document.getElementById('coinDisplay').textContent = state.coins;
  state.inventory.push({id:ic.id,name:ic.name,svg:ic.svg,rarity:ic.rarity});
  save(); renderIcons(); updateInventoryUI();
  showToast((ic.name[currentLang]||ic.name.kk)+t('toast_icon_buy'));
}

// ============================================================
// SHOP TABS
// ============================================================
function switchShopTab(tab, btn) {
  document.querySelectorAll('.shop-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  ['cases','icons','promo','lb'].forEach(tabId=>{ const el=document.getElementById('shop-'+tabId); if(el) el.style.display='none'; });
  document.getElementById('shop-'+tab).style.display = 'block';
  if (tab==='icons') renderIcons();
  if (tab==='lb') renderLeaderboard();
  if (tab==='promo') renderPromoList();
}

// ============================================================
// CASES & ROULETTE
// ============================================================
const CASE_CFG = {
  bronze: {price:100, odds:[{r:'common',ch:60},{r:'rare',ch:30},{r:'epic',ch:9},{r:'legendary',ch:1}]},
  silver: {price:250, odds:[{r:'common',ch:40},{r:'rare',ch:35},{r:'epic',ch:20},{r:'legendary',ch:5}]},
  gold:   {price:500, odds:[{r:'common',ch:20},{r:'rare',ch:35},{r:'epic',ch:30},{r:'legendary',ch:15}]},
};

const CASE_ITEMS = {
  common: [
    {name:{kk:'Жапырақ',ru:'Листок',en:'Leaf'},svg:'<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#ECFFF0"/><path d="M14 42 Q28 10 42 14 Q32 28 14 42Z" fill="#27AE60"/><path d="M14 42 Q28 20 38 18" stroke="#1E8449" stroke-width="1.5" fill="none"/></svg>'},
    {name:{kk:'Тас',ru:'Камень',en:'Stone'},svg:'<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#F2F3F4"/><ellipse cx="28" cy="32" rx="16" ry="12" fill="#95A5A6"/><ellipse cx="24" cy="28" rx="10" ry="8" fill="#BDC3C7"/><ellipse cx="22" cy="26" rx="4" ry="3" fill="#D5D8DC"/></svg>'}
  ],
  rare: [
    {name:{kk:'Толқын',ru:'Волна',en:'Wave'},svg:'<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#EBF5FB"/><path d="M8 28 Q14 22 20 28 Q26 34 32 28 Q38 22 48 28" stroke="#2980B9" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M8 34 Q14 28 20 34 Q26 40 32 34 Q38 28 48 34" stroke="#5DADE2" stroke-width="4" fill="none" stroke-linecap="round"/></svg>'},
    {name:{kk:'Ай сәулесі',ru:'Лунный свет',en:'Moonbeam'},svg:'<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#1a1a3e"/><path d="M20 14 A14 14 0 1 0 20 42 A10 10 0 1 1 20 14" fill="#F0E68C"/><circle cx="36" cy="12" r="1.5" fill="white"/><circle cx="42" cy="22" r="1" fill="white"/><circle cx="40" cy="36" r="1.5" fill="white"/></svg>'}
  ],
  epic: [
    {name:{kk:'Алау',ru:'Пламя',en:'Flame'},svg:'<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#FEF0E6"/><path d="M28 10 Q36 20 34 28 Q32 36 28 40 Q24 36 22 28 Q20 20 28 10Z" fill="#E74C3C"/><path d="M28 16 Q33 24 31 30 Q29 36 28 40 Q27 36 25 30 Q23 24 28 16Z" fill="#E67E22"/><path d="M28 22 Q31 28 29 34 Q28 38 28 40 Q28 38 27 34 Q25 28 28 22Z" fill="#F1C40F"/></svg>'},
    {name:{kk:'Жауын',ru:'Дождь',en:'Rain'},svg:'<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#EAF4FB"/><ellipse cx="28" cy="22" rx="14" ry="9" fill="#BDC3C7"/><ellipse cx="22" cy="18" rx="8" ry="7" fill="#D5D8DC"/><line x1="18" y1="33" x2="16" y2="42" stroke="#3498DB" stroke-width="2.5" stroke-linecap="round"/><line x1="26" y1="35" x2="24" y2="44" stroke="#3498DB" stroke-width="2.5" stroke-linecap="round"/><line x1="34" y1="33" x2="32" y2="42" stroke="#3498DB" stroke-width="2.5" stroke-linecap="round"/></svg>'}
  ],
  legendary: [
    {name:{kk:'Тәж',ru:'Корона',en:'Crown'},svg:'<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#FFFDE7"/><polygon points="8,36 14,20 22,30 28,16 34,30 42,20 48,36" fill="#F39C12"/><rect x="8" y="36" width="40" height="8" rx="3" fill="#E67E22"/><circle cx="14" cy="20" r="3" fill="#E74C3C"/><circle cx="28" cy="16" r="3" fill="#9B59B6"/><circle cx="42" cy="20" r="3" fill="#3498DB"/></svg>'},
    {name:{kk:'Инфинити',ru:'Бесконечность',en:'Infinity'},svg:'<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#2C3E50"/><path d="M10 28 Q10 18 20 18 Q28 18 28 28 Q28 18 36 18 Q46 18 46 28 Q46 38 36 38 Q28 38 28 28 Q28 38 20 38 Q10 38 10 28Z" fill="none" stroke="#FFD700" stroke-width="4"/><circle cx="20" cy="28" r="3" fill="#FFD700"/><circle cx="36" cy="28" r="3" fill="#FFD700"/></svg>'}
  ]
};

function rollRarity(odds) {
  const roll = Math.random()*100;
  let cum=0;
  for (const o of odds) { cum+=o.ch; if(roll<cum) return o.r; }
  return 'common';
}

function buyCase(type) {
  const cfg = CASE_CFG[type];
  if (state.coins < cfg.price) { showToast(t('toast_nocoins')); return; }
  state.coins -= cfg.price;
  document.getElementById('coinDisplay').textContent = state.coins;
  save();
  const rarity = rollRarity(cfg.odds);
  const pool = CASE_ITEMS[rarity];
  const item = pool[Math.floor(Math.random()*pool.length)];
  const itemName = item.name[currentLang]||item.name.kk;
  const rarityLabel = (RARITY_LABELS[currentLang]||RARITY_LABELS.kk)[rarity];
  const allItems = [...CASE_ITEMS.common,...CASE_ITEMS.rare,...CASE_ITEMS.epic,...CASE_ITEMS.legendary];
  const shuffled = allItems.sort(()=>Math.random()-0.5);
  const TOTAL = 40;
  const winIdx = TOTAL - 5;
  const track = document.getElementById('rouletteTrack');
  track.innerHTML = ''; track.style.transform = 'translateX(0)';
  const rItems = [];
  for (let i=0;i<TOTAL;i++) {
    const src = i===winIdx ? item : shuffled[i % shuffled.length];
    const r = i===winIdx ? rarity : Object.keys(CASE_ITEMS)[Math.floor(Math.random()*4)];
    rItems.push({item:src,rarity:r});
  }
  rItems.forEach(({item:ri,rarity:rr}) => {
    const el = document.createElement('div');
    el.className = 'roulette-item rarity-'+rr;
    const n = ri.name[currentLang]||ri.name.kk;
    el.innerHTML = ri.svg + `<span class="roulette-item-label" style="color:${RARITY_COLORS[rr]}">${n}</span>`;
    track.appendChild(el);
  });
  document.getElementById('caseRevealSection').style.display = 'none';
  document.getElementById('case_close_btn').style.display = 'none';
  document.getElementById('case_spinning').textContent = t('case_spinning');
  document.getElementById('caseModal').classList.add('open');
  const itemW = 88;
  const containerW = track.parentElement.offsetWidth;
  const targetX = -(winIdx * itemW - containerW/2 + itemW/2);
  const duration = 4000;
  const startTime = performance.now();
  function easeOut(t) { return 1 - Math.pow(1-t, 4); }
  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed/duration, 1);
    const eased = easeOut(progress);
    const current = targetX * eased;
    const osc = progress < 0.9 ? Math.sin(elapsed * 0.05) * (1-progress) * 5 : 0;
    track.style.transform = `translateX(${current + osc}px)`;
    if (progress < 1) { requestAnimationFrame(animate); }
    else {
      track.style.transform = `translateX(${targetX}px)`;
      setTimeout(() => {
        document.getElementById('caseRevealSection').style.display = 'block';
        document.getElementById('case_close_btn').style.display = 'block';
        const revIcon = document.getElementById('caseRevealIcon');
        revIcon.innerHTML = item.svg;
        revIcon.style.background = RARITY_COLORS[rarity]+'22';
        revIcon.style.border = '3px solid '+RARITY_COLORS[rarity];
        document.getElementById('caseRevealRarity').textContent = rarityLabel;
        document.getElementById('caseRevealRarity').style.color = RARITY_COLORS[rarity];
        document.getElementById('caseRevealName').textContent = itemName;
        state.inventory.push({id:Date.now(),name:item.name,svg:item.svg,rarity});
        save(); updateInventoryUI();
        if (rarity==='legendary'||rarity==='epic') launchConfetti();
      }, 300);
    }
  }
  requestAnimationFrame(animate);
}

// DISCOUNT CASE (Баян Сұлу)
const DISCOUNT_ITEMS = [10,20,30,40,50,60,70,80,90,100,null,null];

function buyDiscountCase() {
  if (state.coins < 5000) { showToast(t('toast_nocoins')); return; }
  state.coins -= 5000;
  document.getElementById('coinDisplay').textContent = state.coins;
  save();
  const item = DISCOUNT_ITEMS[Math.floor(Math.random()*DISCOUNT_ITEMS.length)];
  const el = document.getElementById('discountPct');
  if (item) {
    el.textContent = item + '%';
    document.getElementById('discountReveal').style.background = 'linear-gradient(135deg,#FFF0F8,#FFE0F0)';
  } else {
    el.textContent = currentLang==='kk'?'Ештеңе жоқ 😅':currentLang==='ru'?'Ничего 😅':'Nothing 😅';
    document.getElementById('discountReveal').style.background = '#f5f5f5';
  }
  document.getElementById('discountModal').classList.add('open');
  if (item) launchSmallConfetti();
}

// ============================================================
// PROMO
// ============================================================
const PROMOS = {
  'BOTAOY2026':200,'BAYAN100':100,'QAZAQ50':50,'BOTA2026':150,
  'WELCOME300':300,'SMARTKID75':75,'KAMBOT2026':125,
  'YERELKHAN111':100006,  // секретный промокод — 100,006 монет
};
// Секретный аватар промокод (не отображается в списке)
const SECRET_AVATAR_PROMO = 'BOTASECRET2026';

const PROMO_DISPLAY = ['BOTAOY2026','BAYAN100','QAZAQ50','BOTA2026'];

function renderPromoList() {
  const div = document.getElementById('promoListDisplay');
  if (!div) return;
  div.innerHTML = '';
  PROMO_DISPLAY.forEach(code => {
    const row = document.createElement('div');
    const used = state.usedPromos.includes(code);
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--surface2);border-radius:12px;opacity:'+(used?'0.5':'1');
    row.innerHTML = `<span style="font-family:'Fredoka One',cursive;font-size:13px;letter-spacing:2px">${code}</span><span style="font-size:13px;font-weight:900;color:#B8860B">+${PROMOS[code]} BC${used?' ✓':''}</span>`;
    div.appendChild(row);
  });
}

function redeemPromo() {
  const code = (document.getElementById('promoIn').value||'').trim().toUpperCase();
  const msg = document.getElementById('promoMsg');
  if (!code) return;
  if (state.usedPromos.includes(code)) { msg.className='promo-msg fail'; msg.textContent=t('toast_promo_used'); return; }
  // Секретный промокод на аватарки
  if (code === SECRET_AVATAR_PROMO) {
    state.usedPromos.push(code);
    state.unlockedSecretAvatars = SECRET_AVATARS.map(a=>a.id);
    save();
    msg.className='promo-msg ok';
    msg.textContent = currentLang==='kk'?'🌟 Секретті аватарлар ашылды!':currentLang==='ru'?'🌟 Секретные аватары разблокированы!':'🌟 Secret avatars unlocked!';
    document.getElementById('promoIn').value='';
    return;
  }
  if (PROMOS[code]) {
    const n = PROMOS[code];
    addCoins(n); state.usedPromos.push(code); save();
    msg.className='promo-msg ok';
    msg.textContent = t('toast_promo_ok').replace('{n}',n);
    document.getElementById('promoIn').value='';
    renderPromoList();
  } else {
    msg.className='promo-msg fail';
    msg.textContent = t('toast_promo_fail');
  }
}

// ============================================================
// LIVE LEADERBOARD — Firebase Realtime Database
// basy-d5af8-default-rtdb.europe-west1.firebasedatabase.app
// ============================================================
const FB_URL = 'https://basy-d5af8-default-rtdb.europe-west1.firebasedatabase.app';

function getDeviceId() {
  let id = localStorage.getItem('botaoy_uid');
  if (!id) {
    id = 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    localStorage.setItem('botaoy_uid', id);
  }
  return id;
}
const MY_DEVICE_ID = getDeviceId();

// Отправить мой результат в Firebase
async function pushMyScore() {
  if (!state.name) return;
  try {
    const payload = {
      name: state.name,
      score: state.coins,
      ts: Date.now()
    };
    await fetch(`${FB_URL}/scores/${MY_DEVICE_ID}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) { /* silent */ }
}

// Получить всех игроков из Firebase
async function fetchAllScores() {
  try {
    const res = await fetch(`${FB_URL}/scores.json`);
    if (!res.ok) return null;
    const raw = await res.json();
    if (!raw) return [];
    // raw это объект { deviceId: {name, score, ts}, ... }
    return Object.entries(raw).map(([uid, data]) => ({
      uid,
      name: data.name || '???',
      score: Number(data.score) || 0,
      me: uid === MY_DEVICE_ID
    }));
  } catch (e) { return null; }
}

// Debounce push — чтобы не спамить запросами при каждой монете
let _pushTimer = null;
function schedulePush() {
  clearTimeout(_pushTimer);
  _pushTimer = setTimeout(pushMyScore, 1500);
}

const DEMO_PLAYERS = [
  {name:'Нурайым',score:6969},{name:'Алдияр',score:6753},
  {name:'Айгерім',score:6767},{name:'Замира',score:2111},
  {name:'diawx',score:2069},{name:'Арман',score:1980},
  {name:'Темір',score:1850},{name:'Аида',score:1720},
];

const AV_SVG = {
  bota:`<svg viewBox="0 0 32 32" width="26" height="26"><circle cx="16" cy="16" r="15" fill="#FFF9F0"/><ellipse cx="16" cy="14" rx="7" ry="7" fill="#D4B896"/><ellipse cx="12" cy="10" rx="2.5" ry="3.5" fill="#D4B896"/><ellipse cx="20" cy="10" rx="2.5" ry="3.5" fill="#D4B896"/><circle cx="13" cy="13" r="2" fill="#2C3E50"/><circle cx="19" cy="13" r="2" fill="#2C3E50"/><path d="M13 18 Q16 20 19 18" stroke="#8B6349" stroke-width="1" fill="none"/></svg>`,
  default:`<svg viewBox="0 0 32 32" width="26" height="26"><circle cx="16" cy="16" r="15" fill="#FF6B35"/><circle cx="12" cy="13" r="2.5" fill="white"/><circle cx="20" cy="13" r="2.5" fill="white"/><path d="M12 20 Q16 23 20 20" stroke="white" stroke-width="1.5" fill="none"/></svg>`
};

// ============================================================
// MAP PAGE
// ============================================================
const REGION_SVG_IDS = {
  'Актюбинская':'mp-aktobe', 'Западно-Казахстанская':'mp-wko',
  'Атырауская':'mp-atyrau', 'Мангистауская':'mp-mangistau',
  'Кызылординская':'mp-kyzylorda', 'Туркестанская':'mp-turkestan',
  'Жамбылская':'mp-zhambyl', 'Алматинская':'mp-almaty',
  'Область Жетісу':'mp-zhetisu', 'Карагандинская':'mp-karagandy',
  'Область Ұлытау':'mp-ulytau', 'Павлодарская':'mp-pavlodar',
  'Восточно-Казахстанская':'mp-eko', 'Область Абай':'mp-abay',
  'Ақмолинская':'mp-akmola', 'Северо-Казахстанская':'mp-sko',
  'Костанайская':'mp-kostanay'
};

function renderMapPage() {
  // Обновляем инфо о домашнем регионе
  const home = state.homeRegion;
  const rd = REGION_DATA[home] || {};
  const label = document.getElementById('homeRegionLabel');
  const nameEl = document.getElementById('homeRegionName');
  const coinsEl = document.getElementById('homeRegionCoins');
  if (label) label.textContent = currentLang==='kk'?'Туған өлке':currentLang==='ru'?'Родной регион':'Home Region';
  if (nameEl) nameEl.textContent = rd[currentLang] || home || '-';
  if (coinsEl) {
    const todayCoins = getRegionCoinsToday(home);
    const limit = getDailyLimit(home);
    coinsEl.textContent = todayCoins + '/' + limit + ' BC';
  }
  // Закрашиваем карту
  Object.entries(REGION_SVG_IDS).forEach(([region, svgId]) => {
    const el = document.getElementById(svgId);
    if (!el) return;
    const isHome = region === home;
    const isUnlocked = state.unlockedRegions.includes(region);
    const isCompleted = state.completedRegions.includes(region);
    if (isHome) {
      el.style.stroke = '#FF6B35';
      el.style.strokeWidth = '3';
    }
    if (!isUnlocked) {
      el.style.filter = 'grayscale(100%) brightness(0.7)';
      el.style.opacity = '0.5';
    } else {
      el.style.filter = '';
      el.style.opacity = '1';
    }
    if (isCompleted) {
      el.style.filter = 'none';
      el.style.opacity = '1';
    }
  });
  // Рендерим список регионов
  renderRegionList();
}

function renderRegionList() {
  const container = document.getElementById('regionListCards');
  if (!container) return;
  container.innerHTML = '';
  Object.entries(REGION_DATA).forEach(([region]) => {
    const rd = REGION_DATA[region];
    const isUnlocked = state.unlockedRegions.includes(region);
    const isHome = region === state.homeRegion;
    const isCompleted = state.completedRegions.includes(region);
    const todayCoins = getRegionCoinsToday(region);
    const limit = getDailyLimit(region);
    const pct = rd.maxCoins ? Math.round((todayCoins / rd.maxCoins) * 100) : 0;
    const card = document.createElement('div');
    card.style.cssText = `background:white;border-radius:16px;padding:14px 16px;margin-bottom:10px;box-shadow:0 3px 12px rgba(0,0,0,0.07);border:2px solid ${isHome?'#FF6B35':isCompleted?'#27AE60':isUnlocked?'#4ECDC4':'#eee'};opacity:${isUnlocked?1:0.55};cursor:pointer;transition:all 0.2s`;
    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div>
          <div style="font-family:'Fredoka One',cursive;font-size:15px;color:var(--text)">
            ${isHome?'🏠 ':''}${isCompleted?'✅ ':''}${!isUnlocked?'🔒 ':''}${rd[currentLang]||region}
          </div>
          <div style="font-size:11px;color:var(--text2);font-weight:700">👥 ${rd.pop.toLocaleString()} | 🪙 макс ${rd.maxCoins} BC</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:'Fredoka One',cursive;font-size:14px;color:var(--gold2)">${todayCoins}/${limit}</div>
          <div style="font-size:10px;color:var(--text2);font-weight:700">${currentLang==='kk'?'бүгін':currentLang==='ru'?'сегодня':'today'}</div>
        </div>
      </div>
      <div class="progress-outer" style="height:6px;margin-bottom:0">
        <div class="progress-inner" style="width:${Math.min(pct,100)}%"></div>
      </div>
    `;
    card.onclick = () => { if (isUnlocked) showRegionInfo(region); else showToast(currentLang==='kk'?'Алдымен алдыңғы облысты аяқта!':currentLang==='ru'?'Сначала завершите предыдущую область!':'Complete previous region first!'); };
    container.appendChild(card);
  });
}

function mapClickRegion(region) {
  const norm = normalizeRegion(region);
  const isUnlocked = state.unlockedRegions.includes(norm);
  if (isUnlocked) {
    showRegionInfo(norm);
  } else {
    showToast(currentLang==='kk'?'🔒 Алдымен алдыңғы облысты аяқта!':currentLang==='ru'?'🔒 Завершите предыдущую область!':'🔒 Complete previous region!');
  }
}

// Override switchPage to render map when needed
const _origSwitchPage = switchPage;
switchPage = function(name) {
  _origSwitchPage(name);
  if (name === 'map') renderMapPage();
};

function updateLeaderboard() { save(); schedulePush(); }

// ============================================================
// PARENT MODE
// ============================================================
let pinBuffer = '';
let parentPinMode = 'enter'; // 'enter' | 'set'

function openParentMode() {
  pinBuffer = '';
  updatePinDots();
  if (!state.parentPin) {
    // PIN ещё не установлен — устанавливаем
    parentPinMode = 'set';
    const hint = document.getElementById('parentPinHint');
    if (hint) hint.textContent = currentLang==='kk'?'Жаңа PIN-код орнату (4 таңба)':currentLang==='ru'?'Установите PIN (4 цифры)':'Set your PIN (4 digits)';
  } else {
    parentPinMode = 'enter';
    const hint = document.getElementById('parentPinHint');
    if (hint) hint.textContent = currentLang==='kk'?'4 таңбалы PIN-код енгіз':currentLang==='ru'?'Введите PIN (4 цифры)':'Enter PIN (4 digits)';
  }
  document.getElementById('parentPinScreen').style.display = 'block';
  document.getElementById('parentPanel').style.display = 'none';
  document.getElementById('parentModal').classList.add('open');
}

function pinPress(d) {
  if (pinBuffer.length >= 4) return;
  pinBuffer += d;
  updatePinDots();
  if (pinBuffer.length === 4) setTimeout(checkPin, 200);
}

function pinBack() { pinBuffer = pinBuffer.slice(0,-1); updatePinDots(); }
function pinClear() { pinBuffer = ''; updatePinDots(); }

function updatePinDots() {
  for (let i=0;i<4;i++) {
    const dot = document.getElementById('pd'+i);
    if (dot) dot.classList.toggle('filled', i < pinBuffer.length);
  }
}

function checkPin() {
  if (parentPinMode === 'set') {
    state.parentPin = pinBuffer;
    save();
    pinBuffer = '';
    updatePinDots();
    showParentPanel();
    showToast(currentLang==='kk'?'PIN сақталды! ✅':currentLang==='ru'?'PIN сохранён! ✅':'PIN saved! ✅');
    return;
  }
  if (pinBuffer === state.parentPin) {
    pinBuffer = '';
    updatePinDots();
    showParentPanel();
  } else {
    pinBuffer = '';
    updatePinDots();
    showToast(currentLang==='kk'?'Қате PIN!':currentLang==='ru'?'Неверный PIN!':'Wrong PIN!');
  }
}

function showParentPanel() {
  document.getElementById('parentPinScreen').style.display = 'none';
  document.getElementById('parentPanel').style.display = 'block';
  // Заполняем данные
  document.getElementById('pParentName').textContent = state.name || '-';
  document.getElementById('pParentAge').textContent = state.age || '-';
  const rd = REGION_DATA[state.homeRegion] || {};
  document.getElementById('pParentRegion').textContent = rd[currentLang] || state.homeRegion || '-';
  document.getElementById('pParentCoins').textContent = state.coins;
  document.getElementById('pParentGames').textContent = state.gamesPlayed;
  document.getElementById('pParentWins').textContent = state.wins;
  // Экран уақыты
  updateScreenTimeDisplay();
}

function saveNewPin() {
  const val = (document.getElementById('newPinInput').value || '').trim();
  if (val.length !== 4 || !/^\d+$/.test(val)) {
    showToast(currentLang==='kk'?'4 санды PIN енгіз':currentLang==='ru'?'Введите 4 цифры':'Enter 4 digits');
    return;
  }
  state.parentPin = val;
  save();
  document.getElementById('newPinInput').value = '';
  showToast(currentLang==='kk'?'PIN сақталды! ✅':currentLang==='ru'?'PIN сохранён!':'PIN saved!');
}

function closeParentPanel() {
  closeModal('parentModal');
}

let screenTimeInterval = null;
function startScreenTimer() {
  if (!state.screenTimeStart) state.screenTimeStart = Date.now();
  if (screenTimeInterval) return;
  screenTimeInterval = setInterval(() => {
    updateScreenTimeDisplay();
  }, 60000);
}

function updateScreenTimeDisplay() {
  const el = document.getElementById('parentTimerDisplay');
  if (!el) return;
  const start = state.screenTimeStart || Date.now();
  const elapsed = Math.floor((Date.now() - start) / 60000);
  el.textContent = elapsed + (currentLang==='kk'?' мин':currentLang==='ru'?' мин':' min');
}

// ============================================================
// REGION MAP PAGE (карта прогресса)
// ============================================================
function showRegionInfo(regionKey) {
  const rd = REGION_DATA[normalizeRegion(regionKey)];
  if (!rd) return;
  const lang = currentLang;
  const name = rd[lang] || rd.kk;
  const progress = state.regionProgress[normalizeRegion(regionKey)] || {};
  const todayCoins = progress.coinsToday || 0;
  const limit = getDailyLimit(regionKey);
  const pct = Math.round((todayCoins / (rd.maxCoins||1)) * 100);
  const isUnlocked = state.unlockedRegions.includes(normalizeRegion(regionKey));
  const isCompleted = state.completedRegions.includes(normalizeRegion(regionKey));
  
  const content = document.getElementById('regionInfoContent');
  content.innerHTML = `
    <div class="region-info-card">
      <div class="region-info-title">${name} ${isCompleted?'✅':isUnlocked?'🔓':'🔒'}</div>
      <div class="region-info-pop">👥 ${rd.pop.toLocaleString()} ${lang==='kk'?'тұрғын':lang==='ru'?'жителей':'residents'}</div>
      <div class="region-info-pop">🪙 Макс: ${rd.maxCoins} BC | Бүгін: ${todayCoins}/${limit} BC</div>
      ${!isUnlocked ? `<div style="background:#fff3cd;border-radius:12px;padding:10px;font-weight:700;font-size:13px;color:#856404;margin-bottom:12px">🔒 ${lang==='kk'?'Алдымен алдыңғы облысты аяқта':lang==='ru'?'Сначала завершите предыдущую область':'Complete the previous region first'}</div>` : ''}
      <div style="font-weight:800;font-size:13px;margin-bottom:6px">${lang==='kk'?'Қалалар:':lang==='ru'?'Города:':'Cities:'}</div>
      <div class="city-list">${(rd.cities||[]).map(c=>`<span class="city-chip">${c}</span>`).join('')}</div>
      <div style="font-weight:800;font-size:13px;margin:10px 0 6px">${lang==='kk'?'Қызықты деректер:':lang==='ru'?'Интересные факты:':'Fun facts:'}</div>
      ${(rd.facts||[]).map(f=>`<div class="fact-item">✨ ${f}</div>`).join('')}
      <div style="margin-top:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:var(--text2);margin-bottom:4px">
          <span>${lang==='kk'?'Прогресс':lang==='ru'?'Прогресс':'Progress'}</span><span>${pct}%</span>
        </div>
        <div class="progress-outer"><div class="progress-inner" style="width:${pct}%"></div></div>
      </div>
    </div>
  `;
  document.getElementById('regionInfoModal').classList.add('open');
}

async function renderLeaderboard() {
  const card = document.getElementById('lbCard');
  // Показываем спиннер
  card.innerHTML = `
    <div style="text-align:center;padding:40px 20px">
      <div style="font-size:36px;margin-bottom:12px;animation:spin 1s linear infinite;display:inline-block">⏳</div>
      <div style="font-weight:800;font-size:14px;color:var(--text2)">${currentLang==='kk'?'Жүктелуде...':currentLang==='ru'?'Загрузка...':'Loading...'}</div>
    </div>`;

  // Сначала убедимся что наш счёт отправлен
  await pushMyScore();

  // Загружаем данные
  const liveData = await fetchAllScores();
  const isOnline = liveData !== null;

  let board;
  if (isOnline && liveData.length > 0) {
    board = liveData.sort((a, b) => b.score - a.score);
  } else if (isOnline && liveData.length === 0) {
    // База пустая — только я
    board = [{ name: state.name || 'Сен', score: state.coins, me: true }];
  } else {
    // Офлайн — демо + я
    board = [...DEMO_PLAYERS, { name: state.name || 'Сен', score: state.coins, me: true }];
    board.sort((a, b) => b.score - a.score);
  }

  const rankIcons = ['🥇','🥈','🥉'];
  const rankColors = ['gold-rank','silver-rank','bronze-rank'];

  card.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="width:10px;height:10px;border-radius:50%;background:${isOnline?'#27AE60':'#E74C3C'};display:inline-block;${isOnline?'animation:livepulse 1.4s ease-in-out infinite':''}"></span>
        <span style="font-family:'Fredoka One',cursive;font-size:15px;color:var(--text)">${isOnline?'Live':'Оффлайн'}</span>
        ${isOnline ? `<span style="font-size:11px;font-weight:700;color:var(--text2)">${board.length} ${currentLang==='kk'?'ойыншы':currentLang==='ru'?'игроков':'players'}</span>` : ''}
      </div>
      <button onclick="renderLeaderboard()" style="background:var(--primary);color:white;border:none;border-radius:12px;padding:7px 14px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif">
        🔄 ${currentLang==='kk'?'Жаңарту':currentLang==='ru'?'Обновить':'Refresh'}
      </button>
    </div>
    ${board.slice(0, 50).map((p, i) => `
      <div class="lb-row${p.me ? ' me' : ''}">
        <div class="lb-rank ${rankColors[i]||''}" style="font-size:${i<3?'22px':'15px'};min-width:36px;text-align:center">
          ${i < 3 ? rankIcons[i] : (i+1)}
        </div>
        <div class="lb-avatar">${AV_SVG.bota}</div>
        <div class="lb-name">${p.name}${p.me ? ' <span style="font-size:10px;background:var(--primary);color:white;border-radius:6px;padding:1px 6px;font-weight:900">СЕН</span>' : ''}</div>
        <div class="lb-score">${Number(p.score).toLocaleString()} BC</div>
      </div>`).join('')}
  `;
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
  grid.innerHTML = '';
  const unlockedIndices = new Set([0]);
  state.inventory.forEach(item => {
    const itemName = (item.name && (item.name.kk || item.name.en || item.name.ru || item.name)) || '';
    AVATAR_SVGS.forEach((av, i) => { if (itemName.includes(av.char)) unlockedIndices.add(i); });
  });
  const slotsFromCases = Math.min(AVATAR_SVGS.length, 1 + Math.floor(state.inventory.length / 2));
  for (let i = 0; i < slotsFromCases; i++) unlockedIndices.add(i);

  AVATAR_SVGS.forEach((av, i) => {
    const isUnlocked = unlockedIndices.has(i);
    const div = document.createElement('div');
    div.className = 'avatar-pick-opt' + (i===tempAvIdx?' sel':'');
    div.style.opacity = isUnlocked ? '1' : '0.35';
    div.style.position = 'relative';
    div.innerHTML = `<svg viewBox="0 0 56 56" width="44" height="44"><circle cx="28" cy="28" r="26" fill="${av.color}33"/><text x="28" y="36" text-anchor="middle" font-size="24">${av.char}</text></svg>` + (!isUnlocked ? '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:16px">🔒</div>' : '');
    div.onclick = () => {
      if (!isUnlocked) { showToast(t('toast_icon_locked')); return; }
      tempAvIdx=i;
      document.querySelectorAll('.avatar-pick-opt').forEach(d=>d.classList.remove('sel'));
      div.classList.add('sel');
    };
    grid.appendChild(div);
  });

  // Секретные аватарки если разблокированы
  if (state.unlockedSecretAvatars && state.unlockedSecretAvatars.length > 0) {
    SECRET_AVATARS.forEach((sav, si) => {
      if (!state.unlockedSecretAvatars.includes(sav.id)) return;
      const div = document.createElement('div');
      const secretIdx = 100 + si;
      div.className = 'avatar-pick-opt' + (tempAvIdx===secretIdx?' sel':'');
      div.style.border = '3px solid #FFD700';
      div.innerHTML = sav.svg.replace('viewBox="0 0 56 56"','viewBox="0 0 56 56" width="44" height="44"') + '<div style="position:absolute;top:2px;right:2px;font-size:9px;background:#FFD700;border-radius:4px;padding:1px 3px;font-weight:900">★</div>';
      div.style.position = 'relative';
      div.onclick = () => {
        tempAvIdx=secretIdx;
        document.querySelectorAll('.avatar-pick-opt').forEach(d=>d.classList.remove('sel'));
        div.classList.add('sel');
      };
      grid.appendChild(div);
    });
  }

  document.getElementById('avatarModal').classList.add('open');
}

function saveAvatarPick() {
  state.avatarIdx = tempAvIdx; save(); updateProfileUI(); closeModal('avatarModal');
}

function openNameModal() {
  document.getElementById('nameChangeInput').value = state.name||'';
  document.getElementById('nameModal').classList.add('open');
}

function saveName() {
  const n = document.getElementById('nameChangeInput').value.trim();
  if (!n) return;
  state.name = n; save(); updateProfileUI(); closeModal('nameModal');
}

function updateProfileUI() {
  let avHTML;
  if (state.avatarIdx >= 100) {
    const si = state.avatarIdx - 100;
    const sav = SECRET_AVATARS[si];
    avHTML = sav ? sav.svg.replace('viewBox="0 0 56 56"','viewBox="0 0 56 56" width="64" height="64"') : '';
  } else {
    const av = AVATAR_SVGS[state.avatarIdx||0];
    avHTML = `<svg viewBox="0 0 56 56" width="64" height="64"><circle cx="28" cy="28" r="26" fill="${av.color}33"/><text x="28" y="36" text-anchor="middle" font-size="28">${av.char}</text></svg>`;
  }
  document.getElementById('profileAvatarRing').innerHTML = avHTML;
  document.getElementById('pName').textContent = state.name || 'Қолданушы';
  const ranks = [{min:0,key:'rank0'},{min:200,key:'rank1'},{min:800,key:'rank2'},{min:2000,key:'rank3'},{min:6000,key:'rank4'}];
  let rk = ranks[0].key;
  for(const r of ranks) { if(state.coins>=r.min) rk=r.key; }
  document.getElementById('pRank').textContent = t(rk);
  document.getElementById('pGames').textContent = state.gamesPlayed;
  document.getElementById('pWins').textContent = state.wins;
  document.getElementById('pItems').textContent = state.inventory.length;
  document.getElementById('coinDisplay').textContent = state.coins;
  updateInventoryUI();
}

function updateInventoryUI() {
  const grid = document.getElementById('invGrid');
  if (!grid) return;
  if (state.inventory.length===0) {
    grid.innerHTML = `<div style="grid-column:span 4;text-align:center;padding:20px;color:var(--text2);font-size:13px;font-weight:700">${t('empty_inv')}</div>`;
    return;
  }
  grid.innerHTML = '';
  state.inventory.slice(-16).forEach(item => {
    const slot = document.createElement('div');
    slot.className = 'inv-slot';
    const svgContent = item.svg || '<text x="28" y="36" text-anchor="middle" font-size="22">?</text>';
    slot.innerHTML = `<svg viewBox="0 0 56 56" width="38" height="38">${svgContent.replace(/<svg[^>]*>/,'').replace('</svg>','')}</svg><div class="rarity-dot dot-${item.rarity||'common'}"></div>`;
    grid.appendChild(slot);
  });
}

// ============================================================
// INIT
// ============================================================
load();
generateStars();
applySystemLangGreeting();

if (state.name) {
  enterMainApp();
  applyLang();
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase().startsWith(currentLang.substring(0,2)));
  });
  startScreenTimer();
} else {
  // Автоматически переходим на онбординг при первом запуске
  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById('page-onboard').classList.add('active');
    // Сбрасываем на шаг 1
    document.querySelectorAll('.onboard-step').forEach(s=>s.classList.remove('active'));
    document.getElementById('onboard-step1').classList.add('active');
  }, 100);
}

applyLang();

// === translate welcome screen on lang change ===
function translateWelcomeScreen(){
  const wt = document.getElementById('wt'); if (wt) wt.textContent = 'BotaOy';
  const ws = document.getElementById('ws');
  if (ws) ws.textContent = currentLang==='kk'?'Сәлем! 👋':currentLang==='ru'?'Привет! 👋':'Hello! 👋';
  const wsub2 = document.getElementById('wsub2');
  if (wsub2) wsub2.textContent = currentLang==='kk'?'Ботамен бірге оқы және ойна!':currentLang==='ru'?'Учись и играй вместе с Ботой!':'Learn and play with Bota!';
  const wbtn = document.getElementById('wbtn');
  if (wbtn) wbtn.textContent = currentLang==='kk'?'Бастау!':currentLang==='ru'?'Начать!':'Start!';
  // onboard greetings
  const ob_title = document.getElementById('ob_title');
  if (ob_title) ob_title.textContent = currentLang==='kk'?'Менің атым — Бота! Сенің атың кім?':currentLang==='ru'?'Меня зовут Бота! А тебя как?':"My name is Bota! What's your name?";
  const ob_btn = document.getElementById('ob_btn');
  if (ob_btn) ob_btn.textContent = currentLang==='kk'?'Жалғастыру →':currentLang==='ru'?'Продолжить →':'Continue →';
  const ob_age_btn = document.getElementById('ob_age_btn');
  if (ob_age_btn) ob_age_btn.textContent = currentLang==='kk'?'Жалғастыру →':currentLang==='ru'?'Продолжить →':'Continue →';
  const ob2_btn = document.getElementById('ob2_btn');
  if (ob2_btn) ob2_btn.textContent = currentLang==='kk'?'Бастайық! 🎉':currentLang==='ru'?'Поехали! 🎉':"Let's go! 🎉";
  const inp = document.getElementById('nameInputOnb');
  if (inp) inp.placeholder = currentLang==='kk'?'Атыңды жаз...':currentLang==='ru'?'Напиши имя...':'Type your name...';
  const sel = document.getElementById('regionSelect');
  if (sel && sel.options.length) {
    sel.options[0].textContent = currentLang==='kk'?'— Облысты таңда —':currentLang==='ru'?'— Выбери область —':'— Choose region —';
  }
  const lbl = document.getElementById('regionSelectedLabel');
  if (lbl && !lbl.dataset.set) lbl.textContent = currentLang==='kk'?'👆 Картадан облысты таңда':currentLang==='ru'?'👆 Выбери область на карте':'👆 Pick a region on map';
}
