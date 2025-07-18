const mongoose=require("mongoose")

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    priority:{
        type:Number
    },
    status:{
        type:String,
        enum:["ToDo","In Progress","Completed"],
        default:"ToDo"
    },
    date:{
        type:Date,
        default:Date.now
    },
    authorname:{
        type:String        
    },
    user:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
    ]
});

module.exports=mongoose.model('Task',taskSchema);