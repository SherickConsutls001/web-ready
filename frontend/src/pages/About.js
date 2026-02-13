import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, DollarSign, Award, TrendingUp, Users, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function About({ user }) {
  return (
    <Layout user={user}>
      <div className="bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold font-outfit text-slate-900 mb-6" data-testid="about-heading">
                About SkillBridge
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Connecting South Africa's exceptional talent with global opportunities. We bridge the gap between skilled professionals and businesses seeking quality, cost-effective solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold font-outfit text-slate-900 mb-6" data-testid="mission-heading">
                  Our Mission
                </h2>
                <p className="text-lg text-slate-600 mb-4">
                  SkillBridge was founded with a clear vision: to position South Africa as a global talent hub and create meaningful employment opportunities for skilled professionals.
                </p>
                <p className="text-lg text-slate-600 mb-4">
                  We believe in the power of South African talent - from the skilled tradesperson fixing homes to the software developer building the future. Our platform connects these professionals with clients worldwide who value quality, reliability, and competitive pricing.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1577948000111-9c970dfe3743?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHxkaXZlcnNlJTIwc291dGglMjBhZnJpY2FuJTIwcHJvZmVzc2lvbmFscyUyMG9mZmljZSUyMG1lZXRpbmd8ZW58MHx8fHwxNzcwOTkzMDQ0fDA&ixlib=rb-4.1.0&q=85"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-outfit text-slate-900 mb-4" data-testid="values-heading">
                Why South Africa?
              </h2>
              <p className="text-lg text-slate-600">The advantages that make South African talent stand out globally</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">English Proficiency</h3>
                  <p className="text-slate-600">
                    South Africa has one of the highest English proficiency rates in Africa, ensuring seamless communication with international clients.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Competitive Rates</h3>
                  <p className="text-slate-600">
                    Enjoy 40-60% cost savings compared to Western markets while maintaining exceptional quality standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Highly Skilled</h3>
                  <p className="text-slate-600">
                    World-class education system producing talented professionals across all industries and skill levels.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Perfect Time Zone</h3>
                  <p className="text-slate-600">
                    GMT+2 timezone offers ideal overlap with European business hours and workable overlap with the US.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Diverse Talent Pool</h3>
                  <p className="text-slate-600">
                    Access professionals from handymen to software engineers, all vetted and ready to work.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">Strong Work Ethic</h3>
                  <p className="text-slate-600">
                    Dedicated professionals committed to delivering quality results and building long-term relationships.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6" data-testid="cta-heading">
              Ready to Work with South African Talent?
            </h2>
            <p className="text-xl mb-8 text-blue-100">Join thousands of businesses and professionals on SkillBridge</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hire-talent" data-testid="cta-hire-button">
                <Button className="bg-white text-primary hover:bg-slate-100 rounded-full px-8 py-6 text-lg shadow-lg">
                  Hire Talent
                </Button>
              </Link>
              <Link to="/find-work" data-testid="cta-find-work-button">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
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
