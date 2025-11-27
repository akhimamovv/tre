let menu = JSON.parse(localStorage.getItem("menu")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "food";
let selectedTable = null;

// выбор стола
const tableSelect = document.getElementById("tableNumber");
tableSelect.value = localStorage.getItem("selectedTable") || "";
selectedTable = tableSelect.value;

tableSelect.addEventListener("change", () => {
  selectedTable = tableSelect.value;
  localStorage.setItem("selectedTable", selectedTable);
});

// вкладки категорий
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    renderMenu();
  });
});

// добавить в корзину - ИСПРАВЛЕННАЯ ВЕРСИЯ
function addToCart(filteredIndex) {
  if (!selectedTable) {
    alert("Выберите стол!");
    return;
  }

  // Находим блюдо в отфильтрованном массиве
  const filtered = menu.filter(item => item.category === currentCategory);
  const dish = filtered[filteredIndex];
  
  // Находим индекс этого блюда в исходном массиве menu
  const originalIndex = menu.findIndex(item => 
    item.name === dish.name && 
    item.category === dish.category && 
    item.price === dish.price
  );

  let chosenSpicy = "none";

  if (dish.hasSpicy) {
    const sel = document.getElementById(`spicySelect_${filteredIndex}`);
    if (sel) {
      chosenSpicy = sel.value;
    }
  }

  let found = cart.find(it => it.name === dish.name && it.spicy === chosenSpicy && it.table === selectedTable);

  if (found) found.count++;
  else cart.push({ 
    name: dish.name, 
    price: dish.price, 
    spicy: chosenSpicy, 
    count: 1, 
    table: selectedTable 
  });

  console.log("Корзина после добавления:", cart);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Добавлено в корзину для стола ${selectedTable}`);
}

// отображение меню
function renderMenu() {
  const box = document.getElementById("menu");
  box.innerHTML = "";

  const filtered = menu.filter(item => item.category === currentCategory);
  if (filtered.length === 0) {
    box.innerHTML = "<p style='text-align:center'>Нет блюд в этой категории.</p>";
    return;
  }

  filtered.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "card";

    let spicyHTML = "";
    if (item.hasSpicy) {
      spicyHTML = `
        <label class="spicy-row">
          <span class="spicy-label">Выбрать остроту:</span>
          <select id="spicySelect_${i}" class="spicy-select">
            <option value="not">Не острое</option>
            <option value="medium">Среднее</option>
            <option value="hot">Острое</option>
          </select>
        </label>
      `;
    }

    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <div class="meta-row">
        <div class="price">${item.price} тг</div>
      </div>
      ${item.hasSpicy ? `<div class="badge">Есть острота</div>` : ""}
      ${spicyHTML}
      <button onclick="addToCart(${i})" class="go-cart" style="margin-top:10px;">Добавить в корзину</button>
    `;

    box.appendChild(card);
  });
}

window.addToCart = addToCart;
renderMenu();