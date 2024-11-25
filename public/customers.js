// Store customer data in memory
let customerIDForDelete = null;

function addCustomer() {
    const form = document.getElementById("customerForm");
    form.dataset.mode = 'add';
    form.reset();

    showCustomerForm();
}

function editCustomer(editButton) {
    const form = document.getElementById("customerForm");
    form.dataset.mode = 'edit';
    form.reset();

    const row = editButton.closest('tr');
    console.log(row);

    const customerRow = {
        customerID: row.children[0].textContent.trim(),
        customerName: row.children[1].textContent.trim(),
        customerEmail: row.children[2].textContent.trim(),
        customerPhone: row.children[3].textContent.trim(),
        customerAddress: row.children[4].textContent.trim()
    };

    // Update form fields
    document.getElementById("customerID").value = customerRow.customerID;
    document.getElementById("customerName").value = customerRow.customerName;
    document.getElementById("customerEmail").value = customerRow.customerEmail;
    document.getElementById("customerPhone").value = customerRow.customerPhone;
    document.getElementById("customerAddress").value = customerRow.customerAddress;

    showCustomerForm();
}

function showCustomerForm() {
    document.getElementById("customerFormContainer").style.display = "block";
}

function hideCustomerForm() {
    document.getElementById("customerFormContainer").style.display = "none";
}

function showDeleteCustomerForm() {
    document.getElementById("deleteCustomerFormContainer").style.display = "block";
}

function hideDeleteCustomerForm() {
    document.getElementById("deleteCustomerFormContainer").style.display = "none";
}

function deleteCustomer(customerID) {
    showDeleteCustomerForm();
    document.getElementById("deleteCustomerConfirmation").innerHTML = `Are you sure you want to delete customer: ${customerID}?`;
    customerIDForDelete = customerID;
}

async function addOrUpdateCustomerInData() {
    const form = document.getElementById("customerForm");
    const mode = form.dataset.mode;

    const customerID = document.getElementById("customerID").value;
    const customerName = document.getElementById("customerName").value;
    const customerEmail = document.getElementById("customerEmail").value;
    const customerPhone = document.getElementById("customerPhone").value;
    const customerAddress = document.getElementById("customerAddress").value;

    const customerRecord = {
        customerID,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
    };

    console.log(customerRecord)
    if (mode === 'edit') {
        // When mode is edit, perform a PUT request
        console.log('Received edit request');
        const response = await fetch(`/customers/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerRecord)
        });

        if (!response.ok) {
            throw new Error(`Edit failed: ${response.status}`);
        }
        alert('Customer successfully edited')

    } else if (mode === 'add') {
        // When mode is add, perform a POST request
        const response = await fetch(`/customers/add`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerRecord)
        });

        if (!response.ok) {
            throw new Error(`Add failed: ${response.status}`);
        }
        alert('Customer successfully added')
    }

    hideCustomerForm();
    location.reload();
}

async function removeCustomerFromData() {
    // DELETE from Customers Table
    console.log(customerIDForDelete);
    const response = await fetch(`/customers/${customerIDForDelete}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
    }
    alert('Customer successfully deleted')
    hideDeleteCustomerForm();
    location.reload();
}
