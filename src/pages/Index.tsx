import { useState } from "react";
import { DataRecord, ValidationError } from "@/types/data";
import { validateCsvData } from "@/utils/validation";
import { generateDescriptionsForAllProducts } from "@/utils/openai";
import { FileUpload } from "@/components/FileUpload";
import { DataTable } from "@/components/DataTable";
import { ValidationResults } from "@/components/ValidationResults";
import { OpenAIKeyInput } from "@/components/OpenAIKeyInput";
import { ExportButton } from "@/components/ExportButton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Index = () => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [validData, setValidData] = useState<DataRecord[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [enrichedData, setEnrichedData] = useState<DataRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showAIInput, setShowAIInput] = useState(false);

  const handleFileLoad = (data: any[], name: string) => {
    setRawData(data);
    setFileName(name);
    setEnrichedData([]);
    setShowAIInput(false);
    
    // Validate the data
    const { valid, errors } = validateCsvData(data);
    setValidData(valid);
    setValidationErrors(errors);
    
    toast.success(`Loaded ${data.length} rows from ${name}`);
  };

  const handleGenerateDescriptions = async (apiKey: string) => {
    if (validData.length === 0) {
      toast.error("No valid data to process");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const enriched = await generateDescriptionsForAllProducts(
        validData,
        apiKey,
        (current, total) => {
          setGenerationProgress((current / total) * 100);
        }
      );
      
      setEnrichedData(enriched);
      toast.success("Successfully generated all product descriptions!");
    } catch (error) {
      console.error("Error generating descriptions:", error);
      toast.error("Failed to generate descriptions. Please check your API key.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Data Preparation & AI Content Generator
          </h1>
          <p className="text-muted-foreground">
            Upload CSV data, validate it, and generate AI-powered product descriptions
          </p>
        </div>

        <FileUpload onFileLoad={handleFileLoad} />

        {rawData.length > 0 && (
          <>
            <DataTable
              data={rawData.slice(0, 10)} 
              title={`Raw Data Preview (${fileName})`}
            />

            <ValidationResults 
              errors={validationErrors} 
              validCount={validData.length}
            />

            {validData.length > 0 && (
              <>
                <DataTable
                  data={validData}
                  title="Valid Data"
                />

                {!showAIInput && !isGenerating && enrichedData.length === 0 && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAIInput(true)}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Generate AI Product Descriptions
                    </button>
                  </div>
                )}

                {showAIInput && !isGenerating && (
                  <OpenAIKeyInput 
                    onKeySubmit={handleGenerateDescriptions}
                    isLoading={isGenerating}
                  />
                )}

                {isGenerating && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-foreground font-medium mb-2">
                        Generating product descriptions...
                      </p>
                      <Progress value={generationProgress} className="w-full max-w-md mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">
                        {Math.round(generationProgress)}% complete
                      </p>
                    </div>
                  </div>
                )}

                {enrichedData.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Enriched Data with AI Descriptions</h3>
                      <ExportButton data={enrichedData} filename="enriched_products.csv" />
                    </div>
                    <DataTable
                      data={enrichedData}
                      title="Final Enriched Dataset"
                      showDescription={true}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
