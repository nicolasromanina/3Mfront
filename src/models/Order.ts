import mongoose, { Schema } from 'mongoose';
import { IOrder, IOrderItem } from '@/types';

const orderItemSchema = new Schema<IOrderItem>({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  options: {
    type: Schema.Types.Mixed,
    default: {}
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  files: [{
    type: String
  }]
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['devis', 'en_attente', 'en_cours', 'terminee', 'livree', 'annulee'],
    default: 'devis'
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  quotePdf: {
    type: String
  },
  invoicePdf: {
    type: String
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
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
orderSchema.index({ clientId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ dueDate: 1 });
orderSchema.index({ 'items.serviceId': 1 });

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  
  // Set completedAt when status changes to completed
  if (this.isModified('status') && (this.status === 'terminee' || this.status === 'livree')) {
    this.completedAt = new Date();
  }
  
  next();
});

// Virtual for populated client
orderSchema.virtual('client', {
  ref: 'User',
  localField: 'clientId',
  foreignField: '_id',
  justOne: true
});

// Virtual for populated service in items
orderSchema.virtual('items.service', {
  ref: 'Service',
  localField: 'items.serviceId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.model<IOrder>('Order', orderSchema);