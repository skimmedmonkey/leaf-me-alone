

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
JOIN dbo.PlantTypes pt
ON p.plantTypeID = pt.id

--Order data
Select o.orderID, o.orderDate, o.orderPrice, o.itemQuantity, o.isDelivery, o.customerID, c.customerName, GROUP_CONCAT(p.plantName) AS plantsInOrder
FROM dbo.Orders orderDateJOIN dbo.Customers c ON o.customerID = c.customerID
LEFT JOIN dbo.OrderItems oi ON o.orderID = oi.orderID
LEFT JOIN dbo.Plants p ON oi.plantID = p.plantID
GROUP BY o.orderID

--Plants Suppliers
SELECT plantID, supplierID 
FROM dbo.PlantsSuppliers

--Plant Types
SELECT plantTypeID, plantTypeName FROM dbo.PlantTypes

--Populate maturity dropdown
SELECT DISTINCT plantMaturity FROM dbo.Plants

-------------INSERT STATEMENTS------------

--Customer form data
INSERT INTO dbo.Customers 
    (customerName, customerEmail, customerPhone, customerAddress, createDate)
VALUES
    (:nameInput, :emailInput, :phoneInput, :addressInput, CURDATE())

--Supplier form data
INSERT INTO dbo.Suppliers
    (supplierName, supplierPhone, supplierEmail, amountDue)
VALUES
    (:nameInput, :phoneInput, :emailInput, :amountDueInput)

--Plant form data
INSERT INTO dbo.PlantTypes
    (plantTypeName)
VALUES
    (:plantTypeNameInput)

INSERT INTO dbo.Plants
    (plantName, plantTypeID, plantMaturity, plantPrice, plantCost, plantInventory)
VALUES
    (   
        :pName,
        :plantTypeIDInput,
        :plantMaturityInput,
        :plantPriceInput,
        :plantCostInput,
        :plantInventoryInput
    )

--Order form data
INSERT INTO dbo.Orders
    (orderDate, orderPrice, itemQuantity, isDelivery, customerID)
VALUES
    (:orderDateInput, :orderPriceInput, :itemQuantityInput, :isDeliveryInput, :customerIDInput)

--OrderItems data
INSERT INTO dbo.OrderItems
    (orderID, plantID, quantity)
VALUES
    (:orderID, :plantIDInput, :quantityInput);

--PlantsSuppliers data
INSERT INTO dbo.PlantsSuppliers
    (plantID, supplierID)
VALUES
    (:plantIDInput, :supplierIDInput)

-------------DELETE STATEMENTS------------

--Customer data
DELETE FROM dbo.Customers
WHERE id = :customerIDInput

--Supplier data
DELETE FROM dbo.Suppliers
WHERE id = :supplierIDInput

--Plant data
DELETE FROM dbo.Plants
WHERE id = :plantIDInput

--PlantsSuppliers data
DELETE FROM dbo.PlantsSuppliers
WHERE plantID = :plantIDInput AND supplierID = :supplierIDInput;

--OrderItems data
DELETE FROM dbo.OrderItems
Where orderID = :orderIDInput;

--Orders data
DELETE FROM dbo.Orders
WHERE orderID = :orderIDInput;

-------------UPDATE STATEMENTS------------

--Update Orders data
UPDATE dbo.Orders
SET
    orderDate = :orderDateInput,
    orderPrice = :orderPriceInput,
    itemQuantity = :itemQuantityInput,
    isDelivery = :isDeliveryInput,
    customerID = :customerIDInput
WHERE
    orderID = :orderIDInput;

--Update Customers data
UPDATE dbo.Customers
SET
    customerName = :customerNameInput, 
    customerEmail = :customerEmailInput, 
    customerPhone = :customerPhoneInput, 
    customerAddress = :customerAddressInput, 
    createDate = :createDateInput
WHERE 
    customerID = :customerIDInput

--Update Suppliers data
UPDATE dbo.Suppliers
SET  
    supplierName = :supplierNameInput, 
    supplierPhone = :supplierPhoneInput, 
    supplierEmail = :supplierEmailInput, 
    amountDue = :amountDueInput
WHERE
    supplierID = :supplierIDInput

--Update Plants data
UPDATE dbo.Plants
SET
    plantName = :plantNameInput, 
    plantTypeID = :plantTypeIDInput, 
    plantMaturity = :plantMaturityInput,
    plantPrice = :plantPriceInput, 
    plantCost = :plantCostInput, 
    plantInventory = :plantInventoryInput
WHERE
    plantID = :plantIDInput

--Update PlantTypes data
UPDATE dbo.PlantTypes
SET
    plantTypeName = :plantTypeNameInput
WHERE
    plantTypeID = :plantTypeIDInput