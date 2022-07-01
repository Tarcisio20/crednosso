<?php
namespace src\controllers;

use \core\Controller;

use DateTime;

use \src\models\Atm;
use \src\models\Supplie;
use \src\models\Request;
use \src\models\Shipping;
use \src\models\Treasury;
use \src\models\Treasury_log as TreasuryLog;

class SupplieController extends Controller {

    public function index() {
        $shippings = Shipping::select()->where('active', 'Y')->execute();
        if(count($shippings) == 0){
            $shippings = null;
        }

        foreach($shippings as $key => $sh){
           $treasury = Treasury::select()->where('id_shipping', $sh['id_shipping'])
           ->where('status', 'Y')->execute();
            if(count($treasury) > 0){
                $shippings[$key]['balance'] = $treasury[0]['balance']; 
            }else{
                $shippings[$key]['balance'] = 0;
            }
        }

        $this->render('supplie' , [
            'title_page' => 'Abastecimentos',
            'shippings' => $shippings
        ]);
    }

    public function viewAction(){

        $id_shipping = filter_input(INPUT_POST, 'id_shipping');

        $shipping = Shipping::select()->where('id_shipping', $id_shipping)->execute();
        if(count($shipping) == 0){
            $shipping = null;
        }
        $treasury = Treasury::select()->where('id_shipping', $id_shipping)->execute();
        if(count($treasury) == 0){
            $treasury = null;
        }

        $atms = Atm::select()->where('id_treasury', $id_shipping)
        ->where('status', 'Y')->execute(); 
        if(count($atms) == 0){
            $atms = null;
        }

        $date = new DateTime();

        $supplies = Supplie::select()->where('date_supplie', $date->format('Y-m-d'))
        ->where('id_shipping', $id_shipping)->where('active', 'Y')->execute();
        if(count($supplies) == 0){
            $supplies = null;
        }else{
            foreach($supplies as $key => $sup){
                $atm = Atm::select()->where('id_atm', $sup['id_atm'])->execute();
                $supplies[$key]['name_atm'] = (count($atm) > 0) ? $atm[0]['shortened_name_atm'] : null;    
            }
        }

        $this->render('/supplie/supplie_view', [
            'title_page' => 'Abastecimento ',
            'shipping' => $shipping,
            'treasury' => $treasury,
            'atms' => $atms,
            'supplies'=>$supplies,
        ]);
    }

    public function viewActionGet($args){
        if(isset($args['id']) && $args['id'] !== ''){

        }
        $id_shipping = $args['id'];
        $shipping = Shipping::select()->where('id_shipping', $id_shipping)->execute();
        if(count($shipping) == 0){
            $shipping = null;
        }
        $treasury = Treasury::select()->where('id_shipping', $id_shipping)->execute();
        if(count($treasury) == 0){
            $treasury = null;
        }

        $atms = Atm::select()->where('id_treasury', $id_shipping)
        ->where('status', 'Y')->execute(); 
        if(count($atms) == 0){
            $atms = null;
        }


        $supplies = Supplie::select()->where('id_shipping', $id_shipping)
        ->where('active', 'Y')->where('id_status', 1)->execute();
        if(count($supplies) == 0){
            $supplies = null;
        }else{
            foreach($supplies as $key => $sup){
                $atm = Atm::select()->where('id_atm', $sup['id_atm'])->execute();
                $supplies[$key]['name_atm'] = (count($atm) > 0) ? $atm[0]['shortened_name_atm'] : null;    
            }
        }

        $this->render('/supplie/supplie_view', [
            'title_page' => 'Abastecimento ',
            'shipping' => $shipping,
            'treasury' => $treasury,
            'atms' => $atms,
            'supplies'=>$supplies,
        ]); 
    }

