const mongoose = require('mongoose')
const expenses = require('../expenses-data/expenses.json')
const Schema = mongoose.Schema

const expenseSchema = new Schema({
    name: String,
    amount: Number,
    date: Date,
    group: String
})

const Expense = mongoose.model("Expense", expenseSchema)
// expenses.forEach(s =>{ 
//     s = new Expense(s)
//     s.save()
// })

module.exports = Expense
