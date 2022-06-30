<?php $render('header');  ?>
    <h1 class="title-pages"><?php echo $title_page.$region[0]['name'];  ?></h1>
    <form method="POST" action="<?php echo $base; ?>/region/edit/<?php echo $region[0]['id_region'] ?>" >
        <div class="mb-3">
            <label class="form-label">ID NO SISTEMA</label>
            <input class="form-control" type="number" name="id_region" id="id_region" value="<?php echo $region[0]['id_region']; ?>" />
        </div>
        <div class="mb-3">
            <label class="form-label">NOME</label>
            <input class="form-control" type="text" name="name_region" id="name_region" value="<?php echo $region[0]['name']; ?>" />
        </div>
        <div class="mb-3">
            <label class="form-label">STATUS</label>
            <select class="form-select" name="status_region" id="status_region">
                <option value="Y" <?php if($region[0]['status'] == 'Y'){ echo 'selected';} ?> >ATIVO</option>
                <option value="N" <?php if($region[0]['status'] == 'N'){ echo 'selected';} ?> >INATIVO</option>
            </select>
        </div>
        <div class="mb-3" class="box-buttons">
        <button class="btn btn-primary" type="submit">
            <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
        </button>
        <a class="btn btn-info" href="<?php echo $base; ?>/region">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
    </form>
<?php $render('footer');  ?>