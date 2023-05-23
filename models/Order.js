import { mongoose } from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema({
    order: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client',
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Seller'
    },
    status: {
        type: String,
        default: 'PENDING',
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})


const Order = mongoose.model("Order", OrderSchema);
export default Order;