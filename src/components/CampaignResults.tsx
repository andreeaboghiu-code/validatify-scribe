import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Download, Eye, EyeOff } from "lucide-react";
import { CampaignResult } from "@/utils/campaignGenerator";

interface CampaignResultsProps {
  results: CampaignResult[];
  onExport: () => void;
}

export function CampaignResults({ results, onExport }: CampaignResultsProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showImages, setShowImages] = useState(true);

  const toggleRow = (key: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedRows(newExpanded);
  };

  const groupedByLanguage = results.reduce((acc, result) => {
    if (!acc[result.language]) {
      acc[result.language] = [];
    }
    acc[result.language].push(result);
    return acc;
  }, {} as { [key: string]: CampaignResult[] });

  const languages = Object.keys(groupedByLanguage);
  const uniqueProducts = [...new Set(results.map(r => r.sku))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>🎯 Generated Multi-Language Campaign Content & Images</CardTitle>
              <CardDescription>
                {results.length} content pieces generated for {uniqueProducts.length} products across {languages.length} languages
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImages(!showImages)}
              >
                {showImages ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showImages ? "Hide Images" : "Show Images"}
              </Button>
              <Button onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Campaign Assets
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={languages[0] || "EN"} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              {languages.slice(0, 5).map((lang) => (
                <TabsTrigger key={lang} value={lang}>
                  {lang} ({groupedByLanguage[lang].length})
                </TabsTrigger>
              ))}
            </TabsList>

            {languages.map((lang) => (
              <TabsContent key={lang} value={lang}>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Product</TableHead>
                        <TableHead>Campaign Info</TableHead>
                        <TableHead className="w-[200px]">Content</TableHead>
                        <TableHead>SEO & Compliance</TableHead>
                        {showImages && <TableHead className="w-[120px]">Image</TableHead>}
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedByLanguage[lang].map((result, index) => {
                        const rowKey = `${result.sku}-${result.language}-${index}`;
                        const isExpanded = expandedRows.has(rowKey);
                        
                        return (
                          <TableRow key={rowKey}>
                            <TableCell className="font-medium">
                              <div className="space-y-1">
                                <div className="font-semibold text-sm">{result.sku}</div>
                                <Badge variant="outline" className="text-xs">
                                  {result.businessUnit}
                                </Badge>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm font-medium">{result.campaign}</div>
                                <div className="flex gap-1 flex-wrap">
                                  <Badge variant="secondary" className="text-xs">
                                    {result.segment}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {result.tone}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {result.petType}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-2">
                                <div className="text-sm">
                                  {isExpanded 
                                    ? result.description 
                                    : `${result.description.substring(0, 100)}...`
                                  }
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {result.hashtags}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-2">
                                <div className="text-xs">
                                  <strong>Keywords:</strong> {result.seoKeywords.substring(0, 50)}...
                                </div>
                                {result.complianceIssues && (
                                  <Badge variant="destructive" className="text-xs">
                                    Compliance Issues
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            
                            {showImages && (
                              <TableCell>
                                {result.imageUrl && (
                                  <div className="space-y-2">
                                    <img 
                                      src={result.imageUrl} 
                                      alt={`Campaign image for ${result.sku}`}
                                      className="w-20 h-20 object-cover rounded border"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      asChild
                                      className="p-1 h-6"
                                    >
                                      <a 
                                        href={result.imageUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            )}
                            
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRow(rowKey)}
                              >
                                {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {showImages && (
        <Card>
          <CardHeader>
            <CardTitle>🖼️ Campaign Image Previews</CardTitle>
            <CardDescription>Generated images for all campaign content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.filter(r => r.imageUrl).map((result, index) => (
                <div key={index} className="space-y-2">
                  <img 
                    src={result.imageUrl} 
                    alt={`Campaign image for ${result.sku}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                  <div className="text-xs text-center">
                    <div className="font-medium">{result.sku}</div>
                    <div className="text-muted-foreground">{result.language}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <a 
                      href={result.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}