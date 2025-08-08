import mongoose, { Schema } from 'mongoose';
import { IChatMessage } from '@/types';

const chatMessageSchema = new Schema<IChatMessage>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    enum: ['client', 'admin'],
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  attachments: [{
    type: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
chatMessageSchema.index({ orderId: 1 });
chatMessageSchema.index({ senderId: 1 });
chatMessageSchema.index({ senderRole: 1 });
chatMessageSchema.index({ isRead: 1 });
chatMessageSchema.index({ createdAt: -1 });
chatMessageSchema.index({ orderId: 1, createdAt: -1 });

// Virtual for populated sender
chatMessageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true
});

// Virtual for populated order
chatMessageSchema.virtual('order', {
  ref: 'Order',
  localField: 'orderId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);