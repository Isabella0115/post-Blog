import UI from "./utils/ui.js";
import { api } from "./apis/api.js";
import { Storage } from "./utils/storage.js";
import ValidationError from './utils/error.js';

function buildLoginHeader() {
    return UI.createElement("header",{ class: "header" },
        UI.createElement("a",{ href: "./home.html", class: "btn" },"Home")
    );
}

function buildLoginForm() {
    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");
    const rememberMeChecked = storedEmail && storedPassword ? true : false;

    return UI.createElement("div",{ class: "form-wrapper" },
        UI.createElement("div", { class: "form-container" }, [
            UI.createElement("h1", { class: "heading" }, "Welcome Back"),
            UI.createElement("p", { class: "text" }, "Please enter your details to continue."),
            UI.createElement("form", {}, [
                UI.createElement("input", {type: "text",class: "input",placeholder: "Enter your email",id: "user-email",value: storedEmail || "",required: "",}),
                UI.createElement("input", {type: "password",class: "input",placeholder: "Enter your password",id: "user-password",value: storedPassword || "",required: "",}),
                UI.createElement("div", { class: "password-info" }, [
                    UI.createElement("input", {type: "checkbox",class: "remember_me",id: "remember_me",checked: rememberMeChecked,}),
                    UI.createElement("label", { for: "remember_me" }, "Keep me logged in"),
                    UI.createElement("a", { href: "#", class: "info-btn" }, "Need help with your password?"),]),
                UI.createElement("button", { class: "btn", type: "button", id: "signin-button" }, "Create Account"),
                UI.createElement("button", { class: "btn", type: "submit" }, "Continue"),
            ])
        ])
    );
}

function setupLoginPage() {
    const page = UI.createElement("div", { class: "container-root" }, [
        buildLoginHeader(),
        buildLoginForm(),
    ]);
    UI.render(page, document.body);

    document
        .getElementById("signin-button")
        .addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "./registration.html";
        });
}

setupLoginPage();

function validateLoginForm(credentials) {
    if (!credentials.email.includes("@") || !credentials.email.includes(".")) {
        throw new ValidationError("Please enter a valid email address.");
    }
    if (credentials.password.length < 8) {
        throw new ValidationError("Your password must be at least 8 characters long.");
    }
    return true;
}

async function handleLogin() {
    try {
        const email = document.querySelector("#user-email").value.trim();
        const password = document.querySelector("#user-password").value.trim();
        const rememberMe = document.querySelector("#remember_me").checked;

        const credentials = { email, password };

        if (validateLoginForm(credentials)) {
            const response = await api.auth.login(credentials);
            if (response.accessToken && response.user) {
                Storage.setItem("token", response.accessToken);
                Storage.setItem("user", response.user);

                if (rememberMe) {
                    localStorage.setItem("userEmail", email);
                    localStorage.setItem("userPassword", password);
                } else {
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("userPassword");
                }

                window.location.assign("./home.html");
            } else {
                alert("The email or password you entered is incorrect.");
            }
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            const errorMessage = document.querySelector("#error-message");
            if (errorMessage) {
                errorMessage.textContent = error.message;
                errorMessage.classList.remove("d-none");
            }
        }
    }
}

document
    .querySelector("form")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        handleLogin();
    });