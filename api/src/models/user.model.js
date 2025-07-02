import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: "CUSTOMER",
    },
    phone: {
        type: Number,
        minlength: 10,
        unique: true,
        required: true,
    },
    dob: {
        type: Date, // Date of Birth field
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], // Gender field with predefined options
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    }],
    paymentInformation: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment_information",
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratings",
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "reviews",
    }],
    profileImage: {
        type: String, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

userSchema.methods = {
    generateUserToken: function() {
        return jwt.sign(
            {
                id: this._id,
                role: this.role,
                email: this.email,
                firstName: this.firstName,
                lastName: this.lastName,
                dob: this.dob,  // Add date of birth to JWT
                gender: this.gender,  // Add gender to JWT
                phone: this.phone,  // Add mobile number to JWT
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    },
}

const User = mongoose.model("User", userSchema);

export default User;
