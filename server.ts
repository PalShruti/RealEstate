// src/server.ts
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { bungalowsService } from "./src/services/bungalowsService";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes

// Get all bungalows
app.get("/api/bungalows", async (req, res) => {
  try {
    const data = await bungalowsService.getAllBungalows();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Add new bungalow
app.post("/api/bungalows", async (req, res) => {
  try {
    const data = await bungalowsService.addBungalow(req.body);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update bungalow
app.put("/api/bungalows/:id", async (req, res) => {
  try {
    const data = await bungalowsService.updateBungalow(req.params.id, req.body);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete bungalow
app.delete("/api/bungalows/:id", async (req, res) => {
  try {
    await bungalowsService.deleteBungalow(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});