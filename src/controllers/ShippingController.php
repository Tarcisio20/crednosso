<?php
namespace src\controllers;

use \core\Controller;
use \src\models\Shipping;
use \src\models\Treasury;
use \src\models\Treasury_log as TreasuryLog;
use \src\models\Shipping_type as ShippingType;
use \src\models\Shipping_region as ShippingRegion;
use \src\models\Shipping_gmcore as Gmcore;

class ShippingController extends Controller {

    public function index() {

        $shippings = Shipping::select()->orderBy('id_shipping', 'asc')->execute();
        if(count($shippings) === 0){
            $shippings = null;
        }

        foreach($shippings as $key => $shipping){
            $types = ShippingType::select()
                    ->where('id', $shipping['id_type'])->execute();
            $region = ShippingRegion::select()->where('id_region', $shipping['id_region'])->execute();
            $shippings[$key]['name_type'] = $types[0]['name'];
            $shippings[$key]['name_region'] = (count($region) == 0)? null: $region[0]['name'];

        }
        
        $this->render('shipping' , [
            'title_page' => 'Transportadoras',
            'shippings' => $shippings
        ]);
    }

    public function add() {
        $types = ShippingType::select()->where('status', 'Y')->execute();
        if(count($types) == 0){
            $types = null;
        }

        $regions = ShippingRegion::select()->where('status', 'Y')->execute();
        if(count($regions) == 0){
            $regions = null;
        }

        $gmcores = Gmcore::select()->where('status', 'Y')
        ->orderBy('id_gmcore', 'asc')->execute();
        if(count($gmcores) == 0){
            $gmcores = null;
        }

         $this->render('/shipping/shipping_add' , [
            'title_page' => 'Adicionar Transportadora',
            'types' => $types,
            'regions' => $regions,
            'gmcores' => $gmcores
        ]);
    }

    public function addAction(){

        $id_shipping = filter_input(INPUT_POST, 'id_shipping');
        $id_type = filter_input(INPUT_POST, 'type_shipping');
        $name_shipping = filter_input(INPUT_POST, 'name_shipping');
        $emails_shipping = filter_input(INPUT_POST, 'emails_shipping');
        $active_shipping = filter_input(INPUT_POST, 'active_shipping');
        $region_shipping = filter_input(INPUT_POST, 'id_region');
        $id_gmcore = filter_input(INPUT_POST, 'id_gmcore');

        if($id_shipping && $name_shipping  && $active_shipping && 
            $id_type && $region_shipping){

            $region_shipping = strtoupper($region_shipping);
             Shipping::insert([
                 "id_shipping" => $id_shipping,
                 "id_type" => $id_type,
                 "name_shipping" => $name_shipping,
                 "emails" => $emails_shipping,
                 "active" => $active_shipping,
                 "id_region" => $region_shipping,
                 "id_gmcore" => $id_gmcore
             ])->execute();

             Treasury::insert([
                 'id_shipping' => $id_shipping,
                 'a_10' => 0,
                 'b_20' => 0,
                 'c_50' =>  0,
                 'd_100' => 0,
                 'balance' => 0,
                 'status' => 'Y'
             ])->execute();

             TreasuryLog::insert([
                 'id_shipping' => $id_shipping,
                 'id_log_type' => '1',
                 'value_process' => 0,
                 'balance_previous' => 0,
                 'balance_current' => 0,
                 'date' => TreasuryLog::gerateDateNow(),
                 'active' => 'Y'
             ])->execute();



             $this->redirect('/shipping', ["success" => "Transportadora inserida com sucesso!"]);
         }
    }

    public function edit($args) {

        $shipping = Shipping::select()->where('id_shipping', $args['id'])->execute();
        if($shipping === 0){
            $this->redirect('/shipping');
        }
        $types = ShippingType::select()->where('status', 'Y')->execute();
        if(count($types) == 0){
            $types = null;
        }
        $regions = ShippingRegion::select()->where('status', 'Y')->execute();
        if(count($regions) == 0){
            $regions = null;
        }

        $gmcores = Gmcore::select()->where('status', 'Y')
        ->orderBy('id_gmcore', 'asc')->execute();
        if(count($gmcores) == 0){
            $gmcores = null;
        }
        $this->render('/shipping/shipping_edit', [
            'title_page' => 'Editar Transportadora',
            'shipping'=> $shipping,
            'types' => $types,
            'regions' => $regions,
            'gmcores' => $gmcores
        ]);
    }
    
