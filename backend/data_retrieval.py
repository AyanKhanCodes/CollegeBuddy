import json
import os
from typing import List, Dict, Any
from thefuzz import process

# Global cache for the contacts data
_contacts_cache: List[Dict[str, Any]] = []

def load_contacts_data(filepath: str) -> None:
    """
    Loads the contacts JSON file into a global variable so that
    it is read from disk only once at server startup.
    """
    global _contacts_cache
    if not os.path.exists(filepath):
        print(f"Warning: Contacts file not found at {filepath}")
        _contacts_cache = []
        return
        
    with open(filepath, "r", encoding="utf-8") as f:
        try:
            _contacts_cache = json.load(f)
        except json.JSONDecodeError:
            print("Error: Invalid JSON format in contacts file.")
            _contacts_cache = []

def get_contacts_data() -> List[Dict[str, Any]]:
    """Returns the cached contacts data."""
    return _contacts_cache

def search_contacts(query: str, top_n: int = 3) -> List[Dict[str, Any]]:
    """
    Searches the loaded JSON for matching names, departments (category), or roles.
    Uses fuzzy string matching to return the closest top_n matches.
    """
    if not _contacts_cache or not query:
        return []
        
    # We will build a searchable string representation for each contact
    # so we can fuzzy match against name, category, and role simultaneously.
    # We create a dictionary mapping string index to the contact dict.
    searchable_strings = {}
    for idx, contact in enumerate(_contacts_cache):
        # We concatenate category, role, and name. Provide defaults if null.
        category = contact.get("category", "") or ""
        role = contact.get("role", "") or ""
        name = contact.get("name", "") or ""
        
        search_target = f"{name} {role} {category}"
        searchable_strings[idx] = search_target
        
    # Match using thefuzz process
    # limit=3 to only get top 3 results
    results = process.extract(query, searchable_strings, limit=top_n)
    
    matched_contacts = []
    # results is a list of tuples: (matched_string, score, key)
    # thefuzz process returns different formats depending on input, 
    # since we used a dict, it returns (string, score, key)
    for match_string, score, key in results:
        # We might want a basic score threshold to filter out completely irrelevant matches
        if score > 40: 
            matched_contacts.append(_contacts_cache[key])
            
    return matched_contacts
