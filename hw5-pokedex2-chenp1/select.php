<?php
/**
 * CSE 154 AL
 * Parren Chen
 * select.php is the code of function for the select function.
 */
  include 'common.php';

  fetch_queue();

  /**
   *  Return all of the entries currently in the Pokedex.
   *  @param {object} $db - the PDO object representing the db connection
   *  @return {array} of the queue table rows with all of the information
   */
  function fetch_queue() {
    try {
      $db = get_PDO();
      $rows = $db->query("SELECT * FROM Pokedex;");
      $all_rows = $rows->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $ex) {
       handle_db_error();
    }
    $info = array();
    $info["pokemon"] = $all_rows;
    header("Content-Type: application/json");
    echo json_encode($info);
  }
?>
