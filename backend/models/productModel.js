import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    shades: { 
        type: [{
            name: { type: String, required: true },  
            colorCode: { type: String, required: true },  
            image: { type: Array, required: true }  
        }], 
        required: true 
    },
    bestseller: { type: Boolean },
    date: { type: Number, required: true }
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;