import { useEffect } from "react";

const GuideExportPage = () => {
  useEffect(() => {
    // Set page title for PDF generation
    document.title = "Bravo Service Suite - Founders Guide";
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black print:p-4">
      {/* Cover Page */}
      <div className="text-center mb-12 page-break-after">
        <h1 className="text-6xl font-bold mb-4 text-blue-600">Bravo Service Suite</h1>
        <h2 className="text-3xl font-semibold mb-8 text-gray-600">Founders Guide & Business Overview</h2>
        <div className="text-lg text-gray-500 mb-12">
          Complete Business Management Platform for Service Contractors
        </div>
        <div className="border-t border-gray-300 pt-8">
          <p className="text-sm text-gray-400">Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Executive Summary */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-2">Executive Summary</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">The Opportunity</h3>
          <p className="mb-4 leading-relaxed">
            The service contractor industry represents a $400+ billion market that remains largely underserved 
            by modern software solutions. Most contractors still rely on manual processes, spreadsheets, 
            and disconnected tools that limit growth and profitability. Our research shows that 78% of 
            contractors still use paper-based estimates and manual scheduling, while 60% cannot accurately 
            track project profitability in real-time.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Our Solution</h3>
          <p className="mb-4 leading-relaxed">
            Bravo Service Suite is a comprehensive, AI-powered business management platform specifically 
            designed for service contractors. We integrate every aspect of the business workflow from 
            lead generation to project completion and billing, providing contractors with the tools they 
            need to scale efficiently and profitably.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Key Differentiators</h3>
            <ul className="space-y-2">
              <li>• AI-powered estimate generation and customer service</li>
              <li>• Native CRM integration (GoHighLevel)</li>
              <li>• Real-time job costing and profitability tracking</li>
              <li>• Mobile-first field technician interface</li>
              <li>• Industry-specific workflows and templates</li>
              <li>• Comprehensive analytics and business intelligence</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Market Metrics</h3>
            <div className="space-y-3">
              <div className="border p-3 rounded">
                <div className="font-bold text-2xl text-blue-600">$400B+</div>
                <div className="text-sm text-gray-600">Total Addressable Market</div>
              </div>
              <div className="border p-3 rounded">
                <div className="font-bold text-2xl text-blue-600">2.3M+</div>
                <div className="text-sm text-gray-600">Target Contractors</div>
              </div>
              <div className="border p-3 rounded">
                <div className="font-bold text-2xl text-blue-600">35%</div>
                <div className="text-sm text-gray-600">Current Software Adoption</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-2">Market Opportunity</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Industry Pain Points</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-600 mb-2">Manual Processes</h4>
              <p className="text-sm">78% of contractors still use paper-based estimates and manual scheduling</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-600 mb-2">Disconnected Tools</h4>
              <p className="text-sm">Average contractor uses 6+ separate tools that don't communicate</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-600 mb-2">Poor Job Costing</h4>
              <p className="text-sm">60% can't accurately track project profitability in real-time</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-600 mb-2">Customer Communication</h4>
              <p className="text-sm">Limited visibility for customers leads to trust issues and disputes</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Target Market Segments</h3>
          <div className="space-y-4">
            <div className="border border-blue-200 p-4 rounded bg-blue-50">
              <h4 className="font-semibold text-blue-800">Primary: Small-Medium Contractors</h4>
              <p className="text-sm text-blue-700">5-50 employees, $500K-$5M annual revenue</p>
              <p className="text-sm text-blue-600 mt-2">Industries: Plumbing, HVAC, Electrical, General Contracting</p>
            </div>
            <div className="border border-gray-200 p-4 rounded">
              <h4 className="font-semibold">Secondary: Home Services</h4>
              <p className="text-sm text-gray-700">Handyman, landscaping, cleaning services</p>
            </div>
            <div className="border border-gray-200 p-4 rounded">
              <h4 className="font-semibold">Tertiary: Specialized Services</h4>
              <p className="text-sm text-gray-700">Pool services, pest control, security installation</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded">
          <h3 className="text-xl font-semibold mb-4">Market Size & Growth</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">$400B+</div>
              <div className="text-sm text-gray-600">Total Addressable Market</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">$50B</div>
              <div className="text-sm text-gray-600">Serviceable Addressable Market</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">$2.5B</div>
              <div className="text-sm text-gray-600">Serviceable Obtainable Market</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">+8.2%</div>
              <div className="text-sm text-gray-600">Annual Growth Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-2">Platform Overview</h2>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-3 text-blue-600">Estimate Management</h3>
            <ul className="text-sm space-y-1">
              <li>• Professional estimate creation</li>
              <li>• Digital customer approval</li>
              <li>• Automated follow-up sequences</li>
              <li>• Template library for common jobs</li>
              <li>• Real-time pricing updates</li>
            </ul>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-3 text-blue-600">Job Management</h3>
            <ul className="text-sm space-y-1">
              <li>• Project tracking and scheduling</li>
              <li>• Resource allocation and planning</li>
              <li>• Progress monitoring and updates</li>
              <li>• Document and photo management</li>
              <li>• Subcontractor coordination</li>
            </ul>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-3 text-blue-600">Customer Portal</h3>
            <ul className="text-sm space-y-1">
              <li>• Self-service customer dashboard</li>
              <li>• Real-time project updates</li>
              <li>• Digital document signing</li>
              <li>• Secure payment processing</li>
              <li>• Communication history</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-3 text-blue-600">Financial Management</h3>
            <ul className="text-sm space-y-1">
              <li>• Real-time job costing</li>
              <li>• Profitability analysis</li>
              <li>• Automated invoicing</li>
              <li>• Expense tracking</li>
              <li>• Financial reporting</li>
            </ul>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-3 text-blue-600">Mobile Field App</h3>
            <ul className="text-sm space-y-1">
              <li>• Time tracking and clock in/out</li>
              <li>• Material usage logging</li>
              <li>• Photo and note capture</li>
              <li>• Customer signature collection</li>
              <li>• Offline functionality</li>
            </ul>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-3 text-blue-600">Analytics & Reporting</h3>
            <ul className="text-sm space-y-1">
              <li>• Business performance dashboards</li>
              <li>• Predictive analytics</li>
              <li>• Custom report builder</li>
              <li>• KPI tracking and alerts</li>
              <li>• Export capabilities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-2">AI-Powered Features</h2>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="border border-blue-200 p-6 rounded bg-blue-50">
            <h3 className="font-semibold mb-3 text-blue-800">AI Estimate Generator</h3>
            <p className="text-sm text-blue-700 mb-3">
              Generate accurate estimates from simple project descriptions using advanced AI
            </p>
            <ul className="text-sm space-y-1">
              <li>• Natural language project input</li>
              <li>• Automatic material calculation</li>
              <li>• Labor hour estimation</li>
              <li>• Local pricing integration</li>
              <li>• Historical data learning</li>
            </ul>
          </div>
          <div className="border border-green-200 p-6 rounded bg-green-50">
            <h3 className="font-semibold mb-3 text-green-800">AI Customer Service</h3>
            <p className="text-sm text-green-700 mb-3">
              Intelligent chatbot handles customer inquiries and provides instant support
            </p>
            <ul className="text-sm space-y-1">
              <li>• Appointment scheduling</li>
              <li>• Service status updates</li>
              <li>• FAQ automation</li>
              <li>• Lead qualification</li>
              <li>• Escalation to human agents</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="border border-purple-200 p-6 rounded bg-purple-50">
            <h3 className="font-semibold mb-3 text-purple-800">Predictive Analytics</h3>
            <p className="text-sm text-purple-700 mb-3">
              AI analyzes patterns to provide business insights and recommendations
            </p>
            <ul className="text-sm space-y-1">
              <li>• Revenue forecasting</li>
              <li>• Demand prediction</li>
              <li>• Optimal pricing suggestions</li>
              <li>• Risk assessment</li>
              <li>• Performance optimization</li>
            </ul>
          </div>
          <div className="border border-orange-200 p-6 rounded bg-orange-50">
            <h3 className="font-semibold mb-3 text-orange-800">Smart Recommendations</h3>
            <p className="text-sm text-orange-700 mb-3">
              AI provides personalized recommendations based on business data
            </p>
            <ul className="text-sm space-y-1">
              <li>• Upsell opportunities</li>
              <li>• Resource optimization</li>
              <li>• Customer retention strategies</li>
              <li>• Efficiency improvements</li>
              <li>• Growth opportunities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-2">Technical Architecture</h2>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Technology Stack</h3>
            <div className="space-y-4">
              <div className="border p-3 rounded">
                <h4 className="font-semibold mb-2">Frontend</h4>
                <p className="text-sm">React 18, TypeScript, Tailwind CSS, Vite</p>
              </div>
              <div className="border p-3 rounded">
                <h4 className="font-semibold mb-2">Backend</h4>
                <p className="text-sm">Supabase, PostgreSQL, Edge Functions, Real-time APIs</p>
              </div>
              <div className="border p-3 rounded">
                <h4 className="font-semibold mb-2">AI & Integrations</h4>
                <p className="text-sm">OpenAI GPT-4, GoHighLevel, Stripe, Webhook APIs</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Security & Compliance</h3>
            <div className="space-y-4">
              <div className="border border-green-200 p-3 rounded bg-green-50">
                <h4 className="font-semibold text-green-800 mb-2">Data Security</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• End-to-end encryption</li>
                  <li>• Row-level security (RLS)</li>
                  <li>• GDPR compliance</li>
                  <li>• SOC 2 Type II ready</li>
                </ul>
              </div>
              <div className="border border-blue-200 p-3 rounded bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-2">Infrastructure</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 99.9% uptime SLA</li>
                  <li>• Auto-scaling capabilities</li>
                  <li>• Global CDN distribution</li>
                  <li>• Automated backups</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded">
          <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime SLA</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">&lt;200ms</div>
              <div className="text-sm text-gray-600">API Response Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600">Concurrent Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Support Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-2">Business Model & Revenue</h2>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Pricing Strategy</h3>
            <div className="space-y-3">
              <div className="border p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Starter Plan</h4>
                  <span className="font-bold text-blue-600">$99/month</span>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Up to 3 users</li>
                  <li>• 100 estimates/month</li>
                  <li>• Basic reporting</li>
                  <li>• Email support</li>
                </ul>
              </div>
              <div className="border-2 border-blue-500 p-4 rounded bg-blue-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Professional Plan</h4>
                  <span className="font-bold text-blue-600">$199/month</span>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Up to 10 users</li>
                  <li>• Unlimited estimates</li>
                  <li>• AI features included</li>
                  <li>• Advanced reporting</li>
                  <li>• Phone support</li>
                </ul>
              </div>
              <div className="border p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Enterprise Plan</h4>
                  <span className="font-bold text-blue-600">$399/month</span>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Unlimited users</li>
                  <li>• Custom integrations</li>
                  <li>• White-label options</li>
                  <li>• Dedicated support</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Revenue Projections</h3>
            <div className="space-y-4">
              <div className="border border-green-200 p-4 rounded bg-green-50">
                <h4 className="font-semibold text-green-800 mb-3">Year 1 Targets</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Customers</span>
                    <span className="font-bold">500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Revenue Per User</span>
                    <span className="font-bold">$150/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Recurring Revenue</span>
                    <span className="font-bold text-green-600">$900K</span>
                  </div>
                </div>
              </div>
              <div className="border border-blue-200 p-4 rounded bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-3">Year 3 Projections</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Customers</span>
                    <span className="font-bold">5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Revenue Per User</span>
                    <span className="font-bold">$180/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Recurring Revenue</span>
                    <span className="font-bold text-blue-600">$10.8M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Additional Revenue Streams</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="border p-3 rounded text-center">
              <div className="font-semibold">Payment Processing</div>
              <div className="text-sm text-gray-600">2.9% transaction fees</div>
            </div>
            <div className="border p-3 rounded text-center">
              <div className="font-semibold">Premium Integrations</div>
              <div className="text-sm text-gray-600">$50/month</div>
            </div>
            <div className="border p-3 rounded text-center">
              <div className="font-semibold">Custom Development</div>
              <div className="text-sm text-gray-600">Project-based</div>
            </div>
            <div className="border p-3 rounded text-center">
              <div className="font-semibold">Training & Setup</div>
              <div className="text-sm text-gray-600">$500/setup</div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-2">Competitive Advantages</h2>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Key Differentiators</h3>
            <div className="space-y-4">
              <div className="border border-blue-200 p-4 rounded bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-2">AI-First Approach</h4>
                <p className="text-sm text-blue-700">
                  Native AI integration throughout the platform, not an afterthought. 
                  Our AI learns from industry data to provide superior estimates and insights.
                </p>
              </div>
              <div className="border border-green-200 p-4 rounded bg-green-50">
                <h4 className="font-semibold text-green-800 mb-2">Industry Specialization</h4>
                <p className="text-sm text-green-700">
                  Built specifically for service contractors with deep understanding of 
                  their workflows, terminology, and business processes.
                </p>
              </div>
              <div className="border border-purple-200 p-4 rounded bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-2">Real-time Job Costing</h4>
                <p className="text-sm text-purple-700">
                  Live profitability tracking with instant alerts for cost overruns, 
                  something most competitors don't offer effectively.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Competitive Landscape</h3>
            <div className="space-y-3">
              <div className="border p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">ServiceTitan</h4>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Expensive</span>
                </div>
                <p className="text-sm text-gray-600">
                  $300+/month, complex setup, overkill for smaller contractors
                </p>
              </div>
              <div className="border p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Jobber</h4>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Limited AI</span>
                </div>
                <p className="text-sm text-gray-600">
                  Good basics but lacks AI features and advanced analytics
                </p>
              </div>
              <div className="border p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">HousePro</h4>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Basic Features</span>
                </div>
                <p className="text-sm text-gray-600">
                  Simple tool but missing integrations and mobile capabilities
                </p>
              </div>
            </div>
            <div className="mt-4 border border-blue-200 p-4 rounded bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Our Advantage</h4>
              <ul className="text-sm space-y-1">
                <li>• 50% lower total cost of ownership</li>
                <li>• 3x faster implementation time</li>
                <li>• Superior mobile experience</li>
                <li>• AI-powered automation</li>
                <li>• Industry-specific templates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Roadmap */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-2">Implementation Roadmap</h2>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-3 text-blue-600">Phase 1: Foundation (Months 1-3)</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Core platform features
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Basic AI integration
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Customer portal
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Mobile app beta
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                Initial customer onboarding
              </li>
            </ul>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-3 text-orange-600">Phase 2: Growth (Months 4-8)</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                Advanced AI features
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                CRM integrations
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                Payment processing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                API marketplace
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                Scale to 1000+ customers
              </li>
            </ul>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-3 text-blue-600">Phase 3: Scale (Months 9-12)</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                Enterprise features
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                White-label solutions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                International expansion
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                Advanced analytics
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                IPO preparation
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded mb-8">
          <h3 className="text-xl font-semibold mb-4">Key Success Metrics</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">500</div>
              <div className="text-sm text-gray-600">Paying Customers (Year 1)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">&lt;5%</div>
              <div className="text-sm text-gray-600">Monthly Churn Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">$10M</div>
              <div className="text-sm text-gray-600">ARR by Year 3</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
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
      </section>

      {/* Contact Information */}
      <section className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Contact Information</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Business Development</h3>
            <p className="text-sm text-gray-600">
              For partnership opportunities, investment inquiries, and business development discussions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Technical Information</h3>
            <p className="text-sm text-gray-600">
              For detailed technical specifications, integration requirements, and system architecture discussions.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This document was generated on {new Date().toLocaleDateString()} from the Bravo Service Suite platform.</p>
          <p>For the most up-to-date information, please visit our live platform demonstration.</p>
        </div>
      </section>

      <style>{`
        @media print {
          .page-break-after {
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
};

export default GuideExportPage;