const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');

const User = require('../models/user');

router.post('/register', (req, res) => {
    if (!validator.isEmail(req.body.email)) {
        return res.status(500).json({ message: 'Invalid Email' });
    }
    User.find({ email: req.body.email })
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({ message: "Email exists" });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                return res.status(201).json({
                                    message: 'User created',
                                    email: result.email
                                });
                            })
                            .catch(e => {
                                console.log(e);
                                return res.status(500).json({ error: e });
                            });
                    }
                })
            }
        })
        .catch(e => {
            console.log(e);
            return res.status(500).json({ error: e });
        });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
        .then(() => {
            return res.status(200).json({ message: 'User deleted' });
        })
        .catch(e => {
            console.log(e);
            return res.status(500).json({ error: e });
        });
});

module.exports.users = router;