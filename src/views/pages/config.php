<?php $render('header'); ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<div class="box-buttons container-config">
    <a class="btn btn-info" href="<?php echo $base; ?>/config/log_teasury"  >
        <i class="fa-solid fa-hammer"></i> Verificação de Logs de Tesouraria
    </a>
     <a class="btn btn-info" href="<?php echo $base; ?>/config/shipping_types">
        <i class="fa-solid fa-hammer"></i> Tipos de Transportadora
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/config/supplie" >
        <i class="fa-solid fa-hammer"></i> Status de Abastecimentos
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/config/request">
        <i class="fa-solid fa-hammer"></i> Status de Pedidos
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/config/order">
        <i class="fa-solid fa-hammer"></i> Tipos de Ordem
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/config/operation_type">
        <i class="fa-solid fa-hammer"></i> Tipos de Operações
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/config/batch_types">
        <i class="fa-solid fa-hammer"></i> Tipos de Lote
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/config/batch_status">
        <i class="fa-solid fa-hammer"></i> Status de Lote
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/config/atm_types">
        <i class="fa-solid fa-hammer"></i> Tipo de Atm
    </a>

</div>
<?php $render('footer'); ?>
