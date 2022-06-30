<?php $render('header');  ?>
<div>
    <h1 class="title-pages"><?php echo $title_page.$gmcore[0]['name'];  ?></h1>
    <form method="POST" action="<?php echo $base; ?>/gmcore/edit/<?php echo $gmcore[0]['id_gmcore']; ?>">
        <div class="mb-3">
            <label class="form-label">ID GMCORE</label>
            <input class="form-control" type="number" name="id_gmcore" id="id_gmcore"
            value="<?php echo $gmcore[0]['id_gmcore']; ?>" />
        </div>
        <div class="mb-3">
            <label class="form-label">NOME FILIAL</label>
            <input class="form-control" type="text" name="name_gmcore" id="name_gmcore"
            value="<?php echo $gmcore[0]['name']; ?>" />
        </div>
        <div class="mb-3">
            <label class="form-label">EMPRESA</label>
            <select class="form-select" name="id_company" id="id_company">
                <?php foreach($companys as $company): ?>
                    <option value="<?php echo $company['id_company'] ?>"
                    <?php if($company['id_company'] == $gmcore[0]['id_company']){ echo 'selected'; } ?>
                    ><?php echo $company['name']; ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">STATUS</label>
            <select class="form-select" name="status_gmcore" id="status_gmcore">
                <option value="Y" <?php if($gmcore[0]['status'] === 'Y'){echo 'selected';} ?>>ATIVO</option>
                <option value="N" <?php if($gmcore[0]['status'] === 'N'){echo 'selected';} ?>>INATIVO</option>
            </select>
        </div>
        <div class="mb-3" class="box-buttons">
            <button class="btn btn-primary" type="submit">
            <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
            </button>
            <a class="btn btn-info" href="<?php echo $base; ?>/gmcore">
                <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
            </a>
        </div>
    </form>
</div>
<?php $render('footer');  ?>
