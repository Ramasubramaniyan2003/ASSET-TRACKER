
// document.getElementById('menubar').addEventListener('click', () => {
//     var sidebar = document.getElementById('sidebar')
//     var menubar = document.getElementById('menubar')
//     sidebar.style.display = "block"
//     menubar.style.display = "none"
//     sidebar.style.transitionDuration = "5s"
//     var employeetable = document.getElementById('employeetable');
//     employeetable.style.width='1220px'
//     setTimeout(()=>{$('#employeetable').DataTable().columns.adjust().draw();},400)
   
// })

// var closebutton = document.getElementById('closebutton').addEventListener('click', () => {
//     var sidebar = document.getElementById('sidebar')
//     var menubar = document.getElementById('menubar')
//     setTimeout(()=>{
//         sidebar.style.display = "none"
//         menubar.style.display = "block"
//         sidebar.style.transitionDuration = "400ms";
//     },200)
//     // sidebar.style.display = "none"
//     // menubar.style.display = "block"
//     // sidebar.style.transitionDuration = "1s";
//     // $('#employeetable').resize();
//     employeetable.style.width='100%'
//     setTimeout(()=>{$('#employeetable').DataTable().columns.adjust().draw();},400)
    
// })

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('outer');
 
    const showNavbar = (toggleId, navId, bodyId, headerId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)
    // Validate that all variables exist
    if(toggle && nav && bodypd && headerpd){
    toggle.addEventListener('click', ()=>{
    // show navbar
    console.log('called');
    toggle.classList.toggle('closebtn')
    var closebtn=document.getElementById('header-toggle1')
    // closebtn.style.position='relative';
    // closebtn.style.left='160px'

    nav.classList.toggle('show')
     setTimeout(()=>{$('#employeetable').DataTable().columns.adjust().draw();},410)
     setTimeout(()=>{$('#assettable').DataTable().columns.adjust().draw();},405)
     setTimeout(()=>{$('#assetcategorytable').DataTable().columns.adjust().draw();},400)
    // change icon
    toggle.classList.toggle('bx-x')
    // add padding to body
    bodypd.classList.toggle('body-pd')
   
    headerpd.classList.toggle('body-pd')
    })
    }
    }
    showNavbar('header-toggle1','nav-bar','body-pd','header')

    const linkColor = document.querySelectorAll('.status')
    function colorLink(){
    // if(linkColor){
    // linkColor.forEach(l=> l.classList.remove('active'))
    // this.classList.add('active')
    // }
    }
    linkColor.forEach(l=> l.addEventListener('click', colorLink))
    });
document.getElementById('profile').innerHTML = sessionStorage.getItem('username')
document.getElementById('signout').addEventListener('click',()=>{
    sessionStorage.removeItem('token');
    window.location='/'
})

