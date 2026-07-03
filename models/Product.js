const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Peripherals', 'Hardware', 'Displays', 'Audio', 'Consoles'],
    },
  },
  { timestamps: true }
);

// Index for text search on title
productSchema.index({ title: 'text' });

module.exports = mongoose.model('Product', productSchema);
