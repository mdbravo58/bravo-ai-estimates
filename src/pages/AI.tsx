import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerChatWidget } from "@/components/ai/CustomerChatWidget";
import { AIEstimateGenerator } from "@/components/ai/AIEstimateGenerator";
import { VoiceAssistant } from "@/components/ai/VoiceAssistant";
import { AIAnalyticsDashboard } from "@/components/ai/AIAnalyticsDashboard";
import { 
  HelpCircle, 
  FileText, 
  Mic, 
  BarChart3,
  Brain,
  BookOpen
} from "lucide-react";

const AIPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">AI Assistant Suite</h1>
            <p className="text-muted-foreground">
              Powerful AI tools to automate and enhance your business operations
            </p>
          </div>
        </div>

        <Tabs defaultValue="guide" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Software Guide
            </TabsTrigger>
            <TabsTrigger value="estimates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Estimate AI
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Assistant
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              AI Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guide" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  AI Software Guide
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      In-App Software Help
                    </h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Navigate the dashboard and features</li>
                      <li>• Learn how to create jobs and estimates</li>
                      <li>• Understand scheduling and team management</li>
                      <li>• Get help with reports and analytics</li>
                      <li>• Find settings and configuration options</li>
                      <li>• Quick answers about any feature</li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click the help widget in the bottom right to get instant guidance on using the Bravo Service Suite.
                    Ask questions about any feature and get step-by-step instructions.
                  </p>
                </div>
              </div>
              <div className="relative h-96 border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Help guide is active</p>
                  <p className="text-sm text-muted-foreground">Click the help icon in the bottom right</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="estimates" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                AI Estimate Generator
              </h2>
              <p className="text-muted-foreground mb-6">
                Generate professional estimates automatically from customer descriptions using AI.
                The AI analyzes the request and provides detailed pricing based on your standard rates.
              </p>
              <AIEstimateGenerator />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mic className="h-6 w-6 text-primary" />
                AI Voice Assistant
              </h2>
              <p className="text-muted-foreground mb-6">
                Handle customer calls with AI voice processing. Transcribe speech, process requests,
                and respond with natural voice synthesis.
              </p>
              <VoiceAssistant />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                AI Business Analytics
              </h2>
              <p className="text-muted-foreground mb-6">
                Get AI-powered insights into your business performance. Analyze trends, identify opportunities,
                and receive actionable recommendations for growth.
              </p>
              <AIAnalyticsDashboard />
            </div>
        </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AIPage;