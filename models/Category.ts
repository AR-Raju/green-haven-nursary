import mongoose from "mongoose"

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Category || mongoose.model("Category", CategorySchema)
