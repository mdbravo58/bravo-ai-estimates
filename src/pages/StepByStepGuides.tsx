import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  Calculator, 
  Settings, 
  Smartphone,
  ChevronRight,
  CheckCircle,
  Circle
} from "lucide-react";

const StepByStepGuidePage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Step-by-Step Guides</h1>
          <p className="text-muted-foreground mt-2">
            Detailed walkthroughs to help you master every feature in Bravo Service Suite
          </p>
        </div>

        <Tabs defaultValue="first-estimate" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="first-estimate">First Estimate</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>

          <TabsContent value="first-estimate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Creating Your First Estimate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <h4 className="font-semibold">Navigate to Estimates</h4>
                      <p className="text-sm text-muted-foreground">Click "Estimates" in the sidebar, then click "Create New Estimate" button</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <h4 className="font-semibold">Select or Add Customer</h4>
                      <p className="text-sm text-muted-foreground">Choose an existing customer from the dropdown or click "Add New Customer" to create one</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm"><strong>New Customer Fields:</strong></p>
                        <ul className="text-sm mt-1 space-y-1">
                          <li>• Customer Name (required)</li>
                          <li>• Email Address</li>
                          <li>• Phone Number</li>
                          <li>• Service Address</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <h4 className="font-semibold">Enter Project Details</h4>
                      <p className="text-sm text-muted-foreground">Fill in the project information:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• <strong>Project Name:</strong> Brief description (e.g., "Kitchen Plumbing Repair")</li>
                          <li>• <strong>Description:</strong> Detailed scope of work</li>
                          <li>• <strong>Project Address:</strong> Where the work will be performed</li>
                          <li>• <strong>Estimate Valid Until:</strong> Expiration date for pricing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</div>
                    <div>
                      <h4 className="font-semibold">Add Line Items</h4>
                      <p className="text-sm text-muted-foreground">Build your estimate by adding services and materials:</p>
                      <div className="mt-2 space-y-2">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Labor Items:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Description of service</li>
                            <li>• Hours estimate</li>
                            <li>• Hourly rate</li>
                            <li>• Total labor cost</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Material Items:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Item description</li>
                            <li>• Quantity needed</li>
                            <li>• Unit cost</li>
                            <li>• Markup percentage</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">5</div>
                    <div>
                      <h4 className="font-semibold">Apply Overhead & Profit</h4>
                      <p className="text-sm text-muted-foreground">Add business costs and profit margin:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Overhead percentage (typically 10-20%)</li>
                          <li>• Profit margin (typically 15-25%)</li>
                          <li>• Any additional fees (permits, inspections)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">6</div>
                    <div>
                      <h4 className="font-semibold">Review & Send</h4>
                      <p className="text-sm text-muted-foreground">Final steps before sending:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Review all line items and totals</li>
                          <li>• Add terms and conditions</li>
                          <li>• Preview the PDF estimate</li>
                          <li>• Send via email or generate shareable link</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Badge variant="secondary" className="mb-2">Pro Tip</Badge>
                  <p className="text-sm text-muted-foreground">
                    Save time by creating estimate templates for common services. You can duplicate and modify existing estimates for similar projects.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Initial System Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <h4 className="font-semibold">Organization Profile</h4>
                      <p className="text-sm text-muted-foreground">Set up your company information in Settings:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Company name and logo</li>
                          <li>• Business address and contact info</li>
                          <li>• License numbers and certifications</li>
                          <li>• Tax ID and billing information</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <h4 className="font-semibold">Add Team Members</h4>
                      <p className="text-sm text-muted-foreground">Invite your team and assign roles:</p>
                      <div className="mt-2 space-y-2">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Available Roles:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• <strong>Owner:</strong> Full system access</li>
                            <li>• <strong>Manager:</strong> All features except billing</li>
                            <li>• <strong>Sales:</strong> Estimates and customer management</li>
                            <li>• <strong>Technician:</strong> Job tracking and mobile app</li>
                            <li>• <strong>Admin:</strong> Reports and administrative tasks</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <h4 className="font-semibold">Configure Cost Codes</h4>
                      <p className="text-sm text-muted-foreground">Set up job tracking categories:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm">Example cost codes for plumbing:</p>
                        <ul className="text-sm mt-1 space-y-1">
                          <li>• LABOR-001: General Labor</li>
                          <li>• PLUMB-001: Pipe Installation</li>
                          <li>• PLUMB-002: Fixture Installation</li>
                          <li>• PLUMB-003: Drain Cleaning</li>
                          <li>• MATER-001: Materials</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</div>
                    <div>
                      <h4 className="font-semibold">Import Customer Data</h4>
                      <p className="text-sm text-muted-foreground">Bring in existing customer information:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Export from existing CRM/spreadsheet</li>
                          <li>• Use CSV import feature</li>
                          <li>• Verify contact information accuracy</li>
                          <li>• Add service history notes</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">5</div>
                    <div>
                      <h4 className="font-semibold">Set Up Price Books</h4>
                      <p className="text-sm text-muted-foreground">Create standardized pricing:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Common service packages</li>
                          <li>• Labor rates by skill level</li>
                          <li>• Material costs with markup</li>
                          <li>• Emergency/after-hours rates</li>
                        </ul>
                      </div>
                    </div>
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
                  Customer Management Workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <h4 className="font-semibold">Add New Customer</h4>
                      <p className="text-sm text-muted-foreground">Navigate to Customers → Add Customer:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Required Information:</p>
                        <ul className="text-sm mt-1 space-y-1">
                          <li>• Customer name (individual or business)</li>
                          <li>• Primary contact phone number</li>
                          <li>• Email address for communication</li>
                          <li>• Service address (where work is performed)</li>
                          <li>• Billing address (if different)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <h4 className="font-semibold">Customer Profile Setup</h4>
                      <p className="text-sm text-muted-foreground">Complete the customer profile:</p>
                      <div className="mt-2 space-y-2">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Contact Preferences:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Preferred contact method (phone/email/text)</li>
                            <li>• Best times to contact</li>
                            <li>• Emergency contact information</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Service Information:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Property type (residential/commercial)</li>
                            <li>• Special access instructions</li>
                            <li>• Pet information or safety notes</li>
                            <li>• Previous service history</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <h4 className="font-semibold">Search and Filter</h4>
                      <p className="text-sm text-muted-foreground">Find customers quickly:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Use search bar for name, phone, or address</li>
                          <li>• Filter by customer type or status</li>
                          <li>• Sort by recent activity or total value</li>
                          <li>• Use tags for custom categorization</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</div>
                    <div>
                      <h4 className="font-semibold">Communication History</h4>
                      <p className="text-sm text-muted-foreground">Track all customer interactions:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Automatic logging of estimate sends</li>
                          <li>• Phone call notes and outcomes</li>
                          <li>• Email correspondence history</li>
                          <li>• Service appointment notes</li>
                        </ul>
                      </div>
                    </div>
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
                  Pricing Setup & Calculator Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <h4 className="font-semibold">Create Price Books</h4>
                      <p className="text-sm text-muted-foreground">Navigate to Price Books → Add New Price Book:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Price Book Categories:</p>
                        <ul className="text-sm mt-1 space-y-1">
                          <li>• Residential Services</li>
                          <li>• Commercial Services</li>
                          <li>• Emergency/After-Hours</li>
                          <li>• Maintenance Contracts</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <h4 className="font-semibold">Set Labor Rates</h4>
                      <p className="text-sm text-muted-foreground">Configure different labor categories:</p>
                      <div className="mt-2 space-y-2">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Example Rates:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Apprentice: $45/hour</li>
                            <li>• Journeyman: $65/hour</li>
                            <li>• Master Plumber: $85/hour</li>
                            <li>• Emergency Rate: $125/hour</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <h4 className="font-semibold">Material Pricing</h4>
                      <p className="text-sm text-muted-foreground">Add common materials with markup:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Base cost from supplier</li>
                          <li>• Standard markup (typically 100-200%)</li>
                          <li>• Bulk pricing discounts</li>
                          <li>• Seasonal price adjustments</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</div>
                    <div>
                      <h4 className="font-semibold">Using the Calculator</h4>
                      <p className="text-sm text-muted-foreground">Navigate to Calculator for quick estimates:</p>
                      <div className="mt-2 space-y-2">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Calculation Steps:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Select service type</li>
                            <li>• Enter project parameters</li>
                            <li>• Choose labor skill level</li>
                            <li>• Add material requirements</li>
                            <li>• Apply overhead and profit</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Management Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <h4 className="font-semibold">Convert Estimate to Job</h4>
                      <p className="text-sm text-muted-foreground">When customer approves estimate:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Go to approved estimate</li>
                          <li>• Click "Convert to Job" button</li>
                          <li>• System creates job with all estimate details</li>
                          <li>• Job status automatically set to "Scheduled"</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <h4 className="font-semibold">Job Assignment</h4>
                      <p className="text-sm text-muted-foreground">Assign team members and schedule work:</p>
                      <div className="mt-2 space-y-2">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Assignment Fields:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Project Manager (oversight)</li>
                            <li>• Lead Technician (primary worker)</li>
                            <li>• Additional crew members</li>
                            <li>• Start and end dates</li>
                            <li>• Special instructions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <h4 className="font-semibold">Track Progress</h4>
                      <p className="text-sm text-muted-foreground">Monitor job status and costs:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Update job status as work progresses</li>
                          <li>• Review time entries from technicians</li>
                          <li>• Track material usage and costs</li>
                          <li>• Monitor budget vs. actual expenses</li>
                          <li>• Upload progress photos</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</div>
                    <div>
                      <h4 className="font-semibold">Job Completion</h4>
                      <p className="text-sm text-muted-foreground">Close out completed work:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Verify all work is complete</li>
                          <li>• Get customer sign-off</li>
                          <li>• Update job status to "Completed"</li>
                          <li>• Generate invoice for billing</li>
                          <li>• Archive job documentation</li>
                        </ul>
                      </div>
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
                  Mobile App for Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <h4 className="font-semibold">Access Mobile Interface</h4>
                      <p className="text-sm text-muted-foreground">From main dashboard, click "Mobile" in sidebar:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Mobile-optimized interface loads</li>
                          <li>• Shows assigned jobs for the day</li>
                          <li>• GPS integration for job locations</li>
                          <li>• Weather information display</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <h4 className="font-semibold">Start Time Tracking</h4>
                      <p className="text-sm text-muted-foreground">Clock in when arriving at job site:</p>
                      <div className="mt-2 space-y-2">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Time Entry Process:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Select the job from today's list</li>
                            <li>• Tap "Start Time Entry"</li>
                            <li>• Choose appropriate cost code</li>
                            <li>• GPS automatically logs location</li>
                            <li>• Timer begins tracking hours</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <h4 className="font-semibold">Document Work Progress</h4>
                      <p className="text-sm text-muted-foreground">Capture important project information:</p>
                      <div className="mt-2 space-y-2">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Photo Documentation:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Before photos showing problem</li>
                            <li>• Progress photos during work</li>
                            <li>• After photos of completed work</li>
                            <li>• Photos automatically tagged with GPS/time</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Work Notes:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Detailed description of work performed</li>
                            <li>• Any issues or complications encountered</li>
                            <li>• Recommendations for future service</li>
                            <li>• Customer communication notes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</div>
                    <div>
                      <h4 className="font-semibold">Track Materials Used</h4>
                      <p className="text-sm text-muted-foreground">Record material consumption:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Tap "Add Material Entry"</li>
                          <li>• Search for item or scan barcode</li>
                          <li>• Enter quantity used</li>
                          <li>• Assign to appropriate cost code</li>
                          <li>• Upload receipt photo if purchased</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">5</div>
                    <div>
                      <h4 className="font-semibold">Complete Job & Clock Out</h4>
                      <p className="text-sm text-muted-foreground">Finish the job properly:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <ul className="text-sm space-y-1">
                          <li>• Update job status to "Completed"</li>
                          <li>• Get customer signature on mobile device</li>
                          <li>• Stop time tracking</li>
                          <li>• Submit all photos and notes</li>
                          <li>• System syncs data to office</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Badge variant="secondary" className="mb-2">Important</Badge>
                  <p className="text-sm text-muted-foreground">
                    All mobile entries sync in real-time when connected to internet. Offline entries are saved locally and sync when connection is restored.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StepByStepGuidePage;