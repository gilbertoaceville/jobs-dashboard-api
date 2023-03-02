const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;

  console.log({ user: req.user });
  if (!email || !name || !lastName || !location)
    throw new BadRequestError("Please provide all details");

  const user = await User.findOne({ _id: req.user.userId });
  // const userObj = { ...user, name, email, lastName, location };

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  //TODO: be careful with this function
  //On default, we are only re-hashing existing password (UserSchema.pre("save") in UserModel),
  //so after updating the user, we get invalid credentials because password has been hashed again

  //Check for field not updated with (!this.Modified) in the UserSchema and return null if not modified
  await user.save();

  // in createJWT() in User Model, token was created with this.name
  // in updateUser() the value of this.name has changed(updated), so we need to create another token
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

module.exports = {
  register,
  login,
  updateUser,
};
