const asyncHandler = require("express-async-handler");
const { getUserDetail } = require("./userController");
const { checkValidFormField } = require("../middleware/validateFormField");
const moment = require("moment");
const { STATUS_CODE } = require("../const/httpStatusCode");

const express = require('express');
const prisma = require('../prisma');

const router = express.Router();

// Adding the Exercises
const addExercise = asyncHandler(async (req, res) => {

    const exerciseObj = {
        ...req.body,
        userId: req.params._id,
        date: req.body.date || moment(),
    };
    const isValidForm = checkValidFormField(exerciseObj);
    if (Object.entries(isValidForm).length === 0) {
        try {
            const result = await prisma.user.findUnique({
                where: { id: parseInt(req.params._id) },
            });

            if (!result) {
                throw new Error();
            }
            let { id, description, duration, date } = await prisma.exercise.create({
                data: {
                    description: exerciseObj.description,
                    duration: parseInt(exerciseObj.duration),
                    date: new Date(exerciseObj.date),
                    userId: parseInt(exerciseObj.userId),
                }
            });

            res.json({
                _id: id,
                username: result.name,
                description,
                duration,
                date,
            });
        } catch (error) {
            throw new Error(`User with ID ${req.params._id} already exist `);
        }
    } else {
        res.status(STATUS_CODE.CLIENT_ERROR_RESPONSE_CODE).json(isValidForm);
    }
});

// getting exercises with filters
const getExercises = asyncHandler(async (req, res) => {
    const da = await getUserDetail(req.params._id);

    const { id, name } = da

    let query = { userId: id };


    let exercises = [];
    let count = 0;

    if (req.query) {
        const { from, to, limit } = req.query;

        if (from) {
            query.date = query.date || {};
            query.date.gte = new Date(from);
        }

        if (to) {
            const endDate = new Date(to);
            endDate.setHours(23, 59, 59, 999);
            query.date = query.date || {};
            query.date.lte = endDate;
        }
        try {
            count = await prisma.exercise.count({
                where: query
            });

            exercises = await prisma.exercise.findMany({
                where: query,
                orderBy: {
                    date: 'asc'
                },
                take: limit ? parseInt(limit) : 10
            });
        }
        catch (error) {
           throw error
        }
    }

    const response = {
        id,
        name,
        count,
        logs: exercises.map(({ userId, description, duration, date }) => ({
            _id: userId,
            description,
            duration,
            date
        })),
    };

    res.json(response);
});


module.exports = {
    addExercise,
    getExercises,
};
