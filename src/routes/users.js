const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require('../models/user');

const authenticatedUser = (email, password) => {
    return new Promise((resolve, reject) => {
        User.find({ email: email })
            .then(user => {
                if (user.length < 1) return resolve(false);
                bcrypt.compare(password, user[0].password, (err, result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            })
            .catch(e => {
                console.log(e);
                resolve(false);
            });
    });
};

router.post('/register', (req, res) => {
    if (!validator.isEmail(req.body.email)) {
        return res.status(500).json({ message: 'Invalid Email' });
    }
    User.find({ email: req.body.email })
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({ message: "Email already exist" });
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

router.post('/login', async (req, res) => {
    try {
        const isUserAuthenticated = await authenticatedUser(req.body.email, req.body.password);
        if (isUserAuthenticated) {
            User.find({ email: req.body.email })
                .then(user => {
                    if (user.length < 1) {
                        return res.status(401).json({ message: 'Auth failed' });
                    }
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: 60 * 60
                        }
                    );
                    return res.status(200).json({
                        message: 'User successfully logged in',
                        token: token
                    });
                })
                .catch(e => {
                    console.log(e);
                    return res.status(500).json({ error: e });
                });
        } else {
            return res.status(401).json({ message: 'Invalid Login. Check email and password' });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
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
