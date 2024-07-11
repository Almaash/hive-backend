import { Request, Response } from 'express'
import { prismaClient } from '..';
import { PrismaClient, User } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets';
import { error } from 'console';
import { editProfileValidation, signupValidation } from '../request/signUpValidation';
import { v2 as cloudinary } from 'cloudinary';


type REQUSER = Request & {
    user: User
}

// Configuration
cloudinary.config({
    cloud_name: 'dnkfvkyre',
    api_key: '886149947269176',
    api_secret: 'GhD0VKpRcJrndPrJ4OuQ06zAjSQ'
});


export const signup = async (req: Request, res: Response) => {
    try {

        const { error } = signupValidation.validate(req.body)
        if (error) {
            throw error;
        }

        const { first_name, last_name, country, email, phone, password } = req.body;

        let user = await prismaClient.user.findFirst({ where: { email: email } })
        if (user) {
            throw Error("User Already Exist")
        }

        user = await prismaClient.user.create({
            data: {
                first_name,
                last_name,
                country,
                email,
                phone,
                password: hashSync(password, 10)
            }
        })
        res.json(user)

    } catch (err: any) {
        console.log(err)
        res.status(401).json({
            error: true,
            message: err?.message
        })
    }
}


export const getUser = async (req: Request, res: Response) => {

    try {
        const users = await prismaClient.user.findMany({
            orderBy: {
                id: 'asc',
            },
        });

        res.json(users)
    } catch (err) {

        res.json({
            error: true,
            message: "No data Found"
        })

    }

}


export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user: any = await prismaClient.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                userName: true,
                profileImg: true,
                summary: true,
                first_name: true,
                last_name: true,
                country: true,
                email: true,
                phone: true,
            }
        });

        if (user) {
            res.json(user)
        }

    } catch (error) {
        res.json({
            error: true,
            message: "No data Found"
        })
    }
}


export const updateUser = async (req: Request, res: Response) => {

    try {

        const { error } = editProfileValidation.validate(req.body)
        if (error) {
            throw error;
        }

        const { id } = req.params;
        const { first_name, last_name, country, email, phone, password } = req.body;

        const user = await prismaClient.user.findUnique({ where: { id: parseInt(id) } });

        if (!user) {
            res.status(404).json({
                error: true,
                message: "User not Found !"
            })
        }

        const updatedUser = await prismaClient.user.update({
            where: { id: parseInt(id) },
            data: {
                first_name,
                last_name: last_name && last_name,
                country: country && country,
                email: email && email,
                phone: phone && phone,
                password: password && hashSync(password, 10)
            }
        })

        res.status(200).json({ message: "Profile updated successfully", data: updatedUser })

    } catch (err: any) {
        console.log(err)
        res.status(401).json({
            error: true,
            message: err?.message
        })
    }

}

export const updateProfile = async (req: Request, res: Response) => {

    try {
        const { id } = req.params;
        const { userName, summary } = req.body;
        const profileImg = req.file;


        if (!profileImg) {
            throw new Error('No image')
        }

        // Upload an image
        const uploadResult = await cloudinary.uploader
            .upload(
                profileImg?.path, {
                public_id: profileImg?.filename,
            }
            )
            .catch((error) => {
                console.log(error);
            });


        const user = await prismaClient.user.findUnique({ where: { id: parseInt(id) } });

        if (!user) {
            res.status(404).json({
                error: true,
                message: "User not Found !"
            })
        }

        const updatedUser = await prismaClient.user.update({
            where: { id: parseInt(id) },
            data: {
                userName,
                summary,
                profileImg: uploadResult?.secure_url,

            }
        })

        res.json(updatedUser)

    } catch (err: any) {
        console.log(err)
        res.status(401).json({
            error: true,
            message: err?.message
        })
    }

}


export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        let user: any = await prismaClient.user.findFirst({ where: { email: email } })
        if (!user) {
            throw Error("Use Not Found")
        }

        if (!compareSync(password, user.password)) {
            throw Error("Password Does not matched !")
        }

        // delete user.password

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET)


        res.status(200).json({ user, token })

    } catch (err: any) {

        res.status(401).json({
            error: true,
            message: err?.message
        })

    }
}


export const profile = async (req: any, res: Response) => {

    res.json(req.user)
}