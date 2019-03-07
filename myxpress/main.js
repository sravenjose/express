var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true }));

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

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

// Read all users data
app.get('/user',(req,res)=>{
    mysqlConnection.query("SELECT * FROM user",(err,rows,fields)=>{
        if (err) {
            res.send('query not success' );
            
        }
         else
            res.status(200).send(rows);
    })
});


// // Read specifc data
// app.get('/users/:name',(req,res)=>{
//     var name=req.params.name
//     mysqlConnection.query("SELECT  FROM users WHERE name= ?",[name],(err,rows,fields)=>{
//         if (err)
//             res.send('query not success' );
//          else
//             res.status(200).send(rows);

//     })
// });


//Delete user
app.delete('/user/:name',(req,res)=>{
    var name=req.params.name
    console.log(name)
    mysqlConnection.query("DELETE FROM user WHERE name= ?",[name],(err,rows,fields)=>{
        if (err){
            res.send('query not success' );
        }
         else
            res.status(200).send(rows);
        

    })
});

// update
app.put('/user', (req, res)=> {

    let pd = { name: req.body.f_name, 
        password:req.body.f_password,
         }

    console.log(req.body)
   mysqlConnection.query('UPDATE user SET password=? WHERE name = ? ',[pd.password,pd.name], (err, rows, fields)=> {
    if (err) 
        console.log("Failed:" + err)
    else {
    mysqlConnection.query("SELECT *FROM user WHERE name= ?",[pd.name],(err,rows,fields)=>{
            if (!err)
                res.status(200).send({ message: 'success',data:rows});                
                 else
                res.send('query not success' );
          })
        return 
    }
    });
        
});
  
// insert users
app.post('/user/signup', (req, res)=> {

    let pd = { name: req.body.name, 
            email:req.body.email,
            password:req.body.password,
            age:req.body.age }

    console.log(req.body)

    mysqlConnection.query("INSERT INTO user SET ? ", pd , (err, rows, fields)=> {
        if (err) 
        console.log("Failed:" + err)

        else {
            mysqlConnection.query("SELECT * FROM user WHERE name= ?",[pd.name],(err,rows,fields)=>{
                if (!err)
                res.send({'status':200});               
                 else
                res.send('query not success' );
        
            })
        return 
        }
    });
});

// login users

app.post('/user/login', (req, res)=> {

    let pd = { 
        email:req.body.email,
        password:req.body.password,
         }
   console.log(req.body)

    mysqlConnection.query('SELECT * FROM user WHERE email = ?',[pd.email], function (error, results, fields) {
        if (error) {
          res.send({
            "code":400,
            "failed":"error ocurred"
          })
        }else{
          if(results.length >0){
            if(results[0].password == [pd.password]){
              res.send({'status':200});
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

//read courses
app.get('/courses',(req,res)=>{
    mysqlConnection.query("SELECT * FROM courses",(err,rows,fields)=>{
        if (err) {
            res.send('query not success' );
            
        }
         else
            res.send({course:rows});
    })
});

//delete course
app.delete('/courses/:name',(req,res)=>{
    var name=req.params.name
    console.log(name)
    mysqlConnection.query("DELETE FROM courses WHERE name= ?",[name],(err,rows,fields)=>{
        if (err){
            res.send('query not success' );
        }
         else
            // res.send(rows);
            res.send({'status':200});  
        

    })
});


// Add courses
app.post('/courses', (req, res)=> {

    let pd = { name: req.body.name, 
            link:req.body.link,
            duration:req.body.duration,
            price:req.body.price }

    console.log(req.body)

    mysqlConnection.query("INSERT INTO courses SET ? ", pd , (err, rows, fields)=> {
        if (err) 
        console.log("Failed:" + err)

        else {
            mysqlConnection.query("SELECT * FROM courses WHERE name= ?",[pd.name],(err,rows,fields)=>{
                if (!err)
                res.send({'status':200});                
                 else
                res.send('query not success' );
        
            })
        return 
        }
    });
});

// Update 
app.put('/courses', (req, res)=> {

    var pd = {
		name: req.body.name, 
        duration:req.body.duration,
        price:req.body.price,
        link: req.body.link
	}

    console.log(req.body)
	mysqlConnection.query("UPDATE courses c set c.duration = ?, c.price = ?, c.link = ? WHERE name = ?", [pd.duration, pd.price, pd.link, pd.name], (err, rows, fields)=> {
		if (err) {
            console.log("Failed:");
            res.send(rows)
		} else {
            console.log("Update successfull");
            res.send(rows)
		}
    });
        
});



// Read specifc data
app.get('/courses/:name',(req,res)=>{
    var pd = {
		name : req.params.name
	}
    console.log(pd.name)
    mysqlConnection.query("SELECT * FROM courses WHERE name = ?", [pd.name], (err,rows,fields)=>{
        if (err) {
            res.send("Failed:");
            res.send(rows)
        } else {
            res.send(rows);
            //  console.log(rows);
        }
    });
});