const mongoose=require("mongoose");
const PollingSchema=new mongoose.Schema({
    question:{type:String,required:true},
    options:{type:[String],required:true},//an array
    votes:{type:Map,of:Number,default:{} },//should store votes as an object
    isActive:{type:Boolean,default:true}

});

module.exports=mongoose.model("Polling",PollingSchema);