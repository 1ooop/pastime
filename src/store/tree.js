import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTree = defineStore('tree', () => {
  const url = ref(
    'https://www.klerk.ru/yindex.php/v3/event/rubrics?allowEmpty='
  )

  const loading = ref(false)

  const tree = ref([
    {
      label: 'Древо',
      count: 0,
      countNestedNodes: 0,
      key: '0'
    }
  ])

  const allNodes = ref([])
  const commonParents = ref({})

  const getTree = async (empty = false) => {
    loading.value = true

    allNodes.value = []
    commonParents.value = {}

    // await fetch(`${url.value + (empty ? 1 : 0)}`)
    //   .then((r) => r.json())
    //   .then((r) => {
    //     tree.value[0].children = empty ? emptyUrlData.value : urlData.value
    //     parsedTree()
    //   })
    //   .catch((err) => alert(err))

    await fetch(`${url.value + (empty ? 1 : 0)}`).then(
      (r) => {},
      (r) => {
        tree.value[0].children = empty ? emptyUrlData.value : urlData.value
        parsedTree()
      }
    )

    loading.value = false
  }

  const parsedTree = (mainNode = tree.value[0]) => {
    mainNode.children.forEach((node, index) => {
      node.label = node.title
      node.key = mainNode.key + '-' + index
      node.data = 'https://www.klerk.ru' + node.url
      node.type = 'url'

      findCopy(node)
      allNodes.value.push(node)

      if (node.children && node.children.length !== 0) {
        parsedTree(node)
      } else {
        delete node.children
      }
    })

    mainNode.countNestedNodes = sumCounters(mainNode)
  }

  const findCopy = (node) => {
    const foundCopy = findNode(node.id)

    if (foundCopy) {
      const commonParentKey = findCommonParent(foundCopy.key, node.key)

      commonParents.value[commonParentKey]
        ? commonParents.value[commonParentKey].push(node.key)
        : (commonParents.value[commonParentKey] = [foundCopy.key, node.key])
    }
  }

  const findCommonParent = (keyA, keyB) => {
    const arrayA = keyA.split('-')
    const arrayB = keyB.split('-')

    let commonParent = '0'

    for (let i = 1; i < arrayA.length; i++) {
      if (arrayA[i] !== arrayB[i]) break
      commonParent += '-' + arrayA[i]
    }

    return commonParent
  }

  const findNode = (id, key) =>
    allNodes.value.find((node) => (id ? node.id == id : node.key == key))

  const sumCounters = (node) => {
    let sumNestedNodes = node.children.reduce(
      (acc, nestedNode) =>
        acc + (nestedNode.countNestedNodes || nestedNode.count),
      node.count
    )

    const arrayKeysOfCommonParent = commonParents.value[node.key]

    if (arrayKeysOfCommonParent) {
      let id_quantity = {}

      arrayKeysOfCommonParent.forEach((keyCopy) => {
        const currentCopy = findNode(null, keyCopy)

        id_quantity[currentCopy.id]
          ? (id_quantity[currentCopy.id] += 1)
          : (id_quantity[currentCopy.id] = 1)
      })

      Object.keys(id_quantity).forEach((id) => {
        const quantityCopies = id_quantity[id]

        const currentCopy = findNode(id)

        sumNestedNodes -= (quantityCopies - 1) * currentCopy.count
      })
    }

    return sumNestedNodes
  }

  return { tree, loading, getTree }
})

const urlData = ref([
  {
    id: 100,
    title: 'Бухгалтерия',
    url: '/rubricator/buhgalterija/',
    children: [
      {
        id: 2,
        title: 'Учетная политика',
        url: '/rubricator/uchetnaja-politika/',
        count: 3
      },
      {
        id: 5,
        title: 'Бухгалтерский учет',
        url: '/rubricator/buhgalterskij-uchet/',
        count: 27
      },
      {
        id: 10,
        title: 'ВЭД',
        url: '/rubricator/ved/',
        count: 32
      },
      {
        id: 16,
        title: 'Первичные документы',
        url: '/rubricator/pervichnye-dokumenty/',
        count: 4
      },
      {
        id: 19,
        title: 'Аудит',
        url: '/rubricator/audit/',
        count: 1
      },
      {
        id: 25,
        title: 'Основные средства',
        url: '/rubricator/osnovnye-sredstva/',
        count: 3
      },
      {
        id: 31,
        title: 'Онлайн-кассы',
        url: '/rubricator/onlajn-kassy/',
        count: 9
      },
      {
        id: 158,
        title: 'МСФО',
        url: '/rubricator/msfo/',
        count: 2
      },
      {
        id: 160,
        title: 'Делопроизводство',
        url: '/rubricator/deloproizvodstvo/',
        count: 3
      },
      {
        id: 312,
        title: 'Блокировка счетов',
        url: '/rubricator/blokirovka-schetov/',
        count: 6
      },
      {
        id: 318,
        title: 'Расчеты с работниками',
        url: '/rubricator/rascheti/',
        count: 7
      },
      {
        id: 449,
        title: 'Дебиторская задолженность',
        url: '/rubricator/debitorskaja-zadolzhennost/',
        count: 3
      },
      {
        id: 450,
        title: 'Бухгалтерский аутсорсинг',
        url: '/rubricator/buhgaltersky-outsourcing/',
        count: 17
      },
      {
        id: 454,
        title: 'Нематериальные активы',
        url: '/rubricator/nma/',
        count: 1
      },
      {
        id: 455,
        title: 'Кассовые операции',
        url: '/rubricator/kassovije-operatsii/',
        count: 2
      },
      {
        id: 471,
        title: 'Управленческий учет',
        url: '/rubricator/upravlencheskiy-uchet/',
        count: 49
      },
      {
        id: 487,
        title: 'ФСБУ',
        url: '/rubricator/fsbu/',
        count: 76
      },
      {
        id: 826,
        title:
          'Учет, налоги, законодательство для ДНР, ЛНР, Запорожской и Херсонской областей',
        url: '/rubricator/826/',
        count: 4
      }
    ],
    count: 27
  },
  {
    id: 101,
    title: 'Банки',
    url: '/rubricator/banki/',
    children: [
      {
        id: 72,
        title: 'Кредитование',
        url: '/rubricator/kreditovanie/',
        count: 2
      },
      {
        id: 228,
        title: 'Электронные деньги',
        url: '/rubricator/elektronnye-dengi-raschety-elektronnymi-dengami/',
        count: 1
      },
      {
        id: 288,
        title: 'Криптовалюта',
        url: '/rubricator/288/',
        count: 1
      },
      {
        id: 446,
        title: 'Наличные деньги',
        url: '/rubricator/446/',
        count: 2
      },
      {
        id: 741,
        title: 'Валюта',
        url: '/rubricator/valyuta/',
        count: 1
      }
    ],
    count: 1
  },
  {
    id: 102,
    title: 'Автоматизация учета',
    url: '/rubricator/avtomatizatsija-ucheta/',
    children: [
      {
        id: 43,
        title: '1С',
        url: '/rubricator/1c/',
        count: 23
      },
      {
        id: 73,
        title: 'Бухгалтерские программы',
        url: '/rubricator/buhgalterskie-programmy/',
        count: 1
      },
      {
        id: 230,
        title: 'ЭДО',
        url: '/rubricator/elektronnyj-dokumentooborot-elektronnaja-otchetnost/',
        count: 18
      }
    ],
    count: 2
  },
  {
    id: 103,
    title: 'Право',
    url: '/rubricator/pravo/',
    children: [
      {
        id: 15,
        title: 'УК РФ',
        url: '/rubricator/uk-rf/',
        count: 8
      },
      {
        id: 17,
        title: 'Трудовое право',
        url: '/rubricator/trudovoe-pravo/',
        count: 1
      },
      {
        id: 20,
        title: 'НК РФ',
        url: '/rubricator/nk-rf/',
        count: 2
      },
      {
        id: 130,
        title: 'ГК РФ',
        url: '/rubricator/gk-rf/',
        count: 1
      },
      {
        id: 155,
        title: 'Полиция',
        url: '/rubricator/policiya/',
        count: 5
      },
      {
        id: 212,
        title: 'Банкротство',
        url: '/rubricator/bankrotstvo/',
        count: 7
      },
      {
        id: 225,
        title: 'Госзакупки',
        url: '/rubricator/goszakupki/',
        count: 7
      },
      {
        id: 262,
        title: 'Антимонопольное право',
        url: '/rubricator/antimonopolnoe-pravo/',
        count: 1
      },
      {
        id: 287,
        title: 'Защита персональных данных',
        url: '/rubricator/zashita-personalnih-dannih/',
        count: 8
      },
      {
        id: 824,
        title: 'Лицензирование',
        url: '/rubricator/licensing/',
        count: 1
      }
    ],
    count: 15
  },
  {
    id: 105,
    title: 'Налоги, взносы, пошлины',
    url: '/rubricator/nalogi-vznosy-poshlini/',
    children: [
      {
        id: 3,
        title: 'Налог на прибыль',
        url: '/rubricator/nalog-na-pribyl/',
        count: 6
      },
      {
        id: 4,
        title: 'НДС',
        url: '/rubricator/nds/',
        count: 23
      },
      {
        id: 7,
        title: 'Налог на имущество',
        url: '/rubricator/nalog-na-imuschestvo/',
        count: 1
      },
      {
        id: 27,
        title: 'НДФЛ',
        url: '/rubricator/ndfl/',
        count: 14
      },
      {
        id: 82,
        title: 'Оптимизация налогообложения',
        url: '/rubricator/optimizatsija-nalogooblozhenija/',
        count: 25
      },
      {
        id: 83,
        title: 'Новости ФНС',
        url: '/rubricator/fns-nalogovaja-inspektsija/',
        count: 1
      },
      {
        id: 97,
        title: 'Налоговые штрафы',
        url: '/rubricator/nalogovye-shtrafi/',
        count: 2
      },
      {
        id: 118,
        title: 'Офшоры',
        url: '/rubricator/ofshori/',
        count: 1
      },
      {
        id: 213,
        title: 'Страховые взносы',
        url: '/rubricator/strahovye-vznosy/',
        count: 7
      },
      {
        id: 233,
        title: 'Контролируемые сделки',
        url: '/rubricator/kontroliruemye-sdelki/',
        count: 1
      },
      {
        id: 257,
        title: 'Торговый сбор',
        url: '/rubricator/torgovyj-sbor/',
        count: 1
      },
      {
        id: 270,
        title: 'Проверка контрагентов',
        url: '/rubricator/proverka-kontragentov/',
        count: 4
      },
      {
        id: 297,
        title: 'Спецрежимы',
        url: '/rubricator/specrejimi/',
        count: 2
      },
      {
        id: 308,
        title: 'Выбор системы налогообложения',
        url: '/rubricator/308/',
        count: 1
      },
      {
        id: 331,
        title: 'Самозанятые',
        url: '/rubricator/samozanyatie/',
        count: 23
      },
      {
        id: 445,
        title: 'Налоговые изменения 2021',
        url: '/rubricator/445/',
        count: 1
      },
      {
        id: 639,
        title: 'ЕНП (единый налоговый платеж)',
        url: '/rubricator/enp/',
        count: 13
      },
      {
        id: 820,
        title: 'Налоговые изменения 2023',
        url: '/rubricator/nalogovye-izmeneniya-2023/',
        count: 10
      },
      {
        id: 837,
        title: 'Налоговые изменения 2025',
        url: '/rubricator/837/',
        count: 1
      }
    ],
    count: 26
  },
  {
    id: 106,
    title: 'Ведение бизнеса',
    url: '/rubricator/vedenie-biznesa/',
    children: [
      {
        id: 57,
        title: 'Менеджмент',
        url: '/rubricator/menedzhment/',
        count: 2
      },
      {
        id: 59,
        title: 'Маркетинг',
        url: '/rubricator/marketing/',
        count: 6
      },
      {
        id: 60,
        title: 'Управление финансами',
        url: '/rubricator/upravlenie-finansami/',
        count: 9
      },
      {
        id: 329,
        title: 'Индивидуальный предприниматель',
        url: '/rubricator/individualniy-predprinimatel/',
        count: 7
      },
      {
        id: 463,
        title: 'Субсидии для бизнеса',
        url: '/rubricator/subsidii-dlya-biznesa/',
        count: 2
      },
      {
        id: 699,
        title: 'Некоммерческие организации',
        url: '/rubricator/nekommercheskie-organizacii/',
        count: 1
      }
    ],
    count: 11
  },
  {
    id: 109,
    title: 'Бюджетный учет',
    url: '/rubricator/uchet-v-gossektore/',
    children: [],
    count: 1
  },
  {
    id: 126,
    title: 'Отраслевой учет',
    url: '/rubricator/otraslevoj-uchet-i-spetsrezhimy/',
    children: [
      {
        id: 67,
        title: 'Учет в строительстве',
        url: '/rubricator/uchet-v-stroitelstve/',
        count: 3
      },
      {
        id: 153,
        title: 'Учет в организациях общепита',
        url: '/rubricator/uchet-v-organizatsijah-obschestvennogo-pitanija/',
        count: 1
      },
      {
        id: 269,
        title: 'ЕГАИС',
        url: '/rubricator/egais/',
        count: 1
      },
      {
        id: 284,
        title: 'Маркировка товаров',
        url: '/rubricator/markirovka-tovarov/',
        count: 4
      },
      {
        id: 476,
        title: 'Прослеживаемость товаров',
        url: '/rubricator/476/',
        count: 1
      },
      {
        id: 816,
        title: 'Маркировка рекламы',
        url: '/rubricator/markirovka-reklamy/',
        count: 2
      }
    ],
    count: 0
  },
  {
    id: 165,
    title: 'Инвестиции',
    url: '/rubricator/investitsii/',
    children: [],
    count: 3
  },
  {
    id: 205,
    title: 'Экономика России',
    url: '/rubricator/ekonomika-rossii/',
    children: [
      {
        id: 204,
        title: 'Финансовый кризис',
        url: '/rubricator/finansovyj-krizis/',
        count: 1
      }
    ],
    count: 0
  },
  {
    id: 290,
    title: 'Интернет и IT',
    url: '/rubricator/internet/',
    children: [
      {
        id: 800,
        title: 'IT-компании',
        url: '/rubricator/it-kompanii/',
        count: 1
      },
      {
        id: 802,
        title: 'Информационные технологии',
        url: '/rubricator/informacionnye-tekhnologii/',
        count: 1
      }
    ],
    count: 3
  },
  {
    id: 295,
    title: 'Отчетность',
    url: '/rubricator/otchetnost/',
    children: [
      {
        id: 239,
        title: 'Бухгалтерская отчетность',
        url: '/rubricator/buhgalterskaja-otchetnost/',
        count: 8
      },
      {
        id: 301,
        title: 'Налоговая отчетность',
        url: '/rubricator/301/',
        count: 5
      },
      {
        id: 825,
        title: 'Отчетность в СФР',
        url: '/rubricator/otchetnost_v_sfr/',
        count: 2
      }
    ],
    count: 25
  },
  {
    id: 296,
    title: 'Проверки',
    url: '/rubricator/proverki/',
    children: [
      {
        id: 33,
        title: 'Налоговые проверки',
        url: '/rubricator/nalogovye-proverki/',
        count: 98
      },
      {
        id: 259,
        title: 'Налоговый мониторинг',
        url: '/rubricator/nalogovyj-monitoring/',
        count: 4
      }
    ],
    count: 8
  },
  {
    id: 299,
    title: 'Кадры',
    url: '/rubricator/kadri/',
    children: [
      {
        id: 58,
        title: 'Управление персоналом',
        url: '/rubricator/upravlenie-personalom/',
        count: 5
      },
      {
        id: 197,
        title: 'Охрана труда',
        url: '/rubricator/ohrana-truda/',
        count: 5
      },
      {
        id: 278,
        title: 'Кадровый учет',
        url: '/rubricator/kadrovyj-uchet/',
        count: 12
      },
      {
        id: 330,
        title: 'Трудовые отношения',
        url: '/rubricator/trudovie-otnosheniya/',
        count: 3
      },
      {
        id: 447,
        title: 'Электронные трудовые книжки',
        url: '/rubricator/447/',
        count: 1
      },
      {
        id: 474,
        title: 'Иностранные работники',
        url: '/rubricator/inostrannie-rabotniki/',
        count: 4
      }
    ],
    count: 38
  },
  {
    id: 313,
    title: 'Бухгалтеры',
    url: '/rubricator/buhgalteri/',
    children: [
      {
        id: 64,
        title: 'Главбух: права, обязанности,  передача дел',
        url: '/rubricator/glavbuh-prava-objazanosti--peredacha-del/',
        count: 1
      },
      {
        id: 91,
        title: 'Бизнес-психология',
        url: '/rubricator/biznes-psihologija/',
        count: 6
      },
      {
        id: 315,
        title: 'Карьера бухгалтера',
        url: '/rubricator/karera-buhgaltera/',
        count: 12
      },
      {
        id: 316,
        title: 'Обучение для бухгалтеров',
        url: '/rubricator/obuchenie-dlya-buhgalterov/',
        count: 5
      }
    ],
    count: 7
  }
])

