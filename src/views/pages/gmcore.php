<?php $render('header'); ?>

<div>
    <h1 class="title-pages"><?php echo $title_page; ?></h1>
    <div class="box-buttons">
        <a class="btn btn-success" href="<?php echo $base; ?>/gmcore/add" >
            <i class="fa-regular fa-plus f-s-b-20"></i> Adicionar Filial
        </a>
        <a class="btn btn-warning" href="<?php echo $base; ?>/gmcore/company" >
        <i class="fa-solid fa-building f-s-b-20"></i> Adicionar Empresas
        </a>
        <a class="btn btn-info" href="<?php echo $base; ?>/">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
    <?php if(isset($gmcores) && $gmcores !== null): ?>
        <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr class="align-bottom">
                            <td scope="col" width="8%">ID</td>
                            <td scope="col">NOME</td>
                            <td scope="col">ID EMPRESA</td>
                            <td scope="col">STATUS</td>
                            <td scope="col" width="20%">AÇÃO</td>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <?php foreach($gmcores as $gmcore): ?>
                            <tr>
                                <td><?php echo $gmcore['id_gmcore']; ?></td>
                                <td><?php echo $gmcore['name']; ?></td>
                                <td><?php echo $gmcore['name_company']; ?></td>
                                <td>
                                    <?php if($gmcore['status'] == 'Y'):  ?>
                                        <span class="badge bg-success">Ativo</span>
                                    <?php else:  ?>
                                        <span class="badge bg-danger">Inativo</span>
                                    <?php endif;  ?>
                                </td>
                                <td>
                                    <a class="btn btn-primary" href="<?php echo $base; ?>/gmcore/edit/<?php echo $gmcore['id_gmcore']; ?>">
                                        <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
                                    </a>
                                    <?php if($gmcore['status'] == 'Y'): ?>
                                        <a class="btn btn-danger" href="<?php echo $base; ?>/gmcore/disable/<?php echo $gmcore['id_gmcore']; ?>">
                                            <i class="fa-regular fa-lock f-s-b-20"></i>Inativar
                                        </a>
                                    <?php else: ?>
                                        <a class="btn btn-warning" href="<?php echo $base; ?>/gmcore/enable/<?php echo $gmcore['id_gmcore']; ?>">
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
        <p>Nada a mostrar</p>
    <?php endif; ?>
</div>

<?php $render('footer'); ?>