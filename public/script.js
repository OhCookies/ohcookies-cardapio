/*
  OHCOOKIES — CONFIGURAÇÃO PRINCIPAL
  Altere os dados abaixo para atualizar o cardápio.
*/

const STORE = {
  whatsapp: "5521996288285",
  timezone: "America/Sao_Paulo",
  instagram: "@ohcookie.s",
  minimumOrder: 0,
  openingHours: {
    // 0 = domingo, 1 = segunda ... 6 = sábado
    0: null,
    1: { open: "10:00", close: "18:00" },
    2: { open: "10:00", close: "18:00" },
    3: { open: "10:00", close: "18:00" },
    4: { open: "10:00", close: "18:00" },
    5: { open: "10:00", close: "18:00" },
    6: { open: "10:00", close: "14:00" }
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
    category: "Clássicos",
    description: "Massa artesanal amanteigada com gotas de chocolate.",
    price: 10,
    stock: 10,
    image: ""
  },
  {
    id: "nutella",
    name: "Cookie Nutella",
    category: "Recheados",
    description: "Cookie artesanal com recheio cremoso de Nutella.",
    price: 12,
    stock: 8,
    image: ""
  },
  {
    id: "oreo",
    name: "Cookie Oreo",
    category: "Especiais",
    description: "Massa com pedaços de Oreo e recheio cremoso.",
    price: 12,
    stock: 6,
    image: ""
  },
  {
    id: "black-white",
    name: "Cookie Black White",
    category: "Especiais",
    description: "Combinação intensa de chocolate com recheio branco.",
    price: 12,
    stock: 4,
    image: ""
  },
  {
    id: "red-velvet",
    name: "Cookie Red Velvet",
    category: "Especiais",
    description: "Massa red velvet macia e recheio branco cremoso.",
    price: 12,
    stock: 5,
    image: ""
  },
  {
    id: "ninho-nutella",
    name: "Cookie Ninho c/ Nutella",
    category: "Recheados",
    description: "A combinação de leite Ninho com Nutella em um cookie irresistível.",
    price: 13,
    stock: 5,
    image: ""
  },
  {
    id: "brookie",
    name: "Brookie Nutella",
    category: "Premium",
    description: "Cookie com brownie e recheio cremoso de Nutella.",
    price: 15,
    stock: 4,
    image: ""
  },
  {
    id: "pistachela",
    name: "Cookie Pistachela",
    category: "Premium",
    description: "Massa com chocolate branco e pistache, recheada com creme de pistache.",
    price: 16,
    stock: 3,
    image: ""
  },
  {
    id: "ovomaltine",
    name: "Cookie Ovomaltine",
    category: "Premium",
    description: "Cookie crocante e cremoso com o sabor marcante de Ovomaltine.",
    price: 15,
    stock: 0,
    image: ""
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
  if (product.stock <= 0) return { text: "Esgotado", className: "out" };
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
              ${product.stock <= 0 ? "disabled" : ""}>
              ${product.stock <= 0 ? "Esgotado" : "Adicionar"}
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

  if (current >= product.stock) {
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
  } else if (next <= product.stock) {
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

function updateCart() {
  const items = cartSummary();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("floatingTotal").textContent = money(total);
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
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
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
    `*Total dos produtos:* ${money(total)}`,
    `*Data desejada:* ${formattedDate}`,
    `*Horário desejado:* ${document.getElementById("orderTime").value}`,
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
    "_A taxa de entrega será confirmada separadamente._",
    "",
    "Aguardo a confirmação do pedido 😊"
  );

  const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function setMinimumDate() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: STORE.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
  document.getElementById("orderDate").min = today;
}

document.getElementById("cartShortcut").addEventListener("click", openCart);
document.getElementById("floatingCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("drawerOverlay").addEventListener("click", closeCart);
document.getElementById("finishOrder").addEventListener("click", finishOrder);
document.querySelectorAll('input[name="delivery"]').forEach(input =>
  input.addEventListener("change", toggleAddressFields)
);

updateStoreStatus();
renderFilters();
renderProducts();
updateCart();
setMinimumDate();
setInterval(updateStoreStatus, 60_000);
