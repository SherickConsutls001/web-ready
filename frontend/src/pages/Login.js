import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("type") === "signup");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    user_type: "worker"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignup ? "/auth/register" : "/auth/login";
      const payload = isSignup ? formData : { email: formData.email, password: formData.password };
      
      const response = await axios.post(`${API}${endpoint}`, payload);
      
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      
      toast.success(isSignup ? "Account created successfully!" : "Welcome back!");
      
      setTimeout(() => {
        if (response.data.user.user_type === "client") {
          navigate("/client-dashboard");
        } else {
          navigate("/worker-dashboard");
        }
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={null}>
      <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-outfit text-slate-900 mb-2" data-testid="login-heading">
                  {isSignup ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="text-slate-600">
                  {isSignup ? "Join SkillBridge today" : "Login to your account"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <>
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        data-testid="input-full-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user_type">I am a</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, user_type: "worker" })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.user_type === "worker"
                              ? "border-primary bg-blue-50 text-primary"
                              : "border-slate-200 text-slate-700"
                          }`}
                          data-testid="user-type-worker"
                        >
                          Worker
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, user_type: "client" })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.user_type === "client"
                              ? "border-primary bg-blue-50 text-primary"
                              : "border-slate-200 text-slate-700"
                          }`}
                          data-testid="user-type-client"
                        >
                          Client
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    data-testid="input-password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-6"
                  disabled={loading}
                  data-testid="submit-button"
                >
                  {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-primary hover:underline"
                  data-testid="toggle-auth-mode"
                >
                  {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
