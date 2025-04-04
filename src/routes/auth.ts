import {Router} from 'express'
import { getUser, getUserById, login, profile, signup, updateProfile, updateUser } from '../controllers/auth'
import { authMiddleware } from '../middlewares/auth'
import { upload } from '../../config/multer.config'
import { createPost, deletePost, getAllPost, getPostByUserId, updatePost } from '../controllers/posts'
import { conversationController, getConversationsByUserId } from '../controllers/conversation'
import { getMessage, getMessageByConvoId, messageController, user } from '../controllers/message'

const authRoutes = Router()

authRoutes.post('/signup',signup)
authRoutes.post('/login',login)
authRoutes.get('/getUsers',getUser)
authRoutes.get('/getUserbyid/:id',getUserById)
authRoutes.put('/updateUsers/:id',updateUser)
authRoutes.put('/updateProfile/:id',upload.single('profile_img'),updateProfile)
authRoutes.get('/profile',authMiddleware,profile)

authRoutes.post('/createPost/:id',upload.single('post_img'),createPost)
authRoutes.get('/getAllPost',getAllPost)
authRoutes.get('/getPostByUserId/:id',getPostByUserId)
authRoutes.delete('/deletePost/:id',deletePost)
authRoutes.put('/updatePost/:id',upload.single('post_img'),updatePost)

authRoutes.post('/newConversation',conversationController)
authRoutes.get('/getConversation/:userId',getConversationsByUserId)

authRoutes.post('/newMessages',messageController)
authRoutes.get('/getallMessages',getMessage)
authRoutes.get('/getallMessages/:id',getMessageByConvoId)
authRoutes.get('/user',user)


export default authRoutes