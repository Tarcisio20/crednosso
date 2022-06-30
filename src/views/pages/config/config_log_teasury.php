<?php $render('header'); ?>
<div>
    <h1 class="title-pages"><?php echo $title_page; ?></h1>
    <div>
       
        <form method="POST" action="<?php echo $base; ?>/config/log_teasury" >
            <div class="mb-3">
                <h4 class="form-label">FILTROS</h4>
                <label class="form-label">TRANSPORTADORA</label>
                <div class="container-for-values">
                    <input class="form-control rotule-for-input" type="number" attr-value="shipping" onchange="getShippingById(this)" />
                    <select class="form-select"  name="id_shipping" id="id_shipping"  >
                        <option value="0"></option>
                        <?php if(isset($shippings) && $shippings !== null): ?>
                            <?php foreach($shippings as $shipping): ?>
                                <option value="<?php echo $shipping['id_shipping'] ?>">
                                    <?php echo $shipping['name_shipping'] ?>
                                </option>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </select>
                </div>
            </div>
            <div class="box-buttons">
                <button class="btn btn-warning">
                    <i class="fa-solid fa-magnifying-glass"></i> Pesquisar
                </button>
            </div>
        </form>
    </div>
    <div class="mb-3" class="box-buttons">
        <a class="btn btn-success" href="<?php echo $base; ?>/config/log_teasury/add">
            <i class="fa-regular fa-plus f-s-b-20"></i> Adicionar
        </a>
        <a class="btn btn-info" href="<?php echo $base; ?>/config">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
    <?php if(isset($logs) && $logs !== null): ?>
        <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr  class="align-bottom">
                    <td scope="col">ID</td>
                    <td scope="col">TRANSPORTADORA</td>
                    <td scope="col">TIPO</td>
                    <td scope="col">VALOR DO PROCESSO</td>
                    <td scope="col">SALDO ANTERIOR</td>
                    <td scope="col">SALDO ATUAL</td>
                    <td scope="col">MOMENTO OPERAÇÃO</td>
                    <td scope="col">STATUS</td>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <?php foreach($logs as $log): ?>
                    <tr>
                        <td><?php echo $log['id']; ?></td>
                        <td><?php echo $log['name_shipping']; ?></td>
                        <td><?php echo $log['name_type']; ?></td>
                        <td><?php echo 'R$ '.number_format($log['value_process'],2,',','.'); ?></td>
                        <td><?php echo 'R$ '.number_format($log['balance_previous'],2,',','.'); ?></td>
                        <td><?php echo 'R$ '.number_format($log['balance_current'],2,',','.'); ?></td>
                        <td><?php echo date('d/m/Y H:i:s', strtotime($log['date'])); ?></td>
                        <td>
                            <?php if($log['active'] == 'Y'): ?>
                                 <span class="badge bg-success">Ativo</span>
                            <?php else: ?>
                                 <span class="badge bg-danger">Inativo</span>
                            <?php endif; ?>
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
<?php $render('footer'); ?>
