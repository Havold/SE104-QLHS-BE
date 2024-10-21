import express from "express";
import dotenv from 'dotenv'

dotenv.config()
const app = express();

app.get('/', (req, res) => {
    res.json('Hello World');
})

const port = process.env.PORT || 3030

app.listen(port, () => {
    console.log('Server is running on port: ', port)
})


