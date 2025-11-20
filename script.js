// ========= LOCALSTORAGE HELPERS =========
const LS_KEY = "albion_builds";

function loadBuildsFromLS() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveBuildsToLS(builds) {
  localStorage.setItem(LS_KEY, JSON.stringify(builds));
}

// ========= BUILD POR DEFECTO (usa tus imágenes locales) =========
const defaultBuilds = {
  longbow_pvp: {
    name: "Arco largo del anciano · PvP",
    tag: "Rango · DPS · Kiting",
    items: [
      {
        slot: "Arma",
        tier: "T8",
        name: "Arco largo del anciano",
        img: "img/skills/Arco_Largo.png",
        skills: [
          { label: "Q", text: "Tiro perforante" },
          { label: "W", text: "Lluvia de flechas" },
          { label: "E", text: "Lluvia de muerte" },
          { label: "Pasiva", text: "Furia agresiva" }
        ]
      },
      {
        slot: "Armadura",
        tier: "T8",
        name: "Túnica de clérigo del anciano",
        img: "img/skills/Tunica_Clerigo.png",
        skills: [
          { label: "R", text: "Espíritu eterno" },
          { label: "Pasiva", text: "Agresión (más daño y curas)" }
        ]
      },
      {
        slot: "Casco",
        tier: "T8",
        name: "Capucha de asesino del anciano",
        img: "img/skills/Capucha_Asesino.png",
        skills: [
          { label: "R", text: "Invisibilidad" },
          { label: "Pasiva", text: "Mente equilibrada (daño y defensa)" }
        ]
      },
      {
        slot: "Botas",
        tier: "T8",
        name: "Zapatos de cazador del anciano",
        img: "img/skills/Zapatos_Cazador.png",
        skills: [
          { label: "R", text: "Carrera del cazador" },
          { label: "Pasiva", text: "Velocidad aumentada mientras te mueves" }
        ]
      },
      {
        slot: "Capa",
        tier: "T8",
        name: "Capa de Martlock",
        img: "img/skills/Capa_Martlock.png",
        skills: []
      },
      {
        slot: "Poción",
        tier: "T4",
        name: "Poción de veneno menor",
        img: "img/skills/Pocion_Veneno_Menor.png",
        skills: []
      },
      {
        slot: "Comida",
        tier: "T8",
        name: "Guiso de ternera",
        img: "img/skills/Guiso_Ternera.png",
        skills: []
      }
    ],
    combo: {
      text:
        "Abre con la <span class='combo-keys'>W (Lluvia de flechas)</span> " +
        "para zoner, luego lanza la <span class='combo-keys'>E (Lluvia de muerte)</span> " +
        "sobre el grupo y spamea <span class='combo-keys'>Q (Tiro perforante)</span> mientras kiteas. " +
        "Usa la túnica de clérigo cuando te focuseen y la capucha de asesino " +
        "para reposicionarte o escapar."
    }
  }
};

// Mezclamos LS + default
let builds = (() => {
  const saved = loadBuildsFromLS();
  if (!saved) return { ...defaultBuilds };
  return { ...defaultBuilds, ...saved };
})();

// ========= DOM =========
const buildSelect = document.getElementById("buildSelect");
const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const resultSection = document.getElementById("result");
const itemsGrid = document.getElementById("itemsGrid");
const buildNameElement = document.getElementById("buildName");
const buildTagElement = document.getElementById("buildTag");
const comboSection = document.getElementById("comboSection");
const comboTextElement = document.getElementById("comboText");

// Tabs
const tabButtons = document.querySelectorAll(".tab-button");
const tabSections = document.querySelectorAll(".tab-section");

// Builder elements
const newBuildNameInput = document.getElementById("newBuildName");
const newBuildModeSelect = document.getElementById("newBuildMode");
const itemOptionsContainer = document.getElementById("itemOptions");
const selectedPreview = document.getElementById("selectedItemsPreview");
const newBuildComboTextarea = document.getElementById("newBuildCombo");
const saveNewBuildBtn = document.getElementById("saveNewBuildBtn");
const addBuildMessage = document.getElementById("addBuildMessage");

// Subtipo (tipo de arma/armadura dentro de la pieza)
const subTypeWrapper = document.getElementById("subTypeWrapper");
const subTypeSelect = document.getElementById("subTypeSelect");

// Modal
const skillModal = document.getElementById("skillModal");
const skillModalBody = document.getElementById("skillModalBody");
const closeSkillModalBtn = document.getElementById("closeSkillModal");

