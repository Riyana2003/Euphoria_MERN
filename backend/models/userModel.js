import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    mobile: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    profile: {
        dateOfBirth: { type: Date },
        bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        addresses: [{
            type: { type: String, enum: ['Home', 'Work', 'Other'], required: true },
            address_details: { type: String, required: true },
            number: { type: Number, required: true, unique: true },
        }],
    }
}, { minimize: false, timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;