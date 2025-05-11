import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    mobile: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    cartData: { 
        type: Object, 
        default: {} 
    },
    profile: {
        dateOfBirth: { 
            type: Date, 
        },
        bloodGroup: { 
            type: String, 
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
        },
        gender: { 
            type: String, 
            enum: ['Male', 'Female', 'Other'] 
        }
    }
}, { 
    minimize: false, 
    timestamps: true 
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;