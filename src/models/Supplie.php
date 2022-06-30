<?php
namespace src\models;
use \core\Model;

class Supplie extends Model {
    public static function generateIntegrity($idShipping, $idAtm){
         if($idShipping <= 9 ){
            $idShipping = '00'.$idShipping;
        }elseif($idShipping <= 99){
            $idShipping = '0'.$idShipping;
        }
         if($idAtm <= 9 ){
            $idAtm = '00'.$idAtm;
        }elseif($idAtm <= 99){
            $idAtm = '0'.$idAtm;
        }
        return uniqid($idShipping.$idAtm);
    }

    public static function verifyIfEven($arrayValues, $quantAtms)
    {
        $value_final = 0;
        foreach($arrayValues as $value){
            $value_final = $value_final + $value;
        }
        if($value_final % 2 == 0){
            if($quantAtms == 1 || $quantAtms  % 2 == 0){
                return true;
            }
        }
        return false;
    }

    public static function gerateValueTotal($arrayValues){
        $value_total = 0;
        foreach($arrayValues as $key => $value){
            $value_total = $value_total + ($value * $key);
        }
        return $value_total;
    }

    public static function generateValueForCassete($operator, $valuesTreasury, $valuesRequest){
        $return = [];
        switch($operator){
            case 'adc':
                foreach($valuesTreasury as $key => $value){
                    $return[$key] = $value +  $valuesRequest[$key]; 
                }       
            break;
            case 'sub':
                foreach($valuesTreasury as $key => $value){
                    $return[$key] = $value -  $valuesRequest[$key]; 
                }
            break;
        }
        return $return;
    }
}