// ========= TABS =========
function initTabs() {
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      tabSections.forEach((sec) => {
        if (sec.id === tabId) sec.classList.remove("hidden");
        else sec.classList.add("hidden");
      });
    });
  });
}

// ========= SELECT BUILDS =========
function fillBuildSelect() {
  buildSelect.innerHTML = "";
  Object.entries(builds).forEach(([id, build]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = build.name;
    buildSelect.appendChild(opt);
  });
}

// ========= GENERAR BUILD =========
function generarBuild() {
  const id = buildSelect.value;
  const build = builds[id];
  if (!build) return;

  loading.classList.remove("hidden");
  resultSection.classList.add("hidden");

  setTimeout(() => {
    loading.classList.add("hidden");
    mostrarBuild(build);
  }, 700);
}

function mostrarBuild(build) {
  buildNameElement.textContent = build.name;
  buildTagElement.textContent = build.tag || "";

  itemsGrid.innerHTML = "";

  build.items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";

    const header = document.createElement("div");
    header.className = "card-header";

    const iconDiv = document.createElement("div");
    iconDiv.className = "item-icon";
    const img = document.createElement("img");
    img.src = item.img || "";
    img.alt = item.name;
    iconDiv.appendChild(img);

    const tierBadge = document.createElement("div");
    tierBadge.className = "item-tier-badge";
    tierBadge.textContent = item.tier || "";
    iconDiv.appendChild(tierBadge);

    const textBlock = document.createElement("div");
    textBlock.className = "item-text-block";

    const slot = document.createElement("div");
    slot.className = "item-slot";
    slot.textContent = item.slot;

    const name = document.createElement("div");
    name.className = "item-name";
    name.textContent = item.name;

    textBlock.appendChild(slot);
    textBlock.appendChild(name);

    header.appendChild(iconDiv);
    header.appendChild(textBlock);

    card.appendChild(header);

    if (item.skills && item.skills.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "skills";

      item.skills.forEach((skill) => {
        const li = document.createElement("li");
        li.className = "skill-row";

        const labelSpan = document.createElement("span");
        labelSpan.className = "skill-label";
        labelSpan.textContent = skill.label + ":";

        const textSpan = document.createElement("span");
        textSpan.textContent = " " + skill.text;

        li.appendChild(labelSpan);
        li.appendChild(textSpan);

        ul.appendChild(li);
      });

      card.appendChild(ul);
    }

    itemsGrid.appendChild(card);
  });

  if (build.combo && build.combo.text) {
    comboSection.classList.remove("hidden");
    comboTextElement.innerHTML = build.combo.text;
  } else {
    comboSection.classList.add("hidden");
  }

  resultSection.classList.remove("hidden");
}

// ========= DB DE ITEMS (usa tus PNG locales) =========
//  weaponType: "Arco" | "Daga" | "Vara"
//  armorClass: "cloth" | "leather" | "plate"

