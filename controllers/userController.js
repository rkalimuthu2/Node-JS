const asyncHandler = require("express-async-handler");
const { STATUS_CODE } = require("../const/httpStatusCode");
const {
    SUCCESSFUL_RESPONSE_CODE,
    SUCCESSFULLY_CREATED_RESPONSE_CODE,
    CLIENT_ERROR_RESPONSE_CODE,
} = STATUS_CODE;

const express = require('express');
const prisma = require('../prisma');
const { validateUserName } = require("../middleware/validateUser");

const router = express.Router();

//Add the User
const addUser = asyncHandler(async (req, res) => {
    const { username } = req.body;
    const isValidUser = await validateUserName(username);
    if (!isValidUser) {
        try {
            const result = await prisma.user.create({
                data: {
                    name: username
                },
            });
            res.status(SUCCESSFULLY_CREATED_RESPONSE_CODE).json(result);
        } catch (error) {
            res.status(CLIENT_ERROR_RESPONSE_CODE).json(error);
        }
    } else {
        res.status(CLIENT_ERROR_RESPONSE_CODE).json(isValidUser);
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


module.exports = {
    getUserDetail,
    getUsersDetail,
    addUser,
};
