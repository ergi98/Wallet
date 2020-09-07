let transactions

class TransactionsDAO {
  static async injectDB(conn) {
    if (transactions) {
      return
    }
    try {
      transactions = await conn.db(process.env.MONOG_NS).collection("transactions")
    } catch (e) {
      console.error(`Unable to establish collection handles in transactionsDAO: ${e}`)
    }
  }

  // Gets the daily spendings or earnings of the user
  static async getSpendings(date) {
    try {
      let pipeline = [
        {
          $match: {
            date: date
          }
        },
        {
          $project: {
            spendings: 1
          }
        }
      ]

      const res = await transactions.aggregate(pipeline, {
        level: "majority"
      })
      
      return await res.toArray()
    }
    catch (e) {
      console.log(`Error occurred while getting user spendings, ${e}`)
      return { error: e }
    }
  }

  // Gets the transactions of a user in a given date
  static async getTransactions(date) {
    let pipeline = [
      {
        $match: {
          date: date
        }
      },
      {
        $project: {
          transactions: 1
        }
      }
    ]
    try {
      const res = await transactions.aggregate(pipeline, {
        level: "majority"
      })

      return res.toArray()
    }
    catch(e) {
      console.log(`Error occurred while getting user transactions, ${e}`)
      return { error: e }
    }
  }
}

module.exports = TransactionsDAO;    
