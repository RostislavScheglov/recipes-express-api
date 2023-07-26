import { body } from 'express-validator'
export const recipeValidation = [
  body('title', 'Title length should be minimum 3 symbols').isLength({
    min: 3,
  }),
  // body('recipeImage', 'Bad link to the image').optional().isURL(),
  body('ingredients', '1 ingredient is minimum').isLength({ min: 1 }),
  body('description', 'Bad description format').isString(),
]
