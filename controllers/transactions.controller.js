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
            let { username, date, portfolio } = req.body

            let result = await TransactionsDAO.getTransactions(username, date, portfolio)

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
        catch(err) {
            res.status(400).json({ error: err })
            return
        }
    }

    static async deleteTransaction(req, res) {
        try{
            let { username, date, transaction} = req.body

            let result = await TransactionsDAO.deleteTransaction(username, date, transaction)
            res.json({ result })
        }
        catch(err) {
            res.status(400).json({error: err})
            return
        }
    }

    static async incomeVSexpense(req, res) {
        try {
            let { username, start_date, end_date } = req.body

            let result = await TransactionsDAO.incomeVSexpense(username, start_date, end_date)
            
            res.json({ result })
        }
        catch(err) {
            res.status(400).json({error: err})
            return
        }
    }

    static async transactionChart(req, res) {
        try {
            let { username, type, start_date, end_date} = req.body

            let result = await TransactionsDAO.transactionChart(username, type, start_date, end_date)
            
            res.json({ result })
        } 
        catch(err) {
            res.status(400).json({error: err})
            return
        }
    }
}

module.exports = { TransactionsController }