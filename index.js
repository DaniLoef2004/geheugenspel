//Een class voor alle audios

class AudioController {

    //de constructor zorgt ervoor dat we een bepaalde instantie kunnen oproepen uit deze klasse

    constructor() {
        this.bgMusic = new Audio("assets/Audio/creepy.mp3");
        this.flipSounds = new Audio("assets/Audio/flip.wav");
        this.matchSound = new Audio("assets/Audio/match.wav");
        this.victorySound = new Audio("assets/Audio/victory.wav");
        this.gameOverSound = new Audio("assets/Audio/gameOver.wav");
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }

    //klasse om de standaardmuziek te laten spelen

    startMusic() {
        this.bgMusic.play();
    }

    //klasse om de standaardmuziek te pauzeren en te resetten naar het begin

    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    //klase om het geluid te spelen van een draaiende kaart

    flip() {
        this.flipSounds.play();
    }

    //klasse om het geluid te spelen van 2 matchende kaarten

    match() {
        this.matchSound.play();
    }

    //klasse om het geluid te spelen wanneer gewonnen is

    victory() {
        this.stopMusic();
        this.victorySound.play();
    }

    //klasse om het geluid te spelen wanneer verloren is

    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MemoryGame {

    constructor(totalTime, cards) {

        //array voor de kaarten

        this.cardsArray = cards;

        //de totale tijd

        this.totalTime = totalTime;

        //tijd over, wanneer game start gelijk aan totaltime

        this.timeRemaining = totalTime;

//maakt de timer en de duur ervan uit time-remaining

        this.timer = document.getElementById("time-remaining");

        //maakt een ticker voor elke keer als je een kaart omdraaid

        this.ticker = document.getElementById("flips");

        //maakt een audiocontroller die hoort bij dit specifieke object

        this.audioController = new AudioController();
    }

    //wat allemaal wordt afgespeeld wanneer de game wordt gestart

    startGame() {

        //zorgt dat er geen kaarten gechecked hoeven worden

        this.cardToCheck = null;

        //zet de flips terug naar 0

        this.totalClicks = 0;

        //reset de timer naar de begintijd

        this.timeRemaining = this.totalTime;

        //maakt een lege array voor matchedcards om alle gematchde kaarten in te stoppen

        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {

            //start de muziek, shuffle de kaarten, start de countdown, zet busy in false

this.audioController.startMusic();
this.shuffleCards(this.cardsArray);
this.countdown = this.startCountdown();
this.busy = false;
//wacht 500ms voordat de functie wordt uitgevoerd
            }, 500);

        //reset de ticker en de timer in de tekst

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    //Zorg dat geen enkele kaart meer visible en gematched is

    hideCards(){
        this.cardsArray.forEach(card => {
            card.classList.remove("visible");
            card.classList.remove("matched");
        });
    }

    flipCard(card) {

        //Als de kaart geflipped kan worden, dan played die de flip sounds
        //telt die er 1 bij aantal flips op
        //wordt de flip count geupdate op het scherm
        //geeft het de visible class, wat met een animatie zichtbaar wordt

        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add("visible");

            //als this.cardtocheck is niet 0, dan zoekt die voor een match, anders wordt
            // die toegevoegd aan kaarten die gechecked moeten worden

            if (this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }

    checkForCardMatch(card) {

        //als de kaarten dezelfde waarde hebben, dan matchen ze, anders matchen ze niet.
        // kaarten om te checken wordt gereset

        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
            else
                this.cardMisMatch(card, this.cardToCheck);

            this.cardToCheck = null;
    }

    //beide kaarten worden naar de gematchde array gepushed.
    //beide kaarten krijgen de matched class (CSS animatie)
    //Geeft het geluid dat de kaarten zijn gematched
    //kijkt of de de lengte van de matched cards gelijk staat aan de array van alle kaarten
    // , en roept dan victory aan

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add("matched");
        card2.classList.add("matched");
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }

    //zorgt ervoor dat er geen kaarten aangeklikt kunnen worden wanneer de kaarten terugdraaien
    //geeft een 1000ms 1 second delay om naar de kaarten te kijken voor die wordt teruggedraaid
    //removed de visible classes van de 2 mismatched kaarten

    cardMisMatch(card1, card2){
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove("visible");
            card2.classList.remove("visible");
            this.busy = false;
        }, 1000);
    }

    //checked wat de waarde is van de kaarten (src)

    getCardType(card) {
        return card.getElementsByClassName("card-value")[0].src;
    }
    startCountdown() {

        //

        return setInterval(() => {

            //elke 1000ms, -1

            this.timeRemaining--;

            //tijd over updaten op het scherm

            this.timer.innerText = this.timeRemaining;

            //wanneer de tijd over 0 is, dan ga je naar gameover

            if(this.timeRemaining === 0)
                this.gameOver();

            //elke 1000ms (1 seconde) opvragen

        }, 1000)
    }

    gameOver() {

        //de countdown stopt

        clearInterval(this.countdown);

        //gameover sound speelt

        this.audioController.gameOver();

        //de gameover overlay wordt zichtbaar

        document.getElementById("game-over-text").classList.add("visible");
    }

    victory() {

        //stopt de countdown

        clearInterval(this.countdown);

        //speelt de victory sound

        this.audioController.victory();

        //zorgt dat de victory overlay zichtbaar wordt

        document.getElementById("victory-text").classList.add("visible");
    }

    //shuffled de kaarten, !!!!! update beschrijving wanneer gesprek met Jorn hierover gehad !!!!!!

    //Math.random neemt een random getal tussen 0 en 1, dan nemen we i, en doen random.math * i. Dit ronden we dan af
    //past de volgorde aan waarmee het wordt gedisplayed

    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    //Als busy is false, en het is geen matched card, en het is geen card die al gechecked moet worden, dan is busy true

    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

//Wat die uitvoert wanneer alles is geladen

function ready() {

    //Maakt een array van de overlay

    let overlays = Array.from(document.getElementsByClassName("overlay-text"));

    //maakt een array van de cards
    //Zet de totale tijd naar 70 secondes

    let cards = Array.from(document.getElementsByClassName("card"));
    let game = new MemoryGame(70, cards);

    //Voor elke overlay, voeg een eventlistener toe
    //Remove de zichtbaarheid van de overlay

    overlays.forEach(overlay => {
        overlay.addEventListener("click", () => {
            overlay.classList.remove("visible");
            game.startGame();
        });
    });

    //Voegt voor elke kaart een eventlistener toe

    cards.forEach(card => {
        card.addEventListener("click", () => {
            game.flipCard(card);
        });
    });
}

//Wanneer het aan het laden is
if(document.readyState === "loading"){
    //Als alles is geladen in het document, zeg dat het ready is
    document.addEventListener("DOMContentLoaded", ready());

    //Anders is die ook ready, en is die hiervoor al geladen
} else {
    ready();
}