
// Store order data in memory
let orderIDForEdit = null;
let orderIDForDelete = null;

// Show the Add Order Form
function showAddOrderForm() {
    document.getElementById("addOrderFormContainer").style.display = "block";
    populatePlantsContainer();
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


async function deleteOrder(orderID) {
    if (!confirm(`Are you sure you want to delete order #${orderID}?`)) {
        return; // User canceled the deletion
    }
  
    try {
        const response = await fetch(`/orders/${orderID}`, {
            method: 'DELETE',
        });
  
        if (!response.ok) {
            throw new Error('Failed to delete order.');
        }
  
        alert('Order successfully deleted!');
        location.reload(); // Refresh the page to update the order list
        } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order. Please try again.');
        }
    }

function populatePlantsContainer(orderPlants = {}) {
    const plantsContainer = document.getElementById("plantsContainer");
    plantsContainer.innerHTML = ""; // Clear existing rows

    // Create a map for all plants and include quantities if in the order
    plants.forEach(plant => {
        const quantity = orderPlants[plant.plantID] || ""; // Use order quantity if available, or leave blank

        const plantRow = document.createElement("div");
        plantRow.classList.add("plant-row");

        plantRow.innerHTML = `
            <label for="plant-${plant.plantID}">${plant.plantName} (${plant.plantPrice})</label>
            <input type="number" class="plant-quantity" id="plant-${plant.plantID}" name="plant-${plant.plantID}" value="${quantity}" min="0">
        `;

        plantsContainer.appendChild(plantRow);
    });
}

//handle both add or edit order
async function addOrEditOrder() {
    const orderDate = document.getElementById("orderDate").value;
    const customerID = document.getElementById("customerID").value;
    const isDelivery = document.getElementById("isDelivery").checked ? 1 : 0;

    let itemQuantity = 0;
    let orderPrice = 0.0;

    // Collect plant quantities and calculate totals
    const plantRows = document.querySelectorAll(".plant-row");
    const plantsInOrder = [];
    plantRows.forEach(row => {
        const input = row.querySelector("input[type='number']");
        if (!input || !input.id) {
            console.warn("Skipping row due to missing input or ID:", row);
            return;
        }
        
        const plantID = input.id.split('-')[1]; //handles plant ID in rows as plant-1, plant-2 etc.
        const quantity = parseInt(input.value, 10) || 0;

        if (quantity > 0) {
            const plant = plants.find(p => p.plantID == plantID);
            //console.log("Processing Plant Row:", input.id, "Quantity:", quantity);
            if (plant) {
                const price = parseFloat(plant.plantPrice);
                itemQuantity += quantity; //sums total itemQuantity
                orderPrice += quantity * price; //sums total orderPrice

                //console.log("Global Plants Array:", plantsInOrder);
                plantsInOrder.push({
                    plantID,
                    quantity,
                });
            }
        }
    });

    // Validate the order data
    if (!orderDate || !customerID || plantsInOrder.length === 0) {
        alert("Please complete all required fields.");
        return;
    }

    const orderData = { orderDate, orderPrice, itemQuantity, isDelivery, customerID, plants: plantsInOrder };

    try {
        let response;

        // Determine whether to add or edit based on `orderIDForEdit`
        if (orderIDForEdit) {
            const formattedDate = formatDateForInput(orderDate); //update Date to exclude z (timezone)
            document.getElementById("orderDate").value = formattedDate;
            // Edit mode
            response = await fetch(`/orders/${orderIDForEdit}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
        } else {
            // Add mode
            response = await fetch('/orders/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const action = orderIDForEdit ? "updated" : "added";
        alert(`Order successfully ${action}!`);
        location.reload();
    } catch (error) {
        console.error("Error saving order:", error);
        alert(`Error saving order: ${error.message}`);
    }
}

async function editOrder(orderID) {
    console.log(`Fetching order details for ID: ${orderID}`);
    document.getElementById("addOrderFormContainer").style.display = "block";

    try {
        const response = await fetch(`/orders/${orderID}`);
        if (!response.ok) throw new Error(`Failed to fetch order details. Status: ${response.status}`);

        const order = await response.json();
        console.log("Fetched order details:", order);
        const formattedDate = formatDateForInput(order.orderDate);
        document.getElementById("orderDate").value = formattedDate;
        document.getElementById("customerID").value = order.customerID;
        document.getElementById("isDelivery").checked = order.isDelivery === 1;

        // Create a map for quick lookup of plants in the order
        const orderPlantsMap = order.plants.reduce((acc, plant) => {
            acc[plant.plantID] = plant.quantity;
            return acc;
        }, {});
        console.log("Order Plants Map:, orderPlants");
        populatePlantsContainer(orderPlantsMap); // Populate with order's plants and quantities
        orderIDForEdit = orderID;
    } catch (error) {
        console.error("Error editing order:", error);
        alert(error.message);
    }
}




async function submitOrder() {
    const orderDate = document.getElementById("orderDate").value;
    const customerID = document.getElementById("customerID").value;
    const isDelivery = document.getElementById("isDelivery").checked ? 1 : 0;

    let itemQuantity = 0;
    let orderPrice = 0.0;
    const plants = [];

    document.querySelectorAll(".plant-row").forEach((row) => {
        const select = row.querySelector(".plant-select");
        const input = row.querySelector(".plant-quantity");
        const quantity = parseInt(input.value, 10) || 0;

        if (quantity > 0) {
            itemQuantity += quantity;
            const price = parseFloat(select.options[select.selectedIndex].dataset.price);
            orderPrice += quantity * price;
            plants.push({ plantID: select.value, quantity });
        }
    });

    const orderData = { orderDate, orderPrice, itemQuantity, isDelivery, customerID, plants };

    const url = orderIDForEdit ? `/orders/${orderIDForEdit}` : "/orders/add";
    const method = orderIDForEdit ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        alert(`Order ${orderIDForEdit ? "updated" : "added"} successfully!`);
        location.reload();
    } catch (error) {
        console.error(`Error ${orderIDForEdit ? "updating" : "adding"} order:`, error);
        alert(error.message);
    }
}

//helper function to fix date for edit mode
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`; // Returns date string
}