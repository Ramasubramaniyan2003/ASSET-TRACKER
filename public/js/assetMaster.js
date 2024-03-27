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
            headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
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
let assettabledata = ''
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
        console.log('datakk', assettabledata);
        assettable = new DataTable("#assettable", {
            data: assettabledata,
            buttons: [{ extend: 'copy' }, { extend: 'excel', "title": "Asset List" }, { extend: 'pdf', "title": "Asset List" }],
            layout: {
                top: 'buttons'
            },
            scrollY: '40vh',
            scrollCollapse: true,
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
                    data: 'status',
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
                    <div class="btn btn-info btn-sm btn-size hidden" id=returnservicebutton`+ data.id + ` data-id=` + data.id + ` onclick="serviceview(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#returnserviceassetmodalId">Return Service</div>
                    `
                    }
                }
            ],
            autoWidth: true
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
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        if (data[i].transaction == 'Issue' && data[i].assetId != null) {
            var issue = document.getElementById(`assetissue${data[i].assetId}`);
            var returnbutton = document.getElementById(`returnbutton${data[i].assetId}`)
            let servicebutton = document.getElementById(`servicebutton${data[i].assetId}`)
            let returnservicebutton = document.getElementById(`returnservicebutton${data[i].assetId}`)

            if (issue == null) {
                continue;
            }
            returnservicebutton.style.display='none'
            servicebutton.style.display = 'none'
            issue.style.display = 'none';
            returnbutton.style.display = 'inline-block';
        }
        else if (data[i].transaction == 'Return' && data[i].assetId != null) {
            var issue = document.getElementById(`assetissue${data[i].assetId}`);
            var returnbutton = document.getElementById(`returnbutton${data[i].assetId}`)
            let servicebutton = document.getElementById(`servicebutton${data[i].assetId}`)
            if (issue == null) {
                continue;
            }
            issue.style.display = "inline-block"
            returnbutton.style.display = 'none';
            servicebutton.style.display = 'inline-block'
        }
        else if (data[i].transaction == 'Service' && data[i].assetId != null) {
            let returnservicebutton = document.getElementById(`returnservicebutton${data[i].assetId}`)
            var issue = document.getElementById(`assetissue${data[i].assetId}`);
            if (issue == null) {
                continue;
            }
            issue.style.display = 'none';
            returnservicebutton.style.display = 'inline-block'
            let servicebutton = document.getElementById(`servicebutton${data[i].assetId}`)
            servicebutton.style.display = 'none'
        }
        else if (data[i].transaction == 'Return Service' && data[i].assetId != null) {
            let returnservicebutton = document.getElementById(`returnservicebutton${data[i].assetId}`)
            var issue = document.getElementById(`assetissue${data[i].assetId}`);
            if (issue == null) {
                continue;
            }
            issue.style.display = 'inline-block';
            returnservicebutton.style.display = 'none'
            let servicebutton = document.getElementById(`servicebutton${data[i].assetId}`)
            servicebutton.style.display = 'inline-block'
        }
        else if (data[i].transaction == 'Scrap' && data[i].assetId != null) {
            let returnservicebutton = document.getElementById(`returnservicebutton${data[i].assetId}`)
            var issue = document.getElementById(`assetissue${data[i].assetId}`);
            if (issue == null) {
                continue;
            }
            issue.style.display = 'none';
            returnservicebutton.style.display = 'none'
            let servicebutton = document.getElementById(`servicebutton${data[i].assetId}`)
            servicebutton.style.display = 'none'
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
            if (issue != null) {
                issue.style.display = "none";
                returnbutton.style.display = "none";
                scrapbutton.style.display = "none";
                servicebutton.style.display = "none";
            }
        }
    }
}
async function editdisplay(id) {
    try {
        var response = await fetch('/asset/details/view', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
            body: JSON.stringify({ id: id })
        })
        var data = await response.json();
        if (data.Token) {
            alert(data.Token);
            sessionStorage.removeItem('token');
            window.location = "/"
        }
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
    var response = await fetch('/asset/details/edit', {
        method: 'PUT',
        headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
        body: JSON.stringify({ id: id, serial_no: serial_no, name: name, model: model, make: make, scrapstatus: scrapstatus })
    })
    var data = await response.json();
    if (data.Token) {
        alert(data.Token);
        sessionStorage.removeItem('token');
        window.location = "/"
    }
    alert(data.message);
    var assettablepromise = await fetch('/fetching/asset', { method: 'POST', headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') } });
    var assettabledata = await assettablepromise.json();
    assettable.clear().draw();
    assettable.rows.add(assettabledata);
    assettable.columns.adjust().draw();
    buttonhide()
    sessionStorage.removeItem('assetid');
}
async function history(id) {
    var response = await fetch('/asset/history', {
        method: "POST",
        headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
        body: JSON.stringify({ id: id })
    })
    var data = await response.json()
    if (data.Token) {
        alert(data.Token);
        sessionStorage.removeItem('token');
        window.location = "/"
    }

    if (data.message != 'false') {
        
        var historyassetinputtable = document.getElementById('historyassetinputtable')
        historyassetinputtable.innerHTML = `<thead class="historyheader"><th>S.No</th><th>Employee id</th> <th>Transaction</th> <th>Employee</th> <th> Date</th> <th> Remarks</th></thead>`;
        for (let i in data) {
            if (data[i].reason == null) reason = 'NA';
            else reason = data[i].reason
            if (data[i].employeeId == null) employeeId = 'NA';
            else employeeId = data[i].employeeId
            if (data[i].issueto == null) employee = 'NA';
            else employee = data[i].issueto
            historyassetinputtable.innerHTML += `<tr> <td>${i} </td><td>${employeeId} </td><td>${data[i].transaction}</td> <td>${employee}</td> <td>${moment(data[i].issuedate).format('DD/MM/YYYY')}</td> <td>${reason}</td> </tr> `
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
    buttonhide()

}
async function issueasset() {
    var id = sessionStorage.getItem('assetid');
    var issueassetname = document.querySelector('#issueassetname').value;
    var select = document.getElementById('issueassetname');
    var selected = select.options[select.selectedIndex];
    var EmployeeId = selected.getAttribute('employeeid');
    var issueassetdate = document.querySelector('#issueassetdate').value;
    var assetissuereason = document.getElementById('assetissuereason').value;
    console.log(id);
    var response = await fetch('/asset/issue', {
        method: 'POST',
        headers: {
            'content-type': 'application/json', 'auth': sessionStorage.getItem('token')
        },
        body: JSON.stringify({ EmployeeId: EmployeeId, issueto: issueassetname, issuedate: issueassetdate, AssetId: id, reason: assetissuereason })
    })
    var data = await response.json();
    if (data.Token) {
        alert(data.Token);
        sessionStorage.removeItem('token');
        window.location = "/"
    }
    alert(data.message);
    var assettablepromise = await fetch('/fetching/asset', { method: 'POST', headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') } });
    var assettabledata = await assettablepromise.json();
    assettable.clear().draw();
    assettable.rows.add(assettabledata);
    assettable.columns.adjust().draw();
    buttonhide();
}

async function returnview(id) {
    sessionStorage.setItem('assetid', id)
    var response = await fetch('/asset/return', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
        body: JSON.stringify({ id: id })
    })
    var data = await response.json();
    if (data.Token) {
        alert(data.Token);
        sessionStorage.removeItem('token');
        window.location = "/"
    }
    console.log('return', data);
    var issueassetdateinreturn = document.getElementById('issueassetdateinreturn')
    var returnassetname = document.getElementById('returnassetname');
    issueassetdateinreturn.innerHTML = moment(data.data.issuedate).format('DD/MM/YYYY');
    returnassetname.innerHTML = data.data.issueto;
    
    buttonhide();
}
async function returnasset() {
    var id = sessionStorage.getItem('assetid');
    var issueassetname = document.querySelector('#returnassetname').innerHTML;
    var returnassetdate = document.getElementById('returnassetdate').value
    var assetreason = document.getElementById('assetreason').value;
    let Today = new Date()
    const CheckingSevenDaysAgo = new Date(Today)
    // CheckingSevenDaysAgo.setDate(Today.getDate()-7)
    // if(returnassetdate>CheckingSevenDaysAgo&& returnassetdate<=Today){
    // console.log(CurrentDate);
    var response = await fetch('/asset/return/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
        body: JSON.stringify({ date: returnassetdate, reason: assetreason, id: id, transaction: "Return", issueto: issueassetname })
    })
    var data = await response.json();
    if (data.Token) {
        alert(data.Token);
        sessionStorage.removeItem('token');
        window.location = "/"
    }
    alert(data.message)
    var assettablepromise = await fetch('/fetching/asset', { method: 'POST', headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') } });
    var assettabledata = await assettablepromise.json();
    assettable.clear().draw();
    assettable.rows.add(assettabledata);
    assettable.columns.adjust().draw();
    buttonhide();
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
            headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
            body: `{"id":"${id}","reason":"${reason}","date":"${date}"}`
        })
        var data = await response.json();
        if (data.Token) {
            alert(data.Token);
            sessionStorage.removeItem('token');
            window.location = "/"
        }
        alert(data.message);

        var assettablepromise = await fetch('/fetching/asset', { method: 'POST', headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') } });
        var assettabledata = await assettablepromise.json();
        assettable.clear().draw();
        assettable.rows.add(assettabledata);
        assettable.columns.adjust().draw();
        buttonhide()
    }
}
function serviceview(id) {
    sessionStorage.setItem('serviceid', id);
}
async function service(val) {
    if (val == 'servicedate') {
        var id = sessionStorage.getItem('serviceid');
        var fromdate = document.getElementById('servicefromdate').value;
        var reason = document.getElementById('servicereason').value;

        if (confirm('Do you want to Service a asset') == true) {

            let returnservicebutton = document.getElementById('returnservicebutton' + id)
            returnservicebutton.style.display = "inline-block"

            var response = await fetch('/asset/service/', {
                method: 'POST',
                headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
                body: `{"id":"${id}","reason":"${reason}","date":"${fromdate}","transaction":"Service"}`
            })
            var data = await response.json();
            if (data.Token) {
                alert(data.Token);
                sessionStorage.removeItem('token');
                window.location = "/"
            }
            alert(data.message);
            console.log('data', data);
            var assettablepromise = await fetch('/fetching/asset', { method: 'POST', headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') } });
            var assettabledata = await assettablepromise.json();
            assettable.clear().draw();
            assettable.rows.add(assettabledata);
            assettable.columns.adjust().draw();
            buttonhide();

        }
    }
    // return date
    if (val == 'returndate') {
        var id = sessionStorage.getItem('serviceid');
        var returndate = document.getElementById('servicereturndate').value;
        var reason = document.getElementById('servicereturnreason').value;
        if (confirm('Do you want to Return a asset') == true) {
            var response = await fetch('/asset/service/return', {
                method: 'POST',
                headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
                body: `{"id":"${id}","reason":"${reason}","date":"${returndate}"}`
            })
            var data = await response.json();
            if (data.Token) {
                alert(data.Token);
                sessionStorage.removeItem('token');
                window.location = "/"
            }
            alert(data.message);
            var assettablepromise = await fetch('/fetching/asset', { method: 'POST', headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') } });
            var assettabledata = await assettablepromise.json();
            assettable.clear().draw();
            assettable.rows.add(assettabledata);
            assettable.columns.adjust().draw();
            buttonhide()
        }
    }
}
// category filter list view
Categoryfilter()
async function Categoryfilter() {
    let response = await fetch('/fetching/asset/type')
    let data = await response.json()
    let CategoryFilter = document.getElementById('CategoryFilter')
    if (data.message)
        alert(data.message)
    CategoryFilter.innerHTML = `<option value="None">All</option>`
    for (let i in data.data) {
        CategoryFilter.innerHTML += `<option value='${data.data[i].name}'>${data.data[i].name}</option>`
    }
    buttonhide()

}
async function Filter(val) {
    var StatusFilter = document.getElementById('StatusFilter').value;
    var CategoryFilter = document.getElementById('CategoryFilter').value;
    if (StatusFilter != 'None') {

        var id = await fetch('/fetching/assetdetails/statusfilter', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
            body: `{"status":"${StatusFilter}"}`
        })
        var employeesdata = await id.json();
        if (data.Token) {
            alert(data.Token);
            sessionStorage.removeItem('token');
            window.location = "/"
        }
        console.log(employeesdata);

        assettable.clear().draw();
        assettable.rows.add(employeesdata); // Add new data
        assettable.columns.adjust().draw(); // Redraw the DataTable

    }
    else if (CategoryFilter != 'None') {
        var id = await fetch('/fetching/assetdetails/categoryfilter', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
            body: `{"status":"${CategoryFilter}"}`
        })
        var employeesdata = await id.json();
        if (employeesdata.Token) {
            alert(data.Token);
            sessionStorage.removeItem('token');
            window.location = "/"
        }
        assettable.clear().draw();
        assettable.rows.add(employeesdata);
        assettable.columns.adjust().draw();
    }
    buttonhide()
}
