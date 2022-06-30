<?php $render('header');  ?>
<div>
    <h1 class="title-pages"><?php echo $title_page; ?></h1>
    <div class="box-buttons">
        <a class="btn btn-info" href="<?php echo $base; ?>/request/payment">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
    <form method="POST" action="<?php echo $base; ?>/request/payment/add">
        <div class="mb-3">
            <label class="form-label">TRANSPORTADORA</label>
            <div class="mb-3">
                <div class="container-for-values">
                    <input class="form-control rotule-for-input" type="number"  id="input_id_payment" attr-value="payment" onchange="getShippingById(this)" />
                    <select class="form-select" name="id_payment" id="id_payment" class="element" >
                        <option value="0"></option>
                        <?php foreach($shippings as $shipping): ?>
                            <option value="<?php echo $shipping['id_shipping']; ?>">
                                <?php echo $shipping['name_shipping']; ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 10,00</label>
                <input class="form-control values-input" type="number" attr-value="10" name="qt_10" id="qt_10" onchange="generateValue(this)" placeholder="0"  />
                <label class="form-label rotule-values">R$</label>
                <input class="input_text form-control values-input" type="text" readonly disabled name="qt_text_10" id="qt_text_10" placeholder="0,00"  />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 20,00</label>
                <input class="form-control values-input"  type="number" attr-value="20" name="qt_20" id="qt_20" onchange="generateValue(this)" placeholder="0"  />
                <label class="form-label rotule-values">R$</label>
                <input class="input_text form-control values-input" type="text" readonly disabled name="qt_text_20" id="qt_text_20" placeholder="0,00"  />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 50,00</label>
                <input class="form-control values-input"  type="number" attr-value="50" name="qt_50" id="qt_50" onchange="generateValue(this)" placeholder="0"  />
                <label class="form-label rotule-values">R$</label>
                <input class="input_text form-control values-input"  type="text" readonly disabled name="qt_text_50" id="qt_text_50" placeholder="0,00"  />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 100,00</label>
                <input class="form-control values-input"  type="number" attr-value="100" name="qt_100" id="qt_100" onchange="generateValue(this)" placeholder="0"  />
                <label class="form-label rotule-values">R$</label>
                <input class="input_text form-control values-input"  type="text" readonly disabled name="qt_text_100" id="qt_text_100" placeholder="0,00"  />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">TOTAL</label>
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input"  type="text" readonly disabled name="value_total" id="value_total" placeholder="0,00" />
            </div>
        </div>
        <div class="mb-3 box-buttons">
            <button class="btn btn-success">
                <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
            </button>
        </div>
    </form>
</div>
<?php $render('footer');  ?>