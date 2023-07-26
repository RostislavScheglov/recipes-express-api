import recipeModel from '../models/Recipe.js'
import { validationResult } from 'express-validator'

const findByFilter = async (res, errMsg, search) => {
  try {
    const recipes = await recipeModel.find(search).populate({
      path: 'author',
      select: ['userName', 'userEmail', 'userImage'],
    })
    if (recipes !== null && recipes !== undefined) {
      return res.send(recipes)
    }
    res.send('No recipes was found')
  } catch (err) {
    console.log(err)
    res.status(400).json({
      msg: errMsg,
    })
  }
}

const getAll = async (req, res) => {
  const errMsg = 'Cant get recipes'
  findByFilter(res, errMsg)
}

const getFavourite = async (req, res) => {
  const errMsg = 'Cant get favourite recipes'
  const searchParam = { likedBy: { $in: [req.userId] } }
  findByFilter(res, errMsg, searchParam)
}

const getMyRecipes = async (req, res) => {
  const errMsg = 'Cant get my recipes'
  const searchParam = { author: req.userId }
  findByFilter(res, errMsg, searchParam)
}
const getAuthorRecipes = async (req, res) => {
  const errMsg = 'Cant get author recipes'
  const searchParam = { author: req.params.id }
  findByFilter(res, errMsg, searchParam)
}

export const deleteImg = async (req, res) => {
  try {
    recipeModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        recipeImage: '',
      },
      (err, doc) => {
        if (!doc) {
          return res.status(404).json([
            {
              msg: 'Cant find recipe',
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

export const findRecipes = (req, res) => {
  const recipesFilter = req.params.filter

  if (recipesFilter === 'all') getAll(req, res)

  if (recipesFilter === 'favourite') getFavourite(req, res)

  if (recipesFilter === 'my') getMyRecipes(req, res)

  if (recipesFilter === 'author') getAuthorRecipes(req, res)
}

export const getOne = async (req, res) => {
  try {
    recipeModel
      .findOneAndUpdate(
        {
          _id: req.params.id,
        },
        { $addToSet: { viewsCount: req.userId } },
        {
          returnDocument: 'after',
        },
        (err, doc) => {
          if (err) {
            console.log(err)
            return res.status(400).json({
              msg: 'Cant get recipe',
            })
          }
          if (!doc) {
            return res.status(404).json({
              msg: 'Cant find recipe',
            })
          }
          res.send(doc)
        }
      )
      .populate({
        path: 'author',
        select: ['userName', 'userEmail', 'userImage'],
      })
  } catch (err) {
    res.status(500).json([
      {
        msg: 'Cant get recipe',
      },
    ])
  }
}

export const create = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors)
    }
    const recipeExists = await recipeModel.findOne({ title: req.body.title })
    if (recipeExists) {
      return res.status(400).json([
        {
          msg: 'Recipe with this title exists',
        },
      ])
    }
    const doc = new recipeModel({
      title: req.body.title,
      recipeImage: '',
      ingredients: req.body.ingredients,
      description: req.body.description,
      author: req.userId,
    })
    const post = await doc.save()
    res.send(post)
  } catch (err) {
    console.log(err)
    res.status(400).json([
      {
        msg: 'Cant create recipe',
      },
    ])
  }
}

export const uploadUrl = async (req, res) => {
  try {
    await recipeModel.findOneAndUpdate(
      { _id: req.body.id },
      {
        recipeImage: req.body.img,
      }
    )
    res.send('Img Uploaded successfull')
  } catch (err) {
    res.status(400).json([
      {
        msg: 'Cant upload img',
      },
    ])
  }
}

//refactore remove (we have c)
export const remove = async (req, res) => {
  try {
    recipeModel.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
      if (!doc) {
        return res.status(404).json([
          {
            msg: 'Cant find recipe',
          },
        ])
      }
    })
    res.send('Recipe was successfully deleted')
  } catch (err) {
    res.status(400).json([
      {
        msg: 'Cant delete recipe',
      },
    ])
  }
}

export const update = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors)
    }
    recipeModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        ingredients: req.body.ingredients,
        description: req.body.description,
        $push: { likedBy: req.body.userId },
      },
      (err, doc) => {
        if (!doc) {
          return res.status(404).json([
            {
              msg: 'Cant find recipe',
            },
          ])
        }
      }
    )
    res.send('Recipe was successfully Updated')
  } catch (err) {
    res.status(400).json([
      {
        msg: 'Cant update recipe',
      },
    ])
  }
}

export const likeDislike = async (req, res) => {
  try {
    if (req.body.liked) {
      recipeModel.updateOne(
        { _id: req.params.id },
        {
          $push: { likedBy: req.body.userId },
        },
        (err, doc) => {
          if (!doc) {
            return res.status(404).json([
              {
                msg: 'Cant find recipe',
              },
            ])
          }
        }
      )
      res.status(200).json([
        {
          msg: 'Added to fav',
        },
      ])
    } else {
      recipeModel.updateOne(
        { _id: req.params.id },
        {
          $pull: { likedBy: req.body.userId },
        },
        (err, doc) => {
          if (!doc) {
            return res.status(404).json([
              {
                msg: 'Cant find recipe',
              },
            ])
          }
        }
      )
      res.status(200).json([
        {
          msg: 'Deleted from fav',
        },
      ])
    }
  } catch (err) {
    res.status(400).json([
      {
        msg: 'Cant update recipe',
      },
    ])
  }
}
