<?php $render('header'); ?>
<h1 class="title-pages"><?php echo $title_page;?></h1>
<form method="POST" enctype='multipart/form-data' action="<?php echo $base; ?>/contestation/add">
    <div class="mb-3">
        <label class="form-label">NUMERO CONTESTAÇÃO</label>
        <input class="form-control"  type="number" name="num_contestation" id="num_contestation" />
    </div>
    <div class="mb-3">
        <label class="form-label">NOME</label>
        <input class="form-control"  type="text" name="name_contestation" id="name_contestation" />
    </div>
    <div class="mb-3">
        <label class="form-label">CARTAO</label>
        <input class="form-control"  type="number" name="card_contestation" id="card_contestation" />
    </div>
    <div class="mb-3">
        <label class="form-label">DATA CONTESTAÇÃO</label>
        <input class="form-control"  type="date" name="date_contestation" id="date_contestation" />
    </div>
    <div class="mb-3">
        <label class="form-label">TIPO DE CONTESTAÇÃO</label>
       <select class="form-select" name="type_contestation" id="type_contestation">
           <option type="mateus">MATEUS</option>
           <option type="bradesco">BRADESCO</option>
       </select>
    </div>
    <div class="mb-3">
        <label class="form-label">IMAGENS</label>
        <input class="form-control" type="file" name="files_contestation[]" id="files_contestation" multiple />
    </div>
    <div class="mb-3 box-buttons">
        <button class="btn btn-success" type="submit">
            <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
        </button>
        <a class="btn btn-info" href="<?php echo $base; ?>/contestation">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
</form>
<?php $render('footer'); ?>