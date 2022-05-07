function login() {
    $.ajax ({
        url: '/users/login', 
        type: 'POST',
        data: {
            username: $('.auth-form__input.username').val(),
            password: $('.auth-form__input.password').val(),
        }
    }).then(data => {
        if (data.status === 'ok') {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            localStorage.setItem('orders', data.orders);
            window.location.href = '/';
        }
        else alert('username or password is incorrect');
    })
}