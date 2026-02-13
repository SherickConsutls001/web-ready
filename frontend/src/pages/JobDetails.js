import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MapPin, DollarSign, Briefcase, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function JobDetails({ user }) {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: "",
    proposed_rate: ""
  });

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`${API}/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      toast.error("Failed to load job details");
      navigate("/find-work");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!user || user.user_type !== "worker") {
      toast.error("Please login as a worker to apply");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        job_id: jobId,
        cover_letter: applicationData.cover_letter,
        proposed_rate: parseFloat(applicationData.proposed_rate)
      };
      
      await axios.post(`${API}/applications`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Application submitted successfully!");
      setShowApplyDialog(false);
      setApplicationData({ cover_letter: "", proposed_rate: "" });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to submit application");
    }
  };

  if (loading || !job) {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold font-outfit text-slate-900 mb-4" data-testid="job-title">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-slate-600">
                  <div className="flex items-center" data-testid="job-location">
                    <MapPin className="w-5 h-5 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center" data-testid="job-type">
                    <Briefcase className="w-5 h-5 mr-2" />
                    {job.job_type}
                  </div>
                  <div className="flex items-center" data-testid="job-posted">
                    <Calendar className="w-5 h-5 mr-2" />
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="border-t border-b border-slate-100 py-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Budget</p>
                    <p className="text-2xl font-bold text-primary" data-testid="job-budget">R{job.budget_amount}</p>
                    <p className="text-sm text-slate-500">{job.budget_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Category</p>
                    <p className="text-lg font-semibold text-slate-900">{job.category.replace("_", " ")}</p>
                    <p className="text-sm text-slate-500">{job.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === "open" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                    }`} data-testid="job-status">
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-3">Description</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap" data-testid="job-description">{job.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2" data-testid="job-skills">
                  {job.skills_required.map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 text-primary px-4 py-2 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {user?.user_type === "worker" && job.status === "open" && (
                <Button
                  onClick={() => setShowApplyDialog(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-6 text-lg"
                  data-testid="apply-button"
                >
                  Apply for this Job
                </Button>
              )}

              {!user && job.status === "open" && (
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-6 text-lg"
                  data-testid="login-to-apply-button"
                >
                  Login to Apply
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-lg" data-testid="apply-dialog">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <Label htmlFor="cover_letter">Cover Letter</Label>
              <Textarea
                id="cover_letter"
                required
                rows={6}
                value={applicationData.cover_letter}
                onChange={(e) => setApplicationData({ ...applicationData, cover_letter: e.target.value })}
                placeholder="Tell the client why you're the best fit for this job..."
                data-testid="input-cover-letter"
              />
            </div>
            <div>
              <Label htmlFor="proposed_rate">Your Proposed Rate (ZAR)</Label>
              <Input
                id="proposed_rate"
                type="number"
                required
                value={applicationData.proposed_rate}
                onChange={(e) => setApplicationData({ ...applicationData, proposed_rate: e.target.value })}
                placeholder="Enter your rate"
                data-testid="input-proposed-rate"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" data-testid="submit-application-button">
              Submit Application
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
