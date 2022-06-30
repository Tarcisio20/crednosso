<?php
namespace src\models;
use \core\Model;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class Request extends Model {

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

    public static function generateValuesPartials($values){
        $arrayAux = ['10', '20', '50', '100'];
        foreach($values as $key => $value){
            $v = explode('=', $value);
            $arrayReturn[$arrayAux[$key]] = $v[1];
        }
        return $arrayReturn;
    }

    public static function verifyIfNegative($valueRequest, $valueTreasury){
        foreach($valueRequest as $key => $value){
            if($valueRequest[$key] > $valueTreasury[$key]){
               return false;
            }
        }
        return true;
    }

    public static function generateExcel($array){ 
        $line = 1;
        $types = [
            0 => null,
            1 => 'Transferencia entre custodias do mateus supermercados',
            2 => 'Retirada de loja',
            3 => 'Entre tesourarias',
            4 => 'Santander da ',
            5 => 'Seret BB da '
        ];
        $caminho = $_SERVER["DOCUMENT_ROOT"].'/crednosso/excel/';
        $date = $array[0]['date_request'];
        
        if(file_exists($caminho.'/transferencias.xlsx')){
            $spreadsheet = IOFactory::load($caminho.'/transferencias.xlsx');
        }else{
            $spreadsheet = new Spreadsheet();
        }
        $nameWorksheet = date('d-m-Y', strtotime($date));
        $myWorkSheet = new \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet($spreadsheet, $nameWorksheet);
        $sheet =  $spreadsheet->addSheet($myWorkSheet, 0);
        // $sheet = $spreadsheet->getActiveSheet();

        $stylesCabecalho = [
            'font' => [
                'bold' => true,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                'startColor' => [
                    'argb' => 'FFFF00',
                ],
                'endColor' => [
                    'argb' => 'FFFF00',
                ],
            ]
        ];

        $stylesBorder = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM,
                    'color' => ['argb' => '000000'],
                ],
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ]
        ];

        foreach($array as $key => $a){
            switch($a['id_operation_type']){
                case 1:
                    $text = $types[1].' / '.$a['name_shipping_destiny'].' - '.date('d/m/Y', strtotime($a['date_request']));
                break;
                case 2:
                    $text = $types[2].' / '.$a['name_shipping_origin'];
                break;
                case 3:
                    $text = $types[3].' '.$a['name_shipping_origin'].' / '.$a['name_shipping_destiny'];
                break;
                case 4:
                    $text = $types[4].' '.$a['name_shipping_origin'];    
                break;
                case 5:
                    $text = $types[5].' '.$a['name_shipping_origin'];
                break;
            }
            $total = ($a['qt_10'] * 10)+($a['qt_20'] * 20)+($a['qt_50'] * 50)+($a['qt_100'] * 100);
            $cells = [
                ['N° '.$a['id_batch'],strtoupper($text)],
                ['CEDULA','QTD','VALOR'],
                ['10',$a['qt_10'], 'R$ '.number_format(($a['qt_10']* 10), 2, ',', '.')],
                ['20',$a['qt_20'], 'R$ '.number_format(($a['qt_20']* 20), 2, ',', '.')],
                ['50',$a['qt_50'], 'R$ '.number_format(($a['qt_50']* 50), 2, ',', '.')],
                ['100',$a['qt_100'], 'R$ '.number_format(($a['qt_100']* 100), 2, ',', '.')],
                [null, 'TOTAL', 'R$ '.number_format($total, 2, ',','.')]
            ];
            $totalLines = count($cells);
           // echo $totalLines;die();
            $sheet->fromArray($cells, null, 'A'.$line);
            $sheet->getStyle('A'.$line.':C'.$line)->applyFromArray($stylesCabecalho);
            $sheet->getStyle('A'.($line+1).':C'.$line+1)->applyFromArray($stylesCabecalho);
            $sheet->getStyle('A'.$line.':C'.$line+6)->applyFromArray($stylesBorder);
            $sheet->mergeCells('B'.$line.':C'.$line);
            
            $line = $line + $totalLines + 1;
        }
        // Worksheet
       /* $sheetIndex = $spreadsheet->getIndex(
            $spreadsheet->getSheetByName('Worksheet')
        );
        $spreadsheet->removeSheetByIndex($sheetIndex);*/
        $writer = new Xlsx($spreadsheet);
        $writer->save($caminho.'/transferencias.xlsx');
    }

    public static function generateExcelAcerto($array, $type = null){

        $line = 0;
        $date = $array[0]['date_request'];

        $anoAtual = date('Y');
        $mesAtual = date('m');
        $caminho = $_SERVER["DOCUMENT_ROOT"].'/crednosso/excel/';
        $path = $caminho.'/'.$anoAtual;

        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
        $path = $path.'/'.$mesAtual;
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        $name = 'LANCAMENTO - ACERTO - '.date('d-m-Y', strtotime($date)).'.xlsx';
        if(file_exists($path.'/'.$name)){
            $spreadsheet = IOFactory::load($path.'/'.$name);
        }else{
            $spreadsheet = new Spreadsheet();
        }

        $nameWorksheet = $type.'-'.date('d-m-Y', strtotime($date));
        $myWorkSheet = new \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet($spreadsheet, $nameWorksheet);
        $sheet =  $spreadsheet->addSheet($myWorkSheet, 0);

        $stylesCabecalho = [
            'font' => [
                'bold' => true,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                'startColor' => [
                    'argb' => '005EFF',
                ],
                'endColor' => [
                    'argb' => '005EFF',
                ],
            ]
        ];

        $stylesBorder = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM,
                    'color' => ['argb' => '000000'],
                ],
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ]
        ];

        $stylesLinePar = [
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                'startColor' => [
                    'argb' => '409DFF',
                ],
                'endColor' => [
                    'argb' => '409DFF',
                ],
            ]
        ];

        

        $cells = [
            [null, null,'SOLICITADO','TRANSFERIR BANCO', null, null],
            ['CODIGO', 'TESOURARIA', 'REGIÃO', 'VALOR', 'VALOR REALIZADO', 'ESTORNO', 'OBSERVAÇÃO']
        ];
        $valor = 0;
        $valorRealizado = 0;
        $valorEstorno = 0;
        foreach($array as $key => $value){
            $estorno = $value['value_request'] - $value['confirmed_value'];
            $valor += $value['value_request'];
            $valorRealizado += $value['confirmed_value'];
            $valorEstorno += $estorno;

            array_push($cells, [$value['id_request'], 'TESOURARIA-'.$value['shipping_origin'],$value['region_origin'],
            'R$ '.number_format($value['value_request'],2,',','.'), 'R$ '.number_format($value['confirmed_value'],2,',','.'),
            'R$ '.number_format($estorno, 2, ',', '.'),$value['note_request']]);
        }
        array_push($cells, [null, 'TOTAL REALIZADO', null, 'R$ '.number_format($valor, 2,',','.'),
        'R$ '.number_format($valorRealizado,2,',','.'), 'R$ '.number_format($valorEstorno, 2,',','.'), null]);
        
        $totalLines = count($cells);
       // $range = 'A1:G'.$totalLines;
       // $conditionalStyles = [];
       // $wizardFactory = new \PhpOffice\PhpSpreadsheet\Style\ConditionalFormatting\Wizard($range);
       // $expressionWizard = $wizardFactory->newRule(\PhpOffice\PhpSpreadsheet\Style\ConditionalFormatting\Wizard::EXPRESSION);

      //  $expressionWizard->expression('PAR(LIN())=LIN()')->setStyle($stylesLinePar);

      //  $conditionalStyles[] = $expressionWizard->getConditional();

        $sheet->fromArray($cells, null, 'A1');
        $sheet->getStyle('A1:G2')->applyFromArray($stylesCabecalho);
        $sheet->getStyle('A1:G'.$totalLines)->applyFromArray($stylesBorder);
       // $sheet->getStyle($expressionWizard->getCellRange())->setConditionalStyles($conditionalStyles);
        $writer = new Xlsx($spreadsheet);
        $writer->save($path.'/'.$name);
    }
}