    public function viewActionPost($args){
      //  print_r($_POST);die();
        $integrity = filter_input(INPUT_POST, 'integrity');
        $id_atm = filter_input(INPUT_POST, 'id_atm');
        $date_supplie = filter_input(INPUT_POST, 'date_supplie');
        $qt_10 = filter_input(INPUT_POST, 'qt_10');
        $qt_20 = filter_input(INPUT_POST, 'qt_20');
        $qt_50 = filter_input(INPUT_POST, 'qt_50');
        $qt_100 = filter_input(INPUT_POST, 'qt_100');

        if(!isset($integrity) || $integrity == ''){
            $integrity = Supplie::generateIntegrity($args['id'], $id_atm);
        }

        $value_balance = ($qt_10 * 10)+($qt_20 * 20)+($qt_50 * 50)+($qt_100 * 100);
        
        $valuesSupplie = [
            '10'=>$qt_10,
            '20'=>$qt_20,
            '50'=>$qt_50,
            '100'=>$qt_100
        ];  
          
        $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();

        $valuesTreasury = [
            '10'=>$treasury[0]['a_10'],
            '20'=>$treasury[0]['b_20'],
            '50'=>$treasury[0]['c_50'],
            '100'=>$treasury[0]['d_100']
        ];
        if(Request::verifyIfNegative($valuesSupplie, $valuesTreasury)){
            Supplie::insert([
                'id_shipping'=> $args['id'],
                'id_atm'=> $id_atm,
                'integrity'=>$integrity,
                'date_supplie'=>$date_supplie,
                'a_10'=>$qt_10,
                'b_20'=>$qt_20,
                'c_50'=>$qt_50,
                'd_100'=>$qt_100,
                'value_supplie'=> $value_balance,
                'id_status'=>'1',
                'active'=>'Y'
            ])->execute();

            $valuesCassetes = Request::generateValueForCassete('sub', $valuesTreasury, $valuesSupplie);
            $valueFinal = Request::gerateValueTotal($valuesCassetes);

            $treasuryForLog = Treasury::select('balance')->where('id_shipping', $args['id'])->execute();

            Treasury::update()->set('a_10', $valuesCassetes['10'])->set('b_20', $valuesCassetes['20'])
            ->set('c_50', $valuesCassetes['50'])->set('d_100', $valuesCassetes['100'])->set('balance',$valueFinal)
            ->where('id_shipping', $args['id'])->execute();
            

            TreasuryLog::insert([
                'id_shipping' => $args['id'],
                'id_log_type'=> '7',
                'value_process'=> $value_balance,
                'balance_previous'=>$treasuryForLog[0]['balance'],
                'balance_current'=>$valueFinal,
                'date'=>TreasuryLog::gerateDateNow(),
                'active'=>'Y'
            ])->execute();
        }
        $shipping = Shipping::select()->where('id_shipping', $args['id'])->execute();
        if(count($shipping) == 0){
            $shipping = null;
        }
        $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();
        if(count($treasury) == 0){
            $treasury = null;
        }
        $atms = Atm::select()->where('id_treasury', $args['id'])->execute(); 
        if(count($atms) == 0){
            $atms = null;
        }
        $supplies = Supplie::select()->where('date_supplie', $date_supplie)
        ->where('id_shipping', $args['id'])->where('active', 'Y')->execute();
        if(count($supplies) == 0){
            $supplies = null;
        }else{
    
            foreach($supplies as $key => $sup){
                if($sup['id_atm'] == $atms[$key]['id_atm']){
                    $supplies[$key]['name_atm'] = $atms[$key]['shortened_name_atm'];
                }
            }
        }

        $treasury = Treasury::select()->where('id_shipping', $args['id'])->execute();
        $this->render('/supplie/supplie_view', [
            'title_page' => 'Abastecimento ',
            'shipping' => $shipping,
            'treasury' => $treasury,
            'atms' => $atms,
            'supplies' => $supplies,
            'balance' => $treasury[0]['balance']
        ]);
    }

    public function cancel(){
      // print_r($_POST);die();
        $elements_checked = filter_input(INPUT_POST, 'checados');
        $id_shipping = filter_input(INPUT_POST, 'shipping');
        
        if($elements_checked !== ""){
            $elements_checked = explode(',', $elements_checked);
            $treasury = Treasury::select()->where('id_shipping', $id_shipping)->execute();
            if(count($treasury) == 0){
                $treasury = null;
            }
            $valuesTreasury = [
                '10' => $treasury[0]['a_10'],
                '20' => $treasury[0]['b_20'],
                '50' => $treasury[0]['c_50'],
                '100' => $treasury[0]['d_100'],
            ];

            $valueForLoopTreasury = [ 
                '10' => $treasury[0]['a_10'],
                '20' => $treasury[0]['b_20'],
                '50' => $treasury[0]['c_50'],
                '100' => $treasury[0]['d_100'],
            ];
            foreach($elements_checked as $key => $check){
                $supplie = Supplie::select()->where('id', $check)->execute();
                $valueSupplie = [
                    '10'=>$supplie[0]['a_10'],
                    '20'=>$supplie[0]['b_20'],
                    '50'=>$supplie[0]['c_50'],
                    '100'=>$supplie[0]['d_100'],
                ];
                $valueForLoopTreasury = Supplie::generateValueForCassete('adc', $valueForLoopTreasury, $valueSupplie);
                $valueTotalLoopTreasury = Supplie::gerateValueTotal($valueForLoopTreasury);

                $treasury = Treasury::select('balance')->where('id_shipping', $id_shipping)->execute();

                Treasury::update()->set('a_10', $valueForLoopTreasury['10'])
                ->set('b_20', $valueForLoopTreasury['20'])->set('c_50', $valueForLoopTreasury['50'])
                ->set('d_100', $valueForLoopTreasury['100'])->set('balance', $valueTotalLoopTreasury)
                ->where('id_shipping', $id_shipping)->execute();

                TreasuryLog::insert([
                    'id_shipping'=>$id_shipping,
                    'id_log_type'=>'8',
                    'value_process'=>Supplie::gerateValueTotal($valueSupplie),
                    'balance_previous'=>$treasury[0]['balance'],
                    'balance_current'=>$valueTotalLoopTreasury,
                    'date'=>TreasuryLog::gerateDateNow()
                ])->execute();
                
                Supplie::update()->set('active', 'N')->set('id_status', 3)->where('id', $check)->execute();
            }

        }
    }

