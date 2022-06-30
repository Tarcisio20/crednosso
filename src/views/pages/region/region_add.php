<?php $render('header');  ?>
    <h1 class="title-pages"><?php echo $title_page;  ?></h1>
    <form method="POST" action="<?php echo $base; ?>/region/add" >
        <div class="mb-3">
            <label class="form-label">ID NO SISTEMA</label>
            <input class="form-control" type="number" name="id_region" id="id_region" />
        </div>
        <div class="mb-3">
            <label class="form-label">NOME</label>
            <input class="form-control" type="text" name="name_region" id="name_region" />
        </div>
        <div class="mb-3" class="box-buttons">
        <button class="btn btn-success" type="submit">
            <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
        </button>
        <a class="btn btn-info" href="<?php echo $base; ?>/region">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
    </form>
<?php $render('footer');  ?>