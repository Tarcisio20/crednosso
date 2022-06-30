<?php
namespace src\controllers;

use \core\Controller;
use \src\models\Config;
use \src\models\Shipping;
use \src\models\Atm_type as AtmType;
use src\models\Batch_type as BatchTypes;
use \src\models\Batch_status as BatchStatus;
use \src\models\Treasury_log as TreasuryLog;
use \src\models\Shipping_type as ShippingTypes;
use \src\models\Operation_type as OperationType;
use \src\models\Supplie_status as SupplieStatus;
use \src\models\Request_status as RequestStatus;
use \src\models\Treasury_log_type as TreasuryLogType;


class ConfigController extends Controller {

    public function index() {
        $this->render('config' , ['title_page' => 'Configurações']);
    }

    public function logTeasury(){

        $logs = TreasuryLog::select()->execute();
        if(count($logs) == 0){
            $logs = null;
        }else{
            foreach($logs as $key => $log){
                $shipping = Shipping::select()->where('id_shipping', $log['id_shipping'])->execute();
                $types = TreasuryLogType::select()->where('id', $log['id_log_type'])->execute();
                $logs[$key]['name_shipping'] = (count($shipping) > 0) ? $shipping[0]['name_shipping'] : null;
                $logs[$key]['name_type'] = (count($types) > 0) ? $types[0]['name'] : null;
            }
        }

        $shippings = Shipping::select()->execute();
        if(count($shippings) == 0){
            $shippings = null;
        }

        $types = TreasuryLogType::select()->execute();
        if(count($types) == 0){
            $types = null;
        }
        $this->render('/config/config_log_teasury',[
            'title_page'=>'Tipos de Log de Tesouraria',
            'logs' => $logs,
            'shippings'=>$shippings,
            'types'=>$types
        ]);
    }

    public function logTeasuryAction(){
        $id_shipping = filter_input(INPUT_POST, 'id_shipping');
        if(isset($id_shipping) && $id_shipping !== '0'){
            $logs = TreasuryLog::select()->where('id_shipping', $id_shipping)->execute();
            if(count($logs) == 0){
                $this->redirect('/config/config_log_teasury', ['error'=>'ID invalido']);
            }

            foreach($logs as $key => $log){
                $shipping = Shipping::select()->where('id_shipping', $log['id_shipping'])->execute();
                $logs[$key]['name_shipping'] = $shipping[0]['name_shipping'];
                $type = TreasuryLogType::select()->where('id', $log['id_log_type'])->execute();
                $logs[$key]['name_type'] = $type[0]['name'];
            }

           $this->render('/config/config_log_teasury_search',[
            'title_page'=>'Logs Tesouraria ',
            'logs' => $logs
        ]);

        }
    }

    public function logTeasuryAdd(){
        $this->render('/config/config_log_teasury_add', [
            'title_page' => 'Adicionar Logs de Tesouraria'
        ]);
    }

    public function logTeasurySddAction(){
        $name_type = filter_input(INPUT_POST, 'name_type');
        if(isset($name_type) && $name_type !== ''){
            $name_type = trim($name_type);
            $log = TreasuryLogType::select()->where('name', $name_type)->execute();
            if(count($log) == 0){
                TreasuryLogType::insert(['name'=>$name_type])->execute();
                $this->redirect('/config/log_teasury', ['success'=>'Salvo']);
            }
        }
        $this->redirect('/config/log_teasury/add', ['error'=>'Falha ao salvar']);
    }

    public function supplieStatus(){
        $status = SupplieStatus::select()->execute();
        if(count($status) == 0){
            $status = null;
        }

        $this->render('/config/supplie_status', [
            'title_page' => 'Status de Abastecimento',
            'status' => $status
        ]);
    }

    public function supplieStatusAdd(){
        $this->render('/config/supplie_status_add', [
            'title_page' => 'Adicionar Status de Abastecimento'
        ]);
    }

    public function supplieStatusAddAction(){
        $name_status = filter_input(INPUT_POST, 'name_status');
        if(isset($name_status) && $name_status !== ''){
            $name_status = trim($name_status);
            $log = SupplieStatus::select()->where('name', $name_status)->execute();
            if(count($log) == 0){
                SupplieStatus::insert(['name'=>$name_status])->execute();
                $this->redirect('/config/supplie', ['success'=>'Salvo']);
            }
        }
        $this->redirect('/config/supplie/add', ['error'=>'Falha ao salvar']);
    } 
    
    public function requestStatus(){
        $status = RequestStatus::select()->execute();
        if(count($status) == 0){
            $status = null;
        }

        $this->render('/config/request_status', [
            'title_page' => 'Status de Pedido',
            'status' => $status
        ]);
    }

    public function requestStatusAdd(){
        $this->render('/config/request_status_add', [
            'title_page' => 'Adicionar Status de Pedido'
        ]);
    }

    public function requestStatusAddAction(){
        $name_request = filter_input(INPUT_POST, 'name_request');
        if(isset($name_request) && $name_request !== ''){
            $name_request = trim($name_request);
            $log = RequestStatus::select()->where('name', $name_request)->execute();
            if(count($log) == 0){
                RequestStatus::insert(['name'=>$name_request])->execute();
                $this->redirect('/config/request', ['success'=>'Salvo']);
            }
        }
        $this->redirect('/config/request/add', ['error'=>'Falha ao salvar']);
    }

    public function orderStatus(){
        $orders = SupplieStatus::select()->execute();
        if(count($orders) == 0){
            $orders = null;
        }

        $this->render('/config/order_status', [
            'title_page' => 'Tipos de Ordem',
            'orders' => $orders
        ]);
    }

