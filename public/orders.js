
// Store order data in memory
let orderIDForEdit = null;
let orderIDForDelete = null;

// Show the Add Order Form
function showAddOrderForm() {
    document.getElementById("addOrderFormContainer").style.display = "block";
}

// Hide the Add Order Form
function hideAddOrderForm() {
    document.getElementById("addOrderFormContainer").style.display = "none";
    document.getElementById("addOrderForm").reset();
}

// Add a new plant row
function addPlantRow() {
    const plantsContainer = document.getElementById("plantsContainer");

    const plantRow = document.createElement("div");
    plantRow.classList.add("plant-row");

    const plantOptions = plants.map(plant => {
        return `<option value="${plant.plantID}">${plant.plantName}</option>`;
    }).join('');

    plantRow.innerHTML = `
        <select class="plant-select">
            ${plantOptions}
        </select>
        <input type="number" class="plant-quantity" placeholder="Quantity" required>
        <button type="button" onclick="removePlantRow(this)">Remove</button>
    `;

    plantsContainer.appendChild(plantRow);
}

// Remove a plant row
function removePlantRow(button) {
    const plantRow = button.parentElement;
    plantRow.remove();
}

// Add a new order
async function addOrder() {
    const orderDate = document.getElementById("orderDate").value;
    const customerID = document.getElementById("customerID").value;
    const isDelivery = document.getElementById("isDelivery").checked ? 1 : 0;
  
    let itemQuantity = 0;
    let orderPrice = 0.0;
  
    // Collect plant quantities and calculate totals
    const plantRows = document.querySelectorAll(".plant-row");
    const plants = [];
    plantRows.forEach(row => {
      const input = row.querySelector("input[type='number']");
      const priceInput = row.querySelector("input[type='hidden']");
      const quantity = parseInt(input.value, 10) || 0;
      const price = parseFloat(priceInput.value);
  
      if (quantity > 0) {
        itemQuantity += quantity;
        orderPrice += quantity * price;
        plants.push({
          plantID: input.id.split('-')[1], // Extract plantID
          quantity,
        });
      }
    });
  
    // Validate the order data
    if (!orderDate || !customerID || plants.length === 0) {
      alert("Please complete all required fields and add at least one plant.");
      return;
    }
  
    const orderData = { orderDate, orderPrice, itemQuantity, isDelivery, customerID, plants };
  
    try {
      const response = await fetch('/orders/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
  
      alert("Order added successfully!");
      location.reload();
    } catch (error) {
      console.error("Error adding order:", error);
      alert(`Error adding order: ${error.message}`);
    }
  }
