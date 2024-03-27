// fetching employees into table
var table = 'hello'
let tabledata='';
fetching('/fetching/employeedetails')
async function fetching(url) {
    try {
        var res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') } });
        var data = await res.json();
        // console.log(data);
        tabledata=data;
        if (data.message) {
            alert(data.message);
            sessionStorage.removeItem('token');
            window.location = "/"
        }
        
        // $ajax({
        //     url:'/fetching/employeedetails',
        //     type:'POST',
        //     headers:{'content-type':'application/json','auth':sessionStorage.getItem('token')},
        //     datatype:'json',
        //     success:(data)=>{
        //         console.log('ajax data',data);
        //     }
        // })
        table = new DataTable('#employeetable', {
            data: data,
            fixedColumns: false,
            fixedHeader: false,
            buttons: ['copy', { extend: 'excel', "title": "Employees" }, { extend: 'pdf', 'title': 'Employee' }],
            layout: {
                top: 'buttons'
            },
            scrollY: '40vh',
            scrollCollapse: true,
            columnDefs: [
                { 'className': "dt-head-center", 'targets': '_all' },
                { "className": "text-center", "targets": [] }
            ],

            columns: [
                {
                    data: 'id',
                    "bSortable": false,
                    "sClass": "alignCenter"
                },
                {
                    data: 'name',
                    "mData": null,
                    "bSortable": false,
                    "sClass": "alignCenter",

                },
                {
                    data: 'email', "mData": null,
                    "bSortable": false,

                },
                {
                    data: 'contact',
                    "mData": null,
                    "bSortable": false,

                    "sClass": "alignCenter"
                },
                {
                    data: 'department', "mData": null,
                    "bSortable": false,

                    // "sClass": "alignCenter"
                },
                {
                    data: 'branch', "mData": null,
                    "bSortable": false,

                    // "sClass": "alignCenter"
                },
                {
                    data: 'status', "mData": null,
                    // "bSortable": false,

                    "sClass": "alignCenter"
                },
                {
                    data: null,
                    "bSortable": false,
                    // "Width":"3%",
                    "render": function (data) {
                        return `<div class="mx-auto"><a class="btn btn-primary btn-sm btn-size" data-id=` + data.id + ` onclick="editemployee(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#editmodalId">Edit</a> `//<a class="btn btn-success" data-id=` + data.id + ` onclick="Viewemployee(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#viewmodal">View</a></div>`
                    }
                }
            ],
            autoWidth: true,
        });

    }
    catch (e) {
        console.log(e);
    }
}


async function Filter() {
    var Status = document.getElementById('StatusFilter').value;

    var Branch = document.getElementById('BranchFilter').value;

    var Department = document.getElementById('DepartmentFilter').value;
    if (Status != 'None') {
        var id = await fetch('/fetching/employeedetails/statusfilter', {
            method: 'POST',
            headers: { 'content-type': 'application/json',headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') }  },
            body: `{"status":"${Status}"}`
        })
        var employeesdata = await id.json();
        if (employeesdata.Token) {
            alert(employeesdata.message);
            sessionStorage.removeItem('token');
            window.location = "/"
        }
        console.log(employeesdata);
        table.clear().draw();
        table.rows.add(employeesdata);
        table.columns.adjust().draw();
    }
    else if (Department != 'None') {
        // console.log(customFilter);
        console.log(Department);
        var id = await fetch('/fetching/employeedetails/departmentfilter', {
            method: 'POST',
            headers: { 'content-type': 'application/json','auth': sessionStorage.getItem('token') },
            body: `{"status":"${Department}"}`
        })
        var employeesdata = await id.json();
        if (employeesdata.Token) {
            alert(employeesdata.message);
            sessionStorage.removeItem('token');
            window.location = "/"
        }
        table.clear().draw();
        table.rows.add(employeesdata);
        table.columns.adjust().draw();
    }
    else if (Branch) {
        // console.log(customFilter);
        var id = await fetch('/fetching/employeedetails/branchfilter', {
            method: 'POST',
            headers: { 'content-type': 'application/json','auth': sessionStorage.getItem('token')  },
            body: `{"status":"${Branch}"}`
        })
        var employeesdata = await id.json();
        if (employeesdata.Token) {
            alert(data.message);
            sessionStorage.removeItem('token');
            window.location = "/"
        }
        table.clear().draw();
        table.rows.add(employeesdata);
        table.columns.adjust().draw();

    }
    // else if(Branch!='None' && Department!='None' && Status!='None'){
    //     var id = await fetch('/fetching/employeedetails/threefilter', {
    //         method: 'POST',
    //         headers: { 'content-type': 'application/json','auth': sessionStorage.getItem('token')  },
    //         body: `{"branch":"${Branch}","department":"${Department}","status":"${Status}"}`
    //     })
        var employeesdata = await id.json();
        if (employeesdata.Token) {
            alert(data.message);
            sessionStorage.removeItem('token');
            window.location = "/"
        }
        table.clear().draw();
        table.rows.add(employeesdata);
        table.columns.adjust().draw();


    }


async function Viewemployee(a) {
    console.log('view')
    localStorage.setItem("id", a);
    var id = await fetch('/employee/view/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' ,'auth': sessionStorage.getItem('token') },
        body: `{"id":"${a}"}`
    })
    var message = await id.json();
    if (message) {
        viewemployee(a);
    }
    else {
        console.log('not checked');
    }
}
async function editemployee(a) {
    sessionStorage.setItem('editId', a);
    var employeeedit = await fetch('/employee/view/details', {
        method: 'POST',
        headers: { 'content-type': 'application/json' ,'auth': sessionStorage.getItem('token') },
        body: `{"id":"${a}"}`
    });
    var employeeeditdata = await employeeedit.json();
    if (employeeeditdata.Token) {
        alert(employeeeditdata.Token);
        sessionStorage.removeItem('token');
        window.location = "/"
    }
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
    var viewemployee = await fetch('/employee/view/details', { method: 'POST', headers: { "content-type": "application/json",'auth': sessionStorage.getItem('token')  }, body: JSON.stringify({ id: id }) })
    var viewemployeedata = await viewemployee.json();
    if ( viewemployeedata.Token) {
        alert( viewemployeedata.Token);
        sessionStorage.removeItem('token');
        window.location = "/"
    }
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
    department.innerHTML = viewemployeedata.department;
    updated.innerHTML = viewemployeedata.updatedAt
        ;
    if (status.innerHTML == "Active") {
        status.style.color = "green";
    }
    else {
        status.style.color = "Red";
    }
}
FilterView();
async function FilterView(){
    let BranchFilter=document.getElementById('BranchFilter')
    var response=await fetch('/fetch/employee/filter')
    var data=await response.json();
    BranchFilter.innerHTML=`<option value="None">All</option>`
    for(let i of data.branches){
    BranchFilter.innerHTML+=`<option value="${i.branch}">${i.branch}</option>`
}
let DepartmentFilter=document.getElementById('DepartmentFilter')
DepartmentFilter.innerHTML=`<option value="None">All</option>`

for(let i of data.department){
    DepartmentFilter.innerHTML+=`<option value="${i.department}">${i.department}</option>`
       
}

}