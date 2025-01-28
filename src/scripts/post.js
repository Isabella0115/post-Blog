import UI from "./utils/ui.js";
import ValidationError from "./utils/error.js";
import { api } from "./apis/api.js";

const urlParams = new URLSearchParams(window.location.search);
const currentPostId = urlParams.get("postId");

function renderPostHeader() {
    const homeButton = UI.createElement("a", { href: "./home.html", class: "btn" }, "Home");
    return UI.createElement('div', { class: 'container-root' }, [
        UI.createElement("header", { class: "header" },
            UI.createElement("h1", { class: "heading" }, "Create Post"),
            UI.createElement("div", { class: "navigation" }, homeButton)
        )
    ]);
}

function renderPostForm() {
    return UI.createElement("div", { class: "form-wrapper ", },
        UI.createElement("form", { id: "postForm", class: "post-form ", action: "#" }, [
            UI.createElement("div", { id: "error-message", class: "error-message " }, ""),
            UI.createElement("div", { class: "input-group" }, [
                UI.createElement("label", { for: "title" }, "Title"),
                UI.createElement("input", { id: "title", class: "input", type: "text", placeholder: "Title...", }),
                UI.createElement("label", { for: "authorName" }, "Author Name"),
                UI.createElement("input", { id: "authorName", class: "input", type: "text", placeholder: "Author Name...", }),
                UI.createElement("label", { for: "story" }, "Story"),
                UI.createElement("textarea", { id: "story", class: "input", rows: "6", placeholder: "Story...", }),
                UI.createElement("label", { for: "file-upload" }, "Upload Image"),
                UI.createElement("input", { id: "file-upload", class: "file-upload", type: "file", }),
                UI.createElement("img", { id: "post-img", class: "post-img", }),
            ]),
            UI.createElement("button", { id: "post-button", class: "btn", type: "submit", }, "Create Post"
            ),
        ]
        )
    );
}

function renderPostLayout() {
    const page = UI.createElement("div", { class: "page" }, [
        renderPostHeader(),
        renderPostForm(),
    ]);
    UI.render(page, document.body);
}
renderPostLayout();

document.querySelector("#post-button").addEventListener("click", function (event) {
    event.preventDefault();
    handlePostCreation();
});

async function handlePostCreation() {
    try {
        const title = document.querySelector("#title").value.trim();
        const authorName = document.querySelector("#authorName").value.trim();
        const story = document.querySelector("#story").value.trim();
        const fileUpload = document.querySelector("#file-upload");

        let uploadedFile = null;

        if (fileUpload.files.length > 0) {
            uploadedFile = await api.fileUpload.upload(fileUpload.files[0]);
        }

        const post = {
            title,
            story,
            authorName,
            img: uploadedFile ? uploadedFile.url : document.querySelector("#post-img").src,
        };

        if (validatePostData(post)) {
            await savePost(post);
            UI.clearErrorMessage();
        }
    } catch (error) {
        handleError(error);
    }
}

function validatePostData(post) {
    if (!post.title) {
        throw new ValidationError("Invalid title");
    }
    if (!post.authorName) {
        throw new ValidationError("Invalid name");
    }
    if (!post.img) {
        throw new ValidationError("Please select a file to upload.");
    }
    if (!post.story) {
        throw new ValidationError("Invalid story");
    }
    return true;
}

async function savePost(post) {
    try {
        const newPost = {
            id: currentPostId || UI.getUniqueId(),
            ...post,
        };
        let response;
        if (currentPostId) {
            response = await api.post.update(currentPostId, newPost);
            console.log("Post updated successfully");
        } else {
            response = await api.post.create(newPost);
            console.log("Post created successfully");
        }
        window.location.assign("./home.html");
    } catch (error) {
        console.log("Error updating/creating post:", error);
        window.location.assign("./home.html");
    }
}

function handleError(error) {
    if (error instanceof ValidationError) {
        const errorMessage = document.querySelector("#error-message");

        if (errorMessage) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove("d-none");
        }
    } else {
        console.error("Unexpected error:", error);
        const errorMessage = document.querySelector("#error-message");

        if (errorMessage) {
            errorMessage.textContent = "Something went wrong. Please try again later.";
            errorMessage.classList.remove("d-none");
        }
    }
}

async function fetchPost() {
    try {
        if (currentPostId) {
            document.querySelector("#post-button").textContent = "Update Post";
            const post = await api.post.getPostById(currentPostId);
            document.querySelector("#post-img").src = post.img ? post.img : "";
            document.querySelector("#title").value = post.title;
            document.querySelector("#authorName").value = post.authorName;
            document.querySelector("#story").value = post.story;
        }
    } catch (error) {
        console.error("Error fetching post:", error);
    }
}

fetchPost();