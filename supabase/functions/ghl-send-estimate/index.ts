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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { estimateId, sendVia = 'email' } = await req.json();

    if (!estimateId) {
      throw new Error('Estimate ID is required');
    }

    // Fetch estimate with line items
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .select('*')
      .eq('id', estimateId)
      .single();

    if (estimateError || !estimate) {
      throw new Error('Estimate not found');
    }

    const { data: lineItems } = await supabase
      .from('estimate_line_items')
      .select('*')
      .eq('estimate_id', estimateId)
      .order('sort_order');

    // Get organization GHL settings
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('ghl_api_key_hash, ghl_location_id, name')
      .eq('id', estimate.organization_id)
      .single();

    if (orgError || !org) {
      throw new Error('Organization not found');
    }

    // Check if customer has GHL contact ID
    let ghlContactId = null;
    if (estimate.customer_id) {
      const { data: customer } = await supabase
        .from('customers')
        .select('ghl_contact_id, email, name')
        .eq('id', estimate.customer_id)
        .single();
      
      ghlContactId = customer?.ghl_contact_id;
    }

    // Generate portal URL
    const portalUrl = `${req.headers.get('origin') || 'https://bravo-ai-estimates.lovable.app'}/portal/${estimate.portal_token}`;

    // Generate professional HTML email
    const emailHtml = generateEstimateEmail({
      estimate,
      lineItems: lineItems || [],
      orgName: org.name || 'Bravo Service',
      portalUrl,
    });

    // If we have GHL configured and contact ID, send via GHL
    if (org.ghl_api_key_hash && ghlContactId) {
      const ghlApiKey = Deno.env.get('GHL_API_KEY');
      
      if (ghlApiKey) {
        const ghlResponse = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ghlApiKey}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
          },
          body: JSON.stringify({
            type: 'Email',
            contactId: ghlContactId,
            html: emailHtml,
            subject: `Your Estimate ${estimate.estimate_number} from ${org.name || 'Bravo Service'}`,
          }),
        });

        if (!ghlResponse.ok) {
          const errorText = await ghlResponse.text();
          console.error('GHL API error:', errorText);
          throw new Error('Failed to send via GoHighLevel');
        }

        const ghlData = await ghlResponse.json();

        // Update estimate with sent status
        await supabase
          .from('estimates')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            sent_via: 'ghl_email',
            ghl_message_id: ghlData.messageId || ghlData.id,
          })
          .eq('id', estimateId);

        return new Response(JSON.stringify({
          success: true,
          message: 'Estimate sent via GoHighLevel',
          messageId: ghlData.messageId || ghlData.id,
          portalUrl,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Fallback: Just update status and return portal URL for manual sending
    await supabase
      .from('estimates')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_via: 'manual',
      })
      .eq('id', estimateId);

    return new Response(JSON.stringify({
      success: true,
      message: 'Estimate marked as sent. GHL not configured - please send manually.',
      portalUrl,
      emailHtml,
      requiresManualSend: true,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ghl-send-estimate:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to send estimate',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

interface EmailParams {
  estimate: any;
  lineItems: any[];
  orgName: string;
  portalUrl: string;
}

function generateEstimateEmail({ estimate, lineItems, orgName, portalUrl }: EmailParams): string {
  const lineItemsHtml = lineItems.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity} ${item.unit || ''}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${Number(item.unit_price).toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">$${Number(item.total).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Estimate ${estimate.estimate_number}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">${orgName}</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Professional Service Estimate</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="background: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">
          ${estimate.estimate_number}
        </span>
      </div>

      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Dear ${estimate.customer_name || 'Valued Customer'},
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Thank you for your interest in our services. Please find your personalized estimate below.
      </p>

      ${estimate.description ? `
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px; color: #111827; font-size: 14px;">Service Description:</h3>
        <p style="margin: 0; color: #4b5563; font-size: 14px;">${estimate.description}</p>
      </div>
      ` : ''}

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 12px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Description</th>
            <th style="padding: 12px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Qty</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase;">Unit Price</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${lineItemsHtml}
        </tbody>
      </table>

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280;">Subtotal:</span>
          <span style="color: #111827;">$${Number(estimate.subtotal || 0).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280;">Overhead:</span>
          <span style="color: #111827;">$${Number(estimate.overhead || 0).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid #e5e7eb; margin-top: 12px;">
          <span style="color: #111827; font-weight: 700; font-size: 18px;">Total:</span>
          <span style="color: #1e40af; font-weight: 700; font-size: 24px;">$${Number(estimate.total || 0).toFixed(2)}</span>
        </div>
      </div>

      ${estimate.notes ? `
      <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <h3 style="margin: 0 0 8px; color: #1e40af; font-size: 14px;">Notes:</h3>
        <p style="margin: 0; color: #374151; font-size: 14px;">${estimate.notes}</p>
      </div>
      ` : ''}

      <div style="text-align: center; margin-top: 30px;">
        <a href="${portalUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          View & Approve Estimate
        </a>
      </div>

      <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
        This estimate is valid until ${estimate.valid_until ? new Date(estimate.valid_until).toLocaleDateString() : '30 days from issue date'}.
        <br>Questions? Reply to this email or call us directly.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
