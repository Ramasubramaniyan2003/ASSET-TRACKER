dashboardvalues();
async function dashboardvalues() {
  var response = await fetch('/fetching/dashboard/details',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'auth': sessionStorage.getItem('token') }
    })
  var data = await response.json();
  console.log(data);
  if (data.message) {
    alert(data.message)
    sessionStorage.removeItem('token');
    window.location = '/'
  }
  var totalactiveemployees = document.getElementById('totalactiveemployees')
  var totalinactiveemployees = document.getElementById('totalinactiveemployees')
  var totalassetcategory = document.getElementById('totalassetcategory')
  var totalasset = document.getElementById('totalasset')
  var activeasset = document.getElementById('activeasset')
  var inactiveasset = document.getElementById('inactiveasset')
  var totalemployees = document.getElementById('totalemployees')
  totalemployees.innerHTML = data.total
  totalactiveemployees.innerHTML = " "+data.activecount + " "
  totalinactiveemployees.innerHTML = " " + data.inactivecount
  // totalassetcategory.innerHTML = " " + data.assetcategory
  totalasset.innerHTML = " " + data.totalasset
  activeasset.innerHTML = " "+data.activeasset + " "
  inactiveasset.innerHTML = " " + data.inactiveasset
  branch = [];//branchescount
  for (let i in data.branchescount) {
    branch[i] = data.branchescount[i].branch
  }
  branchdata = []
  for (let i in data.branchescount) {
    branchdata[i] = data.branchescount[i].count
  }
  console.log(data.branchescount);
  const myChart = new Chart("myChart", {
    type: "bar",
    data: {
      labels: branch,
      datasets: [{
        axis: 'y',
        backgroundColor: ['red', 'yellow', 'orange', 'red', 'green'],
        data: branchdata
      }
      ],
    },
    options: { legend: { display: false }, title: { display: true, text: "Branchwise Employees" }, indexAxis: 'y' }
  });
//
var assettype=[]
var assettypecount=[];
for(let i in data.assettype){
  console.log(data.assettype[i].count);
  assettype[i]=data.assettype[i].type
  assettypecount[i]=data.assettype[i].count
}

  var piedata = data.piedata;
  var pie = new Chart("assets", {
    type: "pie",
    data: {
      labels:assettype ,
      datasets: [{
        backgroundColor: ['red', 'brown', 'orange'],
        data: assettypecount
      }]
    },
    options: {
      title: {
        display: true,
        text: "Assets"
      }
    }
  });

var BranchCount=[]
branch.forEach((i)=>{
 var branchcount=0
  for(let j of data.BranchCount){
    if(i==j){
      branchcount++
    }
  }
  BranchCount.push(branchcount);
})
console.log(BranchCount);

var piedata = data.piedata;
var pie = new Chart("assetsholders", {
  type: "bar",
  data: {
    labels:branch,
    datasets: [{
      backgroundColor:['red', 'yellow', 'orange', 'red', 'green'] ,
      data: BranchCount
    }]
  },
  options: { legend: { display: false }, title: { display: true, text: "Assets Distribution" }, indexAxis: 'y' }
});

}