const ITEMS_DB = {
  // ====================== ARMAS ======================
  arma: [
    // ----- ARCOS -----
    {
      id: "arco_largo",
      slot: "Arma",
      tier: "T8",
      name: "Arco largo del anciano",
      img: "img/skills/Arco_Largo.png",
      weaponType: "Arco",
      skillsAvailable: [
        { label: "Q", text: "Tiro perforante" },
        { label: "W", text: "Lluvia de flechas" },
        { label: "E", text: "Lluvia de muerte" },
        { label: "Pasiva", text: "Furia agresiva" }
      ]
    },
    {
      id: "arco_badon",
      slot: "Arma",
      tier: "T8",
      name: "Arco de Badon",
      img: "img/skills/Arco_Badon.png",
      weaponType: "Arco",
      skillsAvailable: [
        { label: "Q", text: "Descarga perforante" },
        { label: "W", text: "Ola eléctrica" },
        { label: "E", text: "Tormenta de rayos" },
        { label: "Pasiva", text: "Perforación eléctrica" }
      ]
    },
    {
      id: "arco_cruzacielos",
      slot: "Arma",
      tier: "T8",
      name: "Arco Cruzacielos",
      img: "img/skills/Arco_Cruzacielos.png",
      weaponType: "Arco",
      skillsAvailable: [
        { label: "Q", text: "Flecha cortavientos" },
        { label: "W", text: "Disparo ascendente" },
        { label: "E", text: "Lluvia celeste" },
        { label: "Pasiva", text: "Alcance aumentado" }
      ]
    },
    {
      id: "arco_guerra",
      slot: "Arma",
      tier: "T8",
      name: "Arco de guerra",
      img: "img/skills/Arco_Guerra.png",
      weaponType: "Arco",
      skillsAvailable: [
        { label: "Q", text: "Disparo rápido" },
        { label: "W", text: "Salva de guerra" },
        { label: "E", text: "Flecha demoledora" },
        { label: "Pasiva", text: "Daño sostenido" }
      ]
    },
    {
      id: "arco_perforador",
      slot: "Arma",
      tier: "T8",
      name: "Arco perforador",
      img: "img/skills/Arco_Perforador.png",
      weaponType: "Arco",
      skillsAvailable: [
        { label: "Q", text: "Flecha perforante" },
        { label: "W", text: "Disparo cargado" },
        { label: "E", text: "Lluvia perforante" },
        { label: "Pasiva", text: "Mayor penetración" }
      ]
    },
    {
      id: "arco_susurrante",
      slot: "Arma",
      tier: "T8",
      name: "Arco susurrante",
      img: "img/skills/Arco_Susurrante.png",
      weaponType: "Arco",
      skillsAvailable: [
        { label: "Q", text: "Disparo silencioso" },
        { label: "W", text: "Flecha sigilosa" },
        { label: "E", text: "Tormenta sigilosa" },
        { label: "Pasiva", text: "Golpes silenciosos" }
      ]
    },

    // ----- DAGAS -----
    {
      id: "dagas",
      slot: "Arma",
      tier: "T8",
      name: "Daga",
      img: "img/skills/Dagas.png",
      weaponType: "Daga",
      skillsAvailable: [
        { label: "Q", text: "Corte perforante" },
        { label: "W", text: "Golpe veloz" },
        { label: "E", text: "Estocada sombría" },
        { label: "Pasiva", text: "Velocidad de ataque" }
      ]
    },
    {
      id: "dagas_dobles",
      slot: "Arma",
      tier: "T8",
      name: "Dagas dobles",
      img: "img/skills/Dagas_Dobles.png",
      weaponType: "Daga",
      skillsAvailable: [
        { label: "Q", text: "Corte gemelo" },
        { label: "W", text: "Danza de cuchillas" },
        { label: "E", text: "Asalto mortal" },
        { label: "Pasiva", text: "Golpes encadenados" }
      ]
    },
    {
      id: "garras",
      slot: "Arma",
      tier: "T8",
      name: "Garras",
      img: "img/skills/Garras.png",
      weaponType: "Daga",
      skillsAvailable: [
        { label: "Q", text: "Desgarrar armadura" },
        { label: "W", text: "Golpe acuchillante" },
        { label: "E", text: "Atrapar y destrozar" },
        { label: "Pasiva", text: "Daño por sangrado" }
      ]
    },
    {
      id: "colmillo_demoníaco",
      slot: "Arma",
      tier: "T8",
      name: "Colmillo demoníaco",
      img: "img/skills/Colmillo_Demoniaco.png",
      weaponType: "Daga",
      skillsAvailable: [
        { label: "Q", text: "Corte maldito" },
        { label: "W", text: "Emboscada demoníaca" },
        { label: "E", text: "Estocada infernal" },
        { label: "Pasiva", text: "Corrupción creciente" }
      ]
    },
    {
      id: "sangradora",
      slot: "Arma",
      tier: "T8",
      name: "Sangradora",
      img: "img/skills/Sangradora.png",
      weaponType: "Daga",
      skillsAvailable: [
        { label: "Q", text: "Corte sangrante" },
        { label: "W", text: "Torbellino sangriento" },
        { label: "E", text: "Hemorragia letal" },
        { label: "Pasiva", text: "Sangrado prolongado" }
      ]
    },
    {
      id: "hoja_cristal_doble",
      slot: "Arma",
      tier: "T8",
      name: "Hoja de cristal doble",
      img: "img/skills/Hoja_Cristal_Doble.png",
      weaponType: "Daga",
      skillsAvailable: [
        { label: "Q", text: "Corte cristalino" },
        { label: "W", text: "Estallido de cristal" },
        { label: "E", text: "Explosión fragmentada" },
        { label: "Pasiva", text: "Filo afiladísimo" }
      ]
    },
    {
      id: "concedemuerte",
      slot: "Arma",
      tier: "T8",
      name: "Concedemuerte",
      img: "img/skills/Concedemuerte.png",
      weaponType: "Daga",
      skillsAvailable: [
        { label: "Q", text: "Marca de muerte" },
        { label: "W", text: "Golpe letal" },
        { label: "E", text: "Ejecución" },
        { label: "Pasiva", text: "Daño a objetivos bajos de vida" }
      ]
    },

    // ----- VARAS / BASTONES -----
    {
      id: "vara_avaloniana",
      slot: "Arma",
      tier: "T8",
      name: "Vara avaloniana",
      img: "img/skills/Vara_Avaloniana.png",
      weaponType: "Vara",
      skillsAvailable: [
        { label: "Q", text: "Rayo arcano" },
        { label: "W", text: "Oleada de energía" },
        { label: "E", text: "Descarga avaloniana" },
        { label: "Pasiva", text: "Poder arcano" }
      ]
    },
    {
      id: "baston_equilibrio",
      slot: "Arma",
      tier: "T8",
      name: "Bastón de equilibrio",
      img: "img/skills/Baston_Equilibrio.png",
      weaponType: "Vara",
      skillsAvailable: [
        { label: "Q", text: "Orbe de energía" },
        { label: "W", text: "Pulso de equilibrio" },
        { label: "E", text: "Ruptura de energía" },
        { label: "Pasiva", text: "Balance perfecto" }
      ]
    },
    {
      id: "baston_monge",
      slot: "Arma",
      tier: "T8",
      name: "Bastón de monje",
      img: "img/skills/Baston_Monge.png",
      weaponType: "Vara",
      skillsAvailable: [
        { label: "Q", text: "Golpe de chi" },
        { label: "W", text: "Ola espiritual" },
        { label: "E", text: "Explosión de ki" },
        { label: "Pasiva", text: "Serenidad" }
      ]
    },
    {
      id: "baston_metalico",
      slot: "Arma",
      tier: "T8",
      name: "Bastón metálico",
      img: "img/skills/Baston_Metalico.png",
      weaponType: "Vara",
      skillsAvailable: [
        { label: "Q", text: "Proyectil pesado" },
        { label: "W", text: "Martilleo místico" },
        { label: "E", text: "Impacto sísmico" },
        { label: "Pasiva", text: "Golpes contundentes" }
      ]
    },
    {
      id: "vara_basica",
      slot: "Arma",
      tier: "T8",
      name: "Vara",
      img: "img/skills/vara.png",
      weaponType: "Vara",
      skillsAvailable: [
        { label: "Q", text: "Proyectil mágico" },
        { label: "W", text: "Oleada mágica" },
        { label: "E", text: "Explosión arcana" },
        { label: "Pasiva", text: "Daño mágico" }
      ]
    }
  ],

  // ====================== PECHO (armaduras) ======================
  pecho: [
    // ---- Cuero (chaquetas) ----
    {
      id: "chaqueta_acechador",
      slot: "Armadura",
      tier: "T8",
      name: "Chaqueta de acechador",
      img: "img/skills/Chaqueta_Acechador.png",
      armorClass: "leather",
      skillsAvailable: [
        { label: "R", text: "Red de acechador" },
        { label: "Pasiva", text: "Desgaste progresivo" }
      ]
    },
    {
      id: "chaqueta_asesino",
      slot: "Armadura",
      tier: "T8",
      name: "Chaqueta de asesino",
      img: "img/skills/Chaqueta_Asesino.png",
      armorClass: "leather",
      skillsAvailable: [
        { label: "R", text: "Esquiva letal" },
        { label: "Pasiva", text: "Golpes críticos" }
      ]
    },
    {
      id: "chaqueta_cazador",
      slot: "Armadura",
      tier: "T8",
      name: "Chaqueta de cazador",
      img: "img/skills/Chaqueta_Cazador.png",
      armorClass: "leather",
      skillsAvailable: [
        { label: "R", text: "Instinto del cazador" },
        { label: "Pasiva", text: "Regeneración en movimiento" }
      ]
    },

    // ---- Tela (hábitos / túnicas) ----
    {
      id: "habito_clerigo",
      slot: "Armadura",
      tier: "T8",
      name: "Hábito de clérigo",
      img: "img/skills/Habito_Clerigo.png",
      armorClass: "cloth",
      skillsAvailable: [
        { label: "R", text: "Círculo sagrado" },
        { label: "Pasiva", text: "Fe inquebrantable" }
      ]
    },
    {
      id: "habito_mago",
      slot: "Armadura",
      tier: "T8",
      name: "Hábito de mago",
      img: "img/skills/Habito_Mago.png",
      armorClass: "cloth",
      skillsAvailable: [
        { label: "R", text: "Explosión arcana" },
        { label: "Pasiva", text: "Poder arcano" }
      ]
    },
    {
      id: "tunica_clerigo",
      slot: "Armadura",
      tier: "T8",
      name: "Túnica de clérigo",
      img: "img/skills/Tunica_Clerigo.png",
      armorClass: "cloth",
      skillsAvailable: [
        { label: "R", text: "Espíritu eterno" },
        { label: "Pasiva", text: "Agresión (más daño y curas)" }
      ]
    },

    // ---- Placa ----
    {
      id: "armadura_real",
      slot: "Armadura",
      tier: "T8",
      name: "Armadura real",
      img: "img/skills/Armadura_Real.png",
      armorClass: "plate",
      skillsAvailable: [
        { label: "R", text: "Estandarte real" },
        { label: "Pasiva", text: "Resistencia aumentada" }
      ]
    }
  ],

  // ====================== CASCOS ======================
  casco: [
    // cuero
    {
      id: "capucha_asesino",
      slot: "Casco",
      tier: "T8",
      name: "Capucha de asesino",
      img: "img/skills/Capucha_Asesino.png",
      armorClass: "leather",
      skillsAvailable: [
        { label: "R", text: "Invisibilidad" },
        { label: "Pasiva", text: "Mente equilibrada" }
      ]
    },
    {
      id: "capucha_cazador",
      slot: "Casco",
      tier: "T8",
      name: "Capucha de cazador",
      img: "img/skills/Capucha_Cazador.png",
      armorClass: "leather",
      skillsAvailable: [
        { label: "R", text: "Sentido del cazador" },
        { label: "Pasiva", text: "Velocidad en persecución" }
      ]
    },

    // tela
    {
      id: "casco_erudito",
      slot: "Casco",
      tier: "T8",
      name: "Casco de erudito",
      img: "img/skills/Casco_Erudito.png",
      armorClass: "cloth",
      skillsAvailable: [
        { label: "R", text: "Campo de concentración" },
        { label: "Pasiva", text: "Regeneración de energía" }
      ]
    },

    // placa
    {
      id: "casco_caballero",
      slot: "Casco",
      tier: "T8",
      name: "Casco de caballero",
      img: "img/skills/Casco_Caballero.png",
      armorClass: "plate",
      skillsAvailable: [
        { label: "R", text: "Carga del caballero" },
        { label: "Pasiva", text: "Defensa frontal" }
      ]
    }
  ],

  // ====================== BOTAS (pies) ======================
  botas: [
    {
      id: "botas_soldado",
      slot: "Botas",
      tier: "T8",
      name: "Botas de soldado",
      img: "img/skills/Botas_Soldado.png",
      armorClass: "plate",
      skillsAvailable: [
        { label: "R", text: "Formación de batalla" },
        { label: "Pasiva", text: "Disciplina marcial" }
      ]
    },
    {
      id: "zapatos_cazador",
      slot: "Botas",
      tier: "T8",
      name: "Zapatos de cazador",
      img: "img/skills/Zapatos_Cazador.png",
      armorClass: "leather",
      skillsAvailable: [
        { label: "R", text: "Carrera del cazador" },
        { label: "Pasiva", text: "Velocidad en persecución" }
      ]
    },
    {
      id: "sandalias_clerigo",
      slot: "Botas",
      tier: "T8",
      name: "Sandalias de clérigo",
      img: "img/skills/Sandalias_Clerigo.png",
      armorClass: "cloth",
      skillsAvailable: [
        { label: "R", text: "Camino sagrado" },
        { label: "Pasiva", text: "Fe inquebrantable" }
      ]
    }
  ],

  // ====================== CAPAS ======================
  capa: [
    {
      id: "capa_avaloniana",
      slot: "Capa",
      tier: "T8",
      name: "Capa avaloniana",
      img: "img/skills/Capa_Avaloniana.png",
      skillsAvailable: []
    },
    {
      id: "capa_martlock",
      slot: "Capa",
      tier: "T8",
      name: "Capa de Martlock",
      img: "img/skills/Capa_Martlock.png",
      skillsAvailable: []
    },
    {
      id: "capa_morgana",
      slot: "Capa",
      tier: "T8",
      name: "Capa de Morgana",
      img: "img/skills/Capa_Morgana.png",
      skillsAvailable: []
    }
  ],

  pocion: [
    {
      id: "pocion_veneno",
      slot: "Poción",
      tier: "T4",
      name: "Poción de veneno menor",
      img: "img/skills/Pocion_Veneno_Menor.png",
      skillsAvailable: []
    }
  ],

  comida: [
    {
      id: "guiso_ternera",
      slot: "Comida",
      tier: "T8",
      name: "Guiso de ternera",
      img: "img/skills/Guiso_Ternera.png",
      skillsAvailable: []
    }
  ]
};

