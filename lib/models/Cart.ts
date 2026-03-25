import mongoose, { Document, Model } from 'mongoose'

export interface ICartItem {
  product: mongoose.Types.ObjectId
  quantity: number
}

export interface ICart extends Document {
  _id: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  items: ICartItem[]
  createdAt: Date
  updatedAt: Date
}

const cartItemSchema = new mongoose.Schema<ICartItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
})

const cartSchema = new mongoose.Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
)

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema)

export default Cart
