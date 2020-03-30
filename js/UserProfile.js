
function fillUserTable(d){
    console.log(typeof(d.most_used_Q));
    console.log(typeof(d.most_used_Q));
    document.getElementById("muq").innerHTML = d.most_used_Q;
    document.getElementById("avgwtime").innerHTML = d.avg_wtime;
}
