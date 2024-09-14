
var comingQty = document.getElementById('comingQty');
var comingPrice = document.getElementById('comingPrice');
var comingNote = document.getElementById('comingNote');
var goingQty = document.getElementById('goingQty');
var goingPrice = document.getElementById('goingPrice');
var goingNote = document.getElementById('goingNote');
var comingProduct = document.getElementById('comingProduct');
var goingProduct = document.getElementById('goingProduct');
var goingDate = document.getElementById('goingDate');
var comingDate = document.getElementById('comingDate');
var stockDiv = document.getElementById('stockDiv');
var itemStockDivHtml = '';
var itemStockTableHtml = '';
let index = 0;
var products = [];
var productStockTotal = {};
var productStockDetail = {};
var updateProduct = '';
var oldProduct = '';
updateDate();  
loadFromLocalStorage();

function loadFromLocalStorage() {
    const savedProducts = JSON.parse(localStorage.getItem('products'));
    const savedStockTotal = JSON.parse(localStorage.getItem('productStockTotal'));
    const savedStockDetail = JSON.parse(localStorage.getItem('productStockDetail'));

    if (savedProducts) {
        products = savedProducts;
        productStockTotal = savedStockTotal || {};
        productStockDetail = savedStockDetail || {};

        products.forEach(product => {
            // Re-create the UI
            document.getElementById('comingProduct').innerHTML += `<option>${product}</option>`;
            document.getElementById('goingProduct').innerHTML += `<option>${product}</option>`;
            document.getElementById('productSelect').innerHTML += `<option>${product}</option>`;
            document.getElementById('stockTableBody').innerHTML += `<tr><td>${product}</td><td id="${product}StockTd">${productStockTotal[product] || 0}</td></tr>`;
            
            // Create the detailed stock div
            itemStockDivHtml = `<div hidden id="${product}StockDiv" class="itemStockDiv">
                <h2 class="productNameH2">${product}</h2>
                <h2 class="productStockH2" id="${product}StockHeading">Stock: ${productStockTotal[product] || 0}</h2>
                <table>
                    <thead>
                        <th style="min-width:85px;">Date</th>
                        <th style="min-width:152px;">Notes</th>
                        <th>Coming</th>
                        <th>Going</th>
                        <th>Price</th>
                        <th style="min-width:152px;">Purchasing Amount</th>
                    </thead>
                    <tbody id="${product}StockTable" class="itemStockTable"></tbody>
                </table>
            </div>`;
            stockDiv.innerHTML += itemStockDivHtml;

            // Populate stock detail table
            if (productStockDetail[product]) {
                productStockDetail[product].forEach(detail => {
                    const stockTable = document.getElementById(`${product}StockTable`);
                    stockTable.innerHTML += `<tr>
                        <td>${detail.date || ''}</td>
                        <td>${detail.note || ''}</td>
                        <td>${detail.quantity || ''}</td>
                        <td>${detail.going || ''}</td>
                        <td>${detail.price || ''}</td>
                        <td>${detail.purchasingAmount || ''}</td>
                    </tr>`;
                });
            }
        });
    }
}

function saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('productStockTotal', JSON.stringify(productStockTotal));
    localStorage.setItem('productStockDetail', JSON.stringify(productStockDetail));
}
function displayProduct() {
    if(oldProduct != '') {
        document.getElementById(oldProduct + `StockDiv`).hidden = true;
    }
    var currentProduct = document.getElementById('productSelect').value;
    document.getElementById(currentProduct + `StockDiv`).hidden = false;
    oldProduct = currentProduct;
}
function addProduct() {
    var productName = document.getElementById('addProductInput').value;
    if (productName == '') { return false; }

    if (products.includes(productName)) {
        alert('Product already exists');
        return false;
    }


    products.push(productName);
    productStockTotal[productName] = 0;
    productStockDetail[productName] = [];
    
    updateUIAfterAddingProduct(productName);
    saveToLocalStorage(); // Save updated data
    document.getElementById('addProductInput').value = '';
}

