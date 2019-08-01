const User = require('../models/index').User
const Drug = require('../models/index').Drug
const Transaction = require('../models/index').Transaction
const sendEmail = require('../helpers/sendEmail')

class UserController {
    static showAll(req, res) {
        User.findAll()
            .then(data => {
                // res.send(data)
                res.render('user', { data })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static register(req, res) {
        res.render('register')
    }

    static create(req, res) {
        User.create(req.body)
            .then(data => {
                res.redirect('/')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static delete(req, res) {
        User.destroy({
            where: { id: req.params.id }
        })
            .then(data => {
                res.redirect('/user')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static edit(req, res) {
        User.findByPk(req.params.id)
            .then(data => {
                // res.send(data)
                res.render('editUser', { data })
            })
            .catch(err => {
                res.send(err)
            })
    }
//test
    static update(req, res) {
        User.update(req.body, { where: { id: req.params.id } })
            .then(data => {
                res.redirect('/user')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static buyDrug(req, res) {
        Drug.findAll()
            .then(drugs => {
                User.findByPk(req.params.id)
                    .then(user => {
                        // res.send(user)
                        res.render('buydrug', {drugs, user})
                    })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static createTransaction(req, res) {
        // res.send(req.body)
        Drug.findByPk(req.body.DrugId)
            .then(data => {
                Transaction.create({
                UserId: req.params.id,
                DrugId: req.body.DrugId,
                TotalItems: req.body.TotalItems,
                TotalPayment: data.price * req.body.TotalItems
                })
            })
            .then(data2 => {
                res.redirect('/') 
            })
            .catch(err => {
                res.send(err)
            })
    }

    static invoice(req, res) {
        User.findByPk(req.params.id)
        .then(data => {
            Transaction.findAll({where:{UserId: data.id}, include: {model: Drug}})
            .then(transaction => {
                sendEmail(data.email)
                // res.send(transaction)
                res.render('invoice', {data, transaction})
            })
            .catch(err => {
                res.send(err)
            })
        })
    }
}

module.exports = UserController