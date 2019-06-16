// Name: Parren Chen
// Date: April 23, 2019
// Section: CSE 154 AL
//
// This javaScript simulates an interactive card set game on set.html.
//

(function() {
  "use strict";

  let setCount = 0;
  let same = [];
  let mode;
  let timerID;
  let selecting = [];
  let startTime;
  let timerMode;
  let ending = true;
  const STYLE = ["solid", "outline" , "striped"];
  const COLOR = ["green", "purple", "red"];
  const SHAPE = ["diamond", "oval", "squiggle"];
  const COUNT = [1, 2, 3];
  const OPTION_SIZE = 3;
  const PENALTY_TIME = 15;


  /**
   *  Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
  * the function will be called at initial
  */
  function init() {
    let start = document.getElementById("start");
    start.addEventListener("click", initialStartGame);
    let backMain = document.getElementById("main-btn");
    backMain.addEventListener("click", backToMain);
  }

  /**
  * start a single game
  */
  function startGame() {
    setCount = 0;
    document.getElementById("set-count").innerText = setCount;
    ending = false;
    let refresh = document.getElementById("refresh");
    refresh.addEventListener("click", startGame);
    selecting = [];
    same = [];
    mode = getMode();
    let cardNum = 12;
    if(mode === "easy"){
      cardNum = 9;
    }
    let game = document.getElementById('game');
    while(game.firstChild){
      game.removeChild(game.firstChild);
    }
    document.getElementById("game-view").classList.remove("hidden");
    document.getElementById("menu-view").classList.add("hidden");
    for(let i = 0; i < cardNum; i++){
      createCard(randomStyle(),randomShape(),randomColor(), randomCount());
    }
  }

  /**
  * the first start of the game
  */
  function initialStartGame(){
    clearInterval(timerID);
    startCountDown();
    startGame();
  }

  /**
  * the end of game
  */
  function endGame(){
    ending = true;
    if(ending === true){
      let card = document.getElementsByClassName('card');
      for(let i = 0; i < card.length; i++){
        card[i].removeEventListener("click", selectCard);
        if(card[i].classList.contains("selecting")){
        card[i].classList.remove("selecting");
        selecting.splice(selecting.indexOf(this), 1);
        }
      }
    }
    let refresh = document.getElementById("refresh");
    refresh.removeEventListener("click", startGame);
  }

  /**
  * leads back to main and restarts the game
  */
  function backToMain(){
    document.getElementById("menu-view").classList.remove("hidden");
    document.getElementById("game-view").classList.add("hidden");
    endGame();
  }

  /**
  * return the difficulty mode of the game
  * @return mode - The difficulty mode.
  */
  function getMode() {
    mode = document.querySelector("input[name='diff']:checked").value;
    return mode;
  }

  /**
  * return the time mode of the game
  * @return time - The start time.
  */
  function getTimerMode(){
    timerMode = document.getElementsByTagName('select');
    let time = timerMode.item(timerMode.selectedIndex).value;
    timerMode = time;
    return time;
  }

  /**
  * start the time count down and display time
  */
  function startCountDown() {
    startTime = getTimerMode();
    let timeDisplay = document.getElementById('time');
    if(startTime === "none"){
      startTime = 0;
    }
    timeDisplay.innerText = "0" + Math.floor(startTime / 60)
                                      + ":0" + startTime % 60;
    if(startTime === "none"){
      startTime = 0;
        timerID = setInterval(function() {
        if (startTime === 0) {
          startTime++;
        } else if (startTime % 60 < 10){
          startTime++;
          timeDisplay.innerText = "0" + Math.floor((startTime - 1) / 60)
                                            + ":0" + (startTime - 1) % 60;
        } else if (startTime === 99){
          timeDisplay.innerText = "00:00";
        } else {
          startTime++;
          timeDisplay.innerText = "0" + Math.floor((startTime - 1) / 60)
                                              + ":" + (startTime - 1) % 60;
        }
      },1000);
    } else {
        timerID = setInterval(function() {
        if (startTime === 0) {
          timeDisplay.innerText = "00:00";
          endGame();
        } else if (startTime % 60 < 10){
          startTime--;
          timeDisplay.innerText = "0" + Math.floor((startTime + 1) / 60)
                                              + ":0" + (startTime + 1) % 60;
        } else {
          startTime--;
          timeDisplay.innerText = "0" + Math.floor((startTime + 1) / 60)
                                              + ":" + (startTime + 1) % 60;
        }
      }, 1000);
    }
  }

  /**
  * create a single card, no duplicate
  * @param style - The style of the card.
  * @param shape - The shape of the card.
  * @param color - The color of the card.
  * @param count - The occurance of the card.
  */
  function createCard(style, shape, color, count){
    if(mode === "easy"){
      style = "solid";
    }
    let attribute = style + "-" + shape + "-" + color;
    let id = attribute + "-" + count;
    while(ifRepeat(id)){
      if(mode === "standard"){
        style = randomStyle();
      }
      shape = randomShape();
      color = randomColor();
      count = randomCount();
      attribute = style + "-" + shape + "-" + color;
      id = attribute + "-" + count;
    }
    let game = document.getElementById('game');
    let card = document.createElement("div");
    card.classList.add("card");
    for(let i = 0; i < count; i++){
      let img = document.createElement("img");
      img.setAttribute("src", "img/" + attribute + ".png");
      img.setAttribute("alt", attribute);
      card.appendChild(img);
      card.setAttribute("id", id);
      same.push(id);
    }
    card.addEventListener("click", selectCard);
    game.appendChild(card);
  }

/**
 * return true if the card repeats, false othewise
 * @param id - the id of the current card
 * @return result - if the card repeats
 */
  function ifRepeat(id){
    let result = false;
    for(let i = 0; i < same.length; i++){
      if(same[i] === id){
        result = true;
      }
    }
    return result;
  }

  /**
   * select and deselect a single card, auto check set selecting 3 cards
   */
  function selectCard(){
    if(this.classList.contains("selecting")){
      this.classList.remove("selecting");
      selecting.splice(selecting.indexOf(this), 1);
    } else {
      this.classList.add("selecting");
      selecting.push(this);
    }
    if(selecting.length >= OPTION_SIZE){
      selectingCase();
      for(let i = 0; i < selecting.length; i += 0){
        selecting[i].classList.remove("selecting");
        selecting.shift();
      }
    }
  }

  /**
   * checking the selecting case and manipulate the html
   */
  function selectingCase(){
    let temp = [];
    if(ifSet()){
      setCount++;
      document.getElementById("set-count").innerText = setCount;
      for(let i = 0; i < OPTION_SIZE; i++){
        let card = selecting[i];
        displayControl(card, temp, "SET!" , i);
        temp = [];
      }
    } else {
      timePenalty();
      for(let i = 0; i < OPTION_SIZE; i++){
        let card = selecting[i];
        displayControl(card, temp, "Not a Set :(", i);
        temp = [];
      }
    }
  }

  /**
   * changes the card display
   * @param card - The card.
   * @param temp - The image infomation for the card.
   * @param txt - The display text.
   * @param i - The current index.
   */
  function displayControl(card, temp, txt, i){
    while(card.firstChild){
      temp.push(card.firstChild);
      card.removeChild(card.firstChild);
    }
    let para = document.createElement("p");
    para.innerText = txt;
    selecting[i].appendChild(para);
    if(!ifSet()){
      setTimeout(reappear, 1000, card, temp);
    } else {
      setTimeout(renew, 1000, card);
    }
  }

  /**
   * display a new card at original position
   * @param card - the card object.
   */
  function renew(card){
    card.removeChild(card.getElementsByTagName("p")[0]);
    card = replaceCard(card, randomStyle(), randomShape(), randomColor(), randomCount());
    same.splice(same.indexOf(this) , 1);
    for(let i = 0; i < selecting.length; i+=0){
      selecting[i].classList.remove("selecting");
      selecting.shift();
    }
  }

  /**
  * create a new card at the original position
  * @param card - The card.
  * @param style - The style of the card.
  * @param shape - The shape of the card.
  * @param color - The color of the card.
  * @param count - The occurance of the card.
  */
  function replaceCard(card, style, shape, color, count){
    if(mode === "easy"){
      style = "solid";
    }
    let attribute = style + "-" + shape + "-" + color;
    let id = attribute + "-" + count;
    while(ifRepeat(id)){
      if(mode === "standard"){
        style = randomStyle();
      }
      shape = randomShape();
      color = randomColor();
      count = randomCount();
      attribute = style + "-" + shape + "-" + color;
      id = attribute + "-" + count;
    }
    for(let i = 0; i < count; i++){
      let img = document.createElement("img");
      img.setAttribute("src", "img/" + attribute + ".png");
      img.setAttribute("alt", attribute);
      card.appendChild(img);
      card.setAttribute("id", id);
      same.push(id);
    }
  }

  /**
  * regenerate the card original look
  * @param card - the card being checked
  * @param temp - The image infomation of the card
  */
  function reappear(card, temp){
    card.removeChild(card.getElementsByTagName("p")[0]);
    for(let i = 0; i < temp.length; i++){
      card.appendChild(temp[i]);
    }
    for(let i = 0; i < selecting.length; i+=0){
      selecting[i].classList.remove("selecting");
      selecting.shift();
    }
  }

  /**
  * return true if the selected cards are set, false otherwise
  * @return true - is a set
  */
  function ifSet(){
    let selectingArray1 = selecting[0].id.split("-");
    let selectingArray2 = selecting[1].id.split("-");
    let selectingArray3 = selecting[2].id.split("-");
    let singleAttribute1 = [selectingArray1[0], selectingArray1[1]
                              , selectingArray1[2],selectingArray1[3]];
    let singleAttribute2 = [selectingArray2[0], selectingArray2[1]
                              , selectingArray2[2],selectingArray2[3]];
    let singleAttribute3 = [selectingArray3[0], selectingArray3[1]
                              , selectingArray3[2],selectingArray3[3]];
    if(follow(singleAttribute1[0], singleAttribute2[0], singleAttribute3[0])
      && follow(singleAttribute1[1], singleAttribute2[1], singleAttribute3[1])
      && follow(singleAttribute1[2], singleAttribute2[2], singleAttribute3[2])
      && follow(singleAttribute1[3], singleAttribute2[3], singleAttribute3[3])){
      return true;
    }
    return false;
  }

  /**
  * return true if the selected attribute are set, false otherwise
  * @param attribute1 - The first attribute.
  * @param attribute2 - The second attribute.
  * @param attribute3 - The third attribute.
  * @return true - follows the pattern
  */
  function follow(attribute1, attribute2, attribute3){
    if((attribute1 === attribute2 && attribute2 === attribute3)|| (attribute1 !== attribute2 &&
      attribute2 !== attribute3 && attribute3 !== attribute1)){
        return true;
      }
    return false;
  }

  /**
  * add time penalty to false set guess
  */
  function timePenalty(){
    getTimerMode();
    if(timerMode === "none"){
      startTime += PENALTY_TIME;
    } else if(startTime <= PENALTY_TIME){
        startTime = 0;
      } else {
        startTime -= 15;
      }
  }

  /**
  * return the random style
  * @return style - the random shape
  */
  function randomStyle(){
    let style = STYLE[Math.floor(Math.random() * OPTION_SIZE)];
    return style;
  }
  /**
  * return the random shape
  * @return shape - the random shape
  */
  function randomShape(){
    let shape = SHAPE[Math.floor(Math.random() * OPTION_SIZE)];
    return shape;
  }
  /**
  * return the random color
  * @return color - the random color
  */
  function randomColor(){
    let color = COLOR[Math.floor(Math.random() * OPTION_SIZE)];
    return color;
  }

  /**
  * return the random count
  * @return count - the random count number
  */
  function randomCount(){
    let count = COUNT[Math.floor(Math.random() * OPTION_SIZE)];
    return count;
  }

})();
