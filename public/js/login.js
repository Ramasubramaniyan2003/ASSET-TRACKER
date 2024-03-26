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
        sessionStorage.setItem('username',response.username)
        sessionStorage.setItem('password',response.password)
        sessionStorage.setItem('token',response.token);
        location.href = '/dashboard';
    }
    else {
        alert(response.message);
    }
}
