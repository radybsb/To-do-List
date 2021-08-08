var menu_btn = document.querySelector("#menu-btn");
var sidebar = document.querySelector("#sidebar");
var container = document.querySelector(".my-container");

// Navbar trigger
menu_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active-nav");
  container.classList.toggle("active-cont");
});

// Delete confirmation
$(() => {
  $(".delete-list-btn").click(() => {
    if (confirm("Click OK to delete")) {
      $(".delete-list-btn").prop("type", "submit");
      $("form.delete-list").click();
    }
  });
});