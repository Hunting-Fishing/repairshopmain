import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const SUPABASE_URL = "https://agtjuxiysmzhmpnbuzmc.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndGp1eGl5c216aG1wbmJ1em1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NjE3NjAsImV4cCI6MjA1MzUzNzc2MH0.G46rVFlZEJqI2mY0gwpdT7lO4aybrVpgRMRWx8rX_-w"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)