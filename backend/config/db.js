import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://root:Is18071995$@cluster0.pkt4zi6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db();
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const getDB = () => db;

export { connectDB, getDB };
