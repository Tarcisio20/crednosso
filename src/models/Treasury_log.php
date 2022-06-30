<?php
namespace src\models;
use \core\Model;
use DateTime;

class Treasury_log extends Model {

    public static function gerateDateNow(){
        date_default_timezone_set('America/Sao_Paulo');
        $date = new DateTime();
        return $date->format('Y-m-d H:i:s');
    }
}