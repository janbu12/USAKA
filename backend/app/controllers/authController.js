const { admin, db } = require('../../config/firebase');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: username
        });

        const newUser = new User({
            uid: userRecord.uid,
            email: email,
            username: username
        });
        await db.ref(`users/${userRecord.uid}`).set(newUser.toObject());

        res.status(201).json({
            message: 'User registered successfully',
            uid: userRecord.uid,
            email: userRecord.email,
            username: userRecord.displayName
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const customToken = await admin.auth().createCustomToken(userRecord.uid);

        res.json({
            message: 'Login successful',
            uid: userRecord.uid,
            email: userRecord.email,
            username: userRecord.displayName,
            customToken: customToken
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(401).json({ message: 'Invalid credentials', error: error.message });
    }
};

exports.verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({ message: 'Invalid or expired token. Authorization denied.', error: error.message });
    }
};