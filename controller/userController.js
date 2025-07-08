const userService = require("../services/userServices");
const AllValidation = require("../validation/AllValidation");
const { compareHash } = require('../services/auth/auth');

const loginUser = async (req, res) => {
  try {
    const userdata = req.body;
    const user = await userService.getUserByEmail(userdata.email);
    if (!user) {
      res.status(401).send("Usuario no encontrado");
    } else {
      const isValidPassword = await compareHash({ userPass: userdata.password, dbPass: user.password });
      if (isValidPassword) {
        res.send("Login exitoso");
      } else {
        res.status(401).send("Contraseña incorrecta");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


const createUser = async (req, res) => {
  try {
    const userdata = req.body;
    const hashedPassword = await authHash(userdata);
    userdata.password = hashedPassword;
    const user = await userService.createUser(userdata);
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const getRole = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const response = await userService.getRoleByEmail(userEmail);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};



const updateUser = async (req, res) => {
  try {
    const userdata = req.body;
    const { value, error } = AllValidation.updateUser.validate(userdata);
    if (error !== undefined) {
      console.log("error", error);
      res.status(400).send(error.details[0].message);
    } else {
      const response = await userService.updateUser({ id: req.params.id, ...value });
      if (!response) {
        res.sendStatus(404); // Usuario no encontrado
      } else {
        res.sendStatus(200); // Usuario actualizado con éxito
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await userService.getAllUsers();
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};




const deleteUser = async (req, res) => {};

module.exports = { loginUser, createUser, updateUser, deleteUser, getRole, getAllUsers };
