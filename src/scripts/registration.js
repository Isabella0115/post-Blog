import UI from "./utils/ui.js";
import { api } from "./apis/api.js";

const buildHeader = () => {
    return UI.createElement('div', { class: 'container-root' },
        UI.createElement("header", { class: "header" },
            buildNavButton("./home.html", "Home"),
            buildNavButton("./index.html", "Login")
        )
    );
};

const buildNavButton = (href, text) => {
    return UI.createElement("a", { href: href, class: "btn" }, text);
};

const buildRegistrationForm = () => {
    return UI.createElement("div", { class: "form-wrapper" },
        UI.createElement("div", { class: "form-container" }, [
            buildHeading("Registration Form"),
            UI.createElement("p", { class: "text" }, "Please fill out the form carefully to register."),
            buildRegistrationFormElements()
        ])
    );
};

const buildHeading = (text) => {
    return UI.createElement("h1", { class: "heading" }, text);
};

const buildRegistrationFormElements = () => {
    return UI.createElement("form", { id: "registration-form" }, [
        UI.createElement("div", { id: "error-message", class: "error-message" }),
        UI.createElement("div", { class: "input-box" }, [
            buildInputField("text", "firstName", "First Name"),
            buildInputField("text", "lastName", "Last Name"),
            buildInputField("email", "email", "Email"),
            buildInputField("text", "username", "Username"),
            buildInputField("password", "password", "Password"),
            buildInputField("file", "file-upload", "Upload Image", "file-upload")
        ]),
        UI.createElement("div", { class: "submit-info" },
            UI.createElement("button", { class: "btn", type: "submit" }, "Confirm")
        ),
    ]);
};

const buildInputField = (type, id, placeholder, className = "input") => {
    return UI.createElement("input", { type: type, id: id, class: className, placeholder: placeholder });
};

const setupRegistrationPage = () => {
    const page = UI.createElement("div", { class: "page" }, [
        buildHeader(),
        buildRegistrationForm()
    ]);
    UI.render(page, document.body);
};

const handleUserRegistration = async () => {
    try {
        const user = collectUserData();
        validateUserInput(user);
        const uploadedImage = await api.fileUpload.upload(user.avatarFile);
        user.avatar = uploadedImage.url;
        await registerUser(user);
    } catch (error) {
        displayError(error);
    }
};

const collectUserData = () => {
    return {
        firstName: document.querySelector("#firstName").value.trim(),
        lastName: document.querySelector("#lastName").value.trim(),
        username: document.querySelector("#username").value.trim(),
        email: document.querySelector("#email").value.trim(),
        password: document.querySelector("#password").value.trim(),
        avatarFile: document.querySelector("#file-upload").files[0]
    };
};

const displayError = (error) => {
    const errorMessage = document.querySelector("#error-message");
    if (errorMessage) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("d-none");
    }
};

const validateUserInput = (user) => {
    if (!user.firstName) throw new Error("Invalid first name");
    if (!user.lastName) throw new Error("Invalid last name");
    if (!user.email.includes("@")) throw new Error("Invalid email address");
    if (user.username.length < 6) throw new Error("Username must be at least 6 characters");
    if (user.password.length < 6) throw new Error("Password must be at least 6 characters");
};

const registerUser = async (newUser) => {
    try {
        const response = await api.auth.register(newUser);
        if (response && response.id) {
            console.log("User registered successfully!");
            window.location.assign("./index.html");
        } else {
            alert("Something is wrong, please check your details");
        }
    } catch (error) {
        console.error("User registration failed:", error);
        alert("Registration failed: " + error.message);
    }
};

const initializePage = () => {
    setupRegistrationPage();
    document.querySelector("#registration-form").addEventListener("submit", (event) => {
        event.preventDefault();
        handleUserRegistration();
    });
};

initializePage();
