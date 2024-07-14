
const express = require('express');
const prisma = require('../prisma');

const router = express.Router();


const validateUserName = async (username) => {
  const res = username ? "" : { message: "Username is Required " };
  if (!res) {
    return checkUserExistOrNot(username);
  }
  return res;
};

const checkUserExistOrNot = async (username) => {
  const isUserExist = await prisma.user.findUnique({
    where: { name: username },
  });
  return isUserExist ? { message: "Username is already Exist" } : "";
};

module.exports = { validateUserName, checkUserExistOrNot };
