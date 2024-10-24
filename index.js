import express from "express";
import dotenv from 'dotenv'
import StudentRoutes from './routes/students.js'

dotenv.config()
const app = express();

app.use('/api/students', StudentRoutes);

const port = process.env.PORT || 3030

app.listen(port, () => {
    console.log('Server is running on port: ', port)
})


