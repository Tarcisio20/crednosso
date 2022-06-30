<?php $render('header');  ?>
<div>
    <h1 class="title-pages"><?php echo $title_page; ?></h1>
    <div class="box-buttons">
        <a class="btn btn-success" href="<?php echo $base; ?>/request/payment_vacation/add">
            <i class="fa-regular fa-plus f-s-b-20"></i> Adicionar
        </a>
        <a class="btn btn-info" href="<?php echo $base; ?>/request">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
        <?php if(isset($payments) && $payments !== null): ?>
            <small>Pedidos: (<?php echo count($payments) ?>) / Valor Total: R$
                <?php if(isset($balance) && $balance !== ''){echo number_format($balance,2,',','.');} ?> 
            </small>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                <thead>
                    <tr class="align-bottom">
                        <td scope="col">ID</td>
                        <td scope="col">TRANSPORTADORA</td>
                        <td scope="col">CASS A</td>
                        <td scope="col">CASS B</td>
                        <td scope="col">CASS C</td>
                        <td scope="col">CASS D</td>
                        <td scope="col">TOTAL</td>
                        <td scope="col">STATUS</td>
                        <td scope="col"width="15%">AÇÕES</td>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <?php foreach($payments as $payment): ?>
                        <tr>
                            <td><?php echo $payment['id_shipping']; ?></td>
                            <td><?php echo $payment['name_shipping']; ?></td>
                            <td><?php echo $payment['cass_A']; ?></td>
                            <td><?php echo $payment['cass_B']; ?></td>
                            <td><?php echo $payment['cass_C']; ?></td>
                            <td><?php echo $payment['cass_D']; ?></td>
                            <td><?php echo 'R$ '.number_format($payment['balance'], 2, ',', '.'); ?></td>
                            <td>
                                <?php if($payment['status'] == 'Y'): ?>
                                    <span class="badge bg-success">Ativo</span>
                                <?php else: ?>
                                    <span class="badge bg-danger">Inativo</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <a class="btn btn-primary" href="<?php echo $base; ?>/request/payment_vacation/edit/<?php echo $payment['id_shipping']; ?>">
                                    <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php else: ?>
            <p>Nada a mostrar</p>
        <?php endif; ?>
</div>
<?php $render('footer');  ?>