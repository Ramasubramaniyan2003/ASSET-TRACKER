sessionStorage.removeItem('assetcategoryid');
async function addasset() {
    var response = await fetch('/fetching/asset/type');
    var data = await response.json();
    var assettype = document.querySelector('#assettype');
    assettype.innerHTML = ""
    for (let i = 0; i < data.data.length; i++) {
        var option = `<option value="${data.data[i].name}" assetcategoryid='${data.data[i].id}'>${data.data[i].name}</option>`
        assettype.innerHTML += option
    }
}
document.getElementById('addasset').addEventListener('click', async () => {
    try {
        var assetname = document.querySelector('#assetname').value;
        var assettype = document.querySelector('#assettype').value;
        var assettypeid = document.querySelector('#assettype');
        var assetcategoryid = assettypeid.options[assettypeid.selectedIndex].getAttribute('assetcategoryid');
        var serial_no = document.querySelector('#serial_no').value
        var model = document.querySelector('#model').value;
        var make = document.querySelector('#make').value
        var scrapstatus = document.querySelector('#scrapstatus').value
        var sendingdata = await fetch('/asset/add', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ assetname: assetname, serial_no: serial_no, model: model, make: make, scrapstatus: scrapstatus, assettype: assettype, assetcategoryid: assetcategoryid })
        })
        var res = await sendingdata.json()
        console.log(res);
        alert(res.message);
        location.reload();
    }
    catch (e) {
        console.log(e);
    }
})
var assettable = "";
assettablefetching('/fetching/asset');
async function assettablefetching(url) {
    try {
        var assettablepromise = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') } });
        var assettabledata = await assettablepromise.json();
        if (assettabledata.message) {
            alert(assettabledata.message);
            sessionStorage.removeItem('token')
            window.location = "/"
        }
        assettable = new DataTable("#assettable", {
            data: assettabledata,
            buttons: [{ extend: 'copy' }, { extend: 'excel', "title": "Asset List" }, { extend: 'pdf', "title": "Asset List" }],
            layout: {
                top: 'buttons'
            },
            "columnDefs": [
                { 'className': "dt-head-center", 'targets': '_all' },
                // {"className": "text-center", "targets":[]}
            ],
            columns: [
                {
                    data: 'id',
                    "bSortable": true,
                    "sClass": "alignCenter",
                },
                {
                    data: 'serial_no',
                    "bSortable": false,
                    "sClass": "alignCenter",
                    "sWidth": "5%",
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
                    data: 'type',
                    "bSortable": false,
                    "sClass": "alignCenter",
                },
                {
                    data: 'scrapstatus',
                    "bSortable": true,
                    "sClass": "alignCenter",
                },
                {
                    data: null,
                    "bSortable": false,
                    "sWidth": "30%",
                    "sClass": "alignCenter",
                    "render": (data) => {
                        return `<div class="btn btn-primary btn-sm btn-size" data-id=` + data.id + ` onclick="editdisplay(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#editassetmodalId">Edit</div> 
                    <div class="btn btn-primary btn-sm btn-size" data-id=` + data.id + ` onclick="history(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#historyassetmodalId">History</div>  
                    <div class="btn btn-warning btn-sm btn-size" id=assetissue`+ data.id + ` data-id=` + data.id + ` onclick="issueassetview(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#issueassetmodalId">Issue</div> 
                    <div class="btn btn-danger btn-size hidden btn-sm" id=returnbutton`+ data.id + `  data-id=` + data.id + ` onclick="returnview(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#returnassetmodalId">Return</div>
                    <div class="btn btn-danger btn-sm btn-size" id=scrapbutton`+ data.id + `  data-id=` + data.id + ` onclick=" scrapview(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#scrapassetmodalId">Scrap</div>
                    <div class="btn btn-info btn-sm btn-size" id=servicebutton`+ data.id + `  data-id=` + data.id + ` onclick="serviceview(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#serviceassetmodalId">Service</div>
                    `
                    }
                }
            ],
            autoWidth: false
        })
        buttonhide();


    }
    catch (e) {
        console.log(e);
    }
}

async function buttonhide() {
    var response = await fetch('/asset/details/history/');
    var data = await response.json();
    for (let i = 0; i < data.length; i++) {
        if (data[i].transaction == 'Issue') {
            var issue = document.getElementById(`assetissue${data[i].assetId}`);
            var returnbutton = document.getElementById(`returnbutton${data[i].assetId}`)
            issue.style.display = 'none';
            returnbutton.style.display = 'inline-block';
        }
        else if (data[i].transaction == 'Return') {
            var issue = document.getElementById(`assetissue${data[i].assetId}`);
            var returnbutton = document.getElementById(`returnbutton${data[i].assetId}`)
            issue.style.display = "inline-block"
            returnbutton.style.display = 'none';
        }
    }
    scrapmode();
}

async function scrapmode() {
    var response = await fetch('/asset/scrap/status')
    var data = await response.json();

    for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].scrapstatus == "Inactive") {
            var issue = document.getElementById(`assetissue${data.data[i].id}`);
            var returnbutton = document.getElementById(`returnbutton${data.data[i].id}`)
            var scrapbutton = document.getElementById(`scrapbutton${data.data[i].id}`)
            var servicebutton = document.getElementById(`servicebutton${data.data[i].id}`);
            issue.style.display = "none";
            returnbutton.style.display = "none";
            scrapbutton.style.display = "none";
            servicebutton.style.display = "none";
        }
    }
}
async function activeinactive() {
    var customFilter = document.getElementById('customFilter').value;
    console.log(customFilter);
    var id = await fetch('/fetching/assetdetails/filter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: `{"status":"${customFilter}"}`
    })
    var employeesdata = await id.json();
    console.log(employeesdata);
    assettable.clear().draw();
    assettable.rows.add(employeesdata); // Add new data
    assettable.columns.adjust().draw(); // Redraw the DataTable
}

