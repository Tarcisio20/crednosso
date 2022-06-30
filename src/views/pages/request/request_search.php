<?php $render('header');  ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<form method="POST" action="<?php echo $base; ?>/request/search" >
    <div class="container-for-label-input">
        <div class="mb-3 for-label-input">
            <label class="form-label">DATA INICIAL</label>
            <input class="form-control" type="date" name="date_initial" id="date_initial" value="<?php echo $date_initial; ?>" /> 
        </div>
        <div class="mb-3 for-label-input">
            <label class="form-label">DATA FINAL</label>
            <input class="form-control" type="date" name="date_final" id="date_final" value="<?php echo $date_final; ?>" />
        </div>
    </div>
    <div class="mb-3 box-buttons">
        <button class="btn btn-warning" type="submit"id="pesquisar">
            <i class="fa-solid fa-magnifying-glass f-s-b-20"></i> Pesquisar
        </button> 
        <a class="btn btn-info" href="<?php echo $base; ?>/request">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
</form>
<div id="msg"></div>
<?php if(isset($requests) && $requests !== null): ?>
    <div class="mb-3 box-buttons d-f-a">
        <button class="btn btn-primary"  onclick="functionConfirmChek('<?php echo $base; ?>')" >
            <i class="fa-solid fa-check-double f-s-b-20"></i> Confirmar total
        </button>
        <button class="btn btn-primary" onclick="openModalConfirmParcial('<?php echo $base; ?>')" >
            <i class="fa-solid fa-check f-s-b-20"></i> Confirmar parcial
        </button>
        <button class="btn btn-primary" onclick="openModalRelaunch('<?php echo $base; ?>')" >
            <i class="fa-solid fa-calendar-day f-s-b-20"></i> Relançar
        </button>
        <button class="btn btn-primary" onclick="generateLaunch('<?php echo $base; ?>')" >
            <i class="fa-solid fa-rocket f-s-b-20"></i> Gerar lançamento
        </button>
        <button class="btn btn-primary" onclick="gerateReport('<?php echo $base; ?>')" >
            <i class="fa-solid fa-chart-line f-s-b-20"></i> Gerar relatório
        </button>
        <button class="btn btn-primary" onclick="generatePaymment('<?php echo $base; ?>')" >
            <i class="fa-solid fa-cash-register f-s-b-20"></i> Gerar pagamento
        </button>
        <button class="btn btn-primary" onclick="viewRequest('<?php echo $base; ?>')" >
            <i class="fa-solid fa-eye f-s-b-20"></i> Visualizar
        </button>
        <button class="btn btn-primary" onclick="" >
            <i class="fa-solid fa-envelope-open-text f-s-b-20"></i> Enviar E-mail
        </button>
    </div>
    <div class="mb-3">
        <input type="checkbox" onclick="selectAll(this)" name="checkAll" id="checkAll" />
        <label for="checkAll">Selecionar todos</label>
    </div>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
        <thead>
            <tr class="align-bottom">
                <td scope="col">#</td>
                <td scope="col">LOTE</td>
                <td scope="col">ORIGEM</td>
                <td scope="col">DESTINO</td>
                <td scope="col">DATA</td>
                <td scope="col">TOTAL</td>
                <td scope="col">VALOR CONF.</td>
                <td scope="col">STATUS</td>
                <td scope="col">ALTERAÇÃO</td>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <?php foreach($requests as $req): ?>
                <tr>
                    <td class="form-check">
                        <input  type="checkbox" class="setados" name="setados[]" id="setados" value="<?php echo $req['id']; ?>" />
                    </td>
                    <td><?php echo $req['name_batch']; ?></td>
                    <td><?php echo $req['name_origin']; ?></td>
                    <td><?php echo $req['name_destiny']; ?></td>
                    <td><?php echo date('d/m/Y', strtotime($req['date_request'])); ?></td>
                    <td><?php echo 'R$ '.number_format($req['value_total'], 2, ',', '.'); ?></td>
                    <td><?php echo 'R$ '.number_format($req['confirmed_value'], 2, ',', '.'); ?></td>
                    <td>
                        <?php if($req['id_status'] == '1'): ?>
                            <span class="badge bg-primary"><?php echo $req['name_status']; ?></span>
                        <?php elseif($req['id_status'] == '2'): ?>
                            <span class="badge bg-info"><?php echo $req['name_status']; ?></span>
                        <?php elseif($req['id_status'] == '3'): ?>
                            <span class="badge bg-success"><?php echo $req['name_status']; ?></span>
                        <?php elseif($req['id_status'] == '4'): ?>
                            <span class="badge bg-secondary"><?php echo $req['name_status']; ?></span>
                        <?php elseif($req['id_status'] == '5'): ?>
                            <span class="badge bg-danger"><?php echo $req['name_status']; ?></span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php if($req['change_in_confirmation'] == 'N'): ?>
                            <span class="badge bg-success">Não</span>
                        <?php else: ?>
                            <span class="badge bg-danger">Sim</span>
                        <?php endif; ?> 
                    </td>

                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    </div>
