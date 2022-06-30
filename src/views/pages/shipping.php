    <?php $render('header'); ?>
    <h1 class="title-pages"><?php echo $title_page; ?></h1>
    <div>
    <form onsubmit="openForSearch(event, '<?php echo $base; ?>')">
            <input type="hidden" name="integrity" id="integrity" />
            <div class="mb-3">
                <label class="form-label">ESCOLHA A TRANSPORTADORA</label>
                <div class="container-for-values">
                    <input class="form-control rotule-for-input" type="number" attr-value="shipping" onchange="getShippingById(this)" />
                    <select class="form-select" name="id_shipping" id="id_shipping"  >
                        <?php if(isset($shippings) && $shippings !== null): ?>
                            <?php foreach($shippings as $shipping): ?>
                                <option value="<?php echo $shipping['id_shipping'] ?>">
                                    <?php echo $shipping['name_shipping'] ?>
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
                </button>
            </div>
    </form>
    </div>
    <div class="box-buttons">
        <a class="btn btn-success"  href="<?php echo $base; ?>/shipping/add">
            <i class="fa-regular fa-plus f-s-b-20"></i> Adicionar
        </a>
        <a class="btn btn-info" href="<?php echo $base; ?>/">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
    <?php if(count($shippings) > 0): ?>
        <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr class="align-center">
                    <td scope="col" width="8%">ID</td>
                    <td scope="col">NOME</td>
                    <td scope="col">TIPO</td>
                    <td scope="col">REGIÃO</td>
                    <td scope="col">GMCORE</td>
                    <td scope="col" width="10%">STATUS</td>
                    <td scope="col" width="27%" >AÇOES</td>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <?php foreach($shippings as $shipping): ?>
                    <tr class="align-center">
                        <td><?php echo $shipping['id_shipping']; ?></td>
                        <td><?php echo $shipping['name_shipping']; ?></td>
                        <td><?php echo $shipping['name_type']; ?></td>
                        <td><?php echo $shipping['name_region']; ?></td>
                        <td><?php echo $shipping['id_gmcore']; ?></td>
                        <td>
                            <?php if($shipping['active'] == 'Y'): ?>
                                <span class="badge bg-success">Ativo</span>
                            <?php else: ?>
                                <span class="badge bg-danger">Inativo</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <a class="btn btn-primary" href="<?php echo $base; ?>/shipping/edit/<?php echo $shipping['id_shipping']; ?>" >
                                <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
                            </a>
                            <?php if($shipping['active'] == 'Y'): ?>
                                <a class="btn btn-danger" href="<?php echo $base; ?>/shipping/disable/<?php echo $shipping['id_shipping']; ?>">
                                    <i class="fa-regular fa-lock f-s-b-20"></i> Inativar
                                </a>
                            <?php else: ?>
                                <a class="btn btn-warning" href="<?php echo $base; ?>/shipping/enable/<?php echo $shipping['id_shipping']; ?>">
                                    <i class="fa-regular fa-lock-open f-s-b-20"></i> Ativar
                                </a>
                            <?php endif; ?>
                            <a class="btn btn-secondary" href="<?php echo $base; ?>/treasury/add/<?php echo $shipping['id_shipping']; ?>">
                                <i class="fa-solid fa-plus-minus f-s-b-20"></i> Saldo
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        </div>
    <?php else: ?>
        <p>Nada a mostar</p>
    <?php endif; ?>
    <?php $render('footer'); ?>
