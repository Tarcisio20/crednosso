<?php $render('header'); ?>
<div>
    <h1 class="title-pages"><?php echo $title_page; ?> # <?php echo $shipping[0]['name_shipping']; ?></h1>
    <input type="hidden" value="<?php echo $shipping[0]['id_shipping']; ?>" id="id_shipping" />
    <div class="mb-3">
        <label class="form-label subtitle-pages">CUSTODIA</label>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 10,00</label>
                <input class="form-control values-input" type="number" readonly disabled value="<?php echo $treasury[0]['a_10']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" readonly disabled value="<?php echo number_format($treasury[0]['a_10']*10, 2, ',','.');  ?>" />
            </div>
        </div>
         <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 20,00</label>
                <input class="form-control values-input" type="number" readonly disabled value="<?php echo $treasury[0]['b_20']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" readonly disabled value="<?php echo number_format($treasury[0]['b_20']*20, 2, ',','.');  ?>" />
            </div>
        </div>
         <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 50,00</label>
                <input class="form-control values-input" type="number" readonly disabled value="<?php echo $treasury[0]['c_50']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" readonly disabled value="<?php echo  number_format($treasury[0]['c_50']*50, 2, ',','.');  ?>" />
            </div>
        </div>
         <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 100,00</label>
                <input class="form-control values-input" type="number" readonly disabled value="<?php echo $treasury[0]['d_100']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" readonly disabled value="<?php echo number_format($treasury[0]['d_100']*100, 2, ',','.');  ?>" />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">TOTAL</label>
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text"  readonly disabled
                value="<?php echo number_format((($treasury[0]['a_10']*10)+($treasury[0]['b_20']*20)+($treasury[0]['c_50']*50)+($treasury[0]['d_100']*100)),2,',','.') ?>"
                />
            </div>
        </div>
    </div>
    <form method="POST" action="<?php echo $base; ?>/supplie/view/<?php echo $shipping[0]['id_shipping']; ?>" >
        <div class="mb-3"> 
            <input class="form-control" type="hidden" readonly disabled name="integrity" id="integrity" 
                value="<?php (isset($supplies) && $supplies !== null) ? $supplies[0]['integrity'] : ''; ?>"
            />
            <label class="form-label">TERMINAIS</label>
            <div class="container-for-values">
                <input class="form-control rotule-for-input" type="number" attr-value="atm" onchange="getShippingById(this)" />
                <select class="form-select" name="id_atm" id="id_atm"  >
                    <?php foreach($atms as $atm): ?>
                        <option value="<?php echo $atm['id_atm']; ?>">
                            <?php echo $atm['id_atm']." - ".$atm['shortened_name_atm']; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">DATA ABASTECIMENTO</label>
            <input class="form-control" type="date" name="date_supplie" id="date_supplie" value="<?php $date = new DateTime(); echo $date->format('Y-m-d'); ?>" />
        </div>
        <div class="mb-3">
            <div class="mb-3">
                <div class="container-for-values">
                    <label class="form-label rotule-values">R$ 10,00</label>
                    <input class="form-control values-input" type="number" attr-value="10" name="qt_10" id="qt_10"  onchange="generateValue(this)"/>
                    <label class="form-label rotule-values">R$</label>
                    <input class="form-control values-input" type="text" readonly disabled name="qt_text_10" id="qt_text_10" class="input_text" placeholder="0,00" />
                </div>
            </div>
            <div class="mb-3">
                <div class="container-for-values">
                    <label class="form-label rotule-values">R$ 20,00</label>
                    <input class="form-control values-input" type="number" attr-value="20" name="qt_20" id="qt_20" onchange="generateValue(this)" />
                    <label class="form-label rotule-values">R$</label>
                    <input class="form-control values-input" type="text" readonly disabled name="qt_text_20" id="qt_text_20" class="input_text" placeholder="0,00" />
                </div>
            </div>
            <div class="mb-3">
                <div class="container-for-values">
                    <label class="form-label rotule-values">R$ 50,00</label>
                    <input class="form-control values-input" type="number" attr-value="50" name="qt_50" id="qt_50" onchange="generateValue(this)" />
                    <label class="form-label rotule-values">R$</label>
                    <input class="form-control values-input" type="text" readonly disabled name="qt_text_50" id="qt_text_50" class="input_text" placeholder="0,00" />
                </div>
            </div>
            <div class="mb-3">
                <div class="container-for-values">
                    <label class="form-label rotule-values">R$ 100,00</label>
                    <input class="form-control values-input" type="number" attr-value="100" name="qt_100" id="qt_100" onchange="generateValue(this)" />
                    <label class="form-label rotule-values">R$</label>
                    <input class="form-control values-input" type="text" readonly disabled name="qt_text_100" id="qt_text_100" class="input_text" placeholder="0,00" />
                </div>                    
            </div>
            <div class="mb-3">
                <div class="container-for-values">
                    <label class="form-label rotule-values">TOTAL</label>
                    <label class="form-label rotule-values">R$</label>
                    <input class="form-control values-input" type="text" readonly disabled name="value_total" id="value_total" placeholder="0,00" />
                </div>
            </div>
            <div class="mb-3 box-buttons">
                <button class="btn btn-primary">
                    <i class="fa-solid fa-brazilian-real-sign f-s-b-20"></i> Abastecer
                </button>
                <?php if(($treasury[0]['balance'] % 2 == 0) && count($atms) % 2 == 0 || count($atms) == 1 ): ?>
                    <a class="btn btn-warning" href="#" onclick="devideInAtms('<?php echo $base; ?>')" >
                        <i class="fa-solid fa-divide f-s-b-20"></i> Dividir por terminais
                    </a>
                <?php endif; ?>
                <a class="btn btn-info" href="<?php echo $base; ?>/supplie">
                    <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
                </a>
                <!--<a href="#" onclick="saveSupplie()" >[SALVAR]</a> -->
            </div>
        </div>
    </form>
    <div>
        <?php if(isset($supplies) && $supplies !== null): ?>
            <div id="msg"></div>
            <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr class="align-bottom">
                        <td scope="col">#</td>
                        <td scope="col">ID</td>
                        <td scope="col">ATM</td>
                        <td scope="col">DATA</td>
                        <td scope="col">CASS A</td>
                        <td scope="col">CASS B</td>
                        <td scope="col">CASS C</td>
                        <td scope="col">CASS D</td>
                        <td scope="col">TOTAL</td>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <?php foreach($supplies as $key => $supplie): ?>
                        <tr>
                            <td><input type="checkbox" name="setados[]" value="<?php echo $supplie['id']; ?>" /></td>
                            <td><?php echo $supplie['id_atm']; ?></td>
                            <td><?php echo $supplie['name_atm']; ?></td>
                            <td><?php echo date('d/m/Y', strtotime($supplie['date_supplie'])); ?></td>
                            <td><?php echo $supplie['a_10']; ?></td>
                            <td><?php echo $supplie['b_20']; ?></td>
                            <td><?php echo $supplie['c_50']; ?></td>
                            <td><?php echo $supplie['d_100']; ?></td>
                            <td><?php echo 'R$ '.number_format($supplie['value_supplie'], 2, ',', '.'); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <div class="mb-3 box-buttons">
                <a class="btn btn-danger" href="#" onclick="cancelSupplieSelecteds('<?php echo $base; ?>')">
                    <i class="fa-solid fa-ban f-s-b-20"></i>
                    Cancelar
                </a>
                <a class="btn btn-success" onclick="generateSupplie('<?php echo $base; ?>')">
                    <i class="fa-solid fa-boxes-packing fa-ban f-s-b-20"></i>
                    Abastecer
                </a>
                <a class="btn btn-warning" onclick="goScreenOSs('<?php echo $base; ?>')">
                    <i class="fa-solid fa-desktop f-s-b-20"></i>
                    Tela de OS para envio
                </a>
            </div>
        <?php endif; ?>
    </div>
</div>

<div id="modalError" class="modalError" >
    <div class="mb-3">
        <a title="Fechar" class="fechar" attr-name="modalError" attr-name="modal" onclick="closeModal(this)">x</a>
        <div class="box-for-messege">
            <label class="form-label subtitle-pages">Erro</label>
            <span class="badge badge-pill bg-danger">
                <i class="fa-solid fa-circle-exclamation f-s-b-20 item-messege"></i>
            </span>
            <p class="text-messege">Precisamos que seja selecionado algum item para proseguir!</p>
        </div>
    </div>
</div>

<?php $render('footer'); ?>