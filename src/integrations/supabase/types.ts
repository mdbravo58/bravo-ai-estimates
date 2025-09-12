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
      belt_tests: {
        Row: {
          created_at: string
          current_belt: string
          id: string
          instructor_id: string
          notes: string | null
          score: number | null
          status: string
          student_id: string
          test_date: string
          testing_for_belt: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_belt: string
          id?: string
          instructor_id: string
          notes?: string | null
          score?: number | null
          status?: string
          student_id: string
          test_date: string
          testing_for_belt: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_belt?: string
          id?: string
          instructor_id?: string
          notes?: string | null
          score?: number | null
          status?: string
          student_id?: string
          test_date?: string
          testing_for_belt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "belt_tests_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "belt_tests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string | null
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
          active: boolean
          class_id: string
          created_at: string
          enrollment_date: string
          id: string
          student_id: string
        }
        Insert: {
          active?: boolean
          class_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          student_id: string
        }
        Update: {
          active?: boolean
          class_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          active: boolean
          belt_requirements: string[] | null
          created_at: string
          day_of_week: number
          description: string | null
          end_time: string
          id: string
          instructor_id: string
          max_capacity: number | null
          name: string
          start_time: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          belt_requirements?: string[] | null
          created_at?: string
          day_of_week: number
          description?: string | null
          end_time: string
          id?: string
          instructor_id: string
          max_capacity?: number | null
          name: string
          start_time: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          belt_requirements?: string[] | null
          created_at?: string
          day_of_week?: number
          description?: string | null
          end_time?: string
          id?: string
          instructor_id?: string
          max_capacity?: number | null
          name?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
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
      instructors: {
        Row: {
          active: boolean
          avatar_url: string | null
          belt_level: string
          bio: string | null
          created_at: string
          email: string
          full_name: string
          hire_date: string
          id: string
          phone: string | null
          specializations: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          belt_level: string
          bio?: string | null
          created_at?: string
          email: string
          full_name: string
          hire_date?: string
          id?: string
          phone?: string | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          belt_level?: string
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          hire_date?: string
          id?: string
          phone?: string | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
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
          created_at: string
          external_ref: string | null
          id: string
          name: string
          plan: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_ref?: string | null
          id?: string
          name: string
          plan?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_ref?: string | null
          id?: string
          name?: string
          plan?: string | null
          updated_at?: string
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
          created_at: string
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
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
      students: {
        Row: {
          active: boolean
          belt_level: string
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string
          id: string
          join_date: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          belt_level?: string
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name: string
          id?: string
          join_date?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          belt_level?: string
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string
          id?: string
          join_date?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
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
      users: {
        Row: {
          auth_user_id: string | null
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
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      cost_code_type:
        | "labor"
        | "material"
        | "subcontract"
        | "equipment"
        | "fee"
        | "overhead"
      integration_provider: "ghl" | "quickbooks" | "xero"
      invoice_method: "fixed" | "t_and_m" | "progress" | "milestone"
      job_status:
        | "estimate"
        | "scheduled"
        | "in_progress"
        | "hold"
        | "complete"
        | "invoiced"
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
      cost_code_type: [
        "labor",
        "material",
        "subcontract",
        "equipment",
        "fee",
        "overhead",
      ],
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
      overhead_method: [
        "percent_of_labor",
        "percent_of_direct_cost",
        "flat_per_hour",
      ],
      time_entry_source: ["mobile", "admin"],
    },
  },
} as const
