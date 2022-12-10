//Login focus function
const login = document.querySelectorAll(".input");
function inputFocus() {
  this.parentNode.classList.add("focus");
}
function inputBlur() {
  if (this.value == "" || this.value === null) {
    this.parentNode.classList.remove("focus");
  }
}
login.forEach((e) => {
  e.addEventListener("focus", inputFocus);
  e.addEventListener("blur", inputBlur);
});


// check onload on body
function checkLogin() {
  if (JSON.parse(localStorage.getItem("user")).token) {
    window.location.replace("http://127.0.0.1:5500/index.html");
  }
}

// Login fetch data and save Token
const loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", async function () {
  let loginUserName = document.getElementById("login-username").value;
  let loginPassword = document.getElementById("login-password").value;

  // Check password
  if (loginPassword.length < 7) {
    alert("password must be more the 8 characters ");
  } else {
    //   Get user
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginUserName.trim(),
        password: loginPassword.trim(),
      }),
    });
    const data = await res.json();

    //   save user
    let user = null;
    user = { ...data };
    console.log(user.token);

    //   check token
    if (user.token) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.replace("http://127.0.0.1:5500/index.html");
    } else {
      alert("please enter valid credentials");
    }
  }
});
