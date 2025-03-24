const { User } = require('../models/User.model.js');

const getAllUsers = async () => (await User.findAll()) || [];

// const getId = () =>
//   users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

const getOne = async (id) => {
  const user = (await User.findByPk(id)) || null;

  return user;
};

const create = async (name) => {
  const user = await User.create({ name });

  return user;
};

const deleteUser = async (id) => {
  await User.destroy({
    where: { id },
  });
};

const updateUser = async ({ id, name }) => {
  await User.update({ name }, { where: id });
};

module.exports = {
  getAllUsers,
  getOne,
  create,
  deleteUser,
  updateUser,
};
