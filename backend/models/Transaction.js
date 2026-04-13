const mongoose = require('mongoose');

// Define the blueprint (Schema) for a transaction
const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please add a text description']
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive or negative number']
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Please specify if this is income or an expense']
    },
    category: {
        type: String,
        required: [true, 'Please select a category (e.g., Food, Salary, Rent)']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);