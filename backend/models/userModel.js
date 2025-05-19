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
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: { 
        type: String, 
        required: true,
        minlength: 8,
    },
    cartData: { 
        type: Object, 
        default: {} 
    },
    profile: {
        dateOfBirth: { 
            type: Date, 
            default: null,
        },
        bloodGroup: { 
            type: String, 
            default: null,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
        },
        gender: { 
            type: String, 
            default: null,
            enum: ['Male', 'Female', 'Other'] 
        }
    },
   
}, { 
    minimize: false, 
    timestamps: true 
});


const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;