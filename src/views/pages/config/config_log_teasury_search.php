<?php $render('header'); ?>
<div>
    <h1 class="title-pages"><?php echo $title_page.'#'.$logs[0]['name_shipping']; ?></h1>
    <div class="box-buttons">
        <a class="btn btn-info" href="<?php echo $base; ?>/config/log_teasury">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
    <?php if(isset($logs) && $logs !== null): ?>
        <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr class="align-bottom">
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
                                <span class="badge bg-success">Sim</span>
                            <?php else: ?>
                                <span class="badge bg-danger">Não</span>
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