import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Briefcase, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function WorkerDashboard({ user }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    title: "",
    bio: "",
    skills: "",
    hourly_rate: "",
    experience_years: "",
    location: "",
    category: "professional_services",
    portfolio_links: ""
  });

  useEffect(() => {
    if (!user || user.user_type !== "worker") {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchApplications();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/workers/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setProfileData({
        title: response.data.title,
        bio: response.data.bio,
        skills: response.data.skills.join(", "),
        hourly_rate: response.data.hourly_rate.toString(),
        experience_years: response.data.experience_years.toString(),
        location: response.data.location,
        category: response.data.category,
        portfolio_links: response.data.portfolio_links.join(", ")
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setShowProfileDialog(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...profileData,
        hourly_rate: parseFloat(profileData.hourly_rate),
        experience_years: parseInt(profileData.experience_years),
        skills: profileData.skills.split(",").map(s => s.trim()),
        portfolio_links: profileData.portfolio_links ? profileData.portfolio_links.split(",").map(s => s.trim()) : []
      };
      
      const method = profile ? "put" : "post";
      const response = await axios[method](`${API}/workers/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(response.data);
      setShowProfileDialog(false);
      toast.success(profile ? "Profile updated successfully!" : "Profile created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save profile");
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
                Worker Dashboard
              </h1>
              <p className="text-lg text-slate-600">Welcome back, {user?.full_name}</p>
            </div>
            {profile && (
              <Button
                onClick={() => setShowProfileDialog(true)}
                variant="outline"
                className="border-primary text-primary"
                data-testid="edit-profile-button"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              {profile ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarFallback className="bg-primary text-white text-2xl">
                          {profile.title.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-1" data-testid="profile-title">{profile.title}</h2>
                      <p className="text-slate-600 mb-2">{profile.category.replace("_", " ")}</p>
                      <p className="text-sm text-slate-500">{profile.location}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-600">Hourly Rate</span>
                        <span className="font-bold text-primary" data-testid="profile-rate">R{profile.hourly_rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Experience</span>
                        <span className="font-bold text-slate-900">{profile.experience_years}+ years</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, idx) => (
                          <span key={idx} className="bg-blue-50 text-primary px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-600 mb-4">Create your profile to start applying for jobs</p>
                    <Button onClick={() => setShowProfileDialog(true)} className="bg-primary hover:bg-primary/90 text-white" data-testid="create-profile-button">
                      Create Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Applications and Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Applications</p>
                        <p className="text-xl font-bold text-slate-900" data-testid="total-applications-count">{applications.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Pending</p>
                        <p className="text-xl font-bold text-slate-900" data-testid="pending-applications-count">{applications.filter(a => a.status === "pending").length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                        <CheckCircle className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Accepted</p>
                        <p className="text-xl font-bold text-slate-900" data-testid="accepted-applications-count">{applications.filter(a => a.status === "accepted").length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold font-outfit mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button onClick={() => navigate("/find-work")} className="bg-primary hover:bg-primary/90 text-white" data-testid="browse-jobs-button">
                      Browse Jobs
                    </Button>
                    <Button onClick={() => setShowProfileDialog(true)} variant="outline" className="border-primary text-primary" data-testid="update-profile-button">
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Applications List */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold font-outfit mb-4" data-testid="my-applications-heading">My Applications</h2>
                  {applications.length === 0 ? (
                    <p className="text-slate-600 text-center py-8" data-testid="no-applications-message">No applications yet. Start browsing jobs!</p>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app) => (
                        <div key={app.id} className="border border-slate-100 rounded-lg p-4" data-testid={`application-item-${app.id}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm text-slate-500 mb-1">Job ID: {app.job_id}</p>
                              <p className="text-slate-900 font-medium mb-2">Proposed Rate: R{app.proposed_rate}</p>
                              <p className="text-slate-600 text-sm line-clamp-2">{app.cover_letter}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              app.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              app.status === "accepted" ? "bg-green-100 text-green-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {app.status}
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
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="profile-dialog">
          <DialogHeader>
            <DialogTitle>{profile ? "Edit Profile" : "Create Profile"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <Label htmlFor="title">Professional Title</Label>
              <Input id="title" required value={profileData.title} onChange={(e) => setProfileData({ ...profileData, title: e.target.value })} placeholder="e.g. Senior Software Developer" data-testid="input-title" />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" required rows={4} value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} placeholder="Tell us about yourself..." data-testid="input-bio" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={profileData.category} onValueChange={(value) => setProfileData({ ...profileData, category: value })}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="handy_work">Handy Work</SelectItem>
                    <SelectItem value="professional_services">Professional Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" required value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} placeholder="City, Country" data-testid="input-location" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourly_rate">Hourly Rate (ZAR)</Label>
                <Input id="hourly_rate" type="number" required value={profileData.hourly_rate} onChange={(e) => setProfileData({ ...profileData, hourly_rate: e.target.value })} data-testid="input-hourly-rate" />
              </div>
              <div>
                <Label htmlFor="experience_years">Years of Experience</Label>
                <Input id="experience_years" type="number" required value={profileData.experience_years} onChange={(e) => setProfileData({ ...profileData, experience_years: e.target.value })} data-testid="input-experience" />
              </div>
            </div>
            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input id="skills" required value={profileData.skills} onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })} placeholder="e.g. React, Node.js, Python" data-testid="input-skills" />
            </div>
            <div>
              <Label htmlFor="portfolio_links">Portfolio Links (comma-separated, optional)</Label>
              <Input id="portfolio_links" value={profileData.portfolio_links} onChange={(e) => setProfileData({ ...profileData, portfolio_links: e.target.value })} placeholder="https://github.com/username, https://portfolio.com" data-testid="input-portfolio" />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" data-testid="submit-profile-button">{profile ? "Update Profile" : "Create Profile"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
