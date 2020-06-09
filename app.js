var express = require('express')
var cors = require('cors')
const bodyParser= require('body-parser')
var mssql = require("mssql");  



var app = express()
var cors = require('cors')
app.use(express.static('assets'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

var msconfig = {
    user: 'DB_A2A9C5_db_admin',
    password: 'pass@word123',
    server: 'sql6009.site4now.net', 
    database: 'DB_A2A9C5_db' ,
    options:{
    enableArithAbort:true
    }
};





const TABLE_NAME = 'TblTodoRecord';



app.get('/', function (req, res) {
  mssql.connect(msconfig, function (err) {       
        if (err) console.log(err);
        var request = new mssql.Request();
        request.query("SELECT * FROM "+TABLE_NAME+";", function (err, recordset) {
            
            res.render('index.ejs', { todos: recordset})
        });
  });      
});
app.get('/todo/get', function (req, res) {
  mssql.connect(msconfig, function (err) {
    
        if (err) console.log(err);
        var request = new mssql.Request();
        request.query("SELECT * FROM "+TABLE_NAME+";", function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset);
            
        });
    });
  //res.send([])
   
  
});

app.post('/todo/post', function (req, res) {
 
  //res.send([])
   mssql.connect(msconfig).then(pool => {
    // Query
    
    return pool.request()
        .input('title', mssql.VarChar, req.body.title)
        .input('description', mssql.VarChar, req.body.description)
        .query('insert into '+TABLE_NAME+' (title,description) values (@title,@description)')
        //var result={};
        //  result.message = 'Succesfully Added Todo'
        //res.send(result);
  }).then(result => {
      console.dir(result)
      //result.message = 'Succesfully Added Todo';
      res.send(result);
  }).catch(err => {
    // ... error checks
    console.log(err)
  });
  
});

app.delete('/todo/delete/:id', function (req, res) {
 
  //res.send([])
   mssql.connect(msconfig).then(pool => {
    // Query
    
    return pool.request()
        .input('id', mssql.Int, req.params.id)
        .query("DELETE FROM "+TABLE_NAME+" WHERE id=@id;")
        //var result={};
        //  result.message = 'Succesfully Added Todo'
        //res.send(result);
  }).then(result => {
      console.dir(result)
      //result.message = 'Succesfully Deleted Todo';
      res.send(result);
  }).catch(err => {
    // ... error checks
    console.log(err)
  });
  
});





let port = process.env.PORT || 3000;
app.listen(port, function () {
    return console.log("Started server on port " + port);
});