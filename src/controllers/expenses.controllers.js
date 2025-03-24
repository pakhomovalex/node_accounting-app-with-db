const expensesService = require('../services/expenses.service.js');
const usersService = require('../services/users.service.js');

const getAllExpenses = async (req, res) => {
  const { userId, categories, from, to } = req.query;

  let expenses = await expensesService.getAllExpenses();

  if (userId) {
    expenses = expenses.filter((e) => e.userId === userId);
  }

  if (categories) {
    expenses = expenses.filter((e) => e.category === categories);
  }

  if (from) {
    expenses = expenses.filter((e) => new Date(e.spentAt) >= new Date(from));
  }

  if (to) {
    expenses = expenses.filter((e) => new Date(e.spentAt) <= new Date(to));
  }

  res.status(200).send(expenses);
};

const getOneExpense = async (req, res) => {
  const { id } = req.params;

  if (!(await expensesService.getOne(+id))) {
    res.status(404).send('Not found');
  }

  if (typeof +id !== 'number') {
    res.status(400).send('Write correct data');

    return;
  }

  const expense = await expensesService.getOne(+id);

  if (!expense) {
    res.status(404).send('Not found');

    return;
  }

  res.status(200).send(expense);
};

const createExpense = async (req, res) => {
  const { userId, spentAt, title, amount, category, note } = req.body;

  if (
    isNaN(+userId) ||
    typeof spentAt !== 'string' ||
    typeof title !== 'string' ||
    typeof amount !== 'number' ||
    typeof category !== 'string' ||
    typeof note !== 'string' ||
    !(await usersService.getOne(+userId))
  ) {
    res.status(400).send('Write correct data');

    return;
  }

  const expense = await expensesService.create({
    userId,
    spentAt,
    title,
    amount,
    category,
    note,
  });

  res.status(201).send(expense);
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;

  if (!(await expensesService.getOne(+id))) {
    res.status(404).send('Not found');

    return;
  }

  await expensesService.deleteExpense(+id);

  res.sendStatus(204);
};

const updateExpense = async (req, res) => {
  const body = req.body;
  const { id } = req.params;

  if ((await expensesService.getOne(+id)) === null) {
    res.status(404).send('Not found');

    return;
  }

  if (Object.keys(body).length === 0) {
    res.status(400).send('Write correct data');

    return;
  }

  const updatedExpense = await expensesService.updateExpense(id, body);

  res.status(200).send(updatedExpense);
};

module.exports = {
  getAllExpenses,
  getOneExpense,
  createExpense,
  deleteExpense,
  updateExpense,
};
