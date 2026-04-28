
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    description: {
        type: String,
        trim: true,
        default: '',
        maxLength: 500
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true // hướng mở rộng sau này 
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
})

const Product = mongoose.model("Product", productSchema)

export default Product