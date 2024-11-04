
--Insert customer form data
INSERT INTO dbo.Customers 
    (customerName, customerEmail, customerPhone, customerAddress, createDate)
VALUES
    (:cNameInput, :cEmailInput, cPhoneInput, cAddressInput, CURDATE())

--Insert supplier form data
INSERT INTO dbo.Suppliers
    (supplierName, supplierPhone, supplierEmail, amountDue)
VALUES
    (:sNameInput, :sPhoneInput, :sEmailInput, :sAmountDue)

--Insert Plant form data
INSERT INTO dbo.PlantTypes
    (plantTypeName, plantTypeDescription)

INSERT INTO dbo.Plants
    (plantTypeID, plantMaturity, plantPrice, plantCost, plantInventory)
VALUES
    ()
