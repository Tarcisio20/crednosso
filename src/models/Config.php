<?php
namespace src\models;
use \core\Model;

class Config extends Model {

    public static function filterArray(
        $arrayForLoop, , $elementExtratcLoop, $chars
        ){
        $result = array_filter($arrayForLoop, function($el){
            return $el[$elementExtratcLoop].$cahrs.$arrayExtract[$elementExtract]; 
        });

        return $result;
    }
}