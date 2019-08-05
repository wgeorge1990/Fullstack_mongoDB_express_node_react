// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema({
    id: Number,
    message: String
}, {
    timestamps: true
    });

const UserSchema = new Schema({
    id: Number,
    username: String,
    firstname: String,
    lastname: String
}, {
        timestamps: true
    });

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);
module.exports = mongoose.model("User", UserSchema)