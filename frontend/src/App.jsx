import React, { useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState(null);
  const [companyType, setCompanyType] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [shortlistStatus, setShortlistStatus] = useState(""); // ✅ NEW
  const [suggestions, setSuggestions] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume || !companyType || !jobRole) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("companyType", companyType);
    formData.append("jobRole", jobRole);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setAtsScore(data.atsScore);
      setShortlistStatus(data.shortlistStatus); // ✅ NEW
      setSuggestions(data.suggestions);
      setMissingKeywords(data.missingKeywords);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Check backend server.");
    }
  };

  return (
    <div className="App">
      <div className="container">
        {/* Left Panel */}
        <form onSubmit={handleSubmit} className="left-panel">
          <h1>SMART AI RESUME CHECKER</h1>

          <label>
            Upload Resume (PDF):
            <label htmlFor="resume-upload" className="custom-file-upload">
              {resume ? resume.name : "Click to Upload PDF"}
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              required
            />
          </label>

          <label>
            Company Type:
            <input
              list="company-types"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              placeholder="e.g., Product Based"
            />
            <datalist id="company-types">
              <option value="Product Based" />
              <option value="Service Based" />
              <option value="Startup" />
              <option value="MNC" />
              <option value="Government" />
              <option value="Remote Only" />
            </datalist>
          </label>

          <label>
            Job Role:
            <input
              list="job-roles"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g., Full Stack Developer"
            />
            <datalist id="job-roles">
              <option value="Frontend Developer" />
              <option value="Backend Developer" />
              <option value="Full Stack Developer" />
              <option value="Data Scientist" />
              <option value="UI/UX Designer" />
              <option value="DevOps Engineer" />
              <option value="Embedded Engineer" />
              <option value="Cyber Security Specialist" />
              <option value="Mobile App Developer" />
              <option value="Software Tester" />
              <option value="Business Analyst" />
              <option value="Machine Learning Engineer" />
              <option value="AI/ML Engineer" />
              <option value="QA Engineer" />
              <option value="System Administrator" />
              <option value="SEO Specialist" />
              <option value="Digital Marketer" />
              <option value="Cloud Engineer" />
              <option value="Mechanical Engineer" />
              <option value="Civil Engineer" />
            </datalist>
          </label>

          <button type="submit">Analyze Resume</button>
        </form>

        {/* Divider */}
        <div className="divider"></div>

        {/* Right Panel */}
        <div className="right-panel">
          <h2>Results Will Show Here 🔍</h2>

          {atsScore !== null ? (
            <>
              <p>→ <strong>ATS Score:</strong> {atsScore}%</p>
              <p>→ <strong>Status:</strong> {shortlistStatus}</p>
              <p>→ <strong>Suggestions:</strong></p>
              <ul>
                {suggestions.map((item, index) => (
                  <li key={index}>💡 {item}</li>
                ))}
              </ul>
              <p>→ <strong>Missing Keywords:</strong></p>
              <ul>
                {missingKeywords.map((key, index) => (
                  <li key={index}>❌ {key}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>Please upload resume and submit to see results.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
