import {Router, Request, Response} from "express";
import {CallbackError, Error} from "mongoose";
import {User} from "../models/user.model"
import UserInterface from "../interface/UserInterface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as fs from "fs";

export const auth = Router();

const RSA_KEY_PRIVATE = fs.readFileSync('./key/key');

// Router() => create new User
auth.post('/signup', (req:Request, res:Response) => {
    const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    });
    newUser.save((err:CallbackError)=> {
        if(err) {res.status(500).json('error_signup')}
        res.status(200).json('user_create')
    });
});

// Router() => create token
auth.post('/signin', (req:Request, res:Response) => {
    console.log(RSA_KEY_PRIVATE);
    User.findOne({'email': req.body.email}).exec((err: CallbackError, user:UserInterface ) => {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({

            }, RSA_KEY_PRIVATE, {
                algorithm: "RS256",
                subject: user._id.toString()
            });
            res.status(200).json(token);
        } else {
            res.status(401).json('signin_fail')
        }
    });
});