<?php else: ?>
    <p>Nada a mostrar.</p>
<?php endif; ?>
<!--style="display:none;"-->
<div id="modal" class="modal" >
    <div class="mb-3">
        <a title="Fechar" class="fechar" attr-name="modal" onclick="closeModal(this)">x</a>
        <label class="form-label subtitle-pages">CONFIRMAÇÃO PARCIAL</label>
        <div class="container-for-values">
            <label class="form-label rotule-values-modal">R$ 10,00</label>
            <input class="form-control values-input" type="number"
                attr-value="10"
                onchange="generateValueInModal(this)"
                id="modal_10"
                name="modal_10"
                class="input_"
                placeholder="0" />
            <label class="form-label rotule-values-modal">R$ </label>
            <input class="form-control values-input" type="text" readonly disabled id="modal_text_10" name="modal_text_10" class="input_modal_text" placeholder="0" />
        </div>
        <div class="mb-3 container-for-values">
            <label class="form-label rotule-values-modal">R$ 20,00</label>
            <input class="form-control values-input" type="number" attr-value="20" onchange="generateValueInModal(this)" id="modal_20" name="modal_20" class="input_" placeholder="0" />
            <label class="form-label rotule-values-modal">R$ </label>
            <input class="form-control values-input" type="text" readonly disabled id="modal_text_20" name="modal_text_20" class="input_modal_text" placeholder="0" />
        </div>
        <div class="mb-3 container-for-values">
            <label class="form-label rotule-values-modal">R$ 50,00</label>
            <input class="form-control values-input" type="number" attr-value="50" onchange="generateValueInModal(this)" id="modal_50" name="modal_50" class="input_" placeholder="0" />
            <label class="form-label rotule-values-modal">R$ </label>
            <input class="form-control values-input" type="text" readonly disabled id="modal_text_50" name="modal_text_50" class="input_modal_text" placeholder="0" />
        </div>
        <div class="mb-3 container-for-values">
            <label class="form-label rotule-values-modal">R$ 100,00</label>
            <input class="form-control values-input" type="number" attr-value="100" onchange="generateValueInModal(this)" id="modal_100" name="modal_100" class="input_" placeholder="0" />
            <label class="form-label rotule-values-modal">R$ </label>
            <input class="form-control values-input" type="text" readonly disabled id="modal_text_100" name="modal_text_100" class="input_modal_text" placeholder="0" />
        </div>
        <div class="mb-3 container-for-values">
            <label class="form-label rotule-values-modal">R$</label>
            <input class="form-control values-input" type="text" readonly disabled id="value_total_modal" name="value_total" />
        </div>
        <div class="mb-3">
            <button class="btn btn-success" onclick="functionConfirmPartial('<?php echo $base; ?>')" >
                <i class="fa-regular fa-plus"></i>Salvar
            </button>
        </div>
    </div>
</div>
<div id="modalDate" class="modalDate">
    <div class="mb-3">
        <a title="Fechar" class="fechar" attr-name="modalDate" onclick="closeModal(this)">x</a>
        <label class="form-label subtitle-pages">Nova Data</label>
        <div class="mb-3">
            <input type="date" name="new_date" id="new-date" />
        </div>
        <div class="mb-3 box-buttons">
            <button class="btn btn-success" onclick="saveNewDate('<?php echo $base; ?>')">
              <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
            </button>
        </div>
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