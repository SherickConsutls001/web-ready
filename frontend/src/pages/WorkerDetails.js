import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Award, Briefcase, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function WorkerDetails({ user }) {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorker();
  }, [workerId]);

  const fetchWorker = async () => {
    try {
      const response = await axios.get(`${API}/workers/${workerId}`);
      setWorker(response.data);
    } catch (error) {
      toast.error("Failed to load worker details");
      navigate("/hire-talent");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !worker) {
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
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-shrink-0 text-center md:text-left">
                  <Avatar className="w-32 h-32 mx-auto md:mx-0 mb-4">
                    <AvatarFallback className="bg-primary text-white text-4xl">
                      {worker.title.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left">
                    <div className="text-sm text-slate-600 mb-1">Hourly Rate</div>
                    <div className="text-3xl font-bold text-primary" data-testid="worker-rate">R{worker.hourly_rate}</div>
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-bold font-outfit text-slate-900 mb-2" data-testid="worker-title">
                    {worker.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-slate-600 mb-4">
                    <div className="flex items-center" data-testid="worker-location">
                      <MapPin className="w-5 h-5 mr-2" />
                      {worker.location}
                    </div>
                    <div className="flex items-center" data-testid="worker-experience">
                      <Award className="w-5 h-5 mr-2" />
                      {worker.experience_years}+ years experience
                    </div>
                    <div className="flex items-center" data-testid="worker-category">
                      <Briefcase className="w-5 h-5 mr-2" />
                      {worker.category.replace("_", " ")}
                    </div>
                  </div>
                  {user?.user_type === "client" && (
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-full" data-testid="contact-worker-button">
                      Contact Worker
                    </Button>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8 mb-8">
                <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-4">About</h2>
                <p className="text-slate-600 leading-relaxed" data-testid="worker-bio">{worker.bio}</p>
              </div>

              <div className="border-t border-slate-100 pt-8 mb-8">
                <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-3" data-testid="worker-skills">
                  {worker.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 text-primary px-4 py-2 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {worker.portfolio_links && worker.portfolio_links.length > 0 && (
                <div className="border-t border-slate-100 pt-8">
                  <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-4">Portfolio</h2>
                  <div className="space-y-2" data-testid="worker-portfolio">
                    {worker.portfolio_links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
