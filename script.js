document.addEventListener("DOMContentLoaded", () => {
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
});
