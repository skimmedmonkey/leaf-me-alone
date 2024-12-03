// Store supplier data in memory
let supplierIDForDelete = null;

function addSupplier() {
    const form = document.getElementById("supplierForm");
    form.dataset.mode = 'add';
    form.reset();

    showSupplierForm();
}

function editSupplier(editButton) {
    const form = document.getElementById("supplierForm");
    form.dataset.mode = 'edit';
    form.reset();

    const row = editButton.closest('tr');
    console.log(row);

    const supplierRow = {
        supplierID: row.children[0].textContent.trim(),
        supplierName: row.children[1].textContent.trim(),
        supplierPhone: row.children[2].textContent.trim(),
        supplierEmail: row.children[3].textContent.trim(),
        amountDue: row.children[4].textContent.trim(),
    };

    // Update form fields
    document.getElementById("supplierID").value = supplierRow.supplierID;
    document.getElementById("supplierName").value = supplierRow.supplierName;
    document.getElementById("supplierPhone").value = supplierRow.supplierPhone;
    document.getElementById("supplierEmail").value = supplierRow.supplierEmail;
    document.getElementById("amountDue").value = supplierRow.amountDue;

    showSupplierForm();
}

function showSupplierForm() {
    document.getElementById("supplierFormContainer").style.display = "block";
}

function hideSupplierForm() {
    document.getElementById("supplierFormContainer").style.display = "none";
}

function showDeleteSupplierForm() {
    document.getElementById("deleteSupplierFormContainer").style.display = "block";
}

function hideDeleteSupplierForm() {
    document.getElementById("deleteSupplierFormContainer").style.display = "none";
}

function deleteSupplier(supplierID) {
    showDeleteSupplierForm();
    document.getElementById("deleteSupplierConfirmation").innerHTML = `Are you sure you want to delete supplier: ${supplierID}?`;
    supplierIDForDelete = supplierID;
}

async function addOrUpdateSupplierInData() {
    const form = document.getElementById("supplierForm");
    const mode = form.dataset.mode;

    const supplierID = document.getElementById("supplierID").value;
    const supplierName = document.getElementById("supplierName").value;
    const supplierPhone = document.getElementById("supplierPhone").value;
    const supplierEmail = document.getElementById("supplierEmail").value;
    const amountDue = document.getElementById("amountDue").value;

    const supplierRecord = {
        supplierID,
        supplierName,
        supplierPhone,
        supplierEmail,
        amountDue,
    };

    if (mode === 'edit') {
        // When mode is edit, perform a PUT request
        console.log('Received edit request');
        const response = await fetch(`/suppliers/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(supplierRecord),
        });

        if (!response.ok) {
            throw new Error(`Edit failed: ${response.status}`);
        }
        alert('Supplier successfully edited')

    } else if (mode === 'add') {
        // When mode is add, perform a POST request
        const response = await fetch(`/suppliers/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(supplierRecord),
        });

        if (!response.ok) {
            throw new Error(`Add failed: ${response.status}`);
        }
        alert('Supplier successfully added')

    }
    
    hideSupplierForm();
    location.reload();
}

async function removeSupplierFromData() {
    // DELETE from Suppliers Table
    console.log(supplierIDForDelete);
    const response = await fetch(`/suppliers/${supplierIDForDelete}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
    }
    alert('Supplier successfully deleted')

    hideDeleteSupplierForm();
    location.reload();
}
