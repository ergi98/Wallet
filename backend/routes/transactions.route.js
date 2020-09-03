const router = require('express').Router()

router.route('/').get((req, res) => {
    res.json("HEY1")
})

module.exports = router;