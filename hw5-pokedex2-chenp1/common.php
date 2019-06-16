<?php
  /**
   * CSE 154 AL
   * Parren Chen
   * common.php is the code of common function.
   */

  /**
   * Returns a PDO object connected to the database. If a PDOException is thrown when
   * attempting to connect to the database, responds with a 503 Service Unavailable
   * error.
   * @return {PDO} connected to the database upon a succesful connection.
   */
  function get_PDO() {
    $host = "localhost";
    $port = "8889";
    $user = "root";
    $password = "root";
    $dbname = "hw5db";

    # Make a data source string that will be used in creating the PDO object
    $ds = "mysql:host={$host}:{$port};dbname={$dbname};charset=utf8";

    try {
      $db = new PDO($ds, $user, $password);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      return $db;
    } catch (PDOException $ex) {
      header("HTTP/1.1 503 Service Unavailable");
      header("Content-Type: text/plain");
      die("Can not connect to the database. Please try again later.");
    }
  }

  /**
   * Prints out a JSON 400 error message with a key of "error" and a value as the given $msg.
   * Remember that 400 indicate an invalid request from a client, but that should be separate from
   * any PDO-related (database) errors. Use handle_db_error for anything related
   * to the database.
   * @param $msg {string} - message to output details of invalid request.
   */
  function handle_request_error($msg) {
    process_error("HTTP/1.1 400 Invalid Request", $msg);
  }

  /**
   * Prints out a JSON 503 error message with a key of "error".
   * If given a second (optional) argument as an PDOException, prints details about the cause
   * of the exception. See process_error note about responding with PDO errors to a client.
   * @param $ex {PDOException} - (optional) Exception object with additional exception details
   */
 function handle_db_error($ex=NULL) {
   $msg = "A database error occurred. Please try again later.";
   process_error("HTTP/1.1 503 Service Unavailable", $msg, $ex);
 }

 /**
  * Terminates the program after printing out a JSON error message given $msg after
  * sending the given header error code (handy to factor out error-handling between
  * 400 request errors and 503 db errors).
  * If given an (optional) third argument as an Exception, prints details about
  * the cause of the exception.
  *
  * @param $type {string} - The HTTP error header string.
  * @param $msg {string} - Message to output.
  */
  function process_error($type, $msg, $ex=NULL) {
    header($type); # e.g. "HTTP/1.1 400 Invalid Request"
    header("Content-type: application/json");
    if ($ex) {
      # Note that in practice, you probably don't want to print details about your
      # database errors in a response to a client. But for testing your code, this can
      # help pinpoint bugs in your PDO functions/database connections.
      echo ("Internal error details: $ex \n");
    }
    $error_json = json_encode(array("error" => $msg));
    die($error_json);
  }

  /**
   * Outputs a message in the format: { "success" : <message> }
   * @param {string} $msg - string message that will be value of "success" key in response.
   */
  function output_success($msg) {
    $result = array("success" => $msg);
    header("Content-type: application/json");
    echo json_encode($result);
  }

  /**
    *
    * Returns true if an item with the given name is in the menu table, otherwise false.
    * Note that we pass $db as a parameter here because we don't want to construct another
    * one unecessarily (e.g. if this function is used before an INSERT query).
    * @param {PDO} $db - PDO object connected
    * @param {string} $name - name of pokemon
    * @return {boolean} - Is the name in the table
    */
  function does_name_exist($db, $name) {
      $qry = "SELECT name, nickname, datefound FROM Pokedex WHERE name = :name";
      try {
        $stmt = $db->prepare($qry);
        $stmt->execute(array("name" => $name));
      } catch (PDOException $ex) {
        handle_db_error();
      }
      return $stmt->rowCount() > 0;
    }

  /**
   * Delete a pokemon from the Pokedex connected with $db.
   * @param {object} $db - the PDO object representing the db connection.
   * @param {string} $name - validated pokemon name
   */
  function delete_from_queue_name($db, $name) {
    $oldname = $_POST["name"];
    $name = strtolower($name);
    try {
      if(!does_name_exist($db, $name)) {
        handle_request_error("{$oldname} not found in your Pokedex.");
      } else {
        $sql = "DELETE FROM Pokedex WHERE name = :name;";
        $stmt = $db->prepare($sql);
        $params = array("name" => $name);
        $stmt->execute($params);
      }
    } catch (PDOException $ex) {
      handle_db_error();
    }
  }

  /**
   * Delete all pokemons from the Pokedex connected with $db.
   * @param {object} $db - the PDO object representing the db connection.
   */
  function delete_all($db) {
    try {
      $str = "DELETE FROM Pokedex;";
      $rows = $db->exec($str);
    } catch (PDOException $ex) {
      handle_db_error();
    }
  }

  /**
   * Delete a pokemon from the Pokedex connected with $db.
   * @param {object} $db - the PDO object representing the db connection.
   * @param {string} $nickname - validated pokemon nickname
   * @param {string} $name - validated pokemon name
   */
  function insert_into_Pokedex($db, $name, $nickname) {
    if(does_name_exist($db, $name)){
      handle_request_error("{$name} already found.");
    }
    try {
      $old_name = $name;
      $name = strtolower($name);
      $sql = "INSERT INTO Pokedex (name, nickname, datefound) " .
             "VALUES (:name, :nickname, :datefound);";
      $stmt = $db->prepare($sql);
      date_default_timezone_set('America/Los_Angeles');
      $datefound = date('y-m-d H:i:s');
      $params = array("name" => $name,
                      "nickname" => $nickname,
                      "datefound" => $datefound);
      $stmt->execute($params);
    } catch (PDOException $ex) {
      handle_db_error();
    }
  }

?>
