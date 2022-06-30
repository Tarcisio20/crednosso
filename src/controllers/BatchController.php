<?php
namespace src\controllers;

use \core\Controller;
use \src\models\Batch;
use \src\models\Request;
use \src\models\Shipping;
use \src\models\Batch_type as BatchType;
use \src\models\Batch_status as BatchStatus;
use \src\models\Request_status as RequestStatus;

class BatchController extends Controller {

    public function index() {

        $baths = Batch::select()->execute();
        if(count($baths) == 0){
            $baths = null;
        }

        foreach($baths as $key => $bath){
            $status = BatchStatus::select()->where('id', $bath['id_type'])->execute();
            $baths[$key]['name_status'] = $status[0]['name'];
        }

        $this->render('batch' , [
            'title_page' => 'Lotes',
            'batchs' => $baths
        ]);
    }

    public function view($args){
       // print_r($args);die();
        if(isset($args['id']) && $args['id'] !== ''){
            $batch = Batch::select()->where('id', $args['id'])->execute();
            if(count($batch) == 0){
                $batch = null;
            }
           // print_r($batch);die();
            $batchStatus = BatchStatus::select()->where('id', $batch[0]['status'])->execute();
            $batchType = BatchType::select()->where('id', $batch[0]['id_type'])->execute();

            $allStatus = BatchStatus::select()->where('status', 'Y')->execute();
            if(count($allStatus) == 0){
                $allStatus = null;
            }

            $batch[0]['name_status'] = $batchStatus[0]['name'];
            $batch[0]['name_type'] = $batchType[0]['name'];

            $requests = Request::select()->where('id_batch', $args['id'])->execute();
            if(count($requests) == 0){
                $requests = null;
            }else{
                foreach($requests as $key => $req){
                    $shOrigin = Shipping::select()->where('id', $req['id_origin'])->execute();
                    $shDestiny = Shipping::select()->where('id', $req['id_destiny'])->execute();
                    $reqStatus = RequestStatus::select()->where('id', $req['id_status'])->execute();
                    $requests[$key]['name_origin'] = $shOrigin[0]['name_shipping'];
                    $requests[$key]['name_destiny'] = (count($shDestiny) > 0)?$shDestiny[0]['name_shipping'] : null;
                    $requests[$key]['name_status'] = $reqStatus[0]['name'];
                }
            }
        }
        $this->render('/batch/batch_view', [
            'title_page' => 'Visualização de Lote',
            'batch' => $batch,
            'all_status' => $allStatus,
            'requests' => $requests
        ]);
    }

    public function viewAction(){
        $id_batch = filter_input(INPUT_POST, 'id_batch');
        $id_status = filter_input(INPUT_POST, 'id_status');

        $batch = Batch::select()->where('id', $id_batch)->execute();
       
        /*if($id_status !== $batch[0]['id_status']){
            // IMPLEMENTAÇÃO SE HOUVER MUDANÇAS
        }*/
        print_r($_POST);die();
    }

    public function search($args){

        if(!isset($args['batch']) && $args['batch'] == ''){
            $this->redirect('/batch', ['error'=>'Precisamos de um Lote valido para continuar!']);
        }

        $batchs = Batch::select()->where('batch', $args['batch'])->execute();
        if(count($batchs) == 0){
            $batchs = null;
        }else{
            foreach($batchs as $key => $batch){
                $status = BatchStatus::select()->where('id', $batch['status'])->execute();
                $batchs[$key]['name_status'] = (count($status) == 0)? null : $status[0]['name'];
            }
        }
        $this->render('/batch/batch_search', [
            'title_page'=>'Pequisa por Lote',
            'batchs' => $batchs
        ]);

    }

}