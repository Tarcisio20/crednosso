<?php
namespace src\models;
use \core\Model;

class Request_pdf extends Model {

    public static function generateIntegrity(){
        return  uniqid(rand(), true);
    }
}