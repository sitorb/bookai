import os
from django.conf import settings
from google import genai
from dotenv import load_dotenv

# Load environment variables (ensure GOOGLE_API_KEY is in your .env)
load_dotenv()

# Initialize the Modern Gemini Client
# Note: This requires 'pip install google-genai'
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_ai_metadata(content):
    """
    The 'Big Brain' function. Consults the Head Librarian (Gemini) 
    to generate both a note and tags in one single request.
    """
    if not content or len(content.strip()) < 10:
        return "A brief fragment, awaiting further substance.", "#Fragment, #Draft, #Unsorted"

    try:
        prompt = f"""
        You are an elite Head Librarian from the year 1924. 
        Read the following journal entry and provide:
        1. A one-sentence 'Archivist's Note' (formal, academic, slightly poetic).
        2. Three bibliographic tags starting with # (e.g., #GothicHistory, #AntiqueLogic).
        
        Format your response exactly like this:
        Note: [Your Note Here]
        Tags: #Tag1, #Tag2, #Tag3

        Entry: {content[:2000]}
        """

        # Using the latest Gemini 2.0 Flash (Fast & Free)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        text = response.text

        # Parsing logic to separate Note and Tags
        try:
            note = text.split("Note:")[1].split("Tags:")[0].strip()
            tags = text.split("Tags:")[1].strip()
        except (IndexError, ValueError):
            # Fallback if AI gets too poetic and ignores formatting
            note = "A curious entry that defies standard 1920s classification."
            tags = "#GeneralArchive, #Curiosities, #Misc"

        return note, tags

    except Exception as e:
        print(f"Librarian Error (Gemini): {e}")
        return "An entry currently obscured by archival fog.", "#SystemError, #Pending, #LibraryJournal"

# --- Wrapper functions for your Views ---
# These ensure your existing views.py doesn't break

def generate_bibliographic_tags(content):
    """Returns only the tags."""
    _, tags = generate_ai_metadata(content)
    return tags

def generate_archivist_note(content):
    """Returns only the note."""
    note, _ = generate_ai_metadata(content)
    return note