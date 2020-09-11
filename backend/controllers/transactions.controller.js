const TransactionsDAO = require("../dao/transactionsDAO")
const UserDAO = require("../dao/usersDAO")

class TransactionsController {
    static async getDayRecap(req, res) {
        try {
            let { username, date } = req.body

            let result = await TransactionsDAO.getDayRecap(username, date) 

            if(!result) {
                res.status(401).json({ error: "Spendings not found for this user." })
                return
            }

            res.json({ result })
        }
        catch(err) {
            res.status(400).json({ error: err })
            return
        }
    }

    static async getTransactions(req, res) {
        try {
            let { username, date } = req.body

            let result = await TransactionsDAO.getTransactions(username, date)

            if(!result) {
                res.status(401).json({ error: "Transactions not found for this user." })
                return
            }
            
            res.json({ result })
        } 
        catch(err) {
            res.status(400).json({ error: err })
            return
        }
    }

    static async newTransaction(req, res) {
        try {
            let { username, date, transaction } = req.body

            let valid = await UserDAO.getPortolioAmount(username, transaction.portfolio)

            let portfolio_amount = valid[0].portfolio[0].amount.toString()

            if(transaction.trans_type === "profit") {
                let result = await TransactionsDAO.newTransaction(username, date, transaction)
                res.json({ result })
            }
            else if(transation.trans_type === "expense" && portfolio_amount - transaction.amount >= 0) {
                let result = await TransactionsDAO.newTransaction(username, date, transaction)
                res.json({ result })
            }
            else
                res.status(401).json({ error: "Not enough balance in this portfolio to complete transaction." })
        }
        catch(err) {
            res.status(400).json({ error: err })
            return
        }
    }
}

module.exports = { TransactionsController }