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
//Methode om items op te halen uit localstorage
//Methode om items te verwijderen
//Methode om items uit te voeren
//Methode om de winkelwagen aantal bij te werken
//Methode om de totaalprijs uit te rekenen

let winkelwagen = {
    items: [],

    takeItemsFrom: function(){
        let order;
        if (localStorage.getItem('orderedBooks') == null){
            order = [];
        } else {
            order = JSON.parse(localStorage.getItem('orderedBooks'));

        }
        order.forEach(item => {
            this.items.push(item);
        })
        return order;
    },

    //Item verwijderen
    deleteItem: function(ean){
        this.items.forEach((item, index) => {
            if (item.ean == ean){

            this.items.splice(index, 1)
                ean = .1;
            }
        })
        //Local storage bijwerken
        localStorage.setItem('orderedBooks', JSON.stringify(this.items));
        if (this.items.length > 0 ){
            document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
        } else {
            document.querySelector('.winkelwagen__aantal').innerHTML = "";
        }
        this.uitvoeren()
    },

    //Totaalprijs uitrekenen
    totaalPrijsBerekenen: function(){
      let total = 0;
      this.items.forEach(boek => {
          total += boek.prijs;
      });
      return total;
    },

    uitvoeren: function(){
        // Eerst de uitvoer leegmaken
        document.getElementById('uitvoer').innerHTML="";


        this.items.forEach(boek => {
            let sectie = document.createElement('section');
            sectie.className = 'besteldBoek';

            //main element met alle info behalve prijs en afbeelding
            let main = document.createElement('main');
            main.className = 'besteldBoek__main';

            //Boek cover maken
            let afbeelding = document.createElement('img');
            afbeelding.className = 'besteldBoek__img';
            afbeelding.setAttribute('src', boek.cover);
            afbeelding.setAttribute('alt', keerTextOm(boek.titel));

            //titel maken
            let titel = document.createElement('h3');
            titel.className = 'besteldBoek__titel';
            titel.textContent = keerTextOm(boek.titel);

            //prijs maken
            let prijs = document.createElement('div');
            prijs.className = "besteldBoek__prijs";
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

            //Verwijderknop maken
            let verwijder = document.createElement("div");
            verwijder.className="besteldBoek__verwijderKnop";
            let verwijderIcon = document.createElement("img")
            verwijderIcon.src="delete.svg";
            verwijderIcon.className = "verwijderKnop__img"
            verwijderIcon.addEventListener('click', () => {
                this.deleteItem(boek.ean);
            })

            // Het element toevoegen
            sectie.appendChild(afbeelding);
            main.appendChild(titel);
            sectie.appendChild(main);
            sectie.appendChild(prijs);
            sectie.appendChild(verwijder);
            verwijder.appendChild(verwijderIcon);
            document.getElementById("uitvoer").appendChild(sectie);
        });

        let sectie = document.createElement('section');
        sectie.className = 'totaal';
        //Tekst voor totale prijs
        let totalPriceText = document.createElement('div');
        totalPriceText.className = "totaal__tekst";
        totalPriceText.innerHTML = "Totaal: ";
        let totalPrice = document.createElement('div');
        totalPrice.className = "totaal__prijs";
        totalPrice.textContent = this.totaalPrijsBerekenen().toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

        sectie.appendChild(totalPriceText);
        sectie.appendChild(totalPrice);
        document.getElementById('uitvoer').appendChild(sectie);

        // winkelwagen aantal uitvoeren
        if (this.items.length > 0 ){
            document.querySelector('.winkelwagen__aantal').innerHTML= this.items.length;
        } else {
            document.querySelector('.winkelwagen__aantal').innerHTML= "";
        }
    }
};

winkelwagen.takeItemsFrom();
winkelwagen.uitvoeren();