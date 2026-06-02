export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          buyer_id: string
          created_at: string | null
          id: string
          last_message_at: string | null
          listing_id: string | null
          seller_id: string
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          listing_id?: string | null
          seller_id: string
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          listing_id?: string | null
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          appellation: string | null
          bottle_size: Database["public"]["Enums"]["bottle_size"] | null
          color: Database["public"]["Enums"]["wine_color"] | null
          created_at: string | null
          description: string | null
          grape_variety: string | null
          id: string
          images: string[] | null
          price: number
          producer: string | null
          quantity: number | null
          region: string | null
          seller_id: string
          status: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at: string | null
          views: number | null
          vintage: number | null
        }
        Insert: {
          appellation?: string | null
          bottle_size?: Database["public"]["Enums"]["bottle_size"] | null
          color?: Database["public"]["Enums"]["wine_color"] | null
          created_at?: string | null
          description?: string | null
          grape_variety?: string | null
          id?: string
          images?: string[] | null
          price: number
          producer?: string | null
          quantity?: number | null
          region?: string | null
          seller_id: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at?: string | null
          views?: number | null
          vintage?: number | null
        }
        Update: {
          appellation?: string | null
          bottle_size?: Database["public"]["Enums"]["bottle_size"] | null
          color?: Database["public"]["Enums"]["wine_color"] | null
          created_at?: string | null
          description?: string | null
          grape_variety?: string | null
          id?: string
          images?: string[] | null
          price?: number
          producer?: string | null
          quantity?: number | null
          region?: string | null
          seller_id?: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          title?: string
          updated_at?: string | null
          views?: number | null
          vintage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_holder: string | null
          avatar_url: string | null
          bic: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          iban: string | null
          id: string
          location: string | null
          phone: string | null
          stripe_account_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_holder?: string | null
          avatar_url?: string | null
          bic?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          iban?: string | null
          id: string
          location?: string | null
          phone?: string | null
          stripe_account_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_holder?: string | null
          avatar_url?: string | null
          bic?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          iban?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          stripe_account_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bottle_size: "37.5cl" | "75cl" | "150cl" | "300cl" | "600cl"
      listing_status: "active" | "reserved" | "sold"
      wine_color: "rouge" | "blanc" | "rosé" | "effervescent" | "liquoreux"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenient row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Listing = Database["public"]["Tables"]["listings"]["Row"]
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"]
export type Message = Database["public"]["Tables"]["messages"]["Row"]

export type ListingStatus = Database["public"]["Enums"]["listing_status"]
export type BottleSize = Database["public"]["Enums"]["bottle_size"]
export type WineColor = Database["public"]["Enums"]["wine_color"]

export type ListingWithSeller = Listing & {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url" | "location"> | null
}
