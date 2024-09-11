async function performAutocomplete() {
  const query = document.getElementById("searchBar").value;
  if (query.length === 0) {
    document.getElementById("suggestions").innerHTML = "";
    document.getElementById("suggestions").classList.remove("active");
    return;
  } else {
    document.getElementById("suggestions").classList.add("active");
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
  .addEventListener("input", performAutocomplete);

document
  .getElementById("searchBar")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      const selectedSuggestion = document.querySelector(
        ".suggestion-item.selected",
      );
      if (selectedSuggestion) {
        selectSuggestion(selectedSuggestion.textContent);
      } else {
        const query = event.target.value;
        if (query) {
          document.getElementById("suggestions").innerHTML = "";
          document.getElementById("suggestions").classList.remove("active");
          SearchById();
        }
      }
    }
  });

function displaySuggestions(users) {
  const suggestionsDiv = document.getElementById("suggestions");

  suggestionsDiv.innerHTML = "";
  if (users.length === 0) {
    suggestionsDiv.innerHTML = "";
  } else {
    users.forEach((user, index) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.className = "suggestion-item";
      suggestionItem.textContent = user.studentId;
      suggestionItem.onclick = () => selectSuggestion(user.studentId);
      suggestionItem.onmouseover = () => highlightSuggestion(index);
      suggestionsDiv.appendChild(suggestionItem);
    });
  }
}

function highlightSuggestion(index) {
  const suggestionItems = document.querySelectorAll(".suggestion-item");
  suggestionItems.forEach((item, i) => {
    item.classList.toggle("selected", i === index);
  });
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

document
  .getElementById("studentData")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const studentId = document.getElementById("searchBar").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const dob = document.getElementById("dob").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact").value;
    const address = document.getElementById("address").value;
    const admission_date = document.getElementById("admission_date").value;
    const course = document.getElementById("course").value;
    const sem = document.getElementById("Sem").value;

    const studentData = {
      studentId,
      firstName,
      lastName,
      dob,
      email,
      contact,
      address,
      admission_date,
      course,
      sem,
    };

    try {
      const response = await fetch("/admin/api/students/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Student details updated successfully",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to update student details",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error("Error updating student:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred",
        confirmButtonColor: "#d33",
      });
    }
  });

document.addEventListener("click", function (event) {
  const searchBar = document.getElementById("searchBar");
  const suggestions = document.getElementById("suggestions");

  if (
    !searchBar.contains(event.target) &&
    !suggestions.contains(event.target)
  ) {
    suggestions.classList.remove("active");
  }
});
