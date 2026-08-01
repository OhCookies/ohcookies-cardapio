/*
  OHCOOKIES — CONFIGURAÇÃO PRINCIPAL
  Altere os dados abaixo para atualizar o cardápio.
*/

const STORE = {
  whatsapp: "5521996288285",
  timezone: "America/Sao_Paulo",
  instagram: "@ohcookie.s",
  minimumOrder: 0,
  creditCardFeeRate: 0.042,
  preparationMinutes: 30,
  slotIntervalMinutes: 30, // taxa descontada sobre o valor total cobrado
  inventoryCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-sfB08jUIJaKm2mCpajcdJnIXrdfhbHbaF4ve3ZsnQLzlc48uK4wOxaK-tmvaZhWEzMFHd6Ek2M1l/pub?gid=292180600&single=true&output=csv",
  inventoryRefreshMinutes: 2,
  openingHours: {
    // 0 = domingo, 1 = segunda ... 6 = sábado
    0: { open: "13:00", close: "18:00" },
    1: null,
    2: { open: "13:00", close: "18:00" },
    3: { open: "13:00", close: "18:00" },
    4: { open: "13:00", close: "18:00" },
    5: { open: "13:00", close: "18:00" },
    6: { open: "13:00", close: "18:00" }
  }
};

/*
  PREÇOS E ESTOQUES ABAIXO SÃO UM MODELO INICIAL.
  Confirme e altere antes de divulgar o site aos clientes.

  Para adicionar foto:
  1. Crie uma pasta chamada "imagens".
  2. Envie a foto para essa pasta.
  3. Em image, use por exemplo: "imagens/nutella.jpg"
*/

const PRODUCTS = [
  {
    id: "tradicional",
    name: "Cookie Tradicional",
    category: "Tradicionais",
    description: "Massa tradicional com gotas de chocolate ao blend.",
    price: 8,
    stock: null,
    availability: "Disponível",
    image: "imagens/cookie-tradicional.jpg"
  },
  {
    id: "nutella",
    name: "Cookie Nutella",
    category: "Tradicionais",
    description: "Massa tradicional com gotas de chocolate blend, recheada com Nutella original.",
    price: 10,
    stock: null,
    availability: "Disponível",
    image: "imagens/cookie-nutella.jpg"
  },
  {
    id: "ninho-nutella",
    name: "Cookie Ninho c/ Nutella",
    category: "Tradicionais",
    description: "Massa amanteigada de chocolate 100% cacau, recheada com brigadeiro cremoso de leite Ninho e Nutella.",
    price: 10,
    stock: null,
    availability: "Disponível",
    image: "imagens/cookie-ninho-nutella.jpg"
  },
  {
    id: "red-velvet",
    name: "Cookie Red Velvet",
    category: "Tradicionais",
    description: "Massa amanteigada vermelha com gotas de chocolate branco, recheada com brigadeiro cremoso de leite Ninho.",
    price: 10,
    stock: null,
    availability: "Disponível",
    image: "imagens/cookie-red-velvet.jpg"
  },
  {
    id: "black-white",
    name: "Cookie Black & White",
    category: "Tradicionais",
    description: "Massa black com gotas de chocolate blend e chocolate branco, recheada com creme de chocolate branco.",
    price: 10,
    stock: null,
    availability: "Disponível",
    image: "imagens/cookie-black-white.jpg"
  },
  {
    id: "oreo",
    name: "Cookie Oreo",
    category: "Tradicionais",
    description: "Massa black com gotas de chocolate blend e chocolate branco, finalizada com biscoito Oreo.",
    price: 10,
    stock: null,
    availability: "Disponível",
    image: "imagens/cookie-oreo.jpg"
  },
  {
    id: "ovomaltine",
    name: "Cookie Ovomaltine",
    category: "Premium",
    description: "Massa tradicional com gotas de chocolate blend, recheada com creme crocante de Ovomaltine.",
    price: 11,
    stock: null,
    availability: "Disponível",
    image: "imagens/cookie-ovomaltine.jpg"
  },
  {
    id: "pistachela",
    name: "Cookie Pistachela",
    category: "Premium",
    description: "Massa tradicional com gotas de chocolate branco e pedaços de pistache, recheada com creme cremoso de pistache.",
    price: 15,
    stock: null,
    availability: "Disponível",
    image: "imagens/cookie-pistachela.jpg"
  },
  {
    id: "brookie",
    name: "Brookie Nutella",
    category: "Premium",
    description: "Massa tradicional com gotas de chocolate blend, recheada com pedaço de brownie e Nutella.",
    price: 12,
    stock: null,
    availability: "Disponível",
    image: "imagens/cookie-brookie-nutella.jpg"
  },
  {
    id: "kinder",
    name: "Cookie Kinder",
    category: "Premium",
    description: "Massa tradicional com gotas de chocolate blend e chocolate branco, recheada com creme Bueno e finalizada com Kinder Bueno White.",
    price: 12,
    stock: null,
    availability: "Disponível",
    image: "imagens/cookie-kinder.jpg"
  }
];

