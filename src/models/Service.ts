import mongoose, { Schema } from 'mongoose';
import { IService, IServiceOption } from '@/types';

const serviceOptionSchema = new Schema<IServiceOption>({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Option name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['select', 'checkbox', 'number'],
    required: [true, 'Option type is required']
  },
  options: [{
    type: String,
    trim: true
  }],
  priceModifier: {
    type: Number,
    required: [true, 'Price modifier is required'],
    min: [0, 'Price modifier cannot be negative']
  },
  required: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const serviceSchema = new Schema<IService>({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [200, 'Service name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['flyers', 'cartes', 'affiches', 'brochures', 'autres'],
    required: [true, 'Service category is required']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Base price cannot be negative']
  },
  unit: {
    type: String,
    enum: ['unité', 'page', 'm²'],
    required: [true, 'Unit is required']
  },
  options: [serviceOptionSchema],
  minQuantity: {
    type: Number,
    required: [true, 'Minimum quantity is required'],
    min: [1, 'Minimum quantity must be at least 1']
  },
  maxQuantity: {
    type: Number,
    required: [true, 'Maximum quantity is required'],
    min: [1, 'Maximum quantity must be at least 1']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ basePrice: 1 });
serviceSchema.index({ createdAt: -1 });
serviceSchema.index({ name: 'text', description: 'text' });

// Validation
serviceSchema.pre('save', function(next) {
  if (this.minQuantity > this.maxQuantity) {
    next(new Error('Minimum quantity cannot be greater than maximum quantity'));
  }
  next();
});

export default mongoose.model<IService>('Service', serviceSchema);