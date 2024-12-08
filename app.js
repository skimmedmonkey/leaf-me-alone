// App.js
// Date: 11/17/2024 
// Based on nodejs-starter-app 
// Example shell was used, with the remainder based on our project
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%200%20-%20Setting%20Up%20Node.js/README.md


/*
    SETUP
*/



// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 57575;                 // Set a port number at the top so it's easy to change in the future
app.use(express.static('public'));

// Database
var db = require('./database/db-connector')

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

const Handlebars = require('handlebars');

// Helper to safely serialize JSON for use in HTML
Handlebars.registerHelper('json', function (context) {
    return new Handlebars.SafeString(JSON.stringify(context).replace(/&/g, '\\u0026').replace(/</g, '\\u003c').replace(/>/g, '\\u003e'));
});


/*
    ROUTES
*/

// ---------------------- INDEX ---------------------

app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        // Return index page?
        res.render('index');      // This function literally sends the string "The server is running!" to the computer
    });

// ---------------------- CUSTOMERS ---------------------
app.get('/customers', function(req, res)                
{
    const query1 = `
    SELECT customerID, customerName, customerEmail, customerPhone, customerAddress, createDate
    FROM Customers`;

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.error("Error executing query:", error);
            res.status(500).send("Error retrieving customers.");
            return;
        } 
        res.render('customers',  {data: rows});
    })
});   

app.post('/customers/add', function(req, res)                 
    {
        console.log('received add request')
        const data = req.body;
        const query1 = `
            INSERT INTO Customers 
            (customerName, customerEmail, customerPhone, customerAddress, createDate)
            VALUES
            ('${data.customerName}', '${data.customerEmail}', ${data.customerPhone}, '${data.customerAddress}', CURDATE())
            `

        db.pool.query(query1, function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);  // Error handling
            } else {
                res.render('customers');  // Redirect to the customers list page
            }
        });
            
    });    

app.put('/customers/edit', function(req, res)
{
    console.log('received add request')
    const data = req.body;

    const query1 = `
        UPDATE Customers
        SET customerName = '${data.customerName}', 
            customerEmail = '${data.customerEmail}', 
            customerPhone = ${data.customerPhone}, 
            customerAddress = '${data.customerAddress}'
        WHERE
            customerID = ${data.customerID} `;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);  // Error handling
        } else {
            res.render('customers');  // Redirect to the plants list page
        }
    });
});

app.delete('/customers/:_id', function(req, res)                 
    {
        console.log('received delete request')
        let query1 = `
        DELETE FROM Customers WHERE customerID = ${req.params._id}
    `;
    
    db.pool.query(query1, function(error, rows){
        if (error) {
            console.error("Error executing query:", error);
            res.status(500).send("Error deleting Customer.");
        } else {
            res.status(204).send("Customer successfully deleted")
        }
    });
    
    });   

// ---------------------- SUPPLIERS ---------------------

app.get('/suppliers', function(req, res)                
{
    const query1 = `
        SELECT supplierID, supplierName, supplierPhone, supplierEmail, amountDue
        FROM Suppliers`;

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.error("Error executing query:", error);
            res.status(500).send("Error retrieving suppliers.");
            return;
        } 
        res.render('suppliers',  {data: rows});
    })
});   

app.post('/suppliers/add', function(req, res)                 
    {
        console.log('received supplier add request')
        const data = req.body;
        const query1 = `
            INSERT INTO Suppliers
                (supplierName, supplierPhone, supplierEmail, amountDue)
            VALUES
            ('${data.supplierName}', ${data.supplierPhone}, '${data.supplierEmail}', ${data.amountDue})
            `

        db.pool.query(query1, function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);  // Error handling
            } else {
                res.render('suppliers');  // Redirect to the customers list page
            }
        });
            
    });    

app.put('/suppliers/edit', function(req, res)
{
    console.log('received supplier edit request')
    const data = req.body;

    const query1 = `
        UPDATE Suppliers
        SET supplierName = '${data.supplierName}', 
            supplierEmail = '${data.supplierEmail}', 
            supplierPhone = ${data.supplierPhone}, 
            amountDue = ${data.amountDue}
        WHERE
            supplierID = ${data.supplierID} `;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);  // Error handling
        } else {
            res.render('suppliers');  // Redirect to the supplier list page
        }
    });
});

