<?php
/**
 * CSE 154 AL
 * Parren Chen
 * delete.php is the code of function for the delete function.
 */

  include 'common.php';
  deleteFunc();

  /**
   *  delete a post name to the Pokedex
   */
  function deleteFunc(){
    $db = get_PDO();
    if (isset($_POST["name"])) {
      delete_from_queue_name($db, $_POST["name"]);
      $oldname = $_POST["name"];
      output_success("{$oldname} removed from your Pokedex!");
    } else if (isset($_POST["mode"])) {
        if(strcmp($_POST["mode"], "removeall") == 0){
          delete_all($db);
          output_success("All Pokemon removed from your Pokedex!");
        } else {
          $msg = "Unknown mode {$_POST["mode"]}.";
          handle_request_error($msg);
        }
    } else {
      handle_request_error("Missing name or mode parameter.");
    }
  }

?>