// Qué propiedad de cada item se usa como subtipo
const SUBTYPE_MAP = {
  arma: "weaponType",
  pecho: "armorClass",
  casco: "armorClass",
  botas: "armorClass"
};

const ORDER_TYPES = ["arma", "pecho", "casco", "botas", "capa", "pocion", "comida"];

// ========= ESTADO DE LA NUEVA BUILD =========
let currentNewBuild = {
  name: "",
  mode: "PvP",
  items: {
    arma: null,
    pecho: null,
    casco: null,
    botas: null,
    capa: null,
    pocion: null,
    comida: null
  },
  combo: ""
};

let currentCategoryType = null; // arma / pecho / casco / botas
let currentSubType = "all";

// ========= BUILDER: SUBTIPOS =========
function getSubtypesFor(type) {
  const key = SUBTYPE_MAP[type];
  if (!key) return [];

  const list = ITEMS_DB[type] || [];
  const set = new Set(list.map((it) => it[key]).filter((v) => v && v.trim() !== ""));
  return Array.from(set);
}

function updateSubTypeSelect(type) {
  const subtypes = getSubtypesFor(type);

  if (!subtypes.length) {
    subTypeWrapper.classList.add("hidden");
    currentSubType = "all";
    return;
  }

  subTypeWrapper.classList.remove("hidden");
  subTypeSelect.innerHTML = "";
  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = "Todos los tipos";
  subTypeSelect.appendChild(optAll);

  subtypes.forEach((st) => {
    const opt = document.createElement("option");
    opt.value = st;
    opt.textContent = st;
    subTypeSelect.appendChild(opt);
  });

  currentSubType = "all";
  subTypeSelect.value = "all";
}

