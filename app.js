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
PORT        = 5757;                 // Set a port number at the top so it's easy to change in the future
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

/*
    ROUTES
*/

app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        // Return index page?
        res.render('index');      // This function literally sends the string "The server is running!" to the computer
    });

app.get('/customers', function(req, res)                 // This is the basic syntax for what is called a 'route'
{
    // Return index page?
    res.render('customers');      // This function literally sends the string "The server is running!" to the computer
});   

app.get('/orders', function(req, res)                 // This is the basic syntax for what is called a 'route'
{
    // Return index page?
    res.render('orders');      // This function literally sends the string "The server is running!" to the computer
});

app.get('/plantssuppliers', function(req, res)                 // This is the basic syntax for what is called a 'route'
{
    console.log('received select request for PlantsSuppliers');

    let query1 = `
    SELECT
        ps.plantID,
        ps.supplierID,
        p.plantName,
        s.supplierName
    FROM
        PlantsSuppliers ps
    JOIN
        Plants p ON ps.plantID = p.plantID
    JOIN
        Suppliers s ON ps.supplierID = s.supplierID
    `;
    let query2 = "SELECT plantID, plantName FROM Plants";
    let query3 = "SELECT supplierID, supplierName FROM Suppliers";

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
                res.render('plantssuppliers')
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
            supplierID = '${data.supplierID}'
        WHERE
            plantID = ${data.originalPlantID} AND supplierID = ${data.originalSupplierID}`;
    
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.error("Error executing query:", error);
            res.status(400).send("Error updating PlantsSuppliers");
        } else {
            res.redirect('/plantssuppliers');
        }
    });
});

app.post('/plantssuppliers/add', function (req, res) {
    console.log('received add request for PlantsSuppliers');
    const data = req.body;

    const query1 = `
        INSERT INTO PlantsSuppliers (plantID, supplierID) 
        VALUES ('${data.plantID}', '${data.supplierID}')
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

app.delete('/plantssuppliers/:plantID/:supplierID', function (req, res) {
    console.log('received delete request for PlantsSuppliers');
    const { plantID, supplierID } = req.params;

    const query1 = `
        DELETE FROM PlantsSuppliers 
        WHERE plantID = ${plantID} AND supplierID = ${supplierID}
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

app.get('/suppliers', function(req, res)                 // This is the basic syntax for what is called a 'route'
{
    // Return index page?
    res.render('suppliers');      // This function literally sends the string "The server is running!" to the computer
});
    
app.get('/plants', function(req, res) {

    console.log('received select request')

    let query1 = `
        SELECT 
            p.plantID,
            p.plantName,
            pt.plantTypeName,
            p.plantMaturity,
            p.plantPrice,
            p.plantCost,
            p.plantInventory
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
                plantName = '${data.plantName}', plantTypeID = '${data.plantTypeID}', plantMaturity = '${data.plantMaturity}', plantPrice = '${data.plantPrice}', plantCost = '${data.plantCost}', plantInventory = '${data.plantInventory}'
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
        (plantName, plantTypeID, plantMaturity, plantPrice, plantCost, plantInventory) 
        VALUES 
        ('${data.plantName}', '${data.plantTypeID}', '${data.plantMaturity}', '${data.plantPrice}', '${data.plantCost}', '${data.plantInventory}')
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