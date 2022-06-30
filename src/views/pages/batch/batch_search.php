<?php $render('header');  ?>
<h1 class="title-pages" ><?php echo $title_page; ?></h1>
<div>
    <form onsubmit="SearchGeneric(event, '<?php echo $base; ?>')">
        <input type="hidden" name="integrity" id="integrity" />
        <div class="mb-3">
            <label class="form-label">PESQUISA POR N° LOTE</label>
            <div class="mb-3 box-for-search">
                <input class="form-control" type="text" attr-value="batch" 
                name="search_batch" id="search_batch" />
                 <button class="btn btn-warning" class="button-default">
                    <i class="fa-solid fa-magnifying-glass f-s-b-20"></i> Pesquisar
                </button>
            </div>
        </div>
    </form>
</div>
<div class="box-buttons">
    <a class="btn btn-info" href="<?php echo $base; ?>/batch">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
</div>
<?php if(isset($batchs) && $batchs != null): ?>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
        <thead>
            <tr class="align-bottom">
                <td scope="col" width="8%">ID</td>
                <td scope="col">LOTE</td>
                <td scope="col" width="15%">STATUS</td>
                <td scope="col" width="15%">AÇÕES</td>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <?php foreach($batchs as $key => $batch): ?>
                <tr>
                    <td><?php echo $batch['id']; ?></td>
                    <td><?php echo $batch['batch']; ?></td>
                    <td>
                        <?php if($batch['name_status'] == 'open'): ?>
                            <span class="badge bg-success">Aberto</span>
                        <?php elseif($batch['name_status'] == 'close'): ?>
                            <span class="badge bg-danger">Fechado</span>
                        <?php else: ?>
                            <span class="badge bg-warning">Pausado</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <a class="btn btn-secondary" href="<?php echo $base; ?>/batch/view/<?php echo $batch['id']; ?>" >
                            <i class="fa-solid fa-binoculars f-s-b-20"></i> Visualizar
                        </a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    </div>
    <?php ?>
<?php else: ?>
    <p>Nada a mostrar com o lote informado.</p>
<?php endif; ?>
<?php $render('footer');  ?>
