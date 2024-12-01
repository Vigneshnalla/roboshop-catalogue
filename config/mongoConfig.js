require('dotenv').config(); // Load environment variables from .env file
const { MongoClient } = require('mongodb');
const logger = require('../middlewares/logger');

let db = null;
let collection = null;
let mongoConnected = false;

/**
 * Connect to MongoDB
 */
async function connectToMongo() {
    const mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/catalogue';
    try {
        const client = await MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db('catalogue');
        collection = db.collection('products');
        mongoConnected = true;
        logger.info('MongoDB Connected Successfully');
    } catch (error) {
        mongoConnected = false;
        logger.error('MongoDB Connection Failed:', error.message);
        throw error;
    }
}

/**
 * Retry MongoDB Connection in case of failure
 */
async function retryMongoConnection() {
    while (!mongoConnected) {
        try {
            await connectToMongo();
        } catch (error) {
            logger.warn('Retrying MongoDB Connection in 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
        }
    }
}

// Start connection retry loop
retryMongoConnection();

module.exports = {
    getDb: () => db,
    getCollection: () => collection,
    isConnected: () => mongoConnected,
};
