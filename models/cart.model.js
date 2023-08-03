import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const cartsCollection = 'carts' 

const cartsSchema = new mongoose.Schema({
products: [{
    _id: false,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }]
})
cartsSchema.plugin(mongoosePaginate);


export const cartsModel = mongoose.model(cartsCollection, cartsSchema);