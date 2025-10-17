import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForm } from "@/components/TransactionForm";
import { 
  LogOut, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  DollarSign,
  Plus,
  Wallet,
  FileText,
  Bell,
  BookOpen,
  BarChart3,
  FileCheck,
  MessageSquare,
  Upload,
  Download,
  Users,
  Receipt,
  TrendingUpIcon,
  Shield,
  Building2
} from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Profile {
  id: string;
  user_type: "individual" | "business";
  full_name: string;
  display_name: string | null;
  business_name: string | null;
}

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string | null;
  transaction_date: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (!profileData) {
        navigate("/onboarding");
        return;
      }

      setProfile(profileData);

      // Load transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false });

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netIncome = totalIncome - totalExpenses;

  // Nigerian tax bands 2024 (simplified)
  const calculateTax = () => {
    if (profile?.user_type === "individual") {
      // Individual rates (annual)
      if (netIncome <= 800000) return 0; // Exempt
      if (netIncome <= 3200000) return netIncome * 0.07;
      if (netIncome <= 5000000) return netIncome * 0.11;
      if (netIncome <= 16000000) return netIncome * 0.15;
      if (netIncome <= 32000000) return netIncome * 0.19;
      return netIncome * 0.21;
    }
    return netIncome * 0.21; // Simplified business rate
  };

  const estimatedTax = calculateTax();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                Welcome, {profile?.display_name || profile?.full_name}!
              </h1>
              <p className="text-xs text-muted-foreground capitalize">
                {profile?.user_type} Account
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ₦{totalIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                ₦{totalExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{netIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Tax</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                ₦{estimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction & Recent Transactions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Add Transaction */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
              <CardDescription>Record your income or expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="hero" size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    New Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>
                      Record your income or expenses for tax tracking
                    </DialogDescription>
                  </DialogHeader>
                  <TransactionForm
                    userId={profile!.id}
                    onSuccess={() => {
                      setDialogOpen(false);
                      loadData();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Tax Compliance Info */}
          <Card className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle>Tax Compliance Status</CardTitle>
              <CardDescription>Nigerian Tax Reform 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile?.user_type === "individual" && netIncome < 800000 ? (
                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <p className="text-sm font-medium text-secondary">
                    Tax Exempt ✓
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your income is below ₦800,000 annual threshold
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-accent">
                    Tax Due: ₦{estimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on current net income
                  </p>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Individual income under ₦800k/year: Exempt</p>
                <p>• Progressive rates: 7% to 21%</p>
                <p>• Small businesses: Simplified 21% rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        {profile?.user_type === "individual" ? (
          <>
            {/* Free Features for Individuals */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Free Features</CardTitle>
                <CardDescription>
                  Available tools to help you manage your taxes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FeatureCard
                    icon={TrendingUpIcon}
                    title="Smart Income Tracker"
                    description="Log monthly income and basic expenses with automatic categorization"
                  />
                  <FeatureCard
                    icon={Calculator}
                    title="Basic Tax Estimator"
                    description="Calculate estimated PIT using current FIRS/Nigerian tax bands"
                  />
                  <FeatureCard
                    icon={FileCheck}
                    title="Non-Taxable Income Certificate"
                    description="Auto-generate proof of non-taxable status for income below ₦800k"
                  />
                  <FeatureCard
                    icon={Bell}
                    title="Reminders & Alerts"
                    description="Monthly notifications for self-assessment filing or tax deadlines"
                  />
                  <FeatureCard
                    icon={BookOpen}
                    title="Learning Hub"
                    description="Free access to bite-sized tax education tips, FAQ, and glossary"
                  />
                  <FeatureCard
                    icon={Shield}
                    title="Tax Reform Guidance"
                    description="Explain new tax rules, exemptions, reliefs, and filing requirements"
                  />
                  <FeatureCard
                    icon={BarChart3}
                    title="Profile Dashboard"
                    description="View total income logged, tax estimate, and compliance status"
                  />
                  <FeatureCard
                    icon={Wallet}
                    title="Budgeting & Expense Goals"
                    description="Track spending vs. revenue to optimize taxable income"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Premium Features for Individuals */}
            <Card className="animate-fade-in border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Premium Features
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/20 text-accent">
                    Upgrade
                  </span>
                </CardTitle>
                <CardDescription>
                  Unlock advanced tools for complete tax management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FeatureCard
                    icon={Calculator}
                    title="Smart Tax Calculator Pro"
                    description="Advanced deductions: pension, NHF, life insurance, dependents"
                    isPremium
                  />
                  <FeatureCard
                    icon={FileText}
                    title="Automated Tax Filing"
                    description="Step-by-step guide to file directly with FIRS or state IRS portals"
                    isPremium
                  />
                  <FeatureCard
                    icon={MessageSquare}
                    title="Personalized Tax Guidance"
                    description="AI-based insights on reducing taxable income legally"
                    isPremium
                  />
                  <FeatureCard
                    icon={FileCheck}
                    title="Tax History Report"
                    description="Auto-generate yearly tax summary PDFs for applications"
                    isPremium
                  />
                  <FeatureCard
                    icon={BarChart3}
                    title="Income Pattern Analysis"
                    description="Charts showing monthly trends and highest-earning sources"
                    isPremium
                  />
                  <FeatureCard
                    icon={MessageSquare}
                    title="Priority Support"
                    description="Direct access to a tax advisor via chat or WhatsApp"
                    isPremium
                  />
                  <FeatureCard
                    icon={Upload}
                    title="Document Upload & Storage"
                    description="Upload receipts, invoices, and supporting tax documents"
                    isPremium
                  />
                  <FeatureCard
                    icon={Download}
                    title="Export & Sharing"
                    description="Export transactions, tax calculations, and reports as PDF or CSV"
                    isPremium
                  />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Free Features for Business */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Free Features</CardTitle>
                <CardDescription>
                  Essential tools for small business tax management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FeatureCard
                    icon={TrendingUpIcon}
                    title="Revenue & Expense Tracker"
                    description="Input and categorize business income and costs with dashboard summary"
                  />
                  <FeatureCard
                    icon={Calculator}
                    title="Basic Tax Estimator"
                    description="Estimate CIT and WHT for MSMEs with auto-detection of tax-exempt status"
                  />
                  <FeatureCard
                    icon={Bell}
                    title="Simple Compliance Reminder"
                    description="Alerts for filing deadlines (VAT, PAYE, CIT, etc.)"
                  />
                  <FeatureCard
                    icon={FileCheck}
                    title="Micro-Business Exemption"
                    description="Auto-generate tax exemption summary for turnover < ₦25M"
                  />
                  <FeatureCard
                    icon={BookOpen}
                    title="Educational Center"
                    description="Free guides on VAT, PAYE remittance, and FIRS registration"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Premium Features for Business */}
            <Card className="animate-fade-in border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Premium Features
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/20 text-accent">
                    Upgrade
                  </span>
                </CardTitle>
                <CardDescription>
                  Professional tools for complete business tax compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FeatureCard
                    icon={FileText}
                    title="Advanced Compliance Reports"
                    description="Full reports on CIT, VAT, PAYE, WHT with breakdowns and due dates"
                    isPremium
                  />
                  <FeatureCard
                    icon={FileCheck}
                    title="Automated Tax Filing Portal"
                    description="Integrate with FIRS eTax or state portals for direct filing"
                    isPremium
                  />
                  <FeatureCard
                    icon={Building2}
                    title="Multi-Branch Accounting"
                    description="Manage revenues and taxes for multiple branches or subsidiaries"
                    isPremium
                  />
                  <FeatureCard
                    icon={Users}
                    title="Payroll & PAYE Calculator"
                    description="Auto-calculate PAYE per employee and generate remittance summaries"
                    isPremium
                  />
                  <FeatureCard
                    icon={Receipt}
                    title="Invoice & Receipt Generator"
                    description="Create branded invoices with automatic VAT computation"
                    isPremium
                  />
                  <FeatureCard
                    icon={BarChart3}
                    title="Financial Health Dashboard"
                    description="Visual charts for cash flow, revenue vs. expense, and tax ratio"
                    isPremium
                  />
                  <FeatureCard
                    icon={MessageSquare}
                    title="Premium Business Support"
                    description="1-on-1 advisory for tax compliance, audits, or expansion planning"
                    isPremium
                  />
                  <FeatureCard
                    icon={Upload}
                    title="Document Upload & Storage"
                    description="Upload receipts, invoices, and supporting tax documents"
                    isPremium
                  />
                  <FeatureCard
                    icon={Download}
                    title="Export & Sharing"
                    description="Export transactions, tax calculations, and reports as PDF or CSV"
                    isPremium
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Recent Transactions */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              {transactions.length} total transaction(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions yet. Add your first transaction above!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 10).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === "income"
                            ? "bg-secondary/20"
                            : "bg-destructive/20"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4 text-secondary" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {transaction.category.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "income"
                            ? "text-secondary"
                            : "text-destructive"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₦
                        {Number(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
