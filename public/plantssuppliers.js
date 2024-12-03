// Store plants suppliers data in memory
let plantIDForDelete = null;
let supplierIDForDelete = null;

function addPlantsSupplier(){

    const form = document.getElementById("plantsSuppliersForm")  
    form.dataset.mode = 'add';
    form.reset();

    showForm();

}

function editPlantsSupplier(editButton) {
    const form = document.getElementById("plantsSuppliersForm")  
    form.dataset.mode = 'edit';
    form.reset();
    const row = editButton.closest('tr');
    const currentPlantID = row.children[0].getAttribute('data-id');
    const currentSupplierID = row.children[1].getAttribute('data-id');

    selectedPlantID = currentPlantID;
    selectedSupplierID = currentSupplierID;



    //const plantID = row.children[0].getAttribute("data-id");
    //const supplierID = row.children[1].getAttribute("data-id");
    
    // Update form fields
    document.getElementById("plantID").value = currentPlantID;
    document.getElementById("supplierID").value = currentSupplierID;

    form.dataset.originalPlantID = currentPlantID;
    form.dataset.originalPlantID = currentSupplierID;
    // Plant type select menu must be handled differently
    //const selectElement = document.getElementById("plantType")
    //Array.from(selectElement.children).forEach(option => {
    //    if (option.innerHTML === plantRow.plantTypeName){
    //        option.selected="selected"
    //    }
    //})

    showForm();
    
}

function showForm() {
    document.getElementById("plantsSuppliersFormContainer").style.display = "block";

}

function hideForm() {
    document.getElementById("plantsSuppliersFormContainer").style.display = "none";
}


function showDeleteForm() {
    document.getElementById("deleteFormContainer").style.display = "block";
}

function hideDeleteForm() {
    document.getElementById("deleteFormContainer").style.display = "none";
}

function deletePlantSupplier(plantID, supplierID) {
    showDeleteForm();
    document.getElementById("deletePlantSupplierConfirmation").innerHTML = `Are you sure you want to delete plant: ${plantID} and supplier ${supplierID}?`;
    plantIDForDelete = plantID;
    supplierIDForDelete = supplierID;

}


async function addOrUpdatePlantSupplierInData() {
    const form = document.getElementById("plantsSuppliersForm")   
    const mode = form.dataset.mode
    
    const plantID = document.getElementById("plantID").value 
    const supplierID = document.getElementById("supplierID").value 

    const originalPlantID = form.dataset.originalPlantID;
    const originalSupplierID = form.dataset.originalSupplierID;

    const plantsSupplierRecord = {
        plantID,
        supplierID,
        originalPlantID,
        originalSupplierID,
    }

    if (mode === 'edit'){
        // When mode is edit performs a PUT
        console.log('Received edit request')
        const response = await fetch(`/plantssuppliers/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plantsSupplierRecord)
        });

        if (!response.ok) {
            throw new Error(`Edit failed: ${response.status}`);
        }
    }
    else if (mode === 'add'){

        // When mode is add performs a POST
        const response = await fetch(`/plantssuppliers/add`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plantsSupplierRecord)
        });

        if (!response.ok) {
            throw new Error(`Add failed: ${response.status}`);
        }
    }

    hideForm();
    location.reload();
    
}

async function removePlantSupplierFromData() {
    // DELETE from PlantsSuppliers Table
    console.log('Deleting plantID ${plantIDForDelete}, supplierID ${supplierIDForDelete');
    const response = await fetch(`/plantssuppliers/${plantIDForDelete}/${supplierIDForDelete}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
    }
    
    hideDeleteForm();
    location.reload();

}

