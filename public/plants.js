
// Store plant data in memory
let plantIDForDelete = null;

function addPlant(){

    const form = document.getElementById("plantForm")  
    form.dataset.mode = 'add';
    form.reset();

    showPlantForm();

}

function editPlant(editButton) {
    
    const form = document.getElementById("plantForm")  
    form.dataset.mode = 'edit';
    form.reset();

    const row = editButton.closest('tr');
    console.log(row)

    const plantRow = {
        plantID: row.children[0].textContent.trim(),
        plantName: row.children[1].textContent.trim(),
        plantTypeName: row.children[2].textContent.trim(),
        plantMaturity: row.children[3].textContent.trim(),
        plantPrice: row.children[4].textContent.trim(),
        plantCost: row.children[5].textContent.trim(),
        plantInventory: row.children[6].textContent.trim(),
    };

    // Update form fields
    document.getElementById("plantID").value = plantRow.plantID;
    document.getElementById("plantName").value = plantRow.plantName;
    document.getElementById("plantMaturity").value = plantRow.plantMaturity;
    document.getElementById("plantPrice").value = plantRow.plantPrice;
    document.getElementById("plantCost").value = plantRow.plantCost;
    document.getElementById("plantInventory").value = plantRow.plantInventory;

    // Plant type select menu must be handled differently
    const selectElement = document.getElementById("plantType")
    Array.from(selectElement.children).forEach(option => {
        if (option.innerHTML === plantRow.plantTypeName){
            option.selected="selected"
        }
    })

    showPlantForm();
    
}

function showPlantForm() {
    document.getElementById("plantFormContainer").style.display = "block";

}

function hidePlantForm() {
    document.getElementById("plantFormContainer").style.display = "none";
}


function showDeleteForm() {
    document.getElementById("deleteFormContainer").style.display = "block";
}

function hideDeleteForm() {
    document.getElementById("deleteFormContainer").style.display = "none";
}

function deletePlant(plantID) {

    showDeleteForm();
    document.getElementById("deletePlantConfirmation").innerHTML = `Are you sure you want to delete order: ${plantID}`;
    plantIDForDelete = plantID;

}

async function addOrUpdatePlantInData() {

    const form = document.getElementById("plantForm")   
    const mode = form.dataset.mode
    
    const plantID = document.getElementById("plantID").value 
    const plantName = document.getElementById("plantName").value 
    const plantTypeID = document.getElementById("plantType").value 
    const plantMaturity = document.getElementById("plantMaturity").value 
    const plantPrice = document.getElementById("plantPrice").value
    const plantCost = document.getElementById("plantCost").value 
    const plantInventory = document.getElementById("plantInventory").value

    const plantRecord = {
        plantID,
        plantName,
        plantTypeID,
        plantMaturity,
        plantPrice,
        plantCost,
        plantInventory
    }

    if (mode === 'edit'){
        // When mode is edit performs a PUT
        console.log('Received edit request')
        const response = await fetch(`/plants/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plantRecord)
        });

        if (!response.ok) {
            throw new Error(`Edit failed: ${response.status}`);
        }

        alert('Plant successfully edited')
    }
    else if (mode === 'add'){

        // When mode is add performs a POST
        const response = await fetch(`/plants/add`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plantRecord)
        });

        if (!response.ok) {
            throw new Error(`Add failed: ${response.status}`);
        }
        alert('Plant successfully added')
    }

    hidePlantForm();
    location.reload();
    
}

async function removePlantFromData() {
    // DELETE from Plants Table
    console.log(plantIDForDelete)
    const response = await fetch(`/plants/${plantIDForDelete}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
    }
    alert('Plant successfully deleted')
    hideDeleteForm();
    location.reload();

}

