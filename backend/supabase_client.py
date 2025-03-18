import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
