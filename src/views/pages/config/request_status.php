<?php $render('header'); ?>
<div>
    <h1 class="title-pages"><?php echo $title_page; ?></h1>
    <div class="box-buttons">
    <a class="btn btn-success" href="<?php echo $base; ?>/config/request/add">
        <i class="fa-regular fa-plus f-s-b-20"></i> Adicionar
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/config">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
    </div>
    <?php if(isset($status) && $status !== null): ?>
        <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr class="align-bottom">
                    <td scope="col">ID</td>
                    <td scope="col">NOME</td>
                    <td scope="col" width="8%">STATUS</td>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <?php foreach($status as $st): ?>
                    <tr>
                        <td><?php echo $st['id']; ?></td>
                        <td><?php echo $st['name']; ?></td>
                        <td>
                            <?php if($st['status'] == 'Y'): ?>
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