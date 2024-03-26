// const sidebar = document.querySelector(".sidebar");
// const sidebarClose = document.querySelector("#sidebar-close");
// const menu = document.querySelector(".menu-content");
// const menuItems = document.querySelectorAll(".submenu-item");
// const subMenuTitles = document.querySelectorAll(".submenu .menu-title");

// sidebarClose.addEventListener("click", () => sidebar.classList.toggle("close"));

// menuItems.forEach((item, index) => {
//   item.addEventListener("click", () => {
//     menu.classList.add("submenu-active");
//     item.classList.add("show-submenu");
//     menuItems.forEach((item2, index2) => {
//       if (index !== index2) {
//         item2.classList.remove("show-submenu");
//       }
//     });
//   });
// });

// subMenuTitles.forEach((title) => {
//   title.addEventListener("click", () => {
//     menu.classList.remove("submenu-active");
//   });
// });

//old
// window.location.reload()
var menubar = document.getElementById('menubar').addEventListener('click', () => {
    var sidebar = document.getElementById('sidebar')
    var menubar = document.getElementById('menubar')
    sidebar.style.display = "block"
    menubar.style.display = "none"
    menubar.style.display = "none"
    sidebar.style.transitionDuration = "5s"
})
var closebutton = document.getElementById('closebutton').addEventListener('click', () => {
    var sidebar = document.getElementById('sidebar')
    var employeetable = document.getElementById('employeetablehead')
    var menubar = document.getElementById('menubar')
    sidebar.style.display = "none"
    menubar.style.display = "block"
    sidebar.style.transitionProperty = "width"
    sidebar.style.transitionDuration = "1s";
    // employeetable.style.width='auto'
})
document.getElementById('profile').innerHTML = sessionStorage.getItem('username')
document.getElementById('signout').addEventListener('click',()=>{
    sessionStorage.removeItem('token');
    // window.location.reload();
    window.location='/'
})

