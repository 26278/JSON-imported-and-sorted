//voorgeladen object definieren. (blueprint ophalen, maken, naampje xmlhttp geven.
let xmlhttp = new XMLHttpRequest();

//Wanneer status verandert, speelt ie de function af.(totdat json is ingeladen)
xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        sorteerBoekObject.data = JSON.parse(this.responseText);
        sorteerBoekObject.addJSDate();
        sorteerBoekObject.sorteren();
    }
}

//Wanneer de waarden van readyState en status gereed zijn, opent de xmlhttp het JSON bestand.
// 3 waarden:
// GET (method, ophalen dus),
// de locatie (url),
// boolean voor asynchroon, dat betekent dat er gewacht moet worden tot het bestand is ingeladen. true dus.
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();

//Een tabel kop in markup uitvoeren uit een array
const maakTabelKop = (arr) => {
    let kop = "<table class='boekSelectie'><tr>";
    arr.forEach((item) => {
        kop += "<th>" + item + "</th>";
    });
    kop += "</tr>";
    return kop;
}

const maakTabelRij = (arr, accent) => {
    let rij = "";
    if(accent==false){
        rij = "<tr class='boekSelectie__rij--accent'>";
    } else{
        rij = "<tr class='boekSelectie__rij'>";
    }

    arr.forEach((item) => {
        rij += "<td class='boekSelectie__cel'>" + item + "</td>";
    });
    rij += "</tr>";
    return rij;
}

//functie die van een maand-string een nummmer maakt
// waarbij Januari 0 is en december een 11 is.
const giveMonthNumber = (month) => {
    let number;
    switch(month){
        case "januari":     number = 0; break;
        case "februari":    number = 1; break;
        case "maart":       number = 2; break;
        case "april":       number = 3; break;
        case "mei":         number = 4; break;
        case "juni":        number = 5; break;
        case "juli":        number = 6; break;
        case "augustus":    number = 7; break;
        case "september":   number = 8; break;
        case "oktober":     number = 9; break;
        case "november":    number = 10; break;
        case "december":    number = 11; break;

        default: number = 0;
    }
    return number;
}

//Functie die een string van maand jaar omzet in 1 date-object

const makeValidDate = (monthYear) => {
    let myArray = monthYear.split(" ");
    let date = new Date(myArray[1], giveMonthNumber(myArray[0]));
    return date;
}

// //functie maakt van een array een opsomming met ', ' en ' en '
const makeSummary = (array) => {
    let string = "";
    for(let i=0; i<array.length; i++){
        switch (i) {
            case array.length-1 : string += array[i]; break;
            case array.length-2 : string += array[i] + " en "; break;
            default: string += array[i] + ", ";
        }
    }
    return string;
}


//Object dat de boeken uitvoert en sorteert aanmaken (methods)
//Eigenschappen: data sorteerkenmerk
//methods: sorteren() en uitvoeren()

let sorteerBoekObject = {
    data: "",       // komt van de xmlhttp.onreadychange

    kenmerk: "titel",

    oplopend: 1,

    //Een datum Object toevoegen aan this.data uit de string uitgave
    addJSDate: function () {
        this.data.forEach((item) => {
            item.JSDate = makeValidDate(item.uitgave);
        });
    },

    //data sorteren
    sorteren: function(){
        this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1*this.oplopend :  -1*this.oplopend);
        this.uitvoeren(this.data);
    },

    //de data in een tabel uitvoeren
    uitvoeren: function(data){
        let boeken = maakTabelKop( [
            "cover",
            "titel",
            "auteur(s)",
            "uitgave",
            "pagina's",
            "taal",
            "EAN"
        ]);
        for(let i = 0; i < data.length; i++){
            //geef rijen afwisselend de class .boekSelectie__rij--accent
            let accent = false;
            i%2 == 1 ? accent = true : accent = false;
            let imgElement = "<img src='" + data[i].cover + "' class='boekSelectie__img' alt='"+ data[i].titel +"'>";

                //maak opsomming van de auteurs
            let auteurs = makeSummary(data[i].auteur);
            boeken += maakTabelRij([
                imgElement,
                data[i].titel,
                auteurs,
                data[i].uitgave,
                data[i].paginas,
                data[i].taal,
                data[i].ean
            ],
            accent
            );

        }

        document.getElementById('boeken').innerHTML = boeken;
    }
}

document.getElementById('kenmerk').addEventListener('change', (e) => {
    sorteerBoekObject.kenmerk = e.target.value;
    sorteerBoekObject.sorteren();
});

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        sorteerBoekObject.oplopend = parseInt(e.target.value);
        sorteerBoekObject.sorteren();
    })
})