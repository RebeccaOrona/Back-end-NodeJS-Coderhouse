import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'products' 

const productsSchema = new mongoose.Schema({
title: {
    type:String, 
    require: true
},
description:{
    type:String,
    require: true
},
code:{
    type:String,
    require: true
},
price: {
    type: Number,
    require: true
},
status:{
    type:Boolean,
    require: true
},
stock:{
    type:Number,
    require: true
},
category:{
    type:String,
    require: true
},
thumbnail:{
    type: Array,
    default:[]
}
})
productsSchema.plugin(mongoosePaginate);


export const productsModel = mongoose.model(productsCollection, productsSchema);