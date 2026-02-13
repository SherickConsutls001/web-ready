import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, DollarSign, Users, Award, TrendingUp, Globe, CheckCircle, Shield, Star } from "lucide-react";
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
      {/* Hero Section - Upwork Style */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_zaworkplace/artifacts/9povp91m_full-shot-man-working-outdoors.jpg"
            alt="Remote work freedom"
            className="w-full h-full object-cover object-center-right"
            style={{ objectPosition: '65% center' }}
          />
          {/* Gradient Overlay - Left Side */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-outfit text-white mb-6 leading-tight" data-testid="hero-heading">
                Hire Top South African Talent for Remote, Freelance, and Full-Time Work
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
                Connect with skilled professionals trusted by global companies. Scale your team faster and reduce hiring costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/hire-talent" data-testid="hero-hire-button">
                  <Button className="bg-[#14A800] hover:bg-[#14A800]/90 text-white font-semibold rounded-full px-10 py-7 text-lg shadow-xl">
                    Hire Talent
                  </Button>
                </Link>
                <Link to="/find-work" data-testid="hero-find-work-button">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-10 py-7 text-lg">
                    Find Work
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Show less gradient for better image visibility */}
        <style jsx>{`
          @media (max-width: 768px) {
            .object-center-right {
              object-position: center center;
            }
          }
        `}</style>
      </section>

      {/* Why Hire South African Talent */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-4" data-testid="why-sa-heading">
              Why Businesses Around the World Hire South African Professionals
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              South Africa has become a global hub for highly skilled, English-speaking professionals across technology, customer support, recruiting, finance, and creative industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-slate-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-saflag-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-saflag-blue" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Fluent English Communication</h3>
                <p className="text-slate-600">
                  Work with professionals who communicate clearly and effectively in English, ensuring seamless collaboration.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-saflag-gold/10 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-saflag-gold" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Competitive Rates</h3>
                <p className="text-slate-600">
                  Competitive rates compared to US, UK, and Europe while maintaining exceptional quality standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-saflag-green/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-saflag-green" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Highly Skilled Professionals</h3>
                <p className="text-slate-600">
                  Access world-class talent with strong work ethic and high-quality skills across all industries.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-saflag-red/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-saflag-red" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Reliable Workforce</h3>
                <p className="text-slate-600">
                  Professional and dependable talent committed to delivering quality results on time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-saflag-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-saflag-blue" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Time Zone Compatible</h3>
                <p className="text-slate-600">
                  Perfect overlap with Europe and workable hours with US, enabling real-time collaboration.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-saflag-green/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-saflag-green" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Cost-Effective Solutions</h3>
                <p className="text-slate-600">
                  Scale your business efficiently with high-quality talent at competitive rates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Two Main Categories - Professional Services Only */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-4">
              Find the Right Talent for Any Job
            </h2>
            <p className="text-lg text-slate-600">Hire skilled South African professionals for your business needs</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 flex flex-col h-full text-center">
                <div className="w-16 h-16 bg-saflag-blue/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Briefcase className="w-8 h-8 text-saflag-blue" />
                </div>
                <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-4">Professional Services</h3>
                <p className="text-slate-600 mb-6 text-lg leading-relaxed flex-grow">
                  Hire experienced developers, designers, recruiters, virtual assistants, accountants, customer support agents, and other professionals for remote freelance, contract, or full-time roles.
                </p>
                <Link to="/categories" className="mt-auto">
                  <Button className="bg-saflag-blue hover:bg-saflag-blue/90 text-white rounded-lg w-full py-3 text-base">
                    Explore Professional Talent
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">Simple, secure, and efficient hiring process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-saflag-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-saflag-blue">1</span>
              </div>
              <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-3">Post a Job</h3>
              <p className="text-slate-600">
                Describe your job and receive applications from qualified professionals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-saflag-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-saflag-green">2</span>
              </div>
              <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-3">Hire the Best Talent</h3>
              <p className="text-slate-600">
                Review profiles, compare candidates, and hire confidently.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-saflag-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-saflag-gold">3</span>
              </div>
              <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-3">Pay Securely</h3>
              <p className="text-slate-600">
                Pay through the platform with secure payment protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Protection Notice */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-saflag-blue to-saflag-green text-white rounded-2xl p-8 md:p-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold font-outfit mb-4">Trusted, Secure, and Reliable</h3>
                <p className="text-blue-100 mb-6 text-lg">All payments secured through escrow, communication monitored for safety, and comprehensive dispute resolution.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Verified Professionals</h4>
                      <p className="text-sm text-blue-100">All profiles verified for authenticity</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Secure Payment System</h4>
                      <p className="text-sm text-blue-100">Escrow protection for all transactions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Transparent Reviews</h4>
                      <p className="text-sm text-blue-100">Real ratings from verified clients</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Reliable Hiring Process</h4>
                      <p className="text-sm text-blue-100">Professional support throughout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Professionals */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-6">
            Access Global Job Opportunities
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Create your professional profile, showcase your skills, and connect with companies worldwide looking to hire skilled South African talent.
          </p>
          <Link to="/login?type=signup">
            <Button className="bg-saflag-green hover:bg-saflag-green/90 text-white rounded-full px-12 py-6 text-lg shadow-lg">
              Create Your Profile
            </Button>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-saflag-blue via-saflag-green to-saflag-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6 text-white">
            Start Hiring or Find Work Today
          </h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of businesses and professionals on SkillBridge</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/hire-talent" data-testid="cta-hire-talent">
              <Button className="bg-white text-saflag-blue hover:bg-slate-100 rounded-full px-10 py-6 text-lg shadow-lg">
                Hire Talent
              </Button>
            </Link>
            <Link to="/find-work" data-testid="cta-find-work">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-10 py-6 text-lg">
                Find Work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
