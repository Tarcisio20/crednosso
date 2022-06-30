<?php $render('header');  ?>
<div>
    <h1 class="title-pages"><?php echo $title_page;  ?></h1>
    <form method="POST" action="<?php echo $base; ?>/gmcore/company/add">
        <div class="mb-3">
            <label class="form-label">ID EMPRESA</label>
            <input class="form-control" type="number" name="id_company" id="id_company" />
        </div>
        <div class="mb-3">
            <label class="form-label">NOME EMPRESA</label>
            <input class="form-control" type="text" name="name_company" id="name_company" />
        </div>
        <div class="mb-3" class="box-buttons">
            <button class="btn btn-success" type="submit">
                <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
            </button>
            <a class="btn btn-info" href="<?php echo $base; ?>/gmcore/company">
                <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
            </a>
        </div>
    </form>
</div>
<?php $render('footer');  ?>
