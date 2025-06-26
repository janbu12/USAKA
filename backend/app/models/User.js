class User {
    constructor({ uid, email, username, createdAt }) {
        this.uid = uid;
        this.email = email;
        this.username = username;
        this.createdAt = createdAt || new Date().toISOString();
    }

    toObject() {
        return {
            email: this.email,
            username: this.username,
            createdAt: this.createdAt
        };
    }

    static fromData(uid, data) {
        return new User({
            uid: uid,
            email: data.email,
            username: data.username,
            createdAt: data.createdAt
        });
    }
}

module.exports = User;