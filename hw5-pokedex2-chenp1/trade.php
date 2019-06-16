<?php
/**
 * CSE 154 AL
 * Parren Chen
 * trade.php is the code of function for the trade function.
 */
  include 'common.php';

  tradeFunc();

  /**
   *  trade an existed post name with a new one in the Pokedex
   */
  function tradeFunc(){
    if(isset($_POST["mypokemon"]) || isset($_POST["theirpokemon"])){
      if (isset($_POST["mypokemon"]) && isset($_POST["theirpokemon"])) {
        $db = get_PDO();
        $mypokemon = $_POST["mypokemon"];
        if(!does_name_exist($db, $mypokemon)){
          handle_request_error("{$mypokemon} not found in your Pokedex.");
        }
        $theirpokemon = $_POST["theirpokemon"];
        if(does_name_exist($db, $theirpokemon)){
          handle_request_error("You have already found {$theirpokemon}.");
        }
        delete_from_queue_name($db, $mypokemon);
        $nickname = strtoupper($theirpokemon);
        insert_into_Pokedex($db, $theirpokemon, $nickname);
        output_success(
            "You have traded your {$mypokemon} for {$theirpokemon}!");
      } else if(isset($_POST["mypokemon"])){
        handle_request_error("Missing theirpokemon parameter.");
      } else {
        handle_request_error("Missing mypokemon parameter.");
      }
    } else {
      handle_request_error("Missing mypokemon and theirpokemon parameter.");
    }
  }

?>
