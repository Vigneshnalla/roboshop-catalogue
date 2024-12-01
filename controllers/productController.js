const { getCollection, isConnected } = require('../config/mongoConfig');

// Function to check if MongoDB connection is active
const checkMongoConnection = () => {
    if (!isConnected()) {
        console.error('MongoDB is not connected');
        throw new Error('MongoDB is not connected');
    }
};

// Route handler for getting all products
const getAllProducts = (req, res) => {
    try {
        checkMongoConnection(); // Check if MongoDB is connected
        const collection = getCollection();
        console.log("Collection: ", collection);

        collection.find({}).toArray().then((products) => {
            res.json(products);
        }).catch((e) => {
            req.log.error('ERROR', e);
            res.status(500).send(e);
        });
    } catch (error) {
        res.status(500).send('Database connection error');
    }
};

// Route handler for getting product by SKU
const getProductBySKU = (req, res) => {

    // const { sku, name } = req.query;
    const { sku } = req.params;
    const delay = process.env.GO_SLOW || 0;
    console.log("sk",sku)
    try {
        checkMongoConnection(); // Check if MongoDB is connected
        const collection = getCollection();

        setTimeout(() => {
            collection.findOne({ sku }).then((product) => {
                req.log.info('product', product);
                if (product) {
                    res.json(product);
                } else {
                    res.status(404).send('SKU not found');
                }
            }).catch((e) => {
                req.log.error('ERROR', e);
                res.status(500).send(e);
            });
        }, delay);
    } catch (error) {
        res.status(500).send('Database connection error');
    }
};

// Route handler for getting products by category
const getProductsByCategory = (req, res) => {
    const { cat } = req.params;
    try {
        checkMongoConnection(); // Check if MongoDB is connected
        const collection = getCollection();

        collection.find({ categories: cat }).sort({ name: 1 }).toArray().then((products) => {
            res.json(products);
        }).catch((e) => {
            req.log.error('ERROR', e);
            res.status(500).send(e);
        });
    } catch (error) {
        res.status(500).send('Database connection error');
    }
};

// Route handler for getting all categories
const getAllCategories = (req, res) => {
    try {
        checkMongoConnection(); // Check if MongoDB is connected
        const collection = getCollection();

        collection.distinct('categories').then((categories) => {
            res.json(categories);
        }).catch((e) => {
            req.log.error('ERROR', e);
            res.status(500).send(e);
        });
    } catch (error) {
        res.status(500).send('Database connection error');
    }
};

// Route handler for searching products by text
const searchProducts = (req, res) => {
    const { text } = req.params;
    try {
        checkMongoConnection(); // Check if MongoDB is connected
        const collection = getCollection();

        collection.find({ '$text': { '$search': text }}).toArray().then((hits) => {
            res.json(hits);
        }).catch((e) => {
            req.log.error('ERROR', e);
            res.status(500).send(e);
        });
    } catch (error) {
        res.status(500).send('Database connection error');
    }
};

module.exports = {
    getAllProducts,
    getProductBySKU,
    getProductsByCategory,
    getAllCategories,
    searchProducts,
};
