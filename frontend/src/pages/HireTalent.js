import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, DollarSign, Award, Star } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function HireTalent({ user }) {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    skills: "",
    location: ""
  });

  useEffect(() => {
    fetchWorkers();
  }, [filters]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.skills) params.append("skills", filters.skills);
      if (filters.location) params.append("location", filters.location);

      const response = await axios.get(`${API}/workers?${params.toString()}`);
      setWorkers(response.data);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <Layout user={user}>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-4" data-testid="hire-talent-heading">
              Hire Talent
            </h1>
            <p className="text-lg text-slate-600">Find and hire skilled South African professionals</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div data-testid="filter-skills">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                  <Input
                    placeholder="e.g. React, Plumbing"
                    value={filters.skills}
                    onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                  />
                </div>

                <div data-testid="filter-location">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <Input
                    placeholder="City or region"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Worker Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12" data-testid="loading-state">
                <p className="text-slate-600">Loading workers...</p>
              </div>
            ) : workers.length === 0 ? (
              <div className="col-span-full text-center py-12" data-testid="no-workers-state">
                <p className="text-slate-600">No workers found. Try adjusting your filters.</p>
              </div>
            ) : (
              workers.map((worker) => (
                <Card key={worker.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => navigate(`/workers/${worker.id}`)} data-testid={`worker-card-${worker.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center mb-4">
                      <Avatar className="w-20 h-20 mb-3">
                        <AvatarImage src={worker.avatar_url} />
                        <AvatarFallback className="bg-primary text-white text-xl">{worker.title.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold font-outfit text-slate-900 mb-1" data-testid="worker-title">{worker.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{worker.category.replace("_", " ")}</p>
                      <div className="flex items-center text-slate-600 text-sm mb-3" data-testid="worker-location">
                        <MapPin className="w-4 h-4 mr-1" />
                        {worker.location}
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{worker.bio}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {worker.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <div className="text-sm text-slate-500">Hourly Rate</div>
                        <div className="text-xl font-bold text-primary" data-testid="worker-rate">R{worker.hourly_rate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Experience</div>
                        <div className="text-lg font-semibold text-slate-900">{worker.experience_years}+ yrs</div>
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