let cart = {};
let activeCategory = "Todos";

const money = value =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function getStoreTime() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(new Date());

  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return {
    day: weekdayMap[values.weekday],
    time: `${values.hour}:${values.minute}`
  };
}

function minutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function updateStoreStatus() {
  const { day, time } = getStoreTime();
  const schedule = STORE.openingHours[day];
  const status = document.getElementById("storeStatus");
  const todayHours = document.getElementById("todayHours");
  const nextOpening = document.getElementById("nextOpening");

  if (!schedule) {
    status.textContent = "Fechado hoje";
    status.className = "store-status closed";
    todayHours.textContent = "Fechado";
    nextOpening.textContent = "Você ainda pode montar o pedido e solicitar outra data.";
    return;
  }

  const isOpen = minutes(time) >= minutes(schedule.open) && minutes(time) < minutes(schedule.close);
  todayHours.textContent = `${schedule.open} às ${schedule.close}`;

  if (isOpen) {
    status.textContent = "Estamos aceitando pedidos";
    status.className = "store-status open";
    nextOpening.textContent = `Atendimento hoje até ${schedule.close}.`;
  } else {
    status.textContent = "Pedidos encerrados no momento";
    status.className = "store-status closed";
    nextOpening.textContent = `Horário de hoje: ${schedule.open} às ${schedule.close}.`;
  }
}


function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i++;
      row.push(value);
      if (row.some(cell => cell.trim() !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value);
  if (row.some(cell => cell.trim() !== "")) rows.push(row);
  return rows;
}

function parseBrazilianPrice(value) {
  if (!value) return null;
  const normalized = value
    .replace(/R\$/gi, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function normalizeAvailability(value) {
  const text = String(value || "Disponível").trim().toLowerCase();
  if (text === "esgotado") return "Esgotado";
  if (text === "pausado") return "Pausado";
  return "Disponível";
}

function reconcileCartWithStock() {
  let changed = false;

  Object.keys(cart).forEach(id => {
    const product = PRODUCTS.find(item => item.id === id);
    if (!product) {
      delete cart[id];
      changed = true;
      return;
    }

    const unavailable = product.availability !== "Disponível" || product.stock === 0;
    if (unavailable) {
      delete cart[id];
      changed = true;
      return;
    }

    if (product.stock !== null && cart[id] > product.stock) {
      cart[id] = product.stock;
      changed = true;
    }
  });

  if (changed) updateCart();
}

async function loadInventoryFromSheet() {
  try {
    const separator = STORE.inventoryCsvUrl.includes("?") ? "&" : "?";
    const response = await fetch(`${STORE.inventoryCsvUrl}${separator}t=${Date.now()}`, {
      cache: "no-store"
    });

    if (!response.ok) throw new Error(`Falha ao carregar estoque: ${response.status}`);

    const csvText = await response.text();
    const rows = parseCsv(csvText);
    const headerIndex = rows.findIndex(row =>
      row.some(cell => cell.trim().toLowerCase() === "id") &&
      row.some(cell => cell.trim().toLowerCase() === "estoque")
    );

    if (headerIndex === -1) throw new Error("Cabeçalho da planilha não encontrado.");

    const headers = rows[headerIndex].map(cell => cell.trim().toLowerCase());
    const index = {
      id: headers.indexOf("id"),
      name: headers.indexOf("produto"),
      category: headers.indexOf("categoria"),
      price: headers.indexOf("preço"),
      stock: headers.indexOf("estoque"),
      availability: headers.indexOf("disponibilidade"),
      description: headers.indexOf("descrição")
    };

    rows.slice(headerIndex + 1).forEach(row => {
      const id = (row[index.id] || "").trim();
      if (!id) return;

      const product = PRODUCTS.find(item => item.id === id);
      if (!product) return;

      const stockText = (row[index.stock] || "").trim();
      const parsedStock = stockText === "" ? null : Number(stockText.replace(",", "."));
      const price = parseBrazilianPrice(row[index.price]);

      product.stock = Number.isFinite(parsedStock) ? Math.max(0, Math.floor(parsedStock)) : null;
      product.availability = normalizeAvailability(row[index.availability]);

      if (price !== null) product.price = price;
      if (index.name >= 0 && row[index.name]?.trim()) product.name = row[index.name].trim();
      if (index.category >= 0 && row[index.category]?.trim()) product.category = row[index.category].trim();
      if (index.description >= 0 && row[index.description]?.trim()) product.description = row[index.description].trim();
    });

    reconcileCartWithStock();
    renderFilters();
    renderProducts();
  } catch (error) {
    console.error("Não foi possível atualizar o estoque pela planilha.", error);
  }
}

function getCategories() {
  return ["Todos", ...new Set(PRODUCTS.map(product => product.category))];
}

function renderFilters() {
  const wrapper = document.getElementById("categoryFilters");
  wrapper.innerHTML = getCategories().map(category => `
    <button class="filter-button ${activeCategory === category ? "active" : ""}"
      type="button" data-category="${category}">
      ${category}
    </button>
  `).join("");

  wrapper.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderFilters();
      renderProducts();
    });
  });
}

