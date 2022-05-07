function createItem() {
    $.ajax({
        url: '/private/items/create',
        type: 'GET',
        headers: {'authorization': 'bearer ' + localStorage.getItem('token')},
    }).then((data) => {
        console.log(data);
        if (data.status === 'ok')
            window.location.href = "/items/create";
        else console.log(data.err);
    })
}