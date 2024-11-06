// Recovery index data
const userName = sessionStorage.getItem('userName');
const classSoldier = sessionStorage.getItem('classSoldier');
//factory of the classes
function createClass(name, health, strength, defense) { 
    return {
      name,
      health,
      strength,
      defense,
    };
  }


//classes and stats
const warrior = createClass("warrior",150,18,3)
const mage = createClass("mage",110,25,2)
const barbarian = createClass("barbarian",180,25,5)
let critical=0.2
let criticalWarrior = 0.20

function specialStats(nameClass){ //special stats
  switch (nameClass) {
    case "warrior":
      criticalWarrior += 0.05
        break
    case "mage":
      mage.strength += 0.70
        break
  }
}


const classesArray = [warrior, mage, barbarian]

const playerCharacter = classesArray.find(character => character.name == classSoldier);
const cpuCharacter = randomCharacter(playerCharacter)


let nPotion = 1
let potionCPU = 1
const powerPotion= 50


//image characters
const imagesCharacters = {
    warrior: "img/warrior.png",
    mage: "img/mage.png",
    barbarian: "img/barbarian.png"
}

//others
const nickName = document.querySelector(".nickName")
let actualLifePlayer = playerCharacter.health
let actualLifeCPU = cpuCharacter.health
let displayLifePlayer = document.querySelector(".life-text-player")
let displayLifeCPU = document.querySelector(".life-text-CPU")
const moves = document.querySelector("#moves")
const attack = document.querySelector("#attack")
const counter = document.querySelector("#counter")
const potion = document.querySelector("#potion")
const narrator = document.querySelector("#message")
let displayPotion = document.querySelector("#number-potion")
let lifeBarPlayer= document.querySelector(".life-player")
let lifeBarCPU= document.querySelector(".life-CPU")
let turn = "player"
const restart = document.querySelector("#restart")
const newGame = document.querySelector("#new-game")
let playerCountering = false
let cpuCountering = false
let playerCounterLimit = 2
let cpuCounterLimit = 2
let counterLimit = document.querySelector("#number-counter")
let endGame = false
const red = "radial-gradient(circle, rgba(255, 0, 0, 0.5), rgba(255, 255, 255, 0))"
const white = "radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))"
const green = "radial-gradient(circle, rgba(0, 255, 0, 0.6), rgba(0, 255, 0, 0))"
const yellow = "radial-gradient(circle, rgba(255, 255, 0, 0.8), rgba(255, 255, 255, 0))";
const delay= 1500
///////////////////////////////////////////////////////////////////////////////
//starting game////

//starting, user class selected, CPU class, stats...
narrator.innerHTML="Welcome"
setTimeout(() => {
    narrator.innerHTML = "Ready..."
    setTimeout(() => {
      narrator.innerHTML = "Fight!!"
      setTimeout(() => {
        narrator.innerHTML = "Your turn"
        moves.style.display="block"
      }, 2000);  
    }, 1500);  
  }, 2000); 

//player
nickName.innerHTML= userName
displayLifePlayer.innerHTML= actualLifePlayer + "/" + playerCharacter.health
displayPotion.innerHTML= nPotion
counterLimit.innerHTML = playerCounterLimit

//choose cpu class
function randomCharacter(userClass){
    let randomClass
    do{
        const n = Math.floor(Math.random()*classesArray.length)
        randomClass = classesArray[n]
    } while (randomClass == userClass)

    return randomClass
}
displayLifeCPU.innerHTML= actualLifeCPU + "/" + cpuCharacter.health

//player image
document.querySelector("#player-img").src= imagesCharacters[playerCharacter.name]
document.querySelector("#player-img").alt = playerCharacter.name
//cpu image
document.querySelector("#cpu-img").src= imagesCharacters[cpuCharacter.name]
document.querySelector("#cpu-img").alt = cpuCharacter.name

////////////////////////BATTLE/////////////////////////////
function playerMove(){
  if(endGame){
    return
  }else
  narrator.innerHTML="Choose your move"

  if(playerCounterLimit <= 0){
    counter.style.opacity = "0.5"
    counter.style.pointerEvents = "none"
  } else {
    counter.style.opacity = 1
    counter.style.pointerEvents = "auto"
  }

}
attack.addEventListener("click",()=> nextTurn("attack"))
counter.addEventListener("click",()=> nextTurn("counter"))
potion.addEventListener("click",()=> nextTurn("potion"))




