import express from 'express';
import { PORT } from '../../core/config/config';
import { generateAccessToken, nocache } from '../agora/app';

const bodyParser = require('body-parser')

const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.post('/requestVideoCall', nocache, generateAccessToken)

app.listen(PORT, () => {
    console.log(`Listening at ${port}`)
})