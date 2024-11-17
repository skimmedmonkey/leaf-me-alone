
// Store plant data in memory
let plantIDForDelete = null;
let plantData = null;

async function updatePlantData() {
    const response = await fetch('/plants');
    const plants = await response.json();
    plantData = plants;
}

function addPlant(){

    const form = document.getElementById("plantForm")  
    form.dataset.mode = 'add';
    form.reset();

    showPlantForm();

}

function editPlant(plantID) {
    
    const form = document.getElementById("plantForm")  
    form.dataset.mode = 'edit';
    form.reset();

    const plant = plantData.findIndex(plant => plant.plantID === plantID);

    document.getElementById("plantID").value = plant.plantID;
    document.getElementById("plantName").value = plant.plantName;
    document.getElementById("plantType").value = plant.plantType;
    document.getElementById("plantMaturity").value = plant.plantMaturity;
    document.getElementById("plantPrice").checked = plant.plantPrice;
    document.getElementById("plantCost").value = plant.plantCost;
    document.getElementById("plantInventory").value = plant.plantInventory;

    showPlantForm();
    
}

function showPlantForm() {
    populatePlantTypesSelectMenu()
    document.getElementById("plantFormContainer").style.display = "block";
    

}

function hidePlantForm() {
    document.getElementById("plantFormContainer").style.display = "none";
}

async function addOrUpdatePlantInData() {

    const form = document.getElementById("plantForm")   
    const mode = form.dataset.mode
    
    const plantID = document.getElementById("plantID").value 
    const plantName = document.getElementById("plantName").value 
    const plantType = document.getElementById("plantType").value 
    const plantMaturity = document.getElementById("plantMaturity").value 
    const plantPrice = document.getElementById("plantPrice").checked 
    const plantCost = document.getElementById("plantCost").value 
    const plantInventory = document.getElementById("plantInventory").value

    const plantRecord = {
        plantID,
        plantName,
        plantType,
        plantMaturity,
        plantPrice,
        plantCost,
        plantInventory
    }

    if (mode === 'edit'){
        // Run update statement in database
        const response = await fetch(`/plants/${plantID}`, {
            method: POST,
            body: JSON.stringify(plantRecord)
        });

        if (!response.ok) {
            throw new Error(`Edit failed: ${response.status}`);
        }
    }
    else if (mode === 'add'){
        const response = await fetch(`/plants/${plantID}`, {
            method: PUT,
            body: JSON.stringify(plantRecord)
        });

        if (!response.ok) {
            throw new Error(`Add failed: ${response.status}`);
        }
    }

    hidePlantForm();
    updatePlantData();
    displayPlants();
    
}

function displayPlants() {

    //orders object will be data from database
    const tableBody = document.getElementById("plantsTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    plantData.forEach(plant => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = plant.plantID;
        row.insertCell(1).innerText = plant.plantName;
        row.insertCell(2).innerText = plant.plantType
        row.insertCell(3).innerText = plant.plantMaturity;
        row.insertCell(4).innerText = `$${plant.plantPrice.toFixed(2)}`
        row.insertCell(5).innerText = `$${plant.plantCost.toFixed(2)}`
        row.insertCell(6).innerText = plant.plantInventory;
        row.insertCell(7).innerHTML = `
            <button onclick="editPlant()">Edit</button>
            <button onclick="deletePlant()">Delete</button>
        `;
    });
}


function showDeleteForm() {
    document.getElementById("deleteFormContainer").style.display = "block";
}

function hideDeleteForm() {
    document.getElementById("orderFormContainer").style.display = "none";
}

function deletePlant(plantID) {

    showDeleteForm();
    document.getElementById("deleteOrderID").innerHTML = `Are you sure you want to delete order: ${plantID}`;
    plantIDForDelete = plantID;

}

function removePlantFromData() {

    const response = fetch(`/plants/${plantIDForDelete}`, {
        method: DELETE,
    });

    if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
    }

    displayPlants();
    updatePlantData();
    hideDeleteForm();

}

async function populatePlantTypesSelectMenu (){

    const selectElement = document.getElementById("plantType")
    selectElement.innerHTML = '';
    
    const response = await fetch(`/plantTypes`);
    const items = await response.json()

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.value;
        selectElement.appendChild(option);
    });

}


window.onload = function() {
    updatePlantData();
    displayPlants();
};
