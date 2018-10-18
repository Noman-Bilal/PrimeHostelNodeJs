const mongoose = require('mongoose');
const Schema  =  mongoose.Schema;

//Create Schema

const Student_Schema = new Schema({
    name :{
        type :String ,
        required : true
    },
    fathername : {
        type : String,
        required : true
    },
    mobile : {
        type : Number,
        required :true
    },
    date :{
        type : Date ,
        default :  Date.now
    }
});

//For setup our schema
mongoose.model("students",Student_Schema );