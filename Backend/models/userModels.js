const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin : {
        type : Boolean,
        default : true
    },
    phone : {
        type : Number,
        required:true
    },
    otpReset : {
        type : Number,
        default : null
    },
    isVerified: { type: Boolean, default: false },
    emailToken: { type: String, default: null },

    otpResetExpires : {
        type : Date,
        default : null
    },
    // MFA fields
    mfaEnabled: {
        type: Boolean,
        default: false
    },
    mfaSecret: {
        type: String,
        default: null
    },
    mfaBackupCodes: {
        type: [String],
        default: []
    },
    lastMfaVerification: {
        type: Date,
        default: null
    },
    // Account lockout fields
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    accountLockedUntil: {
        type: Date,
        default: null
    },
    lastLoginAttempt: {
        type: Date,
        default: null
    },
    lastSuccessfulLogin: {
        type: Date,
        default: null
    },
    loginHistory: [{
        ip: String,
        userAgent: String,
        timestamp: Date,
        success: Boolean,
        mfaUsed: Boolean
    }],
    cart:[
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'products',
                required : true
            },
            quantity : {
                type : Number,
                default : 1
            }
        }
    ]

})

const User=mongoose.model('users',userSchema)
module.exports = User;