async function editdisplay(id) {
    try {
        var response = await fetch('/asset/details/view', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
        var data = await response.json();
        // console.log("data", data.data);
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
async function history(id) {
    var response = await fetch('/asset/history', {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    var data = await response.json()
    console.log(data);
    if (data.message != 'false') {
        var historyassetinputtable = document.getElementById('historyassetinputtable')
        historyassetinputtable.innerHTML = `<tr><th>Id</th><th>Employee id</th> <th>Transaction</th> <th> Issue to</th> <th> Date</th> <th> Remarks</th> </tr>`;
        for (let i in data) {
            if (data[i].reason == null)
                reason = 'NA';
            else
                reason = data[i].reason
            historyassetinputtable.innerHTML += `<tr> <td>${data[i].id}</td><td>${data[i].employeeId} </td><td>${data[i].transaction}</td> <td>${data[i].issueto}</td> <td>${moment(data[i].issuedate).format('DD/MM/YYYY')}</td> <td>${reason}</td> </tr>`
        }
    }
    else {
        var id = document.getElementById('historyid').innerHTML = "none"
        var issue = document.getElementById('historyissueto').innerHTML = "none"
        var issuedate = document.getElementById('historyissuedate').innerHTML = "none"
        var returndate = document.getElementById('historyreturndate').innerHTML = "none"
        var reason = document.getElementById('historyreason').innerHTML = "none"

    }
}


async function issueassetview(id) {
    sessionStorage.setItem('assetid', id)
    var response = await fetch('/fetching/asset/employee');
    var data = await response.json();
    var issueassetname = document.querySelector('#issueassetname');
    for (let i = 0; i < data.data.length; i++) {
        var val = data.data[i].id + ' - ' + data.data[i].name;
        var option = `<option value="${data.data[i].name}" employeeid='${data.data[i].id}'>${val}</option>`
        issueassetname.innerHTML += option;
        console.log(option);
    }
}
async function issueasset() {
    var id = sessionStorage.getItem('assetid');
    var issueassetname = document.querySelector('#issueassetname').value;
    var select = document.getElementById('issueassetname');
var selected = select.options[select.selectedIndex];
var employeeid = selected.getAttribute('employeeid');
    var issueassetdate = document.querySelector('#issueassetdate').value;
    var assetissuereason = document.getElementById('assetissuereason').value;
console.log(id);
    var response = await fetch('/asset/issue', {
        method: 'POST',
        headers: { 'content-type': 'application/json'
     },
        body: JSON.stringify({ employeeid: employeeid, issueto: issueassetname, issuedate: issueassetdate, assetid: id, transaction: 'Issue', reason: assetissuereason })
    })
    var data = await response.json();
    alert(data.message);
    location.reload();
}

async function returnview(id) {
    sessionStorage.setItem('assetid', id)
    var response = await fetch('/asset/return', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    var data = await response.json();
    console.log('return', data);
    var issueassetdateinreturn = document.getElementById('issueassetdateinreturn')
    var returnassetname = document.getElementById('returnassetname');
    issueassetdateinreturn.innerHTML = moment(data.data.issuedate).format('DD/MM/YYYY');
    returnassetname.innerHTML = data.data.issueto;
}
async function returnasset() {
    var id = sessionStorage.getItem('assetid');
    var issueassetname = document.querySelector('#returnassetname').innerHTML;
    var returnassetdate = document.getElementById('returnassetdate').value
    var assetreason = document.getElementById('assetreason').value;
    console.log("name", issueassetname);
    var response = await fetch('/asset/return/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ date: returnassetdate, reason: assetreason, id: id, transaction: "Return", issueto: issueassetname })
    })
    var data = await response.json();
    alert(data.message)
    location.reload();
}
function scrapview(id) {
    sessionStorage.setItem('scrapid', id)
}
async function scrap() {
    var id = sessionStorage.getItem('scrapid');
    var date = document.getElementById('scrapassetdate').value;
    var reason = document.getElementById('scrapassetreason').value;
    if (confirm('Do you want to Scarp a asset') == true) {
        var response = await fetch('/asset/scrap/', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: `{"id":"${id}","reason":"${reason}","date":"${date}","transaction":"Scrap"}`
        })
        var data = await response.json();
        alert(data.message);
        console.log(data);
        window.location.reload();
    }
}
function serviceview(id) {
    sessionStorage.setItem('serviceid', id);
}
async function service() {
    var id = sessionStorage.getItem('serviceid');
    var fromdate = document.getElementById('servicefromdate').value;
    var todate = document.getElementById('servicetodate').value;
    var reason = document.getElementById('servicereason').value;

    if (confirm('Do you want to Service a asset') == true) {
        var response = await fetch('/asset/service/', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: `{"id":"${id}","reason":"${reason}","fromdate":"${fromdate}","todate":"${todate}","transaction":"Service"}`
        })
        var data = await response.json();
        alert(data.message);
        console.log('data', data);
        window.location.reload();
    }
}