app.delete('/suppliers/:_id', function(req, res)                 
    {
        console.log('received delete request')
        let query1 = `
        DELETE FROM Suppliers WHERE supplierID = ${req.params._id}
    `;
    
    db.pool.query(query1, function(error, rows){
        if (error) {
            console.error("Error executing query:", error);
            res.status(500).send("Error deleting Customer.");
        } else {
            res.status(204).send("Supplier successfully deleted")
        }
    });
});   

// -------------------------- ORDERS --------------------------------

app.get('/orders', function(req, res)                
{
    const ordersQuery = `
        SELECT 
            o.orderID,
            o.orderDate,
            o.orderPrice,
            o.itemQuantity,
            o.isDelivery,
            o.customerID,
            c.customerName,
            GROUP_CONCAT(p.plantName SEPARATOR ', ') AS plants
        FROM 
            Orders o
        JOIN 
            Customers c ON o.customerID = c.customerID
        JOIN 
            OrderItems oi ON o.orderID = oi.orderID
        JOIN 
            Plants p ON oi.plantID = p.plantID
        GROUP BY 
            o.orderID;
    `;

    const customersQuery = `SELECT customerID, customerName FROM Customers`;
    const plantsQuery = `SELECT plantID, plantName, plantPrice FROM Plants`;    

    db.pool.query(ordersQuery, function (error, orders) {
        if (error) {
            console.error("Error retrieving orders:", error);
            res.status(500).send("Error retrieving orders.");
            return;
        }

        db.pool.query(customersQuery, function (error, customers) {
            if (error) {
                console.error("Error retrieving customers:", error);
                res.status(500).send("Error retrieving customers.");
                return;
            }

            db.pool.query(plantsQuery, function (error, plants) {
                if (error) {
                    console.error("Error retrieving plants:", error);
                    res.status(500).send("Error retrieving plants.");
                    return;
                }

                res.render('orders', { data: orders, customers, plants});
            });
        });
    });
});

app.post('/orders/add', (req, res) => {
    const { orderDate, orderPrice, itemQuantity, isDelivery, customerID, plants } = req.body;
  
    if (!orderDate || !orderPrice || !itemQuantity || isDelivery === undefined || !customerID || !plants || plants.length === 0) {
      return res.status(400).send("Invalid order data.");
    }
  
    db.pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get connection:", err);
        return res.status(500).send("Failed to connect to the database.");
      }
  
      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          console.error("Failed to start transaction:", err);
          return res.status(500).send("Failed to start transaction.");
        }
  
        // Insert into Orders table
        const orderQuery = `
          INSERT INTO Orders (orderDate, orderPrice, itemQuantity, isDelivery, customerID)
          VALUES (?, ?, ?, ?, ?)
        `;
        connection.query(orderQuery, [orderDate, orderPrice, itemQuantity, isDelivery, customerID], (err, result) => {
          if (err) {
            return rollbackTransaction(connection, res, "Failed to insert order.");
          }
  
          const orderID = result.insertId;
  
          // Insert into OrderItems table
          const orderItems = plants.map(({ plantID, quantity }) => [orderID, plantID, quantity]);
          const orderItemsQuery = `
            INSERT INTO OrderItems (orderID, plantID, quantity)
            VALUES ?
          `;
          connection.query(orderItemsQuery, [orderItems], (err) => {
            if (err) {
              return rollbackTransaction(connection, res, "Failed to insert order items.");
            }
  
            // Commit the transaction
            connection.commit((err) => {
              connection.release();
  
              if (err) {
                console.error("Failed to commit transaction:", err);
                return res.status(500).send("Failed to commit transaction.");
              }
  
              res.status(201).send("Order added successfully.");
            });
          });
        });
      });
    });
  });
  
  // Helper function for rolling back a transaction
  function rollbackTransaction(connection, res, errorMessage) {
    connection.rollback(() => {
      connection.release();
      console.error(errorMessage);
      res.status(500).send(errorMessage);
    });
  }

  app.get('/orders/:id', function (req, res) {
    const orderID = req.params.id;

    const orderQuery = `
        SELECT 
            o.orderID, o.orderDate, o.orderPrice, o.itemQuantity, o.isDelivery, o.customerID
        FROM 
            Orders o
        WHERE 
            o.orderID = ?;
    `;

    const orderItemsQuery = `
        SELECT 
            oi.plantID, oi.quantity, p.plantName, p.plantPrice
        FROM 
            OrderItems oi
        JOIN 
            Plants p ON oi.plantID = p.plantID
        WHERE 
            oi.orderID = ?;
    `;

    db.pool.query(orderQuery, [orderID], function (error, orderResults) {
        if (error) {
            console.error("Error retrieving order:", error);
            res.status(500).send("Error retrieving order.");
            return;
        }

        db.pool.query(orderItemsQuery, [orderID], function (error, orderItemsResults) {
            if (error) {
                console.error("Error retrieving order items:", error);
                res.status(500).send("Error retrieving order items.");
                return;
            }

            if (orderResults.length === 0) {
                res.status(404).send("Order not found.");
                return;
            }

            const order = orderResults[0];
            order.plants = orderItemsResults;
            res.json(order);
        });
    });
});


