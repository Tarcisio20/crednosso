<?php $render('header'); ?>
    <div>
        <form  method="POST" action="<?php echo $base; ?>/supplie/screen">
            <h1 class="title-pages"><?php echo $title_page; ?></h1>
            <div class="mb-3">
            <label class="form-label">DATA ABASTECIMENTO</label>
                <input class="form-control" type="date" name="date_supplie" id="date_supplie"
                value="<?php echo $date; ?>" />
            </div>
            <div class="mb-3 box-buttons">
                <button class="btn btn-warning">
                    <i class="fa-solid fa-magnifying-glass f-s-b-20"></i>
                    Pesquisar
                </button>
                <?php if(isset($oss) && $oss !== null): ?>
                    <a class="btn btn-success" onclick="generateOSForExcel('<?php echo $base; ?>')">
                        <i class="fa-solid fa-boxes-packing fa-ban f-s-b-20"></i>
                        Gerar
                    </a>
                <?php endif; ?>
                <a class="btn btn-info" href="<?php echo $base; ?>/supplie">
                    <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
                </a>
            </div>
        </form>
    </div>
    <div>
    <?php if(isset($oss) && $oss !== null): ?>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr class="align-bottom">
                        <td scope="col" width="8%">ID</td>
                        <td scope="col">TERMINAL</td>
                        <td scope="col">INTEGRIDADE</td>
                        <td scope="col">CASSETE A</td>
                        <td scope="col">CASSETE B</td>
                        <td scope="col">CASSETE C</td>
                        <td scope="col">CASSETE D</td>
                        <td scope="col">TOTAL</td>
                        <td scope="col">CANCELAR</td>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <?php foreach($oss as $os): ?>
                        <tr>
                            <td><?php echo $os['id']; ?></td>
                            <td><?php echo $os['id_atm']; ?></td>
                            <td><?php echo $os['integrity']; ?></td>
                            <td><?php echo $os['a_10']; ?></td>
                            <td><?php echo $os['b_20']; ?></td>
                            <td><?php echo $os['c_50']; ?></td>
                            <td><?php echo $os['d_100']; ?></td>
                            <td><?php echo 'R$ '.number_format($os['value_supplie'],2,',','.'); ?></td>
                            <td>
                                <a class="btn btn-danger" attr-id="<?php echo $os['id']; ?>" onclick="cancelSupplie('<?php echo $base; ?>', this)">
                                    <i class="fa-solid fa-ban f-s-b-20"></i>
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php else: ?>
        <p>Nada a mostrar!</p>
    <?php endif; ?>
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