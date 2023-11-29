document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Replace these with your actual username and password
    const correctUsername = "user123";
    const correctPassword = "password123";

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberCheckbox = document.getElementById("remember");

    const enteredUsername = usernameInput.value;
    const enteredPassword = passwordInput.value;

    if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
      // Redirect to the home page in the same directory (e.g., home.html)
      window.location.href = "home_page/home.html";
    } else {
      // Display an error message or handle the login failure
      alert("Invalid username or password. Please try again.");
    }
  });
});
