<?php $render('header');  ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<div class="box-buttons">
    <a class="btn btn-success"  href="<?php  echo $base; ?>/request/add">
        <i class="fa-regular fa-plus f-s-b-20"></i> Adicionar
    </a>
    <a class="btn btn-warning" href="<?php echo $base; ?>/request/search">
        <i class="fa-solid fa-magnifying-glass f-s-b-20"></i> Tela de pesquisa
    </a>
    <a class="btn btn-primary" href="<?php echo $base; ?>/request/payment">
        <i class="fa-solid fa-money-bill-1-wave f-s-b-20"></i> Padrão de folha
    </a>
    <a class="btn btn-primary" href="<?php echo $base; ?>/request/payment_vacation">
        <i class="fa-solid fa-tower-observation f-s-b-20"></i> Padrão de férias
    </a>
    <a class="btn btn-info"  href="<?php  echo $base; ?>/">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
</div>
<?php if($requests !== null): ?>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
        <thead>
            <tr class="align-bottom">
                <td cope="col">ID</td>
                <td cope="col">LOTE</td>
                <td cope="col">ORIGEM</td>
                <td cope="col">DESTINO</td>
                <td cope="col">DATA</td>
                <td cope="col">TOTAL</td>
                <td cope="col">VALOR CONFIRMADO</td>
                <td cope="col">STATUS</td>
                <td cope="col"width="15%">AÇÕES</td>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <?php foreach($requests as $request): ?>
                <tr>
                    <td><?php echo $request['id']; ?></td>
                    <td><?php echo $request['batch']; ?></td>
                    <td><?php echo $request['name_origin']; ?></td>
                    <td><?php echo $request['name_destiny']; ?></td>
                    <td><?php echo date('d/m/Y', strtotime($request['date_request'])); ?></td>
                    <td><?php echo 'R$ '.number_format($request['value_total'], 2, ',', '.'); ?></td>
                    <td><?php echo 'R$ '.number_format($request['confirmed_value'], 2, ',', '.'); ?></td>
                    <td>
                        <?php if($request['name_status'] == 'aberto'): ?>
                            <span class="badge bg-primary">Aberto</span>
                        <?php elseif($request['name_status'] == 'confirmado'): ?>
                            <span class="badge bg-warning">confirmado</span>
                        <?php elseif($request['name_status'] == 'pago'): ?>
                            <span class="badge bg-success">pago</span>
                        <?php elseif($request['name_status'] == 'relançado'): ?>
                            <span class="badge bg-secondary">relançado</span>
                        <?php elseif($request['name_status'] == 'cancelado'): ?>
                            <span class="badge bg-danger">cancelado</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <a class="btn btn-secondary" href="<?php echo $base; ?>/request/view/<?php echo $request['id']; ?>">
                            <i class="fa-solid fa-binoculars f-s-b-20"></i> Visualizar
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
<?php $render('footer');  ?>