# 🧾 QuickBill Invoice Maker

A dynamic invoice and receipt generator. Enter customer details, add line items, and the invoice updates instantly with line totals, subtotal, 18% GST and grand total. One click prints it or saves it as a PDF.

Built with plain HTML, CSS and JavaScript: no frameworks, libraries or CDNs.

**Live demo:** _add your Vercel link here_

## Features

- Customer name, invoice date and invoice number, with today's date and an invoice number filled in automatically
- Add items with a name, quantity and unit price
- Form validation: the name can't be empty, and quantity and price must be positive numbers
- Line totals calculated automatically
- Delete any row with its ✕ button
- Live Subtotal, GST (18%) and Grand Total
- **Print Invoice:** opens the browser's print dialog; choose "Save as PDF" to export
- Print layout hides the form and buttons, leaving a clean A4 invoice
- Two-column layout on desktop that stacks into one column on phones

## How to run

No install needed. Double-click `index.html` to open it in any browser.

To export a PDF, click **Print Invoice** and choose **Save as PDF** as the printer.

## How it works

The app follows a **single source of truth** pattern. All items live in one JavaScript array:

```js
items = [{ id, name, qty, price, lineTotal }, ...]
```

The table on screen is only a copy of that array. Data always flows one way:

```
form input → items array → renderTable() → table on screen
```

1. **Validation:** the form values are read and converted with `parseFloat()`. Input values are always text, and without this `"2" + "50"` would give `"250"`.
2. **Push to state:** a new item object is added to the `items` array.
3. **Re-render:** `renderTable()` empties the table body and rebuilds every row from the array.
4. **Totals:** `items.reduce()` adds up the line totals, then 18% tax and the grand total are calculated.

**Deleting uses event delegation.** Instead of a click listener on every ✕ button, there's one listener on the table body. It checks whether a `.delete-btn` was clicked, reads that button's `data-id`, removes the item with `items.filter()` and re-renders.

**Printing uses `@media print`.** Those CSS rules only apply when printing, and they hide the form, buttons and delete column.

## Concepts covered

Arrays of objects as state · form validation · `parseFloat` · template literals · `insertAdjacentHTML` · `Array.reduce()` · `Array.filter()` · event delegation · `data-*` attributes · `@media print` · `window.print()` · CSS Grid · media queries

## Files

```
quick-bill/
├── index.html   # editor form, invoice preview, items table, totals
├── style.css    # two-column layout, zebra table, print stylesheet
└── script.js    # items array, validation, rendering, totals, delete, print
```
