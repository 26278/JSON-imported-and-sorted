lijst = ["Theo", "Milena", "Miloš", "Rosmerta", "Ed", "Saskia", "Hidde"];
// lijst = [1,2,3,4,11,12,13,14,21,22,23,24,31,32,33,34,41]

// sorteren
lijst = lijst.sort((a, b) =>   a.length - b.length >  0 ? -1:1 );

// uitvoeren
let boeken = "";
lijst.forEach((item) => {
   boeken += item + '<br>';
});
document.getElementById('boeken').innerHTML = boeken;
