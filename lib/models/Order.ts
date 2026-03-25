import mongoose, { Document, Model } from 'mongoose'

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  productName: string
  ucAmount: number
  price: number
  quantity: number
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  items: IOrderItem[]
  totalAmount: number
  totalUC: number
  pubgId: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  paymentId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new mongoose.Schema<IOrderItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  ucAmount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
})

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalUC: {
      type: Number,
      required: true,
      min: 0,
    },
    pubgId: {
      type: String,
      required: [true, 'PUBG ID is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentId: String,
    notes: String,
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)

export default Order
