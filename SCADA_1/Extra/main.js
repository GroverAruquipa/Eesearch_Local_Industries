
/* Program*/
var today = new Date();
var date= today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
document.getElementById("p1").innerHTML = date;



var date2= today.getHours()+':'+(today.getMinutes()+1)+':'+today.getSeconds();
document.getElementById("p2").innerHTML = date2;














/*

var nombre="nombre";
var attitude="23";

var datos=document.getElementById("example");
datos.innerHTML=nombre+" "+attitude;


function showname(nombre,attitude){
    var datos=document.getElementById("example");
    datos.innerHTML=nombre+" "+attitude;
}
showname(nombre,attitude);

*/