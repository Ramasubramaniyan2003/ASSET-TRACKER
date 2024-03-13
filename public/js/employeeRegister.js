// var addemployeebutton=document.getElementById('addemployeelogo');
// console.log("xcxccx",addemployeebutton)
// addemployeebutton.innerHTML='Add employee';

var status = "";
function statuschecking() {

    var a = document.getElementById('flexSwitchCheckChecked').checked;
    if (a) {
        console.log("Active")
        status = "Active"
    }
    else {
        console.log("Inactive");
        status = "Inactive";
    }
}
async function registeremployee() {
    try {

        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var contact = document.getElementById('contact').value;
        var address = document.getElementById('address').value;
        var branch = document.getElementById('branch').value;
        var joindate = document.getElementById('joindate').value;
        var enddate = document.getElementById('enddate').value;
        var salary = document.getElementById('salary').value;
        var photo = document.getElementById('photo').value;
        var department = document.getElementById('department').value;

        var res = await fetch("/employee/register/submit", {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
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
        var response = await res.json();
        var data = await response;
        console.log(data);
        if (data.success) {
            alert("User created");
            location.reload();
        }
        else {
            alert('Please Enter Valid details...');
        }
    } catch (e) {
        console.log(e);
    }
}