// ========= BUILDER: MOSTRAR ICONOS =========
function renderItemIcons(type) {
  const list = ITEMS_DB[type] || [];
  const filterKey = SUBTYPE_MAP[type];

  itemOptionsContainer.innerHTML = "";

  list.forEach((it) => {
    if (filterKey && currentSubType !== "all" && it[filterKey] !== currentSubType) {
      return;
    }

    const box = document.createElement("div");
    box.className = "icon-item";
    box.innerHTML = `
      <img src="${it.img}" alt="${it.name}">
      <div>${it.name}</div>
    `;
    box.addEventListener("click", () => openSkillModal(type, it));
    itemOptionsContainer.appendChild(box);
  });
}

function showItemOptions(type) {
  currentCategoryType = type;
  itemOptionsContainer.innerHTML = "";

  // actualizamos subtipo si aplica
  if (SUBTYPE_MAP[type]) {
    updateSubTypeSelect(type);
  } else {
    subTypeWrapper.classList.add("hidden");
    currentSubType = "all";
  }

  renderItemIcons(type);
}

// botones de categoría (arma / pecho / casco / botas / capa / poción / comida)
document.querySelectorAll(".item-category").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    showItemOptions(type);
  });
});

// cambios en el select de subtipo
subTypeSelect.addEventListener("change", () => {
  currentSubType = subTypeSelect.value;
  if (currentCategoryType) {
    renderItemIcons(currentCategoryType);
  }
});

