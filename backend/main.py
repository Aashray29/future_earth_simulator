from fastapi import FastAPI
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("Supabase URL and Anon Key must be set in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

@app.get("/test-supabase")
def test_supabase():
    try:
        # Test connection by fetching from a table, e.g., if you have a 'test' table
        # For now, just return success
        return {"message": "Supabase connected successfully"}
    except Exception as e:
        return {"error": str(e)}