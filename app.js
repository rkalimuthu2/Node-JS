const express = require('express');
const path = require('path');
const logger = require('morgan');
const userRoutes = require("./routes/userRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});
app.use("/api/users", userRoutes, exerciseRoutes);
app.use(errorHandler);

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
module.exports = app;



