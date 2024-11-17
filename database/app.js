// App.js
// CITE THIS CODE!!!!!!!!!!!!!


/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9124;                 // Set a port number at the top so it's easy to change in the future

/*
    ROUTES
*/
app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        // Return index page?
        res.send("The server is running!")      // This function literally sends the string "The server is running!" to the computer
    });    
    
app.get('/plants', function(req, res)                 
    {
        // Retrieve all plants
        res.send("The server is running!")      
    });   

app.put('/plants/:_id', function(req, res)                 
    {
        //Update plant with :_id
        res.send("The server is running!")      
    });    

app.delete('/plants/:_id', function(req, res)                 
    {
        // Delete plant with :_id
        res.send("The server is running!")      
    });    

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});