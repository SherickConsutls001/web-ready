import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, DollarSign, Briefcase, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function FindWork({ user }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    job_type: "",
    budget_type: ""
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.location) params.append("location", filters.location);
      if (filters.job_type) params.append("job_type", filters.job_type);
      if (filters.budget_type) params.append("budget_type", filters.budget_type);

      const response = await axios.get(`${API}/jobs?${params.toString()}`);
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Layout user={user}>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-4" data-testid="find-work-heading">
              Find Work
            </h1>
            <p className="text-lg text-slate-600">Browse available jobs and opportunities</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div data-testid="filter-category">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="handy_work">Handy Work</SelectItem>
                      <SelectItem value="professional_services">Professional Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div data-testid="filter-location">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <Input
                    placeholder="City or region"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                <div data-testid="filter-job-type">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
                  <Select value={filters.job_type} onValueChange={(value) => setFilters({ ...filters, job_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div data-testid="filter-budget-type">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Budget Type</label>
                  <Select value={filters.budget_type} onValueChange={(value) => setFilters({ ...filters, budget_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12" data-testid="loading-state">
                <p className="text-slate-600">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12" data-testid="no-jobs-state">
                <p className="text-slate-600">No jobs found. Try adjusting your filters.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)} data-testid={`job-card-${job.id}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold font-outfit text-slate-900 mb-2" data-testid="job-title">{job.title}</h3>
                        <p className="text-slate-600 mb-3 line-clamp-2">{job.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills_required.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="bg-blue-50 text-primary px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary" data-testid="job-budget">
                          R{job.budget_amount}
                        </div>
                        <div className="text-sm text-slate-500">{job.budget_type}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center" data-testid="job-location">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center" data-testid="job-type">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.job_type}
                      </div>
                      <div className="flex items-center" data-testid="job-category">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.category.replace("_", " ")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
