
// var id = localStorage.getItem('id');
// console.log("viewed");
// viewemployee();
// async function viewemployee() {
//     var viewemployee = await fetch('/employee/view/details', { method: 'POST', headers: { "content-type": "application/json" }, body: JSON.stringify({ id: id }) })
//     var viewemployeedata = await viewemployee.json();

//     var name = document.getElementById('name');
//     var email = document.getElementById('email');
//     var branch = document.getElementById('branch');
//     var address = document.getElementById('address');
//     var joinDate = document.getElementById('joinDate');
//     var endDate = document.getElementById('endDate');
//     var status = document.getElementById('status');
//     var contact = document.getElementById('contact');
//     var salary = document.getElementById('salary');
//     var photo = document.getElementById('employeeprofile');
//     var department = document.getElementById('department');
//     var updated = document.getElementById('updated');
//     name.innerHTML = viewemployeedata.name;
//     email.innerHTML = viewemployeedata.email;
//     branch.innerHTML = viewemployeedata.branch;
//     address.innerHTML = viewemployeedata.address;
//     joinDate.innerHTML = viewemployeedata.joinDate;
//     endDate.innerHTML = viewemployeedata.endDate;
//     status.innerHTML = viewemployeedata.status;
//     contact.innerHTML = viewemployeedata.contact;
//     salary.innerHTML = viewemployeedata.salary;
//     photo.src = viewemployeedata.photo
//     department.innerHTML = viewemployeedata.department;
//     updated.innerHTML = viewemployeedata.updatedAt
//     ;
//     console.log(viewemployeedata);
// }