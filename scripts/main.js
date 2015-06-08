///////JACK_V_01.00////////
//
$(document).ready(function(){
  game.gameInit();
});

/////EVENT LISTENERS/////
//
var table ={

  play1cardPos: 1,
  play2cardPos: 1,

  dealRender: function () {
    player2.hand[0].$el.addClass("player2-card-left");
    player2.hand[1].$el.addClass("player2-card-right-0");
    player1.hand[0].$el.addClass("player1-card-left");
    player1.hand[1].$el.addClass("player1-card-right-0");
    setTimeout(function () {
      player2.hand[0].$el.toggleClass("flip");
      player1.hand[0].$el.toggleClass("flip");
      player1.hand[1].$el.toggleClass("flip");
    }, 1250);
  },

  hitRender: function (that, player, cardPosition) {
    var position;
    if (cardPosition === this.play1cardPos) {
      position = this.play1cardPos;
      // for (var i = position; i < that.hand.length-1; i++) {
        that.hand[that.hand.length-1].$el.addClass(player + "-card-right-" + position);
        setTimeout(function () {
          that.hand[position + 1].$el.toggleClass("flip");
        }, 1000);
      // };
      this.play1cardPos += 1;
    } else if (cardPosition === this.play2cardPos){
      position = this.play2cardPos;
      //length minus one?
      // for (var i = position; i < that.hand.length; i++) {
      console.log("flip" + position);
        that.hand[that.hand.length-1].$el.addClass(player + "-card-right-" + position);
        setTimeout(function () {
          that.hand[position + 1].$el.toggleClass("flip");
        }, 1000);
      // };
      this.play2cardPos += 1;
    }
    // that.hand[that.hand.length-1].$el.addClass(player + "-card-right-" + position);
    // for (var i = position; i < that.hand.length-1; i++) {
    //   setTimeout(function () {
    //     that.hand[i].$el.toggleClass("flip");
    //   }, 1250);
    // };
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
  },

  clearTable: function () {
    player1.hand[0].$el.removeClass("player1-card-left");
    player1.hand[0].$el.removeClass("flip");
    player2.hand[0].$el.removeClass("player2-card-left");
    player2.hand[0].$el.removeClass("flip");

    for (var i = 1; i < player1.hand.length; i++) {
      var position = i-1;
      var num = position.toString();
      player1.hand[i].$el.removeClass("player1-card-right-" + num);
      player1.hand[i].$el.removeClass("flip");
      // player1.hand[i].$el.remove();
    }
    for (var j = 1; j < player2.hand.length; j++) {
      var position = j-1;
      var num = position.toString();
      player2.hand[j].$el.removeClass("player2-card-right-" + num);
      player2.hand[j].$el.removeClass("flip");
      // player2.hand[j].$el.remove();
    };
  },

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

    $("#buttons-container ul li:last-child").on("click", function () {
      player1.placeBet($("#input").val());
    });

    $("#buttons-container ul li:first-child").on("click", function (event) {
      if (!this.gameOn) {
        this.startDeal();
      } else if (this.gameOn) {
        setTimeout(function () {
          table.display("already dealt. stand, hit or bet.");
          table.fade(1000);
        }, 500);
        event.preventDefault();
      };
    }.bind(this));

    $("#buttons-container ul li:nth-child(3)").on("click", function () {
      player1.hit();
    });

    $("#buttons-container ul li:nth-child(2)").on("click", function () {
      player1.stand();
    });

    $("#restart").on("click", function () {
      game.restart();
    });

  },

  gameInit: function () {
    this.setListeners();
    cardObj.makeDeck();
    table.printMoney(player1.cash);
    table.printMoney(player1.bet);
  },

  startDeal: function () {
    this.gameOn = true;
    for (var i = 0; i < 2; i++) {
      this.dealCard(player1);
      this.dealCard(player2);
    };
    $("#displayMessage span").fadeOut();
    table.dealRender();
    player1.viewCards();
  },

  dealCard: function (person) {
    person.hand.push(cardObj.deck[0]);
    cardObj.deck.splice(0, 1);
  },

  getWinner: function () {
    var that = this;
    console.log("get winner works");
    if (player1.totalHand > 21) {
      setTimeout(function () {
        table.display("you've busted.");
        table.fade(1000);
        player1.cash = player1.cash - player1.bet;
        table.printMoney(player1.cash);
        that.reshuffle();
      }, 2250);
    } else if (player2.totalHand > 21) {
      setTimeout(function () {
        table.display("bank busted. you win!");
        table.fade(1000);
        player1.cash = player1.cash + (player1.bet * 2);
        table.printMoney(player1.cash);
        that.reshuffle();
      }, 2250);
    } else if (player1.totalHand == player2.totalHand) {
      setTimeout(function () {
        table.display("it's a tie.");
        $("#displayMessage span").fadeIn(500);
        $("#displayMessage span").fadeOut(1250);
        that.reshuffle();
      }, 2250);
    } else if (player1.totalHand < player2.totalHand) {
      setTimeout(function () {
        table.display("bank's has a higher hand. you lost.");
        $("#displayMessage span").fadeIn(500);
        $("#displayMessage span").fadeOut(1250);
        player1.cash = player1.cash - player1.bet;
        table.printMoney(player1.cash);
        that.reshuffle();
      }, 2250);
      if (player1.cash <= 0) {
        that.gameOn = false;
        setTimeout(function () {
          table.display("game over. you have no more cash.");
          $("#displayMessage span").fadeIn(500);
          $("#displayMessage span").fadeOut(1250);
        }, 2250);
      }
    } else if (player1.totalHand > player2.totalHand) {
      setTimeout(function () {
        table.display("you win! $$$");
        $("#displayMessage span").fadeIn(500);
        $("#displayMessage span").fadeOut(1250);
        player1.cash = player1.cash + (player1.bet * 2);
        table.printMoney(player1.cash);
        that.reshuffle();
      }, 2250);
    };

  },

  reshuffle: function () {
    table.play1cardPos = 1;
    table.play2cardPos = 1;
    player1.bet = 50;
    player1.totalHand = 0;
    player2.totalHand = 0;
    table.clearTable();
    for (var i = 0; i < player1.hand.length; i++) {
      cardObj.deck.push(player1.hand[i]);
    }
    for (var j = 0; j < player2.hand.length; j++) {
      cardObj.deck.push(player2.hand[j]);
    };
    player1.hand = [];
    player2.hand = [];
    $("#input").val("");
    table.printMoney(player1.bet);
    this.gameOn = false;
  },

  restart: function () {
    cardObj.makeDeck();
    player1.cash = this.startCash;
    player1.bet = 50;
    this.gameInit();
    player1.totalHand = 0;
    player2.totalHand = 0;
    this.gameOn = false;
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
  // dealtCards: [],
  cardValues: [1,2,3,4,5,6,7,8,9,10,10,10,10],

  makeDeck: function () {
    var cardsLen = this.cards.length;
    var suitsLen = this.suits.length;
    for (var i = 0; i < cardsLen; i++) {
      for (var j = 0; j < suitsLen; j++) {
        var cardName = this.suits[j] + "-of-" + this.cards[i]
        $cardDiv = $("<div class='card' value='" + this.cardValues[i] + "'>");
        $cardDivBack = $("<div class='back'>");
        $cardSpan = $("<div class='card-text-jack'>");
        $cardSpan.text("jack.");
        $cardSpan2 = $("<div class='card-text-black'>");
        $cardSpan2.text("black.");
        $cardDivBack.append($cardSpan, $cardSpan2);
        $cardDivFace = $("<div class='face'>");
        $cardBackground = $("<div class='card-background " + cardName + "'>");
        $cardDiv.append($cardDivFace, $cardDivBack);
        $cardDivFace.append($cardBackground);
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
        table.display("you bet $" + amount + ".");
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
  },

  hit: function () {
    if (!game.gameOn) {
      $("#displayMessage span").fadeOut(500);
      setTimeout(function () {
        table.display("hit? gotta deal first man.");
        table.fade(1250);
      }, 750);
    } else if (game.gameOn) {
      game.dealCard(player1);
      this.totalHand = game.addTotals(this.totalHand, this.hand[this.hand.length-1].value);
      if (this.totalHand > 21) {
        table.hitRender(this, "player1", table.play1cardPos);
        setTimeout(function () {
          game.getWinner();
        }, 1350);
      } else {
        table.hitRender(this, "player1", table.play1cardPos);
        setTimeout(function () {
          table.display("your total is " + this.totalHand);
          table.fade(1500);
        }.bind(this), 1750);
      };
    };
  },

  stand: function () {
    if (!game.gameOn) {
      $("#displayMessage span").fadeOut(500);
      setTimeout(function () {
        table.display("deal cards first buddy.");
        table.fade(1250);
      }, 750);
    } else if (game.gameOn) {
      player2.revealCards();
    };
  },

};

var player2 = {
  hand: [],
  totalHand: 0,
  revealCards: function () {
    console.log("reveal cards hit");
    var that = this;
    this.totalHand = game.addTotals(this.hand[0].value, this.hand[1].value);
    this.hand[1].$el.toggleClass("flip");
    console.log("totals added");
    while (this.totalHand < 17) {
      console.log("while loop started");
      game.dealCard(that);
      table.hitRender(this, "player2", table.play2cardPos);
      that.totalHand = game.addTotals(that.totalHand, that.hand[that.hand.length-1].value);
      if (that.totalHand > 21) {
        break;
      } else if (that.totalHand <= 21 && that.totalHand >= 17) {
        console.log("last statement of while loop hit");
        break;
      };
    };
    console.log(this.hand);
    game.getWinner();
  },
};
