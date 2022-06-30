<?php $render('header');   ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<div class="box-buttons">
    <a class="btn btn-info" href="<?php echo $base; ?>/request/search">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
    <a class="btn btn-success" onclick="downloadFileAll('<?php echo $base; ?>', '<?php echo $integrity; ?>')" >
    <i class="fa-solid fa-download f-s-b-20"></i> Baixar Selecionados
    </a>
</div>
<?php if($pdfs !== null): ?>
    <div class="mb-3">
        <input type="checkbox" onclick="selectAll(this)" name="checkAll" id="checkAll" />
        <label for="checkAll">Selecionar todos</label>
    </div>
    <div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead>
            <tr class="align-bottom">
                <td scope="col">#</td>
                <td scope="col">EMPRESA</td>
                <td scope="col">NOME</td>
                <td scope="col">DATA</td>
                <td scope="col">BAIXAR</td>
            </tr>
        </thead>
        <tbody class="table-group-divider">
        <?php foreach($pdfs as $pdf): ?>
            <tr>
                <td class="form-check">
                    <input  type="checkbox" class="setados" name="setados[]" id="setados" value="<?php echo $pdf['id']; ?>" />
                </td>
                <td><?php echo $pdf['name_company']; ?></td>
                <td><?php echo $pdf['name']; ?></td>
                <td><?php echo date('d/m/Y', strtotime($pdf['date'])); ?></td>
                <td>
                    <a class="btn btn-success" 
                    href="<?php echo $base; ?>/request/pdf/download_one/<?php echo $pdf['id']; ?>">
                        <i class="fa-solid fa-file-arrow-down f-s-b-20"></i>
                    </a>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
    </div>
<?php else: ?>
    <p>Nada a mostrar</p>
<?php endif; ?>
<div id="modalError" class="modalError" >
    <div class="mb-3">
        <a title="Fechar" class="fechar" attr-name="modalError" attr-name="modal" onclick="closeModal(this)">x</a>
        <div class="box-for-messege">
            <label class="form-label subtitle-pages">Erro</label>
            <span class="badge badge-pill bg-danger">
                <i class="fa-solid fa-circle-exclamation f-s-b-20 item-messege"></i>
            </span>
            <p class="text-messege">Precisamos que seja selecionado algum item para proseguir!</p>
        </div>
    </div>
</div>
<?php $render('footer');  ?>