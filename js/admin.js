let menu = JSON.parse(localStorage.getItem("menu")) || [];

function saveMenu() {
  localStorage.setItem("menu", JSON.stringify(menu));
}

// показать/скрыть чекбокс остроты только для еды
const categorySelect = document.getElementById("category");
const spicyLabel = document.getElementById("spicyLabel");

function updateSpicyVisibility() {
  if (categorySelect.value === "food") {
    spicyLabel.style.display = "flex";
  } else {
    spicyLabel.style.display = "none";
    document.getElementById("hasSpicy").checked = false;
  }
}

categorySelect.addEventListener("change", updateSpicyVisibility);
updateSpicyVisibility();

// добавление блюда
document.getElementById("addBtn").addEventListener("click", () => {
  const img = document.getElementById("img").value;
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const hasSpicy = document.getElementById("hasSpicy").checked;

  if (!img || !name || !price) {
    alert("Заполните все поля!");
    return;
  }

  menu.push({
    img,
    name,
    price: Number(price),
    category,
    hasSpicy: category === "food" ? hasSpicy : false
  });

  saveMenu();
  renderAdminList();

  // очистка формы
  document.getElementById("img").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("hasSpicy").checked = false;
});

// показать список добавленных блюд
function renderAdminList() {
  const list = document.getElementById("adminList");
  list.innerHTML = "";
  menu.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "admin-item";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="admin-item-info">
        <strong>${item.name}</strong><br>
        ${item.price} тг — ${item.category} ${item.hasSpicy ? "🌶️" : ""}
      </div>
      <div class="admin-item-actions">
        <button onclick="deleteDish(${index})">Удалить</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function deleteDish(i) {
  if (confirm("Удалить блюдо?")) {
    menu.splice(i, 1);
    saveMenu();
    renderAdminList();
  }
}

renderAdminList();
