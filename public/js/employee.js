// fetching employees into table
fetching('/fetching/employeedetails')
async function fetching(url) {
    try {
        var res = await fetch(url);
        var data = await res.json();
        let table = new DataTable('#employeetable', {
            data: data,
            buttons: ['copy', { extend: 'excel', "title": "Employees" }, { extend: 'pdf', 'title': 'Employee' }],
            layout: {
                top: 'buttons'
            },
            columns: [
                {
                    data: 'id',
                    "bSortable": false,
                    "sClass": "alignCenter"
                },
                {
                    data: 'name', "mData": null,

                    "bSortable": false,
                    "sClass": "alignCenter"
                },
                {
                    data: 'email', "mData": null,

                    "bSortable": false,
                    "sClass": "alignCenter"
                },
                {
                    data: 'department', "mData": null,

                    "bSortable": false,
                    "sClass": "alignCenter"
                },
                {
                    data: 'status', "mData": null,
                    "bSortable": false,
                    "sClass": "alignCenter"
                },
                {
                    data: null,
                    "bSortable": false,
                    "sWidth":"7%",
                    "render": function (data) {
                        return `<div class="mx-auto"><a  class="btn btn-primary" data-id=` + data.id + ` onclick="editemployee(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#editmodalId">Edit</a> `//<a class="btn btn-success" data-id=` + data.id + ` onclick="Viewemployee(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#viewmodal">View</a></div>`
                    }
                }
            ]

        });

    }

    catch (e) {
        console.log(e);
    }
}
function activeinactive() {
    var customFilter = document.getElementById('customFilter').value;
    console.log(customFilter);

}
async function Viewemployee(a) {
    console.log('view')
    localStorage.setItem("id", a);
    var id = await fetch('/employee/view/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: `{"id":"${a}"}`
    })
    var message = await id.json();
    if (message) {
        // location.href = '/employee/view';
        viewemployee(a);

    }
    else {
        console.log('not checked');
    }
}
async function editemployee(a) {
    console.log(a);
    sessionStorage.setItem('editId', a);
    var employeeedit = await fetch('/employee/view/details', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: `{"id":"${a}"}`
    });
    var employeeeditdata = await employeeedit.json();
    console.log(employeeeditdata);
    var name = document.getElementById('editname').value = employeeeditdata.name;
    var email = document.getElementById('editemail').value = employeeeditdata.email;
    var contact = document.getElementById('editcontact').value = employeeeditdata.contact;
    var address = document.getElementById('editaddress').value = employeeeditdata.address;
    var branch = document.getElementById('editbranch').value = employeeeditdata.branch;
    var joindate = document.getElementById('editjoindate').value = employeeeditdata.joinDate;
    var enddate = document.getElementById('editenddate').value = employeeeditdata.endDate;
    var salary = document.getElementById('editsalary').value = employeeeditdata.salary;
    var department = document.getElementById('editdepartment').value = employeeeditdata.department;
}

var id = localStorage.getItem('id');

async function viewemployee(id) {
    console.log("viewed");
    var viewemployee = await fetch('/employee/view/details', { method: 'POST', headers: { "content-type": "application/json" }, body: JSON.stringify({ id: id }) })
    var viewemployeedata = await viewemployee.json();
    var id = document.getElementById('viewid');
    var name = document.getElementById('viewname');
    var email = document.getElementById('viewemail');
    var branch = document.getElementById('viewbranch');
    var address = document.getElementById('viewaddress');
    var joinDate = document.getElementById('viewjoinDate');
    var endDate = document.getElementById('viewendDate');
    var status = document.getElementById('viewstatus');
    var contact = document.getElementById('viewcontact');
    var salary = document.getElementById('viewsalary');
    // var photo = document.getElementById('employeeprofile');
    var department = document.getElementById('viewdepartment');
    var updated = document.getElementById('viewupdated');
    id.innerHTML = viewemployeedata.id;
    name.innerHTML = viewemployeedata.name;
    email.innerHTML = viewemployeedata.email;
    branch.innerHTML = viewemployeedata.branch;
    address.innerHTML = viewemployeedata.address;
    joinDate.innerHTML = viewemployeedata.joinDate;
    endDate.innerHTML = viewemployeedata.endDate;
    status.innerHTML = viewemployeedata.status;
    contact.innerHTML = viewemployeedata.contact;
    salary.innerHTML = viewemployeedata.salary;
    // photo.src = viewemployeedata.photo
    department.innerHTML = viewemployeedata.department;
    updated.innerHTML = viewemployeedata.updatedAt
        ;
    console.log(status.innerHTML);
    if (status.innerHTML == "Active") {
        status.style.color = "green";
    }
    else {
        status.style.color = "Red";
    }
}