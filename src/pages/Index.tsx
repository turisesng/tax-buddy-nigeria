import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, TrendingUp, Shield, FileText, Bell, Lock } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Check if user is already logged in and redirect
    // This can be uncommented if you want automatic redirect
    // const checkAuth = async () => {
    //   const { data: { session } } = await supabase.auth.getSession();
    //   if (session) navigate("/dashboard");
    // };
    // checkAuth();
  }, [navigate]);

  const features = [
    {
      icon: Calculator,
      title: "Smart Tax Calculator",
      description: "Automatically calculate taxes based on Nigerian tax bands and the 2024 reform"
    },
    {
      icon: TrendingUp,
      title: "Income & Expense Tracking",
      description: "Monitor all your transactions with detailed categorization and insights"
    },
    {
      icon: FileText,
      title: "Compliance Reports",
      description: "Generate proof of income and tax compliance certificates instantly"
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss a filing deadline with automated notifications"
    },
    {
      icon: Shield,
      title: "Tax Guidance",
      description: "Stay updated with the latest tax reforms and exemptions"
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-primary">
                  Nigerian Tax Reform 2024 Ready
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Master Your Taxes with{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TaxBuddy
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                The smart mobile app for tracking personal and business taxes in Nigeria. 
                Stay compliant, save time, and understand your tax obligations effortlessly.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  variant="hero"
                  onClick={() => navigate("/signup-choice")}
                  className="animate-scale-in"
                >
                  Get Started Free
                  <ArrowRight className="ml-2" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="animate-scale-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  Sign In
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4 text-sm text-muted-foreground">
                <div>
                  <p className="text-2xl font-bold text-foreground">₦800k</p>
                  <p>Tax-free threshold</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p>Free to use</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
              <img 
                src={heroImage} 
                alt="TaxBuddy Dashboard" 
                className="relative rounded-2xl shadow-strong"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need for Tax Compliance
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Designed for individuals and small businesses navigating Nigeria's tax system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card border hover:shadow-medium transition-all hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-primary to-secondary p-12 md:p-16 text-center animate-scale-in">
          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready to Take Control of Your Taxes?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands managing their tax compliance with confidence
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/signup-choice")}
              className="shadow-strong hover:shadow-medium"
            >
              Start Free Now
              <ArrowRight className="ml-2" />
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 TaxBuddy. Made for Nigerian tax compliance.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
