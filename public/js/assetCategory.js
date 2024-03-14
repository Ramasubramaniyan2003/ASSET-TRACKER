assetcategoryfetch('/fetching/assetcategory');
async function assetcategoryfetch(url) {
    try {
        var assetpromise = await fetch(url)
        var assetcategory = await assetpromise.json();
        var assetcategorytable = new DataTable('#assetcategorytable', {
            data: assetcategory,
            buttons: ['copy',{extend:'excel',"title":"Asset Category"},{extend:'pdf','title':'Asset Category'}],
            layout: {
                top:'buttons'
            },
            columns: [
                {
                    data: "id",
                    "mData": null,
                    "sWidth": "5%",
                    "bSortable": false,
                    "sClass": "alignCenter"
                },
                {
                    data: "name",
                    "mData": null,
                    "sWidth": "20%",
                    "bSortable": false,
                    "sClass": "alignCenter"
                },
                {
                    data: "createdAt",
                    "mData": null,
                    "sWidth": "20%",
                    "bSortable": false,
                    "sClass": "alignCenter",
                    "render": (date) => moment(date).format('DD/MM/yyyy LT')
                },
                {
                    data: "updatedAt",
                    "mData": null,
                    "bSortable": false,
                    "sWidth": "20%",
                    "sClass": "alignCenter",
                    "render": (date) => moment(date).format('DD/MM/yyyy LT')
                },
                {
                    data: null,
                    "mData": null,
                    "sWidth": "9%",
                    "bSortable": false,
                    "sClass": "alignCenter",
                    "render": function (data) { return `<div class="btn btn-primary" data-id=` + data.id + ` onclick="assetcategoryedit(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#assetcategoryeditmodalId">Edit </div>  <div class="btn btn-danger" data-id=` + data.id + ` onclick="assetcategorydelete(this.getAttribute('data-id'))">Delete</div>` },
                }
            ]
        })
    }
    catch (e) {
        console.log(e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementsByClassName('dt-search-0').style = "width: 250px ; height: 209px;"
}
)
console.log(document.getElementsByClassName('dt-search-0'));


async function assetcategoryedit(a) {
    sessionStorage.setItem('assetcategoryid', a);
    var fetchingassetcategory = await fetch("/asset-category/details/edit", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: `{"id":"${a}"}`
    })
    var prevassetcategorydata = await fetchingassetcategory.json();
    var assetname = document.getElementById('editassetname');
    assetname.value = prevassetcategorydata.name;
}
async function editassetcategory() {
    var id = sessionStorage.getItem('assetcategoryid');
    var editassetname = document.getElementById('editassetname').value;
    console.log(editassetname);
    var sendingassetname = await fetch('/asset-category/details/edit', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: `{"name":"${editassetname}","id":"${id}"}`
    })
    var res = await sendingassetname.json();
    alert(res.message);
    location.reload();
    console.log(res);
}
async function assetcategorydelete(id) {

    if (confirm("Do you want to delete it?") == true) {
        var sendingdeleteid = await fetch('/asset-category/delete/', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: `{"id":"${id}"}`
        })
        var res = await sendingdeleteid.json();
        alert(res.message);
        location.reload();
    }

}

