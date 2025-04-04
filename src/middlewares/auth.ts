import { Request, Response,NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'
import { string } from 'joi'
import { PrismaClient,User } from '@prisma/client'

const Prisma = new PrismaClient()

type REQUSER = Request &{
    user:User
}

export const authMiddleware = async (req: any, res: Response, next:NextFunction) => {

    const tempToken = req.headers.authorization as string

    const token = tempToken.split(" ")[1]

    if (!token) {
        res.status(401).json({
            error: true,
            message: "Unauthorized"
        })
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as any

        const user = await Prisma.user.findFirst({ where: { id: payload.userId } })
        if (!user) {
            res.status(401).json({
                error: true,
                message: "Unauthorized"
            })
        }
        req.user = user as User
        next()
        
    } catch (error) {
        res.status(401).json({
            error: true,
            message: "Unauthorized"
        })
    }



}