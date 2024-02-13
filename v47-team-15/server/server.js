const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/authRoute');
const currenciesRoute = require('./routes/currenciesRoute');
const globalRoute = require('./routes/globalRoute');
const profileRoute = require('./routes/profileRoute');
const favoritesRoutes = require('./routes/favoritesRoute');
const newsRoute = require('./routes/newsRoute');
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'https://merry-liger-e1e902.netlify.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));


mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log('Database connected! WIIIIIIII'))
  .catch((err) => console.log(err));

require("./passport/passport-config");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// JSON request parsing
app.use(express.json());

// CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );

// Routes
app.use("/auth", authRoutes);
app.use("/api/currencies", currenciesRoute);
app.use("/api/global", globalRoute);
app.use("/profile", profileRoute);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/news", newsRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
