const { db } = require('../../config/firebase');
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const usersRef = db.ref('users');
        const snapshot = await usersRef.once('value');
        const usersData = snapshot.val();

        const users = [];
        if (usersData) {
            for (const uid in usersData) {
                if (usersData.hasOwnProperty(uid)) {
                    users.push(User.fromData(uid, usersData[uid]));
                }
            }
        }

        res.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const userRef = db.ref(`users/${userId}`);
        const snapshot = await userRef.once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = snapshot.val();
        const user = User.fromData(userId, userData);

        res.json(user);
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ message: 'Error getting user by ID', error: error.message });
    }
};


exports.createProduct = async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const newProductRef = db.ref('products').push(); // Membuat ID unik baru
        const productId = newProductRef.key; // Dapatkan ID yang baru dibuat

        await newProductRef.set({
            name,
            price,
            description,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ message: 'Product created successfully', productId });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};