const mongoose =  require('mongoose');

const mongoURI = "mongodb://localhost:27017/inotebook"

const connectToMongo = () => {
    mongoose.connect(mongoURI)
    .then(() => console.log("Connected to mongo successfully!"))
    .catch((error) => console.error("Failed to connect to MongoDB:", error));
};

module.exports = connectToMongo;