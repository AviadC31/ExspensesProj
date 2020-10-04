const express = require('express')
const router = express.Router()
const moment = require('moment')
const Expense = require('./model/Expense')

const getDate = (isExist) => (isExist ? isExist.format('LLLL') : moment().format('LLLL'))

router.get('/expenses', function (req, res) {
    let { date1 } = req.query
    let { date2 } = req.query
    let d1 = Date.parse(date1)
    let d2 = Date.parse(date2)

    if (date1 && date2) {
        Expense.find({ date: { $gte: d1, $lte: d2 } })
            .sort({ date: 1 })
            .exec(function (err, expenses) { res.send(expenses) })
    }
    else if (date1 && !date2) {
        Expense.find({ date: { $gte: d1, $lte: Date.parse(moment().format('YYYY-MM-DD')) } })
            .sort({ date: 1 })
            .exec(function (err, expenses) { res.send(expenses) })
    }
    else {
        Expense.find({})
            .sort({ date: -1 })
            .exec(function (err, expenses) { res.send(expenses) })
    }
})

router.post('/new', function (req, res) {
    let expense = req.body
    let e1 = new Expense({
        name: expense.name,
        amount: expense.amount,
        group: expense.group,
        date: getDate(expense.date)
    })
    let promise = e1.save()            // Used already once
    promise.then(function (e1) {
      console.log(`you just spent ${e1.amount}$ for ${e1.name}`)
    })
    res.end()
})

router.put('/update', function (req, res) {
    let groupsToSwitch = req.body
    Expense.findOneAndUpdate({ group: groupsToSwitch.group1 },
                             { $set: { group: groupsToSwitch.group2 } },
                              function (err, expense) {
        res.send(`item name ${expense.name} has switched to group ${groupsToSwitch.group2}`)
    })
})

router.get('/expenses/:group', function (req, res) {
    let { group } = req.params
    let { total } = req.query
    if (total) {
        Expense.aggregate([
            { $match: { group: group } },
            { $group: { _id: 0, total: { $sum: "$amount" } } }
        ]).exec(function (err, expenses) { res.send(expenses) })
    } else { Expense.find({ group: group })
                    .exec(function (err, expenses) { res.send(expenses) }) }
})

module.exports = router


