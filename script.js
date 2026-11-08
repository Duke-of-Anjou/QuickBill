const TAX_RATE = 0.18; // 18% GST

// ---------- State store (the single source of truth) ----------
let items = [];
// Seeded from Date.now() but incremented, so two items added in the same millisecond never share an id
let nextId = Date.now();

// ---------- DOM references ----------
const itemForm = document.getElementById("item-form");
const itemNameInput = document.getElementById("item-name");
const itemQtyInput = document.getElementById("item-qty");
const itemPriceInput = document.getElementById("item-price");
const formError = document.getElementById("form-error");
const tbody = document.getElementById("items-body");
const emptyState = document.getElementById("empty-state");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const grandTotalEl = document.getElementById("grand-total");
const printBtn = document.getElementById("print-btn");
const clearBtn = document.getElementById("clear-btn");

const customerInput = document.getElementById("customer-name");
const dateInput = document.getElementById("invoice-date");
const numberInput = document.getElementById("invoice-number");
const previewCustomer = document.getElementById("preview-customer");
const previewDate = document.getElementById("preview-date");
const previewNumber = document.getElementById("preview-number");

// ---------- Helpers ----------
function formatMoney(amount) {
    return "₹" + amount.toFixed(2);
}

// Item names go into innerHTML, so escape them to stop "<b>" etc. from becoming real tags
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Step 1 + 2: Validate the form, then push a new object into the state array
function addItem(event) {
    event.preventDefault();

    const name = itemNameInput.value.trim();
    // HTML input values are always strings - cast them to numbers immediately
    const qty = parseFloat(itemQtyInput.value);
    const price = parseFloat(itemPriceInput.value);

    if (name === "") {
        formError.textContent = "Please enter an item name.";
        itemNameInput.focus();
        return;
    }
    if (isNaN(qty) || qty <= 0) {
        formError.textContent = "Quantity must be a positive number.";
        itemQtyInput.focus();
        return;
    }
    if (isNaN(price) || price <= 0) {
        formError.textContent = "Unit price must be a positive number.";
        itemPriceInput.focus();
        return;
    }

    formError.textContent = "";
    items.push({
        id: nextId++,
        name: name,
        qty: qty,
        price: price,
        lineTotal: qty * price
    });

    itemForm.reset();
    itemQtyInput.value = 1;
    itemNameInput.focus();
    renderTable();
}

// Step 3: Wipe the tbody and rebuild every row from the array
function renderTable() {
    tbody.innerHTML = "";

    items.forEach((item) => {
        const row = `
            <tr>
                <td>${escapeHtml(item.name)}</td>
                <td class="num">${item.qty}</td>
                <td class="num">${formatMoney(item.price)}</td>
                <td class="num">${formatMoney(item.lineTotal)}</td>
                <td class="delete-col">
                    <button type="button" class="delete-btn" data-id="${item.id}" aria-label="Delete ${escapeHtml(item.name)}">✕</button>
                </td>
            </tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
    });

    emptyState.classList.toggle("hidden", items.length > 0);
    updateTotals();
}

// Step 4: Tally math with Array.reduce()
function updateTotals() {
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const tax = subtotal * TAX_RATE;
    const grandTotal = subtotal + tax;

    subtotalEl.textContent = formatMoney(subtotal);
    taxEl.textContent = formatMoney(tax);
    grandTotalEl.textContent = formatMoney(grandTotal);
}

// Event delegation: one listener on the tbody handles every delete button, even future ones
tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        items = items.filter((item) => item.id !== id);
        renderTable();
    }
});

// ---------- Customer details -> live preview ----------
function updatePreview() {
    previewCustomer.textContent = customerInput.value.trim() || "—";
    previewNumber.textContent = numberInput.value.trim() || "—";

    if (dateInput.value) {
        const date = new Date(dateInput.value + "T00:00:00");
        previewDate.textContent = date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    } else {
        previewDate.textContent = "—";
    }
}

function setDefaults() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    numberInput.value = `INV-${yyyy}${mm}${dd}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
    updatePreview();
}

// ---------- Event listeners ----------
itemForm.addEventListener("submit", addItem);
customerInput.addEventListener("input", updatePreview);
dateInput.addEventListener("input", updatePreview);
numberInput.addEventListener("input", updatePreview);

clearBtn.addEventListener("click", () => {
    if (items.length === 0 || confirm("Remove all items from this invoice?")) {
        items = [];
        renderTable();
    }
});

// Built-in browser print -> "Save as PDF" with zero libraries
printBtn.addEventListener("click", () => {
    if (items.length === 0) {
        formError.textContent = "Add at least one item before printing.";
        return;
    }
    window.print();
});

setDefaults();
renderTable();
