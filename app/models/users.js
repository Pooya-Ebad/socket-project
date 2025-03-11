const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name : {type : String},
    last_name : {type : String},
    username : {type : String, lowercase : true},
    mobile : {type : String, required : true, unique: true},
}, {
    timestamps : true,
});
UserSchema.index({first_name: "text", last_name: "text", username: "text", mobile: "text"})
module.exports = {
    UserModel : mongoose.model("user", UserSchema)
}