let users
let sessions

class UsersDAO {

  ObjectID = require('mongodb').ObjectID

  static async injectDB(conn) {
    if (users && sessions) {
      return
    }
    try {
      users = await conn.db(process.env.MONOG_NS).collection("users")
      sessions = await conn.db(process.env.MONOG_NS).collection("sessions")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addUser(userInfo) {
    try {
      await users.insertOne(userInfo, { w: "majority" })
      return { success: true }
    } catch (e) {
      if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
        return { error: "A user with the given email already exists." }
      }
      console.error(`Error occurred while adding new user, ${e}.`)
      return { error: e }
    }
  }

  static async getUser(username) {
    return await users.findOne({ username })
  }

  static async loginUser(username, jwt) {
    try {
      await sessions.updateOne(
        { username },
        { $set: { jwt } },
        { upsert: true }
      )
      return { success: true }
    }
    catch (e) {
      console.log(`Error occurred while logging in user, ${e}`)
      return { error: e }
    }
  }

  static async getUserSession(username) {
    try {
      return sessions.findOne({ username })
    } catch (e) {
      console.error(`Error occurred while retrieving user session, ${e}`)
      return { error: e }
    }
  }

  static async logoutUser(username) {
    try {
      await sessions.deleteOne({ username })
      return { success: true }
    }
    catch (e) {
      console.log(`Error occurred while logging out user, ${e}`)
      return { error: e }
    }
  }

  static async updatePassword(username, password) {
    try {
      await users.updateOne(
        { username },
        { $set: { password } }
      )
    }
    catch (e) {
      console.log(`Error occured while updating password, ${e}`)
      return { error: e }
    }

  }

  static async deleteUser(username) {
    try {
      await users.deleteOne({ username })
      await sessions.deleteOne({ username })
      if (!(await this.getUser(username)) && !(await this.getUserSession(username))) {
        return { success: true }
      } else {
        console.error(`Deletion unsuccessful`)
        return { error: `Deletion unsuccessful` }
      }
    } catch (e) {
      console.error(`Error occurred while deleting user, ${e}`)
      return { error: e }
    }
  }

  static async populateTransactionForm(username, type) {
    try {
      let pipeline = [
        {
          $match: {
            username: username
          }
        },
        {
          $project: {
            _id: 0,
            portfolios: 1,
            categories: 1,
            sources: 1
          }
        }
      ]

      let res = await users.aggregate(pipeline)

      return await res.toArray()
    }
    catch (e) {
      console.error(`Error occurred while popoulating transaction form, ${e}`)
      return { error: e }
    }
  }

  static async getAvailableAmount(username) {
    try {
      let pipeline = [
        {
          $match: {
            username
          }
        },
        {
          $project: {
            "amount": {
              $reduce: {
                input: "$portfolios",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.amount"] }
              }
            }
          }
        }
      ]

      let res = await users.aggregate(pipeline)

      return await res.toArray()
    }
    catch (e) {
      console.error(`Error occurred while popoulating transaction form, ${e}`)
      return { error: e }
    }
  }

  static async getPortolioAmount(username, portfolio) {
    try {
      let pipeline = [
        {
          $match: {
            username
          }
        },
        {
          $project: {
            _id: 0,
            portfolio: {
              $filter: {
                input: '$portfolios',
                as: 'portfolios',
                cond: { $eq: ['$$portfolios.p_id', portfolio] }
              }
            },
          }
        }
      ]
      return await users.aggregate(pipeline).toArray();
    }
    catch (e) {
      console.error(`Error occurred while retrieving portfolio amount, ${e}`)
      return { error: e }
    }
  }

  static async getPortfolios(username) {
    try {
      let pipeline = [
        {
          $match: {
            username
          }
        },
        {
          $project: {
            _id: 0,
            portfolios: 1
          }
        }
      ]

      return await users.aggregate(pipeline).toArray()
    }
    catch (e) {
      console.error(`Error occurred while retrieving portfolios, ${e}`)
      return { error: e }
    }
  }
}

module.exports = UsersDAO;   