import mongoose from 'mongoose'

const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    recipeImage: { type: String },
    ingredients: { type: Array, required: true },
    description: { type: String, required: true },
    viewsCount: { type: Array, default: [] },
    likesCount: { type: Number, default: 0 },
    likedBy: { type: Array, default: [] },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Recipe', RecipeSchema)
