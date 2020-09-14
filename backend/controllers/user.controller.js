const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const UsersDAO = require("../dao/usersDAO")

const hashPassword = async password => await bcrypt.hash("password", 10)

class User {
    constructor({ username, password, name, surname = {} } = {}) {
        this.username = username
        this.password = password
        this.name = name
        this.surname = surname
    }

    async comparePassword(plainText) {
        return await bcrypt.compare(plainText, this.password)
    }

    toJson() {
        return { name: this.name, surname: this.surname, username: this.username }
    }

    encoded() {
        return jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
                ...this.toJson(),
            },
            process.env.SECRET_KEY,
        )
    }

    static async decoded(userJwt) {
        return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
            if (error) {
                return { error }
            }
            return new User(res)
        })
    }
}

class UsersController {
    static async login(req, res) {
        try {
            const { username, password } = req.body

            if (!username || typeof username !== "string") {
                res.status(400).json({ error: "Bad username format, expected string." })
                return
            }
            if (!password || typeof password !== "string") {
                res.status(400).json({ error: "Bad password format, expected string." })
                return
            }

            let userData = await UsersDAO.getUser(username)

            if (!userData) {
                res.status(401).json({ error: "Make sure your username is correct." })
                return
            }

            const user = new User(userData)

            if (!(await user.comparePassword(password))) {
                res.status(401).json({ error: "Make sure your password is correct." })
                return
            }

            const loginResponse = await UsersDAO.loginUser(user.username, user.encoded())
            if (!loginResponse.success) {
                res.status(500).json({ error: loginResponse.error })
                return
            }
            // On success return the auth_token and all the user info
            res.json({ auth_token: user.encoded(), info: userData })
        } catch (e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async getSession(req, res) {
        try {
            const { username } = req.body

            let session = await UsersDAO.getUserSession(username)

            if(!session) {
                res.status(401).json({ error: "Session not found for this user." })
                return
            }
            res.json({ session })
        }
        catch (e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async logout(req, res) {
        try {
            const { username } = req.body

            if(!username || typeof username !== "string") {
                res.status(400).json({ error: "Bad username format, expected string." })
                return
            }
            
            let result = await UsersDAO.logoutUser(username)

            if(!result.success) {
                res.status(401).json({ error: "Session not found for this user." })
                return
            }
            
            res.json({ result })
        }
        catch (e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async populateTransactionForm(req, res) {
        try {
            const { username } = req.body

            if(!username || typeof username !== "string") {
                res.status(400).json({ error: "Bad username format, expected string." })
                return
            }

            let result = await UsersDAO.populateTransactionForm(username)
            
            if(!result) {
                res.status(401).json({ error: "Could not populate transaction form." })
                return
            }
            
            res.json({ result })
        }
        catch (e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async getAvailableAmount(req, res) {
        try {
            let { username } = req.body

            if(!username || typeof username !== "string") {
                res.status(400).json({ error: "Bad username format, expected string." })
                return
            }

            let result = await UsersDAO.getAvailableAmount(username)

            res.json({ result })
        }
        catch (e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async getPortfolios(req, res) {
        try {
            let { username } = req.body

            let result = await UsersDAO.getPortfolios(username)

            res.json({ result })
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }
}

module.exports = { UsersController, User }