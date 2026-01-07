import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import notesRoutes from './routes/notesRoutes.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { errors as celebrateErrors } from 'celebrate';
import { authRouter } from './routes/authRoutes.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(notesRoutes);

app.use(notFoundHandler);

app.use(celebrateErrors());

app.use(errorHandler);

const startServer = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT}.`);
  });
};

startServer();
