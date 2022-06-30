<?php
namespace src\controllers;

use Dompdf\Dompdf;
use Dompdf\Options;

use \src\helppers\generateHTML;

use \core\Controller;
use \src\models\Batch;
use \src\models\Treasury;
use \src\models\Request;
use \src\models\Shipping;
use \src\models\Order_type as OrderType;
use \src\models\Request_pdf as RequestPdf;
use \src\models\Shipping_gmcore as Gmcore;
use \src\models\Treasury_log as TreasuryLog;
use \src\models\Request_status as RequestStatus;
use \src\models\Operation_type as OperationType;
use \src\models\Request_payroll as RequestPayroll;
use ZipArchive;

class RequestController extends Controller {

    public function index() {
        $requests = Request::select()->execute();
        if(count($requests) == 0){
            $requests = null;
        }
       
        foreach($requests as $key => $request){
            $batch = Batch::select()->where('id', $request['id_batch'])->execute();
            $shOrigin = Shipping::select()->where('id_shipping', $request['id_origin'])->execute();
            $shDestiny = Shipping::select()->where('id_shipping', $request['id_destiny'])->execute();
            $status = RequestStatus::select()->where('id', $request['id_status'])->execute();
            $requests[$key]['batch'] = $batch[0]['batch'];
            $requests[$key]['name_origin'] = $shOrigin[0]['name_shipping'];
            $requests[$key]['name_destiny'] = (isset($shDestiny[0]['name_shipping'])) ? $shDestiny[0]['name_shipping'] : null;
            $requests[$key]['name_status'] = $status[0]['name'];
        }
        
        $this->render('request' , [
            'title_page' => 'Pedidos',
            'requests' => $requests
        ]);
    }

    public function add(){
        $operationTypes = OperationType::select()->where('active', 'Y')->execute();
        if(count($operationTypes) == 0){
            $operationTypes = null;
        }
        $shippings = Shipping::select()->where('active', 'Y')->execute();
        if(count($shippings) == 0){
            $shippings = null;
        }

        $order_types = OrderType::select()->where('active', 'Y')->execute();
        if(count($order_types) == 0){
            $order_types = null;
        }
        $this->render('/request/request_add', [
            'title_page' => 'Adicionar pedido',
            'operation_types' => $operationTypes,
            'shippings' => $shippings,
            'order_types' => $order_types,  
        ]);
    } 

    public function addAction(){
        
        $operation_type = filter_input(INPUT_POST, 'operation_type');
        $id_origin = filter_input(INPUT_POST, 'id_origin');
        $id_destiny = filter_input(INPUT_POST, 'id_destiny');
        $date_request = filter_input(INPUT_POST, 'date_request');
        $order_request = filter_input(INPUT_POST, 'order_request');
        $note_request = filter_input(INPUT_POST, 'note_request');
        $qt_10 = filter_input(INPUT_POST, 'qt_10');
        $qt_20 = filter_input(INPUT_POST, 'qt_20');
        $qt_50 = filter_input(INPUT_POST, 'qt_50');
        $qt_100 = filter_input(INPUT_POST, 'qt_100');

        if($operation_type && $id_origin && $date_request && $order_request 
         && $qt_10 && $qt_20 && $qt_50 && $qt_100)
        {
            
            $arrayValues = [
                '10' => ($qt_10) ? $qt_10 : 0,
                '20' =>  ($qt_20) ? $qt_20 : 0,
                '50' => ($qt_50) ? $qt_50 : 0,
                '100' => ($qt_100) ? $qt_100 : 0
            ];
            $value_total = Request::gerateValueTotal($arrayValues);
        
            $batch = Batch::select()->where('date_batch', $date_request)->execute();    
            if(count($batch) == 0){
                $batchGerate = Batch::generateBatch($id_origin, $id_destiny);
                Batch::insert([
                    'id_type'=>'1',
                    'batch' =>$batchGerate,
                    'date_batch'=>$date_request,
                    'status' => '1'
                ])->execute();

                $batch = Batch::select()->where('batch', $batchGerate)->execute();
            }
            
            Request::insert([
                'id_batch' => $batch[0]['id'],
                'id_operation_type' => $operation_type,
                'id_origin' => $id_origin,
                'id_order_type' => $order_request,
                'id_destiny' => $id_destiny,
                'date_request' => $date_request,
                'qt_10' => $qt_10,
                'qt_20' => $qt_20,
                'qt_50' => $qt_50,
                'qt_100' => $qt_100,
                'note' => $note_request,
                'active' => 'Y',
                'id_status' => '1',
                'value_total'=> $value_total,
                'confirmed_value'=>'0',
                'change_in_confirmation' => 'N'
            ])->execute();
            
                 
            $this->redirect('/request/add', ['success'=>'Adicionado o Pedido.']);
        }
        $this->redirect('/request/add', ['error'=>'Houve algum erro na inclusão, favor tentar novamente']);
    }

    public function search(){
        $this->render('/request/request_search', [
            'title_page' => 'Pesquisa pedidos'
        ]);
    }

    public function searchAction(){
       // print_r($_POST);die();
        $date_initial = filter_input(INPUT_POST, 'date_initial');
        $date_final = filter_input(INPUT_POST, 'date_final');

        if($date_final == ''){
            $requests = Request::select()->where('date_request', $date_initial)->execute();
            if(count($requests) == 0){
                $requests = null;
            }
        }else{
            $requests = Request::select()
            ->where('date_request', '>=', $date_initial)
            ->where('date_request', '<=', $date_final)->execute();
            if(count($requests) == 0){
                $requests = null;
            }
        }
        foreach($requests as $key => $request){
            $shOrigin = Shipping::select()
            ->where('id_shipping', $request['id_origin'])->execute();
            $shDestiny = Shipping::select()
            ->where('id_shipping', $request['id_destiny'])->execute();
            $status = RequestStatus::select()->where('id', $request['id_status'])->execute();
            $batch = Batch::select()->where('id', $request['id_batch'])->execute();
            $requests[$key]['name_origin'] = (count($shOrigin) == 0)? null : $shOrigin[0]['name_shipping'];
            $requests[$key]['name_destiny'] = (count($shDestiny) == 0)? null : $shDestiny[0]['name_shipping'];
            $requests[$key]['name_status'] = (count($status) == 0)? null : $status[0]['name'];
            $requests[$key]['name_batch'] = (count($batch) == 0)? null : $batch[0]['batch'];
        }
        $this->render('/request/request_search', [
            'title_page' => 'Pesquisa pedidos',
            'requests' => $requests,
            'date_initial' => $date_initial,
            'date_final' => $date_final,
        ]);
    }

