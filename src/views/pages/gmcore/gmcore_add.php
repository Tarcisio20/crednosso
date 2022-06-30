<?php $render('header');  ?>
<div>
    <h1 class="title-pages"><?php echo $title_page;  ?></h1>
    <form method="POST" action="<?php echo $base; ?>/gmcore/add">
        <div class="mb-3">
            <label class="form-label">ID GMCORE</label>
            <input class="form-control" type="number" name="id_gmcore" id="id_gmcore" />
        </div>
        <div class="mb-3">
            <label class="form-label">NOME FILIAL</label>
            <input class="form-control" type="text" name="name_gmcore" id="name_gmcore" />
        </div>
        <div class="mb-3">
            <label class="form-label">EMPRESA</label>
            <select class="form-select" name="id_company" id="id_company">
                <?php foreach($companys as $company): ?>
                    <option value="<?php echo $company['id_company'] ?>"><?php echo $company['name']; ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="mb-3" class="box-buttons">
            <button class="btn btn-success" type="submit">
                <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
            </button>
            <a class="btn btn-info" href="<?php echo $base; ?>/gmcore">
                <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
            </a>
        </div>
    </form>
</div>
<?php $render('footer');  ?>
