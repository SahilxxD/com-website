const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../models/User');

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});

    }
    
    let {name, email, password} = req.body;

    // Lodash to sanitize input
    name = _.trim(name);
    email = _.toLower(_.trim(email));

    try{
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: "Email already exist!"})
        }

        user = new User({name, email, password});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.status(201).json({token})
    } catch(error) {
        res.status(500).json({message:'Server Error'})
    }
};

exports.login = async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()});
    }

    let {email, password} = req.body;

    // 🛠️ Sanitize email before querying database
    email = _.toLower(_.trim(email));

    try {
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message: 'Invalid Credentials'});
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch){
            return res.status(400).json({message:'Invalid Credentials'})
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn: '1h'
        });
        res.status(200).json({token});
    }catch (error){
        res.status(500).json({ message: 'Server Error' })
    }
}