    public function devide(){
      //  print_r($_POST);die();
        $elements_checked = filter_input(INPUT_POST, 'atms');
        $id_shipping = filter_input(INPUT_POST, 'shipping');
        $date_supplie = filter_input(INPUT_POST, 'date_supplie');
        if($elements_checked !== ""){

            $treasury = Treasury::select()->where('id_shipping', $id_shipping)->execute();
            if(count($treasury) == 0){
                $treasury = null;
            }
            $valuesTreasury = [
                '10' => $treasury[0]['a_10'],
                '20' => $treasury[0]['b_20'],
                '50' => $treasury[0]['c_50'],
                '100' => $treasury[0]['d_100'],
            ];

            if(Treasury::ifEven($valuesTreasury)){
                $elements_checked = explode(',', $elements_checked);

                if(Atm::ifEven($elements_checked)){
                    $valueForTreaury = [
                        '10' => $treasury[0]['a_10'],
                        '20' => $treasury[0]['b_20'],
                        '50' => $treasury[0]['c_50'],
                        '100' => $treasury[0]['d_100'],
                        'balance' => Supplie::gerateValueTotal($valuesTreasury)
                    ];
                    foreach($elements_checked as $key => $check){
                        $valueForLogs = $valueForTreaury['balance'];
                        $supplie = Supplie::select()->where('date_supplie', $date_supplie)
                        ->where('id_shipping', $id_shipping)->where('active', 'Y')->execute();
                        if(count($supplie) == 0){
                            $integrity = Supplie::generateIntegrity($id_shipping, $check);
                        }
                        $valueForSupplie = [
                            '10' => $valuesTreasury['10'] / count($elements_checked),
                            '20' => $valuesTreasury['20'] / count($elements_checked),
                            '50' => $valuesTreasury['50'] / count($elements_checked),
                            '100' => $valuesTreasury['100'] / count($elements_checked),
                         ];
                        $value_balance = Supplie::gerateValueTotal($valueForSupplie);
                            Supplie::insert([
                                'id_shipping'=>$id_shipping,
                                'id_atm'=>$check,
                                'integrity'=>(count($supplie) == 0)?$integrity : $supplie[0]['integrity'],
                                'date_supplie'=>$date_supplie,
                                'a_10'=>$valueForSupplie['10'],
                                'b_20'=>$valueForSupplie['20'],
                                'c_50'=>$valueForSupplie['50'],
                                'd_100'=>$valueForSupplie['100'],
                                'value_supplie'=> $value_balance,
                                'id_status'=> 1,
                                'active'=> 'Y'
                            ])->execute();
                            $valueForTreaury = [
                                '10' => $valueForTreaury['10'] - $valueForSupplie['10'],
                                '20' => $valueForTreaury['20'] - $valueForSupplie['20'],
                                '50' => $valueForTreaury['50'] - $valueForSupplie['50'],
                                '100' => $valueForTreaury['100'] - $valueForSupplie['100'],
                                'balance' => $valueForTreaury['balance'] - $value_balance
                            ];
                            echo $key.'-->';
                            Treasury::update()->set('a_10', $valueForTreaury['10'])
                            ->set('b_20', $valueForTreaury['20'])->set('c_50', $valueForTreaury['50'])
                            ->set('d_100', $valueForTreaury['100'])->set('balance', $valueForTreaury['balance'])
                            ->where('id_shipping', $id_shipping)->execute();
                            
                            TreasuryLog::insert([
                                'id_shipping' => $id_shipping,
                                'id_log_type'=> '7',
                                'value_process'=> $value_balance,
                                'balance_previous'=> $valueForLogs,
                                'balance_current'=> $valueForTreaury['balance'],
                                'date'=>TreasuryLog::gerateDateNow(),
                                'active'=>'Y'
                            ])->execute();
                    }

                    die();    
                }    
            }
        }
    }

