import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Filter
} from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { DataTable } from "@/components/DataTable";
import { ValidationResults } from "@/components/ValidationResults";
import { DataRecord, ValidationError } from "@/types/data";
import { validateCsvData } from "@/utils/validation";
import { toast } from "sonner";

const mockValidationData = [
  { product_id: 1, product_name: "Wireless Headphones", price: 99.99, category: "Electronics", status: "valid" },
  { product_id: 2, product_name: "Coffee Mug", price: -5, category: "Home", status: "error" },
  { product_id: 3, product_name: "", price: 29.99, category: "Books", status: "error" },
  { product_id: 4, product_name: "Gaming Mouse", price: 79.99, category: "Electronics", status: "valid" },
  { product_id: 5, product_name: "Notebook", price: 12.99, category: "Office", status: "valid" },
];

const mockValidationErrors: ValidationError[] = [
  { row: 2, field: "price", message: "Price must be positive", value: -5 },
  { row: 3, field: "product_name", message: "Product name is required", value: "" },
];

export default function DataValidation() {
  const [rawData, setRawData] = useState<any[]>(mockValidationData);
  const [fileName, setFileName] = useState<string>("sample_data.csv");
  const [validData, setValidData] = useState<DataRecord[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(mockValidationErrors);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileLoad = (data: any[], name: string) => {
    setRawData(data);
    setFileName(name);
    runValidation(data);
    toast.success(`Loaded ${data.length} rows from ${name}`);
  };

  const runValidation = (data: any[] = rawData) => {
    setIsValidating(true);
    
    // Simulate validation processing
    setTimeout(() => {
      const { valid, errors } = validateCsvData(data);
      setValidData(valid);
      setValidationErrors(errors);
      setIsValidating(false);
      
      if (errors.length === 0) {
        toast.success("Validation completed successfully!");
      } else {
        toast.warning(`Validation completed with ${errors.length} errors`);
      }
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-success-subtle text-success-foreground">Valid</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Data Validation</h2>
          <p className="text-muted-foreground">Upload and validate your CSV data files</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => runValidation()}
            disabled={isValidating || rawData.length === 0}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
            <span>Re-run Validation</span>
          </Button>
        </div>
      </div>

      {/* File Upload */}
      <FileUpload onFileLoad={handleFileLoad} />

      {/* Validation Status */}
      {rawData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Total Rows</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rawData.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Valid Rows</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{validData.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span>Errors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{validationErrors.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Validation Results */}
      {rawData.length > 0 && (
        <ValidationResults 
          errors={validationErrors} 
          validCount={validData.length}
        />
      )}

      {/* Data Preview with Validation Status */}
      {rawData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <span>Data Preview ({fileName})</span>
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Product ID</th>
                    <th className="text-left p-3 font-medium">Product Name</th>
                    <th className="text-left p-3 font-medium">Price</th>
                    <th className="text-left p-3 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {rawData.map((row, index) => {
                    const hasError = validationErrors.some(error => error.row === index + 1);
                    const status = hasError ? "error" : "valid";
                    
                    return (
                      <tr key={index} className="border-b hover:bg-muted/30">
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(status)}
                            {getStatusBadge(status)}
                          </div>
                        </td>
                        <td className="p-3">{row.product_id}</td>
                        <td className="p-3">{row.product_name || <span className="text-muted-foreground italic">Empty</span>}</td>
                        <td className="p-3">{row.price}</td>
                        <td className="p-3">{row.category}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actionable Recommendations */}
      {validationErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Actionable Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-warning bg-warning-subtle">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                <strong>Data Quality Issues Detected:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Fix negative price values by setting minimum price validation</li>
                  <li>Fill empty product names or remove incomplete records</li>
                  <li>Consider setting up automated data validation rules</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}