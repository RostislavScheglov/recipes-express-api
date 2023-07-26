import express from 'express'
import { checkAuthor, checkSession } from '../middleware/checkers.js'
import { recipeValidation } from '../validators/recipesValidator.js'
import {
  create,
  deleteImg,
  findRecipes,
  getOne,
  likeDislike,
  remove,
  update,
  uploadUrl,
} from '../controllers/recipesControllers.js'

const recipesRouter = express.Router()

recipesRouter.get('/:filter([a-z]+)/:id?', checkSession, findRecipes)

recipesRouter.delete('/img/:id', deleteImg)

recipesRouter.post('/', checkSession, recipeValidation, create)

recipesRouter.post('/upload', uploadUrl)

recipesRouter.get('/:id', checkSession, getOne)

recipesRouter.delete('/:id/:userId', checkSession, checkAuthor, remove)

recipesRouter.patch(
  '/edit/:id/:userId',
  checkSession,
  checkAuthor,
  recipeValidation,
  update
)

recipesRouter.patch('/likeDislike/:id', checkSession, likeDislike)

export default recipesRouter
