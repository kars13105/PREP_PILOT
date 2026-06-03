"use client";

import { useState, useRef } from "react";
import Navbar from "../components/Navbar";

type Tab = "company-prep" | "resume-analyzer";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("company-prep");

  // Tab 1: Company Prep States
  const [company, setCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [roadmapGoal, setRoadmapGoal] = useState("roadmap, resume, interview");
  
  const [includeRoadmap, setIncludeRoadmap] = useState(true);
  const [includeResume, setIncludeResume] = useState(true);
  const [includeInterview, setIncludeInterview] = useState(true);

  const [roadmap, setRoadmap] = useState<any>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState("");

  // Tab 2: Resume Analyzer States
  const [jobLink, setJobLink] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzerLoading, setAnalyzerLoading] = useState(false);
  const [analyzerError, setAnalyzerError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab 1: Generate Company Prep
  const generateRoadmap = async () => {
    if (!company.trim()) {
      setRoadmapError("Please enter a target company.");
      return;
    }
    if (!targetRole.trim()) {
      setRoadmapError("Please enter a target role.");
      return;
    }

    setRoadmapLoading(true);
    setRoadmapError("");
    setRoadmap(null);

    // Build the goal string based on toggles
    const goals: string[] = [];
    if (includeRoadmap) goals.push("roadmap");
    if (includeResume) goals.push("resume");
    if (includeInterview) goals.push("interview");

    if (goals.length === 0) {
      setRoadmapError("Please select at least one component to generate (Roadmap, Resume, or Interview).");
      setRoadmapLoading(false);
      return;
    }

    const constructedGoal = `${goals.join(", ")} for ${targetRole} role`;

    try {
      const response = await fetch("https://prep-pilot-x5s4.onrender.com/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: company,
          skill_level: skillLevel,
          goal: constructedGoal,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate preparation plan. Please check backend connection.");
      }

      const data = await response.json();
      setRoadmap(data);
    } catch (err: any) {
      setRoadmapError(err.message || "An unexpected error occurred.");
    } finally {
      setRoadmapLoading(false);
    }
  };

  // Tab 2: Resume matching
  const analyzeResume = async () => {
    if (!resumeFile) {
      setAnalyzerError("Please upload your PDF resume first.");
      return;
    }

    setAnalyzerLoading(true);
    setAnalyzerError("");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_link", jobLink);

    try {
      const response = await fetch("https://prep-pilot-x5s4.onrender.com/resume-match", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume. Make sure backend is running.");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      setAnalyzerError(err.message || "An unexpected error occurred.");
    } finally {
      setAnalyzerLoading(false);
    }
  };

  // Drag & Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setResumeFile(file);
      } else {
        setAnalyzerError("Only PDF resumes are supported currently.");
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
    if (score >= 50) return "text-amber-500 border-amber-500/20 bg-amber-500/10";
    return "text-rose-500 border-rose-500/20 bg-rose-500/10";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <Navbar />

      <div className="max-w-5xl mx-auto pt-10 px-6">
        
        {/* Modern Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            PREP_PILOT AI Career Copilot
          </h1>
          <p className="text-slate-400 mt-3 text-lg max-w-2xl mx-auto">
            Your personalized AI placement suite. Accelerate your career search with customized preparation pipelines and ATS matching.
          </p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-900/80 backdrop-blur p-1 rounded-xl border border-slate-800 flex gap-1 shadow-2xl">
            <button
              onClick={() => setActiveTab("company-prep")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "company-prep"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Company Prep Copilot
            </button>
            <button
              onClick={() => setActiveTab("resume-analyzer")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "resume-analyzer"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ATS Resume & Job Match
            </button>
          </div>
        </div>

        {/* ==================== TAB 1: COMPANY PREPARATION COPILOT ==================== */}
        {activeTab === "company-prep" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-indigo-400">
                Placement preparation plan
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Fill in the details below to generate a highly tailored, AI-engineered prep plan mapping exactly to company and skill requirements.
              </p>

              {roadmapError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {roadmapError}
                </div>
              )}

              {/* Grid of Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Microsoft, Amazon"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-600 text-sm"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Role</label>
                  <input
                    type="text"
                    placeholder="e.g. SDE Internship, SWE, Data Analyst"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-600 text-sm"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Skill Level</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition-all text-sm"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                  >
                    <option value="Beginner">Beginner (New to tech/DSA)</option>
                    <option value="Intermediate">Intermediate (Know some concepts, build projects)</option>
                    <option value="Advanced">Advanced (Contest solver, system architect)</option>
                  </select>
                </div>
              </div>

              {/* Advanced Checkboxes */}
              <div className="border-t border-slate-800/60 pt-5 mb-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Include in AI Generation</label>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeRoadmap}
                      onChange={(e) => setIncludeRoadmap(e.target.checked)}
                      className="w-4 h-4 rounded accent-indigo-600 bg-slate-950 border-slate-800"
                    />
                    Custom Step Roadmap
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeResume}
                      onChange={(e) => setIncludeResume(e.target.checked)}
                      className="w-4 h-4 rounded accent-indigo-600 bg-slate-950 border-slate-800"
                    />
                    ATS Resume Tips
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeInterview}
                      onChange={(e) => setIncludeInterview(e.target.checked)}
                      className="w-4 h-4 rounded accent-indigo-600 bg-slate-950 border-slate-800"
                    />
                    High-Frequency Questions
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={generateRoadmap}
                  disabled={roadmapLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 disabled:cursor-not-allowed text-sm"
                >
                  {roadmapLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Engineering Copilot Plan...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Placement Plan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Results Grid */}
            {roadmap && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Meta Memory Header */}
                {roadmap.memory?.last_company && (
                  <div className="bg-indigo-950/20 border border-indigo-500/20 px-6 py-3.5 rounded-2xl text-indigo-300 text-xs flex items-center gap-2">
                    <span className="font-bold uppercase bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-400">Context Memory</span>
                    Last queried target company is saved as <strong className="text-white font-semibold underline underline-offset-2 capitalize">{roadmap.memory.last_company}</strong>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-8">
                  {/* Roadmap Agent Card */}
                  {roadmap.roadmap && roadmap.roadmap.length > 0 && (
                    <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
                      <h3 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.182v10.764a1 1 0 01-.553.894L15 18l-6 2z" />
                        </svg>
                        Roadmap Agent Preparation Steps
                      </h3>
                      
                      <div className="relative border-l-2 border-slate-800 pl-6 ml-3 space-y-8">
                        {roadmap.roadmap.map((step: string, index: number) => (
                          <div key={index} className="relative group">
                            {/* Step bubble counter */}
                            <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-slate-950 border-2 border-slate-800 group-hover:border-cyan-400 transition-all flex items-center justify-center text-xs font-semibold text-slate-400 group-hover:text-cyan-400">
                              {index + 1}
                            </div>
                            <div className="bg-slate-950/40 border border-slate-800/50 p-5 rounded-xl group-hover:border-slate-800 transition-all">
                              <p className="text-slate-200 text-sm leading-relaxed">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resume Agent Card */}
                  {roadmap.resume && roadmap.resume.length > 0 && (
                    <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
                      <h3 className="text-xl font-bold mb-6 text-indigo-400 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Resume Agent Formatting & Bullet Tips
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roadmap.resume.map((tip: string, index: number) => (
                          <div key={index} className="border border-slate-800/60 bg-slate-950/30 p-5 rounded-xl flex gap-3 items-start">
                            <span className="text-indigo-400 text-sm font-bold bg-indigo-500/10 px-2 py-1 rounded select-none">
                              #{index + 1}
                            </span>
                            <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interview Agent Card */}
                  {roadmap.interview && roadmap.interview.length > 0 && (
                    <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
                      <h3 className="text-xl font-bold mb-6 text-emerald-400 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Interview Agent High-Probability Prep Questions
                      </h3>

                      <div className="space-y-4">
                        {roadmap.interview.map((question: string, index: number) => (
                          <div key={index} className="border border-slate-800/60 bg-slate-950/20 p-5 rounded-xl hover:border-slate-800 transition-all flex items-start gap-4">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0 select-none mt-0.5">
                              Q
                            </div>
                            <div>
                              <p className="text-slate-200 text-sm font-medium leading-relaxed">{question}</p>
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 block">Expected at {company}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: RESUME + JOB MATCH ANALYZER ==================== */}
        {activeTab === "resume-analyzer" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-indigo-400">
                Resume & Job Description Match Analyzer
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Upload your PDF resume and paste the URL of the target job description. The AI will extract the parameters, compare them against each other, and detect exact skill gaps.
              </p>

              {analyzerError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {analyzerError}
                </div>
              )}

              {/* Drag & Drop Upload Zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Upload Resume PDF</label>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer min-h-[160px] transition-all duration-300 ${
                      dragActive
                        ? "border-indigo-500 bg-indigo-500/10"
                        : resumeFile
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="hidden"
                    />

                    {resumeFile ? (
                      <div className="space-y-2">
                        <svg className="w-12 h-12 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p className="text-emerald-400 text-sm font-semibold truncate max-w-[240px] mx-auto">
                          {resumeFile.name}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {(resumeFile.size / 1024).toFixed(1)} KB • Click to swap file
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <svg className="w-12 h-12 text-slate-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-slate-300 text-sm font-medium">
                          Drag and drop PDF resume, or <span className="text-indigo-400 underline">browse</span>
                        </p>
                        <p className="text-slate-500 text-xs">Supports PDF files only</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Link URL paste */}
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Job Description URL</label>
                  
                  <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center">
                    <p className="text-slate-500 text-xs mb-3 leading-relaxed">
                      Paste a live job listing URL (e.g. Greenhouse, Lever, LinkedIn, or Indeed). We will scan the page for core technologies, requirements, and responsibilities.
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="https://jobs.lever.co/company/job-id"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-700 text-sm"
                        value={jobLink}
                        onChange={(e) => setJobLink(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Analyze Button */}
              <div className="flex justify-end border-t border-slate-800/60 pt-5">
                <button
                  onClick={analyzeResume}
                  disabled={analyzerLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 disabled:cursor-not-allowed text-sm"
                >
                  {analyzerLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Parsing & Evaluating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Analyze & Match Score
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Match Analysis Results */}
            {analysis && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Score & Core Metrics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* radial / circular progress indicator */}
                  <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center backdrop-blur-md">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">ATS Match Score</h3>
                    
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          stroke="rgba(30, 41, 59, 0.5)"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          stroke="currentColor"
                          strokeWidth="10"
                          strokeDasharray={377}
                          strokeDashoffset={377 - (377 * (analysis.match_score || 0)) / 100}
                          className={`${
                            analysis.match_score >= 80
                              ? "text-emerald-500"
                              : analysis.match_score >= 50
                              ? "text-amber-500"
                              : "text-rose-500"
                          } transition-all duration-1000 ease-out`}
                          fill="transparent"
                        />
                      </svg>
                      <div className="text-center">
                        <span className="text-4xl font-extrabold tracking-tight text-white">
                          {analysis.match_score}%
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border mt-6 select-none ${getScoreColor(analysis.match_score)}`}>
                      {analysis.match_score >= 80 ? "Strong Fit" : analysis.match_score >= 50 ? "Moderate Fit" : "Critical Gap"}
                    </span>
                  </div>

                  {/* Skill Gap Chip Deck */}
                  <div className="md:col-span-2 bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl shadow-xl backdrop-blur-md flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Detected Skill Gaps</h3>
                      <p className="text-slate-400 text-xs mb-5">
                        These specific libraries, frameworks, tools, or architectural concepts are highlighted in the job details but are missing or weakly emphasized in your resume.
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {analysis.missing_skills && analysis.missing_skills.length > 0 ? (
                          analysis.missing_skills.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-indigo-300"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <div className="text-slate-500 text-xs italic">
                            No major skill gaps detected! Excellent keyword overlap.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-800/60 pt-4 mt-6">
                      <div className="w-full bg-slate-950 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreProgressColor(analysis.match_score)}`}
                          style={{ width: `${analysis.match_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume Improvements */}
                {analysis.resume_improvements && analysis.resume_improvements.length > 0 && (
                  <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
                    <h3 className="text-xl font-bold mb-6 text-indigo-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      ATS Bullet Point & Profile Improvements
                    </h3>

                    <div className="space-y-4">
                      {analysis.resume_improvements.map((tip: string, index: number) => (
                        <div key={index} className="border border-slate-800/60 bg-slate-950/20 p-5 rounded-xl flex items-start gap-4 hover:border-slate-800 transition-all">
                          <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skill Bridge Roadmap */}
                {analysis.roadmap && analysis.roadmap.length > 0 && (
                  <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
                    <h3 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.182v10.764a1 1 0 01-.553.894L15 18l-6 2z" />
                      </svg>
                      Personalized Bridge Roadmap (Closing the Skill Gap)
                    </h3>

                    <div className="relative border-l-2 border-slate-800 pl-6 ml-3 space-y-8">
                      {analysis.roadmap.map((step: string, index: number) => (
                        <div key={index} className="relative group">
                          {/* step counter bubble */}
                          <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-slate-950 border-2 border-slate-800 group-hover:border-cyan-400 transition-all flex items-center justify-center text-xs font-semibold text-slate-400 group-hover:text-cyan-400">
                            {index + 1}
                          </div>
                          <div className="bg-slate-950/40 border border-slate-800/50 p-5 rounded-xl group-hover:border-slate-800 transition-all">
                            <p className="text-slate-200 text-sm leading-relaxed">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job specific interview prep questions */}
                {analysis.interview_questions && analysis.interview_questions.length > 0 && (
                  <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
                    <h3 className="text-xl font-bold mb-6 text-emerald-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Job-Specific Interview Prep Questions
                    </h3>

                    <div className="space-y-4">
                      {analysis.interview_questions.map((question: string, index: number) => (
                        <div key={index} className="border border-slate-800/60 bg-slate-950/20 p-5 rounded-xl hover:border-slate-800 transition-all flex items-start gap-4">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0 select-none mt-0.5">
                            Q
                          </div>
                          <div>
                            <p className="text-slate-200 text-sm font-medium leading-relaxed">{question}</p>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 block">Custom engineered interview question</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
