
let assetcategorytable;
let assetcategory;
assetcategoryfetch('/fetching/assetcategory');

async function assetcategoryfetch(url) {
    try {
        var assetpromise = await fetch(url,{method:'POST',headers:{'content-type':'application/json','auth':sessionStorage.getItem('token')}})
        assetcategory = await assetpromise.json();
        if(assetcategory.message){
            alert(assetcategory.message)
            sessionStorage.removeItem('token')
            window.location='/'
        }
        assetcategorytable = new DataTable('#assetcategorytable', {
            data: assetcategory,
            buttons: ['copy', { extend: 'excel', "title": "Asset Category" }, { extend: 'pdf', 'title': 'Asset Category' }],
            layout: {
                top: 'buttons'
            },
            scrollY:'40vh',
            scrollCollapse:true,
            columnDefs: [
                { 'className': "dt-head-center", 'targets':'_all' },
                {"className": "text-center", "targets":[2,3]}
              ],
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
                    "sWidth": "10%",
                    "bSortable": false,
                    "sClass": "alignCenter"
                },
                {
                    data: "createdAt",
                    "mData": null,
                    "sWidth": "15%",
                    "bSortable": false,
                    "sClass": "alignCenter",
                    "render": (date) => moment(date).format('DD/MM/yyyy LT')
                },
                {
                    data: "updatedAt",
                    "mData": null,
                    // "bSortable": false,
                    "sWidth": "10%",
                    "sClass": "alignCenter",
                    "render": (date) => moment(date).format('DD/MM/yyyy LT')
                },
                {
                    data: null,
                    "mData": null,
                    "sWidth": "5%",
                    "bSortable": false,
                    "sClass": "alignCenter",
                    "render": function (data) { return `<div class="btn btn-primary btn-sm btn-size" data-id=` + data.id + ` onclick="assetcategoryedit(this.getAttribute('data-id'))" data-bs-toggle="modal" data-bs-target="#assetcategoryeditmodalId">Edit </div>  
                        <div class="btn btn-danger btn-sm btn-size" data-id=` + data.id + ` onclick="assetcategorydelete(this.getAttribute('data-id'))">Delete</div>` },
                }
            ],
            autoWidth: true
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
// console.log(document.getElementsByClassName('dt-search-0'));


async function assetcategoryedit(a) {
    sessionStorage.setItem('assetcategoryid', a);
    var fetchingassetcategory = await fetch("/asset-category/details/view", {
        method: 'POST',
        headers: { 'content-type': 'application/json' , 'auth': sessionStorage.getItem('token')},
        body: `{"id":"${a}"}`
    })
    var prevassetcategorydata = await fetchingassetcategory.json();
    var assetname = document.getElementById('editassetname');
    assetname.value = prevassetcategorydata.name;
}
async function editassetcategory() {
    var id = sessionStorage.getItem('assetcategoryid');
    var editAssetName = document.getElementById('editassetname').value;
    console.log(editAssetName);
    var sendingassetname = await fetch('/asset-category/details/edit', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' , 'auth': sessionStorage.getItem('token')},
        body: `{"name":"${editAssetName}","id":"${id}"}`
    })
    var res = await sendingassetname.json();
    alert(res.message);
    datatablereload();
}
async function assetcategorydelete(id) {

    if (confirm("Do you want to delete it?") == true) {
        var sendingdeleteid = await fetch('/asset-category/delete/', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') },
            body: `{"id":"${id}"}`
        })
        var res = await sendingdeleteid.json();
        alert(res.message);
        datatablereload();
    }

}
async function addassetcategory(){
    var assetname=document.getElementById('assetname').value;
var assetcategorypromise= await fetch('/asset-category/add',{
    method:'POST',
    headers:{'content-type':'application/json', 'auth': sessionStorage.getItem('token')},
    body:`{"asset":"${assetname}"}`
})
var res=await assetcategorypromise.json();
alert(res.message);
datatablereload();
}
async function datatablereload(){
var assetpromise = await fetch('/fetching/assetcategory',{method:'POST',headers:{'content-type':'application/json','auth':sessionStorage.getItem('token')}})
assetcategory = await assetpromise.json();
assetcategorytable.clear().draw();
assetcategorytable.rows.add(assetcategory);
assetcategorytable.columns.adjust().draw();
}