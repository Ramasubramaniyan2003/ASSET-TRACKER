async function userchecking() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var res = await fetch('/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: `{"username":"${username}","password":"${password}"}`
    })
    var response = await res.json();
    if (response.success) {
        console.log(response);
        location.href = '/employee';
    }
    else {
        alert(response.message);
    }
}
