const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/gymDB';

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

async function resetGyms() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Drop the collection if it exists
        const collections = await mongoose.connection.db.listCollections({name: 'gyms'}).toArray();
        if (collections.length > 0) {
            await mongoose.connection.db.dropCollection('gyms');
            console.log('Dropped gyms collection');

            // Wait a tiny bit to ensure the drop finishes
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Ensure indexes are created
        await Gym.init();
        console.log('Indexes created from schema');

        // Recreate initial gyms
        const initialGyms = [
            {
                gymName: 'FitZone',
                ownerName: 'Rawan Cheaito',
                phone: '+96170000000',
                email: 'fitzone@gmail.com',
                address: 'Beirut, Lebanon',
                subscriptionPlan: 'premium'
            },
            {
                gymName: 'PowerHouse',
                ownerName: 'Ali Mansour',
                phone: '+96171000000',
                email: 'powerhouse@gmail.com',
                address: 'Beirut, Lebanon'
            }
        ];

        const createdGyms = await Gym.insertMany(initialGyms);
        console.log('Recreated gyms:', createdGyms);

        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (err) {
        console.error('Error resetting gyms:', err);
        await mongoose.connection.close();
    }
}

resetGyms();

//to serve go to quries folder and :  node resetGyms.js