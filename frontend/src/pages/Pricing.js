import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Pricing({ user }) {
  const [pricingData, setPricingData] = useState(null);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const response = await axios.get(`${API}/pricing/plans`);
      setPricingData(response.data);
    } catch (error) {
      console.error("Failed to fetch pricing:", error);
    }
  };

  if (!pricingData) return null;

  return (
    <Layout user={user}>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-outfit text-slate-900 mb-4" data-testid="pricing-heading">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-slate-600">Choose the plan that works best for you</p>
          </div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingData.plans.map((plan, idx) => (
              <Card key={idx} className={`hover:shadow-xl transition-all duration-300 ${plan.name === "Professional" ? "border-2 border-primary" : ""}`} data-testid={`plan-${plan.name.toLowerCase()}`}>
                <CardContent className="p-8">
                  {plan.name === "Professional" && (
                    <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-primary">{plan.price === 0 ? "Free" : `R${plan.price}`}</span>
                    {plan.price > 0 && <span className="text-slate-600">/month</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start">
                        <Check className="w-5 h-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/login">
                    <Button className={`w-full rounded-full ${plan.name === "Professional" ? "bg-primary hover:bg-primary/90 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`} data-testid={`select-plan-${plan.name.toLowerCase()}`}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Commission Structure */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-16">
            <h2 className="text-3xl font-bold font-outfit text-slate-900 mb-6 text-center" data-testid="commission-heading">
              Commission Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-slate-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3" data-testid="transaction-fee-heading">Transaction Commission</h3>
                  <p className="text-3xl font-bold text-primary mb-3">{pricingData.commission.transaction_fee}</p>
                  <p className="text-slate-600">We charge a small commission on each completed job payment to maintain the platform and provide support.</p>
                </CardContent>
              </Card>
              <Card className="border-slate-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3" data-testid="placement-fee-heading">Full-Time Placement Fee</h3>
                  <p className="text-3xl font-bold text-primary mb-3">{pricingData.commission.placement_fee}</p>
                  <p className="text-slate-600">For permanent hires, we charge a one-time recruitment fee based on the candidate's first year salary.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold font-outfit mb-4" data-testid="featured-services-heading">Featured Listings & Profile Boosting</h2>
            <p className="text-lg text-blue-100 mb-6">Want more visibility? Feature your job posts or boost your worker profile for better reach</p>
            <Link to="/contact">
              <Button className="bg-white text-primary hover:bg-slate-100 rounded-full px-8 py-3" data-testid="contact-sales-button">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
