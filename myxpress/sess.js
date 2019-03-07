var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true }));
app.use(session({secret: 'secretkey'}));
var sess;


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'mydb',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection success');
    
    else
        console.log('DB connection failed' );
});

app.listen(3000, () => console.log('Express at port no : 3000'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

  
// login users

app.post('/users/login', (req, res)=> {
    sess = req.session;
    let pd = { 
        email:req.body.email,
        password:req.body.password,
         }
   console.log(req.body)

    mysqlConnection.query('SELECT * FROM users WHERE email = ?',[pd.email], function (error, results, fields) {
        if (error) {
          res.send({
            "code":400,
            "failed":"error ocurred"
          })
        }else{
          if(results.length >0){
            if(results[0].password == [pd.password]){
              res.send({'status':200});
              sess.email=req.body.email;
              sess.password=req.body.password;
              console.log(sess)

            //   res.send({message:'login successful', results });
            }
            else{
              res.send({ message:'Email and password does not match' });
            }
          }
          else{
            res.send({ message:'Email does not match' });
          }
        }
        });
                
});


