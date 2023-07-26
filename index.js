import express from 'express'
import { serverConfig } from './config/config.js'
import mongoose from 'mongoose'
import cors from 'cors'
import recipesRouter from './routes/recipesRoutes.js'
import userRouter from './routes/usersRoutes.js'

const app = express()
const port = serverConfig.serverPort
const dbUrl = serverConfig.dbURL

app.use(cors())
app.use(express.json({ limit: '5mb', type: 'application/json' }))
app.use('/uploads', express.static('uploads'))
app.use('/recipes', recipesRouter)
app.use('/auth', userRouter)

const start = async () => {
  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log('Db connected')
    })
    .catch((err) => {
      console.log('Db error: ' + err)
    })
  app.listen(port, (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('Server running on port ' + port)
  })
}

start()
