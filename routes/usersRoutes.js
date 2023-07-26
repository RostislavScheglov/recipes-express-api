import express from 'express'
import {
  forgotPasswordValidation,
  loginValidation,
  registrValidation,
  resetPasswordValidation,
  updateUserInfoValidation,
} from '../validators/userInfoValidator.js'
import {
  deleteImg,
  forgotPassword,
  getMe,
  login,
  registration,
  resetPassword,
  updateUserInfo,
  uploadUrl,
} from '../controllers/userControllers.js'
import {
  checkSession,
  uniqueEmail,
  uniqueName,
} from '../middleware/checkers.js'

const userRouter = express.Router()

userRouter.post('/forgotPassword', forgotPasswordValidation, forgotPassword)

userRouter.post(
  '/resetPassword/:userId/:token',
  resetPasswordValidation,
  resetPassword
)

userRouter.post('/upload', uploadUrl)
userRouter.patch(
  '/me/edit',
  checkSession,
  updateUserInfoValidation,
  uniqueName,
  uniqueEmail,
  updateUserInfo
)
userRouter.post('/registration', registrValidation, registration)
userRouter.delete('/img', checkSession, deleteImg)
userRouter.post('/login', loginValidation, login)
userRouter.get('/me', checkSession, getMe)

export default userRouter
