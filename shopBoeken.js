//voorgeladen object definieren. (blueprint ophalen, maken, naampje xmlhttp geven.
let xmlhttp = new XMLHttpRequest();

//Wanneer status verandert, speelt ie de function af.(totdat json is ingeladen)
xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        sorteerBoekObject.data = JSON.parse(this.responseText);
        sorteerBoekObject.addJSDate();
        // De data moet ook een eigenschap hebben waarbij de titels in kapitalen staan
        // zodat daarop gesorteerd kan worden.
        sorteerBoekObject.data.forEach(boek => {
            boek.titelUpper = boek.titel.toUpperCase();
            // Ook de achternaam van de eerste auteur als eigenschap in data toevoegen
            boek.sortAuteur = boek.auteur[0];
        });
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

//Functie die de titel herstelt
const keerTextOm = (string) => {
    if(string.indexOf('*') != -1) {
        let array = string.split('*');
        string = array[1] + ' ' + array[0];
    }
    return string;
}

//Winkelwagen object
//Toegevoegde items bevatten
//Methode om items toe te passen
//Methode om items te verwijderen

let winkelwagen = {
    items: [],

    takeItemsFrom: function(){
      let order;
      if (localStorage.getItem('orderedBooks') == null){
          order = [];
      } else {
          order = JSON.parse(localStorage.getItem('orderedBooks'));
          order.forEach(item => {
              this.items.push(item);
          })
          this.uitvoeren();
      }
    return order;
    },
    toevoegen: function (el) {
        this.items = this.takeItemsFrom();
        this.items.push(el);
        localStorage.setItem('orderedBooks', JSON.stringify(this.items));
        this.uitvoeren();
    },
    uitvoeren: function () {
        if (this.items.length > 0 ){
            document.querySelector('.winkelwagen__aantal').innerHTML= this.items.length;
        } else {
            document.querySelector('.winkelwagen__aantal').innerHTML= "";
        }

    }
};

winkelwagen.takeItemsFrom();


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
        // Eerst de uitvoer leegmaken
        document.getElementById('boeken').innerHTML="";


        data.forEach(boek => {
            let sectie = document.createElement('section');
            sectie.className = 'boekSelectie';

            //main element met alle info behalve prijs en afbeelding
            let main = document.createElement('main');
            main.className = 'boekSelectie__main';

            //Boek cover maken
            let afbeelding = document.createElement('img');
            afbeelding.className = 'boekSelectie__img';
            afbeelding.setAttribute('src', boek.cover);
            afbeelding.setAttribute('alt', keerTextOm(boek.titel));

            //titel maken
            let titel = document.createElement('h3');
            titel.className = 'boekSelectie__titel';
            titel.textContent = keerTextOm(boek.titel);

            // Auteurs toevoegen
            let auteurs = document.createElement('p');
            auteurs.className = 'boekSelectie__auteur';
            // Voor en achternaam omdraaien
            boek.auteur[0] = keerTextOm(boek.auteur[0]);
            // Auteurs staan in een array, deze zetten we om in een string.
            auteurs.textContent = makeSummary(boek.auteur);

            //overige info maken
            let overig = document.createElement('p');
            overig.className = 'boekSelectie__overig';
            overig.textContent =  boek.uitgave + ' | aantal pagina\'s ' + boek.paginas + ' | taal: ' + boek.taal + ' | eam: ' + boek.ean;

            //prijs maken
            let prijs = document.createElement('div');
            prijs.className = "boekSelectie__prijs";
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

            //button toevoegen
            let knop = document.createElement("button");
            knop.className = 'boekSelectie__knop';
            knop.innerHTML = 'Voeg toe aan<br>winkelwagen';
            knop.addEventListener('click', () => {
                winkelwagen.toevoegen(boek);
            });


            // Het element toevoegen
            sectie.appendChild(afbeelding);
            main.appendChild(titel);
            main.appendChild(auteurs);
            main.appendChild(overig);
            sectie.appendChild(main);
            prijs.appendChild(knop);
            sectie.appendChild(prijs);
            document.getElementById("boeken").appendChild(sectie);
        })
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