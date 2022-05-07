function addNumItem() {
    $.ajax({
        url: '/private/items/add',
        type: 'GET',
        headers: {'authorization': 'bearer ' + localStorage.getItem('token')},
    }).then((data) => {
        console.log(data);
        if (data.status === 'ok')
            window.location.href = "/items/add";
        else console.log(data.err);
    })
}