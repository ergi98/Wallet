const jwt = require("jsonwebtoken")
const TransactionsDAO = require("../dao/transactionsDAO")
const UserDAO = require("../dao/usersDAO")

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

class TransactionsController {
    static async getDayRecap(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, date } = req.body

            if(await validateToken(bearer)) {
                let result = await TransactionsDAO.getDayRecap(username, date) 
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(err) {
            res.status(400).json({ error: err })
            return
        }
    }

    static async getTransactions(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, date, portfolio } = req.body

            if(await validateToken(bearer)) {
                let result = await TransactionsDAO.getTransactions(username, date, portfolio)            
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        } 
        catch(err) {
            res.status(400).json({ error: err })
            return
        }
    }

    static async newTransaction(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, date, transaction } = req.body

            
            if(await validateToken(bearer)) {
                if(transaction.trans_type === "profit") {
                    let result = await TransactionsDAO.newTransaction(username, date, transaction)
                    res.json({ result })
                }
                else if(transaction.trans_type === "expense") {
    
                    let valid = await UserDAO.getPortolioAmount(username, transaction.portfolio)
    
                    let portfolio_amount = valid[0].portfolio[0].amount.toString()
    
                    if(portfolio_amount - transaction.amount >= 0) {
                        let result = await TransactionsDAO.newTransaction(username, date, transaction)
                        res.json({ result })
                    }
                    else
                    res.status(401).json({ error: "Not enough balance in this portfolio to complete transaction." })
                }
                else
                    res.status(404).json({ error: "Transaction type not supported." })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(err) {
            res.status(400).json({ error: err })
            return
        }
    }

    static async deleteTransaction(req, res) {
        try{
            const bearer = req.headers['authorization']
            let { username, date, transaction} = req.body

            if(await validateToken(bearer)) {
                let result = await TransactionsDAO.deleteTransaction(username, date, transaction)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(err) {
            res.status(400).json({error: err})
            return
        }
    }

    static async incomeVSexpense(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, start_date, end_date } = req.body

            if(await validateToken(bearer)) {
                let result = await TransactionsDAO.incomeVSexpense(username, start_date, end_date)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        }
        catch(err) {
            res.status(400).json({error: err})
            return
        }
    }

    static async transactionChart(req, res) {
        try {
            const bearer = req.headers['authorization']
            let { username, type, start_date, end_date} = req.body

            if(await validateToken(bearer)) {
                let result = await TransactionsDAO.transactionChart(username, type, start_date, end_date)
                res.json({ result })
            }
            else {
                res.status(403).json({ error: "Invalid token!"})
            }
        } 
        catch(err) {
            res.status(400).json({error: err})
            return
        }
    }
}

module.exports = { TransactionsController }