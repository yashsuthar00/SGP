async function performAutocomplete() {
  const query = document.getElementById("searchBar").value;
  if (query.length === 0) {
    document.getElementById("suggestions").innerHTML = "";
    return;
  }
  try {
    const response = await fetch(
      `/admin/api/student-logs?q=${encodeURIComponent(query)}`,
    );
    const users = await response.json();
    displaySuggestions(users);
  } catch (err) {
    console.error("Error fetching autocomplete results:", err);
  }
}

document
  .getElementById("searchBar")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const query = event.target.value;
      if (query) {
        document.getElementById("suggestions").innerHTML = " ";
        SearchById();
      }
    }
  });

function displaySuggestions(users) {
  const suggestionsDiv = document.getElementById("suggestions");
  suggestionsDiv.innerHTML = "";
  if (users.length === 0) {
    suggestionsDiv.innerHTML = "No suggestions available.";
  } else {
    users.forEach((user) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.className = "suggestion-item";
      suggestionItem.textContent = user.studentId;
      suggestionItem.onclick = () => selectSuggestion(user.studentId);
      // suggestionItem.onclick = () => SearchById();
      suggestionsDiv.appendChild(suggestionItem);
    });
  }
}

function selectSuggestion(name) {
  document.getElementById("searchBar").value = name;
  document.getElementById("suggestions").innerHTML = "";
  SearchById();
}

function SearchById() {
  const studentID = document.getElementById("searchBar").value;

  axios
    .get(`/admin/api/student-logs/${studentID}`)
    .then((response) => {
      if (response.data == null) {
        document.getElementById("studentData").reset();
      } else {
        const data = response.data;

        document.getElementById("firstName").value = data.Fname;
        document.getElementById("lastName").value = data.Lname;
        document.getElementById("dob").value = data.DOB;
        document.getElementById("email").value = data.Email;
        document.getElementById("contact").value = data.Contact;
        document.getElementById("address").value = data.Address;
        document.getElementById("admission_date").value = data.AdmissionDate;
        document.getElementById("course").value = data.Course;
        document.getElementById("Sem").value = data.Semester;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