function updateUIAfterAddingProduct(productName) {
    document.getElementById('comingProduct').innerHTML += `<option>${productName}</option>`;
    document.getElementById('goingProduct').innerHTML += `<option>${productName}</option>`;
    document.getElementById('productSelect').innerHTML += `<option>${productName}</option>`;
    document.getElementById('stockTableBody').innerHTML += `<tr><td>${productName}</td><td id="${productName}StockTd">0</td></tr>`;

    itemStockDivHtml = `<div hidden id="${productName}StockDiv" class="itemStockDiv">
        <h2 class="productNameH2">${productName}</h2>
        <h2 class="productStockH2" id="${productName}StockHeading">Stock: 0</h2>
        <table>
            <thead>
                <th style="min-width:85px;">Date</th>
                <th style="min-width:152px;">Notes</th>
                <th>Coming</th>
                <th>Going</th>
                <th>Price</th>
                <th style="min-width:152px;">Purchasing Amount</th>
            </thead>
            <tbody id="${productName}StockTable" class="itemStockTable"></tbody>
        </table>
    </div>`;
    stockDiv.innerHTML += itemStockDivHtml;
}


function coming() {
    updateProduct = comingProduct.value;
    var isDecimal = comingQty.value != Math.trunc(comingQty.value);
    if (comingProduct.value === '' || comingQty.value === '' || comingPrice.value === '') {
        alert('Incomplete details'); return false; 
    } else if (isDecimal || comingPrice.value < 1 || comingQty.value < 1) {
        alert('Incorrect details'); return false; 
    } else {
        index += 1;
        var productStockTable = document.getElementById(comingProduct.value + `StockTable`);
        var qty = comingQty.value;
        itemStockTableHtml = 
            `<tr>
                <td>${comingDate.value}</td>
                <td>${comingNote.value}</td>
                <td id="${index}coming">${qty}</td>
                <td></td>
                <td>${comingPrice.value}</td>
                <td>${parseInt(comingPrice.value) * parseInt(qty)}</td>
            </tr>`;
        productStockTable.innerHTML += itemStockTableHtml;

        productStockTotal[comingProduct.value] += parseInt(qty);
        productStockDetail[comingProduct.value].push({
            quantity: parseInt(qty),
            price: parseInt(comingPrice.value),
            note: comingNote.value,
            date: comingDate.value,
            id: index + 'coming',
            purchasingAmount: parseInt(comingPrice.value) * parseInt(qty)
        });

        // Save updated data to local storage
        saveToLocalStorage(); // Save updated data
        document.getElementById('comingForm').reset();
        renderStockTotal();
        updateDate();
    }
}

function going() {
    updateProduct = goingProduct.value;
    var isDecimal = goingQty.value != Math.trunc(goingQty.value);
    
    if (goingProduct.value === '' || goingQty.value === '') {
        alert('Incomplete details'); 
        return false;
    } else if (isDecimal || goingQty.value < 1) {
        alert('Incorrect details'); 
        return false;
    } else if (goingQty.value > productStockTotal[goingProduct.value]) {
        alert('Not enough stock'); 
        return false; // Ensure you have enough stock before processing the going transaction.
    } else {
        var productStockTable = document.getElementById(goingProduct.value + `StockTable`);
        var goingQuantity = parseInt(goingQty.value);

        while (goingQuantity > 0 && productStockDetail[goingProduct.value].length > 0) {
            // Access the latest stock entry
            let stockDetail = productStockDetail[goingProduct.value][0];

            // Determine the quantity to deduct
            let availableStock = stockDetail.quantity;
            let deductedQuantity = Math.min(availableStock, goingQuantity);

            // Update the HTML table
            itemStockTableHtml = `<tr>
                <td>${goingDate.value}</td>
                <td>${goingNote.value}</td>
                <td></td>
                <td>${deductedQuantity}</td>
                <td>${goingPrice.value}</td>
                <td>${stockDetail.price}</td>
            </tr>`;
            productStockTable.innerHTML += itemStockTableHtml;

            // Deduct the stock
            productStockTotal[goingProduct.value] -= deductedQuantity;
            stockDetail.quantity -= deductedQuantity;
            goingQuantity -= deductedQuantity;

            // Update the UI for remaining quantity
            if (stockDetail.quantity === 0) {
                productStockDetail[goingProduct.value].splice(0, 1); // Remove this entry if quantity is zero
            }
        }

        // Save updated data to local storage
        saveToLocalStorage(); 
        document.getElementById('goingForm').reset();
        renderStockTotal();
        updateDate();
    }
}

function renderStockTotal() {
    document.getElementById(updateProduct + `StockTd`).innerHTML = productStockTotal[updateProduct];
    document.getElementById(updateProduct + `StockHeading`).innerHTML = 'Stock: ' + productStockTotal[updateProduct];
}
function updateDate() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('goingDate').value = formattedDate;
    document.getElementById('comingDate').value = formattedDate;
}

function checkEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addProduct();
    }
}
