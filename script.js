console.log(`script.js`)
// ♥ ♦ ♠ ♣
let deck = [
  'A♥','2♥','3♥','4♥','5♥','6♥','7♥','8♥','9♥','10♥','J♥','Q♥','K♥',
  'A♦','2♦','3♦','4♦','5♦','6♦','7♦','8♦','9♦','10♦','J♦','Q♦','K♦',
  'A♠','2♠','3♠','4♠','5♠','6♠','7♠','8♠','9♠','10♠','J♠','Q♠','K♠',
  'A♣','2♣','3♣','4♣','5♣','6♣','7♣','8♣','9♣','10♣','J♣','Q♣','K♣',
]

console.log(deck)

function shuffleDeck(deck) {
  console.log(`shuffleDeck() ---`)
  // console.log(deck)
  let shuffledDeck = []
  for (let i = deck.length; i > 0; i--) {
    // console.log(deck[i])
    let random = Math.floor(Math.random() * deck.length)
    // console.log(random)
    let card = deck.splice(random, 1)
    card = card[0]
    shuffledDeck.push(card)
    // console.log(deck)
    // console.log(card)
  }
  deck = shuffledDeck
  console.log(deck)
  return deck
}
deck = shuffleDeck(deck)

let hand = []
let count = 0

function clearTable() {
  console.log(`clearTable()`)
  // reset all game elements
  $('.card').remove()
  $('#blackjack').addClass('d-none')
  $('#bust').addClass('d-none')
  $('#standOverlay').addClass('d-none')
  $('#count span').text(0)
  $('#stand').prop('disabled', true)
}

function startGame() {
  console.log(`startGame`)
  // hide play button, show hit & stand buttons
  $('#buttons button').toggleClass('d-none')
  // show count & reset it to zero
  $('#count').removeClass('d-none')
  count = 0
}

$('#play').on('click', function () {
  clearTable()
  startGame()
  setTimeout(hit, 200)
  setTimeout(hit, 400)
})

// ♥ ♦
// build card html & add to table
function buildCard(card) {
  console.log(`buildCard ${card}`)
  let isRed = Math.max(card.indexOf('♥'), card.indexOf('♦'))
  console.log(`isRed: ${isRed}`)
  let color = (isRed > -1) ? 'red': 'black'
  console.log(`color: ${color}`)
  let cardHtml =
    `<div class="card">
        <span class="${color}">${card}</span>
      </div>`
  $('#table').append(cardHtml)
}

function hit() {
  console.log(`hit`)
  console.log(deck)
  if(hand.length == 0) {
    console.log(`first hit()`)
    $('#stand').prop('disabled', false)
  }
  let card = deck.shift()
  console.log(card)
  hand.push(card)
  buildCard(card)
  countHand()
}

function endGame(handValue) {
  console.log(`endGame(${handValue})`)
  hand = []
  $('#hit').prop('disabled', false)
  $('#stand').prop('disabled', false)
  startGame()
}

function countHand() {
  console.log(`countHand()`)
  console.log(hand)
  let handValues = []
  let value = 0
  
  // loop through hand to get handValues
  for (let i = 0; i < hand.length; i++) {
    console.log(hand[i])
    // remove suits, replace facecard with 10 & Ace with 11
    value = hand[i].replace(/[♥♦♠♣]/g, '')
    value = value.replace(/[JQK]/, 10)
    value = value.replace(/[A]/, 11)
    value = parseInt(value)
    console.log(value)
    handValues.push(value)
  }
  console.log(handValues)

  // reduce handValues array to count
  count = handValues.reduce((a, b) => a + b, 0)

  // if ace puts count over 21, change its value to 1
  if(handValues.indexOf(11) > -1 && count > 21) {
    console.log(`contains an ace & count > 21`)
    let aceIndex = handValues.indexOf(11)
    console.log(aceIndex)
    handValues[aceIndex] = 1
    count = handValues.reduce((a, b) => a + b, 0)
  }

  $('#count span').text(count)

  if(count === 21) {
    console.log(`count === 21`)
    $('#blackjack').toggleClass('d-none')
    $('#hit').prop('disabled', true)
    $('#stand').prop('disabled', true)
    endGame(count)
  }
  if(count > 21) {
    console.log(`count > 21`)
    $('#bust').toggleClass('d-none')
    // $('#blackjack').toggleClass('d-none')
    $('#hit').prop('disabled', true)
    endGame(count)
  }
}

$('#hit').on('click', function () {
  hit()
  // countHand()
})

function stand() {
  console.log(`stand()`)
  $('#standOverlay').toggleClass('d-none')
  $('#standOverlay span').text(`Stand at ${count}`)
}

$('#stand').on('click', function() {
  stand()
  endGame()
})