    public function screen($args){
       // print_r($args);die();
        if(!isset($args['date']) && $args['date'] !== ''){
            $this->redirect('/supplie', ['error'=>'Precisamos de uma data para continuar!']);
        }
       // echo $args['date'];die();
        $oss = Supplie::select()->where('date_supplie', $args['date'])
        ->where('id_status', 1)->execute();
        if(count($oss) == 0){
            $oss = null;
        }
       // print_r($oss);die();
        $this->render('/supplie/supplie_screen', [
            'title_page' => "Tela de OS's para abastecimento",
            'oss' => $oss,
            'date' => $args['date']
        ]); 
    }

    public function screenPost($args){
        $date_supplie = filter_input(INPUT_POST, 'date_supplie');
        if(!isset($date_supplie) && $date_supplie !== ''){
            $this->redirect('/supplie', ['error'=>'Precisamos de uma data para continuar!']);
        }
        $oss = Supplie::select()->where('date_supplie', $date_supplie)
        ->where('id_status', 1)->execute();
        if(count($oss) == 0){
            $oss = null;
        }
        $this->render('/supplie/supplie_screen', [
            'title_page' => "Tela de OS's para abastecimento",
            'oss' => $oss,
            'date' => $date_supplie
        ]); 
    }

    public function cancelIndividual(){
        // print_r($_POST);die();
         $id = filter_input(INPUT_POST, 'id');
         $supplie = Supplie::select()->where('id', $id)->execute();
         //print_r($supplie);die();
         if(count($supplie) > 0){
            $valuesSupplie = [
                '10' => $supplie[0]['a_10'],
                '20' => $supplie[0]['b_20'],
                '50' => $supplie[0]['c_50'],
                '100' => $supplie[0]['d_100'],
            ];
            Supplie::update()->set('id_status', 3)->where('id', $id)->execute();
            $treasury = Treasury::select()->where('id_shipping', $supplie[0]['id_shipping'])->execute();
            //print_r($treasury);die();
            if(count($treasury) > 0){
                $valuesTreasury = [
                    '10' => $treasury[0]['a_10'],
                    '20' => $treasury[0]['b_20'],
                    '50' => $treasury[0]['c_50'],
                    '100' => $treasury[0]['d_100'],
                ]; 
                
                $valueByTreasury = Supplie::generateValueForCassete('adc',$valuesTreasury, $valuesSupplie);
                $valueTotalByTreasury = Supplie::gerateValueTotal($valueByTreasury);
               // print_r($valueByTreasury['10']);die();
                Treasury::update()->set('a_10', $valueByTreasury['10'])->set('b_20', $valueByTreasury['20'])
                ->set('c_50', $valueByTreasury['50'])->set('d_100', $valueByTreasury['100'])
                ->set('balance', $valueTotalByTreasury)
                ->where('id_shipping', $supplie[0]['id_shipping'])->execute();

                TreasuryLog::insert([
                    'id_shipping' => $supplie[0]['id_shipping'],
                    'id_log_type' => '2',
                    'value_process' => Supplie::gerateValueTotal($valuesSupplie),
                    'balance_previous' => Supplie::gerateValueTotal($valuesTreasury),
                    'balance_current' => $valueTotalByTreasury,
                    'date' => TreasuryLog::gerateDateNow()
                ])->execute();

                echo json_encode(['success' => 'Excluido com sucesso']);
            }
        }
    }

    public function generateOS(){
        //print_r($_POST);die();
        $date_supplie = filter_input(INPUT_POST, 'date');
 
        if(!isset($date_supplie) && $date_supplie !== ''){
            $this->redirect('/supplie', ['error'=>'Precisamos de uma data para continuar!']);
        }
        $oss = Supplie::select()->where('date_supplie', $date_supplie)
        ->where('id_status', 1)->execute();
        if(count($oss) > 0){
           $caminho = $_SERVER["DOCUMENT_ROOT"].'/crednosso/excel/abastecimento.xlsx';
           if(!file_exists($caminho)){
                mkdir($caminho, 0777, true);
           }
           print_r($oss);die();
           Request::generateExcelOS($oss, $caminho);
        }
    }
}