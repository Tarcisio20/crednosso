<?php $render('header'); ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<div>
    <form onsubmit="SearchTreasury(event, '<?php echo $base; ?>')">
        <input type="hidden" name="integrity" id="integrity" />
        <div class="mb-3">
            <label class="form-label">ESCOLHA A TESOURARIA</label>
            <div class="container-for-values">
                <input class="form-control rotule-for-input" type="number" attr-value="treasury" onchange="getShippingById(this)" />
                <select class="form-select" name="id_treasury" id="id_treasury"  >
                    <?php if(isset($treasurys) && $treasurys !== null): ?>
                        <option value="0"></option>
                        <?php foreach($treasurys as $treasury): ?>
                            <option value="<?php echo $treasury['id_shipping'] ?>">
                            <?php echo $treasury['id_shipping'].' - '.$treasury['name_shipping'] ?>
                            </option>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </select>
            </div>
        </div>
        <div class="mb-3" class="box-buttons">
                <button class="btn btn-warning" class="button-default">
                    <i class="fa-solid fa-magnifying-glass f-s-b-20"></i> Selecionar
                </button>
                </button>
            </div>
    </form>
</div>
<div class="box-buttons">
        <a class="btn btn-info" href="<?php echo $base; ?>/">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
<?php if($treasurys !== null): ?>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
        <thead>
            <tr class="align-bottom">
                <td scope="col">ID</td>
                <td scope="col">NOME</td>
                <td scope="col">CASSETE A</td>
                <td scope="col">CASSETE B</td>
                <td scope="col">CASSETE C</td>
                <td scope="col">CASSETE D</td>
                <td scope="col">TOTAL</td>
                <td scope="col">STATUS</td>
                <td scope="col">AÇÕES</td>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <?php foreach($treasurys as $treasury): ?>
                <tr>
                    <td><?php echo $treasury['id_shipping']; ?></td>
                    <td><?php echo $treasury['name_shipping']; ?></td>
                    <td><?php echo $treasury['a_10']; ?></td>
                    <td><?php echo $treasury['b_20']; ?></td>
                    <td><?php echo $treasury['c_50']; ?></td>
                    <td><?php echo $treasury['d_100']; ?></td>
                    <td><?php echo 'R$ '.number_format($treasury['balance'], 2); ?></td>
                    <td>
                        <?php if($treasury['status'] == 'Y'): ?>
                            <span class="badge bg-success">Sim</span>
                        <?php else: ?>
                            <span class="badge bg-danger">Não</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <a class="btn btn-primary" href="<?php echo $base; ?>/treasury/add/<?php echo $treasury['id_shipping']; ?>">
                            <i class="fa-solid fa-plus-minus f-s-b-20"></i> Atualizar saldo
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
<div id="modalError" class="modalError" >
    <div class="mb-3">
        <a title="Fechar" class="fechar" attr-name="modalError" attr-name="modal" onclick="closeModal(this)">x</a>
        <div class="box-for-messege">
            <label class="form-label subtitle-pages">Erro</label>
            <span class="badge badge-pill bg-danger">
                <i class="fa-solid fa-circle-exclamation f-s-b-20 item-messege"></i>
            </span>
            <p class="text-messege">Selecionar uma Tesouraria para proseguir!</p>
        </div>
    </div>
</div>
<?php $render('footer'); ?>