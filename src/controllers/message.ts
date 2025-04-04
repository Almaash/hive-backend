import { Request, Response } from 'express'
import { prismaClient } from '..';
import { PrismaClient, conversation, User, messages } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt'
import { error } from 'console';
import { signupValidation } from '../request/signUpValidation';
import { v2 as cloudinary } from 'cloudinary';
import { array } from 'joi';
import { tuple } from 'yup';


type REQUSER = Request & {
    conversation: conversation,
    user: User,
    messages: messages
}

type omittedUser = Omit<User, 'password' | 'createdAt' | 'updatedAt'>

type CONVMOD = conversation & {
    memberData?: omittedUser[]
}


export const messageController = async (req: Request, res: Response) => {

    let convo_id: number

    try {

        const { conversation_id, sender_id, message, receiverId } = req.body

        convo_id = Number(conversation_id)

        if (!sender_id || !message) {
            res.status(400).json("Please fill all the required Fields")
        }

        if (!conversation_id) {

            const newConversation = await prismaClient.conversation.create({
                data: {
                    members: [sender_id, receiverId],
                    userId: Number(sender_id)
                }
            })
            convo_id = newConversation?.id
        }

        let messages = await prismaClient.messages.create({
            data: {
                conversation_id: convo_id,
                sender_id: Number(sender_id),
                message
            }
        })
        res.json(messages)

    } catch (err) {
        console.log(err)
        res.status(401).json({
            error: true,
            message: 'no messages found'
        })
    }

}


export const getMessage = async (req: Request, res: Response) => {

    try {
        const messages = await prismaClient.messages.findMany({
            orderBy: {
                id: 'asc',
            },
        });

        res.json(messages)
    } catch (err) {

        res.json({
            error: true,
            message: "No data Found"
        })

    }

}

export const getMessageByConvoId = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        if (!id) {
            res.status(200).json([])
        }
        const messages = await prismaClient.messages.findMany({
            where: { conversation_id: Number(id) },
            include: {
                sender: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email: true,
                        userName: true,
                        profileImg: true,
                    }
                }
            }
        });

        res.json(messages)
    } catch (err) {

        res.json({
            error: true,
            message: "No data Found"
        })

    }

}

export const user = async (req: Request, res: Response) => {

    try {
        const users = await prismaClient.user.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true
            },
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


// get message by conversation id
