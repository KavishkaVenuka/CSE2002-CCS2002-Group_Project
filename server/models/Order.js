import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    
    orderID :{
        type:String,
        required:true,
        unique: true
    },
    email:{
        type:String,
        required:true,

    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
        default: Date.now
    },
    total:{
        type: Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        default: "Pending"
    },
    notes:{
        type:String,
        required:false
    },
    phonenumber:{
        type:Number,
        required:true
    },
    items:[
        {
            productID: {type:String, required:true},
            name: {type:String, required:true},
            price: {type:Number, required:true},
            quantity: {type:Number, required:true},
            image: {type:String, required:true}

        }
    ]



})

const Order = mongoose.model('Order', orderSchema);

export default Order;