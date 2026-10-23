// ============================================================
//  Данные приложения «ЛогоЗверята»
//  Каждый звук связан со зверьком-помощником (ассоциация звука).
//  Слово несёт свою «картинку»-эмодзи (офлайн, без растров).
// ============================================================
window.LM_DATA = {

  // ---------- ЗВУКИ (автоматизация) ----------
  // Этапы: слоги → слова → фразы → скороговорки
  sounds: [
    {
      id: 'r', letter: 'Р', animal: 'Тигрёнок',
      emoji: '🐯', color: '#FF8B6E',
      stages: {
        syllables: ['ра', 'ро', 'ру', 'ры', 'ри', 'ар', 'ор', 'ур', 'ир', 'тра', 'кро', 'гру'],
        words: [
          ['рак', '🦞'], ['рама', '🖼️'], ['рука', '✋'], ['рыба', '🐟'],
          ['роза', '🌹'], ['груз', '🚚'], ['трава', '🌿'], ['краб', '🦀'],
          ['шар', '🎈'], ['сыр', '🧀'], ['топор', '🪓'], ['барабан', '🥁']
        ],
        phrases: ['Рома рубит дрова.', 'У Раи красная роза.', 'На траве — краб.', 'Ира ест сыр и грушу.'],
        twisters: ['На дворе трава, на траве дрова, не руби дрова на траве двора.', 'Проворонила ворона воронёнка.']
      }
    },
    {
      id: 'l', letter: 'Л', animal: 'Лисёнок',
      emoji: '🦊', color: '#F4A340',
      stages: {
        syllables: ['ла', 'ло', 'лу', 'лы', 'ли', 'ал', 'ол', 'ул', 'ыл', 'кла', 'пло', 'гла'],
        words: [
          ['лама', '🦙'], ['ложка', '🥄'], ['луна', '🌙'], ['лыжи', '🎿'],
          ['лимон', '🍋'], ['лампа', '💡'], ['яблоко', '🍎'], ['молоко', '🥛'],
          ['солнце', '🌞'], ['платье', '👗'], ['белка', '🐿️'], ['лось', '🫎']
        ],
        phrases: ['Лама пьёт молоко.', 'На небе — луна.', 'У Лолы лыжи.', 'Лимон кислый.'],
        twisters: ['Мила мыла мишку мылом.', 'Клала Клава лук на полку.']
      }
    },
    {
      id: 'sh', letter: 'Ш', animal: 'Змейка',
      emoji: '🐍', color: '#7ECB5C',
      stages: {
        syllables: ['ша', 'шо', 'шу', 'ши', 'аш', 'ош', 'уш', 'иш', 'шта', 'шко', 'шла'],
        words: [
          ['шапка', '🧢'], ['шар', '🎈'], ['шум', '🔊'], ['шишка', '🌲'],
          ['мышка', '🐭'], ['кошка', '🐱'], ['каша', '🥣'], ['школа', '🏫'],
          ['штаны', '👖'], ['шашки', '🕹️'], ['груша', '🍐'], ['шея', '🦒']
        ],
        phrases: ['У мышки — шишка.', 'Миша ест кашу.', 'Кошка спит на подушке.', 'Наступила тишина.'],
        twisters: ['Шла Саша по шоссе и сосала сушку.', 'Наша шишка у кошки в мишке? Шуша шипит.']
      }
    },
    {
      id: 'zh', letter: 'Ж', animal: 'Жучок',
      emoji: '🐞', color: '#E65C4F',
      stages: {
        syllables: ['жа', 'жо', 'жу', 'жи', 'аж', 'ож', 'уж', 'иж', 'жла', 'жко'],
        words: [
          ['жук', '🪲'], ['жираф', '🦒'], ['живот', '🫃'], ['ежи', '🦔'],
          ['лыжи', '🎿'], ['жёлудь', '🌰'], ['жаба', '🐸'], ['пижама', '🛏️'],
          ['журнал', '📓'], ['снежок', '⛄'], ['ножницы', '✂️'], ['мороженое', '🍦']
        ],
        phrases: ['Жук жужжит.', 'У Жени пижама.', 'Жираф жуёт.', 'Ежи несут яблоко.'],
        twisters: ['У ежа ежата, у ужа ужата.', 'Жужжит жужелица, жужжит и кружится.']
      }
    },
    {
      id: 's', letter: 'С', animal: 'Совёнок',
      emoji: '🦉', color: '#6FA8DC',
      stages: {
        syllables: ['са', 'со', 'су', 'сы', 'си', 'ас', 'ос', 'ус', 'ис', 'ста', 'ско'],
        words: [
          ['сова', '🦉'], ['сон', '😴'], ['суп', '🍲'], ['сыр', '🧀'],
          ['сито', '🧺'], ['нос', '👃'], ['весы', '⚖️'], ['самолёт', '✈️'],
          ['скамейка', '🪑'], ['апельсин', '🍊'], ['автобус', '🚌'], ['письмо', '💌']
        ],
        phrases: ['Соня ест суп.', 'Сова спит днём.', 'Это самолёт.', 'В лесу — апельсин?'],
        twisters: ['У Сони сани, у Сани сом.', 'Свистит свисток, свистит свисток.']
      }
    },
    {
      id: 'z', letter: 'З', animal: 'Комар',
      emoji: '🦟', color: '#50B8A6',
      stages: {
        syllables: ['за', 'зо', 'зу', 'зы', 'зи', 'аз', 'оз', 'уз', 'из', 'зда', 'зло'],
        words: [
          ['замок', '🏰'], ['зонт', '☂️'], ['зуб', '🦷'], ['зыбь', '🌊'],
          ['зима', '❄️'], ['коза', '🐐'], ['незабудка', '🌸'], ['знак', '⚠️'],
          ['заяц', '🐇'], ['зеркало', '🪞'], ['бизон', '🦬'], ['звезда', '⭐']
        ],
        phrases: ['Зоя звонит в зонтик?', 'Зима — это снег.', 'Коза ест капусту.', 'Зайка спит зимой.'],
        twisters: ['У Зины болит зуб.', 'Звенит звонок, начинается урок.']
      }
    },
    {
      id: 'c', letter: 'Ц', animal: 'Цыплёнок',
      emoji: '🐤', color: '#F7CE58',
      stages: {
        syllables: ['ца', 'цо', 'цу', 'цы', 'ац', 'оц', 'уц', 'иц', 'тца'],
        words: [
          ['цыплёнок', '🐤'], ['цапля', '🦢'], ['курица', '🐔'], ['цветок', '🌸'],
          ['кольцо', '💍'], ['огурец', '🥒'], ['птица', '🐦'], ['яйцо', '🥚'],
          ['певец', '🎤'], ['солнце', '🌞'], ['месяц', '🌙'], ['цыган', '🎪']
        ],
        phrases: ['Цапля стоит в воде.', 'Цыплёнок пищит.', 'Курица снесла яйцо.', 'Солнце светит.'],
        twisters: ['Цыплёнок и курица — у курицы цыплёнок.', 'Скворцы и синицы — весёлые птицы.']
      }
    },
    {
      id: 'ch', letter: 'Ч', animal: 'Черепашка',
      emoji: '🐢', color: '#9B7EDE',
      stages: {
        syllables: ['ча', 'чо', 'чу', 'чи', 'ач', 'оч', 'уч', 'ич', 'чна'],
        words: [
          ['часы', '⏰'], ['чемодан', '🧳'], ['чудо', '✨'], ['чайник', '🫖'],
          ['мяч', '⚽'], ['ключ', '🔑'], ['печенье', '🍪'], ['бабочка', '🦋'],
          ['очки', '👓'], ['червяк', '🪱'], ['девочка', '👧'], ['мальчик', '👦']
        ],
        phrases: ['Черепашка пьёт чай.', 'Часы тикают.', 'Девочка поймала бабочку.', 'Это чудо — чудо!'],
        twisters: ['У четырёх черепашек — четыре черепашонка.', 'Червячок червивит червяка.']
      }
    },
    {
      id: 'sch', letter: 'Щ', animal: 'Щеночек',
      emoji: '🐶', color: '#6FBC8E',
      stages: {
        syllables: ['ща', 'що', 'щу', 'щи', 'ащ', 'ощ', 'ущ', 'ищ', 'щна'],
        words: [
          ['щётка', '🪥'], ['щука', '🐟'], ['щи', '🍲'], ['плащ', '🧥'],
          ['ящик', '📦'], ['щека', '😊'], ['роща', '🌳'], ['овощи', '🥕'],
          ['вещь', '🧸'], ['щенок', '🐕'], ['помощник', '🦸'], ['борщ', '🍲']
        ],
        phrases: ['Щенок грызёт косточку.', 'Щука живёт в реке.', 'Щётка чистит щёки.', 'В роще много птиц.'],
        twisters: ['Два щенка, щека к щеке, щиплют щётку в уголке.', 'Щи да каша — пища наша.']
      }
    }
  ],

  // ---------- АРТИКУЛЯЦИОННАЯ ГИМНАСТИКА ----------
  articulation: [
    { id: 'gorka', name: 'Горочка', emoji: '🌄', desc: 'Улыбнись, открой рот, язычок-горочка к нёбу.', steps: ['Улыбнись и открой рот.', 'Прижми кончик языка к верхним зубам.', 'Сделай «горочку», подержи 5 секунд.'] },
    { id: 'cha', name: 'Часики', emoji: '⏰', desc: 'Язычок ходит, как маятник часов.', steps: ['Улыбнись, открой рот.', 'Высуни язычок изо рта.', 'Поворачивай его из одного угла рта в другой.'] },
    { id: 'kacheli', name: 'Качели', emoji: '🎢', desc: 'Язычок качается вверх и вниз.', steps: ['Улыбнись и открой рот.', 'Подними язычок к верхним зубам.', 'Опусти за нижние зубы. Повтори 5 раз.'] },
    { id: 'zlob', name: 'Лошадка', emoji: '🐴', desc: 'Поцокай язычком, как лошадка.', steps: ['Присоси язычок к нёбу.', 'Шёпотом «цокни» и оторви язычок от нёба.', 'Повтори, будто скачешь на лошадке.'] },
    { id: 'tubka', name: 'Трубочка', emoji: '🛖', desc: 'Сверни язычок в трубочку.', steps: ['Улыбнись.', 'Вытяни язычок вперёд.', 'Сверни края язычка в трубочку, подуй.'] },
    { id: 'bublik', name: 'Бублик', emoji: '🥯', desc: 'Сделай губки бубликом.', steps: ['Сомкни зубы.', 'Округли губы, как будто говоришь «О».', 'Подержи 5 секунд, улыбнись.'] },
    { id: 'kormit', name: 'Вкусное варенье', emoji: '🍯', desc: 'Оближи верхнюю губу широким язычком.', steps: ['Улыбнись, открой рот.', 'Широким языком оближи верхнюю губу.', 'Сверху вниз, как будто ешь варенье.'] },
    { id: 'krepost', name: 'Крепкий язычок', emoji: '💪', desc: 'Упрись язычком и сожми губы.', steps: ['Высуни язычок.', 'Сожми его губами, как будто он прячется.', 'Подержи 5 секунд, отпусти.'] }
  ],

  // ---------- ИГРЫ НА ЗАПУСК РЕЧИ ----------
  // «кто так говорит?» — звукоподражание
  play: [
    { id: 'cat', emoji: '🐱', name: 'Кошка', sound: 'Мяу-мяу' },
    { id: 'dog', emoji: '🐶', name: 'Собака', sound: 'Гав-гав' },
    { id: 'cow', emoji: '🐮', name: 'Корова', sound: 'Му-у' },
    { id: 'horse', emoji: '🐴', name: 'Лошадка', sound: 'И-го-го' },
    { id: 'sheep', emoji: '🐑', name: 'Овечка', sound: 'Бе-е' },
    { id: 'duck', emoji: '🦆', name: 'Уточка', sound: 'Кря-кря' },
    { id: 'frog', emoji: '🐸', name: 'Лягушка', sound: 'Ква-ква' },
    { id: 'bird', emoji: '🐦', name: 'Птичка', sound: 'Чик-чирик' },
    { id: 'pig', emoji: '🐷', name: 'Поросёнок', sound: 'Хрю-хрю' },
    { id: 'train', emoji: '🚂', name: 'Паровозик', sound: 'Ту-ту' },
    { id: 'car', emoji: '🚗', name: 'Машинка', sound: 'Би-би' },
    { id: 'clock', emoji: '🕰️', name: 'Часики', sound: 'Тик-так' },
    { id: 'wind', emoji: '🍃', name: 'Ветерок', sound: 'У-у-у' },
    { id: 'drum', emoji: '🥁', name: 'Барабан', sound: 'Тум-тум' }
  ],

  // ---------- БИБЛИОТЕКА ЗВУКОВ ----------
  // sound: текст-звукоподражание (TTS) или 'synth:<ключ>' (Web Audio тон)
  library: {
    categories: [
      {
        id: 'wild', name: 'Дикие животные', emoji: '🦁',
        items: [
          { name: 'Волк', emoji: '🐺', sound: 'у-у-у', file: 'sounds/animals_wilk.ogg' },
          { name: 'Лев', emoji: '🦁', sound: 'р-р-р', file: 'sounds/animals_lew.ogg' },
          { name: 'Тигрёнок', emoji: '🐯', sound: 'р-р-р', file: 'sounds/animals_tygrys.ogg' },
          { name: 'Обезьянка', emoji: '🐵', sound: 'у-у-а-а', file: 'sounds/animals_makak.ogg' },
          { name: 'Слон', emoji: '🐘', sound: 'тру-у', file: 'sounds/animals_slon.ogg' },
          { name: 'Змейка', emoji: '🐍', sound: 'ш-ш-ш', file: 'sounds/animals_waz.ogg' },
          { name: 'Совёнок', emoji: '🦉', sound: 'ух-ух', file: 'sounds/animals_sowa.ogg' },
          { name: 'Ворона', emoji: '🐦‍⬛', sound: 'кар-кар', file: 'sounds/animals_wrona.ogg' },
          { name: 'Медведь', emoji: '🐻', sound: 'ры-ы-ы', file: 'sounds/animals_niedzwiedz.ogg' },
          { name: 'Ёжик', emoji: '🦔', sound: 'фыр-фыр', file: 'sounds/animals_jez.ogg' },
          { name: 'Белка', emoji: '🐿️', sound: 'цок-цок', file: 'sounds/animals_wiewiorka.ogg' },
          { name: 'Бизон', emoji: '🦬', sound: 'му-у', file: 'sounds/animals_bizon.ogg' },
          { name: 'Бобр', emoji: '🦫', sound: 'плюх-плюх', file: 'sounds/animals_bobr.ogg' },
          { name: 'Верблюд', emoji: '🐫', sound: 'ох-ох', file: 'sounds/animals_wielblad.ogg' },
          { name: 'Горилла', emoji: '🦍', sound: 'ух-грр', file: 'sounds/animals_goryl.ogg' },
          { name: 'Дельфин', emoji: '🐬', sound: 'пиу-пиу', file: 'sounds/animals_delfin.ogg' },
          { name: 'Енот', emoji: '🦝', sound: 'фр-фр', file: 'sounds/animals_szop.ogg' },
          { name: 'Кабан', emoji: '🐗', sound: 'хрю-крр', file: 'sounds/animals_dzik.ogg' },
          { name: 'Кенгуру', emoji: '🦘', sound: 'тук-тук', file: 'sounds/animals_kangur.ogg' },
          { name: 'Кит', emoji: '🐋', sound: 'уу-оо', file: 'sounds/animals_wieloryb.ogg' },
          { name: 'Коала', emoji: '🐨', sound: 'крр-крр', file: 'sounds/animals_koala.ogg' },
          { name: 'Крокодил', emoji: '🐊', sound: 'грр-грр', file: 'sounds/animals_krokodyl.ogg' },
          { name: 'Ленивец', emoji: '🦥', sound: 'ааа-аа', file: 'sounds/animals_leniwiec.ogg' },
          { name: 'Лиса', emoji: '🦊', sound: 'тяф-тяф', file: 'sounds/animals_lis.ogg' },
          { name: 'Носорог', emoji: '🦏', sound: 'гр-р-р', file: 'sounds/animals_nosorozec.ogg' },
          { name: 'Орангутан', emoji: '🦧', sound: 'уаа-уаа', file: 'sounds/animals_orangutan.ogg' },
          { name: 'Орёл', emoji: '🦅', sound: 'скри-и', file: 'sounds/animals_orzel.ogg' },
          { name: 'Панда', emoji: '🐼', sound: 'хм-хм', file: 'sounds/animals_panda.ogg' },
          { name: 'Пингвин', emoji: '🐧', sound: 'квок-квок', file: 'sounds/animals_pingwin.ogg' },
          { name: 'Северный олень', emoji: '🦌', sound: 'и-и', file: 'sounds/animals_renifer.ogg' },
          { name: 'Скунс', emoji: '🦨', sound: 'псс-псс', file: 'sounds/animals_skunks.ogg' },
          { name: 'Фламинго', emoji: '🦩', sound: 'кря-кряк', file: 'sounds/animals_flaming.ogg' },
          { name: 'Хомяк', emoji: '🐹', sound: 'пи-пи', file: 'sounds/animals_chomik.ogg' },
          { name: 'Черепаха', emoji: '🐢', sound: 'шш-шш', file: 'sounds/animals_zolw.ogg' },
          { name: 'Зебра', emoji: '🦓', sound: 'и-и-а', file: 'sounds/animals_zebra.ogg' }
        ]
      },
      {
        id: 'pets', name: 'Домашние животные', emoji: '🐱',
        items: [
          { name: 'Кошка', emoji: '🐱', sound: 'мяу-мяу', file: 'sounds/animals_kot.ogg' },
          { name: 'Собака', emoji: '🐶', sound: 'гав-гав', file: 'sounds/animals_pies.ogg' },
          { name: 'Корова', emoji: '🐮', sound: 'му-у', file: 'sounds/animals_krowa.ogg' },
          { name: 'Коза', emoji: '🐐', sound: 'ме-е', file: 'sounds/animals_koza.ogg' },
          { name: 'Овечка', emoji: '🐑', sound: 'бе-е', file: 'sounds/animals_owca.ogg' },
          { name: 'Лошадка', emoji: '🐴', sound: 'и-го-го', file: 'sounds/animals_kon.ogg' },
          { name: 'Петушок', emoji: '🐓', sound: 'ку-ка-ре-ку', file: 'sounds/animals_kogut.ogg' },
          { name: 'Курочка', emoji: '🐔', sound: 'ко-ко-ко', file: 'sounds/animals_kura.ogg' },
          { name: 'Уточка', emoji: '🦆', sound: 'кря-кря', file: 'sounds/animals_kaczka.ogg' },
          { name: 'Свинка', emoji: '🐷', sound: 'хрю-хрю', file: 'sounds/animals_swinia.ogg' },
          { name: 'Альпака', emoji: '🦙', sound: 'мэ-э', file: 'sounds/animals_alpaka.ogg' },
          { name: 'Бык', emoji: '🐂', sound: 'му-у-у', file: 'sounds/animals_byk.ogg' },
          { name: 'Индюк', emoji: '🦃', sound: 'кулдык-кулдык', file: 'sounds/animals_indyk.ogg' },
          { name: 'Кролик', emoji: '🐰', sound: 'хрум-хрум', file: 'sounds/animals_krolik.ogg' },
          { name: 'Лама', emoji: '🦙', sound: 'хек-хек', file: 'sounds/animals_lama.ogg' },
          { name: 'Морская свинка', emoji: '🐹', sound: 'пи-пи-пи', file: 'sounds/animals_swinka_morska.ogg' },
          { name: 'Ослик', emoji: '🫏', sound: 'и-а-и-а', file: 'sounds/animals_osiol.ogg' },
          { name: 'Попугай', emoji: '🦜', sound: 'чика-рика', file: 'sounds/animals_papuga_falista.ogg' }
        ]
      },
      {
        id: 'instr', name: 'Музыкальные инструменты', emoji: '🎺',
        items: [
          { name: 'Барабан', emoji: '🥁', sound: 'synth:drum' },
          { name: 'Пианино', emoji: '🎹', sound: 'synth:piano' },
          { name: 'Гитара', emoji: '🎸', sound: 'synth:guitar' },
          { name: 'Скрипка', emoji: '🎻', sound: 'synth:violin' },
          { name: 'Труба', emoji: '🎺', sound: 'synth:trumpet' },
          { name: 'Флейта', emoji: '🪈', sound: 'synth:flute' },
          { name: 'Колокольчик', emoji: '🔔', sound: 'synth:bell' },
          { name: 'Гармошка', emoji: '🪗', sound: 'synth:harmonica' },
          { name: 'Маракасы', emoji: '🪇', sound: 'synth:maracas' }
        ]
      },
      {
        id: 'street', name: 'На улице', emoji: '🌧️',
        items: [
          { name: 'Гроза', emoji: '⛈️', sound: 'synth:thunder' },
          { name: 'Дождик', emoji: '🌧️', sound: 'synth:rain' },
          { name: 'Ветерок', emoji: '🍃', sound: 'synth:wind' },
          { name: 'Машинка', emoji: '🚗', sound: 'synth:horn' },
          { name: 'Сирена', emoji: '🚨', sound: 'synth:siren' },
          { name: 'Птички', emoji: '🐦', sound: 'synth:chirp' },
          { name: 'Шаги', emoji: '👟', sound: 'synth:steps' },
          { name: 'Автобус', emoji: '🚌', sound: 'synth:engine' },
          { name: 'Лягушка', emoji: '🐸', sound: 'ква-ква', file: 'sounds/animals_zaba.ogg' }
        ]
      },
      {
        id: 'flat', name: 'В квартире', emoji: '🫖',
        items: [
          { name: 'Часики', emoji: '🕰️', sound: 'synth:ticktock' },
          { name: 'Чайничек', emoji: '🫖', sound: 'synth:kettle' },
          { name: 'Пылесос', emoji: '🧹', sound: 'synth:vacuum' },
          { name: 'Стиралка', emoji: '🌀', sound: 'synth:washer' },
          { name: 'Звонок', emoji: '🔔', sound: 'synth:dingdong' },
          { name: 'Телефон', emoji: '📞', sound: 'synth:bphone' },
          { name: 'Дверца', emoji: '🚪', sound: 'synth:squeak' },
          { name: 'Холодильник', emoji: '🧊', sound: 'synth:fridge' }
        ]
      },
      {
        id: 'people', name: 'Звуки человека', emoji: '😂',
        items: [
          { name: 'Смех', emoji: '😂', sound: 'ха-ха-ха' },
          { name: 'Чихание', emoji: '🤧', sound: 'апчхи' },
          { name: 'Хлопки', emoji: '👏', sound: 'хлоп-хлоп' },
          { name: 'Песенка', emoji: '🎤', sound: 'ля-ля-ля' },
          { name: 'Свист', emoji: '😗', sound: 'фью-фью' },
          { name: 'Шёпот', emoji: '🤫', sound: 'ш-ш-ш' },
          { name: 'Слёзки', emoji: '😢', sound: 'уа-а' },
          { name: 'Поцелуйчик', emoji: '😘', sound: 'чмок' }
        ]
      },
      {
        id: 'toys', name: 'Игрушки', emoji: '🧸',
        items: [
          { name: 'Погремушка', emoji: '🪇', sound: 'synth:maracas' },
          { name: 'Паровозик', emoji: '🚂', sound: 'synth:train' },
          { name: 'Кукла', emoji: '🧸', sound: 'ма-ма' },
          { name: 'Мячик', emoji: '⚽', sound: 'synth:bounce' },
          { name: 'Машинка', emoji: '🚗', sound: 'synth:horn' },
          { name: 'Пищалка', emoji: '🐥', sound: 'synth:chirp' },
          { name: 'Дудочка', emoji: '🪈', sound: 'synth:flute' },
          { name: 'Барабанчик', emoji: '🥁', sound: 'synth:drum' }
        ]
      },
      {
        id: 'newyear', name: 'Новый год', emoji: '🎅',
        items: [
          { name: 'Дед Мороз', emoji: '🎅', sound: 'хо-хо-хо' },
          { name: 'Фейерверк', emoji: '🎆', sound: 'synth:firework' },
          { name: 'Снежок', emoji: '❄️', sound: 'хруст-хруст' },
          { name: 'Часы 12', emoji: '🕛', sound: 'synth:midnight' },
          { name: 'Колокольчик', emoji: '🔔', sound: 'synth:bell' },
          { name: 'Конфетти', emoji: '🎊', sound: 'synth:sparkle' },
          { name: 'Бубенцы', emoji: '🎁', sound: 'synth:jingle' },
          { name: 'Мишура', emoji: '✨', sound: 'шур-шур' }
        ]
      },
      {
        id: 'birds', name: 'Птицы', emoji: '🐦',
        items: [
          { name: 'Воробей', emoji: '🐦', sound: 'чик-чирик', file: 'sounds/animals_wrobel.ogg' },
          { name: 'Сорока', emoji: '🐦‍⬛', sound: 'чик-р-р', file: 'sounds/animals_sroka.ogg' },
          { name: 'Скворец', emoji: '🐦', sound: 'свис-свис', file: 'sounds/animals_szpak.ogg' },
          { name: 'Синица', emoji: '🐦', sound: 'тинь-тинь', file: 'sounds/animals_sikora.ogg' },
          { name: 'Снегирь', emoji: '🐦', sound: 'фю-фю', file: 'sounds/animals_gil.ogg' },
          { name: 'Дятел', emoji: '🐦', sound: 'тук-тук-тук', file: 'sounds/animals_dzieciol.ogg' },
          { name: 'Ворон', emoji: '🐦‍⬛', sound: 'кар-р-р', file: 'sounds/animals_kruk.ogg' },
          { name: 'Кукушка', emoji: '🐦', sound: 'ку-ку', file: 'sounds/animals_kukulka.ogg' },
          { name: 'Чайка', emoji: '🐦', sound: 'кри-кри', file: 'sounds/animals_mewa.ogg' },
          { name: 'Голубь', emoji: '🕊️', sound: 'гру-гру', file: 'sounds/animals_golab.ogg' },
          { name: 'Аист', emoji: '🕊️', sound: 'клок-клок', file: 'sounds/animals_bocian.ogg' },
          { name: 'Лебедь', emoji: '🦢', sound: 'гру-гру', file: 'sounds/animals_labedz.ogg' }
        ]
      },
      {
        id: 'bugs', name: 'Насекомые', emoji: '🐞',
        items: [
          { name: 'Божья коровка', emoji: '🐞', sound: 'трз-трз', file: 'sounds/animals_biedronka.ogg' },
          { name: 'Муравей', emoji: '🐜', sound: 'трд-трд', file: 'sounds/animals_mrowka.ogg' },
          { name: 'Пчела', emoji: '🐝', sound: 'ж-ж-ж', file: 'sounds/animals_pszczola.ogg' },
          { name: 'Шмель', emoji: '🐝', sound: 'ж-жжж', file: 'sounds/animals_trzmiel.ogg' },
          { name: 'Бабочка', emoji: '🦋', sound: 'фыр-фыр', file: 'sounds/animals_motyl.ogg' },
          { name: 'Кузнечик', emoji: '🦗', sound: 'цвир-цвир', file: 'sounds/animals_pasikonik.ogg' },
          { name: 'Муха', emoji: '🪰', sound: 'ззз', file: 'sounds/animals_mucha.ogg' },
          { name: 'Паук', emoji: '🕷️', sound: 'шш', file: 'sounds/animals_pajak.ogg' },
          { name: 'Богомол', emoji: '🦗', sound: 'трз', file: 'sounds/animals_modliszka.ogg' }
        ]
      },
      {
        id: 'water', name: 'Водные жители', emoji: '🐬',
        items: [
          { name: 'Акула', emoji: '🦈', sound: 'вжж', file: 'sounds/animals_rekin.ogg' },
          { name: 'Рыба', emoji: '🐟', sound: 'буль-буль', file: 'sounds/animals_ryba.ogg' },
          { name: 'Косатка', emoji: '🐳', sound: 'у-у-у', file: 'sounds/animals_orka.ogg' },
          { name: 'Медуза', emoji: '🪼', sound: 'плям', file: 'sounds/animals_meduza.ogg' },
          { name: 'Осьминог', emoji: '🐙', sound: 'пфф', file: 'sounds/animals_osmiornica.ogg' },
          { name: 'Тюлень', emoji: '🦭', sound: 'орр-орр', file: 'sounds/animals_foka.ogg' },
          { name: 'Морж', emoji: '🦭', sound: 'оу-оу', file: 'sounds/animals_mors.ogg' },
          { name: 'Белуга', emoji: '🐋', sound: 'пиу-у', file: 'sounds/animals_bieluga.ogg' }
        ]
      }
    ]
  }
};
