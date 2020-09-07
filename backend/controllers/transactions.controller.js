const TransactionsDAO = require("../dao/transactionsDAO")

class TransactionsController {
    static async getSpendings(req, res) {
        try {
            let { date } = req.body

            let result = await TransactionsDAO.getSpendings(date) 

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
            let { date } = req.body

            let result = await TransactionsDAO.getTransactions(date)

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
}

module.exports = { TransactionsController }