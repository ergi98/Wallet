let users
let sessions

const mongodb = require('mongodb')

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

  static async registerUser(userInfo) {
    try {
      for(let i = 0; i < userInfo.portfolios.length; i++)
        userInfo.portfolios[i].amount = mongodb.Decimal128.fromString(userInfo.portfolios[i].amount.toString())

      for(let i = 0; i < userInfo.categories.length; i++)
        userInfo.categories[i].amnt_spent = mongodb.Decimal128.fromString(userInfo.categories[i].amnt_spent.toString())

      for(let i = 0; i < userInfo.sources.length; i++)
        userInfo.sources[i].amount_earned = mongodb.Decimal128.fromString(userInfo.sources[i].amount_earned.toString())

      console.log(userInfo)
      
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

  static async getUserPassword(username) {
    let pipeline = [
      {
        $match: {
          username
        }
      },
      {
        $project: {
          _id: 0,
          password: 1
        }
      }
    ]

    return await users.aggregate(pipeline).toArray()
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

  static async getUserData(username) {
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
            username: 1,
            createdAt: 1,
            personal: 1,
          }
        }
      ]

      return await users.aggregate(pipeline).toArray()
    }
    catch (e) {
      console.error(`Error occurred while retrieving user data, ${e}`)
      return { error: e }
    }
  }

  static async getUserCategories(username) {
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
            categories: 1
          }
        }
      ]

      return await users.aggregate(pipeline).toArray()
    }
    catch (e) {
      console.error(`Error occurred while retrieving user categories, ${e}`)
      return { error: e }
    }
  }

  static async getUserSources(username) {
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
            sources: 1
          }
        }
      ]

      return await users.aggregate(pipeline).toArray()
    }
    catch (e) {
      console.error(`Error occurred while retrieving user sources, ${e}`)
      return { error: e }
    }
  }

  static async addPortfolio(username, portfolio) {
    try {

      portfolio.amount = mongodb.Decimal128.fromString(portfolio.amount.toString())

      return await users.updateOne({ username }, { $push: { portfolios: portfolio } }, { w: "majority" })
    }
    catch (e) {
      console.error(`Error occurred while adding user portfolio, ${e}`)
      return { error: e }
    }
  }

  static async changeFavourite(username, portfolio) {
    try {
      // If the portfolio being changed was the favourite just change its status
      if (!portfolio.favourite) {
        await users.updateOne(
          { username },
          { $set: { "portfolios.$[port].favourite": portfolio.favourite } },
          { arrayFilters: [{ "port.p_id": portfolio.p_id }] }, { w: "majority" }
        )
      }
      // Else remove the previous favourite wallet
      else {
        // Check if any other portfolio holds the favourite status
        let res = users.findOne({ username, "portfolios.favourite": true })

        // If no other portfolio was marked as favourite
        if (!res) {
          // Change the new portfolio status to true
          await users.updateOne(
            { username },
            { $set: { "portfolios.$[port].favourite": portfolio.favourite } },
            { arrayFilters: [{ "port.p_id": portfolio.p_id }] }, { w: "majority" }
          )
        }

        // Change that portfolios status to false
        await users.updateOne(
          { username },
          { $set: { "portfolios.$[port].favourite": false } },
          { arrayFilters: [{ "port.favourite": true }] }, { w: "majority" }
        )

        // Change the new portfolio status to true
        await users.updateOne(
          { username },
          { $set: { "portfolios.$[port].favourite": portfolio.favourite } },
          { arrayFilters: [{ "port.p_id": portfolio.p_id }] }, { w: "majority" }
        )
      }
    }
    catch (e) {
      console.error(`Error occurred while changing portfolio favourite status, ${e}`)
      return { error: e }
    }
  }

  static async deletePortfolio(username, delete_id, transfer_id, transfer_amnt) {
    try {

      // If no portfolio was specified to recieve the deleted amount
      if (transfer_amnt === "default") {
        await users.updateOne(
          { username }, 
          { $pull: { portfolios: { p_id: delete_id } } }, 
          { w: "majority" }
        )
      }
      else {

        transfer_amnt = mongodb.Decimal128.fromString(transfer_amnt.toString())
        // Update the amount in the new portfolio
        await users.updateOne(
          { username }, 
          { $inc: { "portfolios.$[port].amount": transfer_amnt, }},
          { arrayFilters: [{ "port.p_id": transfer_id }] },
          { w: "majority" }
        )
        // Delete the old portfolio
        await users.updateOne(
          { username }, 
          { $pull: { portfolios: { p_id: delete_id } } }, 
          { w: "majority" }
        )
      }
    }
    catch (e) {
      console.error(`Error occurred while deleting portfolio, ${e}`)
      return { error: e }
    }
  }

  static async newCategory(username, category) {
    try {

      category.amnt_spent = mongodb.Decimal128.fromString(category.amnt_spent)

      let res = await users.findOne({ username, "categories.cat_name": category.cat_name })

      if(res) {
        console.error(`Insert unsuccessful`)
        return { error: `Category already exists` }
      }
      else {
        await users.updateOne(
          { username }, 
          { $push: { categories: category } }, 
          { w: "majority" }
        )

        return { success: true }
      }
    }
    catch (e) {
      console.error(`Error occurred while adding a new expense category, ${e}`)
      return { error: e }
    }
  }

  static async newSource(username, source) {
    try {
      source.amount_earned = mongodb.Decimal128.fromString(source.amount_earned)

      let res = await users.findOne({ username, "sources.source_name": source.source_name })

      if(res) {
        console.error(`Insert unsuccessful`)
        return { error: `Source already exists` }
      }
      else {
        await users.updateOne(
          { username }, 
          { $push: { sources: source } }, 
          { w: "majority" }
        )

        return { success: true }
      }
    }
    catch (e) {
      console.error(`Error occurred while adding a new expense category, ${e}`)
      return { error: e }
    }
  }

  static async deleteCategory(username, category_id) {
    try {
      await users.updateOne(
        { username }, 
        { $pull: { categories: { cat_id: category_id } }},
        { w: "majority" }
      )
    }
    catch (e) {
      console.error(`Error occurred while deleting expense category, ${e}`)
      return { error: e }
    }
  }

  static async deleteSource(username, source_id) {
    try {
      await users.updateOne(
        { username }, 
        { $pull: { sources: { source_id: source_id } }},
        { w: "majority" }
      )
    }
    catch (e) {
      console.error(`Error occurred while deleting income source, ${e}`)
      return { error: e }
    }
  }

}

module.exports = UsersDAO;   