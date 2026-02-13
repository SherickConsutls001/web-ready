import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Brain, Database, Palette, FileText, TrendingUp, Headphones, DollarSign, Users, Scale, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categoryIcons = {
  development_it: Code,
  ai_services: Brain,
  data_science: Database,
  design_creative: Palette,
  writing_translation: FileText,
  sales_marketing: TrendingUp,
  admin_support: Headphones,
  finance_accounting: DollarSign,
  hr_training: Users,
  legal: Scale,
  engineering_architecture: Ruler
};

const categoryColors = {
  development_it: "primary",
  ai_services: "accent",
  data_science: "primary",
  design_creative: "secondary",
  writing_translation: "accent",
  sales_marketing: "primary",
  admin_support: "secondary",
  finance_accounting: "accent",
  hr_training: "primary",
  legal: "secondary",
  engineering_architecture: "accent"
};

export default function Categories({ user }) {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      // Filter out handy_work
      const { handy_work, ...professionalCategories } = response.data;
      setCategories(professionalCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (color) => {
    const colors = {
      primary: "bg-saflag-blue/10 text-saflag-blue",
      secondary: "bg-saflag-green/10 text-saflag-green",
      accent: "bg-saflag-gold/10 text-saflag-gold"
    };
    return colors[color] || colors.primary;
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div className="bg-slate-50 min-h-screen py-12 flex items-center justify-center">
          <p>Loading categories...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-4" data-testid="categories-heading">
              Browse Professional Categories
            </h1>
            <p className="text-lg text-slate-600">Find the perfect professional for your needs across all industries</p>
          </div>

          <div className="space-y-12">
            {Object.entries(categories).map(([key, category]) => {
              const Icon = categoryIcons[key];
              const colorClass = getColorClass(categoryColors[key]);
              
              return (
                <div key={key} className="mb-16">
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 ${colorClass} rounded-full flex items-center justify-center mr-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold font-outfit text-slate-900" data-testid={`category-${key}-heading`}>
                        {category.name}
                      </h2>
                      <p className="text-slate-600">{category.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                    {category.subcategories.map((subcategory, idx) => (
                      <Card key={idx} className="border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" data-testid={`subcategory-${subcategory.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                        <CardContent className="p-4 text-center">
                          <h3 className="font-semibold text-slate-900 text-sm">{subcategory}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {/* CTA for each category */}
                  <div className="text-center">
                    <Link to="/hire-talent">
                      <Button className="bg-[#14A800] hover:bg-[#14A800]/90 text-white rounded-full px-8 py-3 text-base shadow-lg" data-testid={`find-talent-${key}`}>
                        Find Talent Now
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link to="/hire-talent">
              <Button className="bg-[#14A800] hover:bg-[#14A800]/90 text-white rounded-full px-12 py-6 text-lg shadow-lg" data-testid="find-talent-button">
                Find Talent Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
