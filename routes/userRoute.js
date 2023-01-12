const express = require('express');
const User = require('../models/userModel');
const { getToken, isAuth } = require( '../util');
const bcrypt = require('bcryptjs')

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const usersf = await User.find({}).sort({ "fecha": -1 }).limit(25);
  if(usersf){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(usersf);
    console.log('users',usersf)
  }else{
    res.status(404).send({ message: 'Usuario no encontrado' });
  }
});


router.get("/reducido", isAuth, async (req, res) => {
  console.log('get users reducido' )
  const usersf = await User.find({}).sort({ "fecha": -1 }).limit(25);
  if(usersf){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    const usuarios = usersf.filter((u)=>(u.isAdmin === false)).map((usr)=>{
      const v_nombre = usr.nombre+" "+usr.apellido;
      return {nombre:v_nombre,perfil:usr.perfil,sucursal:usr.sucursal,perfil:usr.perfil}})
    res.send(usuarios);
    console.log('usuarios',usuarios)
  }else{
    res.status(404).send({ message: 'Usuario no encontrado' });
  }
});

router.put('/:id', isAuth, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  //console.log('user sucursal',req.body.sucursal);
  if (user) {
    user.nombre = req.body.nombre || user.nombre;
    user.apellido = req.body.apellido || user.apellido;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.isAdmin = req.body.isAdmin || user.isAdmin;
    user.perfil = req.body.perfil || user.perfil;
    user.sucursal = req.body.sucursal || user.sucursal;
    user.sucursalTipo = req.body.sucursalTipo || user.sucursalTipo;
    user.isActive = req.body.isActive || user.isActive;
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      nombre: updatedUser.nombre,
      apellido: updatedUser.apellido,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      perfil: updatedUser.perfil,
      sucursal: updatedUser.sucursal,
      sucursalTipo: updatedUser.sucursalTipo,
      isActive: updatedUser.isActive,
      token: getToken(updatedUser)
    });
  } else {
    res.status(404).send({ message: 'Usuario no encontrado' });
  }

});

router.post('/signin', async (req, res) => {
  console.log('signin req.body',req.body )
  console.log('signin req.params',req.params )
  //console.log('signin req =',req )

  const oldUser = await User.findOne({email: req.body.email});
  if(!oldUser){
    console.log('Usuario No Existe.');
    res.status(404).send({ message: 'Usuario no existe.' });
  }else{
    const isPasswordCorrect = await bcrypt.compare(req.body.password,oldUser.password);
    if (!isPasswordCorrect) {
      res.status(400).send({ message: 'Password Incorrecto.' });
    }else{
      if (!oldUser.isActive) {
        res.status(400).send({ message: 'Usuario Inactivo.' });
      }else{
        res.send({
          _id: oldUser.id,
          nombre: oldUser.nombre,
          apellido: oldUser.apellido,
          email: oldUser.email,
          isAdmin: oldUser.isAdmin,
          perfil: oldUser.perfil,
          sucursal: oldUser.sucursal,
          sucursalTipo: oldUser.sucursalTipo,
          isActive: oldUser.isActive,
          token: getToken(oldUser)
        });
        console.log('Send datos de User',oldUser);
      }
    }
  }
  
  // const signinUser = await User.findOne({
  //   email: req.body.email,
  //   password: req.body.password
  // });
  // if (signinUser) {
  //   res.send({
  //     _id: signinUser.id,
  //     nombre: signinUser.nombre,
  //     apellido: signinUser.apellido,
  //     email: signinUser.email,
  //     isAdmin: signinUser.isAdmin,
  //     perfil: signinUser.perfil,
  //     token: getToken(signinUser)
  //   });
  //   console.log('Send datos de User',signinUser);
  // } else {
  //   console.log('Invalid Email or Password.');
  //   res.status(401).send({ message: 'Email o Password incorrecto.' });
  // }

});

router.post('/signup', async (req, res) => {
  console.log('signup req.body ',req.body);

  const oldUser = await User.findOne({email:req.body.email})
  if(oldUser){
    res.status(400).send({ message: 'Error: Usuario ya existente.' });
  }else{
    const hashedPassword = await bcrypt.hash(req.body.password,12)
    const user = new User({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      password: hashedPassword,
      isAdmin:req.body.isAdmin,
      perfil: req.body.perfil,
      sucursal: req.body.sucursal,
      sucursalTipo: req.body.sucursalTipo
    });
    const newUser = await user.save();
    if (newUser) {
      res.send({
        _id: newUser.id,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        perfil: newUser.perfil,
        sucursal: newUser.sucursal,
        sucursalTipo: newUser.sucursalTipo,
        isActive: newUser.isActive,
        token: getToken(newUser)
      })
    } else {
      res.status(401).send({ message: 'Datos de usurio invalidos.' });
    }
  }
});

router.get("/createadmin", async (req, res) => {
  console.log('User Route - Createadmin')
  try {
    const hashedPassword = await bcrypt.hash('1234',12)
    const user = new User({
      nombre: 'Miguel',
      apellido: 'Angel',
      email: 'miguel.angel@gmail.com',
      password: hashedPassword,
      isAdmin: true,
      perfil: 'Admin',
      sucursal: 'Central',
      sucursalTipo: 'Central',
      isActive: true,
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ msg: error.message });
  }
});

//export default router;
module.exports = router;