const router = require('express').Router()

const transactions = require('../controllers/transactions.controller')

router.route('/daily-recap').post(transactions.TransactionsController.getDayRecap)
router.route('/list').post(transactions.TransactionsController.getTransactions)

module.exports = router;