const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/gymDB';

// Define Gym schema
const gymSchema = new mongoose.Schema({
    gymName: {type: String, required: true, unique: true},
    ownerName: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    subscriptionPlan: {type: String, default: 'basic'},
    isActive: {type: Boolean, default: true}
}, {timestamps: true});

const Gym = mongoose.model('Gym', gymSchema);

async function deleteAllGyms() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await Gym.deleteMany({});
        console.log(`Deleted ${result.deletedCount} gyms.`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (err) {
        console.error('Error deleting gyms:', err);
    }
}

deleteAllGyms();

//to serve go to backend/queries node deleteAllgyms.js