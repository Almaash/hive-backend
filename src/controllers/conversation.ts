import { Request, Response } from 'express'
import { prismaClient } from '..';
import { PrismaClient, conversation, User } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt'
import { error } from 'console';
import { signupValidation } from '../request/signUpValidation';
import { v2 as cloudinary } from 'cloudinary';
import { array } from 'joi';
import { tuple } from 'yup';


type REQUSER = Request & {
    conversation: conversation,
    user: User
}

type omittedUser = Omit<User, 'password' | 'createdAt' | 'updatedAt'> 

type CONVMOD = conversation & {
    memberData?: omittedUser[]
}


export const conversationController = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverId } = req.body

        const newConversation = await prismaClient.conversation.create({
            data: {
                members: [senderId, receiverId],
                userId: Number(senderId)
            }
        })

        res.status(200).json(newConversation)
    } catch (err: any) {
        console.log(err)
        res.status(401).json({
            error: true,
            message: err?.message
        })
    }
}


export const getConversationsByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const conversations: CONVMOD[] = await prismaClient.conversation.findMany({
            where: {
                members: {
                    has: userId
                }
            },
        });

        await Promise.all(
            conversations.map(async (convo) => {
                let tempData: omittedUser[] = []
                const filteredMem = convo.members.filter(item => item != userId)
                await Promise.all(filteredMem.map(async (mem) => {
                    const memberData:omittedUser | null = await prismaClient.user.findFirst({
                        where: {
                            id: Number(mem)
                        },
                        orderBy: {
                            id: 'desc',
                        },
                        select: {
                            id:true,
                            first_name: true,
                            last_name: true,
                            country: true,
                            email: true,
                            phone: true,
                            userName: true,
                            summary: true,
                            profileImg: true,
                        }
                        
                    })
                    if (!memberData) {
                        throw new Error(`No member found with the id : ${mem}`)
                    }
                    tempData.push(memberData)
                }))
                convo.memberData = tempData
            })
        )

        res.status(200).json(conversations);
    } catch (err: any) {
        console.log(err);
        res.status(500).json({
            error: true,
            message: err?.message
        });
    }
};