    public function editAction($args){
        $id_shipping = filter_input(INPUT_POST, 'id_shipping');
        $id_type = filter_input(INPUT_POST, 'type_shipping');
        $name_shipping = filter_input(INPUT_POST, 'name_shipping');
        $emails_shipping = filter_input(INPUT_POST, 'emails_shipping');
        $active_shipping = filter_input(INPUT_POST, 'active_shipping');
        $region_shipping = filter_input(INPUT_POST, 'id_region');
        $id_gmcore = filter_input(INPUT_POST, 'id_gmcore');
        
        if($id_shipping && $name_shipping && $active_shipping && 
        $id_type && $region_shipping && $id_gmcore){
            
            Shipping::update()
            ->set('id_shipping', $id_shipping)
            ->set('id_type', $id_type)
            ->set('name_shipping', $name_shipping)
            ->set('emails', $emails_shipping)
            ->set('active', $active_shipping)
            ->set('id_region', $region_shipping)
            ->set('id_gmcore', $id_gmcore)
            ->where('id_shipping', $args['id'])
            ->execute();

            $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();
            if($active_shipping == 'N'){
                Treasury::update()->set('status', 'N')
                ->where('id_shipping', $args['id'])->execute();
                TreasuryLog::insert([
                    'id_shipping'=>$args['id'],
                    'id_log_type'=>'4',
                    'value_process'=>0,
                    'balance_previous'=>$treasury[0]['balance'],
                    'balance_current'=>$treasury[0]['balance'],
                    'date'=>TreasuryLog::gerateDateNow(),
                    'active' => 'Y'
                ])->execute();
            }else{
                Treasury::update()->set('status', 'Y')
                ->where('id_shipping', $args['id'])->execute();
                TreasuryLog::insert([
                    'id_shipping'=>$args['id'],
                    'id_log_type'=>'5',
                    'value_process'=>0,
                    'balance_previous'=>$treasury[0]['balance'],
                    'balance_current'=>$treasury[0]['balance'],
                    'date'=>TreasuryLog::gerateDateNow(),
                    'active' => 'Y'
                ])->execute();
            }
            

            $this->redirect('/shipping');
         }

         $this->redirect('/shipping/edit/'.$args['id']);
    }

    public function disable($args){
        if($args['id']){
            Shipping::update()->set('active', 'N')
            ->where('id_shipping', $args['id'])->execute();

            $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();
            if(count($treasury) == 0){
                Treasury::insert([
                    'id_shipping' => $args['id'],
                    'a_10' => 0,
                    'b_20' => 0,
                    'c_50' =>  0,
                    'd_100' => 0,
                    'balance' => 0,
                    'status' => 'Y'
                ])->execute();
   
                TreasuryLog::insert([
                    'id_shipping' => $args['id'],
                    'id_log_type' => '1',
                    'value_process' => 0,
                    'balance_previous' => 0,
                    'balance_current' => 0,
                    'date' => TreasuryLog::gerateDateNow(),
                    'active' => 'Y'
                ])->execute();
            }
            $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();
            Treasury::update()->set('status', 'N')->where('id_shipping', $args['id'])->execute();

            TreasuryLog::insert([
                'id_shipping'=>$treasury[0]['id_shipping'],
                'id_log_type'=>'4',
                'value_process'=>0,
                'balance_previous'=>$treasury[0]['balance'],
                'balance_current'=>$treasury[0]['balance'],
                'date'=>TreasuryLog::gerateDateNow(),
                'active'=>'Y'
            ])->execute();
            
        }
        $this->redirect('/shipping');
    }

    public function enable($args){
         if($args['id']){
            Shipping::update()->set('active', 'Y')
            ->where('id_shipping', $args['id'])->execute();

            $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();
            if(count($treasury) == 0){
                Treasury::insert([
                    'id_shipping' => $args['id'],
                    'a_10' => 0,
                    'b_20' => 0,
                    'c_50' =>  0,
                    'd_100' => 0,
                    'balance' => 0,
                    'status' => 'Y'
                ])->execute();
   
                TreasuryLog::insert([
                    'id_shipping' => $args['id'],
                    'id_log_type' => '1',
                    'value_process' => 0,
                    'balance_previous' => 0,
                    'balance_current' => 0,
                    'date' => TreasuryLog::gerateDateNow(),
                    'active' => 'Y'
                ])->execute();
            }
            $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();
            Treasury::update()->set('status', 'Y')->where('id_shipping', $args['id'])->execute();
            TreasuryLog::insert([
                'id_shipping'=>$args['id'],
                'id_log_type'=>'5',
                'value_process'=>0,
                'balance_previous'=>$treasury[0]['balance'],
                'balance_current'=>$treasury[0]['balance'],
                'date'=>TreasuryLog::gerateDateNow(),
                'active'=> 'Y'
            ])->execute();
        }
        $this->redirect('/shipping');
    }

}