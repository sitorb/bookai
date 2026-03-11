import openai # or use google-generativeai for Gemini

def generate_bibliographic_tags(content):
    prompt = f"""
    Analyze the following library journal entry and provide 3 short, 
    vintage-style bibliographic tags (e.g., #AntiqueLogic, #GothicTheory).
    Return only the tags separated by commas.
    
    Entry: {content[:500]} 
    """
    
    # Mocking the AI response for now so you can test immediately
    # You can replace this with a real API call later
    return "#ArchiveDiscovery, #LiteraryMusings, #VintageInk"
import google.generativeai as genai
import os
from django.conf import settings

# Configure Gemini with your API Key
# (We'll put this in your .env file next)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_ai_metadata(content):
    """
    Uses Gemini to generate a librarian's note and archival tags.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        You are an elite Head Librarian from the year 1924. 
        Read the following journal entry and provide:
        1. A one-sentence 'Archivist's Note' (formal, academic, slightly poetic).
        2. Three bibliographic tags starting with # (e.g., #GothicHistory).
        
        Format your response exactly like this:
        Note: [Your Note Here]
        Tags: #Tag1, #Tag2, #Tag3

        Entry: {content[:1000]}
        """

        response = model.generate_content(prompt)
        text = response.text

        # Simple parsing logic to separate Note and Tags
        try:
            note = text.split("Note:")[1].split("Tags:")[0].strip()
            tags = text.split("Tags:")[1].strip()
        except IndexError:
            # Fallback if AI skips the format
            note = "An intriguing addition to our permanent collection."
            tags = "#GeneralArchive, #LibraryNotes, #Uncategorized"

        return note, tags

    except Exception as e:
        print(f"Gemini Error: {e}")
        # Return fallback data so the user can still save their post
        return "An entry awaiting formal classification.", "#Archive, #LibraryJournal, #Unsorted"
    

def generate_archivist_note(content):
    # Logic to summarize the entry in a 'Librarian' persona
    summary = f"An intriguing study on the themes presented. The scribe explores {content[:40]}... with a focus on historical context and archival silence."
    return summary