    public function searchAjaxAction(){
       // print_r($_POST);die();
        $elements_checked = filter_input(INPUT_POST, 'checados');
        $date_initial = filter_input(INPUT_POST, 'date_initial');
        $date_final = filter_input(INPUT_POST, 'date_final');
        if($elements_checked !== ""){
            $elements_checked = explode(',', $elements_checked);
            foreach($elements_checked as  $check){
                $request = Request::select()->where("id", $check)->execute();
                if($request[0]['id_status'] == 1){
                    if($request[0]['id_destiny'] == 0){
                        $treasury = Treasury::select()->where("id_shipping", $request[0]['id_origin'])->execute();
                        if(count($treasury) > 0){
                            $valueTreasury = [
                                '10' => $treasury[0]['a_10'],
                                '20' => $treasury[0]['b_20'],
                                '50' => $treasury[0]['c_50'],
                                '100' => $treasury[0]['d_100'],
                            ];
                            $valueRequest = [
                                '10' => $request[0]['qt_10'],
                                '20' => $request[0]['qt_20'],
                                '50' => $request[0]['qt_50'],
                                '100' => $request[0]['qt_100'],
                            ];
                            $valueFinal = Request::generateValueForCassete('adc', $valueTreasury, $valueRequest);
                            $balance = Request::gerateValueTotal($valueFinal);
                            Treasury::update()->set("a_10", $valueFinal['10'])
                            ->set("b_20", $valueFinal['20'])->set("c_50", $valueFinal['50'])
                            ->set("d_100", $valueFinal['100'])->set("balance", $balance)
                            ->where('id_shipping', $request[0]['id_origin'])->execute();
                            TreasuryLog::insert([
                                "id_shipping"=>$request[0]['id_origin'],
                                "id_log_type"=>"2",
                                "value_process"=>$balance,
                                "date"=>TreasuryLog::gerateDateNow()
                            ])->execute();
                        }
                    }else{
                        $treasuryDestiny = Treasury::select()->where("id_shipping", $request[0]['id_destiny'])->execute();
                        $treasuryOrigin = Treasury::select()->where("id_shipping", $request[0]['id_origin'])->execute();
                        
                        if(count($treasuryDestiny) == 0){
                            Treasury::insert([
                                "id_shipping"=>$request[0]['id_destiny']
                            ])->execute();
                            TreasuryLog::insert([
                                "id_shipping"=>$request[0]['id_destiny'],
                                "id_log_type"=>"1",
                                "value_process"=>0,
                                "date"=>TreasuryLog::gerateDateNow()
                            ])->execute();
                        }
                        $treasuryDestiny = Treasury::select()->where("id_shipping", $request[0]['id_destiny'])->execute();
                        $valueTreasury = [
                                '10' => $treasuryDestiny[0]['a_10'],
                                '20' => $treasuryDestiny[0]['b_20'],
                                '50' => $treasuryDestiny[0]['c_50'],
                                '100' => $treasuryDestiny[0]['d_100'],
                        ];
                        $valueRequest = [
                                '10' => $request[0]['qt_10'],
                                '20' => $request[0]['qt_20'],
                                '50' => $request[0]['qt_50'],
                                '100' => $request[0]['qt_100'],
                        ];
                        $valueFinal = Request::generateValueForCassete('adc', $valueTreasury, $valueRequest);
                        $balance = Request::gerateValueTotal($valueFinal);
                        Treasury::update()->set("a_10", $valueFinal['10'])
                        ->set("b_20", $valueFinal['20'])->set("c_50", $valueFinal['50'])
                        ->set("d_100", $valueFinal['100'])->set("balance", $balance)
                        ->where("id_shipping", $request[0]['id_destiny'])->execute();
                        TreasuryLog::insert([
                            "id_shipping"=>$request[0]['id_destiny'],
                            "id_log_type"=>"2",
                            "value_process"=>$balance,
                            "date"=>TreasuryLog::gerateDateNow()
                        ])->execute();

                        $valueOrigin = [
                                '10' => $treasuryOrigin[0]['a_10'],
                                '20' => $treasuryOrigin[0]['b_20'],
                                '50' => $treasuryOrigin[0]['c_50'],
                                '100' => $treasuryOrigin[0]['d_100'],
                        ];

                        $valueFinal = Request::generateValueForCassete('sub', $valueOrigin, $valueRequest);
                        $balance = Request::gerateValueTotal($valueFinal);
                        Treasury::update()->set("a_10", $valueFinal['10'])
                        ->set("b_20", $valueFinal['20'])->set("c_50", $valueFinal['50'])
                        ->set("d_100", $valueFinal['100'])->set("balance", $balance)
                        ->where("id_shipping", $request[0]['id_origin'])->execute();
                        TreasuryLog::insert([
                            "id_shipping"=>$request[0]['id_origin'],
                            "id_log_type"=>"3",
                            "value_process"=>$balance,
                            "date"=>TreasuryLog::gerateDateNow()
                        ])->execute();
                    }
                    Request::update()->set('id_status', 2)
                    ->set('confirmed_value', $request[0]['value_total'])->where("id", $check)->execute();
                }
            }
        }
        if($date_final == ''){
            $requests = Request::select()->where('date_request', $date_initial)->execute();
            if(count($requests) == 0){
                $requests = null;
            }
        }else{
            $requests = Request::select()
            ->where('date_request', '>=', $date_initial)
            ->where('date_request', '<=', $date_final)->execute();
            if(count($requests) == 0){
                $requests = null;
            }
        }

       // echo "Acabou";
         $this->render('/request/request_view', [
            'title_page' => 'Pesquisa pedidos',
            'requests' => $requests,
            'date_initial' => $date_initial,
            'date_final' => $date_final,
         ]);
    }

