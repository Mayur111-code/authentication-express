const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

module.exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};


module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if(!email || !password){
      return res.status(400).json({
        message: "All feilds are required"
      })
    };

    //user
    let user = await UserModel.findOne({email});
    if(!user){
      return res.status(400).json({
        message :  "User not found"
      })
    }

   let isMatch= await bcrypt.compare(password,user.password);
   if(!isMatch){
    return res.status(400).json({
      message : "Indvalid password"
    })
   }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message : "Login Successfully",user
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  
  }
}

module.exports.logout = async (req, res)=>{
  res.cookie('token','',{
    httpOnly : true,
    expires : new Date(0)
  })

  res.status(200).json({
    message : "Logged out successfully"
  })
}


module.exports.profile = async (req, res)=>{
  res.status(200).json({
    user : req.user
  })
}


