import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"type" | "details">("type");
  const [userType, setUserType] = useState<"individual" | "business" | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    // Check if user already has a profile
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        navigate("/dashboard");
      }
    };

    checkProfile();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!userType || !formData.fullName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (userType === "business" && !formData.businessName) {
      toast({
        title: "Missing information",
        description: "Business name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        user_type: userType,
        full_name: formData.fullName,
        business_name: userType === "business" ? formData.businessName : null,
        phone_number: formData.phoneNumber || null,
      });

      if (error) throw error;

      toast({
        title: "Profile created!",
        description: "Welcome to TaxBuddy",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === "type") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome to TaxBuddy</h1>
            <p className="text-muted-foreground">Let's set up your account</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card
              className="cursor-pointer transition-all hover:shadow-strong hover:-translate-y-1 border-2 hover:border-primary"
              onClick={() => {
                setUserType("individual");
                setStep("details");
              }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Individual</CardTitle>
                <CardDescription>
                  Track personal income and expenses for tax compliance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all hover:shadow-strong hover:-translate-y-1 border-2 hover:border-secondary"
              onClick={() => {
                setUserType("business");
                setStep("details");
              }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>Small Business</CardTitle>
                <CardDescription>
                  Manage business revenue, expenses, and tax obligations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            {userType === "individual"
              ? "Tell us a bit about yourself"
              : "Tell us about your business"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          {userType === "business" && (
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+234 XXX XXX XXXX"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setStep("type")}
              disabled={loading}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Creating..." : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
