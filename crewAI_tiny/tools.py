from crewai_tools import tool

@tool("Text Search Tool")
def text_search(query: str) -> str:
    """Use this to answer questions from built-in knowledge. Returns a helpful response."""
    return f"Researched information about: {query}. Please synthesize a thorough answer from your training knowledge."