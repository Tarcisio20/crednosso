<?php $render('header'); ?>
<div>
    <h1 class="title-pages"><?php echo $title_page; ?></h1>
    <form method="POST" action="<?php echo $base; ?>/config/log_teasury/add">
        <div class="mb-3">
            <label class="form-label">NOME</label>
            <input class="form-control" type="text" name="name_type" id="name_type" />
        </div>
        <div class="mb-3 box-buttons">
            <button class="btn btn-success">
                <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
            </button>
            <a class="btn btn-info" href="<?php echo $base; ?>/config/log_teasury">
                <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
            </a>
        </div>
    </form>
</div>
<?php $render('footer'); ?>