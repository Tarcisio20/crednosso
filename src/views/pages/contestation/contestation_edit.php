<?php $render('header'); ?>
<h1 class="title-pages"><?php echo $title_page;?></h1>
<form method="POST" enctype='multipart/form-data' action="<?php echo $base; ?>/contestation/edit/<?php echo $contestation[0]['id']; ?>">
    <div class="mb-3">
        <label class="form-label">NUMERO CONTESTAÇÃO</label>
        <input class="form-control" type="number" name="num_contestation" id="num_contestation" value="<?php echo $contestation[0]['num_contest_system']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">NOME</label>
        <input class="form-control" type="text" name="name_contestation" id="name_contestation" value="<?php echo $contestation[0]['name']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">CARTAO</label>
        <input class="form-control" type="number" name="card_contestation" id="card_contestation" value="<?php echo $contestation[0]['card']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">DATA CONTESTAÇÃO</label>
        <input class="form-control" type="date" name="date_contestation" id="date_contestation" value="<?php echo $contestation[0]['date']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">TIPO DE CONTESTAÇÃO</label>
       <select class="form-select" name="type_contestation" id="type_contestation">
           <option value="mateus" <?php if($contestation[0]['type'] == 'mateus'){echo 'selected';} ?>>MATEUS</option>
           <option value="bradesco" <?php if($contestation[0]['type'] == 'bradesco'){echo 'selected';} ?>>BRADESCO</option>
       </select>
    </div>
    <div class="mb-3">
        <label class="form-label">STATUS</label>
       <select class="form-select" name="status_contestation" id="status_contestation">
           <option value="open" <?php if($contestation[0]['status'] == 'open'){echo 'selected';} ?>>ABERTO</option>
           <option value="close" <?php if($contestation[0]['status'] == 'close'){echo 'selected';} ?>>FECHADO</option>
       </select>
    </div>
    <div class="mb-3">
        <label class="form-label"> ATIVO</label>
       <select class="form-select" name="active_contestation" id="active_contestation">
           <option value="Y" <?php if($contestation[0]['active'] == 'Y'){echo 'selected';} ?>>ATIVO</option>
           <option value="N" <?php if($contestation[0]['active'] == 'N'){echo 'selected';} ?>>INATIVO</option>
       </select>
    </div>
    <div class="mb-3">
        <label class="form-label">IMAGENS</label>
        <input class="form-control" type="file" name="files_contestation[]" id="files_contestation" multiple />
    </div>
    <label class="title-pages subtitle-pages">IMAGENS</label>
        <?php if($contestation[0]['images'] !== null): ?>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr class="align-bottom">
                            <td scope="col">ID</td>
                            <td scope="col">PASTA</td>
                            <td scope="col">NOME</td>
                            <td scope="col">HASH</td>
                            <td scope="col">ATIVA</td>
                            <td scope="col">EXCLUIR</td>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <?php foreach($contestation[0]['images'] as $image): ?>
                            <tr>
                                <td><?php echo $image['id']; ?></td>
                                <td><?php echo $image['path']; ?></td>
                                <td><?php echo $image['path_image']; ?></td>
                                <td><?php echo $image['hash']; ?></td>
                                <td>
                                    <?php if($image['active'] == 'Y'): ?>
                                        <span class="badge bg-success">Ativo</span>
                                    <?php else: ?>
                                        <span class="badge bg-danger">Inativo</span>
                                    <?php endif; ?>
                                </td>
                                <td class="form-check box-check">
                                    <input class="form-check-input" type="checkbox" name="images[]" value="<?php echo $image['id']; ?>" />
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <p>Nada a mostrar.</p>
        <?php endif; ?>
        <div>
        <button class="btn btn-primary" type="submit">
            <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
        </button>
        <a class="btn btn-info" href="<?php echo $base; ?>/contestation">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
</form>
<?php $render('footer'); ?>