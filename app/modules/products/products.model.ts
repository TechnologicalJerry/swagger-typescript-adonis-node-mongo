import mongoose, { Schema, Document } from 'mongoose'

export interface ProductDocument extends Document {
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
)

export const Product = mongoose.model<ProductDocument>('Product', productSchema)
