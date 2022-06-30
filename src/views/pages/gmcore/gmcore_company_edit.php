<?php $render('header');  ?>
<div>
    <h1 class="title-pages"><?php echo $title_page.$company[0]['name'];  ?></h1>
    <form method="POST" action="<?php echo $base; ?>/gmcore/company/edit/<?php echo $company[0]['id_company']; ?>">
        <div class="mb-3">
            <label class="form-label">ID EMPRESA</label>
            <input class="form-control" type="number" name="id_company" id="id_company"
            value="<?php echo $company[0]['id_company']; ?>" />
        </div>
        <div class="mb-3">
            <label class="form-label">NOME EMPRESA</label>
            <input class="form-control" type="text" name="name_company" id="name_company"
            value="<?php echo $company[0]['name']; ?>" />
        </div>
        <div class="mb-3">
            <label class="form-label">STATUS</label>
            <select class="form-select" name="status_company" id="status_company">
                <option value="Y" <?php if($company[0]['status'] === 'Y'){echo 'selected';} ?>>ATIVO</option>
                <option value="N" <?php if($company[0]['status'] === 'N'){echo 'selected';} ?>>INATIVO</option>
            </select>
        </div>
        <div class="mb-3" class="box-buttons">
            <button class="btn btn-primary" type="submit">
                <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
            </button>
            <a class="btn btn-info" href="<?php echo $base; ?>/gmcore/company">
                <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
            </a>
        </div>
    </form>
</div>
<?php $render('footer');  ?>
