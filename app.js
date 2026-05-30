import { configDotenv } from 'dotenv'
configDotenv()

//barelySocial
//it's socail but not that socail
import express from 'express'
import authRouter from './routes/authRouter.js'
import postRouter from './routes/postRouter.js'
import cors from 'cors'
import userRouter from './routes/userRouter.js'

const app = express() 
const PORT = process.env.PORT || 3000
let corsOption = {
    origin: ['']
}
app.use(cors(corsOption))
app.use(express.json())

app.get('/', (req, res) => res.send(':)'))
app.use('/', authRouter);
app.use('/', postRouter);
app.use('/', userRouter)


app.listen(PORT, (error) => {
    if (error) {
        throw error
    }
    console.log(`Hello, we're on port ${PORT}`)
})