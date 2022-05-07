function listItem() {
    $.ajax({
        url: '/private/items/list',
        type: 'GET',
        headers: {'authorization': 'bearer ' + localStorage.getItem('token')},
    }).then((data) => {
        if (data.status === 'ok')
            window.location.href = "/items/list";
        else console.log(data.err);
    })
}