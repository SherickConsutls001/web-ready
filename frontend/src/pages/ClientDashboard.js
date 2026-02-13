import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Briefcase, Users, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ClientDashboard({ user }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    company_name: "",
    industry: "",
    company_size: "",
    location: "",
    website: ""
  });

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    category: "professional_services",
    subcategory: "",
    budget_type: "hourly",
    budget_amount: "",
    location: "",
    job_type: "remote",
    skills_required: ""
  });

  useEffect(() => {
    if (!user || user.user_type !== "client") {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchJobs();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/clients/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setShowProfileDialog(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/jobs/client/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API}/clients/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setShowProfileDialog(false);
      toast.success("Profile created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create profile");
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...jobData,
        budget_amount: parseFloat(jobData.budget_amount),
        skills_required: jobData.skills_required.split(",").map(s => s.trim())
      };
      await axios.post(`${API}/jobs`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowJobDialog(false);
      toast.success("Job posted successfully!");
      fetchJobs();
      setJobData({
        title: "",
        description: "",
        category: "professional_services",
        subcategory: "",
        budget_type: "hourly",
        budget_amount: "",
        location: "",
        job_type: "remote",
        skills_required: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to post job");
    }
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold font-outfit text-slate-900 mb-2" data-testid="dashboard-heading">
                Client Dashboard
              </h1>
              <p className="text-lg text-slate-600">Welcome back, {user?.full_name}</p>
            </div>
            <Button
              onClick={() => setShowJobDialog(true)}
              className="bg-primary hover:bg-primary/90 text-white rounded-full"
              data-testid="post-job-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post a Job
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-slate-900" data-testid="active-jobs-count">{jobs.filter(j => j.status === "open").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Jobs Posted</p>
                    <p className="text-2xl font-bold text-slate-900" data-testid="total-jobs-count">{jobs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Subscription</p>
                    <p className="text-2xl font-bold text-slate-900">{profile?.subscription_plan || "Free"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs List */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold font-outfit mb-4" data-testid="my-jobs-heading">My Jobs</h2>
              {jobs.length === 0 ? (
                <p className="text-slate-600 text-center py-8" data-testid="no-jobs-message">No jobs posted yet. Click "Post a Job" to get started!</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-slate-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)} data-testid={`job-item-${job.id}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3>
                          <p className="text-slate-600 text-sm mb-2 line-clamp-2">{job.description}</p>
                          <div className="flex gap-2">
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{job.category.replace("_", " ")}</span>
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{job.job_type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">R{job.budget_amount}</div>
                          <div className="text-sm text-slate-500">{job.budget_type}</div>
                          <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === "open" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            {job.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-md" data-testid="profile-dialog">
          <DialogHeader>
            <DialogTitle>Create Company Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input id="company_name" required value={profileData.company_name} onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })} data-testid="input-company-name" />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" required value={profileData.industry} onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })} data-testid="input-industry" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" required value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} data-testid="input-location" />
            </div>
            <div>
              <Label htmlFor="company_size">Company Size</Label>
              <Input id="company_size" value={profileData.company_size} onChange={(e) => setProfileData({ ...profileData, company_size: e.target.value })} data-testid="input-company-size" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} data-testid="input-website" />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" data-testid="submit-profile-button">Create Profile</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Job Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="job-dialog">
          <DialogHeader>
            <DialogTitle>Post a New Job</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" required value={jobData.title} onChange={(e) => setJobData({ ...jobData, title: e.target.value })} data-testid="input-job-title" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" required rows={4} value={jobData.description} onChange={(e) => setJobData({ ...jobData, description: e.target.value })} data-testid="input-job-description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={jobData.category} onValueChange={(value) => setJobData({ ...jobData, category: value })}>
                  <SelectTrigger data-testid="select-job-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="handy_work">Handy Work</SelectItem>
                    <SelectItem value="professional_services">Professional Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input id="subcategory" required value={jobData.subcategory} onChange={(e) => setJobData({ ...jobData, subcategory: e.target.value })} data-testid="input-job-subcategory" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget_type">Budget Type</Label>
                <Select value={jobData.budget_type} onValueChange={(value) => setJobData({ ...jobData, budget_type: value })}>
                  <SelectTrigger data-testid="select-budget-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget_amount">Budget Amount (ZAR)</Label>
                <Input id="budget_amount" type="number" required value={jobData.budget_amount} onChange={(e) => setJobData({ ...jobData, budget_amount: e.target.value })} data-testid="input-budget-amount" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job_type">Job Type</Label>
                <Select value={jobData.job_type} onValueChange={(value) => setJobData({ ...jobData, job_type: value })}>
                  <SelectTrigger data-testid="select-job-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" required value={jobData.location} onChange={(e) => setJobData({ ...jobData, location: e.target.value })} data-testid="input-job-location" />
              </div>
            </div>
            <div>
              <Label htmlFor="skills_required">Skills Required (comma-separated)</Label>
              <Input id="skills_required" required value={jobData.skills_required} onChange={(e) => setJobData({ ...jobData, skills_required: e.target.value })} placeholder="e.g. React, Node.js, Python" data-testid="input-skills-required" />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" data-testid="submit-job-button">Post Job</Button>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
