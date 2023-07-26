import userSchema from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import userModel from '../models/User.js'
import fs from 'fs'
import { domain, mailConfig, secret, transporter } from '../config/config.js'

export const registration = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors)
    }
    const userExists = await userModel.findOne({
      userEmail: req.body.userEmail,
    })
    if (userExists) {
      return res.status(500).json([
        {
          msg: 'User with this email already exists',
        },
      ])
    }
    const passwordCrypt = await bcrypt.hash(
      req.body.userPassword,
      await bcrypt.genSalt(10)
    )
    const user = new userSchema({
      userEmail: req.body.userEmail,
      userName: req.body.userName,
      userPassword: passwordCrypt,
    })
    await user.save()

    const token = jwt.sign(
      {
        _id: user._id,
      },
      secret,
      {
        expiresIn: '20d',
      }
    )
    const { userPassword, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json([
      {
        msg: 'Registration faild',
      },
    ])
  }
}
export const updateUserInfo = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors)
    }
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.userId },
      {
        userName: req.body.userName,
        userEmail: req.body.userEmail,
      },
      { new: true }
    )
    const { userPassword, ...userData } = updatedUser._doc
    res.send(userData)
  } catch (err) {
    res.status(400).json([
      {
        err: err,
        msg: 'Cant update user',
      },
    ])
  }
}

export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors)
    }
    const user = await userModel.findOne({ userEmail: req.body.userEmail })
    if (!user) {
      return res.status(404).json([
        {
          msg: 'User not found',
        },
      ])
    }
    const isValidPass = await bcrypt.compare(
      req.body.userPassword,
      user._doc.userPassword
    )
    if (!isValidPass) {
      return res.status(403).json([
        {
          msg: 'Invalid email or password',
        },
      ])
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      secret,
      {
        expiresIn: '20d',
      }
    )

    const { userPassword, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Unable to log in',
    })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors)
    }
    const user = await userModel.findOne({ userEmail: req.body.userEmail })
    if (!user) {
      return res.status(404).json([
        {
          msg: 'User not found',
        },
      ])
    }
    const payload = {
      email: user.userEmail,
      id: user._id,
    }
    const userSecret = user.userPassword + secret
    const resetToken = jwt.sign(payload, userSecret, { expiresIn: '10m' })
    const resetLink = `${domain}auth/resetPassword/${user._id}/${resetToken}`

    transporter.sendMail(
      mailConfig(req.body.userEmail, resetLink),
      function (error, info) {
        if (error) {
          return res.status(500).json([
            {
              msg: 'Unable to send reset password link',
            },
          ])
        }
      }
    )
    res
      .status(200)
      .json([{ msg: `reset password link was sent to ${req.body.userEmail}` }])
  } catch (err) {
    console.log(err)
    res.status(500).json([
      {
        msg: 'Unable to reset password',
      },
    ])
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.params
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors)
    }

    const user = await userModel.findOne({ _id: userId })
    if (!user) {
      return res.status(404).json([
        {
          msg: 'User not found',
        },
      ])
    }

    const userSecret = user.userPassword + secret
    const payload = jwt.verify(token, userSecret)

    const passwordCrypt = await bcrypt.hash(
      req.body.userPassword,
      await bcrypt.genSalt(10)
    )

    await userModel.findOneAndUpdate(
      { _id: payload.id, userEmail: payload.email },
      {
        userPassword: passwordCrypt,
      }
    )

    res.status(200).json([{ msg: `password was reset` }])
  } catch (err) {
    console.log(err)
    res.status(500).json([
      {
        msg: `Unable to reset password:${err}`,
      },
    ])
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId)
    if (!user) {
      return res.status(404).json([
        {
          msg: 'User not found',
        },
      ])
    }
    const { userPassword, ...userData } = user._doc

    res.json({
      ...userData,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json([
      {
        msg: 'Cant authorize user',
      },
    ])
  }
}

export const uploadUrl = async (req, res) => {
  try {
    await userModel.findOneAndUpdate(
      { _id: req.body.id },
      {
        userImage: req.body.img,
      }
    )
    res.send({
      imgUrl: req.body.img,
      msg: 'Img Uploaded successfull',
    })
  } catch (err) {
    res.status(400).json([
      {
        msg: 'Cant upload img',
      },
    ])
  }
}
export const deleteImg = async (req, res) => {
  try {
    userModel.findOneAndUpdate(
      { _id: req.userId },
      {
        userImage: '',
      },
      (err, doc) => {
        if (!doc) {
          return res.status(404).json([
            {
              msg: 'Cant find user',
            },
          ])
        }
      }
    )
    res.status(200).json({
      msg: 'Img deleted',
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      msg: 'Problem while deleting img',
    })
  }
}
