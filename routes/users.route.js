const router = require('express').Router()
const users = require('../controllers/user.controller')

router.route("/login").post(users.UsersController.login)
router.route("/logout").post(users.UsersController.logout)
router.route("/session").post(users.UsersController.getSession)
router.route("/portfolios").post(users.UsersController.getPortfolios)
router.route("/user-data").post(users.UsersController.getUserData)
router.route("/available-amount").post(users.UsersController.getAvailableAmount)
router.route("/populate-transactions").post(users.UsersController.populateTransactionForm)
router.route("/add-portfolio").post(users.UsersController.addPortfolio)
router.route("/change-portfolio-fav").post(users.UsersController.changeFavourite)
router.route("/delete-portfolio").post(users.UsersController.deletePortfolio)
router.route("/change-password").post(users.UsersController.changePassword)
router.route("/new-category").post(users.UsersController.newCategory)
router.route("/new-source").post(users.UsersController.newSource)

module.exports = router;