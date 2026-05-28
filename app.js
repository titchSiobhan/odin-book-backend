import { configDotenv } from 'dotenv'
configDotenv()

//barelySocial
//it's socail but not that socail
import express from 'express'
import authRouter from './routes/authRouter.js'
import cors from 'cors'

const app = express() 
const PORT = process.env.PORT || 3000
let corsOption = {
    origin: ['']
}
app.use(cors(corsOption))
app.use(express.json())

app.get('/', (req, res) => res.send(':)'))
app.use('/', authRouter)

app.listen(PORT, (error) => {
    if (error) {
        throw error
    }
    console.log(`Hello, we're on port ${PORT}`)
})