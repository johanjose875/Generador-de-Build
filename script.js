// ======== LOCALSTORAGE HELPERS ========
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

// ======== BUILDS POR DEFECTO (se mezclan con LS) ========
const defaultBuilds = {
  longbow_pvp: {
    name: "Arco largo del anciano · PvP",
    tag: "Rango · DPS · Kiting",
    items: [
      {
        slot: "Arma",
        tier: "T8",
        name: "Arco largo del anciano",
        img: "https://render.albiononline.com/v1/item/T8_2H_LONGBOW.png",
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
        // ID CORRECTO de la Cleric Robe
        img: "https://render.albiononline.com/v1/item/T8_ARMOR_CLOTH_SET2.png",
        skills: [
          { label: "R", text: "Espíritu eterno" },
          { label: "Pasiva", text: "Agresión (más daño y curas)" }
        ]
      },
      {
        slot: "Casco",
        tier: "T8",
        name: "Capucha de asesino del anciano",
        img: "https://render.albiononline.com/v1/item/T8_HEAD_LEATHER_SET3.png",
        skills: [
          { label: "R", text: "Invisibilidad" },
          { label: "Pasiva", text: "Mente equilibrada (daño y defensa)" }
        ]
      },
      {
        slot: "Botas",
        tier: "T8",
        name: "Zapatos de cazador del anciano",
        img: "https://render.albiononline.com/v1/item/T8_SHOES_LEATHER_SET1.png",
        skills: [
          { label: "R", text: "Carrera del cazador" },
          { label: "Pasiva", text: "Velocidad aumentada mientras te mueves" }
        ]
      },
      {
        slot: "Capa",
        tier: "T8",
        name: "Capa de Martlock",
        img: "https://render.albiononline.com/v1/item/T8_CAPEITEM_FW_MARTLOCK.png",
        skills: []
      },
      {
        slot: "Poción",
        tier: "T4",
        name: "Poción de veneno menor",
        img: "https://render.albiononline.com/v1/item/T4_POTION_POISON.png",
        skills: []
      },
      {
        slot: "Comida",
        tier: "T8",
        name: "Guiso de ternera",
        img: "https://render.albiononline.com/v1/item/T8_MEAL_STEW.png",
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

// Mezclamos LS + default (si en LS hay builds, pisan las default con el mismo id)
let builds = (() => {
  const saved = loadBuildsFromLS();
  if (!saved) return { ...defaultBuilds };
  return { ...defaultBuilds, ...saved };
})();

// ======== DOM ========
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

// Form agregar
const addBuildForm = document.getElementById("addBuildForm");
const addBuildMessage = document.getElementById("addBuildMessage");

// ======== TABS ========
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

// ======== SELECT BUILDS ========
function fillBuildSelect() {
  buildSelect.innerHTML = "";
  Object.entries(builds).forEach(([id, build]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = build.name;
    buildSelect.appendChild(opt);
  });
}

// ======== GENERAR BUILD ========
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

    // header con icono + texto
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
        li.innerHTML = `<span class="skill-label">${skill.label}:</span> ${skill.text}`;
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

// ======== AGREGAR NUEVA BUILD ========
function handleAddBuild(e) {
  e.preventDefault();
  addBuildMessage.textContent = "";

  const id = document.getElementById("buildId").value.trim();
  const name = document.getElementById("buildNameInput").value.trim();
  const tag = document.getElementById("buildTagInput").value.trim();

  const arma = document.getElementById("armaInput").value.trim();
  const armaImg = document.getElementById("armaImg").value.trim();

  const armadura = document.getElementById("armaduraInput").value.trim();
  const armaduraImg = document.getElementById("armaduraImg").value.trim();

  const casco = document.getElementById("cascoInput").value.trim();
  const cascoImg = document.getElementById("cascoImg").value.trim();

  const botas = document.getElementById("botasInput").value.trim();
  const botasImg = document.getElementById("botasImg").value.trim();

  const capa = document.getElementById("capaInput").value.trim();
  const capaImg = document.getElementById("capaImg").value.trim();

  const pocion = document.getElementById("pocionInput").value.trim();
  const pocionImg = document.getElementById("pocionImg").value.trim();

  const comida = document.getElementById("comidaInput").value.trim();
  const comidaImg = document.getElementById("comidaImg").value.trim();

  const comboText = document.getElementById("comboTextInput").value.trim();

  if (!id || !name) {
    addBuildMessage.style.color = "#f97316";
    addBuildMessage.textContent = "Debes poner un ID y un nombre.";
    return;
  }

  if (builds[id]) {
    addBuildMessage.style.color = "#f97316";
    addBuildMessage.textContent = "Ya existe una build con ese ID.";
    return;
  }

  builds[id] = {
    name,
    tag,
    items: [
      { slot: "Arma", tier: "", name: arma, img: armaImg, skills: [] },
      { slot: "Armadura", tier: "", name: armadura, img: armaduraImg, skills: [] },
      { slot: "Casco", tier: "", name: casco, img: cascoImg, skills: [] },
      { slot: "Botas", tier: "", name: botas, img: botasImg, skills: [] },
      { slot: "Capa", tier: "", name: capa, img: capaImg, skills: [] },
      { slot: "Poción", tier: "", name: pocion, img: pocionImg, skills: [] },
      { slot: "Comida", tier: "", name: comida, img: comidaImg, skills: [] }
    ],
    combo: {
      text: comboText
    }
  };

  saveBuildsToLS(builds);
  fillBuildSelect();

  addBuildMessage.style.color = "#22c55e";
  addBuildMessage.textContent = "Build agregada correctamente. 🎯";

  addBuildForm.reset();
}

// ======== INIT ========
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  fillBuildSelect();

  generateBtn.addEventListener("click", generarBuild);
  addBuildForm.addEventListener("submit", handleAddBuild);
});
