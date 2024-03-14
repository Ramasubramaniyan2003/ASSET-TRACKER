
async function addassetcategory(){
    var assetname=document.getElementById('assetname').value;
var assetcategorypromise= await fetch('/asset-category/add',{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:`{"asset":"${assetname}"}`
})
var res=await assetcategorypromise.json();
alert(res.message);
console.log(res);
location.reload();
}