// ========= MODAL DE HABILIDADES =========
function openSkillModal(type, item) {
  skillModal.classList.remove("hidden");

  let html = `
    <h3>${item.name}</h3>
    <p style="font-size:0.85rem;color:#9ca3af;margin-bottom:0.5rem">
      Elige las habilidades que quieres usar con este objeto.
    </p>
  `;

  if (!item.skillsAvailable || item.skillsAvailable.length === 0) {
    html += `<p style="font-size:0.85rem;color:#9ca3af">Este objeto no tiene habilidades activas configuradas.</p>`;
  } else {
    html += `<div class="modal-skill-list">`;
    item.skillsAvailable.forEach((sk, idx) => {
      const id = `skill_${type}_${item.id}_${idx}`;
      html += `
        <label class="modal-skill-row" for="${id}">
          <input type="checkbox" id="${id}" data-label="${sk.label}" data-text="${sk.text}">
          <span><span class="skill-label">${sk.label}:</span> ${sk.text}</span>
        </label>
      `;
    });
    html += `</div>`;
  }

  html += `
    <div class="modal-footer">
      <button class="modal-btn secondary" id="cancelSkillSelection">Cancelar</button>
      <button class="modal-btn" id="confirmSkillSelection">Guardar</button>
    </div>
  `;

  skillModalBody.innerHTML = html;

  document.getElementById("cancelSkillSelection").onclick = () => {
    skillModal.classList.add("hidden");
  };
  document.getElementById("confirmSkillSelection").onclick = () => {
    const selected = [];
    skillModalBody
      .querySelectorAll("input[type='checkbox']:checked")
      .forEach((input) => {
        selected.push({
          label: input.dataset.label,
          text: input.dataset.text
        });
      });

    currentNewBuild.items[type] = {
      slot: item.slot,
      tier: item.tier,
      name: item.name,
      img: item.img,
      skills: selected
    };

    skillModal.classList.add("hidden");
    renderSelectedPreview();
  };
}

