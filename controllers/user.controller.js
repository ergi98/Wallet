const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const UsersDAO = require("../dao/usersDAO")

const hashPassword = async password => await bcrypt.hash(password, 10)

const verify = async(userJwt) => {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
        if (error) {
            return false
        }
        return true
    })
}

const validateToken = async (bearer) => {
    if(bearer !== undefined ) {
        const jwt = bearer.split(' ')[1]
        return await verify(jwt)
    }
    else {
        return false
    }
}

class User {
    constructor({ username, password, name, surname, personal = {} } = {}) {
        this.username = username
        this.password = password
        this.name = name
        this.surname = surname
        this.personal = personal
    }

    async comparePassword(plainText) {
        return await bcrypt.compare(plainText, this.password)
    }

    toJson() {
        return { name: this.name, surname: this.surname, username: this.username, personal: this.personal }
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
}

class UsersController {
    static async login(req, res) {
        try {
            const { username, password } = req.body

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

            // On success return the auth_token and all the user info
            res.json({ auth_token: user.encoded(), info: user.toJson() })
        } catch (e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async getUsedNames(req, res) {
        try {
            let result = await UsersDAO.getUsedNames()

            res.json({ result })
        }
        catch (e) {
            res.status(400).json({ error: e })
            return
        }
    }
    
    static async registerUser(req, res) {
        try {
            let { userData } = req.body
            
            // Encrypting the user password
            userData.password = await hashPassword(userData.password)
            
            let result = await UsersDAO.registerUser(userData)

            res.json({ result })
        }
        catch (e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async populateTransactionForm(req, res) {
        try {
            const bearer = req.headers['authorization']
            const { username } = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.populateTransactionForm(username) 
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch (e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async getAvailableAmount(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username } = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.getAvailableAmount(username)
                res.json({ result })   
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch (e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async getPortfolios(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username } = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.getPortfolios(username)
                res.json({ result }) 
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            console.log(e)
            res.status(400).json({ error: e })
            return
        }
    }

    static async getUserData(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username } = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.getUserData(username)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async getUserCategories(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username } = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.getUserCategories(username)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async getUserSources(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username } = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.getUserSources(username)
                res.json({ result }) 
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async addPortfolio(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, portfolio } = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.addPortfolio(username, portfolio)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async changeFavourite(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, portfolio } = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.changeFavourite(username, portfolio)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async deletePortfolio(req, res) {
        try {
            /**
             * delete_id - The ID of the portfolio that will be deleted
             * transfer_id - The ID of the portfolio that will get the money
             *               from the deleted portfolio
             * transfer_amnt - The amount to be transfered from the deleted portfolio
             */
            const bearer = req.headers['authorization']
            let { username, delete_id, transfer_id, transfer_amnt } = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.deletePortfolio(username, delete_id, transfer_id, transfer_amnt)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async changePassword(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, old_pass, new_pass } = req.body

            if(await validateToken(bearer)) {
                // Get current user password
                let user = await UsersDAO.getUserPassword(username)

                if(await bcrypt.compare(old_pass, user[0].password)) {
                    // Hashing the password
                    let hashed = await hashPassword(new_pass)
                    let result = await UsersDAO.updatePassword(username, hashed)
                    res.json({ result })
                }
                else {
                    res.status(401).json({ error: "The current password is not correct." })
                    return
                }
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async newCategory(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, category} = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.newCategory(username, category)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async newSource(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, source} = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.newSource(username, source)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
            // if(result.error) {
            //     res.status(401).json({error: result.error})
            //     return
            // }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async deleteCategory(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, category_id} = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.deleteCategory(username, category_id)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            } 
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async deleteSource(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, source_id} = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.deleteSource(username, source_id)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }

    static async transfer(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, from, to, amount } = req.body

            if(await validateToken(bearer)) {
                let result = await UsersDAO.transfer(username, from, to, amount)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(e) {
            res.status(400).json({ error: e })
            return
        }
    }
}

module.exports = { UsersController, User }