function logout() {
    $.ajax ({
        url: '/users/logout',
        type: 'GET',
        headers: {'authorization': 'bearer ' + localStorage.getItem('token')},
    }).then(data => {
        if (data.status === 'ok') {
            localStorage.clear();
            window.location.href = "/";
        }
        else console.log(data.err);
    })
}