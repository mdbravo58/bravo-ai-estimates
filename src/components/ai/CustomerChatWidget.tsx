import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { 
  HelpCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Loader2,
  Lightbulb
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CustomerChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const quickHelp = [
  { label: "How do I create an estimate?", icon: "📝" },
  { label: "How do I add a customer?", icon: "👤" },
  { label: "How do I schedule a job?", icon: "📅" },
  { label: "What does this page do?", icon: "❓" },
];

export const CustomerChatWidget: React.FC<CustomerChatWidgetProps> = ({
  isOpen: controlledIsOpen,
  onToggle
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your Bravo Service Suite assistant. I\'m here to help you learn how to use the software. Ask me anything about features, navigation, or how to complete tasks!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const location = useLocation();

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-customer-chat', {
        body: {
          message: userMessage.content,
          conversationHistory,
          currentPage: location.pathname
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickHelp = (question: string) => {
    sendMessage(question);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleToggle}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
          title="Need help? Click for software guide"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[520px] shadow-2xl border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Software Help Guide
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-[calc(520px-72px)]">
          {/* Quick Help Buttons */}
          {messages.length <= 1 && (
            <div className="p-3 border-b bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Quick help:</p>
              <div className="flex flex-wrap gap-1">
                {quickHelp.map((item) => (
                  <Button
                    key={item.label}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => handleQuickHelp(item.label)}
                  >
                    {item.icon} {item.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />}
                      {message.role === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Looking up help...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask how to use any feature..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Your in-app software guide • Ask me anything!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
