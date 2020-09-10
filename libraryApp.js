//Packages
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let randStr = require('randomstring');
let express = require('express');

//Schema
let Author = require('./models/author');
let Books = require('./models/book');

let DB_URL = 'mongodb://localhost:27017/libraryDB';

let app = express();

//settign up ejs and body-parser
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.listen(8080);

mongoose.connect(DB_URL,function (err) {
    if (err) {
        //console.log(err);
    }
    else{
        //console.log('Connect to DB successful');
    
    }

})


//---------End Points----------------


app.get('/',function (req,res) {
  res.sendFile(__dirname+'/views/home.html');
});

app.get('/addbook',function (req,res) { 
    let newisbn = generatrand();
    console.log('new isbn'+ newisbn);
    res.render('addbook.html',{ISBN: newisbn})
    
});

app.post('/addbook',function (req,res) {
    let book1 = new Books({
        _id:new mongoose.Types.ObjectId(),
        title: req.body.title,
        author: req.body.author,
        ISBN: req.body.ISBN,
        dop: req.body.dop,
        summary:req.body.summary
    })
    console.log("newly added book "+ book1);
    console.log( req.body);
    
    book1.save(function (err) {
        if(err) {
            res.redirect('/addbook');
        }
        else{
            Author.updateOne({_id: req.body.author},{$inc:{numBooks:1}},function (err,doc) {   
            })
            res.redirect('/getallbook');
        }
    })
})

app.get('/addauthor',function (req,res) {
    res.sendFile(__dirname+'/views/addauthor.html');
})

app.post('/addauthor',function (req,res) {
    let author1= new Author({
        _id: new mongoose.Types.ObjectId(),
        name:{
            firstName: req.body.fname,
            lastName: req.body.lname
        },

        dob: req.body.dob,
        address:{
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        },

        numBooks: req.body.numBooks
    })
    console.log("New author created "+ author1);
    console.log('New Author-');
    console.log(req.body);

    author1.save(function (err) {
        if (err) {
            res.redirect('/addauthor');
            console.log(err);
        }else{
            //console.log('Author added to Library DB');
            res.redirect('/getallauthor');
        }

    })
})

app.get('/deletebook',function (req,res) {
    res.sendFile(__dirname+'/views/deletebook.html');
})

app.post('/deletebook',function (req,res) {
    //console.log('delete book');

    let delBookid = {ISBN:req.body.ISBN};
    
    /*
    Books.findOne(delBookid,function(err,doc){
        Author.updateOne({_id:req.body.id},{$inc:{numBooks:-1}}, function (err, doc) {

        })
    })
    */
    
    Books.deleteOne(delBookid,function (err,doc) {
        res.redirect('/getallbook');
    })

    
})

//GET getllbook.html
app.get('/getallbook',function(req,res){
    Books.find({}).populate('author').exec(function (err, data) {
        //console.log(data);
        res.render('getallbook',{bookDB:data});
     });    
});


//GET getallauthor html
app.get('/getallauthor',function(req,res){
    Author.find({}).exec(function (err, data) {
        //console.log(data);
        res.render('getallauthor',{bookDB:data});
     });    
});

app.get('/updatebook',function (req,res) {
    res.sendFile(__dirname+'/views/updatebook.html');
})

app.post('/updatebook',function (req,res) {
    res.redirect('/getallbook');
});


app.get('/updateauthor',function (req,res) {
    res.sendFile(__dirname+'/views/updateauthor.html');
})

app.post('/updateauthor',function (req,res) {
    Author.findByIdAndUpdate({_id: req.body.id},{numBooks: req.body.numBooks},function (err,result) {
        if(err){
            res.redirect('/updateauthor');
        }else{
            res.redirect('/getallauthor');
        }
    })
});


function generatrand(){


    return randStr.generate({
        length:13,
        charset: 'numeric'
    })
}