const asyncHandler = require("express-async-handler");
const { STATUS_CODE } = require("../const/httpStatusCode");
const {
    SUCCESSFUL_RESPONSE_CODE,
    SUCCESSFULLY_CREATED_RESPONSE_CODE,
    CLIENT_ERROR_RESPONSE_CODE,
} = STATUS_CODE;



const express = require('express');
const prisma = require('../prisma');

const router = express.Router();

//Add the User
const addUser = asyncHandler(async (req, res) => {

    const { username } = req.body;
    try{
        const result = await prisma.user.create({ data:{
            name:username
        } ,});
            res.status(SUCCESSFULLY_CREATED_RESPONSE_CODE).json(result);
    }catch{
        console.log(isValidUser);
        res.status(CLIENT_ERROR_RESPONSE_CODE);
    }
});

//Returns All the User details
const getUsersDetail = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({});
    res.status(SUCCESSFUL_RESPONSE_CODE).json(users);
});

// Return single User
const getUserDetail = asyncHandler(async (_id) => {
    const result = await prisma.user.findUnique({
        where: { id: parseInt(_id) },
      });
    return result;
});

// // Update the User records
// const updateUserDetails = asyncHandler(async (req, res) => {
//     const user = await prisma.user.findUnique({
//         where: { id: parseInt(req.params._id) },
//       });
//     if (!user) {
//         req.status(STATUS_CODE.CLIENT_ERROR_RESPONSE_CODE);
//         throw new Error("User Not Found");
//     }
//     const updateUser = await prisma.user.findByIdAndUppdate(req.params.id, req.body, {
//         new: true,
//     });
//     res.json(updateUser);
// });

// // Delete the User records
// const deleteUserDetails = asyncHandler(async (req, res) => {
//     const user = await prisma.user.findById(req.params._id);
//     if (!user) {
//         req.status(STATUS_CODE.CLIENT_ERROR_RESPONSE_CODE);
//         throw new Error("User Not Found");
//     }
//     const deletedUser = await prisma.user.remove(req.params._id);
//     res.json(deletedUser);
// });

module.exports = {
    getUserDetail,
    getUsersDetail,
    addUser,
    // updateUserDetails,
    // deleteUserDetails,
};
