// console.log('edit');
var editstatus = "Active";
function editstatuschecking() {
    var Radio = document.getElementById('editflexSwitchCheckChecked').checked;
    let activestatus=document.getElementById('editactivestatus')
  
    if (Radio) {
        editstatus = "Active"
        activestatus.innerHTML=editstatus
    }
    else {
        editstatus = "Inactive";
      activestatus.innerHTML=editstatus 
    }
}
async function editemployeesubmit() {
    var id = sessionStorage.getItem('editId');
    var name = document.getElementById('editname').value;
    var email = document.getElementById('editemail').value;
    var contact = document.getElementById('editcontact').value;
    var address = document.getElementById('editaddress').value;
    var branch = document.getElementById('editbranch').value;
    var joindate = document.getElementById('editjoindate').value;
    var enddate = document.getElementById('editenddate').value;
    var salary = document.getElementById('editsalary').value;
    var department = document.getElementById('editdepartment').value;
    var employeedata = await fetch('/employee/details/edit', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' , 'auth': sessionStorage.getItem('token')},
        body: JSON.stringify({
            id: id,
            name: name,
            email: email,
            contact: contact,
            address: address,
            branch: branch,
            joindate: joindate,
            enddate: enddate,
            salary: salary,
            photo: null,
            department: department,
            status: editstatus
        })
    })
    var res = await employeedata.json();
    if (res.message) {
        alert(res.message);

        sessionStorage.removeItem('editId');
        var res = await fetch('/fetching/employeedetails', { method: 'POST', headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') } });
        var data = await res.json();
        table.clear().draw();
        table.rows.add(data); 
        table.columns.adjust().draw(); 
    }
    if(res.Error){
        alert(res.Error)
    }
}