function stockText(product) {
  if (product.availability === "Pausado") return { text: "Indisponível", className: "out" };
  if (product.availability === "Esgotado" || product.stock === 0) {
    return { text: "Esgotado", className: "out" };
  }
  if (product.stock === null) return { text: "Disponível", className: "" };
  if (product.stock <= 3) return { text: `Últimas ${product.stock} unidades`, className: "low" };
  return { text: `${product.stock} disponíveis`, className: "" };
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const visible = activeCategory === "Todos"
    ? PRODUCTS
    : PRODUCTS.filter(product => product.category === activeCategory);

  grid.innerHTML = visible.map(product => {
    const stock = stockText(product);
    return `
      <article class="product-card">
        <div class="product-image">
          ${product.image
            ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
            : `<span class="product-placeholder" aria-hidden="true">🍪</span>`
          }
          <span class="stock-badge ${stock.className}">${stock.text}</span>
        </div>
        <div class="product-content">
          <span class="product-category">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-footer">
            <strong class="product-price">${money(product.price)}</strong>
            <button class="add-button" type="button" data-product="${product.id}"
              ${product.availability !== "Disponível" || product.stock === 0 ? "disabled" : ""}>
              ${product.availability === "Pausado" ? "Indisponível" : (product.availability === "Esgotado" || product.stock === 0 ? "Esgotado" : "Adicionar")}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".add-button:not(:disabled)").forEach(button => {
    button.addEventListener("click", () => addToCart(button.dataset.product));
  });
}

function addToCart(id) {
  const product = PRODUCTS.find(item => item.id === id);
  const current = cart[id] || 0;

  if (product.availability !== "Disponível" || product.stock === 0) {
    alert(`${product.name} está indisponível no momento.`);
    return;
  }

  if (product.stock !== null && current >= product.stock) {
    alert(`Só temos ${product.stock} unidade(s) disponível(is) de ${product.name}.`);
    return;
  }

  cart[id] = current + 1;
  updateCart();
}

function changeQuantity(id, amount) {
  const product = PRODUCTS.find(item => item.id === id);
  const next = (cart[id] || 0) + amount;

  if (next <= 0) {
    delete cart[id];
  } else if (product.availability === "Disponível" && (product.stock === null || next <= product.stock)) {
    cart[id] = next;
  }
  updateCart();
}

function removeFromCart(id) {
  delete cart[id];
  updateCart();
}

function cartSummary() {
  return Object.entries(cart).map(([id, quantity]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return { ...product, quantity, subtotal: product.price * quantity };
  });
}

function updatePaymentTotals() {
  const items = cartSummary();
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const payment = document.getElementById("paymentMethod")?.value || "";
  const isCreditCard = payment === "Cartão de crédito (taxa de 4,2%)";
  const finalTotal = isCreditCard ? subtotal / (1 - STORE.creditCardFeeRate) : subtotal;
  const fee = finalTotal - subtotal;

  const feeLine = document.getElementById("cardFeeLine");
  const finalLine = document.getElementById("finalTotalLine");

  if (feeLine && finalLine) {
    feeLine.classList.toggle("hidden", !isCreditCard);
    finalLine.classList.toggle("hidden", !isCreditCard);
    document.getElementById("cardFee").textContent = money(fee);
    document.getElementById("finalTotal").textContent = money(finalTotal);
  }

  return { subtotal, fee, finalTotal, isCreditCard };
}

function updateCart() {
  const items = cartSummary();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("floatingTotal").textContent = money(total);
  updatePaymentTotals();
  document.getElementById("floatingCart").classList.toggle("visible", count > 0);
  document.getElementById("emptyCart").style.display = count ? "none" : "block";
  document.getElementById("checkoutForm").classList.toggle("visible", count > 0);

  document.getElementById("cartItems").innerHTML = items.map(item => `
    <article class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <small>${money(item.price)} cada • ${money(item.subtotal)}</small>
        <button class="remove-item" type="button" data-remove="${item.id}">Remover</button>
      </div>
      <div class="quantity-controls">
        <button type="button" aria-label="Diminuir" data-change="${item.id}" data-amount="-1">−</button>
        <strong>${item.quantity}</strong>
        <button type="button" aria-label="Aumentar" data-change="${item.id}" data-amount="1">+</button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-change]").forEach(button => {
    button.addEventListener("click", () =>
      changeQuantity(button.dataset.change, Number(button.dataset.amount))
    );
  });
  document.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => removeFromCart(button.dataset.remove));
  });
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function toggleAddressFields() {
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  document.getElementById("addressFields").classList.toggle(
    "hidden",
    delivery !== "Ohcookies solicita Uber/99"
  );
}

