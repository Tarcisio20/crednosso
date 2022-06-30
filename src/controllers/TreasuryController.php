<?php
namespace src\controllers;

use \core\Controller;
use \src\models\Treasury;
use \src\models\Shipping;
use \src\models\Treasury_log as TreasuryLog;

class TreasuryController extends Controller {

    public function index() {
        $treasurys = Treasury::select()->execute();
        if(count($treasurys) == 0){
            $treasurys = null;
        }
        foreach($treasurys as $key => $treasury){
            $sh = Shipping::select()->where('id_shipping', $treasury['id_shipping'])->execute();
            $treasurys[$key]['name_shipping'] = $sh[0]['name_shipping']; 
        }
       $this->render('treasury' , [
            'title_page' => 'Saldo de tesourarias',
            'treasurys' => $treasurys
        ]);
    }

    public function add($args){
         if(!isset($args)){
            $this->redirect('/treasury', ['error'=>'Precisamos de um ID para continuar']);
        }
        $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();
        if(count($treasury) == 0){
            Treasury::insert([
                "id_shipping" => $args['id'],
                "a_10" => 0,
                "b_20" => 0,
                "c_50" => 0,
                "d_100" => 0,
                "balance" => 0
            ])->execute();
            TreasuryLog::insert([
                "id_shipping"=>$args['id'],
                "id_log_type"=>'1',
                "value_process"=>0,
                "balance_previous"=>0,
                "balance_current"=>0,
                "date"=>TreasuryLog::gerateDateNow()
            ])->execute();
        }
        $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();
        $shipping = Shipping::select()->where('id_shipping', $args['id'])->execute();
        $treasury[0]['name_shipping'] = $shipping[0]['name_shipping'];
        $this->render('/treasury/treasury_add' , [
            'title_page' => 'Adicionar Saldo',
            'treasury' => $treasury
        ]);
    }

    public function addAction($args){
        if(!isset($args)){
            $this->redirect('/treasury', ['error'=>'Precisamos de um ID para continuar!']);
        }
        $valuesPost = [
          '10' =>   filter_input(INPUT_POST, 'qt_10'),
          '20' =>   filter_input(INPUT_POST, 'qt_20'),
          '50' =>   filter_input(INPUT_POST, 'qt_50'),
          '100' =>   filter_input(INPUT_POST, 'qt_100'),
        ];
  
        $type_move = filter_input(INPUT_POST, 'type_move');

        $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();
        if(count($treasury) == 0){
            Treasury::insert([
                "id_shipping" => $args['id'],
                "a_10" => 0,
                "b_20" => 0,
                "c_50" => 0,
                "d_100" => 0,
                "balance" => 0
            ])->execute();
            

            TreasuryLog::insert([
                "id_shipping"=>$args['id'],
                "id_log_type"=>'1',
                "value_process"=>0,
                "balance_previous"=>0,
                "balance_current"=>0,
                "date"=>TreasuryLog::gerateDateNow()
            ])->execute();
        }
        $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();

        $valuesTreasury = [
            '10' => $treasury[0]['a_10'],
            '20' => $treasury[0]['b_20'],
            '50' => $treasury[0]['c_50'],
            '100' => $treasury[0]['d_100'],
        ]; 
        $new_values = Treasury::generateValueForCassete($type_move, $valuesTreasury, $valuesPost);
        $new_balance = Treasury::gerateValueTotal($new_values);   
            
            
        Treasury::update()->set('a_10', $new_values['10'])
        ->set('b_20', $new_values['20'])->set('c_50', $new_values['50'])
        ->set('d_100', $new_values['100'])->set('balance', $new_balance)
        ->where('id_shipping', $args['id'])->execute();

        TreasuryLog::insert([
            "id_shipping"=>$args['id'],
            "id_log_type"=>'2',
            "value_process"=>$new_balance,
            "balance_previous"=>Treasury::gerateValueTotal($valuesTreasury),
            "balance_current"=>$new_balance,
            "date"=>TreasuryLog::gerateDateNow()
        ])->execute();
        
        $this->redirect('/treasury/add/'.$args['id'], ['success'=>'Saldo adicionado!']);

    }


}