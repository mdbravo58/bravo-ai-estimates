import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Wrench, 
  Calculator, 
  DollarSign, 
  Settings, 
  Smartphone,
  Bot,
  Brain,
  Zap,
  Target,
  Rocket,
  Shield,
  Globe,
  BarChart3,
  Download,
  ExternalLink
} from "lucide-react";

const FoundersGuidePage = () => {
  const handleExportPDF = () => {
    // This will open a new window with the content formatted for PDF generation
    window.open('/guide-export', '_blank');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bravo Service Suite - Founders Guide</h1>
            <p className="text-muted-foreground mt-2">
              Complete business management platform for service contractors
            </p>
          </div>
          <Button onClick={handleExportPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export for PDF
          </Button>
        </div>

        <Tabs defaultValue="executive-summary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="executive-summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="market-opportunity">Market</TabsTrigger>
            <TabsTrigger value="platform-overview">Platform</TabsTrigger>
            <TabsTrigger value="ai-capabilities">AI Features</TabsTrigger>
            <TabsTrigger value="technical-architecture">Technology</TabsTrigger>
            <TabsTrigger value="business-model">Business Model</TabsTrigger>
            <TabsTrigger value="competitive-advantage">Advantages</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>

          <TabsContent value="executive-summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">The Opportunity</h3>
                      <p className="text-sm text-muted-foreground">
                        The service contractor industry represents a $400+ billion market that remains largely underserved 
                        by modern software solutions. Most contractors still rely on manual processes, spreadsheets, 
                        and disconnected tools that limit growth and profitability.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Our Solution</h3>
                      <p className="text-sm text-muted-foreground">
                        Bravo Service Suite is a comprehensive, AI-powered business management platform specifically 
                        designed for service contractors. We integrate every aspect of the business workflow from 
                        lead generation to project completion and billing.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Key Differentiators</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• AI-powered estimate generation and customer service</li>
                        <li>• Native CRM integration (GoHighLevel)</li>
                        <li>• Real-time job costing and profitability tracking</li>
                        <li>• Mobile-first field technician interface</li>
                        <li>• Industry-specific workflows and templates</li>
                        <li>• Comprehensive analytics and business intelligence</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Market Metrics</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Total Addressable Market</p>
                          <p className="text-2xl font-bold text-primary">$400B+</p>
                          <p className="text-muted-foreground">US Service Industry</p>
                        </div>
                        <div>
                          <p className="font-medium">Target Contractors</p>
                          <p className="text-2xl font-bold text-primary">2.3M+</p>
                          <p className="text-muted-foreground">Small-Medium Businesses</p>
                        </div>
                        <div>
                          <p className="font-medium">Average Annual Revenue</p>
                          <p className="text-2xl font-bold text-primary">$850K</p>
                          <p className="text-muted-foreground">Per Contractor</p>
                        </div>
                        <div>
                          <p className="font-medium">Software Adoption</p>
                          <p className="text-2xl font-bold text-primary">35%</p>
                          <p className="text-muted-foreground">Currently Using Modern Tools</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Value Proposition</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Increase Revenue</span>
                          <Badge variant="secondary">+25-40%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Reduce Administrative Time</span>
                          <Badge variant="secondary">-60%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Improve Customer Satisfaction</span>
                          <Badge variant="secondary">+50%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Faster Job Completion</span>
                          <Badge variant="secondary">-30%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market-opportunity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Market Opportunity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Industry Pain Points</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium text-destructive">Manual Processes</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            78% of contractors still use paper-based estimates and manual scheduling
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium text-destructive">Disconnected Tools</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Average contractor uses 6+ separate tools that don't communicate
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium text-destructive">Poor Job Costing</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            60% can't accurately track project profitability in real-time
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium text-destructive">Customer Communication</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Limited visibility for customers leads to trust issues and disputes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Target Market Segments</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <h4 className="font-medium">Primary: Small-Medium Contractors</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            5-50 employees, $500K-$5M annual revenue
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">Plumbing</Badge>
                            <Badge variant="outline" className="text-xs">HVAC</Badge>
                            <Badge variant="outline" className="text-xs">Electrical</Badge>
                          </div>
                        </div>
                        <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                          <h4 className="font-medium">Secondary: Home Services</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Handyman, landscaping, cleaning services
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">Handyman</Badge>
                            <Badge variant="outline" className="text-xs">Landscaping</Badge>
                            <Badge variant="outline" className="text-xs">Cleaning</Badge>
                          </div>
                        </div>
                        <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                          <h4 className="font-medium">Tertiary: Specialized Services</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pool services, pest control, security installation
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">Pool Service</Badge>
                            <Badge variant="outline" className="text-xs">Pest Control</Badge>
                            <Badge variant="outline" className="text-xs">Security</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Market Size & Growth</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Addressable Market (TAM)</span>
                          <span className="font-medium">$400B+</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Serviceable Addressable Market (SAM)</span>
                          <span className="font-medium">$50B</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Serviceable Obtainable Market (SOM)</span>
                          <span className="font-medium">$2.5B</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Growth Rate</span>
                          <span className="font-medium text-green-600">+8.2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform-overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Platform Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Estimate Management</h3>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Professional estimate creation</li>
                        <li>• Digital customer approval</li>
                        <li>• Automated follow-up sequences</li>
                        <li>• Template library for common jobs</li>
                        <li>• Real-time pricing updates</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Wrench className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Job Management</h3>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Project tracking and scheduling</li>
                        <li>• Resource allocation and planning</li>
                        <li>• Progress monitoring and updates</li>
                        <li>• Document and photo management</li>
                        <li>• Subcontractor coordination</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Customer Portal</h3>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Self-service customer dashboard</li>
                        <li>• Real-time project updates</li>
                        <li>• Digital document signing</li>
                        <li>• Secure payment processing</li>
                        <li>• Communication history</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Calculator className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Financial Management</h3>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Real-time job costing</li>
                        <li>• Profitability analysis</li>
                        <li>• Automated invoicing</li>
                        <li>• Expense tracking</li>
                        <li>• Financial reporting</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Mobile Field App</h3>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Time tracking and clock in/out</li>
                        <li>• Material usage logging</li>
                        <li>• Photo and note capture</li>
                        <li>• Customer signature collection</li>
                        <li>• Offline functionality</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Analytics & Reporting</h3>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Business performance dashboards</li>
                        <li>• Predictive analytics</li>
                        <li>• Custom report builder</li>
                        <li>• KPI tracking and alerts</li>
                        <li>• Export capabilities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-capabilities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">AI Estimate Generator</h3>
                        <Badge variant="secondary">GPT-4 Powered</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Generate accurate estimates from simple project descriptions using advanced AI
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li>• Natural language project input</li>
                        <li>• Automatic material calculation</li>
                        <li>• Labor hour estimation</li>
                        <li>• Local pricing integration</li>
                        <li>• Historical data learning</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">AI Customer Service</h3>
                        <Badge variant="secondary">24/7 Available</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Intelligent chatbot handles customer inquiries and provides instant support
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li>• Appointment scheduling</li>
                        <li>• Service status updates</li>
                        <li>• FAQ automation</li>
                        <li>• Lead qualification</li>
                        <li>• Escalation to human agents</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold">Predictive Analytics</h3>
                        <Badge variant="secondary">Machine Learning</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        AI analyzes patterns to provide business insights and recommendations
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li>• Revenue forecasting</li>
                        <li>• Demand prediction</li>
                        <li>• Optimal pricing suggestions</li>
                        <li>• Risk assessment</li>
                        <li>• Performance optimization</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-orange-600" />
                        <h3 className="font-semibold">Smart Recommendations</h3>
                        <Badge variant="secondary">Personalized</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        AI provides personalized recommendations based on business data
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li>• Upsell opportunities</li>
                        <li>• Resource optimization</li>
                        <li>• Customer retention strategies</li>
                        <li>• Efficiency improvements</li>
                        <li>• Growth opportunities</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border rounded-lg">
                  <h3 className="font-semibold mb-3">AI Training & Learning Capabilities</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="font-medium mb-2">Data Sources</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Historical job data</li>
                        <li>• Market pricing trends</li>
                        <li>• Customer behavior patterns</li>
                        <li>• Industry benchmarks</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Learning Models</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Natural language processing</li>
                        <li>• Computer vision for images</li>
                        <li>• Predictive modeling</li>
                        <li>• Pattern recognition</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Continuous Improvement</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Real-time model updates</li>
                        <li>• User feedback integration</li>
                        <li>• Performance monitoring</li>
                        <li>• Accuracy optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical-architecture" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Technical Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-2">Frontend</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">React 18</Badge>
                            <Badge variant="outline">TypeScript</Badge>
                            <Badge variant="outline">Tailwind CSS</Badge>
                            <Badge variant="outline">Vite</Badge>
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-2">Backend</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Supabase</Badge>
                            <Badge variant="outline">PostgreSQL</Badge>
                            <Badge variant="outline">Edge Functions</Badge>
                            <Badge variant="outline">Real-time APIs</Badge>
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-2">AI & Integrations</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">OpenAI GPT-4</Badge>
                            <Badge variant="outline">GoHighLevel</Badge>
                            <Badge variant="outline">Stripe</Badge>
                            <Badge variant="outline">Webhook APIs</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Security & Compliance</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Data Security</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• End-to-end encryption</li>
                            <li>• Row-level security (RLS)</li>
                            <li>• GDPR compliance</li>
                            <li>• SOC 2 Type II ready</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Infrastructure</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• 99.9% uptime SLA</li>
                            <li>• Auto-scaling capabilities</li>
                            <li>• Global CDN distribution</li>
                            <li>• Automated backups</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <h4 className="font-medium text-purple-800 mb-2">Monitoring</h4>
                          <ul className="text-sm text-purple-700 space-y-1">
                            <li>• Real-time performance monitoring</li>
                            <li>• Error tracking and alerts</li>
                            <li>• Security audit logs</li>
                            <li>• Usage analytics</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border rounded-lg">
                  <h3 className="font-semibold mb-3">Scalability & Performance</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">99.9%</p>
                      <p className="text-sm text-muted-foreground">Uptime SLA</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">&lt;200ms</p>
                      <p className="text-sm text-muted-foreground">API Response Time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">10K+</p>
                      <p className="text-sm text-muted-foreground">Concurrent Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">24/7</p>
                      <p className="text-sm text-muted-foreground">Support Monitoring</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business-model" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Business Model & Revenue Streams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Pricing Strategy</h3>
                      <div className="space-y-3">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Starter Plan</h4>
                            <Badge variant="outline">$99/month</Badge>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Up to 3 users</li>
                            <li>• 100 estimates/month</li>
                            <li>• Basic reporting</li>
                            <li>• Email support</li>
                          </ul>
                        </div>
                        <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Professional Plan</h4>
                            <Badge>$199/month</Badge>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Up to 10 users</li>
                            <li>• Unlimited estimates</li>
                            <li>• AI features included</li>
                            <li>• Advanced reporting</li>
                            <li>• Phone support</li>
                          </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Enterprise Plan</h4>
                            <Badge variant="outline">$399/month</Badge>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Unlimited users</li>
                            <li>• Custom integrations</li>
                            <li>• White-label options</li>
                            <li>• Dedicated support</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Revenue Projections</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Year 1 Targets</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Active Customers</span>
                              <span className="font-medium">500</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Average Revenue Per User</span>
                              <span className="font-medium">$150/month</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Annual Recurring Revenue</span>
                              <span className="font-medium text-green-600">$900K</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Year 3 Projections</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Active Customers</span>
                              <span className="font-medium">5,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Average Revenue Per User</span>
                              <span className="font-medium">$180/month</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Annual Recurring Revenue</span>
                              <span className="font-medium text-blue-600">$10.8M</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Additional Revenue Streams</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Payment Processing (2.9%)</span>
                          <Badge variant="secondary">Transaction Fees</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Premium Integrations</span>
                          <Badge variant="secondary">$50/month</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Custom Development</span>
                          <Badge variant="secondary">Project-based</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Training & Onboarding</span>
                          <Badge variant="secondary">$500/setup</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitive-advantage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Competitive Advantages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Differentiators</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">AI-First Approach</h4>
                          <p className="text-sm text-blue-700">
                            Native AI integration throughout the platform, not an afterthought. 
                            Our AI learns from industry data to provide superior estimates and insights.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Industry Specialization</h4>
                          <p className="text-sm text-green-700">
                            Built specifically for service contractors with deep understanding of 
                            their workflows, terminology, and business processes.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg">
                          <h4 className="font-medium text-purple-800 mb-2">Real-time Job Costing</h4>
                          <p className="text-sm text-purple-700">
                            Live profitability tracking with instant alerts for cost overruns, 
                            something most competitors don't offer effectively.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Competitive Landscape</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">ServiceTitan</h4>
                            <Badge variant="destructive">Expensive</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            $300+/month, complex setup, overkill for smaller contractors
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Jobber</h4>
                            <Badge variant="secondary">Limited AI</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Good basics but lacks AI features and advanced analytics
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">HousePro</h4>
                            <Badge variant="secondary">Basic Features</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Simple tool but missing integrations and mobile capabilities
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h3 className="font-semibold text-primary mb-2">Our Advantage</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• 50% lower total cost of ownership</li>
                        <li>• 3x faster implementation time</li>
                        <li>• Superior mobile experience</li>
                        <li>• AI-powered automation</li>
                        <li>• Industry-specific templates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Implementation Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-3 text-primary">Phase 1: Foundation (Months 1-3)</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Core platform features
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Basic AI integration
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Customer portal
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Mobile app beta
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Initial customer onboarding
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-3 text-orange-600">Phase 2: Growth (Months 4-8)</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Advanced AI features
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          CRM integrations
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Payment processing
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          API marketplace
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Scale to 1000+ customers
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-3 text-blue-600">Phase 3: Scale (Months 9-12)</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Enterprise features
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          White-label solutions
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          International expansion
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Advanced analytics
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          IPO preparation
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-lg">
                    <h3 className="font-semibold mb-3">Key Success Metrics</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">500</p>
                        <p className="text-sm text-muted-foreground">Paying Customers (Year 1)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">95%</p>
                        <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">&lt;5%</p>
                        <p className="text-sm text-muted-foreground">Monthly Churn Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">$10M</p>
                        <p className="text-sm text-muted-foreground">ARR by Year 3</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-3">Go-to-Market Strategy</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Direct sales to target contractors</li>
                        <li>• Industry trade show presence</li>
                        <li>• Content marketing and SEO</li>
                        <li>• Partner channel development</li>
                        <li>• Referral program implementation</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Risk Mitigation</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Diverse customer acquisition channels</li>
                        <li>• Strong customer retention focus</li>
                        <li>• Agile development methodology</li>
                        <li>• Robust data security measures</li>
                        <li>• Strategic partnership agreements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/guide">
                <FileText className="h-4 w-4 mr-2" />
                User Guide
              </Link>
            </Button>
            <Button onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF Version
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FoundersGuidePage;