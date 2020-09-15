const router = require('express').Router()
const users = require('../controllers/user.controller')

router.route("/login").post(users.UsersController.login)
router.route("/logout").post(users.UsersController.logout)
router.route("/session").post(users.UsersController.getSession)
router.route("/portfolios").post(users.UsersController.getPortfolios)
router.route("/user-data").post(users.UsersController.getUserData)
router.route("/available-amount").post(users.UsersController.getAvailableAmount)
router.route("/populate-transactions").post(users.UsersController.populateTransactionForm)


module.exports = router;