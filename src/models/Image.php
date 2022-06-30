<?php
namespace src\models;
use \core\Model;

class Image extends Model {

    public static function generateName($id){
        return md5($id);
    }

    public static function generateDiretory($path, $dirname, $loop){
        $d = '';
        if($loop == 0){
            $d = './'.$path.DIRECTORY_SEPARATOR.$dirname;
            return $d;
        }
        for($x = 1; $x <= $loop; $x++){
            $d .= '..'.DIRECTORY_SEPARATOR;
        }
        $d .= $path.DIRECTORY_SEPARATOR.$dirname;
        return $d;
    }

    public static function uploadImage($files, $path){
        $arrayReturn = [];
        foreach($_FILES["files_contestation"]["error"] as $key => $error ){
            $arc = $files['files_contestation']['name'][$key];
            $ext = strtolower(substr($arc, -4));
            $hash = md5(time().$files['files_contestation']['name'][$key]).$ext;
            $temp_name = $files["files_contestation"]["tmp_name"][$key];
            
            if(move_uploaded_file($temp_name, $path.'/'.$hash)){
                $arrayReturn[$key]['hash'] =  $hash;
                $arrayReturn[$key]['name'] = substr($files['files_contestation']['name'][$key], 0, -4);
                $arrayReturn[$key]['error'] = true; 
            }else{
                $arrayReturn[$key] = false;
            }
        }
        return $arrayReturn;
    }

    public static function verifyErrosUpload($array){
        for($x = 0; $x  < count($array); $x++){
            if($array[$x]['error'] === false){
                return false;
            }
        }
        return true;
    }

}