function checkIsValidElement(elem) {
  return elem instanceof Element;
}

const createElement = (element, attributes, children = "") => {
  if (typeof element !== "string" || element.trim() === "") {
    throw new Error("Invalid element name");
  }

  const elem = document.createElement(element);

  if (!checkIsValidElement(elem)) {
    throw new Error("Created element is invalid");
  }

  if (attributes && typeof attributes === "object") {
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        elem.setAttribute(key, attributes[key]);
      }
    }
  }
  if (children) {
    if (typeof children === "string") {
      elem.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach((child) => {
        elem.appendChild(child);
      });
    } else if (checkIsValidElement(children)) {
      elem.appendChild(children);
    }
  }
  return elem;
};

const render = (element, target) => {
  if (!checkIsValidElement(target)) {
    throw new Error("Target element is invalid");
  }
  if (!checkIsValidElement(element)) {
    throw new Error("Element to render is invalid");
  }
  target.prepend(element);
  return target;
};

const UI = {
  createElement,
  render,
  getUniqueId,
  isValidUrl,
  clearErrorMessage,
};

export default UI;

function getUniqueId() {
  return Date.now() + Math.floor(Math.random() * 1000) + "";
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

function clearErrorMessage() {
  const errorMessage = document.querySelector("#error-message");
  if (errorMessage) {
    errorMessage.textContent = "";
    errorMessage.classList.add("d-none");
  }
}
