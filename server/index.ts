import * as mongoose from 'mongoose';
import express from 'express';
import cors from "cors";
import { User } from './schema';
import { exec } from 'child_process';

const app = express();
const PORT = 5000;

let data: any = [];  // Outside the async function, accessible to any route

// Middleware
app.use(cors());
app.use(express.json());

(async () => {
  
  try {

    await mongoose.connect('mongodb://127.0.0.1:27017/mongoose-app');
    console.log('Connected to MongoDB');

    // Fetch data from database
    const user = await User.find();
    // user[0]?.getName();
    data = user;

    app.get("/data", (req, res) => {
      res.json({ user: data });
    });

    app.post("/add", async (req, res) => {
      try {
        const newData = new User(req.body);
        await newData.save();
        data.push(newData);
        res.json({ success: true, message: "Added successfully!" });
      } catch (error) {
        console.error("Error adding:", error);
        res.status(500).json({ success: false, message: "Error adding" });
      }
    });

    app.post("/clear", async (req, res) => {
      try {
        await User.deleteMany({});
        data = [];  // Clear in-memory array
        res.json({ success: true, message: "cleared" });
      } catch (error) {
        console.error("Error clearing:", error);
        res.status(500).json({ success: false, message: "Error clearing" });
      }
    });

    // Start the server after setting up all routes
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }

})();

//Add python scripts
exec('python3 server/service.py', (error, stdout) => {
  if (error) {
    console.error(`Error executing script: ${error}`);
    return;
  }
  console.log(`From PY: ${stdout}`);
});