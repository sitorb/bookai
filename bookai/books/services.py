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