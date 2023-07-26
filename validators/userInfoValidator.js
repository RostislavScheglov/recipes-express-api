import { body } from 'express-validator'
//rename file
export const registrValidation = [
  body('userEmail', 'Bad email format').isEmail(),
  body('userName', 'Username length should be minimum 2 symbols').isLength({
    min: 2,
  }),
  body('userPassword', 'Password length should be minimum 4 symbols').isLength({
    min: 4,
  }),
]
export const updateUserInfoValidation = [
  body('userEmail', 'Bad email format').isEmail(),
  body('userName', 'Username length should be minimum 2 symbols').isLength({
    min: 2,
  }),
]
export const loginValidation = [
  body('userEmail', 'Bad email format').isEmail(),
  body('userPassword', 'Password length should be minimum 4 symbols').isLength({
    min: 4,
  }),
]
export const forgotPasswordValidation = [
  body('userEmail', 'Bad email format').isEmail(),
]
export const resetPasswordValidation = [
  body('userPassword', 'Password length should be minimum 4 symbols').isLength({
    min: 4,
  }),
]
