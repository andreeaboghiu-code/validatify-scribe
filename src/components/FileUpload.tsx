import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import Papa from "papaparse";

interface FileUploadProps {
  onFileLoad: (data: any[], fileName: string) => void;
}

export function FileUpload({ onFileLoad }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFile = useCallback((file: File) => {
    if (file.type !== "text/csv") {
      alert("Please upload a CSV file");
      return;
    }

    setUploadedFile(file);

    Papa.parse(file, {
      complete: (results) => {
        onFileLoad(results.data, file.name);
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        console.error("CSV parsing error:", error);
        alert("Error parsing CSV file");
      }
    });
  }, [onFileLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setUploadedFile(null);
  }, []);

  return (
    <Card className="p-8">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Upload CSV Data</h2>
        
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              isDragging 
                ? "border-primary bg-primary-subtle" 
                : "border-border hover:border-primary hover:bg-accent"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <Button asChild>
              <label htmlFor="file-input" className="cursor-pointer">
                Choose File
              </label>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">{uploadedFile.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}