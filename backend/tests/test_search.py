import os
import pytest
import sys

# Ensure backend directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from data_retrieval import load_contacts_data, search_contacts, get_contacts_data

MOCK_FILE = os.path.join(os.path.dirname(__file__), "mock_contact.json")

def test_load_and_search_contacts():
    # 1. Load the mock data
    load_contacts_data(MOCK_FILE)
    
    # 2. Verify data is loaded into cache
    data = get_contacts_data()
    assert len(data) == 3
    
    # 3. Test exact match
    results = search_contacts("Helpdesk")
    assert len(results) > 0
    assert results[0]["name"] == "Helpdesk"
    
    # 4. Test misspelled query (fuzzy match)
    # searching for "Amti Soni" instead of "Amit Soni"
    results_misspelled = search_contacts("Dr Amti Soni")
    assert len(results_misspelled) > 0
    assert results_misspelled[0]["name"] == "Dr Amit Soni"
    assert results_misspelled[0]["role"] == "Registrar"
    
    # 5. Test department/category query
    results_dept = search_contacts("CSE Hod")
    assert len(results_dept) > 0
    assert results_dept[0]["name"] == "Dr. Neha Chaudhary"
