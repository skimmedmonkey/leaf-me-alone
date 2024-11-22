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
    // Return index page?
    res.render('plantssuppliers');      // This function literally sends the string "The server is running!" to the computer
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