<?php $render('header');   ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<div class="box-buttons">
    <a class="btn btn-info" href="<?php echo $base; ?>/request/search">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
</div>
<?php if($excel !== null): ?>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr class="align-bottom">
                    <td scope="col">NOME</td>
                    <td scope="col">BAIXAR</td>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <tr>
                    <td>transferencias.xlsx</td>
                    <td>
                        <a class="btn btn-success" 
                        href="<?php echo $base; ?>/request/pdf/download_excel" >
                            <i class="fa-solid fa-file-arrow-down f-s-b-20"></i>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
<?php else: ?>
    <p>Nada a mostrar</p>
<?php endif; ?>
<?php $render('footer');   ?>