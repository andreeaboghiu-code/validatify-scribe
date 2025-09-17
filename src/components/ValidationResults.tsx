import { ValidationError } from "@/types/data";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface ValidationResultsProps {
  errors: ValidationError[];
  validCount: number;
}

export function ValidationResults({ errors, validCount }: ValidationResultsProps) {
  const hasErrors = errors.length > 0;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Validation Results</h3>
      
      {!hasErrors ? (
        <Alert className="border-success bg-success-subtle">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-success-foreground">
            All {validCount} rows are valid! No errors found.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <Alert className="border-warning bg-warning-subtle">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              Found {errors.length} validation errors. {validCount} rows are valid.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {errors.map((error, index) => (
              <div
                key={index}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-destructive">
                    Row {error.row}, Field: {error.field}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Value: {JSON.stringify(error.value)}
                  </span>
                </div>
                <p className="text-sm text-destructive mt-1">{error.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}