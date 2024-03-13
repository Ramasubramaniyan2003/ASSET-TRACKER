var status = "Active";
function statuschecking() {

    var a = document.getElementById('editflexSwitchCheckChecked').checked;
    if (a) {
        console.log("Active")
        status = "Active"
    }
    else {
        console.log("Inactive");
        status = "Inactive";
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
    var photo = document.getElementById('photo').value;
    var department = document.getElementById('editdepartment').value;
    var employeedata = await fetch('/employee/details/edit', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
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
            photo: photo,
            department: department,
            status: status
        })
    })
    var res = await employeedata.json();

    console.log(res);
    if (res.message) {
        alert(res.message);
        sessionStorage.removeItem('editId');
        window.location.reload();
    }
}