const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get JWT token saved during login
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
       window.location.href = "RenewalForm.html";
        return;
    }

    // Get form values
    const yearOfStudy = document.getElementById("year-of-study").value;
    const academicRecords =
        document.getElementById("academic-records").files[0];

    // Check required fields
    if (!yearOfStudy || !academicRecords) {
        alert("Please select your year of study and upload your academic records.");
        return;
    }

    // Create FormData
    const formData = new FormData();

    formData.append("year_of_study", yearOfStudy);
    formData.append("academic_records", academicRecords);

    try {
        const response = await fetch(
            "http://localhost:5000/api/renewals",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Renewal submitted successfully!");

            console.log("Server response:", data);

            // Optional: go back to dashboard
            window.location.href = "dashboard2.html";
        } else {
            alert(data.error || "Something went wrong while submitting your renewal.");
            console.error(data);
        }

    } catch (error) {
        console.error("Connection error:", error);
        alert("Could not connect to the server.");
    }
});