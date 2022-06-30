<?php
namespace src\models;
use \core\Model;

class Atm extends Model {
    public static function ifEven($atms){
        if(count($atms) % 2 == 0){
            return true;
        }
        return false;
    } 
}