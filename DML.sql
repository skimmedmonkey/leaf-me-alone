

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

--Order data
Select o.orderID, o.orderDate, o.orderPrice, o.itemQuantity, o.isDelivery, o.customerID, c.customerName, GROUP_CONCAT(p.plantName) AS plantsInOrder
FROM dbo.Orders orderDateJOIN dbo.Customers c ON o.customerID = c.customerID
LEFT JOIN dbo.OrderItems oi ON o.orderID = oi.orderID
LEFT JOIN dbo.Plants p ON oi.plantID = p.plantID
GROUP BY o.orderID

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
    customerName = :customerName, 
    customerEmail = :customerEmail, 
    customerPhone = :customerPhone, 
    customerAddress = :customerAddress, 
    createDate = :createDate
WHERE 
    customerID = :cCustomerID

--Update Suppliers data
UPDATE dbo.Suppliers
SET  
    supplierName = :supplierName, 
    supplierPhone = :supplierPhone, 
    supplierEmail = :supplierEmail, 
    amountDue = :amountDue
WHERE
    supplierID = :supplierID

--Update Plants data
UPDATE dbo.Plants
SET
    plantName = :plantName, 
    plantTypeID = :plantTypeID, 
    plantMaturity = :plantMaturity,
    plantPrice = :plantPrice, 
    plantCost = :plantCost, 
    plantInventory = :plantInventory
WHERE
    plantID = :plantID

UPDATE dbo.PlantTypes
SET
    plantTypeName = :plantTypeName
WHERE
    plantTypeID = :plantTypeID