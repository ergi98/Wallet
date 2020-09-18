const router = require('express').Router()

const transactions = require('../controllers/transactions.controller')

router.route('/daily-recap').post(transactions.TransactionsController.getDayRecap)
router.route('/list').post(transactions.TransactionsController.getTransactions)
router.route('/new-transaction').post(transactions.TransactionsController.newTransaction)
router.route('/delete-transaction').post(transactions.TransactionsController.deleteTransaction)

module.exports = router;