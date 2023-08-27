import mongoose from "mongoose";


const categorySchema =new mongoose.Schema({
    name:{
        type:String,
        //require:true,
        //unique:true,
    },
    slug:{
        type:String,
        lowercade:true,
    },
})
export default mongoose.model("Category",categorySchema);
