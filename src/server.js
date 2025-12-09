import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';


const PORT = process.env.PORT || 3000;

const app = express();


const logger = pinoHttp({
  transport: {
    target: 'pino-pretty', 
    options: { colorize: true },
  },
  customProps: (req, res) => ({
    operation: 'http-request',
  }),
  level: 'info',
});
app.use(logger);


app.use(cors());
app.use(express.json());


app.get('/notes', (req, res) => {
  req.log.info('Handling GET /notes');
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const noteId = req.params.noteId;
  req.log.info(`Handling GET /notes/${noteId}`); 
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});


app.get('/test-error', (req, res, next) => {
  req.log.error('Simulating server error...'); 
  next(new Error('Simulated server error')); 
});



app.use((req, res, next) => {
  req.log.warn(`Route not found: ${req.method} ${req.originalUrl}`); 
  res.status(404).json({
    message: 'Route not found',
  });
});


app.use((err, req, res, next) => {
  req.log.error(err, 'Caught server error'); 

  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
});


app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}.`);
  console.log(`Test links: http://localhost:${PORT}/notes and http://localhost:${PORT}/test-error`);
});