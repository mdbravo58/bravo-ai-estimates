import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerChatWidget } from "@/components/ai/CustomerChatWidget";
import { AIEstimateGenerator } from "@/components/ai/AIEstimateGenerator";
import { VoiceAssistant } from "@/components/ai/VoiceAssistant";
import { AIAnalyticsDashboard } from "@/components/ai/AIAnalyticsDashboard";
import { 
  MessageCircle, 
  FileText, 
  Mic, 
  BarChart3,
  Brain,
  Sparkles
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

        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Customer Chat
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

          <TabsContent value="chat" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  AI Customer Service Chat
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      24/7 Customer Support
                    </h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Instant responses to customer inquiries</li>
                      <li>• Schedule appointments automatically</li>
                      <li>• Provide service estimates</li>
                      <li>• Handle emergency requests</li>
                      <li>• Check job status and updates</li>
                      <li>• Answer billing questions</li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click the chat widget in the bottom right to test the AI customer service assistant.
                    It's trained on your business services and can help customers with common requests.
                  </p>
                </div>
              </div>
              <div className="relative h-96 border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Chat widget is active</p>
                  <p className="text-sm text-muted-foreground">Check bottom right corner</p>
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