import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import allRouter from './src/Router/router.js';
import morgan from 'morgan';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

const allowedOrigins = [
  'http://localhost:3000',
  'http://apalabajar.com',
  'http://www.apalabajar.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable credentials
}));

app.use('/api', allRouter);

app.get("/", (req, res) => {
  return res.status(200).send({ message: "Welcome to Apala Bazar API - Node", status: true });
});

export default app;
