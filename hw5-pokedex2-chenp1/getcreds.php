<?php
/**
 * CSE 154 AL
 * Parren Chen
 * getcreds.php is the code of function for the getcreds function.
 */
  creds_info();

  function creds_info(){
    $output = "chenp1\npoketoken_5cf71bd558d047.05293089";

    header("Content-type: text/plain");

    echo $output;
  }

?>