app.put('/orders/:id', function (req, res) {
    const orderID = req.params.id;
    const { orderDate, orderPrice, itemQuantity, isDelivery, customerID, plants } = req.body;

    if (!orderDate || !orderPrice || !itemQuantity || isDelivery === undefined || !customerID || !plants || plants.length === 0) {
        return res.status(400).send("Invalid order data.");
    }

    db.pool.getConnection((err, connection) => {
        if (err) {
            console.error("Failed to get connection:", err);
            return res.status(500).send("Failed to connect to the database.");
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                console.error("Failed to start transaction:", err);
                return res.status(500).send("Failed to start transaction.");
            }

            // Update the Orders table
            const updateOrderQuery = `
                UPDATE Orders 
                SET orderDate = ?, orderPrice = ?, itemQuantity = ?, isDelivery = ?, customerID = ?
                WHERE orderID = ?;
            `;
            connection.query(updateOrderQuery, [orderDate, orderPrice, itemQuantity, isDelivery, customerID, orderID], (err) => {
                if (err) {
                    return rollbackTransaction(connection, res, "Failed to update order.");
                }

                // Delete existing OrderItems
                const deleteOrderItemsQuery = `DELETE FROM OrderItems WHERE orderID = ?;`;
                connection.query(deleteOrderItemsQuery, [orderID], (err) => {
                    if (err) {
                        return rollbackTransaction(connection, res, "Failed to delete order items.");
                    }

                    // Insert updated OrderItems
                    const orderItems = plants.map(({ plantID, quantity }) => [orderID, plantID, quantity]);
                    const insertOrderItemsQuery = `
                        INSERT INTO OrderItems (orderID, plantID, quantity)
                        VALUES ?;
                    `;
                    connection.query(insertOrderItemsQuery, [orderItems], (err) => {
                        if (err) {
                            return rollbackTransaction(connection, res, "Failed to insert updated order items.");
                        }

                        // Commit the transaction
                        connection.commit((err) => {
                            connection.release();

                            if (err) {
                                console.error("Failed to commit transaction:", err);
                                return res.status(500).send("Failed to commit transaction.");
                            }

                            res.status(200).send("Order updated successfully.");
                        });
                    });
                });
            });
        });
    });
});


app.delete('/orders/:id', function (req, res) {
    const deleteOrderItemsQuery = `DELETE FROM OrderItems WHERE orderID = ${req.params.id};`;
    const deleteOrderQuery = `DELETE FROM Orders WHERE orderID = ${req.params.id};`;

    db.pool.query(deleteOrderItemsQuery, function (error) {
        if (error) {
            console.error("Error deleting order items:", error);
            res.status(500).send("Error deleting order items.");
            return;
        }

        db.pool.query(deleteOrderQuery, function (error) {
            if (error) {
                console.error("Error deleting order:", error);
                res.status(500).send("Error deleting order.");
                return;
            }

            res.status(204).send();
        });
    });
});


// -------------------------- PLANTSUPPLIERS--------------------------------

app.get('/plantssuppliers', function(req, res)                 // This is the basic syntax for what is called a 'route'
{
    console.log('received select request for PlantsSuppliers');

    let query1 = `
    SELECT
        ps.plantSupplierID,
        ps.plantID,
        ps.supplierID,
        p.plantName,
        s.supplierName,
        ps.plantQuantity
    FROM
        PlantsSuppliers ps
    JOIN
        Plants p ON ps.plantID = p.plantID
    JOIN
        Suppliers s ON ps.supplierID = s.supplierID
    `;
    let query2 = `SELECT plantID, plantName FROM Plants`;
    let query3 = `SELECT supplierID, supplierName FROM Suppliers`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.error("Error executing query:", error);
            res.status(500).send("Error getting plant supplier");
            return;
        }
        db.pool.query(query2, function (error, plantRows, fields) {
            if (error) {
                console.error("Error executing query:", error);
                res.status(500).send("Error getting plants");
                return;
            }
            db.pool.query(query3, function (error, supplierRows, fields) {
                if (error) {
                    console.error("Error executing query:", error);
                    res.status(500).send("Error getting suppliers");
                    return;
                }
                res.render('plantssuppliers', {data:rows, plants: plantRows, suppliers: supplierRows,});
            });
        });
    });
});

