const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: {
    type: String, required: true, unique: true, index: true, dropDups: true,
  },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  perfil: { type: String, required: true},
  sucursal: { type: String, required: true},
  sucursalTipo: { type: String, required: true},
  isActive: { type: Boolean, required: true, default: true }
},{timestamps:true});

/* userSchema.methods.encrypPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password,salt)
}

userSchema.methods.matchPassword = function(password){
  return bcrypt.compare(password,this.password)
} */
const userModel = mongoose.model('User', userSchema);

//export default userModel;
module.exports = userModel;
