import { mongoose } from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

ProductSchema.index({ name: 'text'})


const Product = mongoose.model("Product", ProductSchema);
export default Product;