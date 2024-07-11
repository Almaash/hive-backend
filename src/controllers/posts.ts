import { Request, Response } from 'express'
import { prismaClient } from '..';
import { PrismaClient, post_table } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt'
import { error } from 'console';
import { signupValidation } from '../request/signUpValidation';
import { v2 as cloudinary } from 'cloudinary';


type REQUSER = Request & {
    post_table: post_table
}

// Configuration
cloudinary.config({
    cloud_name: 'dnkfvkyre',
    api_key: '886149947269176',
    api_secret: 'GhD0VKpRcJrndPrJ4OuQ06zAjSQ'
});


export const createPost = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const { post_details } = req.body;
        const post_image = req.file;

        if (!post_image) {
            throw new Error('No image')
        }

        // Upload an image
        const uploadResult = await cloudinary.uploader
            .upload(
                post_image?.path, {
                public_id: post_image?.filename,
            }
            )
            .catch((error) => {
                console.log(error);
            });

        const user = await prismaClient.user.findUnique({ where: { id: parseInt(id) } });

        if (!user) {
            res.status(404).json({
                error: true,
                message: "User not Found!"
            })
        }

        let postData = await prismaClient.post_table.create({
            data: {
                post_details,
                post_image: uploadResult?.secure_url,
                userId: user?.id as number
            }
        })
        res.json(postData)

    } catch (err: any) {
        console.log(err)
        res.status(401).json({
            error: true,
            message: err?.message
        })
    }
}


export const getAllPost = async (req: Request, res: Response) => {

    try {
        const posts = await prismaClient.post_table.findMany({
            include: {
                user: true,
            },
            orderBy: {
                id: 'desc',
            },

        });

        res.json(posts)
    } catch (err) {

        res.json({
            error: true,
            message: "No data Found"
        })

    }

}

export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const deletePost = await prismaClient.post_table.delete({
            where: { id: parseInt(id) },
        },
        )
        res.json({ message: "Post deleted Successfully", deletePost })
    } catch (err) {

        res.json({
            error: true,
            message: "No data Found"
        })

    }
}


export const getPostByUserId = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const posts: any = await prismaClient.post_table.findMany({
            where: { userId: parseInt(id) },
            select: {
                id: true,
                post_details: true,
                post_image: true,
                userId: true
            },
            orderBy: {
                id: 'desc',
            },
        });

        if (posts) {
            res.json(posts)
        }

    } catch (error) {
        res.json({
            error: true,
            message: "No data Found"
        })
    }
}


export const updatePost = async (req: Request, res: Response) => {

    try {
        const { id } = req.params;
        const { post_details } = req.body;
        const post_image = req.file;


        if (!post_image) {
            throw new Error('No image')
        }

        // Upload an image
        const uploadResult = await cloudinary.uploader
            .upload(
                post_image?.path, {
                public_id: post_image?.filename,
            }
            )
            .catch((error) => {
                console.log(error);
            });


        const posts = await prismaClient.post_table.findUnique({ where: { id: parseInt(id) } });

        if (!posts) {
            res.status(404).json({
                error: true,
                message: "User not Found !"
            })
        }

        let updatePostData = await prismaClient.post_table.update({
            where: { id: parseInt(id) },
            data: {
                post_details,
                post_image: uploadResult?.secure_url,
                userId: posts?.id as number
            }
        })
        res.json(updatePostData)

    } catch (err: any) {
        console.log(err)
        res.status(401).json({
            error: true,
            message: err?.message
        })
    }

}


