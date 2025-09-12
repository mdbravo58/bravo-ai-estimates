import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Wrench, 
  Calculator, 
  DollarSign, 
  Settings, 
  Smartphone,
  ClipboardList,
  TrendingUp
} from "lucide-react";

const GuidePage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bravo Service Suite User Guide</h1>
          <p className="text-muted-foreground mt-2">
            Complete guide to managing your service business with Bravo Service Suite
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="estimates">Estimates</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Welcome to Bravo Service Suite
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Bravo Service Suite is a comprehensive business management platform designed for service-based companies. 
                  It helps you manage every aspect of your business from lead generation to project completion.
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Key Features:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Estimate creation and management</li>
                      <li>• Job tracking and project management</li>
                      <li>• Customer relationship management</li>
                      <li>• Pricing tools and calculators</li>
                      <li>• Financial reporting and analytics</li>
                      <li>• Mobile field technician app</li>
                      <li>• Billing and payment processing</li>
                      <li>• Team collaboration tools</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Getting Started:</h3>
                    <ol className="space-y-1 text-sm">
                      <li>1. Set up your organization profile</li>
                      <li>2. Add your team members</li>
                      <li>3. Import or create customer database</li>
                      <li>4. Configure your pricing structure</li>
                      <li>5. Start creating estimates</li>
                      <li>6. Convert estimates to jobs</li>
                      <li>7. Track progress and billing</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Dashboard Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>The dashboard provides a comprehensive overview of your business performance and quick access to key functions.</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      Key Metrics <Badge variant="secondary">Real-time</Badge>
                    </h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• <strong>Total Estimates:</strong> Number of estimates created this month</li>
                      <li>• <strong>Active Customers:</strong> Customers with ongoing or recent projects</li>
                      <li>• <strong>Monthly Revenue:</strong> Revenue generated in the current month</li>
                      <li>• <strong>Conversion Rate:</strong> Percentage of estimates converted to jobs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Recent Activity</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• View recently created estimates</li>
                      <li>• Track estimate status (pending, approved, declined)</li>
                      <li>• Quick actions for follow-ups</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Quick Actions</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Create new estimate</li>
                      <li>• Access job costing tools</li>
                      <li>• Open mobile technician interface</li>
                      <li>• Add new customers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estimates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Estimates & Proposals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Create professional estimates and proposals to win more business.</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Creating Estimates</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Select customer or create new customer profile</li>
                      <li>• Add project details and scope of work</li>
                      <li>• Include labor, materials, and overhead costs</li>
                      <li>• Apply markup and profit margins</li>
                      <li>• Add terms and conditions</li>
                      <li>• Generate professional PDF proposals</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Estimate Management</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Track estimate status and customer responses</li>
                      <li>• Send follow-up reminders</li>
                      <li>• Revise and update estimates</li>
                      <li>• Convert approved estimates to jobs</li>
                      <li>• Archive or delete outdated estimates</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Customer Portal</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Customers can view estimates online</li>
                      <li>• Digital approval and signature capture</li>
                      <li>• Secure payment processing</li>
                      <li>• Document sharing and communication</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Job Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Track and manage all aspects of your active projects from start to finish.</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Job Creation & Setup</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Convert approved estimates to active jobs</li>
                      <li>• Assign project managers and technicians</li>
                      <li>• Set project timelines and milestones</li>
                      <li>• Configure cost codes and budget tracking</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Project Tracking</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Monitor job progress and status updates</li>
                      <li>• Track labor hours and material costs</li>
                      <li>• Upload photos and project documentation</li>
                      <li>• Manage subcontractor work and billing</li>
                      <li>• Real-time budget vs. actual cost analysis</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Job Status Workflow</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• <Badge variant="outline">Estimate</Badge> - Initial proposal phase</li>
                      <li>• <Badge variant="outline">Scheduled</Badge> - Job approved and scheduled</li>
                      <li>• <Badge variant="outline">In Progress</Badge> - Active work on-site</li>
                      <li>• <Badge variant="outline">Completed</Badge> - Work finished, ready for billing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Maintain detailed customer profiles and relationship history.</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Customer Profiles</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Store contact information and addresses</li>
                      <li>• Track customer preferences and notes</li>
                      <li>• Maintain service history and past projects</li>
                      <li>• Set up recurring service schedules</li>
                      <li>• Manage payment terms and credit limits</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Customer Communication</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Send estimates and invoices via email</li>
                      <li>• Track communication history</li>
                      <li>• Automated follow-up reminders</li>
                      <li>• Customer portal access for self-service</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Search & Organization</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Search by name, phone, email, or address</li>
                      <li>• Filter by customer type or status</li>
                      <li>• Sort by recent activity or total value</li>
                      <li>• Export customer lists for marketing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Pricing Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Manage your pricing structure and use built-in calculators for accurate estimates.</p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Price Books</h4>
                      <ul className="space-y-1 text-sm mt-2">
                        <li>• Maintain standardized pricing for services</li>
                        <li>• Set different pricing tiers (Residential, Commercial)</li>
                        <li>• Include labor rates and material costs</li>
                        <li>• Update pricing seasonally or by market</li>
                        <li>• Apply automatic markups and overhead</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Price Calculator</h4>
                      <ul className="space-y-1 text-sm mt-2">
                        <li>• Calculate material quantities and costs</li>
                        <li>• Estimate labor hours for different tasks</li>
                        <li>• Include equipment and tool rentals</li>
                        <li>• Factor in permits and inspection fees</li>
                        <li>• Generate detailed cost breakdowns</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold">Cost Management</h4>
                  <ul className="space-y-1 text-sm mt-2">
                    <li>• Track actual vs. estimated costs</li>
                    <li>• Analyze profitability by job type</li>
                    <li>• Identify cost overruns and their causes</li>
                    <li>• Optimize pricing based on historical data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Reports & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Gain insights into your business performance with comprehensive reporting tools.</p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Financial Reports</h4>
                      <ul className="space-y-1 text-sm mt-2">
                        <li>• Revenue and profit analysis</li>
                        <li>• Cash flow statements</li>
                        <li>• Accounts receivable aging</li>
                        <li>• Expense tracking and categorization</li>
                        <li>• Tax preparation reports</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">Operational Reports</h4>
                      <ul className="space-y-1 text-sm mt-2">
                        <li>• Job profitability analysis</li>
                        <li>• Technician productivity metrics</li>
                        <li>• Material usage and waste tracking</li>
                        <li>• Equipment utilization rates</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Sales & Marketing</h4>
                      <ul className="space-y-1 text-sm mt-2">
                        <li>• Lead conversion rates</li>
                        <li>• Estimate win/loss analysis</li>
                        <li>• Customer acquisition costs</li>
                        <li>• Referral source tracking</li>
                        <li>• Customer lifetime value</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">Custom Dashboards</h4>
                      <ul className="space-y-1 text-sm mt-2">
                        <li>• Create personalized KPI dashboards</li>
                        <li>• Set up automated report delivery</li>
                        <li>• Export data to Excel or PDF</li>
                        <li>• Share reports with stakeholders</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile Technician App
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Empower your field technicians with mobile tools for time tracking, documentation, and real-time updates.</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Time Tracking</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Clock in/out with GPS verification</li>
                      <li>• Track time by job and cost code</li>
                      <li>• Add break times and travel hours</li>
                      <li>• Submit daily timesheets for approval</li>
                      <li>• View schedule and upcoming jobs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Job Documentation</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Take photos of work progress</li>
                      <li>• Record before/after conditions</li>
                      <li>• Document material usage and waste</li>
                      <li>• Add notes and observations</li>
                      <li>• Capture customer signatures</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Material Management</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Record material usage in real-time</li>
                      <li>• Scan barcodes for accurate tracking</li>
                      <li>• Request additional materials</li>
                      <li>• Upload receipts and invoices</li>
                      <li>• Track inventory levels</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Communication</h4>
                    <ul className="space-y-1 text-sm mt-2">
                      <li>• Update job status in real-time</li>
                      <li>• Communicate with office and customers</li>
                      <li>• Access job details and specifications</li>
                      <li>• Report issues or delays immediately</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Getting Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold">Training Resources</h4>
                <ul className="space-y-1 text-sm mt-2">
                  <li>• Video tutorials for each feature</li>
                  <li>• Step-by-step setup guides</li>
                  <li>• Best practices documentation</li>
                  <li>• Webinar training sessions</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold">Support Options</h4>
                <ul className="space-y-1 text-sm mt-2">
                  <li>• Live chat support during business hours</li>
                  <li>• Email support for technical issues</li>
                  <li>• Phone support for urgent matters</li>
                  <li>• Community forum for user questions</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Need immediate help? Contact our support team at{" "}
                <span className="font-medium">support@bravoservice.com</span> or call{" "}
                <span className="font-medium">1-800-BRAVO-SERVICE</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GuidePage;