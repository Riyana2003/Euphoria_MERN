import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    mobile: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    // New fields
    profile: {
        fullName: { type: String },
        dateOfBirth: { type: Date },
        bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        addresses: [{
            type: { type: String, enum: ['Home', 'Work', 'Other'], required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
        }],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
    }
}, { minimize: false, timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;