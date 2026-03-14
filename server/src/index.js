const express = require("express");
const cors = require("cors");

const businessRoutes = require("./routes/businesses");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Business routes: add, examples, evaluate
app.use("/api/businesses", businessRoutes);

// Optional: mock webhook receiver for score update events
const webhookEvents = [];
app.post("/api/webhooks/score-update", (req, res) => {
  const event = { ...req.body, received_at: new Date().toISOString() };
  webhookEvents.push(event);
  console.log("[webhook] Received score-update event:", event);
  res.json({ received: true, event_count: webhookEvents.length });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/businesses/examples`);
  console.log(`   POST /api/businesses/add`);
  console.log(`   POST /api/businesses/evaluate\n`);
});
