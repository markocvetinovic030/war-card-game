/////// SEKCIJA 1 - Definisanje spila ///////////////////

//Trebaju nam 4 simbola po 13 karata (od 1 do K)
let simboli = ['♠️', '♣️', '♥️', '♦️']

let karte = [1,2,3,4,5,6,7,8,9,10,'J','Q','K']

let spil = []
simboli.forEach(simbol => {
    karte.forEach(karta => {
        let vrednost = karta
        if(karta === 'J') {
            vrednost = 12
        } else if(karta === 'Q'){
            vrednost = 13
        } else if(karta === 'K'){
            vrednost = 14
        }
        spil.push(
            {
                //simbol: simbol,
                //karta: karta,
                //vrednost: vrednost
                //moze krace ako su isti nazivi kljuca i vrednosti:
                simbol,
                karta,
                vrednost
            }
            )
    })
})


//////// SEKCIJA 2 - Definisanje igraca


class Player {
    constructor(name = 'NN', spil, naRedu = false){
        this.name = name
        this.spil = document.querySelector('.igrac:nth-child(' + spil + ')')
        this.spil.dataset.igrac =  spil
        this.naRedu = naRedu
    }
    karte = []
    poeni = 0

    dodajKartu (karta) {
        this.karte = [karta, ...this.karte]
    }

    izbaciKartu () {
        this.karte.splice(0, 1)
    }
}


////// SEKCIJA 3 - Definisanje same igre i ubacivanje igraca

class Game {
    igraci = []
    otvoreneKarte = 0
    prva = ''
    druga = ''
    rezultat= document.querySelector('#rezultat')

    startGame () {
        let ime = prompt('Unesi ime prvog igraca')
        let player1 = new Player(ime, 1, true)
        let ime2 = prompt('Unesi ime drugog igraca')
        let player2 = new Player(ime2, 2)
        this.igraci = [player1, player2]

        this.rezultat.innerHTML = '0 : 0'
        this.igraci[0].spil.querySelector('.karta').textContent = ''
        this.igraci[1].spil.querySelector('.karta').textContent = ''
        this.igraci[0].spil.classList.add('active')

        this.deliKarte(this.igraci)

        player1.spil.addEventListener('click', this.okreniKartu)
        player2.spil.addEventListener('click', this.okreniKartu)

        document.querySelector('#reset').addEventListener('click', () => this.startGame())
    }

    

    deliKarte(igraci){
        let izmesaniSpil = mesaj(spil)
    
        izmesaniSpil.forEach((karta, index) => {
            //if(index % 2){
            //    player1.karte.push(karta)
            //} else{
            //    player2.karte.push(karta)
            //}
    
            //Ternary operator => isto kao ovaj if gore:
            // uslov ? true : false
            index % 2 ? igraci[0].dodajKartu(karta) : igraci[1].dodajKartu(karta)
        })
    }


    okreniKartu = (e) => {
        let igrac = this.igraci[e.currentTarget.dataset.igrac - 1]
        //Da li je on na redu?
        if(!igrac.naRedu){
            return false
        }
        let karta = igrac.karte[0].simbol +  igrac.karte[0].karta
        let vrednost = igrac.karte[0].vrednost
        igrac.spil.querySelector('.karta').textContent =   karta
        igrac.izbaciKartu()

        //ako je na redu, vise nije
        //ako nije, sada jeste
        this.igraci.forEach(igrac => {
            igrac.naRedu = !igrac.naRedu

            if(igrac.naRedu){
                igrac.spil.classList.add('active')
            } else{
                igrac.spil.classList.remove('active')
            }
        })

        

        //da li je otvorena druga karta? ako jeste, uporedi ih.
        this.otvoreneKarte++
        if(this.otvoreneKarte % 2 !== 0){
            this.igraci[1].spil.querySelector('.karta').textContent = ''
            this.prva = vrednost
        } else{
            this.druga = vrednost
            this.dodajPoene()

            if(!this.igraci[1].karte.length){
                this.rezultat.innerHTML = 'IGRA GOTOVA! REZULTAT: ' + this.rezultat.innerHTML
                this.igraci[0].spil.removeEventListener('click', this.okreniKartu)
                this.igraci[1].spil.removeEventListener('click', this.okreniKartu)
                this.igraci[0].spil.classList.remove('active')
            }
        }
    }

    dodajPoene() {
        if(Number(this.prva) > Number(this.druga)){
            this.igraci[0].poeni++
        } else if(Number(this.druga) > Number(this.prva)){
            this.igraci[1].poeni++
        }
        this.rezultat.innerHTML = this.igraci[0].poeni + ' : ' + this.igraci[1].poeni
    }
}



///////////// SEKCIJA 4 - Ostale funkcije i pokretanje igre


function mesaj(spil){
    let izmesaniSpil = []
    let tempSpil = [...spil]
    //Da prodjemo kroz ceo spil i da izmesamo nasumicno sve 52 pozicije
    for(let i = 0; i < spil.length; i++){
        let random = Math.floor(Math.random() * tempSpil.length)
        izmesaniSpil[i] = tempSpil[random]
        tempSpil.splice(random, 1)
    }
    return izmesaniSpil
}


let igra = new Game()
igra.startGame()
