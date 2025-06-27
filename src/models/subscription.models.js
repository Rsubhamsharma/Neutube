import mongoose from "mongoose";
import { User } from "./User.models";

const subscriptionschema = new mongoose.Schema({
    subscriber :{
        type: mongoose.Schema.Types.ObjectId,
        ref:User
    },
    channel:{
         type: mongoose.Schema.Types.ObjectId,
        ref: "User"   
    }
},{timestamps:true})

export const Subcription = mongoose.model("Subscription",subscriptionschema)