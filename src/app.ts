import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(bodyParser.json());

mongoose
  .connect('mongodb://localhost:2717/test')
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
