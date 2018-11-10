const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();

//Method Override middleware use for put method
app.use(methodOverride('_method'));

//Load Student Model
require('./models/students');
const Student = mongoose.model('students');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose


/* mongoose.connect('mongodb://localhost/Primehostel-dev', {
  useMongoClient: true
}) */
mongoose.connect('mongodb://hostel:hostel1234@ds111258.mlab.com:11258/primehostel',{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

  // Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
  

//Handlebars Middleware from https://github.com/ericf/express-handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Index 
app.get('/',(req , res)=>{
    const title = 'Welcome'
    res.render("index", {title : title});
});

//About
app.get('/about',(req ,res)=>{
    res.render("about");
});



//Add Students Route

app.get('/students/add', (req, res) => {
    res.render('students/add');
  });


//Edit Students Route

app.get('/students/edit/:id', (req, res) => {
    Student.findOne({   //Student Load model wala h
        _id : req.params.id  //Jo id edit krni wo or _id isliye k db may aesa _id hota
    })
    .then(students => {    //students db wala name
        res.render('students/edit',{  //edit ka page bnana
        students : students
        });
    });
  });

  //Update Students Process
  app.put('/students/:id',(req, res)=>{
    Student.findOne({
        _id : req.params.id
    })
    .then(students=>{
        //new student data enter
        students.name =req.body.name;
        students.fathername = req.body.fathername ;
        students.mobile = req.body.mobile;
        students.save()
        .then(students=>{
            res.redirect('/students');
        })
    });
    });


    //Delete student data 
    app.delete('/students/:id',(req,res)=>{
        Student.remove({_id : req.params.id})
        .then(()=>{
            res.redirect('/students');
        })

    })

  // Students Index Page

app.get('/students', (req, res) => {
    Student.find({})
    .sort({date : 'desc'})
    .then(students => {    //students db may name h isliye likha
        res.render('students/index',{
            students : students   //pehla students obj h second variable
        });
    });
    
  });


  //Process Form
app.post('/students', (req, res) => {
    let errors = [];

    if(!req.body.name){
        errors.push({text :'Please add a name.'});
    }
    
    if(!req.body.fathername){
        errors.push({text :'Please add a fathername.'});
    }
    
    if(!req.body.mobile){
        errors.push({text :'Please add a mobile.'});
    }
//check if errors then errors ko deal krna frontend pr show krna add.handlebars may ja kr
    if (errors.length > 0){
        res.render('students/add',{
            errors : errors,
            name : req.body.name,
            fathername : req.body.fathername ,
            mobile : req.body.mobile
        });
    }else{
        const newUser ={
            name : req.body.name ,
            fathername : req.body.fathername ,
            mobile :req.body.mobile
        }
        new Student(newUser)
        .save()
        .then(Student => {
            res.redirect('/students');
        })
        
    }
    });


    
port =5000;
app.listen(port ,()=>{
    console.log(`server is running on port ${port}`);
});