const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const handlebars = require('express-handlebars')
 
const app = express()
const urlencodeparser = bodyParser.urlencoded({extended:false})
const sql = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port:'3306',
    database:'cadastros'
    
})

sql.connect(function(err){
    if(err) throw err
        console.log('Conexão realizada com Sucesso!')    
})

app.use(express.json())
//engine dos templates handlebars
app.engine("handlebars", handlebars({defaultLayout:'main'}))
app.set('view engine', 'handlebars')

// criando Rotas
app.get("/", function(req, res){
    res.render('index')
}) 

//criando rotas dos arquivos css e javascript
app.get('/inserir', function(req, res){res.render('inserir')
})

app.post("/controllerform", urlencodeparser,function(req,res){  

sql.query('insert into user values(?,?,?,?,?,?,?,?)', [req.body.id,req.body.name,req.body.age,req.body.email,req.body.bairro,req.body.cidade,req.body.Escolaridade,req.body.nascimento]);
res.render('controllerform')  
})
app.use('/img', express.static('img'))
app.use('/js', express.static('js'))
app.use('/css', express.static('css'))

app.get('/select/:id?', function(req, res){   
    if(!req.params.id){
     sql.query("select * from user order by id asc", function(err,results,fields){
         
     
        const [{ id, name, age, email, bairro, cidade, Escolaridade, nascimento }] = results

        var nasc_conv = new Date(nascimento)
        var ano = nasc_conv.getDate()
        var mes = nasc_conv.getMonth()
        var dia = nasc_conv.getDate()
        var date_nasc= `${ano}/${mes}/${dia}`

        results.nascimento = date_nasc
        console.log(results.nascimento)
         res.render('select',{ data:results })  
       
     })
    }else{
        sql.query("select * from user where id=?",[req.params.id], function(err,results,fields){
            res.render('select',{ data:results })         
        })
    }
   
})
app.get('/deletar/:id', function(req, res){
    sql.query('delete from user where id = ?', [req.params.id])
  res.render('deletar')  
})

app.get('/update/:id', function(req, res){
    sql.query('select * from user where id=?', [req.params.id], function(err, results, fields){
        res.render('update',{id:req.params.id, name:results[0].name,age:results[0].age})
    })
    

})

app.post('/update/atualiza', urlencodeparser, function(req,res){
    sql.query('update user set name=?, age=?, email=?, bairro=?, cidade=?, Escolaridde=?, nascimento=?, where id=?', [req.body.name,req.body.age,req.body.email,req.body.bairro,req.body.cidade,req.body.Escolaridade,req.body.nascimento,req.body.id])
    res.render('atualiza')
})


app.listen(3000, function(req, res){
    console.log('Servidor Online!')
})