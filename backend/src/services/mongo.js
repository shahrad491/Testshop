import mongoose from "mongoose";
import "dotenv/config";

const mongoURL = process.env.MONGO_URL;

const db = mongoose.connection;
db.on("open", () => {
  console.log("DB is open and ready");
});
db.on("error", (error) => {
  console.error(error);
});
process.on("SIGINT", () => {
  mongoose.connection.close().then(() => {
    console.log("DB Connection Closed Due to application termination");
  });
});
db.on("disconnected", () => {
  console.log("DB disconnected");
});

export async function connectDB() {
  try {
    const connDB = await mongoose.connect(mongoURL);
    console.log("DB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect(mongoURL);
}
