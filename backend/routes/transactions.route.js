const router = require('express').Router()

const transactions = require('../controllers/transactions.controller')

router.route('/spendings').post(transactions.TransactionsController.getSpendings)
router.route('/list').post(transactions.TransactionsController.getTransactions)

module.exports = router;