    public function partialAction(){
       // print_r($_POST);die();
        $elements_checked = filter_input(INPUT_POST, 'checados');
        $date_initial = filter_input(INPUT_POST, 'date_initial');
        $date_final = filter_input(INPUT_POST, 'date_final');
        $values = filter_input(INPUT_POST, 'values');
        $new_values = explode('&', $values);

        $valueRequest = Request::generateValuesPartials($new_values);
         if($elements_checked !== ""){
            $elements_checked = explode(',', $elements_checked);
            foreach($elements_checked as  $check){
                $request = Request::select()->where("id", $check)->execute();
                if($request[0]['id_status'] == 1){
                    if($request[0]['id_destiny'] == 0){
                        $treasury = Treasury::select()
                        ->where("id_shipping", $request[0]['id_origin'])->execute();
                        if(count($treasury) > 0){
                            $valueTreasury = [
                                '10' => $treasury[0]['a_10'],
                                '20' => $treasury[0]['b_20'],
                                '50' => $treasury[0]['c_50'],
                                '100' => $treasury[0]['d_100'],   
                            ];
                            $valueFinal = Request::generateValueForCassete('adc', $valueTreasury, $valueRequest);
                            $balance = Request::gerateValueTotal($valueFinal);
                            Treasury::update()->set("a_10", $valueFinal['10'])
                            ->set("b_20", $valueFinal['20'])->set("c_50", $valueFinal['50'])
                            ->set("d_100", $valueFinal['100'])->set("balance", $balance)
                            ->where('id_shipping', $request[0]['id_origin'])->execute();

                            TreasuryLog::insert([
                                "id_shipping"=>$request[0]['id_origin'],
                                "id_log_type"=>"2",
                                "value_process"=>$balance,
                                "date"=> TreasuryLog::gerateDateNow()
                            ])->execute();
                        } else { // VERIFICAÇÃO SE A TRANSPORTADORA JA EXISTE
                             $treasuryDestiny = Treasury::select()->where("id_shipping", $request[0]['id_destiny'])->execute();
                            $treasuryOrigin = Treasury::select()->where("id_shipping", $request[0]['id_origin'])->execute();
                        
                            if(count($treasuryDestiny) == 0){
                                Treasury::insert([
                                    "id_shipping"=>$request[0]['id_destiny']
                                ])->execute();
                                TreasuryLog::insert([
                                    "id_shipping"=>$request[0]['id_destiny'],
                                    "id_log_type"=>"1",
                                    "value_process"=> 0,
                                    "date"=> TreasuryLog::gerateDateNow()
                                ])->execute();
                            }
                            $treasuryDestiny = Treasury::select()->where("id_shipping", $request[0]['id_destiny'])->execute();
                            $valueTreasury = [
                                '10' => $treasuryDestiny[0]['a_10'],
                                '20' => $treasuryDestiny[0]['b_20'],
                                '50' => $treasuryDestiny[0]['c_50'],
                                '100' => $treasuryDestiny[0]['d_100'],
                            ];

                            $valueFinal = Request::generateValueForCassete('adc', $valueTreasury, $valueRequest);
                            $balance = Request::gerateValueTotal($valueFinal);
                            Treasury::update()->set("a_10", $valueFinal['10'])
                            ->set("b_20", $valueFinal['20'])->set("c_50", $valueFinal['50'])
                            ->set("d_100", $valueFinal['100'])->set("balance", $balance)
                            ->where("id_shipping", $request[0]['id_destiny'])->execute();
                            TreasuryLog::insert([
                                "id_shipping"=>$request[0]['id_destiny'],
                                "id_log_type"=>"2",
                                "value_process"=>$balance,
                                "date"=> TreasuryLog::gerateDateNow()
                            ])->execute();
                            $valueOrigin = [
                                '10' => $treasuryOrigin[0]['a_10'],
                                '20' => $treasuryOrigin[0]['b_20'],
                                '50' => $treasuryOrigin[0]['c_50'],
                                '100' => $treasuryOrigin[0]['d_100'],
                            ];

                            $valueFinal = Request::generateValueForCassete('sub', $valueOrigin, $valueRequest);
                            $balance = Request::gerateValueTotal($valueFinal);
                            Treasury::update()->set("a_10", $valueFinal['10'])
                            ->set("b_20", $valueFinal['20'])->set("c_50", $valueFinal['50'])
                            ->set("d_100", $valueFinal['100'])->set("balance", $balance)
                            ->where("id_shipping", $request[0]['id_origin'])->execute();
                            TreasuryLog::insert([
                                "id_shipping"=>$request[0]['id_origin'],
                                "id_log_type"=>"3",
                                "value_process"=>$balance,
                                "date"=> TreasuryLog::gerateDateNow()
                            ])->execute();

                        }// FIM DA VERIFICAÇÃO SE A TRANSPORTADORA EXISTE

                        $balance_final = Request::gerateValueTotal($valueRequest);
                        Request::update()->set('id_status', 2)->set('qt_10', $valueRequest['10'])
                        ->set('qt_20', $valueRequest['20'])->set('qt_50', $valueRequest['50'])
                        ->set('qt_100', $valueRequest['100'])
                    ->set('confirmed_value', $balance_final)->set('change_in_confirmation', 'Y')
                    ->where("id", $check)->execute();
                    } // FIM DA VERIF SE EXISTE DESTINO
                } // FIM DA VERIF. DO REQUEST STATUS
            }   
         }// FIM DA VERIFICAÇÃO SE SE EXISTE ITENS CHECADOS
         if($date_final == ''){
            $requests = Request::select()->where('date_request', $date_initial)->execute();
            if(count($requests) == 0){
                $requests = null;
            }
        }else{
            $requests = Request::select()
            ->where('date_request', '>=', $date_initial)
            ->where('date_request', '<=', $date_final)->execute();
            if(count($requests) == 0){
                $requests = null;
            }
        }

       // echo "Acabou";
         $this->render('/request/request_view', [
            'title_page' => 'Pesquisa pedidos',
            'requests' => $requests,
            'date_initial' => $date_initial,
            'date_final' => $date_final,
         ]);
    }

    public function newDate(){
       // print_r($_POST);die();
        $date = filter_input(INPUT_POST, 'new_date');
        $elements_checked = filter_input(INPUT_POST, 'checados');
        if($date){
            if($elements_checked !== ""){
                $elements_checked = explode(',', $elements_checked);
                foreach($elements_checked as  $check){
                   
                    Request::update()->set('date_request', $date)
                    ->where('id', $check)->execute();
                    json_encode(['success'=>'Alterado']);
                }
            }
        }
        json_encode(['error'=>'Erro ao executar']);
    }

    public function view($args){
        if(!isset($args['id']) && $args['id'] == null){
            $this->render('/request',['error'=>'Precisamos de um ID para continuar']);
        }
        $request = Request::select()->where('id', $args['id'])->execute();
        if(count($request) == 0){
            $request = null;
        }else{
            $operationTypes = OperationType::select()->where('active', 'Y')->execute();
            if(count($operationTypes) == 0){
                $operationTypes = null;
            }
            $shippings = Shipping::select()->where('active', 'Y')->execute();
            if(count($shippings) == 0){
                $shippings = 0;
            }

            $orderTypes = OrderType::select()->where('active', 'Y')->execute();
            if(count($orderTypes) == 0){
                $order_types = null;
            }

            $batch = Batch::select()->where('id', $request[0]['id_batch'])->execute();
            if(count($batch) == 0){
                $batch = null;
            }
        }

        $this->render('/request/request_view', [
            'title_page'=>'Visualização Pedido',
            'request' => $request,
            'operation_types' => $operationTypes,
            'shippings' => $shippings,
            'order_types' => $orderTypes,
            'batch' => $batch
        ]);
    }

