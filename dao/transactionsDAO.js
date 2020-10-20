let transactions
let connection

const mongodb = require('mongodb')

class TransactionsDAO {
  static async injectDB(conn) {
    if (transactions) {
      return
    }
    try {
      connection = conn
      transactions = await conn.db(process.env.MONOG_NS).collection("transactions")
    } catch (e) {
      console.error(`Unable to establish collection handles in transactionsDAO: ${e}`)
    }
  }

  // Gets the daily spendings or earnings of the user
  static async getDayRecap(username, date) {
    try {
      let pipeline = [
        {
          $match: {
            username: username,
            date: date
          }
        },
        {
          $project: {
            spendings: 1,
            earnings: 1
          }
        }
      ]

      const res = await transactions.aggregate(pipeline, {
        level: "majority"
      })

      return await res.toArray()
    }
    catch (e) {
      return { error: e }
    }
  }

  // Gets the transactions of a user in a given date
  static async getTransactions(username, date, portfolio) {

    let pipeline
    
    portfolio === undefined?
      pipeline = [
        { $match: { username: username, date: date } },
        { $project: { _id: 0, transactions: 1 } }
      ]
      :
      pipeline = [
        { $match: { username: username, date: date } },
        { $project: { _id: 0, transactions: { $filter: { input: "$transactions", as: "transaction", cond: { "$eq" : [ "$$transaction.portfolio", portfolio ] } } } } } 
      ]

    try {
      const res = await transactions.aggregate(pipeline, {
        level: "majority"
      })

      return res.toArray()
    }
    catch (e) {
      return { error: e }
    }
  }

  static async newTransaction(username, date, transaction) {

    const session = connection.startSession()

    const transactionOptions = {
      readPreference: "primary",
      readConcern: { level: "majority" },
      writeConcern: { w: "majority" }
    }

    if (transaction.trans_type === "expense")
      transaction.amount = transaction.amount * -1

    transaction.amount = mongodb.Decimal128.fromString(transaction.amount.toString())

    try {
      await session.withTransaction(async () => {

        const users = await connection.db(process.env.MONOG_NS).collection("users")

        // Find if the document with the specified date exists (transactions)
        let find_res = await transactions.findOne({ username, date }, { session })

        // Exists -> Push the transaction in the transactions array (transactions)
        if (find_res) {
          if (transaction.trans_type === "expense") {
            // Update the spendings for that day (transactions)
            await transactions.updateOne({ username, date }, { $push: { transactions: transaction }, $inc: { "spendings": transaction.amount } }, { session })
          }
          else {
            // Update the earnings for that day (transactions)
            await transactions.updateOne({ username, date }, { $push: { transactions: transaction }, $inc: { "earnings": transaction.amount } }, { session })
          }
        }
        /**
         *  Does not exist -> 
         *  Create a new document with the supplied date and user
         *  Add the transaction in the transactions array (transactions)
         *  Update the spendings / earnings for that day (transactions)
         * */
        else {
          if (transaction.trans_type === "expense") {
            await transactions.insertOne({ username, date, spendings: transaction.amount, earnings: mongodb.Decimal128.fromString("0"), transactions: [transaction] }, { session })
          }
          else {
            await transactions.insertOne({ username, date, spendings: mongodb.Decimal128.fromString("0"), earnings: transaction.amount, transactions: [transaction] }, { session })
          }
        }

        // Update the amount of the selected portfolio (users)
        await users.updateOne({ username }, { $inc: { "portfolios.$[port].amount": transaction.amount } }, { arrayFilters: [{ "port.p_id": transaction.portfolio }] }, { session })

        // Update the amount on the specified category / income_source (users)
        if (transaction.trans_type === "expense") {
          await users.updateOne({ username }, { $inc: { "categories.$[cat].count": 1, "categories.$[cat].amnt_spent": transaction.amount }, $set: { "categories.$[cat].last_spent": date } }, { arrayFilters: [{ "cat.cat_id": transaction.type }] }, { session })
        }
        else {
          await users.updateOne({ username }, { $inc: { "sources.$[src].count": 1, "sources.$[src].amount_earned": transaction.amount }, $set: { "sources.$[src].last_spent": date } }, { arrayFilters: [{ "src.source_id": transaction.source }] }, { session })
        }

      }, transactionOptions)
    }
    catch (e) {
      return { error: e }
    }
    finally {
      await session.endSession()
      return { success: true }
    }
  }

