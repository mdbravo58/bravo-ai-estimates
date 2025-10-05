export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_usage_logs: {
        Row: {
          cost_usd: number | null
          created_at: string | null
          feature: string
          id: string
          model: string
          organization_id: string
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string | null
          feature: string
          id?: string
          model: string
          organization_id: string
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string | null
          feature?: string
          id?: string
          model?: string
          organization_id?: string
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_summary: {
        Row: {
          created_at: string | null
          feature: string
          id: string
          month: string
          organization_id: string
          total_cost_usd: number | null
          total_requests: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          feature: string
          id?: string
          month: string
          organization_id: string
          total_cost_usd?: number | null
          total_requests?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          feature?: string
          id?: string
          month?: string
          organization_id?: string
          total_cost_usd?: number | null
          total_requests?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_summary_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          class_date: string
          class_id: string
          created_at: string
          id: string
          notes: string | null
          present: boolean
          student_id: string
        }
        Insert: {
          class_date: string
          class_id: string
          created_at?: string
          id?: string
          notes?: string | null
          present?: boolean
          student_id: string
        }
        Update: {
          class_date?: string
          class_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          present?: boolean
          student_id?: string
        }
        Relationships: []
      }
      belt_levels: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          organization_id: string
          rank_order: number
          requirements: string | null
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
          organization_id: string
          rank_order: number
          requirements?: string | null
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          rank_order?: number
          requirements?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      belt_promotions: {
        Row: {
          created_at: string
          from_belt_id: string | null
          id: string
          instructor_id: string | null
          notes: string | null
          promotion_date: string
          student_id: string
          to_belt_id: string
        }
        Insert: {
          created_at?: string
          from_belt_id?: string | null
          id?: string
          instructor_id?: string | null
          notes?: string | null
          promotion_date: string
          student_id: string
          to_belt_id: string
        }
        Update: {
          created_at?: string
          from_belt_id?: string | null
          id?: string
          instructor_id?: string | null
          notes?: string | null
          promotion_date?: string
          student_id?: string
          to_belt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "belt_promotions_from_belt_id_fkey"
            columns: ["from_belt_id"]
            isOneToOne: false
            referencedRelation: "belt_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "belt_promotions_to_belt_id_fkey"
            columns: ["to_belt_id"]
            isOneToOne: false
            referencedRelation: "belt_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          product_id: string
          quantity: number
          updated_at: string
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          product_id: string
          quantity?: number
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      class_enrollments: {
        Row: {
          class_id: string
          created_at: string
          enrolled_at: string
          id: string
          status: string
          student_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          enrolled_at?: string
          id?: string
          status?: string
          student_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          enrolled_at?: string
          id?: string
          status?: string
          student_id?: string
        }
        Relationships: []
      }
      class_schedules: {
        Row: {
          active: boolean
          class_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          active?: boolean
          class_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          active?: boolean
          class_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          instructor_id: string | null
          max_capacity: number | null
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_id?: string | null
          max_capacity?: number | null
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_id?: string | null
          max_capacity?: number | null
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      colors: {
        Row: {
          created_at: string
          hex_code: string
          id: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          hex_code: string
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          hex_code?: string
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      connection_tokens: {
        Row: {
          connection_id: string
          created_at: string
          encrypted_access_token: string | null
          encrypted_refresh_token: string | null
          id: string
          last_used_at: string | null
          token_hash: string | null
          updated_at: string
        }
        Insert: {
          connection_id: string
          created_at?: string
          encrypted_access_token?: string | null
          encrypted_refresh_token?: string | null
          id?: string
          last_used_at?: string | null
          token_hash?: string | null
          updated_at?: string
        }
        Update: {
          connection_id?: string
          created_at?: string
          encrypted_access_token?: string | null
          encrypted_refresh_token?: string | null
          id?: string
          last_used_at?: string | null
          token_hash?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          access_token: string | null
          created_at: string
          expires_at: string | null
          id: string
          metadata: Json | null
          organization_id: string
          provider: string
          refresh_token: string | null
          scope: string | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id: string
          provider: string
          refresh_token?: string | null
          scope?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          provider?: string
          refresh_token?: string | null
          scope?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          id: string
          name: string
          organization_id: string
          type: Database["public"]["Enums"]["cost_code_type"]
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          id?: string
          name: string
          organization_id: string
          type: Database["public"]["Enums"]["cost_code_type"]
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          type?: Database["public"]["Enums"]["cost_code_type"]
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          ghl_contact_id: string | null
          id: string
          name: string
          organization_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          ghl_contact_id?: string | null
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          ghl_contact_id?: string | null
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          checked_in: boolean | null
          event_id: string
          id: string
          paid: boolean | null
          registered_at: string
          student_id: string
        }
        Insert: {
          checked_in?: boolean | null
          event_id: string
          id?: string
          paid?: boolean | null
          registered_at?: string
          student_id: string
        }
        Update: {
          checked_in?: boolean | null
          event_id?: string
          id?: string
          paid?: boolean | null
          registered_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          location: string | null
          max_capacity: number | null
          name: string
          organization_id: string
          price: number | null
          registration_deadline: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          location?: string | null
          max_capacity?: number | null
          name: string
          organization_id: string
          price?: number | null
          registration_deadline?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          location?: string | null
          max_capacity?: number | null
          name?: string
          organization_id?: string
          price?: number | null
          registration_deadline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fact_expense: {
        Row: {
          amount_cents: number
          category: string | null
          created_at: string
          currency: string | null
          id: number
          occurred_at: string
          organization_id: string
          source: string
        }
        Insert: {
          amount_cents: number
          category?: string | null
          created_at?: string
          currency?: string | null
          id?: number
          occurred_at: string
          organization_id: string
          source: string
        }
        Update: {
          amount_cents?: number
          category?: string | null
          created_at?: string
          currency?: string | null
          id?: number
          occurred_at?: string
          organization_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "fact_expense_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fact_funnel: {
        Row: {
          created_at: string
          customers: number | null
          date: string
          id: number
          leads: number | null
          opps: number | null
          organization_id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          customers?: number | null
          date: string
          id?: number
          leads?: number | null
          opps?: number | null
          organization_id: string
          source?: string | null
        }
        Update: {
          created_at?: string
          customers?: number | null
          date?: string
          id?: number
          leads?: number | null
          opps?: number | null
          organization_id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fact_funnel_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fact_jobs: {
        Row: {
          avg_job_minutes: number | null
          created_at: string
          date: string
          id: number
          jobs_booked: number | null
          jobs_completed: number | null
          organization_id: string
          revenue_cents: number | null
          tech_id: string | null
        }
        Insert: {
          avg_job_minutes?: number | null
          created_at?: string
          date: string
          id?: number
          jobs_booked?: number | null
          jobs_completed?: number | null
          organization_id: string
          revenue_cents?: number | null
          tech_id?: string | null
        }
        Update: {
          avg_job_minutes?: number | null
          created_at?: string
          date?: string
          id?: number
          jobs_booked?: number | null
          jobs_completed?: number | null
          organization_id?: string
          revenue_cents?: number | null
          tech_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fact_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fact_revenue: {
        Row: {
          amount_cents: number
          channel: string | null
          created_at: string
          currency: string | null
          id: number
          occurred_at: string
          organization_id: string
          source: string
        }
        Insert: {
          amount_cents: number
          channel?: string | null
          created_at?: string
          currency?: string | null
          id?: number
          occurred_at: string
          organization_id: string
          source: string
        }
        Update: {
          amount_cents?: number
          channel?: string | null
          created_at?: string
          currency?: string | null
          id?: number
          occurred_at?: string
          organization_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "fact_revenue_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string
          discount_percentage: number | null
          ghl_family_id: string | null
          id: string
          name: string
          organization_id: string
          primary_contact_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_percentage?: number | null
          ghl_family_id?: string | null
          id?: string
          name: string
          organization_id: string
          primary_contact_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_percentage?: number | null
          ghl_family_id?: string | null
          id?: string
          name?: string
          organization_id?: string
          primary_contact_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "families_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          created_at: string
          family_id: string
          id: string
          relationship: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          family_id: string
          id?: string
          relationship?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          family_id?: string
          id?: string
          relationship?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          quantity: number
          reorder_level: number
          reserved_quantity: number
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity?: number
          reorder_level?: number
          reserved_quantity?: number
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          reorder_level?: number
          reserved_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          expires_at: string
          id: string
          invite_code: string
          invited_by: string
          invited_email: string
          invited_role: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invite_code: string
          invited_by: string
          invited_email: string
          invited_role?: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invite_code?: string
          invited_by?: string
          invited_email?: string
          invited_role?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          approved: boolean | null
          created_at: string
          id: string
          invoice_date: string
          invoice_number: string | null
          job_id: string
          method: Database["public"]["Enums"]["invoice_method"]
          qb_invoice_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          approved?: boolean | null
          created_at?: string
          id?: string
          invoice_date: string
          invoice_number?: string | null
          job_id: string
          method: Database["public"]["Enums"]["invoice_method"]
          qb_invoice_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          approved?: boolean | null
          created_at?: string
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          job_id?: string
          method?: Database["public"]["Enums"]["invoice_method"]
          qb_invoice_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          sku: string | null
          unit_cost: number | null
          unit_of_measure: string | null
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          sku?: string | null
          unit_cost?: number | null
          unit_of_measure?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          sku?: string | null
          unit_cost?: number | null
          unit_of_measure?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      job_budgets: {
        Row: {
          cost_code_id: string
          created_at: string
          id: string
          job_id: string
          qty_budget: number | null
          unit_cost_budget: number | null
          unit_price_budget: number | null
          updated_at: string
        }
        Insert: {
          cost_code_id: string
          created_at?: string
          id?: string
          job_id: string
          qty_budget?: number | null
          unit_cost_budget?: number | null
          unit_price_budget?: number | null
          updated_at?: string
        }
        Update: {
          cost_code_id?: string
          created_at?: string
          id?: string
          job_id?: string
          qty_budget?: number | null
          unit_cost_budget?: number | null
          unit_price_budget?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_budgets_cost_code_id_fkey"
            columns: ["cost_code_id"]
            isOneToOne: false
            referencedRelation: "cost_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_budgets_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          job_id: string
          mime_type: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          job_id: string
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          job_id?: string
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          address: string | null
          code: string
          created_at: string
          customer_id: string
          description: string | null
          end_date: string | null
          ghl_opportunity_id: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string
          project_manager_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["job_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          code: string
          created_at?: string
          customer_id: string
          description?: string | null
          end_date?: string | null
          ghl_opportunity_id?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id: string
          project_manager_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          code?: string
          created_at?: string
          customer_id?: string
          description?: string | null
          end_date?: string | null
          ghl_opportunity_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          project_manager_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_snapshots: {
        Row: {
          computed_at: string
          created_at: string
          id: number
          organization_id: string
          payload: Json
          scope: string
        }
        Insert: {
          computed_at?: string
          created_at?: string
          id?: number
          organization_id: string
          payload?: Json
          scope: string
        }
        Update: {
          computed_at?: string
          created_at?: string
          id?: number
          organization_id?: string
          payload?: Json
          scope?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_snapshots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_targets: {
        Row: {
          created_at: string
          id: number
          metric: string
          month: string
          organization_id: string
          target_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          metric: string
          month: string
          organization_id: string
          target_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          metric?: string
          month?: string
          organization_id?: string
          target_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_targets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string | null
          ghl_contact_id: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string
          phone: string | null
          score: number | null
          source: Database["public"]["Enums"]["lead_source"] | null
          status: Database["public"]["Enums"]["lead_status"] | null
          trial_class_date: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          ghl_contact_id?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          score?: number | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          trial_class_date?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          ghl_contact_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          score?: number | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          trial_class_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      material_lines: {
        Row: {
          approved: boolean | null
          cost_code_id: string
          created_at: string
          description: string
          id: string
          item_id: string | null
          job_id: string
          qty: number
          receipt_url: string | null
          unit_cost: number
          unit_price: number
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          approved?: boolean | null
          cost_code_id: string
          created_at?: string
          description: string
          id?: string
          item_id?: string | null
          job_id: string
          qty?: number
          receipt_url?: string | null
          unit_cost?: number
          unit_price?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          approved?: boolean | null
          cost_code_id?: string
          created_at?: string
          description?: string
          id?: string
          item_id?: string | null
          job_id?: string
          qty?: number
          receipt_url?: string | null
          unit_cost?: number
          unit_price?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_lines_cost_code_id_fkey"
            columns: ["cost_code_id"]
            isOneToOne: false
            referencedRelation: "cost_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_lines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_lines_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_lines_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          organization_id: string
          recipient_id: string | null
          recipient_type: string
          sender_id: string
          sent_at: string
          subject: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          organization_id: string
          recipient_id?: string | null
          recipient_type: string
          sender_id: string
          sent_at?: string
          subject: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          organization_id?: string
          recipient_id?: string | null
          recipient_type?: string
          sender_id?: string
          sent_at?: string
          subject?: string
        }
        Relationships: []
      }
      monthly_usage: {
        Row: {
          ai_chats_used: number | null
          created_at: string | null
          id: string
          month: string
          organization_id: string
          reports_generated: number | null
          updated_at: string | null
          voice_calls_used: number | null
        }
        Insert: {
          ai_chats_used?: number | null
          created_at?: string | null
          id?: string
          month: string
          organization_id: string
          reports_generated?: number | null
          updated_at?: string | null
          voice_calls_used?: number | null
        }
        Update: {
          ai_chats_used?: number | null
          created_at?: string | null
          id?: string
          month?: string
          organization_id?: string
          reports_generated?: number | null
          updated_at?: string | null
          voice_calls_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          address: string | null
          business_email: string | null
          business_phone: string | null
          created_at: string
          description: string | null
          external_ref: string | null
          ghl_api_key_hash: string | null
          ghl_connected_at: string | null
          ghl_location_id: string | null
          id: string
          logo_url: string | null
          name: string
          plan: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_email?: string | null
          business_phone?: string | null
          created_at?: string
          description?: string | null
          external_ref?: string | null
          ghl_api_key_hash?: string | null
          ghl_connected_at?: string | null
          ghl_location_id?: string | null
          id?: string
          logo_url?: string | null
          name: string
          plan?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_email?: string | null
          business_phone?: string | null
          created_at?: string
          description?: string | null
          external_ref?: string | null
          ghl_api_key_hash?: string | null
          ghl_connected_at?: string | null
          ghl_location_id?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          plan?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      overhead_rules: {
        Row: {
          active: boolean
          created_at: string
          id: string
          method: Database["public"]["Enums"]["overhead_method"]
          name: string
          organization_id: string
          updated_at: string
          value: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          method: Database["public"]["Enums"]["overhead_method"]
          name: string
          organization_id: string
          updated_at?: string
          value: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["overhead_method"]
          name?: string
          organization_id?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          card_brand: string | null
          card_last4: string | null
          created_at: string
          expiry_month: number | null
          expiry_year: number | null
          id: string
          is_default: boolean | null
          reminder_sent: boolean | null
          stripe_payment_method_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          card_last4?: string | null
          created_at?: string
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_default?: boolean | null
          reminder_sent?: boolean | null
          stripe_payment_method_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          card_brand?: string | null
          card_last4?: string | null
          created_at?: string
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_default?: boolean | null
          reminder_sent?: boolean | null
          stripe_payment_method_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          color_id: string | null
          created_at: string
          id: string
          price_modifier: number | null
          product_id: string
          size_id: string | null
          sku: string | null
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          color_id?: string | null
          created_at?: string
          id?: string
          price_modifier?: number | null
          product_id: string
          size_id?: string | null
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          color_id?: string | null
          created_at?: string
          id?: string
          price_modifier?: number | null
          product_id?: string
          size_id?: string | null
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          belt_level_id: string | null
          created_at: string
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          belt_level_id?: string | null
          created_at?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          belt_level_id?: string | null
          created_at?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotion_eligibility: {
        Row: {
          classes_attended: number | null
          classes_required: number
          created_at: string
          current_belt_id: string
          eligible_date: string | null
          id: string
          next_belt_id: string
          notified: boolean | null
          student_id: string
          updated_at: string
        }
        Insert: {
          classes_attended?: number | null
          classes_required: number
          created_at?: string
          current_belt_id: string
          eligible_date?: string | null
          id?: string
          next_belt_id: string
          notified?: boolean | null
          student_id: string
          updated_at?: string
        }
        Update: {
          classes_attended?: number | null
          classes_required?: number
          created_at?: string
          current_belt_id?: string
          eligible_date?: string | null
          id?: string
          next_belt_id?: string
          notified?: boolean | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_eligibility_current_belt_id_fkey"
            columns: ["current_belt_id"]
            isOneToOne: false
            referencedRelation: "belt_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_eligibility_next_belt_id_fkey"
            columns: ["next_belt_id"]
            isOneToOne: false
            referencedRelation: "belt_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          enrolled_at: string | null
          id: string
          referred_email: string | null
          referred_id: string | null
          referred_name: string
          referred_phone: string | null
          referrer_id: string
          reward_amount: number | null
          status: string | null
        }
        Insert: {
          created_at?: string
          enrolled_at?: string | null
          id?: string
          referred_email?: string | null
          referred_id?: string | null
          referred_name: string
          referred_phone?: string | null
          referrer_id: string
          reward_amount?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string
          enrolled_at?: string | null
          id?: string
          referred_email?: string | null
          referred_id?: string | null
          referred_name?: string
          referred_phone?: string | null
          referrer_id?: string
          reward_amount?: number | null
          status?: string | null
        }
        Relationships: []
      }
      sizes: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      staging_events: {
        Row: {
          id: number
          organization_id: string
          payload: Json
          provider: string
          received_at: string
          source_id: string | null
        }
        Insert: {
          id?: number
          organization_id: string
          payload?: Json
          provider: string
          received_at?: string
          source_id?: string | null
        }
        Update: {
          id?: number
          organization_id?: string
          payload?: Json
          provider?: string
          received_at?: string
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staging_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      student_goals: {
        Row: {
          category: string
          created_at: string
          current: number
          id: string
          target: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          current?: number
          id?: string
          target: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          current?: number
          id?: string
          target?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          created_at: string
          current_belt_id: string | null
          id: string
          notes: string | null
          organization_id: string
          promotion_date: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_belt_id?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          promotion_date?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_belt_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          promotion_date?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subcontracts: {
        Row: {
          amount: number
          approved: boolean | null
          cost_code_id: string
          created_at: string
          description: string
          id: string
          job_id: string
          po_number: string | null
          status: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          amount: number
          approved?: boolean | null
          cost_code_id: string
          created_at?: string
          description: string
          id?: string
          job_id: string
          po_number?: string | null
          status?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          amount?: number
          approved?: boolean | null
          cost_code_id?: string
          created_at?: string
          description?: string
          id?: string
          job_id?: string
          po_number?: string | null
          status?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcontracts_cost_code_id_fkey"
            columns: ["cost_code_id"]
            isOneToOne: false
            referencedRelation: "cost_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcontracts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcontracts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_limits: {
        Row: {
          ai_chats_per_month: number
          created_at: string | null
          plan_name: string
          price_cents: number
          reports_per_month: number
          voice_calls_per_month: number
        }
        Insert: {
          ai_chats_per_month: number
          created_at?: string | null
          plan_name: string
          price_cents: number
          reports_per_month: number
          voice_calls_per_month: number
        }
        Update: {
          ai_chats_per_month?: number
          created_at?: string | null
          plan_name?: string
          price_cents?: number
          reports_per_month?: number
          voice_calls_per_month?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          organization_id: string
          plan_name: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id: string
          plan_name: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id?: string
          plan_name?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          approved: boolean | null
          burden_rate: number | null
          cost_code_id: string
          created_at: string
          end_time: string | null
          hours: number | null
          id: string
          job_id: string
          notes: string | null
          source: Database["public"]["Enums"]["time_entry_source"]
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          burden_rate?: number | null
          cost_code_id: string
          created_at?: string
          end_time?: string | null
          hours?: number | null
          id?: string
          job_id: string
          notes?: string | null
          source?: Database["public"]["Enums"]["time_entry_source"]
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          burden_rate?: number | null
          cost_code_id?: string
          created_at?: string
          end_time?: string | null
          hours?: number | null
          id?: string
          job_id?: string
          notes?: string | null
          source?: Database["public"]["Enums"]["time_entry_source"]
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_cost_code_id_fkey"
            columns: ["cost_code_id"]
            isOneToOne: false
            referencedRelation: "cost_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      token_access_audit: {
        Row: {
          access_type: string
          accessed_by: string
          connection_id: string
          created_at: string
          id: string
          ip_address: unknown | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          access_type: string
          accessed_by: string
          connection_id: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          access_type?: string
          accessed_by?: string
          connection_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      trial_classes: {
        Row: {
          attended: boolean | null
          class_id: string | null
          converted: boolean | null
          created_at: string
          ghl_appointment_id: string | null
          id: string
          instructor_notes: string | null
          lead_id: string | null
          scheduled_date: string
          updated_at: string
        }
        Insert: {
          attended?: boolean | null
          class_id?: string | null
          converted?: boolean | null
          created_at?: string
          ghl_appointment_id?: string | null
          id?: string
          instructor_notes?: string | null
          lead_id?: string | null
          scheduled_date: string
          updated_at?: string
        }
        Update: {
          attended?: boolean | null
          class_id?: string | null
          converted?: boolean | null
          created_at?: string
          ghl_appointment_id?: string | null
          id?: string
          instructor_notes?: string | null
          lead_id?: string | null
          scheduled_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_classes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          organization_id: string
          role: string
          status: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          organization_id: string
          role: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          organization_id?: string
          role?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_bills: {
        Row: {
          amount: number
          approved: boolean | null
          attachment_url: string | null
          bill_date: string
          bill_number: string | null
          created_at: string
          id: string
          job_id: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          amount: number
          approved?: boolean | null
          attachment_url?: string | null
          bill_date: string
          bill_number?: string | null
          created_at?: string
          id?: string
          job_id: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          amount?: number
          approved?: boolean | null
          attachment_url?: string | null
          bill_date?: string
          bill_number?: string | null
          created_at?: string
          id?: string
          job_id?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_bills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_bills_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          active: boolean
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          organization_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      connections_safe: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string | null
          metadata: Json | null
          organization_id: string | null
          provider: string | null
          scope: string | null
          token_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string | null
          metadata?: Json | null
          organization_id?: string | null
          provider?: string | null
          scope?: string | null
          token_status?: never
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string | null
          metadata?: Json | null
          organization_id?: string | null
          provider?: string | null
          scope?: string | null
          token_status?: never
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_directory: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string | null
          organization_id: string | null
          role: string | null
          status: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_emergency_contact: {
        Row: {
          created_at: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string | null
          id: string | null
          organization_id: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_access_connection_tokens: {
        Args: { connection_id: string }
        Returns: boolean
      }
      can_access_employee_profiles: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_school_with_owner: {
        Args: {
          p_owner_name: string
          p_owner_user_id: string
          p_school_name: string
          p_school_type: string
        }
        Returns: string
      }
      encrypt_connection_token: {
        Args: { connection_id: string; token: string }
        Returns: string
      }
      fix_missing_user_records: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_connection_token_for_api: {
        Args: { connection_id: string; purpose?: string }
        Returns: string
      }
      get_current_user_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_organization_id: {
        Args: { user_auth_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_organization_owner: {
        Args: { user_org_id: string }
        Returns: boolean
      }
      is_user_owner: {
        Args: { user_auth_id: string }
        Returns: boolean
      }
      join_school_as_student: {
        Args: {
          p_organization_id: string
          p_student_name: string
          p_student_user_id: string
        }
        Returns: undefined
      }
      log_profile_access: {
        Args: { access_type: string; profile_user_id: string }
        Returns: undefined
      }
      store_connection_tokens: {
        Args: {
          p_access_token?: string
          p_connection_id: string
          p_refresh_token?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "owner"
        | "manager"
        | "admin"
        | "technician"
        | "sales"
        | "customer_service"
        | "hr"
        | "student"
        | "instructor"
      cost_code_type:
        | "labor"
        | "material"
        | "subcontract"
        | "equipment"
        | "fee"
        | "overhead"
      event_type: "seminar" | "tournament" | "belt_testing" | "other"
      integration_provider: "ghl" | "quickbooks" | "xero"
      invoice_method: "fixed" | "t_and_m" | "progress" | "milestone"
      job_status:
        | "estimate"
        | "scheduled"
        | "in_progress"
        | "hold"
        | "complete"
        | "invoiced"
      lead_source:
        | "website"
        | "referral"
        | "social_media"
        | "walk_in"
        | "phone"
        | "other"
      lead_status:
        | "new"
        | "contacted"
        | "trial_scheduled"
        | "trial_completed"
        | "enrolled"
        | "lost"
      overhead_method:
        | "percent_of_labor"
        | "percent_of_direct_cost"
        | "flat_per_hour"
      time_entry_source: "mobile" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "owner",
        "manager",
        "admin",
        "technician",
        "sales",
        "customer_service",
        "hr",
        "student",
        "instructor",
      ],
      cost_code_type: [
        "labor",
        "material",
        "subcontract",
        "equipment",
        "fee",
        "overhead",
      ],
      event_type: ["seminar", "tournament", "belt_testing", "other"],
      integration_provider: ["ghl", "quickbooks", "xero"],
      invoice_method: ["fixed", "t_and_m", "progress", "milestone"],
      job_status: [
        "estimate",
        "scheduled",
        "in_progress",
        "hold",
        "complete",
        "invoiced",
      ],
      lead_source: [
        "website",
        "referral",
        "social_media",
        "walk_in",
        "phone",
        "other",
      ],
      lead_status: [
        "new",
        "contacted",
        "trial_scheduled",
        "trial_completed",
        "enrolled",
        "lost",
      ],
      overhead_method: [
        "percent_of_labor",
        "percent_of_direct_cost",
        "flat_per_hour",
      ],
      time_entry_source: ["mobile", "admin"],
    },
  },
} as const
