

-------------SELECT STATEMENTS------------

--Customer data
SELECT customerID, customerName, customerEmail, customerPhone, customerAddress, createDate
FROM dbo.Customers 

--Supplier data
SELECT supplierID, supplierName, supplierPhone, supplierEmail, amountDue
FROM dbo.Suppliers

--Plant data
SELECT p.plantID, p.plantName, pt.plantTypeName, p.plantTypeID, p.plantMaturity, p.plantPrice, p.plantCost, p.plantInventory
FROM dbo.Plants p
INNER JOIN dbo.PlantTypes pt
ON p.plantTypeID = pt.id

-------------INSERT STATEMENTS------------

--Customer form data
INSERT INTO dbo.Customers 
    (customerName, customerEmail, customerPhone, customerAddress, createDate)
VALUES
    (:cNameInput, :cEmailInput, :cPhoneInput, :cAddressInput, CURDATE())

--Supplier form data
INSERT INTO dbo.Suppliers
    (supplierName, supplierPhone, supplierEmail, amountDue)
VALUES
    (:sNameInput, :sPhoneInput, :sEmailInput, :sAmountDue)

--Plant form data
INSERT INTO dbo.PlantTypes
    (plantTypeName)
VALUES
    (:pTypeNameInput)

INSERT INTO dbo.Plants
    (plantName, plantTypeID, plantMaturity, plantPrice, plantCost, plantInventory)
VALUES
    (   
        :pName,
        (SELECT plantTypeID from dbo.PlantTypes where plantTypeName = :pTypeNameInput),
        :pMaturityInput,
        :pPriceInput,
        :pCostInput,
        :pInventoryInput
    )


-------------DELETE STATEMENTS------------

--Customer data
DELETE FROM dbo.Customers
WHERE id = :cInputID

--Supplier data
DELETE FROM dbo.Suppliers
WHERE id = :sSupplierID

--Plant data
DELETE FROM dbo.Plants
WHERE id = :pPlantID
