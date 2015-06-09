<!-- REMOTE NAME IS "ORIGIN" -->
##Technologies used:

1. javascript
    * -dynamically creates card deck (entire HTML card deck is stacked)
    * -shuffles deck right after creation
    * -calculates the totals of each hand
    * -deals cards to player and itself
    * -pushes cards back into dec and reshuffled after hand is played
2. jquery
    * -selects elements in the DOM to dynamically print results (cash, bets, totals, etc.)
    -adds and removes classes that would animate the cards
3. css
    * -used primarily for styling of webpage
    * -sets positions of transitions (where the cards would move on the page)
    * -sets rotations of the cards so they would rotate and flip
4. html
    * -framework divides page into multiple divs
    * -elements such as buttons and inputs are set within divided sections of the page
5. firebase (incomplete)
    * -began trying to store current cash player has


##Approach taken:

1. Parts of the game is broken up into 5 different objects:
    * -table object (handles rendering and printing messages)
    * -game object (handles all backend calculations, getting game winner, setting game parameters, etc.)
    * -card object (creates card objects and html card elements)
    * -user object (handles all user parameters, functions, and variables)
    * -autoplayer object (handles AI functions and conditional statements)
2. The game has an initialize function that will set up the game to start including setting event listeners, creating the deck, and prints start cash amounts.
3. The idea is to create both a "physical" card deck (in html) that is assigned to corresponding card objects (stored as a javascript array).
4. The card objects are each assigned a "value" property that stores the card's number value. This is to allow for easy sum calculations to get totals of a hand.
5. Players draw cards from the deck that have been shuffled after EVERY turn.
6. The animations to rotate and flip cards are used in conjunction with setTimeouts in order to time message displays to fade in and out.
7. End positions of the animated cards are pre-set in CSS classes. The start position is also pre-set as a card deck stack. When cards are dealt (and also when cards are drawn in hits), cards are pulled from the deck and animated onto the table positions.
8. After the end of the turn, the CSS classes of the animated cards are removed, which draws them back into the deck.

##User stories:

1. User is able to keep track of cash he/she currently has.
2. User is able to input bet amount as he/she pleases with an input box.
3. User is able to deal cards onto the table and request more cards if he/she deems necessary.
4. User is able to "stand" once he/she feels their current hand is satisfactory.
5. AI is able to request more cards if their current total value is less than 17. (At 16, they will still try to hit).
6. After each player has "stood", a function will first test if an "insurance" situation has occured. (i.e. if the dealer has an ace as their open card)
7. If an "insurance" situation has occurred, the user is allowed to make a side bet which would bet on the dealer to win.
8. If an "insurance" situation has NOT occurred, the game continues on to compare total values between the two players. The winner will have the highest total or have a total of 21.
9. Tie conditions and busts conditions (total of over 21) are also placed to test if both players either busts or ties.
10. Users also have an option of doubling down at the start of each deal.
11. After each round, both players' cards are placed back into the deck and reshuffled.

##Improvements:

1. REFACTOR!!!!
2. Improve card transform positions: implement dynamic transformation instead of hardcoding CSS
3. Add "split" feature.
4. Add a second player feature (non-AI)
5. Figure out how to NOT crop individual cards in CSS
