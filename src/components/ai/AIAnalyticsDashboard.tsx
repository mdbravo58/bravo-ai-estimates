import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Brain,
  AlertTriangle,
  Target,
  Lightbulb,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface KPI {
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

interface Insight {
  category: string;
  finding: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: string;
  timeframe: string;
}

interface Alert {
  type: 'warning' | 'opportunity' | 'critical';
  message: string;
  urgency: 'immediate' | 'soon' | 'monitor';
}

interface AnalyticsData {
  summary: string;
  kpis: KPI[];
  insights: Insight[];
  recommendations: Recommendation[];
  alerts: Alert[];
  generatedAt: string;
  dateRange: string;
}

export const AIAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('last_30_days');
  const [analysisType, setAnalysisType] = useState('business_insights');
  const { toast } = useToast();

  const generateAnalytics = async () => {
    setIsLoading(true);
    try {
      console.log('Generating AI analytics...');
      
      const { data, error } = await supabase.functions.invoke('ai-analytics', {
        body: {
          analysisType,
          dateRange,
          specificMetrics: []
        }
      });

      if (error) throw error;

      setAnalyticsData(data);
      toast({
        title: 'Success',
        description: 'AI analytics generated successfully!',
      });
    } catch (error) {
      console.error('Error generating analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate analytics. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAnalytics();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'opportunity': return 'secondary';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Business Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium">Analysis Type</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business_insights">Business Insights</SelectItem>
                  <SelectItem value="financial_analysis">Financial Analysis</SelectItem>
                  <SelectItem value="customer_analysis">Customer Analysis</SelectItem>
                  <SelectItem value="operational_analysis">Operational Analysis</SelectItem>
                  <SelectItem value="growth_predictions">Growth Predictions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateAnalytics}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Generate Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {analyticsData && (
        <>
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analyticsData.summary}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                Generated: {new Date(analyticsData.generatedAt).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {analyticsData.alerts && analyticsData.alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Priority Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        alert.type === 'critical' ? 'bg-red-50 border-red-200' :
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getAlertColor(alert.type)}>{alert.type}</Badge>
                          <Badge variant="outline">{alert.urgency}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* KPIs */}
          {analyticsData.kpis && analyticsData.kpis.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {analyticsData.kpis.map((kpi, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{kpi.metric}</h4>
                        {getTrendIcon(kpi.trend)}
                      </div>
                      <div className="text-2xl font-bold mb-2">
                        {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                      </div>
                      <p className="text-sm text-muted-foreground">{kpi.insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insights */}
          {analyticsData.insights && analyticsData.insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Insights & Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.insights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{insight.category}</Badge>
                            <Badge variant={getPriorityColor(insight.impact)}>{insight.impact} impact</Badge>
                          </div>
                          <h4 className="font-medium">{insight.finding}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{insight.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {analyticsData.recommendations && analyticsData.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium flex-1">{rec.action}</h4>
                        <Badge variant={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Expected Impact: </span>
                          {rec.expectedImpact}
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Timeframe: </span>
                          {rec.timeframe}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">AI is analyzing your business data...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};