app.put('/plantssuppliers/edit', function (req, res) {
    console.log('received edit request for PlantsSuppliers');
    const data = req.body;

    const query1 = `
        UPDATE PlantsSuppliers
        SET
            plantID = '${data.plantID}',
            supplierID = '${data.supplierID}',
            plantQuantity = '${data.plantQuantity}'
        WHERE
            plantSupplierID = ${data.plantSupplierID}`;
    
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.error("Error executing query:", error);
            res.status(400).send("Error updating PlantsSuppliers");
        } else {
            res.render('plantssuppliers');
        }
    });
});

app.post('/plantssuppliers/add', function (req, res) {
    console.log('received add request for PlantsSuppliers');
    const data = req.body;

    const query1 = `
        INSERT INTO PlantsSuppliers (plantID, supplierID, plantQuantity) 
        VALUES ('${data.plantID}', '${data.supplierID}', '${data.plantQuantity}')
    `;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.error("Error executing query:", error);
            res.status(400).send("Error adding PlantsSuppliers.");
        } else {
            res.redirect('/plantssuppliers');
        }
    });
});

app.delete('/plantssuppliers/:plantSupplierID', function (req, res) {
    console.log('received delete request for PlantsSuppliers');
    const { plantSupplierID } = req.params;

    const query1 = `
        DELETE FROM PlantsSuppliers 
        WHERE plantSupplierID = ${plantSupplierID};
    `;

    db.pool.query(query1, function (error, rows) {
        if (error) {
            console.error("Error executing query:", error);
            res.status(500).send("Error deleting PlantsSuppliers");
        } else {
            res.status(204).send("PlantsSuppliers successfully deleted.");
        }
    });
});

// ---------------------- PLANTS ---------------------
    
app.get('/plants', function(req, res) {

    console.log('received select request')

    let query1 = `
        SELECT 
            p.plantID,
            p.plantName,
            pt.plantTypeName,
            p.plantMaturity,
            p.plantPrice,
            p.plantCost
        FROM 
            Plants p
        JOIN 
            PlantTypes pt ON p.plantTypeID = pt.plantTypeID
    `;
    let query2 = "SELECT plantTypeID, plantTypeName FROM PlantTypes";

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.error("Error executing query:", error);
            res.status(500).send("Error retrieving plants.");
            return;
        } 
        db.pool.query(query2, function(error, plantTypeRows, fields) {
            if (error) {
                console.error("Error executing query for plant types:", error);
                res.status(500).send("Error retrieving plant types.");
                return;
            }

                res.render('plants', {
                    data: rows,
                    plantTypes: plantTypeRows
            });
        });
    });
});
    

app.put('/plants/edit', function(req, res)                 
    {
        console.log('received edit request')
        const data = req.body;
        const query1 = `UPDATE Plants
            SET
                plantName = '${data.plantName}', plantTypeID = '${data.plantTypeID}', plantMaturity = '${data.plantMaturity}', plantPrice = '${data.plantPrice}', plantCost = '${data.plantCost}'
            WHERE
                plantID = ${data.plantID}`

        db.pool.query(query1, function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);  // Error handling
            } else {
                res.render('plants');  // Redirect to the plants list page
            }
        });
            
    });    

app.post('/plants/add', function(req, res)
{
    console.log('received add request')
    const data = req.body;

    // Use the plantTypeID passed from the form
    const query1 = `
        INSERT INTO Plants 
        (plantName, plantTypeID, plantMaturity, plantPrice, plantCost) 
        VALUES 
        ('${data.plantName}', '${data.plantTypeID}', '${data.plantMaturity}', '${data.plantPrice}', '${data.plantCost}')
    `;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);  // Error handling
        } else {
            res.render('plants');  // Redirect to the plants list page
        }
    });
});

app.delete('/plants/:_id', function(req, res)                 
    {
        console.log('received delete request')
        let query1 = `
        DELETE FROM Plants WHERE plantID = ${req.params._id}
    `;
    
    db.pool.query(query1, function(error, rows){
        if (error) {
            console.error("Error executing query:", error);
            res.status(500).send("Error Deleting Plant.");
        } else {
            res.status(204).send("Plant successfully deleted")
        }
    });
    
    });   

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});