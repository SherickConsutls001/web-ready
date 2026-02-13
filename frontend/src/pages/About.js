import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Users, Target, Award, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function About({ user }) {
  return (
    <Layout user={user}>
      <div className="bg-slate-50">
        {/* Hero Section with Image */}
        <section className="relative bg-gradient-to-br from-saflag-blue to-saflag-green py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-5xl md:text-6xl font-bold font-outfit mb-6" data-testid="about-heading">
                  About TalentBridge
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Connecting South Africa's exceptional talent with global opportunities.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://customer-assets.emergentagent.com/job_zaworkplace/artifacts/h9e4hsuc_About%20Page.jpg"
                  alt="SkillBridge team"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main About Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-700 leading-relaxed mb-6">
                TalentBridge is a South Africa-based freelance and hiring marketplace built to connect skilled South African professionals with businesses around the world.
              </p>
              
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Our mission is to create economic opportunities by helping companies access world-class talent while empowering South African professionals to access global job opportunities.
              </p>

              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                We believe South Africa has one of the most talented, reliable, and professional workforces in the world. Our platform makes it easy for businesses to hire trusted professionals for freelance, contract, and full-time roles.
              </p>

              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                We serve both local and international clients by providing access to professionals across multiple industries including technology, customer support, recruiting, design, finance, and more.
              </p>
            </div>
          </div>
        </section>

        {/* What We Provide */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-outfit text-slate-900 mb-4">
                What We Provide
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-saflag-blue/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-saflag-blue" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">
                    Access to Verified South African Professionals
                  </h3>
                  <p className="text-slate-600">
                    Connect with pre-vetted, skilled professionals across all major industries and skill sets.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-saflag-green/10 rounded-full flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-saflag-green" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">
                    Secure Hiring and Payment Process
                  </h3>
                  <p className="text-slate-600">
                    Escrow payment protection, secure contracts, and dispute resolution to protect both parties.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-saflag-gold/10 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-saflag-gold" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">
                    Transparent Ratings and Reviews
                  </h3>
                  <p className="text-slate-600">
                    Real feedback from verified clients helps you make informed hiring decisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-saflag-red/10 rounded-full flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-saflag-red" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">
                    Opportunities for Professionals to Work Globally
                  </h3>
                  <p className="text-slate-600">
                    South African professionals can access international job opportunities and build global careers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card className="border-2 border-saflag-blue">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-saflag-blue/10 rounded-full flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-saflag-blue" />
                  </div>
                  <h2 className="text-3xl font-bold font-outfit text-slate-900 mb-4">Our Vision</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    To become the leading global platform for hiring South African talent.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-saflag-green">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-saflag-green/10 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-saflag-green" />
                  </div>
                  <h2 className="text-3xl font-bold font-outfit text-slate-900 mb-4">Our Mission</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    To connect talent with opportunity and empower professionals and businesses worldwide.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-saflag-blue to-saflag-green text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6" data-testid="cta-heading">
              Join Our Growing Community
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Whether you're looking to hire or seeking opportunities, SkillBridge is your trusted partner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hire-talent" data-testid="cta-hire-button">
                <Button className="bg-white text-saflag-blue hover:bg-slate-100 rounded-full px-10 py-6 text-lg shadow-lg">
                  Hire Talent
                </Button>
              </Link>
              <Link to="/find-work" data-testid="cta-find-work-button">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-10 py-6 text-lg">
                  Find Work
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
