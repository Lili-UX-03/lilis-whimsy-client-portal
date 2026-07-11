document.addEventListener("DOMContentLoaded", () => {
  // View switching
  const links = document.querySelectorAll(".nav-link");
  const views = document.querySelectorAll(".view");

  function showView(viewId) {
    views.forEach(view => {
      view.classList.toggle("active", view.id === viewId);
    });

    links.forEach(link => {
      link.classList.toggle("active", link.dataset.view === viewId);
    });
  }

  links.forEach(link => {
    link.addEventListener("click", () => {
      showView(link.dataset.view);
    });
  });

  showView("dashboard");

  // Form validation
  const forms = document.querySelectorAll(".form");

  forms.forEach(form => {
    const submitBtn = form.querySelector(".primary-btn");
    const requiredInputs = form.querySelectorAll("input[type='text'], input[type='email'], textarea");

    function validateForm() {
      let isValid = true;

      requiredInputs.forEach(input => {
        const errorMsg = input.parentElement.querySelector(".error-message");
        const value = input.value.trim();

        if (!value) {
          input.classList.add("error");
          if (errorMsg) {
            errorMsg.textContent = "This field is required";
            errorMsg.classList.add("show");
          }
          isValid = false;
        } else if (input.type === "email" && !isValidEmail(value)) {
          input.classList.add("error");
          if (errorMsg) {
            errorMsg.textContent = "Please enter a valid email address";
            errorMsg.classList.add("show");
          }
          isValid = false;
        } else {
          input.classList.remove("error");
          if (errorMsg) {
            errorMsg.classList.remove("show");
          }
        }
      });

      return isValid;
    }

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    requiredInputs.forEach(input => {
      input.addEventListener("blur", () => {
        const errorMsg = input.parentElement.querySelector(".error-message");
        const value = input.value.trim();

        if (!value) {
          input.classList.add("error");
          if (errorMsg) {
            errorMsg.textContent = "This field is required";
            errorMsg.classList.add("show");
          }
        } else if (input.type === "email" && !isValidEmail(value)) {
          input.classList.add("error");
          if (errorMsg) {
            errorMsg.textContent = "Please enter a valid email address";
            errorMsg.classList.add("show");
          }
        } else {
          input.classList.remove("error");
          if (errorMsg) {
            errorMsg.classList.remove("show");
          }
        }
      });

      input.addEventListener("input", () => {
        if (input.classList.contains("error")) {
          input.classList.remove("error");
          const errorMsg = input.parentElement.querySelector(".error-message");
          if (errorMsg) {
            errorMsg.classList.remove("show");
          }
        }
      });
    });

    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (validateForm()) {
        const successMsg = form.parentElement.querySelector(".success-message");
        if (successMsg) {
          successMsg.classList.add("show");
          setTimeout(() => {
            successMsg.classList.remove("show");
          }, 3000);
        }

        // Clear form
        form.reset();
        requiredInputs.forEach(input => {
          input.classList.remove("error");
        });

        console.log("Form submitted successfully");
      }
    });
  });

  // File input preview
  const fileInputs = document.querySelectorAll("input[type='file']");

  fileInputs.forEach(input => {
    input.addEventListener("change", (e) => {
      const files = e.target.files;
      const fileList = input.parentElement.querySelector(".file-list");

      if (fileList && files.length > 0) {
        // Add new files to display
        Array.from(files).forEach(file => {
          const fileItem = document.createElement("div");
          fileItem.className = "file-item";
          fileItem.innerHTML = `
            <span>${file.name}</span>
            <button type="button" class="file-item-remove" aria-label="Remove file">×</button>
          `;

          fileList.appendChild(fileItem);

          fileItem.querySelector(".file-item-remove").addEventListener("click", (e) => {
            e.preventDefault();
            fileItem.remove();
          });
        });
      }
    });
  });
});
