import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface TransactionFormProps {
  userId: string;
  onSuccess: () => void;
}

const incomeCategories = [
  { value: "salary", label: "Salary" },
  { value: "business_revenue", label: "Business Revenue" },
  { value: "freelance", label: "Freelance" },
  { value: "investment", label: "Investment" },
  { value: "other_income", label: "Other Income" },
];

const expenseCategories = [
  { value: "rent", label: "Rent" },
  { value: "utilities", label: "Utilities" },
  { value: "transportation", label: "Transportation" },
  { value: "food", label: "Food" },
  { value: "office_supplies", label: "Office Supplies" },
  { value: "marketing", label: "Marketing" },
  { value: "professional_services", label: "Professional Services" },
  { value: "equipment", label: "Equipment" },
  { value: "other_expense", label: "Other Expense" },
];

export const TransactionForm = ({ userId, onSuccess }: TransactionFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "income" as "income" | "expense",
    category: "",
    amount: "",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.amount) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("transactions").insert([{
        user_id: userId,
        type: formData.type,
        category: formData.category as any,
        amount: parseFloat(formData.amount),
        description: formData.description || null,
        transaction_date: formData.transactionDate,
      }]);

      if (error) throw error;

      toast({
        title: "Transaction added",
        description: `${formData.type === "income" ? "Income" : "Expense"} of ₦${formData.amount} recorded`,
      });

      // Reset form
      setFormData({
        type: "income",
        category: "",
        amount: "",
        description: "",
        transactionDate: new Date().toISOString().split("T")[0],
      });

      onSuccess();
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

  const categories = formData.type === "income" ? incomeCategories : expenseCategories;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value: "income" | "expense") => {
              setFormData({ ...formData, type: value, category: "" });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₦) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.transactionDate}
            onChange={(e) =>
              setFormData({ ...formData, transactionDate: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add notes about this transaction..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full" variant="hero">
        <Plus className="mr-2 h-4 w-4" />
        {loading ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  );
};
