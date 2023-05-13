import { mongoose, trusted } from "mongoose";

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


const Product = mongoose.model("Product", ProductSchema);
export default Product;