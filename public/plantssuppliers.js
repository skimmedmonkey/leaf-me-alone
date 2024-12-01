// Store plants suppliers data in memory
let plantIDForDelete = null;
let supplierIDForDelete = null;

function addPlantSupplier(){

    const form = document.getElementById("plantsSuppliersForm")  
    form.dataset.mode = 'add';
    form.reset();

    showForm();

}

function editPlantSupplier(editButton) {
    
    const form = document.getElementById("plantsSuppliersForm")  
    form.dataset.mode = 'edit';
    form.reset();

    const row = editButton.closest('tr');
    console.log(row)

    const plantSupplierRow = {
        plantID: row.children[0].textContent.trim(),
        supplierID: row.children[1].textContent.trim(),
    };

    // Update form fields
    document.getElementById("plantID").value = plantSupplierRow.plantID;
    document.getElementById("supplierID").value = plantSupplierRow.supplierID;


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

    const plantsSupplierRecord = {
        plantID,
        supplierID,
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

