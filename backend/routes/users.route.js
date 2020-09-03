const router = require('express').Router()
const users = require('../controllers/user.controller')

router.route("/login").post(users.UsersController.login)
router.route("/session").post(users.UsersController.getSession)

module.exports = router;