
<?php $render('header'); ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<div>
    <form onsubmit="openForSearchAtm(event, '<?php echo $base; ?>')">
        <div class="mb-3">
            <label class="form-label">ESCOLHA O TERMINAL</label>
            <div class="container-for-values">
                <input class="form-control rotule-for-input" type="number" attr-value="atm" onchange="getShippingById(this)" />
                <select class="form-select" name="id_atm" id="id_atm"  >
                    <option value="0"></option>
                    <?php if(isset($atms) && $atms !== null): ?>
                        <?php foreach($atms as $atm): ?>
                            <option value="<?php echo $atm['id_atm'] ?>">
                                <?php echo $atm['id_atm'].' - '.$atm['shortened_name_atm'] ?>
                            </option>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </select>
            </div>
        </div>
        <div class="mb-3" class="box-buttons">
            <button class="btn btn-warning" class="button-default">
                <i class="fa-solid fa-magnifying-glass f-s-b-20"></i> Selecionar
            </button>
        </div>
    </form>
</div>
    

    <div class="box-buttons">
        <a class="btn btn-success" href="<?php echo $base; ?>/atm/add">
            <i class="fa-regular fa-plus f-s-b-20"></i> Adicionar
        </a>
        <a class="btn btn-info" href="<?php echo $base; ?>/">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
    <?php if($atms !== null): ?>
        <small>Total de <?php echo count($atms); ?> terminais</small>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
            <thead>
                <tr class="align-bottom">
                    <td scope="col">ID</td>
                    <td scope="col">NOME</td>
                    <td scope="col">NOME REDUZIDO</td>
                    <td scope="col">TIPO</td>
                    <td scope="col">TRANSPORTADORA</td>
                    <td scope="col">CASS A</td>
                    <td scope="col">CASS B</td>
                    <td scope="col">CASS C</td>
                    <td scope="col">CASS D</td>
                    <td scope="col">STATUS</td>
                    <td scope="col" width="20%">AÇÃOES</td>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <?php foreach($atms as $atm): ?>
                    <tr>
                        <td><?php echo $atm['id_atm']; ?></td>
                        <td><?php echo $atm['name_atm']; ?></td>
                        <td><?php echo $atm['shortened_name_atm']; ?></td>
                        <td><?php echo $atm['name_type']; ?></td>
                        <td><?php echo $atm['name_shipping']; ?></td>
                        <td><?php echo $atm['cass_A']; ?></td>
                        <td><?php echo $atm['cass_B']; ?></td>
                        <td><?php echo $atm['cass_C']; ?></td>
                        <td><?php echo $atm['cass_D']; ?></td>
                        <td>
                            <?php if($atm['status'] == 'Y'): ?>
                                <span class="badge bg-success">Sim</span>
                            <?php else: ?>
                                <span class="badge bg-danger">Não</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <a class="btn btn-primary" href="<?php echo $base; ?>/atm/edit/<?php echo $atm['id_atm']; ?>">
                                <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
                            </a>
                            <?php if($atm['status'] == 'Y'): ?>
                                <a class="btn btn-danger" href="<?php echo $base; ?>/atm/disable/<?php echo $atm['id_atm']; ?>">
                                    <i class="fa-regular fa-lock f-s-b-20"></i> Inativar
                                </a>
                            <?php else: ?>
                                <a class="btn btn-warning" href="<?php echo $base; ?>/atm/enable/<?php echo $atm['id_atm']; ?>">
                                    <i class="fa-regular fa-lock-open f-s-b-20"></i> Ativar
                                </a>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        </div>
    <?php else: ?>
        <p>Nada a mostrar.</p>
    <?php endif; ?>
</div>
<?php $render('footer'); ?>