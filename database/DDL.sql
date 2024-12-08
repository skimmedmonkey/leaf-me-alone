/*
	CS340 Project Group 57
    Benjamin Premi-Reiller and Steven Kim
    Leaf Me Alone Sales Management System
*/

-- MySQL Project Step 2 Table Creation And Data Dump


SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';


-- -----------------------------------------------------
-- Table `PlantTypes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PlantTypes`;
CREATE TABLE IF NOT EXISTS `PlantTypes` (
  `plantTypeID` INT NOT NULL AUTO_INCREMENT,
  `plantTypeName` VARCHAR(45) NULL,
  PRIMARY KEY (`plantTypeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Plants`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Plants`;
CREATE TABLE `Plants` (
  `plantID` INT NOT NULL AUTO_INCREMENT,
  `plantName` VARCHAR(50) NOT NULL,
  `plantMaturity` VARCHAR(25) NOT NULL,
  `plantPrice` DECIMAL(6,2) NOT NULL,
  `plantCost` DECIMAL(6,2) NOT NULL,
  `plantTypeID` INT NOT NULL,
  PRIMARY KEY (`plantID`),
  UNIQUE(`plantName`, `plantMaturity`),
  CONSTRAINT `fk_Plants_PlantTypes`
    FOREIGN KEY (`plantTypeID`)
    REFERENCES `PlantTypes` (`plantTypeID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Suppliers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Suppliers`;
CREATE TABLE `Suppliers` (
  `supplierID` INT NOT NULL AUTO_INCREMENT,
  `supplierName` VARCHAR(100) NOT NULL,
  `supplierPhone` BIGINT NOT NULL,
  `supplierEmail` VARCHAR(100) NOT NULL,
  `amountDue` DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (`supplierID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PlantsSuppliers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PlantsSuppliers`;
CREATE TABLE `PlantsSuppliers` (
  `plantSupplierID` INT NOT NULL AUTO_INCREMENT,
  `plantID` INT NOT NULL,
  `supplierID` INT NOT NULL,
  `plantQuantity` INT NOT NULL,
  PRIMARY KEY (`plantSupplierID`),
  CONSTRAINT `UC_plantID_supplerID`
    UNIQUE (`plantID`, `supplierID`),
  CONSTRAINT `fk_PlantsSuppliers_Plants`
    FOREIGN KEY (`plantID`)
    REFERENCES `Plants` (`plantID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PlantsSuppliers_Suppliers`
    FOREIGN KEY (`supplierID`)
    REFERENCES `Suppliers` (`supplierID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Customers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Customers`;
CREATE TABLE `Customers` (
  `customerID` INT NOT NULL AUTO_INCREMENT,
  `customerName` VARCHAR(100) NOT NULL,
  `customerEmail` VARCHAR(100) NOT NULL,
  `customerPhone` BIGINT NOT NULL,
  `customerAddress` VARCHAR(45) NOT NULL,
  `createDate` DATETIME NULL,
  PRIMARY KEY (`customerID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Orders`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Orders`;
CREATE TABLE `Orders` (
  `orderID` INT NOT NULL AUTO_INCREMENT,
  `orderDate` DATETIME NOT NULL,
  `orderPrice` DECIMAL(8,2) NOT NULL,
  `itemQuantity` INT NOT NULL,
  `isDelivery` TINYINT NULL,
  `customerID` INT NOT NULL,
  PRIMARY KEY (`orderID`),
  CONSTRAINT `fk_Orders_Customers`
    FOREIGN KEY (`customerID`)
    REFERENCES `Customers` (`customerID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `OrderItems`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `OrderItems`;
CREATE TABLE `OrderItems` (
  `orderItemID` INT NOT NULL AUTO_INCREMENT,
  `quantity` INT NOT NULL,
  `orderID` INT NOT NULL,
  `plantID` INT NOT NULL,
  PRIMARY KEY (`orderItemID`, `orderID`, `plantID`),
  CONSTRAINT `fk_OrderItems_Orders`
    FOREIGN KEY (`orderID`)
    REFERENCES `Orders` (`orderID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_OrderItems_Plants`
    FOREIGN KEY (`plantID`)
    REFERENCES `Plants` (`plantID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- Insert 'PlantTypes' example data
INSERT INTO PlantTypes (plantTypeID, plantTypeName) VALUES
(101,  'Fruit'),
(102,  'Succulent'),
(103,  'Flower'),
(104,  'Tree'),
(105, 'Cactus');

-- Insert 'Plants' example data

INSERT INTO Plants (plantID, plantName, plantTypeID, plantMaturity, plantPrice, plantCost) VALUES
(1, 'Raspberry', 101, 'Mature', 25.99, 15.00),
(2, 'Jade', 102, 'Seedling', 10.50, 6.00),
(3, 'Tulip', 103, 'Mature', 30.75, 18.00),
(4, 'Oak Tree', 101, 'Seedling', 12.25, 7.50),
(5, 'Saguaro', 104, 'Mature', 45.00, 27.00);


-- Insert 'Suppliers' example data
INSERT INTO Suppliers (supplierID, supplierName, supplierPhone, supplierEmail, amountDue) VALUES
(1, 'Greenhouse Co.', 1112223333, 'contact@greenhouse.com', 1200.00),
(2, 'Flora Supplies', 2223334444, 'sales@florasupplies.com', 800.50),
(3, 'PlantWorld Ltd.', 3334445555, 'info@plantworld.com', 950.00),
(4, 'Garden Essentials', 4445556666, 'support@gardenessentials.com', 670.25),
(5, 'Outdoor Nursery', 5556667777, 'help@outdoornursery.com', 320.40);

-- Insert 'PlantsSuppliers' example data
INSERT INTO PlantsSuppliers (plantID, supplierID, plantQuantity) VALUES
(1, 1, 10),
(1, 2, 20),
(2, 3, 30),
(2, 4, 20),
(3, 5, 5),
(3, 1, 8),
(4, 2, 12),
(4, 3, 41),
(5, 4, 68),
(5, 5, 3);

-- Insert 'Customers' example data
INSERT INTO Customers (customerID, customerName, customerEmail, customerPhone, customerAddress, createDate) VALUES
(1, 'Jane Doe', 'jane.doe@email.com', 1234567890, '123 Penn St, City, PA 15208', '2024-01-15 10:30'),
(2, 'John Smith', 'john.smith@email.com', 9876543210, '456 Oakdale Ave, Town, PA 15217', '2024-02-20 15:45'),
(3, 'Mary Johnson', 'mary.j@email.com', 1122334455, '789 Pine Rd, Village, PA 15601', '2024-03-18 12:00'),
(4, 'Paul Brown', 'paul.b@email.com', 6677889900, '321 Birchwood Ln, City, PA 15232', '2024-04-05 09:20'),
(5, 'Linda Green', 'linda.g@email.com', 5544332211, '654 Cedarcliff St, Town, PA 15213', '2024-05-25 16:15');
 
-- Insert 'Orders' example data
INSERT INTO Orders (orderID, orderDate, orderPrice, itemQuantity, isDelivery, customerID) VALUES
(1, '2024-10-01 14:00', 82.73, 3, TRUE, 1),
(2, '2024-10-12 10:30', 12.25, 1, FALSE, 2),
(3, '2024-10-07 09:15', 121.50, 4, TRUE, 3),
(4, '2024-10-20 13:45', 30.75, 1, FALSE, 4),
(5, '2024-10-15 11:00', 110.75, 5, TRUE, 5);
 
 -- Insert 'OrderItems' example data
 INSERT INTO OrderItems (orderItemID, quantity, orderID, plantID) VALUES
(1, 2, 1, 1),
(2, 1, 1, 3),
(3, 1, 2, 4),
(4, 3, 3, 2),
(5, 2, 3, 5),
(6, 1, 4, 1),
(7, 1, 5, 2),
(8, 2, 5, 4),
(9, 1, 5, 3),
(10, 1, 5, 5);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
