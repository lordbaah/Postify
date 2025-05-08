import express from 'express';
import ENV from './config/env.js';
import connectDB from './database/mongodb.js';
import errorHandler from './middlewares/error.middleware.js';
// import { ratelimiter } from './middlewares/rateLimiter.middleware.js';
import cors from 'cors';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Apply the rate limiting rule to all requests
// app.use(ratelimiter);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
  res.send('blog api is running');
});

app.use(errorHandler);

connectDB();

app.listen(ENV.PORT, () => {
  console.log(`hello backend is running on ${ENV.PORT}`);
});
