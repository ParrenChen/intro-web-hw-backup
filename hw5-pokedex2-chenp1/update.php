<?php
/**
 * CSE 154 AL
 * Parren Chen
 * update.php is the code of function for update pokedex.
 */
  include 'common.php';

  updateFunc();

  /**
   *  update a post name with new nickname to the Pokedex
   */
  function updateFunc(){
    if (isset($_POST["name"])) {
      $db = get_PDO();
      $name = $_POST["name"];
      if(!does_name_exist($db, $name)){
        handle_request_error("{$name} not found in your Pokedex.");
      }
      if(isset($_POST["nickname"])){
        $nickname = $_POST["nickname"];
        update($db, $name, $_POST["nickname"]);
      } else {
        $nickname = strtoupper($name);
        update($db, $name, $nickname);
      }
      output_success("Your {$name} is now named {$nickname}!");
    } else {
      handle_request_error("Missing name parameter.");
    }
  }

  /**
   * Delete a pokemon from the Pokedex connected with $db.
   * @param {object} $db - the PDO object representing the db connection.
   * @param {string} $nickname - validated pokemon nickname
   * @param {string} $name - validated pokemon name
   */
  function update($db, $name, $nickname){
    try {
      $old_name = $name;
      $name = strtolower($name);
      $sql = "UPDATE Pokedex SET nickname = :nickname WHERE name = :name;";
      $stmt = $db->prepare($sql);
      $params = array("name" => $name,
                      "nickname" => $nickname);
      $stmt->execute($params);
    } catch (PDOException $ex) {
      handle_db_error();
    }
  }
?>
