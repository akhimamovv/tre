let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// изменить количество
function changeCount(name, spicy, table, delta) {
  const idx = cart.findIndex(it => it.name === name && it.spicy === spicy && it.table === table);
  if (idx === -1) return;
  cart[idx].count += delta;
  if (cart[idx].count <= 0) cart.splice(idx, 1);
  saveCart();
  loadCart();
}

function escapeQuotes(s) {
  return s.replace(/'/g, "\\'");
}

function loadCart() {
  const container = document.getElementById("tablesContainer");
  container.innerHTML = "";
  let overallTotal = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p style='text-align:center'>Корзина пуста</p>";
    document.getElementById("overallTotal").innerText = "Общий итог: 0 тг";
    return;
  }

  // сгруппируем по столам
  const tables = {};
  cart.forEach(item => {
    if (!tables[item.table]) tables[item.table] = [];
    tables[item.table].push(item);
  });

  Object.keys(tables).forEach(table => {
    const items = tables[table];
    let tableTotal = 0;

    const tableCard = document.createElement("div");
    tableCard.className = "table-card";

    let html = `<h3>Стол ${table}</h3>`;
    html += `<table><tr><th>Название</th><th>Цена</th><th>Острота</th><th>Кол-во</th><th>Сумма</th></tr>`;

    items.forEach(item => {
      tableTotal += item.price * item.count;
      const spicyName = item.spicy === "none" ? "-" : (item.spicy === "not" ? "Не острое" : item.spicy === "medium" ? "Среднее" : "Острое");
      html += `<tr>
        <td>${item.name}</td>
        <td>${item.price} тг</td>
        <td>${spicyName}</td>
        <td>
          <button onclick="changeCount('${escapeQuotes(item.name)}','${item.spicy}','${table}',-1)" class="minus">-</button>
          ${item.count}
          <button onclick="changeCount('${escapeQuotes(item.name)}','${item.spicy}','${table}',1)" class="plus">+</button>
        </td>
        <td>${item.price * item.count} тг</td>
      </tr>`;
    });

    html += `</table>`;
    html += `<div class="table-total">Итого по столу: ${tableTotal} тг</div>`;
    tableCard.innerHTML = html;
    container.appendChild(tableCard);

    overallTotal += tableTotal;
  });

  document.getElementById("overallTotal").innerText = `Общий итог: ${overallTotal} тг`;
}

document.getElementById("clearCart").addEventListener("click", () => {
  if (!confirm("Очистить всю корзину?")) return;
  cart = [];
  saveCart();
  loadCart();
});

window.changeCount = changeCount;
loadCart();
