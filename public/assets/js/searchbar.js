// script.js
async function performAutocomplete() {
    const query = document.getElementById('searchBar').value;
    if (query.length === 0) {
      document.getElementById('suggestions').innerHTML = '';
      return;
    }
    try {
      const response = await fetch(`/autocomplete?q=${encodeURIComponent(query)}`);
      const users = await response.json();
      displaySuggestions(users);
    } catch (err) {
      console.error('Error fetching autocomplete results:', err);
    }
  }
  
  function displaySuggestions(users) {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = ''; // Clear previous suggestions
    if (users.length === 0) {
      suggestionsDiv.innerHTML = 'No suggestions available.';
    } else {
      users.forEach(user => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = user.name;
        suggestionItem.onclick = () => selectSuggestion(user.name);
        suggestionsDiv.appendChild(suggestionItem);
      });
    }
  }
  
  function selectSuggestion(name) {
    document.getElementById('searchBar').value = name;
    document.getElementById('suggestions').innerHTML = '';
  }
  