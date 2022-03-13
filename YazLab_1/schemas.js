const mongoose = require("mongoose")
const { ObjectId } = require("bson")
exports.db_cargo_address = mongoose.model("cargo_address", new mongoose.Schema({
    lat : String,
    lng : String,
    address : String
}))

exports.db_cargo_locations = mongoose.model("cargo_locations", new mongoose.Schema({
    cargoman_id : ObjectId,
    lat : String,
    lng : String,
    isDelivered : Boolean
}))

exports.db_courier_locations = mongoose.model("courier_locations", new mongoose.Schema({
    lat : String,
    lng : String,
    address : String,
    email : String
}))

exports.db_login = mongoose.model("login", new mongoose.Schema({
    username : String,
    password : String
}))

exports.db_shortest_paths = mongoose.model("shortest_paths", new mongoose.Schema({
    cargoman_id : ObjectId,
    shortest_paths : Array
}))

exports.db_verifications = mongoose.model("verifications", new mongoose.Schema({
    email : String,
    code : String
}))

