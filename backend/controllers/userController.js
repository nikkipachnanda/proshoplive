import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import generateTokens from "../utils/generateTokens.js";

//auth user & get token
//post api/users/login
//@access public

const authUser = asyncHandler(async (req, res) => {
  //res.send("auth users");
  console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateTokens(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//Register user
//post api/users
//@access public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate tokens and respond with user data
    if (user) {
      generateTokens(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    // Handle error appropriately, depending on your error handling middleware
    res.status(500).json({ message: error.message });
  }

  //res.send("register users");
});

//Logout user / Clear cookies
//post api/users/logout
//@access private

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfuly" });
});

//Get user profile
//@route Get /api/users/profile
//@access Pubic

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }

  //res.send("Get user profile");
});

//update user profile
//@route put /api/users/profile
//@access Pubic

const updateUserProfile = asyncHandler(async (req, res) => {
  console.log("Updating profile for user:", req.user._id);

  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // Make sure password hashing is handled in the User model
      console.log("Password updated");
    }

    try {
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error saving the user:", error.message);
      res.status(500);
      throw new Error("Error updating profile");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }

  //res.send("update user profile");
});

//get users
//@route put /api/users
//@access Private/Admin

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

//get users by id
//@route put /api/users/:id
//@access Private/Admin

const getUsersById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }

  //res.send("get users by id");
});

//delete users
//@route delete /api/users/:id
//@access Private/Admin

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      throw new Error("Can not delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
  res.send("delete users");
});

//update users
//@route put /api/users/:id
//@access Private/Admin

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsersById,
  getUsers,
  deleteUser,
  updateUser,
};
