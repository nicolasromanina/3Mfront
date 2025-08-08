import mongoose, { Schema } from 'mongoose';
import { IInventoryItem } from '@/types';

const inventoryItemSchema = new Schema<IInventoryItem>({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [200, 'Item name cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['papier', 'encre', 'finition', 'equipement', 'autres']
  },
  currentStock: {
    type: Number,
    required: [true, 'Current stock is required'],
    min: [0, 'Current stock cannot be negative']
  },
  minStock: {
    type: Number,
    required: [true, 'Minimum stock is required'],
    min: [0, 'Minimum stock cannot be negative']
  },
  maxStock: {
    type: Number,
    required: [true, 'Maximum stock is required'],
    min: [1, 'Maximum stock must be at least 1']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
    maxlength: [50, 'Unit cannot exceed 50 characters']
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
    trim: true,
    maxlength: [200, 'Supplier name cannot exceed 200 characters']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  lastRestocked: {
    type: Date,
    default: Date.now
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
inventoryItemSchema.index({ category: 1 });
inventoryItemSchema.index({ currentStock: 1 });
inventoryItemSchema.index({ name: 'text' });
inventoryItemSchema.index({ lastRestocked: -1 });

// Virtual for stock status
inventoryItemSchema.virtual('stockStatus').get(function() {
  if (this.currentStock <= this.minStock * 0.5) {
    return 'critical';
  } else if (this.currentStock <= this.minStock) {
    return 'low';
  } else if (this.currentStock >= this.maxStock * 0.8) {
    return 'high';
  } else {
    return 'normal';
  }
});

// Validation
inventoryItemSchema.pre('save', function(next) {
  if (this.minStock > this.maxStock) {
    next(new Error('Minimum stock cannot be greater than maximum stock'));
  }
  if (this.currentStock > this.maxStock) {
    next(new Error('Current stock cannot exceed maximum stock'));
  }
  next();
});

export default mongoose.model<IInventoryItem>('InventoryItem', inventoryItemSchema);