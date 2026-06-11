

//barelySocial
//it's social, but barely social
import express from 'express'
import authRouter from './routes/authRouter.js'
import postRouter from './routes/postRouter.js'
import cors from 'cors'
import userRouter from './routes/userRouter.js'

import path from 'path';
import { fileURLToPath } from 'url'


const app = express() 
const PORT = process.env.PORT || 3000
let corsOption = {
    origin: ['http://localhost:5173',
        'https://barely-social.netlify.app'
    ],
     credentials: true
}
app.use(cors(corsOption))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json())
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use('/', authRouter);
app.use('/', postRouter);
app.use('/', userRouter)


app.listen(PORT, (error) => {
    if (error) {
        throw error
    }
    console.log(`Hello, we're on port ${PORT}`)
})