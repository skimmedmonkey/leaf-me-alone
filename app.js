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


// Database
var db = require('./database/db-connector')

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*
    ROUTES
*/
app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        // Return index page?
        res.render('index', {message: "Hello from the server!"});      // This function literally sends the string "The server is running!" to the computer
    });    
    
app.get('/plants', function(req, res)                 
    {
        // Retrieve all plants
        res.send("The plants server is running!");    
    });

app.put('/plants/:_id', function(req, res)                 
    {
        //Update plant with :_id
        res.send("The server is running!");      
    });    

app.delete('/plants/:_id', function(req, res)                 
    {
        // Delete plant with :_id
        res.send("The server is running!");      
    });    

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://flip1.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});