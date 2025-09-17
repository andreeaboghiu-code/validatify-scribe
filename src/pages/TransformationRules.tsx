import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Settings,
  ArrowRight,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface TransformationRule {
  id: string;
  name: string;
  description: string;
  targetLayer: "Silver" | "Gold";
  status: "Active" | "Inactive" | "Draft";
  type: "Data Cleaning" | "Enrichment" | "Validation" | "Format";
}

const mockRules: TransformationRule[] = [
  {
    id: "1",
    name: "Price Normalization",
    description: "Ensure all prices are positive and formatted to 2 decimal places",
    targetLayer: "Silver",
    status: "Active",
    type: "Data Cleaning"
  },
  {
    id: "2", 
    name: "Product Name Cleanup",
    description: "Remove extra whitespace and standardize product naming",
    targetLayer: "Silver",
    status: "Active",
    type: "Data Cleaning"
  },
  {
    id: "3",
    name: "Category Standardization",
    description: "Map product categories to standard taxonomy",
    targetLayer: "Gold",
    status: "Active",
    type: "Enrichment"
  },
  {
    id: "4",
    name: "Currency Conversion",
    description: "Convert all prices to USD using current exchange rates",
    targetLayer: "Gold",
    status: "Draft",
    type: "Enrichment"
  }
];

const sampleDataBefore = [
  { product_id: 1, product_name: "  Wireless Headphones  ", price: "99.999", category: "tech" },
  { product_id: 2, product_name: "COFFEE MUG", price: "-5.00", category: "home_kitchen" },
];

const sampleDataAfter = [
  { product_id: 1, product_name: "Wireless Headphones", price: "99.99", category: "Electronics" },
  { product_id: 2, product_name: "Coffee Mug", price: "0.00", category: "Home & Kitchen" },
];

export default function TransformationRules() {
  const [rules, setRules] = useState<TransformationRule[]>(mockRules);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRule, setEditingRule] = useState<TransformationRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<TransformationRule>>({
    name: "",
    description: "",
    targetLayer: "Silver",
    status: "Draft",
    type: "Data Cleaning"
  });

  const handleAddRule = () => {
    if (!newRule.name || !newRule.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const rule: TransformationRule = {
      id: Date.now().toString(),
      name: newRule.name!,
      description: newRule.description!,
      targetLayer: newRule.targetLayer as "Silver" | "Gold",
      status: newRule.status as "Active" | "Inactive" | "Draft",
      type: newRule.type as any
    };

    setRules([...rules, rule]);
    setNewRule({ name: "", description: "", targetLayer: "Silver", status: "Draft", type: "Data Cleaning" });
    setIsAddingRule(false);
    toast.success("Transformation rule added successfully");
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast.success("Rule deleted successfully");
  };

  const handleApplyRules = () => {
    const activeRules = rules.filter(rule => rule.status === "Active");
    toast.success(`Applied ${activeRules.length} transformation rules`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-success-subtle text-success-foreground">Active</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "Draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLayerBadge = (layer: string) => {
    return layer === "Gold" 
      ? <Badge className="bg-warning-subtle text-warning-foreground">Gold</Badge>
      : <Badge className="bg-primary-subtle text-primary-foreground">Silver</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transformation Rules</h2>
          <p className="text-muted-foreground">Define and manage data transformation rules for your pipeline</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddingRule} onOpenChange={setIsAddingRule}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Rule</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Transformation Rule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    placeholder="Enter rule name"
                    value={newRule.name || ""}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="rule-description">Description</Label>
                  <Textarea
                    id="rule-description"
                    placeholder="Describe what this rule does"
                    value={newRule.description || ""}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Target Layer</Label>
                    <Select
                      value={newRule.targetLayer}
                      onValueChange={(value) => setNewRule({ ...newRule, targetLayer: value as "Silver" | "Gold" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Silver">Silver</SelectItem>
                        <SelectItem value="Gold">Gold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={newRule.type}
                      onValueChange={(value) => setNewRule({ ...newRule, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Data Cleaning">Data Cleaning</SelectItem>
                        <SelectItem value="Enrichment">Enrichment</SelectItem>
                        <SelectItem value="Validation">Validation</SelectItem>
                        <SelectItem value="Format">Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddRule} className="w-full">
                  Add Rule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            onClick={handleApplyRules}
            className="flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Apply Rules</span>
          </Button>
        </div>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Transformation Rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Rule Name</th>
                  <th className="text-left p-4 font-medium">Description</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Target Layer</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b hover:bg-muted/30">
                    <td className="p-4 font-medium">{rule.name}</td>
                    <td className="p-4 text-muted-foreground max-w-xs">
                      {rule.description}
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{rule.type}</Badge>
                    </td>
                    <td className="p-4">
                      {getLayerBadge(rule.targetLayer)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(rule.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Rule Application Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Before Transformation</h4>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3">ID</th>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Price</th>
                      <th className="text-left p-3">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleDataBefore.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{row.product_id}</td>
                        <td className="p-3">{row.product_name}</td>
                        <td className="p-3">{row.price}</td>
                        <td className="p-3">{row.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <ArrowRight className="h-4 w-4" />
                <span>After Transformation</span>
              </h4>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3">ID</th>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Price</th>
                      <th className="text-left p-3">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleDataAfter.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{row.product_id}</td>
                        <td className="p-3 text-success">{row.product_name}</td>
                        <td className="p-3 text-success">{row.price}</td>
                        <td className="p-3 text-success">{row.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}