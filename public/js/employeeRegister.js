var status = "";
function statuschecking() {
    var a = document.getElementById('flexSwitchCheckChecked').checked;
    let activestatus=document.getElementById('activestatus')
    if (a) {
      
        status = "Active"
        activestatus.innerHTML=status
    }
    else {
      
        status = "Inactive";
        activestatus.innerHTML=status
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
        // var photo = document.getElementById('photo').value;
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
                photo: null,
                department: department,
                status: status
            })
        })
        var response = await res.json();
        var data = await response;
        console.log(data);
        if (data.success) {
            alert("Employee created");
            // table.clear()
            // fetching('/fetching/employeedetails')
            // .draw()
        }
        else {
            alert(data.Error);
        }
    } catch (e) {
        console.log(e);
    }
}

// function close() {
//     console.log("called");
// }