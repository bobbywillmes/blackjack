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

let myHand = []
let myCount = 0
let dealerHand = []
let dealerCount = 0

function clearTable() {
  // console.log(`clearTable()`)
  // reset all game elements
  $('.card').remove()
  $('#blackjack').addClass('d-none')
  $('#bust').addClass('d-none')
  $('#count span').text(0)
  $('#stand').prop('disabled', true)
  $('#table .col').removeClass('blur')
  $('#winner').addClass('d-none')
}

function startGame() {
  // console.log(`startGame`)
  // hide play button, show hit & stand buttons
  $('#buttons button').toggleClass('d-none')
  // show counts & reset to zero
  $('#count').removeClass('d-none')
  $('#dealerCount').removeClass('d-none')
  myCount = 0
  dealerCount = 0
}

$('#play').on('click', function () {
  clearTable()
  startGame()
  setTimeout(function() {
    hit()
  }, 200)
  setTimeout(function() {
    hit()
  }, 600)
  setTimeout(function() {
    hit('dealer')
  }, 400)
  setTimeout(function() {
    hit('dealer')
  }, 800)
})

// ♥ ♦
// build card html & add to table
function buildCard(card, dealer) {
  // console.log(`buildCard ${card}`)
  let isRed = Math.max(card.indexOf('♥'), card.indexOf('♦'))
  let color = (isRed > -1) ? 'red': 'black'
  let cardHtml =
    `<div class="card">
        <span class="${color}">${card}</span>
      </div>`
      if(dealer == 'dealer') {
        $('#table .col.right').append(cardHtml)
        return
      }
  $('#table .col.left').append(cardHtml)
}

function hit(hand) {
  // console.log(`hit: ${hand}`)
  // console.log(deck)
  if(myHand.length == 0) {
    // console.log(`first hit()`)
    $('#stand').prop('disabled', false)
  }
  let card = deck.shift()
  console.log(card)
  if(hand == 'dealer') {
    dealerHand.push(card)
    buildCard(card, 'dealer')
    countHand('dealer')
    return
  }
  myHand.push(card)
  buildCard(card)
  countHand()
}

function endGame(handValue) {
  console.log(`endGame(${handValue})`)
  myHand = []
  dealerHand = []
  $('#hit').prop('disabled', false)
  $('#stand').prop('disabled', false)
  $('#table .col').addClass('blur')
  startGame()
}

function countHand(hand) {
  console.log(`countHand(${hand})`)
  let handValues = []
  let value = 0
  let person = hand
  console.log(`person: ${person}`)

  if(hand == 'dealer') {
    hand == dealerHand
  } else {
    hand == myHand
  }

  console.log(`hand: ${hand}`)
  
  function count(hand) {
    handValues = []
    console.log(`count(${hand})`)
    for (let i = 0; i < hand.length; i++) {
      // console.log(hand[i])
      // remove suits, replace facecard with 10 & Ace with 11
      value = hand[i].replace(/[♥♦♠♣]/g, '')
      value = value.replace(/[JQK]/, 10)
      value = value.replace(/[A]/, 11)
      value = parseInt(value)
      // console.log(value)
      handValues.push(value)
    }
    console.log(handValues)
  
    // reduce handValues array to count
    let countVal = handValues.reduce((a, b) => a + b, 0)
    return countVal
  }

  dealerCount = count(dealerHand)
  console.log(`dealerCount: ${dealerCount}`)
  myCount = count(myHand)
  console.log(`myCount: ${myCount}`)
  console.log(myHand)

  console.log(handValues)
  console.log(handValues.indexOf(11))

  let countVal = handValues.reduce((a, b) => a + b, 0)
  console.log(countVal)

  // if ace puts count over 21, change its value to 1
  if(handValues.indexOf(11) > -1 && countVal > 21) {
    console.log(`contains an ace & count > 21`)
    let aceIndex = handValues.indexOf(11)
    console.log(aceIndex)
    handValues[aceIndex] = 1
    myCount = handValues.reduce((a, b) => a + b, 0)
  }

  if(person == 'dealer') {
    console.log(`person == 'dealer'`)
    $('#dealerCount span').text(dealerCount)
  } else {
    $('#count span').text(myCount)
  }

  if(myCount === 21) {
    console.log(`myCount === 21`)
    $('#blackjack').toggleClass('d-none')
    $('#hit').prop('disabled', true)
    $('#stand').prop('disabled', true)
    endGame(myCount)
  }
  if(myCount > 21) {
    console.log(`myCount > 21`)
    $('#bust').toggleClass('d-none')
    // $('#blackjack').toggleClass('d-none')
    $('#hit').prop('disabled', true)
    endGame(myCount)
  }
  console.log(`myHand & dealerHand -----`)
  console.log(myHand)
  console.log(dealerHand)  
}

$('#hit').on('click', function () {
  hit(myHand)
})

function getWinner() {
  let winText = ''
  console.log(`getWinner`)
  if(myCount > dealerCount && myCount < 22) {
    console.log(`I Win!!`)
    winText = 'You win!'
  } else if(dealerCount > myCount && dealerCount < 22) {
    console.log(`Dealer wins ----`)
    winText = 'Sorry, you lose'
  } else if(dealerCount > 21 && myCount < 22) {
    console.log(`You Win!`)
    winText = 'Dealer bust, you win'
  } else {
    console.log(`no winner.....`)
    winText = 'Draw'
  }
  $('#winner span').html(winText)
  $('#winner').toggleClass('d-none')
  endGame()
}

function stand() {
  console.log(`stand()`)
  $('#hit').prop('disabled', true)
  $('#stand').prop('disabled', true)

  function dealerMustHit() {
    if(dealerCount <= 16) {
      console.log(`dealerCount <= 16: ${dealerCount}`)
      hit('dealer')
      setTimeout(() => {
        dealerMustHit()
      }, 500);
    } else {
      console.log(`time to choose winner!`)
      console.log(myCount)
      console.log(myHand)
      console.log(dealerCount)
      console.log(dealerHand)
      getWinner()
    }
  }
  dealerMustHit()
}

$('#stand').on('click', function() {
  stand()
  // endGame()
})