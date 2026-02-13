import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Briefcase, MapPin, DollarSign, Users, Award, TrendingUp, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Homepage({ user }) {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs`);
      setFeaturedJobs(response.data.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  return (
    <Layout user={user}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold font-outfit text-slate-900 mb-6 leading-tight" data-testid="hero-heading">
                Hire Skilled <span className="text-primary">South African</span> Talent
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                Connect with South Africa's best professionals and handymen. English-speaking, cost-effective, and reliable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/hire-talent" data-testid="hero-hire-button">
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg shadow-lg">
                    Hire Talent
                  </Button>
                </Link>
                <Link to="/find-work" data-testid="hero-find-work-button">
                  <Button variant="outline" className="border-2 border-primary text-primary hover:bg-blue-50 rounded-full px-8 py-6 text-lg">
                    Find Work
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1624555130296-e551faf8969b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxtdWx0aXJhY2lhbCUyMGRpdmVyc2UlMjBwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHRlYW0lMjBjb2xsYWJvcmF0aW9uJTIwaGFwcHl8ZW58MHx8fHwxNzcwOTk3MTQ3fDA&ixlib=rb-4.1.0&q=85"
                alt="Diverse professional team collaborating"
                className="rounded-2xl shadow-2xl"
                data-testid="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-4" data-testid="categories-heading">
              Browse Talent Across All Categories
            </h2>
            <p className="text-lg text-slate-600">From local handymen to AI engineers - find the right professional for any job</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Handy Work */}
            <Card className="border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2" data-testid="handy-work-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold font-outfit mb-2">Handy Work</h3>
                <p className="text-slate-600 text-sm mb-3">Local services - Plumbers, Electricians, Cleaners, Movers</p>
                <Link to="/categories">
                  <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-green-50" size="sm">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Development & IT */}
            <Card className="border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2" data-testid="development-it-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-outfit mb-2">Development & IT</h3>
                <p className="text-slate-600 text-sm mb-3">Web, Mobile, Cloud, DevOps, Cybersecurity, Blockchain</p>
                <Link to="/categories">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-blue-50" size="sm">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* AI Services */}
            <Card className="border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2" data-testid="ai-services-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold font-outfit mb-2">AI Services</h3>
                <p className="text-slate-600 text-sm mb-3">Machine Learning, Chatbots, Generative AI, Automation</p>
                <Link to="/categories">
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-yellow-50" size="sm">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Data Science */}
            <Card className="border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold font-outfit mb-2">Data Science & Analytics</h3>
                <p className="text-slate-600 text-sm mb-3">Data Analysis, Visualization, BI, SQL</p>
                <Link to="/categories">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-blue-50" size="sm">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Design & Creative */}
            <Card className="border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-bold font-outfit mb-2">Design & Creative</h3>
                <p className="text-slate-600 text-sm mb-3">UI/UX, Graphics, Video, Animation, Branding</p>
                <Link to="/categories">
                  <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-green-50" size="sm">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Sales & Marketing */}
            <Card className="border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold font-outfit mb-2">Sales & Marketing</h3>
                <p className="text-slate-600 text-sm mb-3">Digital Marketing, SEO, Social Media, Lead Gen</p>
                <Link to="/categories">
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-yellow-50" size="sm">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link to="/categories">
              <Button variant="outline" className="border-primary text-primary hover:bg-blue-50">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why South Africa Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-4" data-testid="why-sa-heading">
              Why Choose South African Talent?
            </h2>
            <p className="text-lg text-slate-600">A global talent hub with unique advantages</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-slate-100 text-center p-6 hover:shadow-lg transition-shadow" data-testid="benefit-english">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-outfit font-semibold text-lg mb-2">English-Speaking</h3>
              <p className="text-slate-600 text-sm">Fluent English communication for seamless collaboration</p>
            </Card>

            <Card className="border-slate-100 text-center p-6 hover:shadow-lg transition-shadow" data-testid="benefit-rates">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-outfit font-semibold text-lg mb-2">Competitive Rates</h3>
              <p className="text-slate-600 text-sm">Cost-effective solutions without compromising quality</p>
            </Card>

            <Card className="border-slate-100 text-center p-6 hover:shadow-lg transition-shadow" data-testid="benefit-skilled">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-outfit font-semibold text-lg mb-2">Highly Skilled</h3>
              <p className="text-slate-600 text-sm">Talented professionals with world-class expertise</p>
            </Card>

            <Card className="border-slate-100 text-center p-6 hover:shadow-lg transition-shadow" data-testid="benefit-timezone">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-outfit font-semibold text-lg mb-2">Ideal Time Zone</h3>
              <p className="text-slate-600 text-sm">Perfect overlap with Europe and US business hours</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6" data-testid="cta-heading">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of businesses and professionals on SkillBridge</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login?type=signup" data-testid="cta-post-job">
              <Button className="bg-white text-primary hover:bg-slate-100 rounded-full px-8 py-6 text-lg shadow-lg">
                Post a Job
              </Button>
            </Link>
            <Link to="/login?type=signup" data-testid="cta-create-profile">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
                Create Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
