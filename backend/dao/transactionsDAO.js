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
}

module.exports = TransactionsDAO;    
