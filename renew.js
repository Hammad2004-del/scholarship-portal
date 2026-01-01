const correctUsername = "admin";
        const correctPassword = "password";

        // Get the login button
        const loginBtn = document.getElementById("login-btn");

        // Add event listener to the login button
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // Get the username and password inputs
            const usernameInput = document.getElementById("username");
            const passwordInput = document.getElementById("password");

            // Get the input values
            const username = usernameInput.value;
            const password = passwordInput.value;

            // Check if the username and password are correct
            if (username === correctUsername && password === correctPassword) {
                // Redirect to the dashboard page
                window.location.href = "dashboard2.html";
            } else {
                // Display an error message
                const errorMessage = document.getElementById("error-message");
                errorMessage.innerHTML = "Invalid username or password.";
            }
        });