    public function orderStatusAdd(){
        $this->render('/config/order_status_add', [
            'title_page' => 'Adicionar Tipo de Ordem'
        ]);
    }

    public function orderStatusAddAction(){
        $name_order = filter_input(INPUT_POST, 'name_order');
        if(isset($name_order) && $name_order !== ''){
            $name_order = trim($name_order);
            $order = RequestStatus::select()->where('name', $name_order)->execute();
            if(count($order) == 0){
                RequestStatus::insert(['name'=>$order])->execute();
                $this->redirect('/config/order', ['success'=>'Salvo']);
            }
        }
        $this->redirect('/config/order/add', ['error'=>'Falha ao salvar']);
    }
   
    public function operationType(){
        $types = OperationType::select()->execute();
        if(count($types) == 0){
            $types = null;
        }

        $this->render('/config/operation_type', [
            'title_page' => 'Tipos de Ordem',
            'types' => $types
        ]);
    }

    public function operationTypeAdd(){
        $this->render('/config/operation_type_add', [
            'title_page' => 'Adicionar Tipo de Operação'
        ]);
    }

    public function operationTypeAddAction(){
        $operation_type = filter_input(INPUT_POST, 'name_operation');
        if(isset($operation_type) && $operation_type !== ''){
            $operation_type = trim($operation_type);
            $operation = RequestStatus::select()->where('name', $operation_type)->execute();
            if(count($operation) == 0){
                RequestStatus::insert(['name'=>$operation_type])->execute();
                $this->redirect('/config/operation_type', ['success'=>'Salvo']);
            }
        }
        $this->redirect('/config/operation_type/add', ['error'=>'Falha ao salvar']);
    }

    public function batchTypes(){

        $types = BatchTypes::select()->execute();
        if(count($types) == 0){
            $types = null;
        }

        $this->render('/config/batch_types', [
            'title_page' => 'Tipos de Lote',
            'types' => $types
        ]);
    }

    public function batchTypesAdd(){
        $this->render('/config/batch_type_add', [
            'title_page' => 'Adicionar Tipo de Lote'
        ]);
    }

    public function batchTypesAddAction(){
        $name_type = filter_input(INPUT_POST, 'name_type');
        if(isset($name_type) && $name_type !== ''){
            $name_type = trim($name_type);
            $operation = BatchTypes::select()->where('name', $name_type)->execute();
            if(count($operation) == 0){
                BatchTypes::insert(['name'=>$name_type])->execute();
                $this->redirect('/config/batch_type', ['success'=>'Salvo']);
            }
        }
        $this->redirect('/config/batch_type/add', ['error'=>'Falha ao salvar']);
    }

    public function batchStatus(){
        $status = batchStatus::select()->execute();
        if(count($status) == 0){
            $status = null;
        }

        $this->render('/config/batch_status', [
            'title_page' => 'Tipos de Lote',
            'status' => $status
        ]);
    }

    public function batchStatusAdd(){
        $this->render('/config/batch_status_add', [
            'title_page' => 'Adicionar Status de Lote'
        ]);
    }

    public function batchStatusAddAction(){
        $name_status = filter_input(INPUT_POST, 'name_status');
        if(isset($name_status) && $name_status !== ''){
            $name_status = trim($name_status);
            $operation = BatchStatus::select()->where('name', $name_status)->execute();
            if(count($operation) == 0){
                BatchStatus::insert(['name'=>$name_status])->execute();
                $this->redirect('/config/batch_status', ['success'=>'Salvo']);
            }
        }
        $this->redirect('/config/batch_status/add', ['error'=>'Falha ao salvar']);
    }

    public function atmTypes(){
        $types = AtmType::select()->execute();
        if(count($types) == 0){
            $types = null;
        }

        $this->render('/config/atm_types', [
            'title_page' => 'Tipos de Atms',
            'types' => $types
        ]);

    }

    public function atmTypesAdd(){
        $this->render('/config/atm_types_add', [
            'title_page' => 'Adicionar Tipos de Atm'
        ]);
    }

    public function atmTypesAddAction(){
        $name_type = filter_input(INPUT_POST, 'name_type');
        if(isset($name_type) && $name_type !== ''){
            $name_type = trim($name_type);
            $operation = AtmType::select()->where('name', $name_type)->execute();
            if(count($operation) == 0){
                BatchStatus::insert(['name'=>$name_type])->execute();
                $this->redirect('/config/atm_types', ['success'=>'Salvo']);
            }
        }
        $this->redirect('/config/atm_types/add', ['error'=>'Falha ao salvar']);
    }

    public function shippingTypes(){
         $types = ShippingTypes::select()->execute();
        if(count($types) == 0){
            $types = null;
        }

        $this->render('/config/shipping_types', [
            'title_page' => 'Tipos de Transportadora',
            'types' => $types
        ]);
    }

    public function shippingTypesAdd(){
       $this->render('/config/shipping_types_add', [
            'title_page' => 'Adicionar Tipos de Transportadora'
        ]); 
    }

    public function shippingTypesAddAction(){
         $name_type = filter_input(INPUT_POST, 'name_type');
        if(isset($name_type) && $name_type !== ''){
            $name_type = trim($name_type);
            $operation = ShippingTypes::select()->where('name', $name_type)->execute();
            if(count($operation) == 0){
                ShippingTypes::insert(['name'=>$name_type])->execute();
                $this->redirect('/config/shipping_types', ['success'=>'Salvo']);
            }
        }
        $this->redirect('/config/shipping_types/add', ['error'=>'Falha ao salvar']);
    }
}