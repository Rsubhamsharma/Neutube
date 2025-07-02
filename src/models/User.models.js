import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema= new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
      },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    avatar:{
        type: String,
        required: false,

    },
    passsword:{
        type:String,
        required: true,
    },
    fullName:{
        type: String,
        

    },
    coverimage:{
        type: String,
        required: true,
    },
    watchHistory:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"video"
        }]
    },
    refershToken:{
        type: String,
        default: null
    }

},
 {
    timestamps: true    
})

userSchema.pre("save", async function(next){ // Middleware to hash password before saving, 
// pre is a hook that runs before the save operation, 
// pre takes two arguments, the first is the event that triggers the hook, 
// in this case save, and the second is a callback function that is called when the hook is done.
//in these type of cases we do not use arrow function because we nedd to access the schema using this keyword
    if(!this.isModified("passsword")){
        return next();
    }
      this.passsword = bcrypt.hash(this.passsword, 10);
        next();
   
});
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = async function (){ // this method is used to generate an access token for the user,
    // it uses the jwt library to sign a token with the user's id, username, and email,
    // the token is signed with a secret key and has an expiry time set in the environment variables.
    // this method is called on the user instance, so we can access the user properties using `this`.
    // the token is returned as a string.
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    );
    }

    userSchema.methods.generateRefreshToken = async function (){
    return jwt.sign({
        _id:this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    );
    }












export const User = mongoose.model("User", userSchema);