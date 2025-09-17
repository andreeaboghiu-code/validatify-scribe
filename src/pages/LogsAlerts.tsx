import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Clock,
  Database,
  RefreshCw
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  type: "Validation" | "Ingestion" | "AI_API" | "System";
  message: string;
  details?: string;
}

interface AlertEntry {
  id: string;
  timestamp: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  type: "Validation Error" | "Ingestion Failure" | "AI API Issue" | "System Alert";
  message: string;
  acknowledged: boolean;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:25",
    level: "SUCCESS",
    type: "Validation",
    message: "CSV file validation completed successfully",
    details: "Processed 1,247 rows with 98.5% success rate"
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:28:12",
    level: "WARNING",
    type: "Validation",
    message: "Price validation failed for 18 products",
    details: "Found negative price values in rows: 45, 78, 156..."
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:25:08",
    level: "INFO",
    type: "Ingestion",
    message: "New CSV file uploaded: products_batch_3.csv",
    details: "File size: 2.4MB, Expected rows: 1,247"
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:20:45",
    level: "ERROR",
    type: "AI_API",
    message: "OpenAI API rate limit exceeded",
    details: "Rate limit: 60 requests per minute. Current usage: 65 requests"
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:15:33",
    level: "SUCCESS",
    type: "AI_API",
    message: "Generated descriptions for 245 products",
    details: "Average response time: 1.2s per description"
  },
];

const mockAlerts: AlertEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:28:12",
    severity: "MEDIUM",
    type: "Validation Error",
    message: "Multiple products with negative prices detected",
    acknowledged: false
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:20:45",
    severity: "HIGH",
    type: "AI API Issue",
    message: "OpenAI API rate limit exceeded - content generation paused",
    acknowledged: false
  },
  {
    id: "3",
    timestamp: "2024-01-15 13:45:12",
    severity: "LOW",
    type: "System Alert",
    message: "Disk space usage above 80%",
    acknowledged: true
  },
];

export default function LogsAlerts() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [alerts, setAlerts] = useState<AlertEntry[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [logLevelFilter, setLogLevelFilter] = useState<string>("ALL");
  const [logTypeFilter, setLogTypeFilter] = useState<string>("ALL");
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<string>("ALL");

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
    toast.success("Alert acknowledged");
  };

  const handleAcknowledgeAllAlerts = () => {
    setAlerts(alerts.map(alert => ({ ...alert, acknowledged: true })));
    toast.success("All alerts acknowledged");
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "ERROR":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "WARNING":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "INFO":
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getLogBadge = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return <Badge className="bg-success-subtle text-success-foreground">Success</Badge>;
      case "ERROR":
        return <Badge variant="destructive">Error</Badge>;
      case "WARNING":
        return <Badge className="bg-warning-subtle text-warning-foreground">Warning</Badge>;
      case "INFO":
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return <Badge variant="destructive">High</Badge>;
      case "MEDIUM":
        return <Badge className="bg-warning-subtle text-warning-foreground">Medium</Badge>;
      case "LOW":
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = logLevelFilter === "ALL" || log.level === logLevelFilter;
    const matchesType = logTypeFilter === "ALL" || log.type === logTypeFilter;
    
    return matchesSearch && matchesLevel && matchesType;
  });

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = alertSeverityFilter === "ALL" || alert.severity === alertSeverityFilter;
    return matchesSeverity;
  });

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Logs & Alerts</h2>
          <p className="text-muted-foreground">Monitor pipeline execution and system notifications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Active Alerts</span>
              {unacknowledgedAlerts.length > 0 && (
                <Badge variant="destructive">{unacknowledgedAlerts.length}</Badge>
              )}
            </CardTitle>
            <div className="flex space-x-2">
              <Select value={alertSeverityFilter} onValueChange={setAlertSeverityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Severity</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
              {unacknowledgedAlerts.length > 0 && (
                <Button onClick={handleAcknowledgeAllAlerts} size="sm">
                  Acknowledge All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No alerts to display</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.acknowledged 
                      ? "bg-muted/30 border-border" 
                      : "bg-card border-warning"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getSeverityBadge(alert.severity)}
                        <Badge variant="outline">{alert.type}</Badge>
                        {alert.acknowledged && (
                          <Badge className="bg-success-subtle text-success-foreground">
                            Acknowledged
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium">{alert.message}</p>
                      <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Pipeline Execution Logs</span>
          </CardTitle>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={logLevelFilter} onValueChange={setLogLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Levels</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={logTypeFilter} onValueChange={setLogTypeFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="Validation">Validation</SelectItem>
                <SelectItem value="Ingestion">Ingestion</SelectItem>
                <SelectItem value="AI_API">AI API</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getLogIcon(log.level)}
                      {getLogBadge(log.level)}
                      <Badge variant="outline">{log.type}</Badge>
                      <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <p className="font-medium mb-1">{log.message}</p>
                    {log.details && (
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}