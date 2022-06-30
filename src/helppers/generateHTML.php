<?php
namespace src\helppers;

class generateHTML  {

    public static function generate($name, $array){
        $keys = array_keys($array);
 
        $html = '<!DOCTYPE html>';
        $html .= '<html lang="pt-BR">';
        $html .= '<head><meta charset="UTF-8">';
        $html .= '<style type="text/css">';
        $html .= '#internal{display: flex;flex-direction: row;align-items: center;justify-content: space-between;}';
        $html .= '#cabecalho{background-color:#00BFFF; padding:10px;border-width:2px;border-style:solid;border-color:#dddddd;}';
        $html .= '#nome-pedido{font-size:20px}';
        $html .= '#data-pedido{font-size:16px}';
        $html .= '#tabela{width:100%;border-width:1px;border-style:solid;border-color:#dddddd;border-collapse:collapse;margin:auto;}';
        $html .= 'thead tr td{border-width:1px;border-style:solid;border-color:#dddddd;}';
        $html .= 'tbody tr td{border-width:1px;border-style:solid;border-color:#dddddd;}';
        $html .= 'td{padding:5px 10px;text-align: center;}';
        $html .= '#tabela-titulo{background-color:#00BFFF;font-weight:bold;}';
        $html .= '#tabela-titulo-2{background-color:#00BFFF;font-weight:bold;}';
        $html .= '#ultima-linha{background-color:#CCCCCC;color:#000000;font-weight:bold;}';
        $html .= '</style>';
        $html .= '<title>PEDIDO #'.strtoupper($name).'</title>';
        $html .= '</head><body>';
        $html .= '<div class="Content" id="Content">';
        $html .= '<div id="cabecalho">';
        $html .= '<div id="internal">';
        $html .= '<h1 id="nome-pedido">PEDIDO '.strtoupper($name).'</h1>';
        $html .= '<div id="data-pedido" > DATA: '.date('d/m/Y', strtotime($array[$keys[0]]['date_request'])).'</div></div>';
        $html .= '</div>';
        $html .= '<div class="table-responsive">';
        $html .= '<table id="tabela" ><thead>';
        $html .= '<tr id="tabela-titulo">';

        switch($name){
            case 'mateus':
                $valueTotal = 0;
                $html .= '<td>CONTA</td><td>TESOURARIA</td><td>REGIÃO</td><td>VALOR</td><td>OBSERVAÇÃO</td></tr></thead><tbody id="corpo">';
                foreach($array as $a){
                    $valueTotal = $valueTotal + $a['value_request'];
                    $html .= '<tr><td>'.$a['account_origin'].'</td>';
                    $html .= '<td>'.$a['shipping_origin'].'</td>';
                    $html .= '<td>'.$a['region_origin'].'</td>';
                    $html .= '<td> R$ '.number_format($a['value_request'], 2, ',', '.').'</td>';
                    $html .= '<td>'.$a['note_request'].'</td></tr>';
                }
                $html .= '<tr id="ultima-linha" ><td></td><td>VALOR TOTAL</td><td></td><td> R$ '.number_format($valueTotal, 2, ',', '.').'</td><td></td></tr></tbody></table></div>';
                $html .= '</div></body></html>';
                return $html;
            break;
            case 'posterus':
                $valueTotal = 0;
                $html .= '<td>CONTA</td><td>TESOURARIA</td><td>REGIÃO</td><td>VALOR</td><td>OBSERVAÇÃO</td></tr></thead><tbody id="corpo">';
                foreach($array as $a){
                    $valueTotal = $valueTotal + $a['value_request'];
                    $html .= '<tr><td>'.$a['account_origin'].'</td>';
                    $html .= '<td>'.$a['shipping_origin'].'</td>';
                    $html .= '<td>'.$a['region_origin'].'</td>';
                    $html .= '<td>'.number_format($a['value_request'], 2, ',', '.').'</td>';
                    $html .= '<td>'.$a['note_request'].'</td></tr>';
                }
                $html .= '<tr id="ultima-linha"  ><td></td><td>VALOR TOTAL</td><td></td><td>'.number_format($valueTotal, 2, ',', '.').'</td><td></td></tr></tbody></table></div>';
                $html .= '</div></body></html>';
                return $html;
            break;
            case 'entre tesourarias':
                $valueTotal = 0;
                $html .= '<td></td><td>SAIDA</td><td>VALOR</td><td></td><td>ENTRADA</td></tr>';
                $html .= '<tr id="tabela-titulo-2"><td>CODIGO-SAIDA</td><td>TESOURARIA-SAIDA</td><td>VALOR TRANSFERIDO</td><td>CODIGO-ENTRADA</td><td>TESOURARIA-ENTRADA</td>';
                $html .= '</tr></thead>';
                foreach($array as $a){
                    $valueTotal = $valueTotal + $a['value_request'];
                    $html .= '<tr><td>'.$a['account_origin'].'</td>';
                    $html .= '<td>'.$a['shipping_origin'].'</td>';
                    $html .= '<td>'.number_format($a['value_request'], 2, ',', '.').'</td>';
                    $html .= '<td>'.$a['account_destiny'].'</td>';
                    $html .= '<td>'.$a['shipping_destiny'].'</td></tr>';
                }
                $html .= '</tbody></table></div>';
                $html .= '</div></body></html>';
                return $html;
            break;
            case 'banco':
                $valueTotal = 0;
                $html .= '<td>CONTA</td><td  >TESOURARIA</td><td>REGIÃO</td><td>VALOR</td><td>OBSERVAÇÃO</td></tr></thead><tbody id="corpo">';
                foreach($array as $a){
                    $valueTotal = $valueTotal + $a['value_request'];
                    $html .= '<tr><td>'.$a['account_origin'].'</td>'; 
                    $html .= '<td>'.$a['shipping_origin'].'</td>';
                    $html .= '<td></td>';
                    $html .= '<td>'.number_format($a['value_request'], 2, ',', '.').'</td>';
                    $html .= '<td>'.$a['note_request'].'</td></tr>';
                }
                $html .= '<tr id="ultima-linha" ><td></td><td>VALOR TOTAL</td><td></td><td>'.number_format($valueTotal, 2, ',', '.').'</td><td></td></tr></tbody></table></div>';
                $html .= '</div></body></html>';
                return $html;
            break;
            case 'pagamento mateus':
                $valueTotal = 0;
                $html .= '<td>CONTA</td><td  >TESOURARIA</td><td>REGIÃO</td><td>VALOR REALIZADO</td><td>OBSERVAÇÃO</td></tr></thead><tbody id="corpo">';
                foreach($array as $a){
                    $valueTotal = $valueTotal + $a['confirmed_value'];
                    $html .= '<tr><td>'.$a['account_origin'].'</td>'; 
                    $html .= '<td>'.$a['shipping_origin'].'</td>';
                    $html .= '<td></td>';
                    $html .= '<td>'.number_format($a['confirmed_value'], 2, ',', '.').'</td>';
                    $html .= '<td>'.$a['note_request'].'</td></tr>';
                }
                $html .= '<tr id="ultima-linha" ><td></td><td>VALOR TOTAL</td><td></td><td>'.number_format($valueTotal, 2, ',', '.').'</td><td></td></tr></tbody></table></div>';
                $html .= '</div></body></html>';
                return $html;
            break;
            case 'pagamento posterus':
                $valueTotal = 0;
                $html .= '<td>CONTA</td><td  >TESOURARIA</td><td>REGIÃO</td><td>VALOR REALIZADO</td><td>OBSERVAÇÃO</td></tr></thead><tbody id="corpo">';
                foreach($array as $a){
                    $valueTotal = $valueTotal + $a['confirmed_value'];
                    $html .= '<tr><td>'.$a['account_origin'].'</td>'; 
                    $html .= '<td>'.$a['shipping_origin'].'</td>';
                    $html .= '<td></td>';
                    $html .= '<td>'.number_format($a['confirmed_value'], 2, ',', '.').'</td>';
                    $html .= '<td>'.$a['note_request'].'</td></tr>';
                }
                $html .= '<tr id="ultima-linha" ><td></td><td>VALOR TOTAL</td><td></td><td>'.number_format($valueTotal, 2, ',', '.').'</td><td></td></tr></tbody></table></div>';
                $html .= '</div></body></html>';
                return $html;
            break;
        }
    }

}