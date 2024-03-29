const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

router.get('/', async(req, res) => {
    const userList = await User.find().select('-passHash');

    if (!userList){
        res.status(500).json({success: false})
    }
    res.send(userList);
})

router.get('/:id', async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid user ID')
    }

    const user = await User.findById(req.params.id).select('-passHash');

    if (!user){
        res.status(500).json({message: 'The user with given ID was not found!'});
    }
    
    res.status(200).send(user);
})

router.post('/', async(req, res) => {
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        passHash: bcrypt.hashSync(req.body.password, 10),
        address: req.body.address,
        isAdmin: req.body.isAdmin,
    })
    user = await user.save();

    if (!user){
        return res.status(404).send('The user cannot be created!');
    }

    res.send(user);
})

router.post('/login', async(req, res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;

    if (!user){
        return res.status(400).send('Something went wrong!');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passHash)){
        const token = jwt.sign(
            {
                userId: user._id,
                isAdmin: user.isAdmin,
            },
            secret,
            {expiresIn: '1d'}
        )

        res.status(200).send({user: user.email, token: token});
    } else {
        res.status(400).send('Something went wrong!')
    }

})

router.post('/register', async (req,res)=>{
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        passHash: bcrypt.hashSync(req.body.password, 10),
        address: req.body.address,
        isAdmin: req.body.isAdmin,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then(user => {
        if (user){
            return res.status(200).json({success: true, message: 'The user is deleted!'})
        } else {
            return res.status(404).json({success: false, message: 'The user not found!'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

router.get('/get/count', async (req, res) =>{
    const userCount = await User.countDocuments({}, { hint: "_id_" })

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})

module.exports = router;