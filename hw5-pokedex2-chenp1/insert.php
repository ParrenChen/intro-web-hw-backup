<?php
/**
 * CSE 154 AL
 * Parren Chen
 * insert.php is the code of function for the insert function.
 */
  include 'common.php';

  insertFunc();

  /**
   *  insert a post name to the Pokedex
   */
  function insertFunc(){
    if (isset($_POST["name"])) {
      $db = get_PDO();
      if(isset($_POST["nickname"])){
        insert_into_Pokedex($db, $_POST["name"], $_POST["nickname"]);
      } else {
        $nickname = strtoupper($_POST["name"]);
        insert_into_Pokedex($db, $_POST["name"], $nickname);
      }
      $name = $_POST["name"];
      output_success("{$name} added to your Pokedex!");
    } else {
      handle_request_error("Missing name parameter.");
    }
  }

?>
