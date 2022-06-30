<?php
namespace src\controllers;

use \core\Controller;
use \src\models\Shipping_region as ShippingRegion;

class RegionController extends Controller {

    /*public function index() {
        $this->render('home', ['nome' => 'Bonieky']);
    }*/


    public function index() {

        $regions = ShippingRegion::select()->execute();
        if(count($regions) == 0){
            $regions = null;
        }

        $this->render('region' , [
            'title_page' => 'Regiões de Transportadoras',
            'regions' => $regions
        ]);
    }

    public function add() {
       $this->render('/region/region_add' , [
        'title_page' => 'Adicionar região'
        ]);
    }

    public function addAction() {
        $id_region = filter_input(INPUT_POST, 'id_region');
        $name_region = filter_input(INPUT_POST, 'name_region');

        if($id_region && $name_region){
            $name_region = strtoupper($name_region);
            $verifyID = ShippingRegion::select()->where('id_region' , $id_region)->execute();
            if(count($verifyID) == 0){
                $verifyNAME = ShippingRegion::select()->where('name', $name_region)->execute();
                if(count($verifyNAME) == 0){
                    ShippingRegion::insert([
                        'id_region' => $id_region,
                        'name' => $name_region,
                        'status' => 'Y'
                    ])->execute();
                    $this->redirect('/region', ['success'=>'Adicionardo com sucesso']);
                }
            }
        }
        $this->redirect('/region/add', ['error'=>'Problemas na inserção, tentar novamente!']);
    }

    public function edit($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/region', ['error'=>'Precisamos de um ID']);
        }

        $region = ShippingRegion::select()->where('id_region', $args['id'])->execute();
        if(count($region) == 0){
            $region = null;
        }
        
        $this->render('/region/region_edit' , [
            'title_page' => 'Editar região #',
            'region' => $region
            ]);

    }

    public function editAction($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/region', ['error'=>'Precisamos de um ID']);
        }

        $id_region = filter_input(INPUT_POST, 'id_region');
        $name_region = filter_input(INPUT_POST, 'name_region');
        $status_region = filter_input(INPUT_POST, 'status_region');

        if($id_region && $name_region && $status_region){
            $name_region = strtoupper($name_region);

            ShippingRegion::update()->set('id_region', $id_region)
            ->set('name', $name_region)->set('status', $status_region)
            ->where('id_region', $args['id'])->execute();

            $this->redirect('/region', ['success'=>'Alterado']);
        }
        $this->redirect('/region/edit/'.$args['id'], ['error'=>'Problemas na alteração']);

    }

    public function disable($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/region', ['error'=>'Precisamos de um ID']);
        }

        ShippingRegion::update(['status' => 'N'])->where('id_region', $args['id'])->execute();

        $this->redirect('/region', ['success'=>'Desabilitado']);
    }

    public function enable($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/region', ['error'=>'Precisamos de um ID']);
        }

        ShippingRegion::update(['status' => 'Y'])->where('id_region', $args['id'])->execute();

        $this->redirect('/region', ['success'=>'Desabilitado']);
    }

}