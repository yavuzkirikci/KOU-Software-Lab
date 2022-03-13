const { ObjectId } = require("bson")
const mongoose = require("mongoose")
const { db_cargo_address, db_cargo_locations, db_courier_locations, db_login, db_shortest_paths, db_verifications } = require("./schemas")
const url = "mongodb+srv://admin:uzunburunmurat@cluster0.suejd.mongodb.net/mydb?retryWrites=true&w=majority"

// Database bağlantı değişkenleri
async function initDatabase(){
    await mongoose.connect(url);
    await db_cargo_address.deleteMany({})
    await db_cargo_locations.deleteMany({})
    await db_shortest_paths.deleteMany({})
    console.log("Database baglandi!");
}
initDatabase()



