import User from "../models/User.mjs";
import jsonwebtoken from 'jsonwebtoken'
import configs from "../config/config.mjs";
const jwt = jsonwebtoken;


export function allowOnlyVerifiedUsers(req, res, next){
    try {
        if(!req.session || !req.session.user) return res.redirect('/');

        User.findById(req.session.user._id).then((user)=>{
            if(user){
                next();
            }
            else{
                delete req.session.user;
                return res.redirect('/');
            }
        })

    } catch (error) {
        return res.redirect('/');
    }
}