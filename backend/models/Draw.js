const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
    drawId: { type: Number, required: true, unique: true },
    date: { type: String, required: true }, // Keeping as string "YYYY-MMM-DD" for simplicity based on current parsing
    numbers: { type: [Number], required: true },
    thunderball: { type: Number, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Draw', drawSchema);
