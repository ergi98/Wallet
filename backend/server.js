const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/users.route')
const transactionRouter = require('./routes/transactions.route')
const MongoClient = require('mongodb')
const UsersDAO = require('./dao/usersDAO')
const transactionsDAO = require('./dao/transactionsDAO')

const path = require('path')

require('dotenv').config()

const app = express();

app.use(cors())
app.use(express.json());

const port = process.env.PORT || 8000

// Connection to MongoDB
MongoClient.connect(
    process.env.MONGO_URI,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        wtimeout: 2500,
        poolSize: 50,
    },
)
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await transactionsDAO.injectDB(client)
        await UsersDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })

// Register API routes
app.use('/users', userRouter)
app.use('/transactions', transactionRouter)
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

// Serve our static assets if in production
if(process.env.NODE_ENV === "production") {
    app.use(express.static('../frontend/build'))

    app.get('*', (res, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'))
    })
}