const emptyUrlData = ref([
  {
    id: 100,
    title: 'Бухгалтерия',
    url: '/rubricator/buhgalterija/',
    children: [
      {
        id: 2,
        title: 'Учетная политика',
        url: '/rubricator/uchetnaja-politika/',
        children: [
          {
            id: 488,
            title: 'Учетная политика 2023',
            url: '/rubricator/uchetnaja-politika-2023/',
            children: [],
            count: 0
          },
          {
            id: 489,
            title: 'Составление учетной политики',
            url: '/rubricator/sostavlenie-uchetnoj-politiki/',
            children: [],
            count: 0
          },
          {
            id: 490,
            title: 'Изменение учетной политики',
            url: '/rubricator/izmenenie-uchetnoj-politiki/',
            children: [],
            count: 0
          }
        ],
        count: 3
      },
      {
        id: 5,
        title: 'Бухгалтерский учет',
        url: '/rubricator/buhgalterskij-uchet/',
        children: [
          {
            id: 491,
            title: 'План счетов',
            url: '/rubricator/plan-schetov/',
            children: [],
            count: 0
          },
          {
            id: 492,
            title: 'Регистры учета',
            url: '/rubricator/registry-ucheta/',
            children: [],
            count: 0
          },
          {
            id: 493,
            title: 'Учет доходов',
            url: '/rubricator/uchet-dohodov/',
            children: [],
            count: 0
          },
          {
            id: 494,
            title: 'Учет расходов',
            url: '/rubricator/uchet-rashodov/',
            children: [],
            count: 0
          },
          {
            id: 495,
            title: 'Упрощенный бухгалтерский учет',
            url: '/rubricator/uproshchenny-buhgaltersky-uchet/',
            children: [],
            count: 0
          },
          {
            id: 496,
            title: 'Инвентаризация',
            url: '/rubricator/inventarizacya/',
            children: [],
            count: 0
          },
          {
            id: 842,
            title: 'Дивиденды',
            url: '/rubricator/842/',
            children: [],
            count: 0
          }
        ],
        count: 27
      },
      {
        id: 10,
        title: 'ВЭД',
        url: '/rubricator/ved/',
        children: [
          {
            id: 497,
            title: 'Экспорт',
            url: '/rubricator/export/',
            children: [],
            count: 0
          },
          {
            id: 498,
            title: 'Импорт',
            url: '/rubricator/import/',
            children: [],
            count: 1
          },
          {
            id: 499,
            title: 'Иностранные контрагенты',
            url: '/rubricator/inostrannye-kontragenty/',
            children: [],
            count: 0
          },
          {
            id: 500,
            title: 'ЕАЭС',
            url: '/rubricator/eaes/',
            children: [],
            count: 0
          }
        ],
        count: 32
      },
      {
        id: 16,
        title: 'Первичные документы',
        url: '/rubricator/pervichnye-dokumenty/',
        children: [
          {
            id: 501,
            title: 'Составление первички',
            url: '/rubricator/sostavlenie-pervichki/',
            children: [],
            count: 0
          },
          {
            id: 502,
            title: 'Хранение первички',
            url: '/rubricator/hranenie-pervichki/',
            children: [],
            count: 0
          },
          {
            id: 503,
            title: 'Реквизиты первички',
            url: '/rubricator/requizity-pervichki/',
            children: [],
            count: 0
          },
          {
            id: 504,
            title: 'Формы первичных документов',
            url: '/rubricator/formy-pervichnyh-dokumentov/',
            children: [],
            count: 0
          }
        ],
        count: 4
      },
      {
        id: 19,
        title: 'Аудит',
        url: '/rubricator/audit/',
        children: [
          {
            id: 505,
            title: 'Обязательный аудит',
            url: '/rubricator/obyazatelny-audit/',
            children: [],
            count: 0
          },
          {
            id: 506,
            title: 'Инициативный аудит',
            url: '/rubricator/iniciativny-audit/',
            children: [],
            count: 0
          },
          {
            id: 507,
            title: 'Внутренний аудит',
            url: '/rubricator/vnutrenny-audit/',
            children: [],
            count: 0
          },
          {
            id: 508,
            title: 'Регулирование аудиторской деятельности',
            url: '/rubricator/regulirovanie-auditorskoj-deyatelnosti/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 25,
        title: 'Основные средства',
        url: '/rubricator/osnovnye-sredstva/',
        children: [
          {
            id: 509,
            title: 'Первоначальная стоимость',
            url: '/rubricator/pervonachalnaya-stoimost-osnovnyh-sredstv/',
            children: [],
            count: 0
          },
          {
            id: 510,
            title: 'Амортизация основных средств',
            url: '/rubricator/amortizacya-osnovnyh-sredstv/',
            children: [],
            count: 0
          },
          {
            id: 511,
            title: 'Бухгалтерский учет ОС',
            url: '/rubricator/buhgaltersky-uchet-osnovnyh-sredstv/',
            children: [],
            count: 0
          },
          {
            id: 512,
            title: 'Переоценка ОС',
            url: '/rubricator/pereocenka-osnovnyh-sredstv/',
            children: [],
            count: 0
          },
          {
            id: 513,
            title: 'Налоговый учет ОС',
            url: '/rubricator/nalogovy-uchet-osnovnyh-sredstv/',
            children: [],
            count: 0
          },
          {
            id: 514,
            title: 'Учет ОС при УСН',
            url: '/rubricator/uchet-osnovnyh-sredstv-pri-usn/',
            children: [],
            count: 0
          }
        ],
        count: 3
      },
      {
        id: 31,
        title: 'Онлайн-кассы',
        url: '/rubricator/onlajn-kassy/',
        children: [
          {
            id: 515,
            title: 'Регистрация ККТ',
            url: '/rubricator/registracia-onlain-kass/',
            children: [],
            count: 0
          },
          {
            id: 516,
            title: 'ОФД',
            url: '/rubricator/operatory-fiscalnyh-dannyh/',
            children: [],
            count: 0
          },
          {
            id: 517,
            title: 'Чеки',
            url: '/rubricator/chequi-onlain-kass/',
            children: [],
            count: 0
          },
          {
            id: 518,
            title: 'БСО',
            url: '/rubricator/blanki-strogoi-otchetnosti/',
            children: [],
            count: 0
          },
          {
            id: 519,
            title: 'Порядок применения онлайн-касс',
            url: '/rubricator/poryadok-primenenya-onlain-kass/',
            children: [],
            count: 0
          },
          {
            id: 520,
            title: 'Исправление ошибок в чеках',
            url: '/rubricator/ispravlenie-oshibok-v-chekah-onlain-kass/',
            children: [],
            count: 0
          }
        ],
        count: 9
      },
      {
        id: 37,
        title: 'Обособленные подразделения, филиалы',
        url: '/rubricator/obosoblennye-podrazdelenija-filialy/',
        children: [
          {
            id: 521,
            title: 'Регистрация обособленных подразделений',
            url: '/rubricator/registracia-obosoblennyh-podrazdelenij/',
            children: [],
            count: 0
          },
          {
            id: 522,
            title: 'Раздельный учет в обособленных подразделениях',
            url: '/rubricator/razdelny-uchet-v-obosoblennyh-podrazdeleniah/',
            children: [],
            count: 0
          },
          {
            id: 523,
            title: 'Филиал',
            url: '/rubricator/filial-uridicheskogo-litsa/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 63,
        title: 'Учет займов и кредитов',
        url: '/rubricator/zajmy-kredity/',
        children: [
          {
            id: 524,
            title: 'Учет займов',
            url: '/rubricator/uchet-zaimov/',
            children: [],
            count: 0
          },
          {
            id: 525,
            title: 'Беспроцентные займы',
            url: '/rubricator/besprocentnye-zaymi/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 149,
        title: 'Уставный капитал',
        url: '/rubricator/ustavnyj-kapital/',
        children: [
          {
            id: 526,
            title: 'Увеличение уставного капитала',
            url: '/rubricator/uvelichenie-ustavnogo-kapitala/',
            children: [],
            count: 0
          },
          {
            id: 527,
            title: 'Формирование уставного капитала',
            url: '/rubricator/formirovanie-ustavnogo-kapitala/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 158,
        title: 'МСФО',
        url: '/rubricator/msfo/',
        children: [
          {
            id: 528,
            title: 'Отчетность по МСФО',
            url: '/rubricator/otchetnost-po-msfo/',
            children: [],
            count: 0
          },
          {
            id: 529,
            title: 'Трансформация отчетности',
            url: '/rubricator/transformacya-otchetnosti-po-msfo/',
            children: [],
            count: 0
          },
          {
            id: 530,
            title: 'Консолидация отчетности',
            url: '/rubricator/konsolidacya-otchetnosti-po-msfo/',
            children: [],
            count: 0
          }
        ],
        count: 2
      },
      {
        id: 160,
        title: 'Делопроизводство',
        url: '/rubricator/deloproizvodstvo/',
        children: [
          {
            id: 531,
            title: 'Ведение документооборота',
            url: '/rubricator/vedenie-dokumentooborota/',
            children: [],
            count: 0
          },
          {
            id: 532,
            title: 'Хранение документов',
            url: '/rubricator/hranenie-dokumentov/',
            children: [],
            count: 0
          },
          {
            id: 533,
            title: 'Архив документов',
            url: '/rubricator/arhiv-dokumentov/',
            children: [],
            count: 0
          },
          {
            id: 534,
            title: 'Уничтожение документов',
            url: '/rubricator/unichtozhenie-dokumentov/',
            children: [],
            count: 0
          }
        ],
        count: 3
      },
      {
        id: 263,
        title: 'Обзоры для бухгалтера',
        url: '/rubricator/obzory-dlya-buhgaltera/',
        children: [
          {
            id: 535,
            title: 'Обзор налоговых новостей',
            url: '/rubricator/obzor-nalogovyh-novostej/',
            children: [],
            count: 0
          },
          {
            id: 536,
            title: 'Обзор законопроектов',
            url: '/rubricator/obzor-zakonoproektov/',
            children: [],
            count: 0
          },
          {
            id: 537,
            title: 'Обзор судебной практики',
            url: '/rubricator/obzor-sudebnoj-praktiki/',
            children: [],
            count: 0
          },
          {
            id: 538,
            title: 'Обзор сервисов для бухгалтеров',
            url: '/rubricator/obzor-servisov-dlya-buhgalterov/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 312,
        title: 'Блокировка счетов',
        url: '/rubricator/blokirovka-schetov/',
        children: [
          {
            id: 539,
            title:
              'Блокировка счетов по 115-ФЗ и антиотмывочное законодательство',
            url: '/rubricator/blokirovka-schetov-po-115-fz/',
            children: [],
            count: 6
          },
          {
            id: 540,
            title: 'Блокировка счетов налоговой инспекцией',
            url: '/rubricator/blokirovka-schetov-nalogovoj-inspekcyej/',
            children: [],
            count: 0
          }
        ],
        count: 6
      },
      {
        id: 318,
        title: 'Расчеты с работниками',
        url: '/rubricator/rascheti/',
        children: [
          {
            id: 9,
            title: 'Зарплата',
            url: '/rubricator/zarplata/',
            children: [],
            count: 3
          },
          {
            id: 218,
            title: 'Социальные пособия',
            url: '/rubricator/sotsialnye-posobija/',
            children: [],
            count: 0
          },
          {
            id: 319,
            title: 'Премии',
            url: '/rubricator/premii/',
            children: [],
            count: 0
          },
          {
            id: 320,
            title: 'Подотчет, командировки',
            url: '/rubricator/podotchet-komandirovki/',
            children: [],
            count: 2
          },
          {
            id: 321,
            title: 'Отпускные',
            url: '/rubricator/otpusknie/',
            children: [],
            count: 1
          },
          {
            id: 322,
            title: 'Компенсация за неиспользованный отпуск',
            url: '/rubricator/kompensaciya-za-otpusk/',
            children: [],
            count: 0
          },
          {
            id: 441,
            title: 'Декретный отпуск',
            url: '/rubricator/441/',
            children: [],
            count: 0
          },
          {
            id: 442,
            title: 'Больничные',
            url: '/rubricator/442/',
            children: [],
            count: 1
          },
          {
            id: 443,
            title: 'Детские пособия',
            url: '/rubricator/443/',
            children: [],
            count: 0
          },
          {
            id: 541,
            title: 'Компенсации работникам',
            url: '/rubricator/kompensacii-rabotnikam/',
            children: [],
            count: 0
          },
          {
            id: 542,
            title: 'Материальная помощь',
            url: '/rubricator/materialnaya-pomosch/',
            children: [],
            count: 0
          },
          {
            id: 543,
            title: 'Районные коэффициенты и северная надбавка',
            url: '/rubricator/rayonnye-koefficienty-i-severnaya-nadbavka/',
            children: [],
            count: 0
          },
          {
            id: 544,
            title: 'Удержания из зарплаты',
            url: '/rubricator/uderzhanija-iz-zarplaty/',
            children: [
              {
                id: 545,
                title: 'Алименты',
                url: '/rubricator/alimenty/',
                children: [],
                count: 0
              },
              {
                id: 546,
                title: 'Удержания по исполнительным листам',
                url: '/rubricator/uderzhanija-iz-zp-po-ispolnitelnym-listam/',
                children: [],
                count: 0
              }
            ],
            count: 0
          }
        ],
        count: 7
      },
      {
        id: 449,
        title: 'Дебиторская задолженность',
        url: '/rubricator/debitorskaja-zadolzhennost/',
        children: [
          {
            id: 547,
            title: 'Учет дебиторской задолженности',
            url: '/rubricator/uchet-debitorskoj-zadolzhennosti/',
            children: [],
            count: 0
          },
          {
            id: 548,
            title: 'Взыскание дебиторской задолженности',
            url: '/rubricator/vzyskanie-debitorskoj-zadolzhennosti/',
            children: [],
            count: 1
          },
          {
            id: 549,
            title: 'Списание дебиторской задолженности',
            url: '/rubricator/spisanie-debitorskoj-zadolzhennosti/',
            children: [],
            count: 0
          }
        ],
        count: 3
      },
      {
        id: 450,
        title: 'Бухгалтерский аутсорсинг',
        url: '/rubricator/buhgaltersky-outsourcing/',
        children: [
          {
            id: 486,
            title: 'ОЦО: общие центры обслуживания',
            url: '/rubricator/oco/',
            children: [],
            count: 0
          },
          {
            id: 550,
            title: 'Работа в бухаутсорсинге',
            url: '/rubricator/rabota-v-buhoutsourcinge/',
            children: [],
            count: 0
          },
          {
            id: 551,
            title: 'Переход на обслуживание на аутсорсинге',
            url: '/rubricator/perehod-na-obsluzhivanie-v-buh-outsourcinge/',
            children: [],
            count: 0
          },
          {
            id: 552,
            title: 'Стоимость бухгалтерских услуг',
            url: '/rubricator/stoimost-buhgalterskih-uslug/',
            children: [],
            count: 0
          }
        ],
        count: 17
      },
      {
        id: 453,
        title: 'Кредиторская задолженность',
        url: '/rubricator/kreditorskaja-zadolzhennost/',
        children: [
          {
            id: 553,
            title: 'Учет кредиторской задолженности',
            url: '/rubricator/uchet-kreditorskoj-zadolzhennosti/',
            children: [],
            count: 0
          },
          {
            id: 554,
            title: 'Списание кредиторской задолженности',
            url: '/rubricator/spisanie-kreditorskoj-zadolzhennosti/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 454,
        title: 'Нематериальные активы',
        url: '/rubricator/nma/',
        children: [
          {
            id: 555,
            title: 'Бухучет НМА',
            url: '/rubricator/buhuchet-nma/',
            children: [],
            count: 0
          },
          {
            id: 556,
            title: 'Налоговый учет НМА',
            url: '/rubricator/nalogovij-uchet-nma/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 455,
        title: 'Кассовые операции',
        url: '/rubricator/kassovije-operatsii/',
        children: [
          {
            id: 557,
            title: 'Лимит кассы',
            url: '/rubricator/limit-kassy/',
            children: [],
            count: 0
          },
          {
            id: 558,
            title: 'Лимит расчетов наличными',
            url: '/rubricator/limit-raschetov-nalichnymi/',
            children: [],
            count: 0
          }
        ],
        count: 2
      },
      {
        id: 456,
        title: 'Справочно-правовые системы',
        url: '/rubricator/spravochno-pravovije-sistemi/',
        children: [
          {
            id: 559,
            title: 'Консультант Плюс',
            url: '/rubricator/konsultant-plyus/',
            children: [],
            count: 0
          },
          {
            id: 560,
            title: 'Система Главбух',
            url: '/rubricator/sistema-glavbuh/',
            children: [],
            count: 0
          },
          {
            id: 561,
            title: 'Гарант',
            url: '/rubricator/sistema-glavbuh/',
            children: [],
            count: 0
          },
          {
            id: 562,
            title: 'Контур Норматив',
            url: '/rubricator/kontur-normativ/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 471,
        title: 'Управленческий учет',
        url: '/rubricator/upravlencheskiy-uchet/',
        children: [
          {
            id: 563,
            title: 'Ведение управленческого учета',
            url: '/rubricator/vedenie-upravlencheskogo-ucheta/',
            children: [],
            count: 1
          },
          {
            id: 564,
            title: 'Управленческие отчеты',
            url: '/rubricator/upravlencheskie-otchety/',
            children: [],
            count: 0
          },
          {
            id: 565,
            title: 'Финансовый анализ',
            url: '/rubricator/finansovyj-analiz/',
            children: [],
            count: 0
          },
          {
            id: 566,
            title: 'Бюджетирование',
            url: '/rubricator/byudzhetirovanie/',
            children: [],
            count: 0
          },
          {
            id: 567,
            title: 'Автоматизация управленческого учета',
            url: '/rubricator/avtomatizaciya-upravlencheskogo-ucheta/',
            children: [],
            count: 0
          }
        ],
        count: 49
      },
      {
        id: 487,
        title: 'ФСБУ',
        url: '/rubricator/fsbu/',
        children: [
          {
            id: 568,
            title: 'ФСБУ Запасы',
            url: '/rubricator/fsbu-zapasy/',
            children: [],
            count: 2
          },
          {
            id: 569,
            title: 'ФСБУ Основные средства',
            url: '/rubricator/fsbu-osnovnye-sredstva/',
            children: [],
            count: 2
          },
          {
            id: 570,
            title: 'ФСБУ Капвложения',
            url: '/rubricator/fsbu-kapvlozheniya/',
            children: [],
            count: 1
          },
          {
            id: 571,
            title: 'ФСБУ Документооборот',
            url: '/rubricator/fsbu-dokumentooborot/',
            children: [],
            count: 1
          },
          {
            id: 572,
            title: 'ФСБУ Аренда',
            url: '/rubricator/fsbu-arenda/',
            children: [],
            count: 5
          },
          {
            id: 818,
            title: 'ФСБУ НМА',
            url: '/rubricator/fsbu_nma/',
            children: [],
            count: 1
          },
          {
            id: 835,
            title: 'ФСБУ Инвентаризация',
            url: '/rubricator/835/',
            children: [],
            count: 0
          },
          {
            id: 836,
            title: 'ФСБУ Бухгалтерская отчетность',
            url: '/rubricator/836/',
            children: [],
            count: 1
          }
        ],
        count: 76
      },
      {
        id: 826,
        title:
          'Учет, налоги, законодательство для ДНР, ЛНР, Запорожской и Херсонской областей',
        url: '/rubricator/826/',
        children: [],
        count: 4
      },
      {
        id: 841,
        title: 'Лизинг',
        url: '/rubricator/841/',
        children: [],
        count: 0
      }
    ],
    count: 27
  },
  {
    id: 101,
    title: 'Банки',
    url: '/rubricator/banki/',
    children: [
      {
        id: 70,
        title: 'Интернет-банкинг',
        url: '/rubricator/internet-banking/',
        children: [],
        count: 0
      },
      {
        id: 71,
        title: 'Платежные системы',
        url: '/rubricator/platezhnye-sistemy/',
        children: [
          {
            id: 451,
            title: 'Система быстрых платежей',
            url: '/rubricator/451/',
            children: [],
            count: 0
          },
          {
            id: 730,
            title: 'VISA',
            url: '/rubricator/visa/',
            children: [],
            count: 0
          },
          {
            id: 731,
            title: 'MasterCard',
            url: '/rubricator/mastercard/',
            children: [],
            count: 0
          },
          {
            id: 732,
            title: 'МИР',
            url: '/rubricator/mir/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 72,
        title: 'Кредитование',
        url: '/rubricator/kreditovanie/',
        children: [
          {
            id: 136,
            title: 'Ипотека',
            url: '/rubricator/ipotechnoe-kreditovanie/',
            children: [],
            count: 0
          },
          {
            id: 738,
            title: 'Потребительское кредитование',
            url: '/rubricator/potrebitelskoe-kreditovanie/',
            children: [],
            count: 0
          },
          {
            id: 739,
            title: 'Овердрафт',
            url: '/rubricator/overdraft/',
            children: [],
            count: 0
          },
          {
            id: 740,
            title: 'Ставки по кредитам',
            url: '/rubricator/stavki-po-kreditam/',
            children: [],
            count: 0
          }
        ],
        count: 2
      },
      {
        id: 133,
        title: 'Вклады',
        url: '/rubricator/vklady/',
        children: [
          {
            id: 746,
            title: 'Накопительный счет',
            url: '/rubricator/nakopitelnyj-schet/',
            children: [],
            count: 0
          },
          {
            id: 747,
            title: 'Депозиты',
            url: '/rubricator/depozity/',
            children: [],
            count: 0
          },
          {
            id: 748,
            title: 'Ставки по вкладам',
            url: '/rubricator/stavki-po-vkladam/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 228,
        title: 'Электронные деньги',
        url: '/rubricator/elektronnye-dengi-raschety-elektronnymi-dengami/',
        children: [
          {
            id: 749,
            title: 'Электронный кошелек',
            url: '/rubricator/ehlektronnyj-koshelek/',
            children: [],
            count: 0
          },
          {
            id: 750,
            title: 'Цифровой рубль',
            url: '/rubricator/cifrovoj-rubl/',
            children: [],
            count: 1
          },
          {
            id: 751,
            title: 'Платежные агрегаторы',
            url: '/rubricator/platezhnye-agregatory/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 288,
        title: 'Криптовалюта',
        url: '/rubricator/288/',
        children: [
          {
            id: 752,
            title: 'Майнинг',
            url: '/rubricator/majning/',
            children: [],
            count: 0
          },
          {
            id: 753,
            title: 'Биткоин',
            url: '/rubricator/bitkoin/',
            children: [],
            count: 0
          },
          {
            id: 754,
            title: 'Токен',
            url: '/rubricator/kriptovalyutnyj-token/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 446,
        title: 'Наличные деньги',
        url: '/rubricator/446/',
        children: [],
        count: 2
      },
      {
        id: 457,
        title: 'Банковские карты',
        url: '/rubricator/bankovskije-karti/',
        children: [
          {
            id: 755,
            title: 'Дебетовые карты',
            url: '/rubricator/debetovye-karty/',
            children: [],
            count: 0
          },
          {
            id: 756,
            title: 'Кредитные карты',
            url: '/rubricator/kreditnye-karty/',
            children: [],
            count: 0
          },
          {
            id: 757,
            title: 'Корпоративные карты',
            url: '/rubricator/korporativnye-karty/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 458,
        title: 'Банковские приложения',
        url: '/rubricator/bankovskije-prilojeniya/',
        children: [],
        count: 0
      },
      {
        id: 482,
        title: 'Факторинг',
        url: '/rubricator/factoring/',
        children: [],
        count: 0
      },
      {
        id: 727,
        title: 'РКО',
        url: '/rubricator/rko/',
        children: [
          {
            id: 728,
            title: 'Расчетный счет',
            url: '/rubricator/raschetnyj-schet/',
            children: [],
            count: 0
          },
          {
            id: 729,
            title: 'Банковская комиссия',
            url: '/rubricator/rko/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 734,
        title: 'Эквайринг',
        url: '/rubricator/ehkvajring/',
        children: [
          {
            id: 735,
            title: 'Торговый эквайринг',
            url: '/rubricator/torgovyj-ehkvajring/',
            children: [],
            count: 0
          },
          {
            id: 736,
            title: 'Интернет-эквайринг',
            url: '/rubricator/internet-ehkvajring/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 741,
        title: 'Валюта',
        url: '/rubricator/valyuta/',
        children: [
          {
            id: 93,
            title: 'Валютные операции',
            url: '/rubricator/valjutnye-operatsii/',
            children: [],
            count: 4
          },
          {
            id: 138,
            title: 'Валютный рынок',
            url: '/rubricator/valjutnyj-rynok/',
            children: [],
            count: 0
          },
          {
            id: 743,
            title: 'Валютный счет',
            url: '/rubricator/valyutnyj-schet/',
            children: [],
            count: 0
          },
          {
            id: 744,
            title: 'Валютный контроль',
            url: '/rubricator/valyutnyj-kontrol/',
            children: [],
            count: 0
          },
          {
            id: 745,
            title: 'Курсы валют',
            url: '/rubricator/kursy-valyut/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 814,
        title: 'Банковские гарантии',
        url: '/rubricator/bankovskie_garantii/',
        children: [],
        count: 0
      },
      {
        id: 815,
        title: 'Аккредитивы',
        url: '/rubricator/akkreditivy/',
        children: [],
        count: 0
      }
    ],
    count: 1
  },
  {
    id: 102,
    title: 'Автоматизация учета',
    url: '/rubricator/avtomatizatsija-ucheta/',
    children: [
      {
        id: 43,
        title: '1С',
        url: '/rubricator/1c/',
        children: [],
        count: 23
      },
      {
        id: 73,
        title: 'Бухгалтерские программы',
        url: '/rubricator/buhgalterskie-programmy/',
        children: [],
        count: 1
      },
      {
        id: 230,
        title: 'ЭДО',
        url: '/rubricator/elektronnyj-dokumentooborot-elektronnaja-otchetnost/',
        children: [
          {
            id: 723,
            title: 'Переход на ЭДО',
            url: '/rubricator/perekhod-na-ehdo/',
            children: [],
            count: 0
          },
          {
            id: 724,
            title: 'Роуминг ЭДО',
            url: '/rubricator/rouming-ehdo/',
            children: [],
            count: 0
          },
          {
            id: 725,
            title: 'Операторы ЭДО',
            url: '/rubricator/operatory-ehdo/',
            children: [],
            count: 0
          }
        ],
        count: 18
      },
      {
        id: 234,
        title: 'Онлайн-бухгалтерии',
        url: '/rubricator/onlajn-buhgalterii/',
        children: [],
        count: 0
      },
      {
        id: 275,
        title: 'Электронная отчетность',
        url: '/rubricator/elektronnaja-otchetnost/',
        children: [],
        count: 0
      },
      {
        id: 460,
        title: 'Автоматизация финансового планирования',
        url: '/rubricator/avtomatizatsija-finansovogo-planirovaniya/',
        children: [],
        count: 0
      },
      {
        id: 478,
        title: 'CRM',
        url: '/rubricator/crm/',
        children: [],
        count: 0
      },
      {
        id: 726,
        title: 'Электронные подписи',
        url: '/rubricator/ehlektronnye-podpisi/',
        children: [],
        count: 0
      },
      {
        id: 840,
        title: 'Машиночитаемые доверенности (МЧД)',
        url: '/rubricator/840/',
        children: [],
        count: 0
      }
    ],
    count: 2
  },
  {
    id: 103,
    title: 'Право',
    url: '/rubricator/pravo/',
    children: [
      {
        id: 15,
        title: 'УК РФ',
        url: '/rubricator/uk-rf/',
        children: [],
        count: 8
      },
      {
        id: 17,
        title: 'Трудовое право',
        url: '/rubricator/trudovoe-pravo/',
        children: [],
        count: 1
      },
      {
        id: 20,
        title: 'НК РФ',
        url: '/rubricator/nk-rf/',
        children: [
          {
            id: 199,
            title: 'Налоговые споры',
            url: '/rubricator/sudebnaja-praktika-po-nalogovym-sporam/',
            children: [],
            count: 0
          },
          {
            id: 760,
            title: 'Поправки в НК РФ',
            url: '/rubricator/popravki-v-nk-rf/',
            children: [],
            count: 1
          },
          {
            id: 761,
            title: 'Судебная практика по налоговым спорам',
            url: '/rubricator/sudebnaya-praktika-po-nalogovym-sporam/',
            children: [],
            count: 0
          }
        ],
        count: 2
      },
      {
        id: 108,
        title: 'КоАП РФ',
        url: '/rubricator/koap-rf/',
        children: [
          {
            id: 762,
            title: 'Штрафы за трудовые нарушения',
            url: '/rubricator/shtrafy-za-trudovye-narusheniya/',
            children: [],
            count: 0
          },
          {
            id: 763,
            title: 'Штрафы за налоговые нарушения',
            url: '/rubricator/shtrafy-za-nalogovye-narusheniya/',
            children: [],
            count: 0
          },
          {
            id: 764,
            title: 'Штрафы за валютные нарушения',
            url: '/rubricator/shtrafy-za-valyutnye-narusheniya/',
            children: [],
            count: 0
          },
          {
            id: 765,
            title: 'Штрафы за ККТ и кассу',
            url: '/rubricator/shtrafy-za-kkt-i-kassu/',
            children: [],
            count: 0
          },
          {
            id: 766,
            title: 'Штрафы ГАИ',
            url: '/rubricator/shtrafy-gibdd/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 130,
        title: 'ГК РФ',
        url: '/rubricator/gk-rf/',
        children: [
          {
            id: 479,
            title: 'Авторское право',
            url: '/rubricator/avtorskoe-pravo-gk-rf/',
            children: [],
            count: 1
          },
          {
            id: 480,
            title: 'Товарный знак',
            url: '/rubricator/480/',
            children: [],
            count: 0
          },
          {
            id: 767,
            title: 'Поставка',
            url: '/rubricator/postavka-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 768,
            title: 'Подряд',
            url: '/rubricator/podryad-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 769,
            title: 'Аренда',
            url: '/rubricator/arenda-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 770,
            title: 'Оказание услуг',
            url: '/rubricator/okazanie-uslug-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 771,
            title: 'Цессия',
            url: '/rubricator/cessiya-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 772,
            title: 'Дарение',
            url: '/rubricator/darenie-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 773,
            title: 'Перевозка',
            url: '/rubricator/perevozka-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 774,
            title: 'Заем',
            url: '/rubricator/zaem-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 775,
            title: 'Поручение',
            url: '/rubricator/poruchenie-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 776,
            title: 'Комиссия',
            url: '/rubricator/komissiya-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 777,
            title: 'Агентирование',
            url: '/rubricator/agentirovanie-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 778,
            title: 'Простое товарищество',
            url: '/rubricator/prostoe-tovarishchestvo-gk-rf/',
            children: [],
            count: 0
          },
          {
            id: 779,
            title: 'Возмещение вреда',
            url: '/rubricator/vozmeshchenie-vreda-gk-rf/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 155,
        title: 'Полиция',
        url: '/rubricator/policiya/',
        children: [],
        count: 5
      },
      {
        id: 157,
        title: 'Законопроекты',
        url: '/rubricator/zakonoproekti/',
        children: [],
        count: 0
      },
      {
        id: 164,
        title: 'Коллекторы',
        url: '/rubricator/kollektori/',
        children: [],
        count: 0
      },
      {
        id: 167,
        title: 'Семейный кодекс',
        url: '/rubricator/semejij-kodeks/',
        children: [
          {
            id: 780,
            title: 'Брачный договор',
            url: '/rubricator/brachnyj-dogovor/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 168,
        title: 'Жилищное законодательство',
        url: '/rubricator/zhilischnoe-zakonodatelstvo/',
        children: [],
        count: 0
      },
      {
        id: 169,
        title: 'Земельное законодательство',
        url: '/rubricator/zemelnoe-zakonodatelstvo/',
        children: [
          {
            id: 781,
            title: 'Собственность на землю',
            url: '/rubricator/sobstvennost-na-zemlyu/',
            children: [],
            count: 0
          },
          {
            id: 782,
            title: 'Вид разрешенного использования земли',
            url: '/rubricator/vid-razreshennogo-ispolzovaniya-zemli/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 173,
        title: 'Экологическое законодательство',
        url: '/rubricator/ekologicheskoe-zakonodatelstvo/',
        children: [],
        count: 0
      },
      {
        id: 174,
        title: 'Исполнительное производство',
        url: '/rubricator/ispolnitelnoe-proizvodstvo/',
        children: [],
        count: 0
      },
      {
        id: 175,
        title: 'Таможенное право',
        url: '/rubricator/tamozhennoe-pravo/',
        children: [],
        count: 0
      },
      {
        id: 196,
        title: 'Нотариат',
        url: '/rubricator/notariat/',
        children: [],
        count: 0
      },
      {
        id: 202,
        title: 'Прокуратура',
        url: '/rubricator/prokuratura/',
        children: [],
        count: 0
      },
      {
        id: 207,
        title: 'Права потребителей',
        url: '/rubricator/prava-potrebitelej/',
        children: [],
        count: 0
      },
      {
        id: 212,
        title: 'Банкротство',
        url: '/rubricator/bankrotstvo/',
        children: [
          {
            id: 438,
            title: 'Субсидиарная ответственность',
            url: '/rubricator/438/',
            children: [],
            count: 9
          },
          {
            id: 783,
            title: 'Банкротство юридических лиц',
            url: '/rubricator/bankrotstvo-yuridicheskih-lic/',
            children: [],
            count: 0
          },
          {
            id: 784,
            title: 'Банкротство физических лиц',
            url: '/rubricator/bankrotstvo-fizicheskih-lic/',
            children: [],
            count: 0
          }
        ],
        count: 7
      },
      {
        id: 222,
        title: 'Экономические преступления',
        url: '/rubricator/ekonomicheskie-prestuplenija/',
        children: [
          {
            id: 477,
            title: 'Мошенничество',
            url: '/rubricator/477/',
            children: [],
            count: 0
          },
          {
            id: 786,
            title: 'Уклонение от уплаты налогов',
            url: '/rubricator/uklonenie-ot-uplaty-nalogov/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 225,
        title: 'Госзакупки',
        url: '/rubricator/goszakupki/',
        children: [
          {
            id: 787,
            title: '44-ФЗ',
            url: '/rubricator/44-fz/',
            children: [],
            count: 0
          },
          {
            id: 788,
            title: '223-ФЗ',
            url: '/rubricator/223-fz/',
            children: [],
            count: 0
          },
          {
            id: 789,
            title: 'Гособоронзаказ',
            url: '/rubricator/gosoboronzakaz/',
            children: [],
            count: 2
          }
        ],
        count: 7
      },
      {
        id: 262,
        title: 'Антимонопольное право',
        url: '/rubricator/antimonopolnoe-pravo/',
        children: [
          {
            id: 790,
            title: 'Проверки ФАС',
            url: '/rubricator/proverki-fas/',
            children: [],
            count: 0
          },
          {
            id: 791,
            title: 'Картельный сговор',
            url: '/rubricator/kartelnyj-sgovor/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 276,
        title: 'Конституционное право',
        url: '/rubricator/konstitutsionnoe-pravo/',
        children: [],
        count: 0
      },
      {
        id: 287,
        title: 'Защита персональных данных',
        url: '/rubricator/zashita-personalnih-dannih/',
        children: [
          {
            id: 792,
            title: 'Согласие на обработку персональных данных',
            url: '/rubricator/soglasie-na-obrabotku-personalnyh-dannyh/',
            children: [],
            count: 0
          },
          {
            id: 793,
            title: '152-ФЗ',
            url: '/rubricator/152-fz/',
            children: [],
            count: 0
          },
          {
            id: 794,
            title: 'Штрафы за персональные данные',
            url: '/rubricator/shtrafy-za-personalnye-dannye/',
            children: [],
            count: 0
          }
        ],
        count: 8
      },
      {
        id: 461,
        title: 'Адвокат',
        url: '/rubricator/advokat/',
        children: [],
        count: 0
      },
      {
        id: 472,
        title: 'Арендные отношения',
        url: '/rubricator/472/',
        children: [],
        count: 0
      },
      {
        id: 795,
        title: 'Интеллектуальные права',
        url: '/rubricator/intellektualnye-prava/',
        children: [
          {
            id: 475,
            title: 'Авторское право',
            url: '/rubricator/avtorskoe-pravo/',
            children: [],
            count: 2
          },
          {
            id: 796,
            title: 'Товарные знаки',
            url: '/rubricator/tovarnye-znaki/',
            children: [],
            count: 0
          },
          {
            id: 797,
            title: 'Патенты на интеллектуальную собственность',
            url: '/rubricator/patenty-na-intellektualnuyu-sobstvennost/',
            children: [],
            count: 0
          },
          {
            id: 798,
            title: 'Смежные права',
            url: '/rubricator/smezhnye-prava/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 823,
        title: 'Экспертиза',
        url: '/rubricator/expertiza/',
        children: [],
        count: 0
      },
      {
        id: 824,
        title: 'Лицензирование',
        url: '/rubricator/licensing/',
        children: [],
        count: 1
      },
      {
        id: 845,
        title: 'Советы юристов',
        url: '/rubricator/845/',
        children: [],
        count: 0
      }
    ],
    count: 15
  },
  {
    id: 105,
    title: 'Налоги, взносы, пошлины',
    url: '/rubricator/nalogi-vznosy-poshlini/',
    children: [
      {
        id: 3,
        title: 'Налог на прибыль',
        url: '/rubricator/nalog-na-pribyl/',
        children: [
          {
            id: 573,
            title: 'Необлагаемые налогом доходы',
            url: '/rubricator/dohody-ne-oblagaemye-nalogom-na-pribyl/',
            children: [],
            count: 0
          },
          {
            id: 574,
            title: 'Расходы по налогу на прибыль',
            url: '/rubricator/raskhody-po-nalogu-na-pribyl/',
            children: [],
            count: 0
          },
          {
            id: 575,
            title: 'Налоговые льготы по налогу на прибыль',
            url: '/rubricator/lgoty-po-nalogu-na-pribyl/',
            children: [],
            count: 0
          },
          {
            id: 576,
            title: 'Налоговый учет',
            url: '/rubricator/nalogovyj-uchet/',
            children: [],
            count: 1
          },
          {
            id: 577,
            title: 'Налоговые агенты по налогу на прибыль',
            url: '/rubricator/nalogovye-agenty-po-nalogu-na-pribyl/',
            children: [],
            count: 0
          }
        ],
        count: 6
      },
      {
        id: 4,
        title: 'НДС',
        url: '/rubricator/nds/',
        children: [
          {
            id: 161,
            title: 'Счета-фактуры',
            url: '/rubricator/scheta-fakturi/',
            children: [],
            count: 0
          },
          {
            id: 162,
            title: 'Книга покупок',
            url: '/rubricator/kniga-pokupok/',
            children: [],
            count: 0
          },
          {
            id: 279,
            title: 'НДС по электронным услугам иностранных организаций',
            url: '/rubricator/nds-po-elektronnym-uslugam-inostrannyh-organizatsij/',
            children: [],
            count: 0
          },
          {
            id: 280,
            title: 'НДС: экспорт и импорт товаров и услуг',
            url: '/rubricator/nds-eksport-i-import-tovarov-i-uslug/',
            children: [],
            count: 0
          },
          {
            id: 289,
            title: 'Налоговый агент по НДС',
            url: '/rubricator/289/',
            children: [],
            count: 0
          },
          {
            id: 578,
            title: 'Книга продаж',
            url: '/rubricator/kniga-prodazh/',
            children: [],
            count: 0
          },
          {
            id: 579,
            title: 'Налоговые льготы по НДС',
            url: '/rubricator/nalogovye-lgoty-po-nds/',
            children: [],
            count: 0
          },
          {
            id: 580,
            title: 'АСК НДС-2',
            url: '/rubricator/ask-nds-2/',
            children: [],
            count: 0
          },
          {
            id: 844,
            title: 'НДС на УСН',
            url: '/rubricator/844/',
            children: [],
            count: 0
          }
        ],
        count: 23
      },
      {
        id: 7,
        title: 'Налог на имущество',
        url: '/rubricator/nalog-na-imuschestvo/',
        children: [
          {
            id: 273,
            title: 'Налог на имущество организаций',
            url: '/rubricator/nalog-na-imuschestvo-organizatsij/',
            children: [],
            count: 0
          },
          {
            id: 274,
            title: 'Налог на имущество физических лиц',
            url: '/rubricator/nalog-na-imuschestvo-fizicheskih-lits/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 27,
        title: 'НДФЛ',
        url: '/rubricator/ndfl/',
        children: [
          {
            id: 241,
            title: 'Имущественный вычет',
            url: '/rubricator/imuschestvenniy-vichet/',
            children: [],
            count: 0
          },
          {
            id: 242,
            title: 'Стандартный вычет',
            url: '/rubricator/standartniy-vychet/',
            children: [],
            count: 0
          },
          {
            id: 256,
            title: 'Патенты для иностранцев',
            url: '/rubricator/patenty-dlja-inostrancev/',
            children: [],
            count: 0
          },
          {
            id: 267,
            title: 'Социальный вычет',
            url: '/rubricator/sotsialniy-vychet/',
            children: [],
            count: 0
          },
          {
            id: 581,
            title: 'Необлагаемые НДФЛ доходы',
            url: '/rubricator/neoblagaemye-ndfl-dohody/',
            children: [],
            count: 0
          },
          {
            id: 582,
            title: 'Налоговый агент по НДФЛ',
            url: '/rubricator/nalogovyj-agent-po-ndfl/',
            children: [],
            count: 0
          },
          {
            id: 583,
            title: 'Инвестиционный вычет',
            url: '/rubricator/investicionnyj-vychet-po-ndfl/',
            children: [],
            count: 0
          }
        ],
        count: 14
      },
      {
        id: 30,
        title: 'Транспортный налог',
        url: '/rubricator/transportnyj-nalog/',
        children: [
          {
            id: 584,
            title: 'Транспортный налог у организаций',
            url: '/rubricator/transportnyj-nalog-u-organizacij/',
            children: [],
            count: 0
          },
          {
            id: 585,
            title: 'Транспортный налог у физлиц',
            url: '/rubricator/transportnyj-nalog-u-fizlic/',
            children: [],
            count: 0
          },
          {
            id: 586,
            title: 'Налоговые льготы по транспортному налогу',
            url: '/rubricator/nalogovye-lgoty-po-transportnomu-nalogu/',
            children: [],
            count: 0
          },
          {
            id: 587,
            title: 'Налог на дорогие автомобили',
            url: '/rubricator/transportnyj-nalog-na-dorogie-avtomobili/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 79,
        title: 'Акцизы',
        url: '/rubricator/aktsizy/',
        children: [
          {
            id: 588,
            title: 'Подакцизные товары',
            url: '/rubricator/podakciznye-tovary/',
            children: [],
            count: 0
          },
          {
            id: 589,
            title: 'Акцизы при импорте и экспорте',
            url: '/rubricator/akcizy-pri-importe-i-ehksporte/',
            children: [],
            count: 0
          },
          {
            id: 590,
            title: 'Расчет акцизов',
            url: '/rubricator/raschet-akcizov/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 82,
        title: 'Оптимизация налогообложения',
        url: '/rubricator/optimizatsija-nalogooblozhenija/',
        children: [
          {
            id: 439,
            title: 'Дробление бизнеса',
            url: '/rubricator/439/',
            children: [],
            count: 15
          },
          {
            id: 469,
            title: 'Налоговые схемы',
            url: '/rubricator/nalogovije-shemi/',
            children: [],
            count: 5
          },
          {
            id: 470,
            title: 'Недействительная сделка',
            url: '/rubricator/nedejstvitelnaya-sdelka/',
            children: [],
            count: 0
          },
          {
            id: 591,
            title: 'Налоговое планирование',
            url: '/rubricator/nalogovoe-planirovanie/',
            children: [],
            count: 0
          },
          {
            id: 592,
            title: 'Налоговая оговорка',
            url: '/rubricator/nalogovaya-ogovorka/',
            children: [],
            count: 0
          },
          {
            id: 593,
            title: 'Однодневки',
            url: '/rubricator/odnodnevki/',
            children: [],
            count: 0
          }
        ],
        count: 25
      },
      {
        id: 83,
        title: 'Новости ФНС',
        url: '/rubricator/fns-nalogovaja-inspektsija/',
        children: [],
        count: 1
      },
      {
        id: 97,
        title: 'Налоговые штрафы',
        url: '/rubricator/nalogovye-shtrafi/',
        children: [],
        count: 2
      },
      {
        id: 107,
        title: 'Земельный налог',
        url: '/rubricator/zemelnyj-nalog/',
        children: [
          {
            id: 594,
            title: 'Земельный налог у организаций',
            url: '/rubricator/zemelnyj-nalog-u-organizacij/',
            children: [],
            count: 0
          },
          {
            id: 595,
            title: 'Земельный налог у физических лиц',
            url: '/rubricator/zemelnyj-nalog-u-fizicheskih-lic/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 110,
        title: 'НДПИ',
        url: '/rubricator/ndpi/',
        children: [],
        count: 0
      },
      {
        id: 115,
        title: 'Водный налог',
        url: '/rubricator/vodnyj-nalog/',
        children: [
          {
            id: 597,
            title: 'Объект налогообложения водным налогом',
            url: '/rubricator/obekt-nalogooblozheniya-vodnym-nalogom/',
            children: [],
            count: 0
          },
          {
            id: 598,
            title: 'Расчет водного налога',
            url: '/rubricator/raschet-vodnogo-naloga/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 118,
        title: 'Офшоры',
        url: '/rubricator/ofshori/',
        children: [
          {
            id: 600,
            title: 'Выбор офшорной юрисдикции',
            url: '/rubricator/vybor-ofshornoj-yurisdikcii/',
            children: [],
            count: 0
          },
          {
            id: 601,
            title: 'Русские офшоры (САР)',
            url: '/rubricator/russkie-ofshory-sar/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 119,
        title: 'Госпошлина',
        url: '/rubricator/gosposhlina/',
        children: [
          {
            id: 602,
            title: 'Уплата госпошлины',
            url: '/rubricator/uplata-gosposhliny/',
            children: [],
            count: 0
          },
          {
            id: 603,
            title: 'Размер госпошлины',
            url: '/rubricator/razmer-gosposhliny/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 213,
        title: 'Страховые взносы',
        url: '/rubricator/strahovye-vznosy/',
        children: [
          {
            id: 214,
            title: 'Взносы в ФСС',
            url: '/rubricator/vznosy-fss/',
            children: [],
            count: 0
          },
          {
            id: 215,
            title: 'Взносы в ПФР',
            url: '/rubricator/vznosy-pfr/',
            children: [],
            count: 0
          },
          {
            id: 217,
            title: 'Взносы в ФОМС',
            url: '/rubricator/vznosy-foms/',
            children: [],
            count: 0
          },
          {
            id: 328,
            title: 'Взносы на травматизм',
            url: '/rubricator/vznosi-na-travmatizm/',
            children: [],
            count: 0
          },
          {
            id: 604,
            title: 'Пониженный тариф страховых взносов',
            url: '/rubricator/ponizhennyj-tarif-strahovyh-vznosov/',
            children: [],
            count: 0
          },
          {
            id: 605,
            title: 'Льготы по страховым взносам',
            url: '/rubricator/lgoty-po-strahovym-vznosam/',
            children: [],
            count: 0
          },
          {
            id: 819,
            title: 'Взносы в СФР',
            url: '/rubricator/vznosy_v_sfr/',
            children: [],
            count: 0
          }
        ],
        count: 7
      },
      {
        id: 233,
        title: 'Контролируемые сделки',
        url: '/rubricator/kontroliruemye-sdelki/',
        children: [
          {
            id: 606,
            title: 'Критерии контролируемых сделок',
            url: '/rubricator/kriterii-kontroliruemyh-sdelok/',
            children: [],
            count: 0
          },
          {
            id: 607,
            title: 'Уведомления о контролируемых сделках',
            url: '/rubricator/uvedomleniya-o-kontroliruemyh-sdelkah/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 257,
        title: 'Торговый сбор',
        url: '/rubricator/torgovyj-sbor/',
        children: [],
        count: 1
      },
      {
        id: 268,
        title: 'Система Платон',
        url: '/rubricator/plata-s-bolshegruznyh-avtomobilej-sistema-platon/',
        children: [],
        count: 0
      },
      {
        id: 270,
        title: 'Проверка контрагентов',
        url: '/rubricator/proverka-kontragentov/',
        children: [
          {
            id: 608,
            title: 'Сервисы проверки контрагентов',
            url: '/rubricator/servisy-proverki-kontragentov/',
            children: [],
            count: 0
          },
          {
            id: 609,
            title: 'Регламент проверки контрагентов',
            url: '/rubricator/reglament-proverki-kontragentov/',
            children: [],
            count: 0
          },
          {
            id: 610,
            title: 'Должная осмотрительность',
            url: '/rubricator/dolzhnaya-osmotritelnost/',
            children: [],
            count: 0
          }
        ],
        count: 4
      },
      {
        id: 281,
        title: 'Курортный сбор',
        url: '/rubricator/kurortnyj-sbor/',
        children: [],
        count: 0
      },
      {
        id: 285,
        title: 'Экологические платежи',
        url: '/rubricator/ekologicheskie-platezhi/',
        children: [
          {
            id: 255,
            title: 'Утилизационный сбор',
            url: '/rubricator/utilizatsionnyj-sbor/',
            children: [],
            count: 0
          },
          {
            id: 611,
            title: 'Экологический сбор',
            url: '/rubricator/ehkologicheskij-sbor/',
            children: [],
            count: 0
          },
          {
            id: 612,
            title: 'Плата за негативное воздействие на окружающую среду',
            url: '/rubricator/plata-za-negativnoe-vozdejstvie-na-okruzhayushchuyu-sredu/',
            children: [],
            count: 0
          },
          {
            id: 613,
            title: 'Декларация о количестве выпущенных в обращение товаров',
            url: '/rubricator/deklaraciya-o-kolichestve-vypushchennyh-v-obrashchenie-tovarov/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 297,
        title: 'Спецрежимы',
        url: '/rubricator/specrejimi/',
        children: [
          {
            id: 29,
            title: 'УСН',
            url: '/rubricator/usn/',
            children: [
              {
                id: 640,
                title: 'Лимиты по УСН',
                url: '/rubricator/limity-po-usn/',
                children: [],
                count: 0
              },
              {
                id: 641,
                title: 'Налоговый учет при УСН',
                url: '/rubricator/nalogovyj-uchet-pri-usn/',
                children: [],
                count: 1
              },
              {
                id: 643,
                title: 'Пониженные ставки налога по УСН',
                url: '/rubricator/ponizhennye-stavki-naloga-po-usn/',
                children: [],
                count: 0
              },
              {
                id: 644,
                title: 'Налоговые каникулы при УСН',
                url: '/rubricator/nalogovye-kanikuly-pri-usn/',
                children: [],
                count: 0
              }
            ],
            count: 11
          },
          {
            id: 117,
            title: 'ЕСХН',
            url: '/rubricator/eshn/',
            children: [
              {
                id: 645,
                title: 'Налоговый учет при ЕСХН',
                url: '/rubricator/nalogovyj-uchet-pri-eskhn/',
                children: [],
                count: 0
              },
              {
                id: 646,
                title: 'Освобождение от НДС при ЕСХН',
                url: '/rubricator/osvobozhdenie-ot-nds-pri-eskhn/',
                children: [],
                count: 0
              }
            ],
            count: 0
          },
          {
            id: 235,
            title: 'ПСН',
            url: '/rubricator/psn/',
            children: [
              {
                id: 647,
                title: 'Получение патента',
                url: '/rubricator/poluchenie-patenta/',
                children: [],
                count: 1
              },
              {
                id: 648,
                title: 'Страховые взносы и ПСН',
                url: '/rubricator/strahovye-vznosy-i-psn/',
                children: [],
                count: 0
              },
              {
                id: 649,
                title: 'Виды деятельности, попадающие под патент',
                url: '/rubricator/vidy-deyatelnosti-popadayushchie-pod-patent/',
                children: [],
                count: 0
              },
              {
                id: 650,
                title: 'Налоговые каникулы при ПСН',
                url: '/rubricator/nalogovye-kanikuly-pri-psn/',
                children: [],
                count: 0
              }
            ],
            count: 7
          },
          {
            id: 483,
            title: 'АУСН',
            url: '/rubricator/483/',
            children: [],
            count: 1
          }
        ],
        count: 2
      },
      {
        id: 308,
        title: 'Выбор системы налогообложения',
        url: '/rubricator/308/',
        children: [],
        count: 1
      },
      {
        id: 309,
        title: 'КИК',
        url: '/rubricator/kik/',
        children: [
          {
            id: 614,
            title: 'Уведомления о КИК',
            url: '/rubricator/uvedomleniya-o-kik/',
            children: [],
            count: 0
          },
          {
            id: 615,
            title: 'Налоги КИК',
            url: '/rubricator/nalogi-kik/',
            children: [],
            count: 0
          },
          {
            id: 616,
            title: 'Амнистия капиталов',
            url: '/rubricator/amnistiya-kapitalov/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 327,
        title: 'Отмененные налоги',
        url: '/rubricator/otmenennie-nalogi/',
        children: [
          {
            id: 6,
            title: 'ЕСН',
            url: '/rubricator/esn/',
            children: [],
            count: 0
          },
          {
            id: 8,
            title: 'ЕНВД',
            url: '/rubricator/envd/',
            children: [],
            count: 0
          },
          {
            id: 23,
            title: 'Налог с продаж',
            url: '/rubricator/nalog-s-prodazh/',
            children: [],
            count: 0
          },
          {
            id: 62,
            title: 'Налог на рекламу',
            url: '/rubricator/nalog-na-reklamu/',
            children: [],
            count: 0
          },
          {
            id: 123,
            title: 'Налог на наследование',
            url: '/rubricator/nalog-na-nasledovanie/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 331,
        title: 'Самозанятые',
        url: '/rubricator/samozanyatie/',
        children: [
          {
            id: 651,
            title: 'Регистрация плательщика НПД',
            url: '/rubricator/registraciya-platelshchika-npd/',
            children: [],
            count: 0
          },
          {
            id: 652,
            title: 'Приложение Мой налог',
            url: '/rubricator/prilozhenie-moj-nalog/',
            children: [],
            count: 0
          },
          {
            id: 653,
            title: 'Виды деятельности для НПД',
            url: '/rubricator/vidy-deyatelnosti-dlya-npd/',
            children: [],
            count: 0
          }
        ],
        count: 23
      },
      {
        id: 445,
        title: 'Налоговые изменения 2021',
        url: '/rubricator/445/',
        children: [],
        count: 1
      },
      {
        id: 596,
        title: 'НДД',
        url: '/rubricator/ndd/',
        children: [],
        count: 0
      },
      {
        id: 599,
        title:
          'Особые экономические зоны (ОЭЗ),  территории опережающего развития (ТОР), свободные экономические зоны (СЭЗ)',
        url: '/rubricator/osobye-ehkonomicheskie-zony-oehz/',
        children: [],
        count: 0
      },
      {
        id: 617,
        title: 'Налоговые изменения 2022',
        url: '/rubricator/nalogovye-izmeneniya-2022/',
        children: [],
        count: 0
      },
      {
        id: 639,
        title: 'ЕНП (единый налоговый платеж)',
        url: '/rubricator/enp/',
        children: [
          {
            id: 830,
            title: 'Сальдо ЕНС',
            url: '/rubricator/saldo-ens/',
            children: [],
            count: 0
          },
          {
            id: 831,
            title: 'Уведомление по ЕНП',
            url: '/rubricator/uvedomlenie-po-enp/',
            children: [],
            count: 0
          }
        ],
        count: 13
      },
      {
        id: 820,
        title: 'Налоговые изменения 2023',
        url: '/rubricator/nalogovye-izmeneniya-2023/',
        children: [],
        count: 10
      },
      {
        id: 829,
        title: 'Налог на сверхприбыль',
        url: '/rubricator/nalog-na-sverkhpribyl/',
        children: [],
        count: 0
      },
      {
        id: 833,
        title: 'Налоговые изменения 2024',
        url: '/rubricator/833/',
        children: [],
        count: 0
      },
      {
        id: 837,
        title: 'Налоговые изменения 2025',
        url: '/rubricator/837/',
        children: [],
        count: 1
      },
      {
        id: 838,
        title: 'Туристический налог',
        url: '/rubricator/838/',
        children: [],
        count: 0
      }
    ],
    count: 26
  },
  {
    id: 106,
    title: 'Ведение бизнеса',
    url: '/rubricator/vedenie-biznesa/',
    children: [
      {
        id: 57,
        title: 'Менеджмент',
        url: '/rubricator/menedzhment/',
        children: [
          {
            id: 685,
            title: 'Бизнес-планирование',
            url: '/rubricator/biznes-planirovanie/',
            children: [],
            count: 0
          },
          {
            id: 686,
            title: 'Тайм-менеджмент',
            url: '/rubricator/tajm-menedzhment/',
            children: [],
            count: 0
          },
          {
            id: 687,
            title: 'Управление производством',
            url: '/rubricator/upravlenie-proizvodstvom/',
            children: [],
            count: 0
          },
          {
            id: 688,
            title: 'Краудфандинг',
            url: '/rubricator/kraudfanding/',
            children: [],
            count: 0
          },
          {
            id: 689,
            title: 'Кассовые разрывы',
            url: '/rubricator/kassovye-razryvy/',
            children: [],
            count: 0
          }
        ],
        count: 2
      },
      {
        id: 59,
        title: 'Маркетинг',
        url: '/rubricator/marketing/',
        children: [
          {
            id: 92,
            title: 'Реклама',
            url: '/rubricator/reklama/',
            children: [],
            count: 0
          },
          {
            id: 691,
            title: 'Маркетплейсы',
            url: '/rubricator/marketplejsy/',
            children: [],
            count: 18
          },
          {
            id: 692,
            title: 'SMM',
            url: '/rubricator/smm/',
            children: [],
            count: 0
          },
          {
            id: 693,
            title: 'Личный бренд',
            url: '/rubricator/lichnyj-brend/',
            children: [],
            count: 0
          }
        ],
        count: 6
      },
      {
        id: 60,
        title: 'Управление финансами',
        url: '/rubricator/upravlenie-finansami/',
        children: [],
        count: 9
      },
      {
        id: 65,
        title: 'Регистрация и ликвидация бизнеса',
        url: '/rubricator/registraciya-i-likvidaciya-biznesa/',
        children: [
          {
            id: 467,
            title: 'Реорганизация компании',
            url: '/rubricator/reorganizaciya-kompanii/',
            children: [],
            count: 0
          },
          {
            id: 468,
            title: 'Ликвидация бизнеса',
            url: '/rubricator/likvidaciya-biznesa/',
            children: [],
            count: 0
          },
          {
            id: 695,
            title: 'Регистрация ООО',
            url: '/rubricator/registraciya-ooo/',
            children: [],
            count: 0
          },
          {
            id: 696,
            title: 'ЕГРЮЛ',
            url: '/rubricator/egryul/',
            children: [],
            count: 0
          },
          {
            id: 697,
            title: 'Внесение изменений в ЕГРЮЛ',
            url: '/rubricator/vnesenie-izmenenij-v-egryul/',
            children: [],
            count: 0
          },
          {
            id: 698,
            title: 'Уставные документы',
            url: '/rubricator/ustavnye-dokumenty/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 76,
        title: 'Страхование',
        url: '/rubricator/strahovanie/',
        children: [
          {
            id: 702,
            title: 'ОСАГО',
            url: '/rubricator/osago/',
            children: [],
            count: 0
          },
          {
            id: 703,
            title: 'КАСКО',
            url: '/rubricator/kasko/',
            children: [],
            count: 0
          },
          {
            id: 704,
            title: 'Страхование имущества',
            url: '/rubricator/strahovanie-imushchestva/',
            children: [],
            count: 0
          },
          {
            id: 705,
            title: 'Страхование жизни',
            url: '/rubricator/strahovanie-zhizni/',
            children: [],
            count: 0
          },
          {
            id: 706,
            title: 'Страхование ответственности',
            url: '/rubricator/strahovanie-otvetstvennosti/',
            children: [],
            count: 0
          },
          {
            id: 707,
            title: 'Страхование финансовых рисков',
            url: '/rubricator/strahovanie-finansovyh-riskov/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 85,
        title: 'Личные финансы',
        url: '/rubricator/lichnye-finansi/',
        children: [],
        count: 0
      },
      {
        id: 206,
        title: 'Малый и средний бизнес',
        url: '/rubricator/malyj-i-srednij-biznes/',
        children: [
          {
            id: 708,
            title: 'Реестр МСП',
            url: '/rubricator/reestr-msp/',
            children: [],
            count: 0
          },
          {
            id: 709,
            title: 'Льготы для МСП',
            url: '/rubricator/lgoty-dlya-msp/',
            children: [],
            count: 0
          },
          {
            id: 710,
            title: 'Проверки МСП',
            url: '/rubricator/proverki-msp/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 329,
        title: 'Индивидуальный предприниматель',
        url: '/rubricator/individualniy-predprinimatel/',
        children: [
          {
            id: 711,
            title: 'Регистрация ИП',
            url: '/rubricator/registraciya-ip/',
            children: [],
            count: 1
          },
          {
            id: 712,
            title: 'Прекращение деятельности ИП',
            url: '/rubricator/prekrashchenie-deyatelnosti-ip/',
            children: [],
            count: 0
          },
          {
            id: 713,
            title: 'Фиксированные взносы ИП',
            url: '/rubricator/fiksirovannye-vznosy-ip/',
            children: [],
            count: 0
          },
          {
            id: 714,
            title: 'Учет у ИП на ОСНО',
            url: '/rubricator/uchet-u-ip-na-osno/',
            children: [],
            count: 0
          }
        ],
        count: 7
      },
      {
        id: 462,
        title: 'Коды ОКВЭД',
        url: '/rubricator/kodi-okved/',
        children: [],
        count: 0
      },
      {
        id: 463,
        title: 'Субсидии для бизнеса',
        url: '/rubricator/subsidii-dlya-biznesa/',
        children: [],
        count: 2
      },
      {
        id: 466,
        title: 'КФХ',
        url: '/rubricator/kfh/',
        children: [],
        count: 0
      },
      {
        id: 699,
        title: 'Некоммерческие организации',
        url: '/rubricator/nekommercheskie-organizacii/',
        children: [
          {
            id: 112,
            title: 'Учет в некоммерческих организациях',
            url: '/rubricator/uchet-v-nekommercheskih-organizatsijah/',
            children: [],
            count: 0
          },
          {
            id: 700,
            title: 'Регистрация НКО',
            url: '/rubricator/registraciya-nko/',
            children: [],
            count: 0
          },
          {
            id: 701,
            title: 'Отчетность НКО',
            url: '/rubricator/otchetnost-nko/',
            children: [],
            count: 0
          }
        ],
        count: 1
      }
    ],
    count: 11
  },
  {
    id: 109,
    title: 'Бюджетный учет',
    url: '/rubricator/uchet-v-gossektore/',
    children: [],
    count: 1
  },
  {
    id: 120,
    title: 'Пенсии',
    url: '/rubricator/pensii/',
    children: [
      {
        id: 715,
        title: 'Государственные пенсии',
        url: '/rubricator/gosudarstvennye-pensii/',
        children: [],
        count: 0
      },
      {
        id: 716,
        title: 'Негосударственные пенсии',
        url: '/rubricator/negosudarstvennye-pensii/',
        children: [],
        count: 0
      },
      {
        id: 717,
        title: 'Индексация пенсий',
        url: '/rubricator/indeksaciya-pensij/',
        children: [],
        count: 0
      },
      {
        id: 718,
        title: 'Пенсионный возраст',
        url: '/rubricator/pensionnyj-vozrast/',
        children: [],
        count: 0
      },
      {
        id: 719,
        title: 'Расчет пенсии',
        url: '/rubricator/raschet-pensii/',
        children: [],
        count: 0
      },
      {
        id: 720,
        title: 'Выход на пенсию',
        url: '/rubricator/vyhod-na-pensiyu/',
        children: [],
        count: 0
      },
      {
        id: 721,
        title: 'Льготы для пенсионеров',
        url: '/rubricator/lgoty-dlya-pensionerov/',
        children: [],
        count: 0
      },
      {
        id: 722,
        title: 'Работающие пенсионеры',
        url: '/rubricator/rabotayushchie-pensionery/',
        children: [],
        count: 0
      }
    ],
    count: 0
  },
  {
    id: 126,
    title: 'Отраслевой учет',
    url: '/rubricator/otraslevoj-uchet-i-spetsrezhimy/',
    children: [
      {
        id: 66,
        title: 'Учет в торговле',
        url: '/rubricator/uchet-v-torgovle/',
        children: [],
        count: 0
      },
      {
        id: 67,
        title: 'Учет в строительстве',
        url: '/rubricator/uchet-v-stroitelstve/',
        children: [],
        count: 3
      },
      {
        id: 88,
        title: 'Игорный бизнес',
        url: '/rubricator/igornyj-biznes/',
        children: [],
        count: 0
      },
      {
        id: 127,
        title: 'Учет в СМИ',
        url: '/rubricator/uchet-v-smi/',
        children: [],
        count: 0
      },
      {
        id: 128,
        title: 'Учет в туризме',
        url: '/rubricator/uchet-v-turizme/',
        children: [],
        count: 0
      },
      {
        id: 129,
        title: 'Учет в медицине',
        url: '/rubricator/uchet-v-meditsine/',
        children: [],
        count: 0
      },
      {
        id: 153,
        title: 'Учет в организациях общепита',
        url: '/rubricator/uchet-v-organizatsijah-obschestvennogo-pitanija/',
        children: [],
        count: 1
      },
      {
        id: 269,
        title: 'ЕГАИС',
        url: '/rubricator/egais/',
        children: [],
        count: 1
      },
      {
        id: 283,
        title: 'Учет в ЖКХ',
        url: '/rubricator/uchet-v-zhkh/',
        children: [],
        count: 0
      },
      {
        id: 284,
        title: 'Маркировка товаров',
        url: '/rubricator/markirovka-tovarov/',
        children: [],
        count: 4
      },
      {
        id: 333,
        title: 'ФГИС Меркурий',
        url: '/rubricator/333/',
        children: [],
        count: 0
      },
      {
        id: 476,
        title: 'Прослеживаемость товаров',
        url: '/rubricator/476/',
        children: [
          {
            id: 758,
            title: 'Отчеты по прослеживаемости',
            url: '/rubricator/otchety-po-proslezhivaemosti-tovarov/',
            children: [],
            count: 0
          },
          {
            id: 759,
            title: 'Регистрационный номер партии товара (РНПТ)',
            url: '/rubricator/rnpt/',
            children: [],
            count: 0
          }
        ],
        count: 1
      },
      {
        id: 816,
        title: 'Маркировка рекламы',
        url: '/rubricator/markirovka-reklamy/',
        children: [],
        count: 2
      }
    ],
    count: 0
  },
  {
    id: 165,
    title: 'Инвестиции',
    url: '/rubricator/investitsii/',
    children: [
      {
        id: 75,
        title: 'Ценные бумаги',
        url: '/rubricator/tsennye-bumagi/',
        children: [],
        count: 0
      },
      {
        id: 810,
        title: 'Индивидуальный инвестиционный счет',
        url: '/rubricator/iis/',
        children: [],
        count: 0
      },
      {
        id: 811,
        title: 'Теханализ',
        url: '/rubricator/tekhanaliz/',
        children: [],
        count: 0
      },
      {
        id: 812,
        title: 'Фьючерсы',
        url: '/rubricator/fyuchersy/',
        children: [],
        count: 0
      },
      {
        id: 813,
        title: 'Выбор брокера',
        url: '/rubricator/vybor-brokera/',
        children: [],
        count: 0
      }
    ],
    count: 3
  },
  {
    id: 205,
    title: 'Экономика России',
    url: '/rubricator/ekonomika-rossii/',
    children: [
      {
        id: 154,
        title: 'Государственные ведомства',
        url: '/rubricator/gosudarstvennie-vedomstva/',
        children: [],
        count: 0
      },
      {
        id: 204,
        title: 'Финансовый кризис',
        url: '/rubricator/finansovyj-krizis/',
        children: [
          {
            id: 799,
            title: 'Санкции 2022-2024',
            url: '/rubricator/sankcii-2022/',
            children: [],
            count: 0
          }
        ],
        count: 1
      }
    ],
    count: 0
  },
  {
    id: 260,
    title: 'Политика',
    url: '/rubricator/politika/',
    children: [],
    count: 0
  },
  {
    id: 290,
    title: 'Интернет и IT',
    url: '/rubricator/internet/',
    children: [
      {
        id: 800,
        title: 'IT-компании',
        url: '/rubricator/it-kompanii/',
        children: [],
        count: 1
      },
      {
        id: 801,
        title: 'Программирование',
        url: '/rubricator/programmirovanie/',
        children: [],
        count: 0
      },
      {
        id: 802,
        title: 'Информационные технологии',
        url: '/rubricator/informacionnye-tekhnologii/',
        children: [],
        count: 1
      },
      {
        id: 803,
        title: 'Провайдеры',
        url: '/rubricator/provajdery/',
        children: [],
        count: 0
      },
      {
        id: 804,
        title: 'Цензура в интернете',
        url: '/rubricator/cenzura-v-internete/',
        children: [],
        count: 0
      },
      {
        id: 805,
        title: 'Пользователи интернета',
        url: '/rubricator/polzovateli-interneta/',
        children: [],
        count: 0
      }
    ],
    count: 3
  },
  {
    id: 295,
    title: 'Отчетность',
    url: '/rubricator/otchetnost/',
    children: [
      {
        id: 124,
        title: 'Отчетность в Росстат',
        url: '/rubricator/otchetnost-v-rosstat/',
        children: [],
        count: 0
      },
      {
        id: 239,
        title: 'Бухгалтерская отчетность',
        url: '/rubricator/buhgalterskaja-otchetnost/',
        children: [
          {
            id: 627,
            title: 'Составление бухотчетности',
            url: '/rubricator/sostavlenie-buhotchetnosti/',
            children: [],
            count: 0
          },
          {
            id: 628,
            title: 'Упрощенная бухотчетность',
            url: '/rubricator/uproshchennaya-buhotchetnost/',
            children: [],
            count: 0
          },
          {
            id: 629,
            title: 'ГИРБО',
            url: '/rubricator/girbo/',
            children: [],
            count: 0
          }
        ],
        count: 8
      },
      {
        id: 300,
        title: 'Отчетность в ФСС',
        url: '/rubricator/otchetnost-v-fss/',
        children: [
          {
            id: 630,
            title: 'Форма 4-ФСС',
            url: '/rubricator/forma-4-fss/',
            children: [],
            count: 0
          },
          {
            id: 631,
            title: 'Сведения о застрахованном лице в ФСС',
            url: '/rubricator/svedeniya-o-zastrahovannom-lice-v-fss/',
            children: [],
            count: 0
          },
          {
            id: 632,
            title: 'Подтверждение основного вида деятельности в ФСС',
            url: '/rubricator/podtverzhdenie-osnovnogo-vida-deyatelnosti-v-fss/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 301,
        title: 'Налоговая отчетность',
        url: '/rubricator/301/',
        children: [
          {
            id: 265,
            title: '2-НДФЛ',
            url: '/rubricator/2ndfl/',
            children: [],
            count: 0
          },
          {
            id: 266,
            title: '3-НДФЛ',
            url: '/rubricator/otchetnost-nalogoplatelschikov-ndfl-3ndfl/',
            children: [],
            count: 0
          },
          {
            id: 303,
            title: 'Декларация по НДС',
            url: '/rubricator/303/',
            children: [],
            count: 0
          },
          {
            id: 304,
            title: 'Декларация по налогу на имущество',
            url: '/rubricator/304/',
            children: [],
            count: 0
          },
          {
            id: 305,
            title: 'Декларация по налогу на прибыль',
            url: '/rubricator/305/',
            children: [],
            count: 0
          },
          {
            id: 306,
            title: 'Декларация по ЕНВД',
            url: '/rubricator/306/',
            children: [],
            count: 0
          },
          {
            id: 307,
            title: 'Декларация по УСН',
            url: '/rubricator/307/',
            children: [],
            count: 0
          },
          {
            id: 310,
            title: 'РСВ',
            url: '/rubricator/310/',
            children: [],
            count: 0
          },
          {
            id: 465,
            title: '6-НДФЛ',
            url: '/rubricator/6-ndfl/',
            children: [],
            count: 0
          },
          {
            id: 827,
            title: 'Персонифицированные сведения',
            url: '/rubricator/827/',
            children: [],
            count: 0
          }
        ],
        count: 5
      },
      {
        id: 311,
        title: 'Отчетность по экологии',
        url: '/rubricator/311/',
        children: [],
        count: 0
      },
      {
        id: 323,
        title: 'Отчетность в ПФР',
        url: '/rubricator/otchetnost-pfr/',
        children: [
          {
            id: 633,
            title: 'СЗВ-СТАЖ',
            url: '/rubricator/szv-stazh/',
            children: [],
            count: 0
          },
          {
            id: 634,
            title: 'СЗВ-М',
            url: '/rubricator/szv-m/',
            children: [],
            count: 0
          },
          {
            id: 635,
            title: 'СЗВ-ТД',
            url: '/rubricator/szv-td/',
            children: [],
            count: 0
          },
          {
            id: 636,
            title: 'ДСВ-3',
            url: '/rubricator/dsv-3/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 464,
        title: 'Сроки сдачи отчетности',
        url: '/rubricator/sroki-sdachi-otchetnosti/',
        children: [
          {
            id: 821,
            title: 'Сроки сдачи отчетности в 2022 году',
            url: '/rubricator/sroki-sdachi-otchetnosti-v-2022-godu/',
            children: [],
            count: 0
          },
          {
            id: 822,
            title: 'Сроки сдачи отчетности в 2023 году',
            url: '/rubricator/sroki-sdachi-otchetnosti-v-2023-godu/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 637,
        title: 'Отчетность в ЦЗН',
        url: '/rubricator/otchetnost-v-czn/',
        children: [
          {
            id: 638,
            title: 'Портал "Работа России"',
            url: '/rubricator/portal-rabota-v-rossii/',
            children: [],
            count: 0
          }
        ],
        count: 0
      },
      {
        id: 825,
        title: 'Отчетность в СФР',
        url: '/rubricator/otchetnost_v_sfr/',
        children: [],
        count: 2
      }
    ],
    count: 25
  },
  {
    id: 296,
    title: 'Проверки',
    url: '/rubricator/proverki/',
    children: [
      {
        id: 33,
        title: 'Налоговые проверки',
        url: '/rubricator/nalogovye-proverki/',
        children: [
          {
            id: 654,
            title: 'Камеральные налоговые проверки',
            url: '/rubricator/kameralnye-nalogovye-proverki/',
            children: [],
            count: 0
          },
          {
            id: 655,
            title: 'Выездные налоговые проверки',
            url: '/rubricator/vyezdnye-nalogovye-proverki/',
            children: [],
            count: 0
          },
          {
            id: 656,
            title: 'Налоговые требования',
            url: '/rubricator/nalogovye-trebovaniya/',
            children: [],
            count: 8
          },
          {
            id: 657,
            title: 'Проверки ККТ',
            url: '/rubricator/proverki-kkt/',
            children: [],
            count: 0
          }
        ],
        count: 98
      },
      {
        id: 259,
        title: 'Налоговый мониторинг',
        url: '/rubricator/nalogovyj-monitoring/',
        children: [],
        count: 4
      },
      {
        id: 324,
        title: 'Пожарные проверки',
        url: '/rubricator/pozharnye-proverki/',
        children: [],
        count: 0
      },
      {
        id: 325,
        title: 'Трудовые проверки',
        url: '/rubricator/trudovye-proverki/',
        children: [],
        count: 0
      }
    ],
    count: 8
  },
  {
    id: 299,
    title: 'Кадры',
    url: '/rubricator/kadri/',
    children: [
      {
        id: 58,
        title: 'Управление персоналом',
        url: '/rubricator/upravlenie-personalom/',
        children: [
          {
            id: 658,
            title: 'Аутсорсинг',
            url: '/rubricator/autsorsing/',
            children: [],
            count: 7
          },
          {
            id: 659,
            title: 'Аутстаффинг',
            url: '/rubricator/autstaffing/',
            children: [],
            count: 0
          },
          {
            id: 660,
            title: 'Мотивация персонала',
            url: '/rubricator/motivaciya-personala/',
            children: [],
            count: 0
          },
          {
            id: 661,
            title: 'KPI',
            url: '/rubricator/kpi/',
            children: [],
            count: 0
          },
          {
            id: 828,
            title: 'HR',
            url: '/rubricator/HR/',
            children: [],
            count: 2
          }
        ],
        count: 5
      },
      {
        id: 197,
        title: 'Охрана труда',
        url: '/rubricator/ohrana-truda/',
        children: [
          {
            id: 662,
            title: 'Несчастные случаи на производстве',
            url: '/rubricator/neschastnye-sluchai-na-proizvodstve/',
            children: [],
            count: 0
          },
          {
            id: 663,
            title: 'Система управления охраной труда (СУОТ)',
            url: '/rubricator/suot/',
            children: [],
            count: 0
          },
          {
            id: 664,
            title: 'Спецоценка (СОУТ)',
            url: '/rubricator/sout/',
            children: [],
            count: 0
          },
          {
            id: 665,
            title: 'Медосмотры',
            url: '/rubricator/medosmotry/',
            children: [],
            count: 0
          },
          {
            id: 666,
            title: 'Обучение охране труда',
            url: '/rubricator/obuchenie-ohrane-truda/',
            children: [],
            count: 5
          }
        ],
        count: 5
      },
      {
        id: 278,
        title: 'Кадровый учет',
        url: '/rubricator/kadrovyj-uchet/',
        children: [
          {
            id: 667,
            title: 'Упрощенный кадровый учет',
            url: '/rubricator/uproshchennyj-kadrovyj-uchet/',
            children: [],
            count: 0
          },
          {
            id: 668,
            title: 'ЭДО в кадровом учете',
            url: '/rubricator/ehdo-v-kadrovom-uchete/',
            children: [],
            count: 4
          },
          {
            id: 669,
            title: 'Кадровые документы',
            url: '/rubricator/kadrovye-dokumenty/',
            children: [],
            count: 0
          },
          {
            id: 670,
            title: 'Локальные нормативные акты',
            url: '/rubricator/lokalnye-normativnye-akty/',
            children: [],
            count: 0
          },
          {
            id: 671,
            title: 'Воинский учет',
            url: '/rubricator/voinskij-uchet/',
            children: [],
            count: 11
          },
          {
            id: 672,
            title: 'Электронные трудовые книжки',
            url: '/rubricator/ehlektronnye-trudovye-knizhki/',
            children: [],
            count: 0
          }
        ],
        count: 12
      },
      {
        id: 330,
        title: 'Трудовые отношения',
        url: '/rubricator/trudovie-otnosheniya/',
        children: [
          {
            id: 673,
            title: 'Прием на работу',
            url: '/rubricator/priem-na-rabotu/',
            children: [],
            count: 0
          },
          {
            id: 674,
            title: 'Увольнение',
            url: '/rubricator/uvolnenie/',
            children: [],
            count: 0
          },
          {
            id: 675,
            title: 'Перевод',
            url: '/rubricator/kadrovyj-perevod/',
            children: [],
            count: 0
          },
          {
            id: 676,
            title: 'Сокращение штата',
            url: '/rubricator/sokrashchenie-shtata/',
            children: [],
            count: 0
          },
          {
            id: 677,
            title: 'Отпуска',
            url: '/rubricator/otpuska/',
            children: [],
            count: 4
          },
          {
            id: 678,
            title: 'Взыскания с работников',
            url: '/rubricator/vzyskaniya-s-rabotnikov/',
            children: [],
            count: 0
          }
        ],
        count: 3
      },
      {
        id: 447,
        title: 'Электронные трудовые книжки',
        url: '/rubricator/447/',
        children: [],
        count: 1
      },
      {
        id: 474,
        title: 'Иностранные работники',
        url: '/rubricator/inostrannie-rabotniki/',
        children: [
          {
            id: 679,
            title: 'Прием на работу иностранца',
            url: '/rubricator/priem-na-rabotu-inostranca/',
            children: [],
            count: 1
          },
          {
            id: 680,
            title: 'Увольнение иностранцев',
            url: '/rubricator/uvolnenie-inostrancev/',
            children: [],
            count: 0
          },
          {
            id: 681,
            title: 'Высоковалифицированные специалисты',
            url: '/rubricator/vysokovalificirovannye-specialisty/',
            children: [],
            count: 0
          },
          {
            id: 682,
            title: 'Работники из ЕАЭС',
            url: '/rubricator/rabotniki-iz-eaehs/',
            children: [],
            count: 0
          },
          {
            id: 683,
            title: 'Налоги и взносы иностранцев',
            url: '/rubricator/nalogi-i-vznosy-inostrancev/',
            children: [],
            count: 0
          },
          {
            id: 684,
            title: 'Миграционный учет',
            url: '/rubricator/migracionnyj-uchet/',
            children: [],
            count: 0
          }
        ],
        count: 4
      }
    ],
    count: 38
  },
  {
    id: 313,
    title: 'Бухгалтеры',
    url: '/rubricator/buhgalteri/',
    children: [
      {
        id: 64,
        title: 'Главбух: права, обязанности,  передача дел',
        url: '/rubricator/glavbuh-prava-objazanosti--peredacha-del/',
        children: [],
        count: 1
      },
      {
        id: 91,
        title: 'Бизнес-психология',
        url: '/rubricator/biznes-psihologija/',
        children: [
          {
            id: 314,
            title: 'Психология для бухгалтера',
            url: '/rubricator/psihologiya-dlya-buhgaltera/',
            children: [],
            count: 6
          },
          {
            id: 618,
            title: 'Тимбилдинг',
            url: '/rubricator/timbilding/',
            children: [],
            count: 0
          },
          {
            id: 619,
            title: 'Саморазвитие',
            url: '/rubricator/samorazvitie/',
            children: [],
            count: 0
          }
        ],
        count: 6
      },
      {
        id: 315,
        title: 'Карьера бухгалтера',
        url: '/rubricator/karera-buhgaltera/',
        children: [
          {
            id: 620,
            title: 'Резюме бухгалтера',
            url: '/rubricator/rezyume-buhgaltera/',
            children: [],
            count: 0
          },
          {
            id: 621,
            title: 'Поиск работы бухгалтеров',
            url: '/rubricator/poisk-raboty-buhgalterov/',
            children: [],
            count: 0
          },
          {
            id: 622,
            title: 'Собеседования',
            url: '/rubricator/sobesedovaniya/',
            children: [],
            count: 0
          },
          {
            id: 623,
            title: 'Тесты для бухгалтеров',
            url: '/rubricator/testy-dlya-buhgalterov/',
            children: [],
            count: 0
          }
        ],
        count: 12
      },
      {
        id: 316,
        title: 'Обучение для бухгалтеров',
        url: '/rubricator/obuchenie-dlya-buhgalterov/',
        children: [
          {
            id: 448,
            title: 'Онлайн-курсы для бухгалтеров',
            url: '/rubricator/onlajn-kursy-dlya-buhgalterov/',
            children: [],
            count: 0
          },
          {
            id: 624,
            title: 'Повышение квалификации для бухгалтеров',
            url: '/rubricator/povyshenie-kvalifikacii-dlya-buhgalterov/',
            children: [],
            count: 0
          },
          {
            id: 625,
            title: 'Профпереподготовка бухгалтеров',
            url: '/rubricator/profperepodgotovka-buhgalterov/',
            children: [],
            count: 1
          },
          {
            id: 626,
            title: 'Вебинары для бухгалтеров',
            url: '/rubricator/vebinary-dlya-buhgalterov/',
            children: [],
            count: 2
          },
          {
            id: 839,
            title: 'Обучение бухгалтера с нуля',
            url: '/rubricator/839/',
            children: [],
            count: 0
          }
        ],
        count: 5
      },
      {
        id: 317,
        title: 'Профстандарт «Бухгалтер»',
        url: '/rubricator/317/',
        children: [],
        count: 0
      }
    ],
    count: 7
  },
  {
    id: 452,
    title: 'Интервью',
    url: '/rubricator/interview/',
    children: [],
    count: 0
  },
  {
    id: 473,
    title: 'Общество',
    url: '/rubricator/obshchestvo/',
    children: [
      {
        id: 806,
        title: 'Социальная поддержка',
        url: '/rubricator/socialnaya-podderzhka/',
        children: [],
        count: 0
      },
      {
        id: 807,
        title: 'Многодетные семьи',
        url: '/rubricator/mnogodetnye-semi/',
        children: [],
        count: 0
      },
      {
        id: 808,
        title: 'Льготные категории населения',
        url: '/rubricator/lgotnye-kategorii-naseleniya/',
        children: [],
        count: 0
      },
      {
        id: 809,
        title: 'Инвалидность',
        url: '/rubricator/invalidnost/',
        children: [],
        count: 0
      },
      {
        id: 832,
        title: 'Медицина',
        url: '/rubricator/mediczina/',
        children: [],
        count: 0
      },
      {
        id: 834,
        title: 'Обзоры новостей',
        url: '/rubricator/834/',
        children: [],
        count: 0
      },
      {
        id: 843,
        title: 'Благотворительность',
        url: '/rubricator/843/',
        children: [],
        count: 0
      }
    ],
    count: 0
  },
  {
    id: 484,
    title: 'Коронавирус',
    url: '/rubricator/koronavirus/',
    children: [],
    count: 0
  },
  {
    id: 485,
    title: 'Финтех',
    url: '/rubricator/fintech/',
    children: [],
    count: 0
  },
  {
    id: 817,
    title: 'Мобилизация',
    url: '/rubricator/mobilizatsya/',
    children: [],
    count: 0
  }
])
