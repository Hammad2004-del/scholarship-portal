console.log("NEW FRESH JS LOADED");

const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get login token
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("jwt") ||
        localStorage.getItem("accessToken");

    if (!token) {
        alert("Please login first.");
        return;
    }

    // Get form values
    const address = document.getElementById("address").value;
    const course = document.getElementById("course").value;
    const university = document.getElementById("university").value;

    const personalStatement =
        document.getElementById("personal-statement").value;

    const academicRecords =
        document.getElementById("academic-records").files[0];

    const referenceLetter =
        document.getElementById("reference-letter").files[0];

    // Create FormData
    const formData = new FormData();

    formData.append("address", address);
    formData.append("course", course);
    formData.append("university", university);
    formData.append("personal_statement", personalStatement);

    if (academicRecords) {
        formData.append("academic_records", academicRecords);
    }

    if (referenceLetter) {
        formData.append("reference_letter", referenceLetter);
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/applications",
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
            alert("Application submitted successfully!");
            console.log("Server response:", data);
            window.location.href = "dashboard2.html";
        } else {
            alert(data.error || "Something went wrong.");
            console.error(data);
        }

    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
});