<?php
namespace src\models;
use \core\Model;

class Batch extends Model {

    public static function generateBatch($idOrigin, $idDestiny)
    {
        if($idOrigin <= 9 ){
            $idOrigin = '00'.$idOrigin;
        }elseif($idOrigin <= 99){
            $idOrigin = '0'.$idOrigin;
        }
        if($idDestiny == 'null'){
            $idDestiny = '000';
        }else{
            if($idDestiny <= 9){
                $idDestiny = '00'.$idDestiny;
            }elseif($idDestiny <= 99){
                $idDestiny = '0'.$idDestiny;
            }
        }   
        return uniqid($idOrigin.$idDestiny);
    }
}