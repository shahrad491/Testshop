import User from "./user.mongo.js";

const authUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPass(password))) {
    throw new Error("Invalid email or password", { cause: 406 });
  } else {
    return user;
  }
};

const regUser = async (email, name, password) => {
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    throw new Error("Email already exists", { cause: 409 });
  } else {
    return await User.create({ name, email, password });
  }
};

const getUser = async (userId) => {
  return await User.findById(userId).select("_id name email isAdmin");
};

const updateUser = async (userId, data) => {
  const user = await getUser(userId);
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  } else {
    return await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    }).select("_id name email");
  }
};

const getAllUsers = async () => {
  return await User.find().select("_id name email isAdmin");
};

const deleteUser = async (userId) => {
  const user = await getUser(userId);
  if (!user) {
    throw new Error("User not Found", { cause: 404 });
  }
  if (user.isAdmin == true) {
    throw new Error("Cannot delete admin user", { cause: 403 });
  }
  return await User.findByIdAndDelete(userId).select("_id name email isAdmin");
};

const updateUserAdmin = async (userId, data) => {
  return User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).select("_id name email isAdmin");
};

export {
  authUser,
  regUser,
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
  updateUserAdmin,
};
