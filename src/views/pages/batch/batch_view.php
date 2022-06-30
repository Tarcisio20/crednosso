<?php $render('header'); ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<div class="box-buttons">
    <a class="btn btn-success" href="#" >
        <i class="fa-solid fa-check-double f-s-b-20"></i> Confirmar lote
    </a>
    <a class="btn btn-danger" href="#" >
        <i class="fa-solid fa-ban f-s-b-20"></i> Excluir lote
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/batch">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
</div>
<form method="POST" action="<?php echo $base; ?>/batch/view/">
    <div class="mb-3">
        <label class="form-label">ID</label>
        <input class="form-control" type="number" readonly disabled name="id_batch" id="id_batch" value="<?php echo $batch[0]['id']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">LOTE</label>
        <input class="form-control" type="text" readonly disabled name="name_batch" id="name_batch" value="<?php echo $batch[0]['batch']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">TIPO</label>
        <input class="form-control" type="text" readonly name="type" id="type" value="<?php echo $batch[0]['name_type']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">DATA</label>
        <input class="form-control" type="date" readonly disabled name="date_batch" id="date_batch" value="<?php echo $batch[0]['date_batch']; ?>" />
    </div>
    <div class="mb-3">
        <div class="mb-3">
            <label class="form-label">STATUS</label>
            <input class="form-control" type="text" readonly disabled value="<?php echo $batch[0]['name_status'] ?>" />
        </div>
        
        <?php if(isset($all_status) && $all_status !== null): ?>
            <div class="mb-3">
                <small class="form-label text-small">Ao efetuar qualquer alteração do Lote, será refletido para todos os pedidos contidos. [BETA]</small>
                <select class="form-select" name="id_status" id="id_status" >
                    <?php foreach($all_status as $allstatus): ?>
                        <option value="<?php echo $allstatus['id']; ?>" 
                            <?php if($allstatus['id'] == $batch[0]['status']){echo 'selected';} ?>
                        ><?php echo $allstatus['name']; ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
        <?php endif; ?>
    </div>
    <div class="mb-3 box-buttons">
        <button class="btn btn-primary" type="submit">
            <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
        </button>
    </div>
</form>
<div>
    <?php if(isset($requests) && $requests !== null): ?>
        <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr class="align-bottom">
                    <td scope="col">ID</td>
                    <td scope="col">ORIGEM</td>
                    <td scope="col">DESTINO</td>
                    <td scope="col">STATUS</td>
                    <td scope="col">VALOR TOTAL</td>
                    <td scope="col">VALOR CONFIRM.</td>
                    <td scope="col">VIZUALIZAR</td>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <?php foreach($requests as $req): ?>
                    <tr>
                        <td><?php echo $req['id']; ?></td>
                        <td><?php echo $req['name_origin']; ?></td>
                        <td><?php echo $req['name_destiny']; ?></td>
                        <td><?php echo $req['name_status']; ?></td>
                        <td><?php echo 'R$ '.number_format($req['value_total'], 2, ',', '.'); ?></td>
                        <td><?php echo 'R$ '.number_format($req['confirmed_value'], 2, ',', '.'); ?></td>
                        <td><a class="btn btn-secondary" href="<?php echo $base; ?>/request/view/<?php echo $req['id']; ?>" >
                            <i class="fa-solid fa-binoculars f-s-b-20"></i> Visualizar
                        </a></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        </div>
    <?php else: ?>
        <p>Lote vazio</p>
    <?php endif; ?>
</div>
<?php $render('footer'); ?>