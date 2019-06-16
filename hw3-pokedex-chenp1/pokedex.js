// Name: Parren
// Date: May 2nd,2019
// Section: CSE 154 AL
//
// this is the pokedex.js that help to fetch data of the pokedex and the detailed
// card image and its specific moves.

(function() {
  "use strict";

  let foundPokemon = ["bulbasaur", "squirtle", "charmander"];
  const POKEDEX_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";
  const GAME_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/game.php";
  let guid;
  let pid;
  let originalHp;
  // MODULE GLOBAL VARIABLES, CONSTANTS, AND HELPER FUNCTIONS CAN BE PLACED
  // HERE

  /**
   *  Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   *  loading the pokedex at initial
   */
  function init() {
    makeRequest();
    id("start-btn").addEventListener("click", startBattle);
    id("endgame").addEventListener("click", endGame);
    id("flee-btn").addEventListener("click", fleeGame);
  }

  /**
   *  make request to get the pokedex information
   */
  function makeRequest() {
    let url = POKEDEX_URL + "pokedex.php?pokedex=all";

    fetch(url)
      .then(checkStatus)      // helper function provide to ensure request is successful or not
      .then(successFunction)
      .catch(console.error);    // this is reached if error happened down the fetch chain pipeline,
  }

  /**
   *  handle the success case of the request of pokedex
   * @param {object} response - the response data
   */
  function successFunction(response) {
    let pokemon = response.split("\n");
    for(let i = 0; i < 151; i++){
      pokemon[i] = pokemon[i].substring(pokemon[i].indexOf(":") + 1, pokemon[i].length);
      let pokemonImg = document.createElement("img");
      pokemonImg.classList.add("sprite");
      pokemonImg.id = pokemon[i];
      if(foundPokemon.includes(pokemon[i])){
        pokemonImg.classList.add("found");
        pokemonImg.addEventListener("click", found);
      }
      pokemonImg.setAttribute("src", "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/sprites/" + pokemon[i] + ".png");
      pokemonImg.setAttribute("alt", pokemon[i]);
      id('pokedex-view').appendChild(pokemonImg);
    }
  }

  /**
   *  handle the found pokemon and manipulate its card
   */
  function found(){
    id("start-btn").classList.remove("hidden");
    this.classList.add("found");
    foundPokemon.push(this.id);
    qs("#p1 .pokemon-pic").setAttribute("id", this.id);
    let url = POKEDEX_URL + "pokedex.php?pokemon=" + this.id;

    fetch(url)
      .then(checkStatus)      // helper function provide to ensure request is successful or not
      .then(JSON.parse)
      .then(successCard)
      .catch(console.error);

  }

  /**
   *  handle the success case of the request of success card
   * @param {object} response - the response data of pokemon card
   * @param {String} cardNum - the card's string name of the player, default to be "p1"
   */
  function successCard(response, cardNum = "p1"){
    qs("#" + cardNum + " .name").innerText = response.name;
    qs("#" + cardNum + " .pokepic").setAttribute("src", POKEDEX_URL + response.images.photo);
    qs("#" + cardNum + " .pokepic").setAttribute("alt", response.images.photo);
    qs("#" + cardNum + " .type").setAttribute("src", POKEDEX_URL + response.images.typeIcon);
    qs("#" + cardNum + " .type").setAttribute("alt", response.images.typeIcon);
    qs("#" + cardNum + " .weakness").setAttribute("src", POKEDEX_URL
                                                          + response.images.weaknessIcon);
    qs("#" + cardNum + " .weakness").setAttribute("alt", response.images.weaknessIcon);
    qs("#" + cardNum + " .hp").innerText = response.hp + "HP";
    originalHp = response.hp;
    qs("#" + cardNum + " .info").innerText = response.info.description;
    moveIcon(response, cardNum);

  }

  /**
   *  handle the move icon for the poke card
   * @param {object} response - the response data of pokemon card
   * @param {String} cardNum - the card's string name of the player
   */
  function moveIcon(response, cardNum){
    for(let i = 1; i < 4; i++){
      qsa("#" + cardNum + " button")[i].classList.remove("hidden");
    }
    let moveNum = response.moves.length;
    for(let i = moveNum; i < 4; i++){
      qsa("#" + cardNum + " button")[i].classList.add("hidden");
    }
    for(let i = 0; i < moveNum; i++){
      qsa("#" + cardNum + " .move")[i].innerText = response.moves[i].name;
      qsa("#" + cardNum + " button")[i].id =
                                response.moves[i].name.replace(/\s+/g, "").toLowerCase();
      if(response.moves[i].dp !== undefined){
        qsa("#" + cardNum + " .dp")[i].innerText = response.moves[i].dp + " DP";
      }
      qsa("#" + cardNum + " button")[i].addEventListener("click", moveChoice);
      qsa("#" + cardNum + " .moves img")[i]
                .setAttribute("src", POKEDEX_URL + "icons/" + response.moves[i].type + ".jpg");
    }
  }

  /**
   *  start a new pokemon game battle
   */
  function startBattle(){
    id("pokedex-view").classList.add("hidden");
    id("p2").classList.remove("hidden");
    qs("#p1 .hp-info").classList.remove("hidden");
    id("results-container").classList.remove("hidden");
    id("flee-btn").classList.remove("hidden");
    let movesButton = qsa("#p1 .moves button");
    for(let i = 0; i < movesButton.length; i++){
      movesButton[i].disabled = false;
    }
    qs("h1").innerText = "Pokemon Battle Mode!";
    makePost();
  }

  /**
   *  make request to get the opponent infomation
   */
  function makePost(){
    qs("#start-btn").classList.add("hidden");
    let pokemonId = qs("#p1 .pokemon-pic").id;
    let data =  new FormData();
    // Add the various parameters to the FormData object
    data.append("startgame", "true");
    data.append("mypokemon", pokemonId);
    // Fetch now with a method of Post and the data in the body
    fetch(GAME_URL, {method: "POST", body: data})
      .then(checkStatus)
      .then(JSON.parse)
      .then(handleLoadTeams)
      .catch(console.error);
  }

  /**
   *  handle the success case of the request of the player and the opponent card
   * @param {object} response - the response data
   */
  function handleLoadTeams(response){
    guid = response.guid;
    pid = response.pid;
    qs("#p1 .health-bar").classList.remove("hidden");
    let buff1 = qs("#p1 .buffs");
    buff1.classList.remove("hidden");
    let buff2 = qs("#p2 .buffs");
    buff2.classList.remove("hidden");
    successCard(response["p2"], "p2");
    successCard(response["p1"], "p1");
  }

  /**
   *  make request to get the pokemon battle result after the move
   */
  function moveChoice(){
    id("loading").classList.remove("hidden");
    let moveId = this.id;
    let data =  new FormData();
    // Add the various parameters to the FormData object
    data.append("guid", guid);
    data.append("pid", pid);
    data.append("movename", moveId);
    // Fetch now with a method of Post and the data in the body
    fetch(GAME_URL, {method: "POST", body: data})
      .then(checkStatus)
      .then(JSON.parse)
      .then(handleLoadMoves)
      .catch(console.error);
  }

  /**
   *  handle the success case of the request of single battle result
   * @param {object} response - the response data
   */
  function handleLoadMoves(response){
    id("loading").classList.add("hidden");
    id("results-container").classList.remove("hidden");
    id("p1-turn-results").classList.remove("hidden");
    id("p2-turn-results").classList.remove("hidden");
    if(response["results"]["p1-result"] !== null){
      id("p1-turn-results").innerText = "Player 1 played " + response["results"]["p1-move"]
                                        + " and " + response["results"]["p1-result"] + "!";
    }
    if(response["results"]["p2-result"] === null){
      id("p2-turn-results").innerText = "";
    }
    if(response["results"]["p2-result"] !== null){
      id("p2-turn-results").innerText = "Player 2 played " + response["results"]["p2-move"]
                                        + " and " + response["results"]["p2-result"] + "!";
    }
    moveResult(response["p1"], 1);
    moveResult(response["p2"], 2);
  }

  /**
   *  handle the success case of the request of pokedex
   * @param {object} response - the response data
   * @param {int} cardNum - the number of the card
   */
  function moveResult(response, cardNum){
    while(qs("#p" + cardNum + " .buffs").firstChild){
      qs("#p" + cardNum + " .buffs").removeChild(qs("#p" + cardNum + " .buffs").firstChild);
    }
    let currentHp = response["current-hp"] / response["hp"] * 100;
    qs("#p" + cardNum + " .hp").innerText = response["current-hp"] + "HP";
    qs("#p" + cardNum + " .health-bar").style.width = currentHp + "%";
    if(currentHp < 20){
      qs("#p" + cardNum + " .health-bar").classList.add("low-health");
    }
    let buffs = response["buffs"];
    let debuffs = response["debuffs"];
    for (let i = 0; i < buffs.length; i++){
      let buffDiv = document.createElement("div");
      buffDiv.classList.add(buffs[i]);
      buffDiv.classList.add("buff");
      qs("#p" + cardNum + " .buffs").appendChild(buffDiv);
    }
    for (let i = 0; i < debuffs.length; i++){
      let debuffDiv = document.createElement("div");
      debuffDiv.classList.add(debuffs[i]);
      debuffDiv.classList.add("debuff");
      qs("#p" + cardNum + " .buffs").appendChild(debuffDiv);
    }
    if(currentHp === 0){
      if(cardNum === 1){
        qs("h1").innerText = "You lost!";
      }
      if(cardNum === 2){
        qs("h1").innerText = "You won!";
        let newFoundPokemon = response["shortname"];
        foundPokemon.push(newFoundPokemon);
        id(newFoundPokemon).addEventListener("click", found);
        id(newFoundPokemon).classList.add("found");
      }
      qs("#endgame").classList.remove("hidden");
      qs("#flee-btn").classList.add("hidden");
      let movesButton = qsa("#p1 .moves button");
      for(let i = 0; i < movesButton.length; i++){
        movesButton[i].disabled = true;
      }
    }
  }

  /**
   *  clear all previous battle result and back to pokedex
   */
  function endGame(){
    id("pokedex-view").classList.remove("hidden");
    id("endgame").classList.add("hidden");
    id("results-container").classList.add("hidden");
    id("p2").classList.add("hidden");
    id("start-btn").classList.remove("hidden");
    qs("h1").innerText = "Your Pokedex";
    qs("#p1 .hp").innerText = originalHp + " HP";
    qs("#p1 .health-bar").classList.add("hidden");
    clearEndGame(1);
    clearEndGame(2);
  }

  /**
   *  clear the health bar and the results of previous battles
   * @param {int} cardNum - the number of the card
   */
  function clearEndGame(cardNum){
    id("p" + cardNum + "-turn-results").innerText = "";
    //id("p2-turn-results").innerText = "";
    qs("#p" + cardNum + " .health-bar").style.width = "100%";
    if(qs("#p" + cardNum + " .health-bar").classList.contains("low-health")){
      qs("#p" + cardNum + " .health-bar").classList.remove("low-health");
    }
    while(qs("#p" + cardNum + " .buffs").firstChild){
      qs("#p" + cardNum + " .buffs").removeChild(qs("#p" + cardNum + " .buffs").firstChild);
    }
  }

  /**
   *  make request to flee the pokemon battle
   */
  function fleeGame(){
    id("loading").classList.remove("hidden");
    let moveId = "flee";
    let data =  new FormData();
    // Add the various parameters to the FormData object
    data.append("guid", guid);
    data.append("pid", pid);
    data.append("movename", moveId);
    // Fetch now with a method of Post and the data in the body
    fetch(GAME_URL, {method: "POST", body: data})
      .then(checkStatus)
      .then(JSON.parse)
      .then(handleLoadMoves)
      .catch(console.error);
  }

  /* ------------------------------ Helper Functions  ------------------------------ */
  // Note: You may use these in your code, but do remember that your code should not have
  // any functions defined that are unused.

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status == 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

})();
