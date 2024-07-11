import express, { Express, Request, Response } from 'express'
import { PORT } from './secrets';
import rootRoutes from './routes';
import authRoutes from './routes/auth';
import { PrismaClient } from '@prisma/client';
const cors = require('cors');

const app: Express = express()

app.use(cors());
app.use(express.json())
app.use('/api', rootRoutes)

export const prismaClient = new PrismaClient()

app.listen(PORT, () => {
    console.log("Server is Running")
});