sessionStorage.removeItem('assetcategoryid');
document.getElementById('addasset').addEventListener('click', async () => {
    try {
        var assetname = document.querySelector('#assetname').value;
        var serial_no = document.querySelector('#serial_no').value
        var model = document.querySelector('#model').value;
        var make = document.querySelector('#make').value
        var scrapstatus = document.querySelector('#scrapstatus').value
        var sendingdata = await fetch('/asset/add', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ assetname: assetname, serial_no: serial_no, model: model, make: make, scrapstatus: scrapstatus })
        })
        var res = await sendingdata.json()
        console.log(res);
    }
    catch (e) {
        console.log(e);
    }
})
assettable('/fetching/asset');
async function assettable(url) {
    try {
        var assettablepromise = await fetch(url);
        var assettabledata = await assettablepromise.json();
        console.log(assettabledata);
        const assettable = new DataTable("#assettable", {
            data: assettabledata,
            buttons: [{ extend: 'copy' }, { extend: 'excel', "title": "Asset List" }, { extend: 'pdf', "title": "Asset List" }],
            layout: {
                top: 'buttons'
            },
            columns: [
                {
                    data: 'id',
                    "sClass": "alignCenter",
                },
                {
                    data: 'serial_no',
                    "bSortable": false,
                    "sClass": "alignCenter",
                },
                {
                    data: 'name',
                    "sClass": "alignCenter",
                },
                {
                    data: 'model',
                    "bSortable": false,
                    "sClass": "alignCenter",
                },
                {
                    data: 'make',
                    "bSortable": false,
                    "sClass": "alignCenter",
                },
                {
                    data: 'scrapstatus',
                    "bSortable": false,
                    "sClass": "alignCenter",
                },
                {
                    data: null,
                    "bSortable": false,
                    "sWidth": "25%",
                    "sClass": "alignCenter",
                    "render": (data) => { return `<div class="btn btn-primary" data-id=` + data.id + ` onclick="editdisplay(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#editassetmodalId">Edit</div> <div class="btn btn-primary" data-id=` + data.id + ` onclick="history(this.getAttribute('data-id'))">History</div>  <div class="btn btn-warning" data-id=` + data.id + ` onclick="issueasset()" data-bs-toggle="modal" data-bs-target="#issueassetmodalId">Issue</div> <div class="btn btn-danger disabled" data-id=` + data.id + ` onclick="history(this.getAttribute('data-id'))">Return</div>` }
                }
            ]
        })
    }
    catch (e) {
        console.log(e);
    }
}
function history(id) {
    console.log(id);
}
async function editdisplay(id) {
    try {
        var response = await fetch('/asset/details/view', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
        var data = await response.json();
        console.log("data", data.data);
        var serial_no = document.querySelector('#editserial_no').value = data.data.serial_no
        var name = document.querySelector('#editassetname').value = data.data.name
        var model = document.querySelector('#editmodel').value = data.data.model
        var scrapstatus = document.querySelector('#editscrapstatus').value = data.data.scrapstatus
        var make = document.querySelector('#editmake').value = data.data.make
        sessionStorage.setItem('assetid', id);
    }
    catch (e) {
        console.log(e);
    }
}
async function edit() {
    var id = sessionStorage.getItem('assetid');
    var serial_no = document.querySelector('#editserial_no').value
    var name = document.querySelector('#editassetname').value
    var model = document.querySelector('#editmodel').value
    var scrapstatus = document.querySelector('#editscrapstatus').value
    var make = document.querySelector('#editmake').value
    console.log(id);
    var response = await fetch('/asset/details/edit', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: id, serial_no: serial_no, name: name, model: model, make: make, scrapstatus: scrapstatus })
    })
    var data = await response.json();
    alert(data.message);
    location.reload();
    sessionStorage.removeItem('assetid');
}
async function issueasset(){
    var response= await fetch('/fetching/asset/employee');
    var data=await response.json();
    var issueassetname=document.querySelector('#issueassetname');
    console.log(data.data.length);


}