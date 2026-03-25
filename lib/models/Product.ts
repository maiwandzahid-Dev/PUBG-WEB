import mongoose, { Document, Model } from 'mongoose'

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  description: string
  ucAmount: number
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: 'uc' | 'royale-pass' | 'crate' | 'bundle'
  isPopular: boolean
  isActive: boolean
  stock: number
  createdAt: Date
  updatedAt: Date
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    ucAmount: {
      type: Number,
      required: [true, 'UC amount is required'],
      min: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    image: {
      type: String,
      default: '/images/uc-default.png',
    },
    category: {
      type: String,
      enum: ['uc', 'royale-pass', 'crate', 'bundle'],
      default: 'uc',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: -1, // -1 means unlimited
    },
  },
  {
    timestamps: true,
  }
)

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)

export default Product
