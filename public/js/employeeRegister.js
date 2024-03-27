var status = "Active";
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
        var department = document.getElementById('department').value;
        console.log(name,' ',branch);
        var res = await fetch("/employee/register/submit", {
            method: 'POST',
            headers: { "content-type": "application/json", 'auth': sessionStorage.getItem('token')},
            body: JSON.stringify({
                name: name,
                email: email,
                contact: contact,
                address: address,
                branch: branch,
                joindate: joindate,
                enddate: enddate,
                salary: salary,
                department: department,
                status: status
            })
        })
        var response = await res.json();
        if(response.message){
            alert(response.message)
            location.href='/'
        }
        console.log(response);
        if (response.success) {
            alert("Employee created");
            var res = await fetch('/fetching/employeedetails', { method: 'POST', headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') } });
            var data = await res.json();
            table.clear().draw();
            table.rows.add(data); 
            table.columns.adjust().draw(); 
        }
        else{
            alert(response.Error)
        }
    } catch (e) {
        console.log(e);
        alert(e)
    }
}

// function close() {
//     console.log("called");
// }