    public function editAction($args){
       // $id_request = filter_input(INPUT_POST, 'id_requet');
        $batch_request = filter_input(INPUT_POST, 'batch');
        $operation_type = filter_input(INPUT_POST, 'operation_type');
        $id_origin = filter_input(INPUT_POST, 'id_origin');
        $id_destiny = filter_input(INPUT_POST, 'id_destiny');
        $date_request = filter_input(INPUT_POST, 'date_request');
        $order_request = filter_input(INPUT_POST, 'order_request');
        $note_request = filter_input(INPUT_POST, 'note_request');
        $qt_10 = filter_input(INPUT_POST, 'qt_10');
        $qt_20 = filter_input(INPUT_POST, 'qt_20');
        $qt_50 = filter_input(INPUT_POST, 'qt_50');
        $qt_100 = filter_input(INPUT_POST, 'qt_100');
        
        $batch = Batch::select()->where('date_batch', $date_request)->execute();
        if(count($batch) == 0){
            $lote = Batch::generateBatch($id_origin, $id_destiny);
            Batch::insert([
                'id_type' => '1',
                'batch' => $lote,
                'date_batch' => $date_request,
                'status' => '1'
            ])->execute();
            $batch = Batch::select()->where('batch', $lote)->execute();
        }

        Request::update()->set('id_bath', $batch[0]['id'])->set('id_operation_type', $operation_type)
        ->set('id_order_type', $order_request)->set('id_origin', $id_origin)->set('id_destiny', $id_destiny)
        ->set('date_request', $date_request)->set('qt_10', $qt_10)->set('qt_20', $qt_20)
        ->set('qt_50', $qt_50)->set('qt_100', $qt_100)->set('note', $note_request)
        ->where('id', $args['id'])->execute();
        
        $this->redirect('/request/view/'.$args['id'], ['success'=>'Alterado']);
    }

    public function payment(){

        $payments = RequestPayroll::select()->where('status', 'Y')->where('id_type', 1)
        ->orderBy('id_shipping', 'ASC')->execute();
        if(count($payments) == 0){
            $payments = null;
        }
        $balance = 0;
        foreach($payments as $key => $payment){
            $shipping = Shipping::select()->where('id_shipping', $payment['id_shipping'])->execute();
            $payments[$key]['name_shipping'] = (count($shipping) == 0)? null : $shipping[0]['name_shipping'];
            $balance = $balance + $payment['balance'];
        }

        $this->render('/request/payment/request_payment',[
            'title_page' => 'Pedido padrão de salario',
            'payments' => $payments,
            'balance' => $balance
        ]);
    }

    public function paymentAdd(){

        $shippings = Shipping::select()->where('active', 'Y')->execute();
        if(count($shippings) == 0){
            $shippings = null;
        }
        $this->render('/request/payment/request_payment_add',[
            'title_page' => 'Adicionar pedido padrão',
            'shippings' => $shippings
        ]);
    }

    public function paymentAddAction(){

        $id_payment = filter_input(INPUT_POST, 'id_payment');
        $cass_A = filter_input(INPUT_POST, 'qt_10');
        $cass_B = filter_input(INPUT_POST, 'qt_20');
        $cass_C = filter_input(INPUT_POST, 'qt_50');
        $cass_D = filter_input(INPUT_POST, 'qt_100');

        if($id_payment && $cass_A !== '' && $cass_B !== '' &&
        $cass_C !== '' && $cass_D !== ''){
            $payment = RequestPayroll::select()->where('id_shipping', $id_payment)
            ->where('id_type', 1)->execute();
            if(count($payment) == 0){
                $values = [
                    '10' => $cass_A,
                    '20' => $cass_B,
                    '50' => $cass_C,
                    '100' => $cass_D
                ];
                $balance = Request::gerateValueTotal($values);
                RequestPayroll::insert([
                    'id_shipping' => $id_payment,
                    'cass_A' => $cass_A,
                    'cass_B' => $cass_B,
                    'cass_C' => $cass_C,
                    'cass_D' => $cass_D,
                    'balance' => $balance,
                    'id_type' => 1,
                    'status' => 'Y'
                ])->execute();
                $this->redirect('/request/payment', ['success'=>'Cadastrado']);
            }else{
                $this->redirect('/request/payment/add', ['error'=>'Já temos a transportadora, favor usar o botão Editar!']);
            }
        }
    }

    public function paymentEdit($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/request/payment', ['error'=>'Precisamos de um ID']);
        }

        $payment = RequestPayroll::select()->where('id_shipping', $args['id'])
        ->where('id_type', 1)->execute();
        if(count($payment) == 0){
            $payment = null;
        }

