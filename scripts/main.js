///////JACK_V_01.00////////
//
$(document).ready(function(){
  game.gameInit();
});

/////EVENT LISTENERS/////
//
var table ={

  render: function () {

  },

  display: function (message) {
    $("#displayMessage span").text(message);
  },

  printMoney: function (money) {
    if (money === player1.cash) {
      $playerCash = $('#cash');
      $playerCash.text(player1.cash);
    } else if (money === player1.bet) {
      $playerBet = $('#bet');
      $playerBet.text(player1.bet);
    };
  },

  fade: function (speed) {
    $("#displayMessage span").fadeIn(speed);
    $("#displayMessage span").fadeOut(speed);
  }
};

var game = {
  gameOn: false,
  startCash: 500,

  setListeners: function () {
    $("#input").keypress(function(event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode == 13) {
        player1.placeBet($("#input").val());
      }
    });

    $("#buttons-container ul li:last-child").on("click", function (){
      player1.placeBet($("#input").val());
    });

    $("#buttons-container ul li:first-child").on("click", function (){
      if (!this.gameOn) {
        this.startDeal();
      } else {
        this.dealCard();
      };
    }.bind(this));

    $("#buttons-container ul li:nth-child(3)").on("click", function (){
      player1.hit();
    });

    $("#buttons-container ul li:nth-child(2)").on("click", function (){
      player1.stand();
    });

  },

  gameInit: function () {
    this.setListeners();
    cardObj.makeDeck();
    table.printMoney(player1.cash);
    table.printMoney(player1.bet);
  },

  startDeal: function () {
    for (var i = 0; i < 2; i++) {
      this.dealCard(player1);
      this.dealCard(player2);
    };
    $("#displayMessage span").fadeOut();
    player1.viewCards();
    gameOn = true;
  },

  dealCard: function (person) {
    person.hand.push(cardObj.deck[0]);
    cardObj.deck.splice(0, 1);
  },

  getWinner: function () {
    console.log("get winner works");
    if (player1.totalHand == player2.totalHand) {
      setTimeout(function () {
        table.display("it's a tie.");
        $("#displayMessage span").fadeIn(500);
        $("#displayMessage span").fadeOut(1000);
      }, 750);
      this.reshuffle();
    } else if (player1.totalHand < player2.totalHand) {
      setTimeout(function () {
        table.display("you lost.");
        $("#displayMessage span").fadeIn(500);
        $("#displayMessage span").fadeOut(1000);
      }, 750);
      player1.cash = player1.cash - player1.bet;
      table.printMoney(player1.cash);
      this.reshuffle();
    } else if (player1.totalHand > player2.totalHand) {
      setTimeout(function () {
        table.display("you win! $$$");
        $("#displayMessage span").fadeIn(500);
        $("#displayMessage span").fadeOut(1000);
      }, 750);
      player1.cash = player1.cash + player1.bet;
      table.printMoney(player1.cash);
      this.reshuffle();
    };
  },

  reshuffle: function () {
    player1.bet = 50;
    player1.totalHand = 0;
    player2.totalHand = 0;
    for (var i = 0; i < player1.hand.length; i++) {
      cardObj.deck.push(player1.hand[i]);
      player1.hand = [];
    }
    for (var j = 0; j < player2.hand.length; j++) {
      cardObj.deck.push(player2.hand[j]);
      player2.hand = [];
    };
    $("#input").val("");
    table.printMoney(player1.bet);
    gameOn = false;
  },

  restart: function () {
    player1.cash = startCash;
    player1.bet = 50;
    gameInit();
    player1.totalHand = 0;
    player2.totalHand = 0;
    gameOn = false;
  },

  addTotals: function (value1, value2) {
    var total = 0;
    total = value1 + value2;
    return total;
  },

};

var cardObj = {
  cards: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
  suits: ["hearts", "spades", "clubs", "diams"],
  deck: [],
  dealtCards: [],
  cardValues: [1,2,3,4,5,6,7,8,9,10,10,10,10],

  makeDeck: function () {
    var cardsLen = this.cards.length;
    var suitsLen = this.suits.length;
    for (var i = 0; i < cardsLen; i++) {
      for (var j = 0; j < suitsLen; j++) {
        var cardName = this.cards[i] + "-of-" + this.suits[j]
        $cardDiv = $("<div id='" + cardName + "' class='card card-back' value='" + this.cardValues[i] + "'>");
        $("#deck-container").append($cardDiv);
        this.deck.push(
          {
            $el: $cardDiv,
            name: cardName,
            value: this.cardValues[i],
          }
        );
      };
    };
    this.shuffle(this.deck);
  },

  shuffle: function (array) {
    for(i = 0; i<array.length; i++){
      var rand = Math.floor(Math.random()*(array.length-i)+i);
      if (rand!=i){
        var temp = array[i];
        array[i] = array[rand];
        array[rand] = temp;
      };
    };
  },
};

var player1 = {
  hand: [],
  totalHand: 0,
  cash: game.startCash,
  bet: 50,

  placeBet: function (amount) {
    if (amount === "") {
      setTimeout(function () {
        table.display("enter an amount to bet.");
        table.fade(1000);
      }, 500);
    } else if (isNaN(amount)) {
      setTimeout(function () {
        table.display("please input a number to bet.");
        table.fade(1000);
      }, 500);
    } else if (amount > this.cash) {
      setTimeout(function () {
        table.display("not enough cash to make this bet.");
        table.fade(1000);
      }, 500);
    } else if (amount < 50) {
      setTimeout(function () {
        table.display("minimum bet is $50.");
        table.fade(1000);
      }, 500);
    } else {
      setTimeout(function () {
        table.display("you bet " + amount + ".");
        table.fade(1000);
      }, 500);
      this.bet = amount;
      table.printMoney(this.bet);
    };
  },

  viewCards: function () {
    this.totalHand = game.addTotals(this.hand[0].value, this.hand[1].value);
    setTimeout(function () {
      table.display("your total is " + this.totalHand);
      table.fade(1500);
    }.bind(this), 1750);

    //table.render();
  },

  hit: function () {
    game.dealCard(player1);
    this.totalHand = game.addTotals(this.totalHand, this.hand[this.hand.length-1].value);
    if (this.totalHand > 21) {
      setTimeout(function () {
        table.display("you've busted.");
        table.fade(1500);
      }, 1750);
      player1.cash = player1.cash - player1.bet;
      table.printMoney(player1.cash);
      game.reshuffle();
    } else {
      setTimeout(function () {
        table.display("your total is " + this.totalHand);
        table.fade(1500);
      }.bind(this), 1750);
    };
  },

  stand: function () {
    player2.revealCards();
  },

};

var player2 = {
  hand: [],
  totalHand: 0,
  revealCards: function () {
    console.log("reveal cards hit");
    var that = this;
    this.totalHand = game.addTotals(this.hand[0].value, this.hand[1].value);
    console.log("totals added");
    while (this.totalHand < 18) {
      console.log("while loop started");
      game.dealCard(that);
      that.totalHand = game.addTotals(that.totalHand, that.hand[that.hand.length-1].value);
      if (this.totalHand > 21) {
        setTimeout(function () {
          table.display("bank busted. you win!");
          table.fade(1000);
        }, 500);
        player1.cash = player1.cash + player1.bet;
        table.printMoney(player1.cash);
        game.reshuffle();
        break;
      } else if (this.totalHand < 21 && this.totalHand > 17) {
        console.log("last statement of while loop hit");
        game.getWinner();
      };
    };
    game.getWinner();
  },
};
