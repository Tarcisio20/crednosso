<?php $render('header'); ?>
<h1 class="title-pages"><?php echo $title_page;?></h1>
<div>
    <form onsubmit="SearchContestation(event, '<?php echo $base; ?>')">
        <input type="hidden" name="integrity" id="integrity" />
        <div class="mb-3">
            <label class="form-label">PESQUISA POR NOME</label>
            <div class="mb-3 box-for-search">
                <input class="form-control" type="text" attr-value="contestation" 
                name="search_contestation" id="search_contestation" />
                 <button class="btn btn-warning" class="button-default">
                    <i class="fa-solid fa-magnifying-glass f-s-b-20"></i> Pesquisar
                </button>
            </div>
        </div>
    </form>
</div>
<div class="mb-3 box-buttons">
    <a class="btn btn-info"  href="<?php echo $base; ?>/contestation">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
</div>
<?php if(isset($contestations) && $contestations != ''): ?>
    <div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead>
            <tr class="align-bottom">
                <td scope="col" width="5%">ID</td>
                <td scope="col">Nº CONTESTAÇÃO</td>
                <td scope="col">NOME</td>
                <td scope="col">CARTAO</td>
                <td scope="col">DATA</td>
                <td scope="col">STATUS</td>
                <td scope="col">ATIVO</td>
                <td scope="col">AÇÕES</td>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <?php foreach($contestations as $contestation): ?>
                <tr>
                    <td><?php echo $contestation['id']; ?></td>
                    <td><?php echo $contestation['num_contest_system']; ?></td>
                    <td><?php echo $contestation['name']; ?></td>
                    <td><?php echo $contestation['card']; ?></td>
                    <td><?php echo date('d/m/Y',strtotime($contestation['date'])); ?></td>
                    <td>
                        <?php if($contestation['status'] == 'open'): ?>
                            <span class="badge bg-success">Aberto</span>
                        <?php else: ?>
                            <span class="badge bg-danger">Fechado</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php if($contestation['active'] == 'Y'): ?>
                            <span class="badge bg-success">Sim</span>
                        <?php else: ?>
                            <span class="badge bg-danger">Não</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <a class="btn btn-primary" href="<?php echo $base; ?>/contestation/edit/<?php echo $contestation['id']; ?>">
                            <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
                        </a>
                        <?php if($contestation['active'] == 'Y'): ?>
                            <a class="btn btn-danger" href="<?php echo $base; ?>/contestation/disable/<?php echo $contestation['id']; ?>">
                                <i class="fa-regular fa-lock f-s-b-20"></i> Inativar
                            </a>
                        <?php else: ?>
                            <a class="btn btn-warning" href="<?php echo $base; ?>/contestation/enable/<?php echo $contestation['id']; ?>">
                                <i class="fa-regular fa-lock-open f-s-b-20"></i> Ativar
                            </a>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    </div>
<?php else: ?>
    <p>Nada a mostrar relacionado ao termo informado!</p>
<?php endif; ?>
<?php $render('footer'); ?>