function nextTurn(playerAction){
if (playerCounterLimit <= 0){
  playerCounterLimit =2
  counterLimit.innerHTML = playerCounterLimit
}

  let cpuAction = cpuMove()



  //select player move//
  if(playerAction == "counter"){ //counter
    counterAttack(playerCharacter)
    if(cpuAction=="attack"){
    narrator.innerHTML= "Enemy attaked!"
    moveAttack(cpuCharacter)
    setTimeout(()=>{showEffect("player",white); narrator.innerHTML="You Countered!"},delay)
    } else{showEffect("player",white);narrator.innerHTML="You Countered!"}
  } else if (playerAction == "attack") { //move attack
    narrator.innerHTML="You Attacked!!"
    moveAttack(playerCharacter);

  } else if (playerAction == "potion") {//use potion
    narrator.innerHTML="You used a potion"
    showEffect("player",green)
    movePotion(playerCharacter);
  } 


  if (playerAction == "counter" && cpuAction == "counter") { //both counter
    narrator.innerHTML="Both countered"
    showEffect("player",white)
    showEffect("enemy",white)
  }

  //select CPU move//
  setTimeout(() => { // time between turns.
  if (cpuAction == "attack" && !endGame && !playerCountering) {
    narrator.innerHTML= "Enemy attaked"
    moveAttack(cpuCharacter);

  } else if(cpuAction == "pot" && !endGame){
    showEffect("enemy",green)
    narrator.innerHTML="Enemy used a potion"
    movePotion(cpuCharacter)

  } else if (cpuAction == "counter" && playerAction != "counter") {
    narrator.innerHTML="The enemy countered!"
    showEffect("enemy",white)
  }

  playerCountering = false
  cpuCountering = false
  specialStats(playerCharacter.name)
  specialStats(cpuCharacter.name)
  setTimeout(()=>{moves.style.visibility= "visible"; playerMove() },delay) //next turn
}, delay)
  

}

//CPU move
function cpuMove(){

    if( ((actualLifeCPU * 100) / cpuCharacter.health) < 40 && potionCPU > 0){ // if lifeCPU is <40%
      if (Math.random() < 0.65) { // 65% to use potion
        return "pot"
      }     
    }

    if(cpuCounterLimit <= 0){
      cpuCounterLimit = 2
      return "attack"
    }else{
      if(Math.random() < 0.5){ // 50% to attack or counterAttack
        return "attack"
      }
      else {
        counterAttack(cpuCharacter)
        return "counter"
      }}
    }



function moveAttack(who){
  let additionalDelay = 0
  let damage
  let iscritical = 1
  if(itscriticalhit(who)){ //critical hit?
    iscritical = 2
    narrator.innerHTML="CRITICAL!!"
  }
  switch (who){
    case playerCharacter: //player attack
    showEffect("enemy",iscritical == 2? yellow:red)
      damage = playerCharacter.strength - cpuCharacter.defense
      if(cpuCountering){
        actualLifePlayer -= (damage * iscritical)/2
        additionalDelay =1000 // because this one was too fast
      }else{
        actualLifeCPU -= damage * iscritical
      }
    break

    case cpuCharacter: //CPU attack
      damage =  cpuCharacter.strength - playerCharacter.defense
      if(playerCountering){
        actualLifeCPU -= (damage * iscritical)/2
        showEffect("player",iscritical==2?yellow:red)

      }else{
        actualLifePlayer -= damage * iscritical
        showEffect("player",iscritical == 2? yellow:red)
      }
      break
  }

  setTimeout(() => {
    displaylifes();
}, delay + additionalDelay);
}

function counterAttack(who){
  who == playerCharacter? playerCountering = true + playerCounterLimit --: cpuCountering = true + cpuCounterLimit --
  counterLimit.innerHTML = playerCounterLimit
}

function movePotion(who){
  switch (who){
    case playerCharacter:
      actualLifePlayer += powerPotion
      nPotion = 0
      displayPotion.innerHTML= nPotion
      potion.style.opacity = "0.5"
      potion.style.pointerEvents = "none"
      break
    case cpuCharacter:
      actualLifeCPU += powerPotion
      potionCPU = 0      
      break
  }
  actualLifePlayer = Math.min(actualLifePlayer, playerCharacter.health);
  actualLifeCPU = Math.min(actualLifeCPU, cpuCharacter.health);
  displaylifes()
}

function displaylifes(){
  actualLifePlayer < 0? actualLifePlayer = 0:
  actualLifeCPU < 0? actualLifeCPU = 0:
  
  displayLifePlayer.innerHTML= actualLifePlayer.toFixed(1) + "/" + playerCharacter.health
  displayLifeCPU.innerHTML = actualLifeCPU.toFixed(1) + "/" + cpuCharacter.health

  lifeBarPlayer.style.transition = 'width 0.5s';
  lifeBarPlayer.style.width = `${(actualLifePlayer * 100) / playerCharacter.health}%`;
  lifeBarCPU.style.transition = 'width 0.5s';
  lifeBarCPU.style.width = `${(actualLifeCPU * 100) / cpuCharacter.health}%`;

  
  if(actualLifeCPU==0){ ////you win
    moves.style.display="none"
    narrator.innerHTML= "You win!!!"
    restart.style.display="block"
    newGame.style.display="block"
    endGame = true
  }else if(actualLifePlayer==0){ /// you lose
    moves.style.display="none"
    narrator.innerHTML= "You lose..."
    newGame.style.display="block"   
    restart.style.display="block"   
    endGame = true 
  }

}

function itscriticalhit(character){
  let criticalchance = character.name == "warrior"? criticalWarrior : critical
  return Math.random() < criticalchance
}

function showEffect(target,color) {
  const impact = document.querySelector(`#effect-${target}`)
  impact.style.background = color

  impact.style.opacity = 1
  moves.style.visibility= "hidden"
  setTimeout(() => {
      impact.style.opacity = 0 
  }, delay)
}

newGame.addEventListener("click",function() {
  window.location.href="index.html"
})
restart.addEventListener("click",function() {
  window.location.reload()
})
