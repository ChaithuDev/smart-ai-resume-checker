const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Root route to test deployment
app.get('/', (req, res) => {
  res.send("✅ Smart AI Resume Checker Backend is Live");
});

// ✅ Analyze resume route
app.post('/analyze', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Resume file not uploaded" });
  }

  const resumePath = req.file.path;
  const jobRole = req.body.jobRole || "";
  const companyType = req.body.companyType || "";

  console.log("📥 Resume received:", resumePath);
  console.log("📌 Job Role:", jobRole);
  console.log("🏢 Company Type:", companyType);

  // Python script call
  exec(`python3 analyzer.py "${resumePath}" "${jobRole}" "${companyType}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Python script error:", stderr);
      return res.status(500).json({ error: stderr });
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (e) {
      console.error("❌ Invalid JSON from Python:", stdout);
      res.status(500).json({ error: "Invalid JSON output from analyzer.py" });
    }

    // (Optional) Delete uploaded file after processing
    fs.unlink(resumePath, (unlinkErr) => {
      if (unlinkErr) {
        console.warn("⚠️ Failed to delete uploaded file:", resumePath);
      } else {
        console.log("🧹 Temporary resume file deleted:", resumePath);
      }
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
