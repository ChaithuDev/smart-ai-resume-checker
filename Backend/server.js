const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Endpoint for resume analysis
app.post('/analyze', upload.single('resume'), (req, res) => {
  const resumePath = req.file.path;
  const jobRole = req.body.jobRole;
  const companyType = req.body.companyType;

  exec(`python3 analyzer.py ${resumePath} "${jobRole}" "${companyType}"`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }
    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON output from Python" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