  static async deleteTransaction(username, date, transaction) {
    const session = connection.startSession()

    const transactionOptions = {
      readPreference: "primary",
      readConcern: { level: "majority" },
      writeConcern: { w: "majority" }
    }

    transaction.amount = transaction.amount * -1
    transaction.amount = mongodb.Decimal128.fromString(transaction.amount.toString())

    try {
      await session.withTransaction(async () => {

        const users = await connection.db(process.env.MONOG_NS).collection("users")

        // Based on the transaction type either decrease spendings or earnings
        if (transaction.trans_type === "expense")
          await transactions.updateOne({ username, date }, { $pull: { transactions: { trans_id: transaction.trans_id } }, $inc: { "spendings": transaction.amount }},{ session })
        else
          await transactions.updateOne({ username, date }, { $pull: { transactions: { trans_id: transaction.trans_id } }, $inc: { "earnings": transaction.amount }},{ session })

        // Update the amount of the selected portfolio (users)
        await users.updateOne({ username }, { $inc: { "portfolios.$[port].amount": transaction.amount } }, { arrayFilters: [{ "port.p_id": transaction.portfolio }] }, { session })

        // Update the amount on the specified category / income_source (users)
        if (transaction.trans_type === "expense")
          await users.updateOne({ username }, {  $inc: { "categories.$[cat].count": -1, "categories.$[cat].amnt_spent": transaction.amount } }, { arrayFilters: [{ "cat.cat_id": transaction.type }] }, { session })
        else
          await users.updateOne({ username }, { $inc: { "sources.$[src].count": -1, "sources.$[src].amount_earned": transaction.amount } }, { arrayFilters: [{ "src.source_id": transaction.source }] }, { session })

      }, transactionOptions)
    }
    catch (e) {
      return { error: e }
    }
    finally {
      await session.endSession()
      return { success: true }
    }
  }

  static async incomeVSexpense(username, start_date, end_date) {
    try {
      let pipeline = [
        {
          $match: {
            username, 
            date: {
              $gte: start_date, 
              $lte: end_date
            }
          }
        }, 
        {
          $group: {
            _id: null, 
            spend_amnt: { $sum: '$spendings' }, 
            earn_amnt: { $sum: '$earnings' }
          }
        }
      ]

      const res = await transactions.aggregate(pipeline, {
        level: "majority"
      })

      return res.toArray()
    }
    catch (e) {
      return { error: e }
    }
  }

  static async transactionChart(username, type, start_date, end_date) {
    try {
      let pipeline
      
      if(type === "earnings")
        pipeline = [{ $match: { username, date: { $gte: start_date, $lte: end_date } } }, { $project: { _id: 0, date: 1, earnings: 1 } }, { $sort: { date: 1} }]
      else if(type==="spendings")
        pipeline = [{ $match: { username, date: { $gte: start_date, $lte: end_date } } }, { $project: { _id: 0, date: 1, spendings: 1 } }, { $sort: { date: 1} }]
      else 
        pipeline = [{ $match: { username, date: { $gte: start_date, $lte: end_date } } }, { $project: { _id: 0, date: 1, earnings: 1, spendings: 1 } }, { $sort: { date: 1} }]
      
      const res = await transactions.aggregate(pipeline, {
        level: "majority"
      })

      return res.toArray()
    }
    catch (e) {
      return { error: e }
    }
  }
}

module.exports = TransactionsDAO;    
