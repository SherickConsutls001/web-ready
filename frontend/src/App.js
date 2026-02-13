import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Homepage from "@/pages/Homepage";
import FindWork from "@/pages/FindWork";
import HireTalent from "@/pages/HireTalent";
import Categories from "@/pages/Categories";
import Pricing from "@/pages/Pricing";
import Login from "@/pages/Login";
import ClientDashboard from "@/pages/ClientDashboard";
import WorkerDashboard from "@/pages/WorkerDashboard";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import JobDetails from "@/pages/JobDetails";
import WorkerDetails from "@/pages/WorkerDetails";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage user={user} />} />
          <Route path="/find-work" element={<FindWork user={user} />} />
          <Route path="/hire-talent" element={<HireTalent user={user} />} />
          <Route path="/categories" element={<Categories user={user} />} />
          <Route path="/pricing" element={<Pricing user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/client-dashboard" element={<ClientDashboard user={user} />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard user={user} />} />
          <Route path="/contact" element={<Contact user={user} />} />
          <Route path="/about" element={<About user={user} />} />
          <Route path="/jobs/:jobId" element={<JobDetails user={user} />} />
          <Route path="/workers/:workerId" element={<WorkerDetails user={user} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
