import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Play, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Database
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const processingData = [
  { name: 'Mon', processed: 24, validated: 20, generated: 18 },
  { name: 'Tue', processed: 32, validated: 28, generated: 25 },
  { name: 'Wed', processed: 18, validated: 16, generated: 14 },
  { name: 'Thu', processed: 45, validated: 40, generated: 38 },
  { name: 'Fri', processed: 38, validated: 35, generated: 32 },
  { name: 'Sat', processed: 22, validated: 20, generated: 18 },
  { name: 'Sun', processed: 15, validated: 14, generated: 12 },
];

const timelineData = [
  { time: '09:00', files: 5, rows: 1200 },
  { time: '10:00', files: 8, rows: 2100 },
  { time: '11:00', files: 12, rows: 3400 },
  { time: '12:00', files: 15, rows: 4200 },
  { time: '13:00', files: 18, rows: 5100 },
  { time: '14:00', files: 22, rows: 6200 },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor your data pipeline performance and metrics</p>
        </div>
        <Badge variant="secondary" className="bg-success-subtle text-success-foreground">
          Pipeline Active
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CSV Files Ingested</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rows Validated</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">98.5%</span> success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validation Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">843</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-warning">-5%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Descriptions Generated</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48,204</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+8%</span> completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5" />
              <span>Weekly Processing Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="processed" fill="hsl(var(--primary))" />
                <Bar dataKey="validated" fill="hsl(var(--success))" />
                <Bar dataKey="generated" fill="hsl(var(--accent-foreground))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Daily Ingestion Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="files" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="rows" stroke="hsl(var(--success))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Current Processing Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Current Processing Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Data Validation</span>
            <span className="text-sm text-muted-foreground">85% complete</span>
          </div>
          <Progress value={85} className="w-full" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Content Generation</span>
            <span className="text-sm text-muted-foreground">62% complete</span>
          </div>
          <Progress value={62} className="w-full" />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload CSV</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Run Validation</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Generate Content</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}