closeSkillModalBtn.addEventListener("click", () => {
  skillModal.classList.add("hidden");
});

// ========= VISTA PREVIA =========
function renderSelectedPreview() {
  selectedPreview.innerHTML = "";

  ORDER_TYPES.forEach((type) => {
    const it = currentNewBuild.items[type];
    if (!it) return;

    const row = document.createElement("div");
    row.className = "selected-preview-item";
    row.innerHTML = `
      <img src="${it.img}" alt="${it.name}">
      <div>
        <div style="font-size:0.75rem;color:#9ca3af;text-transform:uppercase">${it.slot}</div>
        <div style="font-size:0.9rem;font-weight:600">${it.name}</div>
        ${
          it.skills && it.skills.length
            ? `<div style="font-size:0.8rem;margin-top:0.2rem">
                ${it.skills
                  .map((s) => `<span class="skill-label">${s.label}:</span> ${s.text}`)
                  .join(" · ")}
               </div>`
            : ""
        }
      </div>
    `;
    selectedPreview.appendChild(row);
  });
}

// ========= GUARDAR NUEVA BUILD =========
function saveNewBuild() {
  addBuildMessage.textContent = "";
  addBuildMessage.style.color = "#22c55e";

  const name = newBuildNameInput.value.trim();
  const mode = newBuildModeSelect.value;
  const comboText = newBuildComboTextarea.value.trim();

  if (!name) {
    addBuildMessage.style.color = "#f97316";
    addBuildMessage.textContent = "Ponle un nombre a la build.";
    return;
  }

  if (!currentNewBuild.items.arma) {
    addBuildMessage.style.color = "#f97316";
    addBuildMessage.textContent = "Debes elegir al menos un arma.";
    return;
  }

  const items = [];
  ORDER_TYPES.forEach((type) => {
    const it = currentNewBuild.items[type];
    if (it) items.push(it);
  });

  let id = name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  if (!id) id = "build_custom";

  let originalId = id;
  let counter = 1;
  while (builds[id]) {
    id = originalId + "_" + counter++;
  }

  builds[id] = {
    name,
    tag: mode,
    items,
    combo: { text: comboText }
  };

  saveBuildsToLS(builds);
  fillBuildSelect();

  addBuildMessage.style.color = "#22c55e";
  addBuildMessage.textContent = "Build guardada. Ya puedes usarla en el generador.";

  // reset estado
  currentNewBuild = {
    name: "",
    mode: "PvP",
    items: {
      arma: null,
      pecho: null,
      casco: null,
      botas: null,
      capa: null,
      pocion: null,
      comida: null
    },
    combo: ""
  };
  newBuildNameInput.value = "";
  newBuildComboTextarea.value = "";
  itemOptionsContainer.innerHTML = "";
  selectedPreview.innerHTML = "";
}

saveNewBuildBtn.addEventListener("click", saveNewBuild);

// ========= INIT =========
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  fillBuildSelect();
  generateBtn.addEventListener("click", generarBuild);
});
