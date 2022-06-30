<?php $render('header'); ?>
<div>
    <h1 class="title-pages"><?php echo $title_page; ?></h1>
    <div>
        <form method="POST" action="<?php echo $base; ?>/supplie/view">
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
                <button class="btn btn-primary" class="button-default">
                    <i class="fa-solid fa-brazilian-real-sign f-s-b-20"></i> Abastecer
                </button>
                <a class="btn btn-info" href="<?php echo $base; ?>/" >
                    <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
                </a>
            </div>
        </form>
    </div>
    <div>
        <?php if(isset($shippings) && $shippings !== null): ?>
            <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr class="align-bottom">
                        <td scope="col" width="8%">ID</td>
                        <td scope="col">NOME</td>
                        <td scope="col" width="15%">SALDO</td>
                        <td scope="col" width="15%">AÇÃO</td>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <?php foreach($shippings as $shipping): ?>
                        <tr>
                            <td><?php echo $shipping['id_shipping']; ?></td>
                            <td><?php echo $shipping['name_shipping']; ?></td>
                            <td><?php echo 'R$ '.number_format($shipping['balance'], 2, ',','.'); ?></td>
                            <td>
                                <a class="btn btn-primary" href="<?php echo $base; ?>/supplie/view/<?php echo $shipping['id_shipping']; ?>">
                                    <i class="fa-solid fa-brazilian-real-sign f-s-b-20"></i> Abastecer
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            </div>
        <?php else: ?>
            <p>Nada a mostrar!</p>
        <?php endif; ?>
    </div>
</div>
<?php $render('footer'); ?>