<?php $render('header');   ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<div class="box-buttons">
    <a class="btn btn-info" href="<?php echo $base; ?>/request/search">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
</div>
<?php if($acertos !== null): ?>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr class="align-bottom">
                    <td scope="col">ID</td>
                    <td scope="col">NOME</td>
                    <td scope="col">EMPRESA</td>
                    <td scope="col">BAIXAR</td>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <?php foreach($acertos as $a): ?>
                <tr>
                    <td><?php echo $a['id']; ?></td>
                    <td><?php echo $a['name']; ?></td>
                    <td><?php echo $a['name_company']; ?></td>
                    <td>
                        <a class="btn btn-success" 
                        href="<?php echo $base; ?>/request/pdf/download_one_paymment/<?php echo $a['id']; ?>" >
                            <i class="fa-solid fa-file-arrow-down f-s-b-20"></i>
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
<?php $render('footer');   ?>