        $shipping = Shipping::select()->where('id_shipping', $args['id'])->execute();
        if(count($shipping) == 0){
            $shipping = null;
        }else{
            $payment[0]['name_shipping'] = $shipping[0]['name_shipping'];
        }
        $this->render('/request/payment/request_payment_edit',[
            'title_page' => 'Editar pedido padrão de salario',
            'payment' => $payment,
        ]);
    }

    public function paymentEditAction($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/request/payment', ['error'=>'Precisamos de um ID']);
        }
        $cass_A = filter_input(INPUT_POST, 'qt_10');
        $cass_B = filter_input(INPUT_POST, 'qt_20');
        $cass_C = filter_input(INPUT_POST, 'qt_50');
        $cass_D = filter_input(INPUT_POST, 'qt_100');

        $values  = [
            '10'=>$cass_A,
            '20'=>$cass_B,
            '50'=>$cass_C,
            '100'=>$cass_D
        ];
        $balance = Request::gerateValueTotal($values);

        RequestPayroll::update()->set('cass_A', $cass_A)
        ->set('cass_B', $cass_B)->set('cass_C', $cass_C)
        ->set('cass_D', $cass_D)->set('balance', $balance)
        ->where('id_shipping', $args['id'])->where('id_type', 1)->execute();

        $this->redirect('/request/payment', ['success'=>'Editado']);
    }

    public function paymentVacation(){
        $payments = RequestPayroll::select()->where('status', 'Y')->where('id_type', 2)
        ->orderBy('id_shipping', 'ASC')->execute();
        $balance = 0;
        if(count($payments) == 0){
            $payments = null;
        }else{ 
            foreach($payments as $key => $payment){
                $shipping = Shipping::select()->where('id_shipping', $payment['id_shipping'])->execute();
                $payments[$key]['name_shipping'] = (count($shipping) == 0)? null : $shipping[0]['name_shipping'];
                $balance = $balance + $payment['balance'];
            }
        }

        $this->render('/request/payment/request_payment_vacation',[
            'title_page' => 'Pedido padrão de férias',
            'payments' => $payments,
            'balance' => $balance
        ]);
    }

    public function paymentVacationAdd(){
        $shippings = Shipping::select()->where('active', 'Y')
        ->orderBy('id_shipping', 'ASC')->execute();
        if(count($shippings) == 0){
            $shippings = null;
        }
        $this->render('/request/payment/request_payment_vacation_add',[
            'title_page' => 'Adicionar pedido padrão Ferias',
            'shippings' => $shippings
        ]);
    }

    public function paymentVacationAddAction(){
        $id_payment = filter_input(INPUT_POST, 'id_payment');
        $cass_A = filter_input(INPUT_POST, 'qt_10');
        $cass_B = filter_input(INPUT_POST, 'qt_20');
        $cass_C = filter_input(INPUT_POST, 'qt_50');
        $cass_D = filter_input(INPUT_POST, 'qt_100');

        if($id_payment && $cass_A !== '' && $cass_B !== '' &&
        $cass_C !== '' && $cass_D !== ''){
            $payment = RequestPayroll::select()->where('id_shipping', $id_payment)
            ->where('id_type', 2)->execute();
            if(count($payment) == 0){
                $values = [
                    '10' => $cass_A,
                    '20' => $cass_B,
                    '50' => $cass_C,
                    '100' => $cass_D
                ];
                $balance = Request::gerateValueTotal($values);
                RequestPayroll::insert([
                    'id_shipping' => $id_payment,
                    'cass_A' => $cass_A,
                    'cass_B' => $cass_B,
                    'cass_C' => $cass_C,
                    'cass_D' => $cass_D,
                    'balance' => $balance,
                    'id_type' => 2,
                    'status' => 'Y'
                ])->execute();
                $this->redirect('/request/payment_vacation', ['success'=>'Cadastrado']);
            }else{
                $this->redirect('/request/payment_vacation/add', ['error'=>'Já temos a transportadora, favor usar o botão Editar!']);
            }
        }
    }

    public function paymentVacationEdit($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/request/payment_vacation', ['error'=>'Precisamos de um ID']);
        }

        $payment = RequestPayroll::select()->where('id_shipping', $args['id'])
        ->where('id_type', 2)->execute();
        if(count($payment) == 0){
            $payment = null;
        }

        $shipping = Shipping::select()->where('id_shipping', $args['id'])->execute();
        if(count($shipping) == 0){
            $shipping = null;
        }else{
            $payment[0]['name_shipping'] = $shipping[0]['name_shipping'];
        }
        $this->render('/request/payment/request_payment_vacation_edit',[
            'title_page' => 'Editar pedido padrão de férias',
            'payment' => $payment,
        ]);
    }

    public function paymentVacationEditAction($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/request/payment_vacation', ['error'=>'Precisamos de um ID']);
        }
        $cass_A = filter_input(INPUT_POST, 'qt_10');
        $cass_B = filter_input(INPUT_POST, 'qt_20');
        $cass_C = filter_input(INPUT_POST, 'qt_50');
        $cass_D = filter_input(INPUT_POST, 'qt_100');

        $values  = [
            '10'=>$cass_A,
            '20'=>$cass_B,
            '50'=>$cass_C,
            '100'=>$cass_D
        ];
        $balance = Request::gerateValueTotal($values);

        RequestPayroll::update()->set('cass_A', $cass_A)
        ->set('cass_B', $cass_B)->set('cass_C', $cass_C)
        ->set('cass_D', $cass_D)->set('balance', $balance)
        ->where('id_shipping', $args['id'])->where('id_type', 2)->execute();

        $this->redirect('/request/payment_vacation', ['success'=>'Editado']);
    }

    public function launch($args){
        $this->render('/request/functions/request_launch_view',[
            'title_page' => 'Pedido #',
            'requests' => $args['ids']
        ]);
    }

    public function launchAction(){

        $elements_checked = filter_input(INPUT_POST, 'checados');

        if($elements_checked !== ""){
            $elements_checked = explode(',', $elements_checked);
            foreach($elements_checked as $key =>  $check){
                $req = Request::select()->where('id', $check)->execute();
                $operation = OperationType::select()
                ->where('id', $req[0]['id_operation_type'])->execute();
                $shOrigin = Shipping::select()
                ->where('id_shipping', $req[0]['id_origin'])->execute();
                if(count($shOrigin) > 0){
                    $companyOrigin = Gmcore::select()->where('id_gmcore', $shOrigin[0]['id_gmcore'])->execute();
                }else{
                    $companyOrigin = null;
                }
                $shDestiny = Shipping::select()
                ->where('id_shipping', $req[0]['id_destiny'])->execute();
                if(count($shDestiny) > 0){
                    $companyDestiny = Gmcore::select()->where('id_gmcore', $shDestiny[0]['id_gmcore'])->execute();
                }else{
                    $companyDestiny = null;
                }
                $requests[$key]['id_request'] = $req[0]['id'];
                $requests[$key]['date_request'] = $req[0]['date_request'];
                $requests[$key]['value_request'] = $req[0]['value_total'];
                $requests[$key]['note_request'] = $req[0]['note'];
                $requests[$key]['name_operation'] = (count($operation) == 0) ? null : $operation[0]['name'];
                $requests[$key]['shipping_origin'] = (count($shOrigin) == 0) ? null : $shOrigin[0]['name_shipping'];
                $requests[$key]['account_origin'] = (count($shOrigin) == 0) ? null : $shOrigin[0]['account'];
                $requests[$key]['region_origin'] = (count($shOrigin) == 0) ? null : $shOrigin[0]['id_region'];
                $requests[$key]['gmcore_origin'] = (!isset($companyOrigin) && $companyOrigin == null) ? '0' : $companyOrigin[0]['id_company'];
                $requests[$key]['shipping_destiny'] = (count($shDestiny) == 0) ? null : $shDestiny[0]['name_shipping'];
                $requests[$key]['account_destiny'] = (count($shDestiny) == 0) ? null : $shDestiny[0]['account'];
                $requests[$key]['region_destiny'] = (count($shDestiny) == 0) ? null : $shDestiny[0]['id_region'];
                $requests[$key]['gmcore_destiny'] = (!isset($companyDestiny) && $companyDestiny == null) ? '0' : $companyDestiny[0]['id_company'];
            }
           // print_r($requests);die();

            $anoAtual = date('Y');
            $mesAtual = date('m');
            $caminho = $_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/';
            $path = $caminho.'/'.$anoAtual;

            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }
            $path = $path.'/'.$mesAtual;
            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }

            $mateusAndPosterus = array_filter($requests, function($item){
               if($item['name_operation'] == 'Retirada loja' || 
               $item['name_operation'] == 'Transferencia entre custodia'){
                    return $item;
               }
            });

            $mateus = array_filter($mateusAndPosterus, function($item){
                if($item['gmcore_origin'] == 0 || $item['gmcore_origin'] == 2){
                    return $item;
                }
            });

            $posterus = array_filter($mateusAndPosterus, function($item){
                if($item['gmcore_origin'] == 15){
                    return $item;
                }
            });

            $entreTesouraria = array_filter($requests, function($item){
                if($item['name_operation'] == 'Entre tesourarias'){
                    return $item;
                }
            });

            $banco = array_filter($requests, function($item){
                if($item['name_operation'] == 'Santander' || $item['name_operation'] == 'Seret BB'){
                    return $item;
                }
            });
                 
            $options = new Options();
            $integrity = RequestPdf::generateIntegrity();
            if(count($mateus) > 0){
                $dompdfMateus = new Dompdf($options);
                $keys = array_keys($mateus);
                $dt = $mateus[$keys[0]]['date_request'];
                $name = 'pedido-'.date('d-m-Y', strtotime($dt)).'-mateus.pdf';

              //  echo  $_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/'.$name;die();
                $html = generateHTML::generate('mateus', $mateus);
                $dompdfMateus->loadHtml($html);
                $dompdfMateus->setPaper('A4', 'landscape');
                $dompdfMateus->render();
               // $dompdf->stream($name);
              //  header('Content-type: application/pdf');
               //  echo $dompdf->output();
          //     file_put_contents($_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/'.$name, $dompdfMateus->output());
               file_put_contents($path.'/'.$name, $dompdfMateus->output());
               
               $reqInt = RequestPdf::select()->where('date', $dt)
               ->where('name_company', 'mateus')->execute(); 
               if(count($reqInt) == 0){
                    RequestPdf::insert([
                        'name_company'=>'mateus',
                        'name'=>$name,
                        'date'=>$dt,
                        'integrity'=>$integrity,
                        'status'=>'Y'
                    ])->execute();
                }else{
                    RequestPdf::update()->set('integrity', $integrity)
                    ->where('date', $dt)->where('name_company', 'mateus')->execute();
                }
            }
            if(count($posterus) > 0){
                $dompdfPosterus = new Dompdf($options);
                $keys = array_keys($posterus);
                $dt = $posterus[$keys[0]]['date_request'];

                $name = 'pedido-'.date('d-m-Y', strtotime($dt)).'-posterus.pdf';
                $html = generateHTML::generate('posterus', $posterus);
                $dompdfPosterus->loadHtml($html);
                $dompdfPosterus->setPaper('A4', 'landscape');
                $dompdfPosterus->render();
               // $dompdf->stream($name);
              //  header('Content-type: application/pdf');
               //  echo $dompdf->output();
             //  file_put_contents($_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/'.$name, $dompdfPosterus->output());
               file_put_contents($path.'/'.$name, $dompdfPosterus->output());
               $reqInt = RequestPdf::select()->where('date', $dt)
               ->where('name_company', 'posterus')->execute(); 
               if(count($reqInt) == 0){
                    RequestPdf::insert([
                        'name_company'=>'posterus',
                        'name'=>$name,
                        'date'=>$dt,
                        'integrity'=>$integrity,
                        'status'=>'Y'
                    ])->execute();
                }else{
                    RequestPdf::update()->set('integrity', $integrity)
                    ->where('date', $dt)->where('name_company', 'posterus')->execute();
                }
            }

            if(count($entreTesouraria) > 0){

                $dompdfEntreTeourarias = new Dompdf($options);
                $keys = array_keys($entreTesouraria);
                $dt = $entreTesouraria[$keys[0]]['date_request'];

                $name = 'entre-tesourarias-'.date('d-m-Y', strtotime($dt)).'.pdf';
                $html = generateHTML::generate('entre tesourarias', $entreTesouraria);
                $dompdfEntreTeourarias->loadHtml($html);
                $dompdfEntreTeourarias->setPaper('A4', 'landscape');
                $dompdfEntreTeourarias->render();
               // $dompdf->stream($name);
              //  header('Content-type: application/pdf');
               //  echo $dompdf->output();
            //   file_put_contents($_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/'.$name, $dompdfEntreTeourarias->output());
               file_put_contents($path.'/'.$name, $dompdfEntreTeourarias->output());
               $reqInt = RequestPdf::select()->where('date', $dt)
               ->where('name_company', 'entre-tesourarias')->execute(); 
               if(count($reqInt) == 0){
                    RequestPdf::insert([
                        'name_company'=>'entre-tesourarias',
                        'name'=>$name,
                        'date'=>$dt,
                        'integrity'=>$integrity,
                        'status'=>'Y'
                    ])->execute();
                }else{
                    RequestPdf::update()->set('integrity', $integrity)
                    ->where('date', $dt)->where('name_company', 'entre-tesourarias')->execute();
                }
            }

            if(count($banco) > 0){
                $dompdfBanco = new Dompdf($options);
                $keys = array_keys($banco);
                $dt = $banco[$keys[0]]['date_request'];

                $name = 'banco-'.date('d-m-Y', strtotime($dt)).'.pdf';
                $html = generateHTML::generate('banco', $banco);
                $dompdfBanco->loadHtml($html);
                $dompdfBanco->setPaper('A4', 'landscape');
                $dompdfBanco->render();
               // $dompdf->stream($name);
              //  header('Content-type: application/pdf');
               //  echo $dompdf->output();
             //  file_put_contents($_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/'.$name, $dompdfBanco->output());
               file_put_contents($path.'/'.$name, $dompdfBanco->output());
               $reqInt = RequestPdf::select()->where('date', $dt)
               ->where('name_company', 'banco')->execute(); 
               if(count($reqInt) == 0){
                    RequestPdf::insert([
                        'name_company'=>'banco',
                        'name'=>$name,
                        'date'=>$dt,
                        'integrity'=>$integrity,
                        'status'=>'Y'
                    ])->execute();
                }else{
                    RequestPdf::update()->set('integrity', $integrity)
                    ->where('date', $dt)->where('name_company', 'banco')->execute();
                }
            }
            
            echo json_encode(['integrity'=>$integrity]);
            die();

        } 
    }

    public function viewPDF($args){
        if(!isset($args['integrity']) && $args['integrity'] == ''){
            $this->redirect('/request/search', ['error'=>'Precisamos de uma integridade para continuar!']);
        }
        $integrity = str_replace('-', '.', $args['integrity']);
        $pdfs = RequestPdf::select()->where('integrity', $integrity)->execute();
        if(count($pdfs) == 0){
            $pdfs = null;
        }

        $this->render('/request/pdf/request_pdf_view',[
            'title_page' => 'PDFs',
            'pdfs' => $pdfs,
            'integrity' => $integrity
        ]);
    }

    public function downloadAllPDF($args){
       // print_r($args);die();
        if(!isset($args['integrity']) && $args['integrity'] == ''){
            $this->redirect('/request/search', ['error'=>'Precisamos de uma integridade para continuar!']);
        }
        $integrity = str_replace('-', '.', $args['integrity']);
        $pdfs = RequestPdf::select()->where('integrity', $integrity)->execute();
        if(count($pdfs) == 0){
            $pdfs = null;
        }else{
            
            $archives = [];
            $caminho = $_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/';
            foreach($pdfs as $pdf){
                $stringName = explode('-', $pdf['name']);
                switch($pdf['name_company']){
                    case 'mateus':
                    case 'mateus_pg':
                    case 'posterus':
                    case 'posterus_pg':
                        $mesAtual = $stringName[2];
                        $anoAtual = $stringName[3];
                    break;
                    case 'entre-tesourarias':
                        $mesAtual = $stringName[3];
                        $anoAtual = $stringName[4];
                    break;
                }
                
                $path = $caminho.$anoAtual.'/'.$mesAtual;
                array_push($archives, $path.'/'.$pdf['name']);
            }
           // print_r($archives);die();
            $zipname = 'pedidos-'.date('d-m-Y', strtotime($pdfs[0]['date'])).'.zip';
            $zip = new ZipArchive;
            $zip->open($zipname, ZipArchive::CREATE | ZipArchive::OVERWRITE);
            foreach($archives  as $key => $archive){
                $zip->addFile($archive, $pdfs[$key]['name']);
            }
            $zip->close();
            header('Content-Type: application/zip');
            header('Content-disposition: attachment; filename='.$zipname);
            header('Content-Length: ' . filesize($zipname));
            readfile($zipname);

            unlink($zipname);
            $this->render('/request/pdf/request_pdf_view',[
                'title_page' => 'PDFs',
                'pdfs' => $pdfs,
                'integrity' => $args['integrity']
            ]);
        }
    }

    public function downloadOnePDF($args){
      //  print_r($args);die();
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/request/search', ['error'=>'Precisamos de uma integridade para continuar!']);
        }

        $anoAtual = date('Y');
        $mesAtual = date('m');
        $caminho = $_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/';
        $path = $caminho.'/'.$anoAtual;

        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
        $path = $path.'/'.$mesAtual;
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        $pdf= RequestPdf::select()->where('id', $args['id'])->execute();
        if(count($pdf) > 0){
            
            if(!empty($path.'/'.$pdf[0]['name']) && file_exists($path.'/'.$pdf[0]['name'])){
                header("Content-Type: application/pdf");
                header("Content-Disposition: attachment; filename={$pdf[0]['name']}");
                readfile($path.'/'.$pdf[0]['name']);
            }

            $pdfs = RequestPdf::select()->where('integrity', $pdf[0]['integrity'])->execute();
            if(count($pdfs) == 0){
                $pdfs = null;
            }
            $this->render('/request/pdf/request_pdf_view',[
                'title_page' => 'PDFs',
                'pdfs' => $pdfs,
                'integrity' => $pdf[0]['integrity']
            ]);
        }
    }

    public function report($args){

        if(!isset($args['ids']) && $args['ids'] == ''){
            $this->redirect('/request/search', ['error'=>'Precisamos de uma integridade para continuar!']);
        }
        
        $elements_checked = $args['ids'];
        $reports = [];
        if($elements_checked !== ""){
            $elements_checked = explode('-', $elements_checked);
            foreach($elements_checked as $key =>  $check){
                $report = Request::select()->where('id', $check)->execute();
                array_push($reports, $report[0]);
            }

            foreach($reports as $key => $report){
                $shOrigin = Shipping::select()
                ->where('id_shipping', $report['id_origin'])->execute();
                $shDestiny = Shipping::select()
                ->where('id_shipping', $report['id_destiny'])->execute();
                $reports[$key]['name_shipping_origin'] = (count($shOrigin) == 0)?null:$shOrigin[0]['name_shipping'];
                $reports[$key]['name_shipping_destiny'] = (count($shDestiny) == 0)?null:$shDestiny[0]['name_shipping'];
            }

            Request::generateExcel($reports);
        }
        if(file_exists($_SERVER["DOCUMENT_ROOT"].'/crednosso/excel/transferencias.xlsx')){
            $excel = $_SERVER["DOCUMENT_ROOT"].'/crednosso/excel/transferencias.xlsx';
        }else{
            $excel = false;
        }
        $this->render('/request/pdf/request_excel_view',[
            'title_page' => 'Arquivo de transferencia',
            'excel' => $excel
        ]);  
        
    }

    public function downloadExcel(){
        $caminho = $_SERVER["DOCUMENT_ROOT"].'/crednosso/excel/'; 
        if(!empty($caminho.'transferencias.xlsx') && file_exists($caminho.'transferencias.xlsx')){
            header("Content-Type: application/octet-stream");
            header("Content-Disposition: attachment; filename=transferencias.xlsx");
            header('Pragma: no-cache');
            readfile($caminho.'transferencias.xlsx');
        }

        if(file_exists($_SERVER["DOCUMENT_ROOT"].'/crednosso/excel/transferencias.xlsx')){
            $excel = $_SERVER["DOCUMENT_ROOT"].'/crednosso/excel/transferencias.xlsx';
        }else{
            $excel = false;
        }
        $this->render('/request/pdf/request_excel_view',[
            'title_page' => 'Arquivo de transferencia',
            'excel' => $excel
        ]); 
    }

    public function generatePaymment($args){
        if(!isset($args['ids']) && $args['ids'] == ''){
            $this->redirect('/request/search', ['error'=>'Precisamos de uma integridade para continuar!']);
        }

        $elements_checked = $args['ids'];
        $paymments = [];
        if($elements_checked !== ""){
            $elements_checked = explode('-', $elements_checked);
            foreach($elements_checked as $key =>  $check){
                $pay = Request::select()->where('id', $check)->execute();
                $operation = OperationType::select()
                ->where('id', $pay[0]['id_operation_type'])->execute();
                $shOrigin = Shipping::select()
                ->where('id_shipping', $pay[0]['id_origin'])->execute();
                if(count($shOrigin) > 0){
                    $companyOrigin = Gmcore::select()->where('id_gmcore', $shOrigin[0]['id_gmcore'])->execute();
                }else{
                    $companyOrigin = null;
                }
                $shDestiny = Shipping::select()
                ->where('id_shipping', $pay[0]['id_destiny'])->execute();
                if(count($shDestiny) > 0){
                    $companyDestiny = Gmcore::select()->where('id_gmcore', $shDestiny[0]['id_gmcore'])->execute();
                }else{
                    $companyDestiny = null;
                }
            
                $paymments[$key]['id_request'] = $pay[0]['id'];
                $paymments[$key]['date_request'] = $pay[0]['date_request'];
                $paymments[$key]['value_request'] = $pay[0]['value_total'];
                $paymments[$key]['note_request'] = $pay[0]['note'];
                $paymments[$key]['confirmed_value'] = $pay[0]['confirmed_value'];
                $paymments[$key]['name_operation'] = (count($operation) == 0) ? null : $operation[0]['name'];
                $paymments[$key]['shipping_origin'] = (count($shOrigin) == 0) ? null : $shOrigin[0]['name_shipping'];
                $paymments[$key]['account_origin'] = (count($shOrigin) == 0) ? null : $shOrigin[0]['account'];
                $paymments[$key]['region_origin'] = (count($shOrigin) == 0) ? null : $shOrigin[0]['id_region'];
                $paymments[$key]['gmcore_origin'] = (!isset($companyOrigin) && $companyOrigin == null) ? '0' : $companyOrigin[0]['id_company'];
                $paymments[$key]['shipping_destiny'] = (count($shDestiny) == 0) ? null : $shDestiny[0]['name_shipping'];
                $paymments[$key]['account_destiny'] = (count($shDestiny) == 0) ? null : $shDestiny[0]['account'];
                $paymments[$key]['region_destiny'] = (count($shDestiny) == 0) ? null : $shDestiny[0]['id_region'];
                $paymments[$key]['gmcore_destiny'] = (!isset($companyDestiny) && $companyDestiny == null) ? '0' : $companyDestiny[0]['id_company'];
            }

            
            $anoAtual = date('Y');
            $mesAtual = date('m');
            $caminho = $_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/';
            $path = $caminho.'/'.$anoAtual;

            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }
            $path = $path.'/'.$mesAtual;
            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }
            $mateusAndPosterus = array_filter($paymments, function($item){
                if($item['name_operation'] == 'Retirada loja' || 
                $item['name_operation'] == 'Transferencia entre custodia'){
                     return $item;
                }
             });
             $mateus = array_filter($mateusAndPosterus, function($item){
                if($item['gmcore_origin'] == 0 || $item['gmcore_origin'] == 2){
                    return $item;
                }
            });

            $posterus = array_filter($mateusAndPosterus, function($item){
                if($item['gmcore_origin'] == 15){
                    return $item;
                }
            });

            $entreTesouraria = array_filter($paymments, function($item){
                if($item['name_operation'] == 'Entre tesourarias'){
                    return $item;
                }
            });

            $banco = array_filter($paymments, function($item){
                if($item['name_operation'] == 'Santander' || $item['name_operation'] == 'Seret BB'){
                    return $item;
                }
            });

            $options = new Options();
            $integrity = RequestPdf::generateIntegrity();
            if(count($mateus) > 0){
                $dompdfMateus = new Dompdf($options);
                $keys = array_keys($mateus);
                $dt = $mateus[$keys[0]]['date_request'];
                $name = 'pedido-'.date('d-m-Y', strtotime($dt)).'-mateus-a.pdf';

              //  echo  $_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/'.$name;die();
                $html = generateHTML::generate('pagamento mateus', $mateus);
                $dompdfMateus->loadHtml($html);
                $dompdfMateus->setPaper('A4', 'landscape');
                $dompdfMateus->render();
               // $dompdf->stream($name);
              //  header('Content-type: application/pdf');
               //  echo $dompdf->output();
               file_put_contents($path.'/'.$name, $dompdfMateus->output());
               
               $reqInt = RequestPdf::select()->where('date', $dt)
               ->where('name_company', 'mateus_pg')->execute(); 
               if(count($reqInt) == 0){
                    RequestPdf::insert([
                        'name_company'=>'mateus_pg',
                        'name'=>$name,
                        'date'=>$dt,
                        'integrity'=>$integrity,
                        'status'=>'Y'
                    ])->execute();
                }else{
                    RequestPdf::update()->set('integrity', $integrity)
                    ->where('date', $dt)->where('name_company', 'mateus_pg')->execute();
                }

                Request::generateExcelAcerto($mateus, 'mateus');


            }

            if(count($posterus) > 0){
                $dompdfPosterus = new Dompdf($options);
                $keys = array_keys($posterus);
                $dt = $posterus[$keys[0]]['date_request'];

                $name = 'pedido-'.date('d-m-Y', strtotime($dt)).'-posterus-a.pdf';
                $html = generateHTML::generate('pagamento posterus', $posterus);
                $dompdfPosterus->loadHtml($html);
                $dompdfPosterus->setPaper('A4', 'landscape');
                $dompdfPosterus->render();
               // $dompdf->stream($name);
              //  header('Content-type: application/pdf');
               //  echo $dompdf->output();
             //  file_put_contents($_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/'.$name, $dompdfPosterus->output());
               file_put_contents($path.'/'.$name, $dompdfPosterus->output());
               $reqInt = RequestPdf::select()->where('date', $dt)
               ->where('name_company', 'posterus_pg')->execute(); 
               if(count($reqInt) == 0){
                    RequestPdf::insert([
                        'name_company'=>'posterus_pg',
                        'name'=>$name,
                        'date'=>$dt,
                        'integrity'=>$integrity,
                        'status'=>'Y'
                    ])->execute();
                }else{
                    RequestPdf::update()->set('integrity', $integrity)
                    ->where('date', $dt)->where('name_company', 'posterus_pg')->execute();
                }

                Request::generateExcelAcerto($mateus, 'posterus');
            }

           
            $pdfs = RequestPdf::select()->where('integrity', $integrity)->execute();
            $this->render('/request/pdf/request_pdf_view',[
                'title_page' => 'PDFs',
                'pdfs' => $pdfs,
                'integrity' => $pdfs[0]['integrity']
            ]);
        }
        
    } 

    public function downloadOnePaymment($args){
      //  print_r($args);die();
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/request/search', ['error'=>'Precisamos de uma integridade para continuar!']);
        }
        $pdf = RequestPdf::select()->where('id', $args['id'])->execute();
        if(count($pdf) > 0){
            $stringName = explode('-', $pdf[0]['name']);
            switch($pdf[0]['name_company']){
                case 'mateus':
                case 'mateus_pg':
                case 'posterus':
                case 'posterus_pg':
                    $mesAtual = $stringName[2];
                    $anoAtual = $stringName[3];
                break;
                case 'entre-tesourarias':
                    $mesAtual = $stringName[3];
                    $anoAtual = $stringName[4];
                break;
            }

            $caminho = $_SERVER["DOCUMENT_ROOT"].'/crednosso/pdfs/';
            $path = $caminho.'/'.$anoAtual.'/'.$mesAtual;

            if(!empty($path.'/'.$pdf[0]['name']) && file_exists($path.'/'.$pdf[0]['name'])){
                header("Content-Type: application/pdf");
                header("Content-Disposition: attachment; filename={$pdf[0]['name']}");
                readfile($path.'/'.$pdf[0]['name']);
            }
            $pdfs = RequestPdf::select()->where('integrity', $pdf[0]['integrity'])->execute();
            $this->render('/request/pdf/request_pdf_view',[
                'title_page' => 'PDFs',
                'pdfs' => $pdfs,
                'integrity' => $pdf[0]['integrity']
            ]);
            
        }

    }


}