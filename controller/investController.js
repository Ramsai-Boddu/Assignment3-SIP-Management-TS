const { findUser, getUser, getHoldings, getNetWorth, addInvestor, logoutUser } = require("../models/userModel");
const { signJwt } = require("../utils/authManager");


const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await findUser(email)
    if (!user) {
        return res.status(404).json("Investor Not Found")
    }
    if (password != user.password) {
        return res.status(401).json({
            error: "Invalid Password"
        });
    }
    const token = signJwt({
        email : user.email,
        role : user.role
    })
    return res.status(200).json({
        message:"Login Success",
        token: token
    })
}

const logout = (req, res) => {
    const token = req.headers.authorization;
    const { email } = req.body;

    if (!email || !token) {
        return res.status(400).json({
            message: "Email and Token are required"
        });
    }

    const result = logoutUser(email, token);

    if (!result) {
        return res.status(400).json({
            message: "Logout Failed"
        });
    }

    return res.status(200).json({
        message: "Logout Successful"
    });
};

const createInvestor = async (req, res) => {
    try {
        const data = req.body;
        const result = await addInvestor(data);
        return res.status(201).json({
            message: "Investor Created",
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

const getInvestorDetails = async (req,res) => {
    const {id} = req.params
    const user = await getUser(id);
    if(!user){
        return res.status(404).json("Investor Not Found")
    }else{
        return res.status(200).json({
            message:"Investor Found",
            Data : user
        })
    }
}

const getInvestorHoldings = async(req,res) => {
    const {id} = req.params
    const holdings =  await getHoldings(id)
    if(!holdings){
        return res.status(404).json("No Holdings")
    }else{
        res.status(200).json({
            message:"Holdings Found",
            holdings: holdings
        })
    }
}

const getInvestorNetWorth = async(req,res) => {
    const {id} = req.params
    const netWorth = await getNetWorth(id)
    if(!netWorth){
        return res.status(404).json("No Net Worth")
    }else{
        return res.status(200).json({
            message:"Net Worth Calculated",
            NetWorth: netWorth
        })
    }
}

module.exports={login, createInvestor,logout,getInvestorDetails, getInvestorHoldings, getInvestorNetWorth}