import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      analysisType = 'business_insights',
      dateRange = 'last_30_days',
      specificMetrics = []
    } = await req.json();

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current date for date range calculations
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'last_7_days':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last_30_days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'last_90_days':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'last_year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    console.log(`Analyzing data from ${startDate.toISOString()} to ${now.toISOString()}`);

    // Fetch relevant data from database
    const [
      { data: jobs, error: jobsError },
      { data: customers, error: customersError },
      { data: revenueData, error: revenueError },
      { data: expenseData, error: expenseError }
    ] = await Promise.all([
      supabase
        .from('jobs')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', now.toISOString()),
      
      supabase
        .from('customers')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', now.toISOString()),
      
      supabase
        .from('fact_revenue')
        .select('*')
        .gte('occurred_at', startDate.toISOString().split('T')[0])
        .lte('occurred_at', now.toISOString().split('T')[0]),
      
      supabase
        .from('fact_expense')
        .select('*')
        .gte('occurred_at', startDate.toISOString().split('T')[0])
        .lte('occurred_at', now.toISOString().split('T')[0])
    ]);

    if (jobsError || customersError || revenueError || expenseError) {
      console.error('Database errors:', { jobsError, customersError, revenueError, expenseError });
      throw new Error('Failed to fetch analytics data');
    }

    // Prepare data summary for AI analysis
    const dataContext = {
      totalJobs: jobs?.length || 0,
      completedJobs: jobs?.filter(j => j.status === 'completed').length || 0,
      inProgressJobs: jobs?.filter(j => j.status === 'in_progress').length || 0,
      newCustomers: customers?.length || 0,
      totalRevenue: revenueData?.reduce((sum, r) => sum + (r.amount_cents / 100), 0) || 0,
      totalExpenses: expenseData?.reduce((sum, e) => sum + (e.amount_cents / 100), 0) || 0,
      jobsByStatus: jobs?.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {},
      revenueByChannel: revenueData?.reduce((acc, r) => {
        acc[r.channel] = (acc[r.channel] || 0) + (r.amount_cents / 100);
        return acc;
      }, {} as Record<string, number>) || {},
      expensesByCategory: expenseData?.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + (e.amount_cents / 100);
        return acc;
      }, {} as Record<string, number>) || {}
    };

    const systemPrompt = `You are an AI business analyst for Bravo Service Suite. Analyze the provided business data and generate actionable insights.

    ANALYSIS TYPES:
    - business_insights: Overall business performance and recommendations
    - financial_analysis: Revenue, expenses, and profitability analysis  
    - customer_analysis: Customer behavior and retention insights
    - operational_analysis: Job efficiency and resource optimization
    - growth_predictions: Forecasting and growth opportunities

    PROVIDE:
    1. Key Performance Indicators (KPIs)
    2. Trends and patterns identified
    3. Specific actionable recommendations
    4. Risk factors or concerns
    5. Growth opportunities
    6. Benchmark comparisons where relevant

    RESPONSE FORMAT:
    Return a JSON object with:
    {
      "summary": "Executive summary",
      "kpis": [
        {
          "metric": "Metric name",
          "value": number,
          "trend": "up/down/stable",
          "insight": "What this means"
        }
      ],
      "insights": [
        {
          "category": "revenue/customer/operational/financial",
          "finding": "Key finding",
          "impact": "high/medium/low",
          "recommendation": "Specific action to take"
        }
      ],
      "recommendations": [
        {
          "priority": "high/medium/low",
          "action": "Specific recommendation",
          "expectedImpact": "Expected outcome",
          "timeframe": "Implementation timeframe"
        }
      ],
      "alerts": [
        {
          "type": "warning/opportunity/critical",
          "message": "Alert description",
          "urgency": "immediate/soon/monitor"
        }
      ]
    }

    Be specific, actionable, and data-driven in your analysis.`;

    const userPrompt = `Analyze the following business data for ${dateRange} and provide ${analysisType}:

    Business Data Summary:
    - Total Jobs: ${dataContext.totalJobs}
    - Completed Jobs: ${dataContext.completedJobs}
    - In Progress Jobs: ${dataContext.inProgressJobs}
    - New Customers: ${dataContext.newCustomers}
    - Total Revenue: $${dataContext.totalRevenue.toFixed(2)}
    - Total Expenses: $${dataContext.totalExpenses.toFixed(2)}
    - Net Profit: $${(dataContext.totalRevenue - dataContext.totalExpenses).toFixed(2)}
    
    Jobs by Status: ${JSON.stringify(dataContext.jobsByStatus)}
    Revenue by Channel: ${JSON.stringify(dataContext.revenueByChannel)}
    Expenses by Category: ${JSON.stringify(dataContext.expensesByCategory)}
    
    Please provide comprehensive analysis with specific insights and actionable recommendations.`;

    console.log('Sending data to AI for analysis...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', errorText);
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add more credits to your workspace.');
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices[0]?.message?.content || '{}');
    
    // Add metadata
    analysisResult.generatedAt = new Date().toISOString();
    analysisResult.dateRange = dateRange;
    analysisResult.dataContext = dataContext;

    console.log('AI analysis completed successfully');

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-analytics function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate analytics' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});