function validateOrder() {
  const name = document.getElementById("customerName").value.trim();
  const date = document.getElementById("orderDate").value;
  const time = document.getElementById("orderTime").value;
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const payment = document.getElementById("paymentMethod").value;
  const address = document.getElementById("customerAddress").value.trim();
  const message = document.getElementById("formMessage");

  if (!cartSummary().length) return "Adicione pelo menos um produto.";
  if (!name) return "Informe seu nome.";
  if (!date) return "Escolha a data desejada.";
  if (!time) return "Escolha o horário desejado.";
  if (!payment) return "Selecione a forma de pagamento.";
  if (delivery === "Ohcookies solicita Uber/99" && !address) {
    return "Informe o endereço para consultarmos a entrega.";
  }

  message.textContent = "";
  return "";
}

function finishOrder() {
  const error = validateOrder();
  const message = document.getElementById("formMessage");
  if (error) {
    message.textContent = error;
    return;
  }

  const items = cartSummary();
  const totals = updatePaymentTotals();
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const dateRaw = document.getElementById("orderDate").value;
  const [year, month, day] = dateRaw.split("-");
  const formattedDate = `${day}/${month}/${year}`;

  const lines = [
    "Olá, Ohcookies! 🍪",
    "",
    "*NOVO PEDIDO PELO CARDÁPIO*",
    `*Cliente:* ${document.getElementById("customerName").value.trim()}`,
    "",
    "*Itens:*",
    ...items.map(item => `• ${item.quantity}x ${item.name} — ${money(item.subtotal)}`),
    "",
    `*Total dos produtos:* ${money(totals.subtotal)}`,
    ...(totals.isCreditCard
      ? [
          `*Taxa do cartão (4,2%):* ${money(totals.fee)}`,
          `*Total com cartão:* ${money(totals.finalTotal)}`
        ]
      : []),
    `*Data desejada:* ${formattedDate}`,
    `*Horário desejado:* ${document.getElementById("orderTime").value}`,
    `*Prazo de preparo:* cerca de 30 minutos após a confirmação`,
    `*Recebimento:* ${delivery}`,
    `*Pagamento:* ${document.getElementById("paymentMethod").value}`
  ];

  if (delivery === "Ohcookies solicita Uber/99") {
    lines.push(`*Endereço:* ${document.getElementById("customerAddress").value.trim()}`);
    const reference = document.getElementById("customerReference").value.trim();
    if (reference) lines.push(`*Bairro/referência:* ${reference}`);
  }

  const notes = document.getElementById("orderNotes").value.trim();
  if (notes) lines.push(`*Observações:* ${notes}`);

  lines.push(
    "",
    ...(totals.isCreditCard ? ["_Pagamento no cartão inclui taxa de 4,2%._"] : []),
    "_A taxa de entrega será confirmada separadamente._",
    "",
    "Aguardo a confirmação do pedido 😊"
  );

  const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function formatDateISOInStore(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: STORE.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function getWeekdayForDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.getDay();
}

function roundUpToInterval(totalMinutes, interval) {
  return Math.ceil(totalMinutes / interval) * interval;
}

function buildAvailableTimes() {
  const dateInput = document.getElementById("orderDate");
  const timeSelect = document.getElementById("orderTime");
  const help = document.getElementById("timeHelp");
  const dateValue = dateInput.value;

  timeSelect.innerHTML = "";

  if (!dateValue) {
    timeSelect.innerHTML = '<option value="">Escolha primeiro a data</option>';
    help.textContent = "Horários disponíveis de terça a domingo, das 13h às 18h.";
    return;
  }

  const weekday = getWeekdayForDate(dateValue);
  const schedule = STORE.openingHours[weekday];

  if (!schedule) {
    timeSelect.innerHTML = '<option value="">Não atendemos nesta data</option>';
    help.textContent = "Não atendemos às segundas-feiras. Escolha outra data.";
    return;
  }

  let start = minutes(schedule.open);
  const end = minutes(schedule.close);
  const today = formatDateISOInStore();

  if (dateValue === today) {
    const storeNow = getStoreTime();
    const [currentHour, currentMinute] = storeNow.time.split(":").map(Number);
    const earliest = roundUpToInterval(
      currentHour * 60 + currentMinute + STORE.preparationMinutes,
      STORE.slotIntervalMinutes
    );
    start = Math.max(start, earliest);
  }

  const options = [];
  for (let total = start; total <= end; total += STORE.slotIntervalMinutes) {
    const hour = String(Math.floor(total / 60)).padStart(2, "0");
    const minute = String(total % 60).padStart(2, "0");
    const value = `${hour}:${minute}`;
    options.push(`<option value="${value}">${value}</option>`);
  }

  if (!options.length) {
    timeSelect.innerHTML = '<option value="">Sem horários disponíveis hoje</option>';
    help.textContent = "O atendimento de hoje foi encerrado. Escolha outra data.";
    return;
  }

  timeSelect.innerHTML = '<option value="">Selecione um horário</option>' + options.join("");
  help.textContent = dateValue === today
    ? "Os horários já consideram cerca de 30 minutos para o preparo."
    : `Horários disponíveis das ${schedule.open} às ${schedule.close}.`;
}

function setMinimumDate() {
  const today = formatDateISOInStore();
  const dateInput = document.getElementById("orderDate");
  dateInput.min = today;
  dateInput.addEventListener("change", buildAvailableTimes);
  buildAvailableTimes();
}

document.getElementById("cartShortcut").addEventListener("click", openCart);
document.getElementById("floatingCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("drawerOverlay").addEventListener("click", closeCart);
document.getElementById("paymentMethod").addEventListener("change", updatePaymentTotals);
document.getElementById("finishOrder").addEventListener("click", finishOrder);
document.querySelectorAll('input[name="delivery"]').forEach(input =>
  input.addEventListener("change", toggleAddressFields)
);

updateStoreStatus();
renderFilters();
renderProducts();
updateCart();
setMinimumDate();
loadInventoryFromSheet();
setInterval(updateStoreStatus, 60_000);
setInterval(loadInventoryFromSheet, STORE.inventoryRefreshMinutes * 60_000);
