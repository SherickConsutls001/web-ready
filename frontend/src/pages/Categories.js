import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export default function Categories({ user }) {
  const handyWorkCategories = [
    { name: "Plumber", icon: "🔧" },
    { name: "Electrician", icon: "⚡" },
    { name: "Cleaner", icon: "🧹" },
    { name: "Mover", icon: "📦" },
    { name: "Handyman", icon: "🔨" },
    { name: "Gardener", icon: "🌱" },
    { name: "Painter", icon: "🎨" },
    { name: "Carpenter", icon: "🪚" }
  ];

  const professionalCategories = [
    { name: "Software Developer", icon: "💻" },
    { name: "Designer", icon: "🎨" },
    { name: "Virtual Assistant", icon: "📋" },
    { name: "Accountant", icon: "💰" },
    { name: "Recruiter", icon: "👥" },
    { name: "Customer Support", icon: "🎧" },
    { name: "Marketing", icon: "📈" },
    { name: "Writer", icon: "✍️" }
  ];

  return (
    <Layout user={user}>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-4" data-testid="categories-heading">
              Browse by Category
            </h1>
            <p className="text-lg text-slate-600">Find the perfect professional for your needs</p>
          </div>

          {/* Handy Work Section */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                <Wrench className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-outfit text-slate-900" data-testid="handy-work-heading">Handy Work</h2>
                <p className="text-slate-600">Local services for your everyday needs</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {handyWorkCategories.map((category, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" data-testid={`category-${category.name.toLowerCase().replace(" ", "-")}`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-slate-900">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Professional Services Section */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-outfit text-slate-900" data-testid="professional-services-heading">Professional Services</h2>
                <p className="text-slate-600">Skilled professionals for your business</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {professionalCategories.map((category, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" data-testid={`category-${category.name.toLowerCase().replace(" ", "-")}`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-slate-900">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/hire-talent">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg" data-testid="find-talent-button">
                Find Talent Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
