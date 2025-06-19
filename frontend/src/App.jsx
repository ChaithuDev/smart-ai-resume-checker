import React, { useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState(null);
  const [companyType, setCompanyType] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [shortlistStatus, setShortlistStatus] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [error, setError] = useState(""); // ✅ New error state

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
      const response = await fetch("https://smart-ai-resume-checker-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setAtsScore(data.atsScore || 0);
        setShortlistStatus(data.shortlistStatus || "N/A");
        setSuggestions(data.suggestions || []);
        setMissingKeywords(data.missingKeywords || []);
        setError("");
      } else {
        setError(data.error || "Something went wrong.");
        setAtsScore(null);
        setShortlistStatus("");
        setSuggestions([]);
        setMissingKeywords([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Server not reachable. Please try again later.");
      setAtsScore(null);
      setShortlistStatus("");
      setSuggestions([]);
      setMissingKeywords([]);
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

          {error && <p style={{ color: "red" }}>❌ {error}</p>}

          {atsScore !== null && !error ? (
            <>
              <p>→ <strong>ATS Score:</strong> {atsScore}%</p>
              <p>→ <strong>Status:</strong> {shortlistStatus}</p>
              <p>→ <strong>Suggestions:</strong></p>
              <ul>
                {suggestions?.length > 0 ? (
                  suggestions.map((item, index) => (
                    <li key={index}>💡 {item}</li>
                  ))
                ) : (
                  <li>No suggestions available.</li>
                )}
              </ul>
              <p>→ <strong>Missing Keywords:</strong></p>
              <ul>
                {missingKeywords?.length > 0 ? (
                  missingKeywords.map((key, index) => (
                    <li key={index}>❌ {key}</li>
                  ))
                ) : (
                  <li>No missing keywords found.</li>
                )}
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
