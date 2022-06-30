<?php $render('header');  ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<div class="box-buttons">
    <a class="btn btn-warning" href="<?php echo $base; ?>/request/search">
        <i class="fa-solid fa-magnifying-glass f-s-b-20"></i> Tela de pesquisa
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/request">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
</div>
<form method="POST" action="<?php echo $base; ?>/request/add">
    <div class="mb-3">
        <label class="form-label">TIPO DE OPERAÇÃO</label>
        <select class="form-select" name="operation_type" id="operation_type" class="element" >
            <?php foreach($operation_types as $operation): ?>
                <option value="<?php echo $operation['id']; ?>"><?php echo $operation['name']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="mb-3">
        <label class="form-label">ORIGEM</label>
        <div class="mb-3">
            <div class="container-for-values">
                <input class="form-select rotule-for-input" class="form-control" type="number"  id="input_id_origin" attr-value="origin" onchange="getShippingById(this)" />
                <select class="form-select" name="id_origin" id="id_origin" class="element">
                    <?php foreach($shippings as $shipping): ?>
                        <option value="<?php echo $shipping['id_shipping']; ?>"><?php echo $shipping['name_shipping']; ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
    </div>
    <div class="mb-3">
        <label class="form-label">DESTINO</label>
        <div class="mb-3">
            <div class="container-for-values">
                <input class="form-control rotule-for-input" type="number"  id="input_id_destiny" attr-value="destiny" onchange="getShippingById(this)" />
                <select class="form-select" name="id_destiny" id="id_destiny" class="element" >
                    <option value="0"></option>
                    <?php foreach($shippings as $shipping): ?>
                        <option value="<?php echo $shipping['id_shipping']; ?>">
                            <?php echo $shipping['name_shipping']; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
    </div>
    <div class="mb-3">
        <label class="form-label">DATA</label>
        <input class="form-control" type="date" name="date_request" id="date_request" class="element" />
    </div>
    <div class="mb-3">
        <label class="form-label">TIPO DE ORDEM</label>
        <select class="form-select" name="order_request" id="order_request" class="element">
            <?php foreach($order_types as $order): ?>
                <option value="<?php echo $order['id']; ?>"><?php echo $order['name']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="mb-3">
        <div class="container-for-text">
            <label class="form-label">OBSERVAÇÃO</label>
            <small class="form-label text-small" >Descreva informações relevantes</small>
        </div>
        <textarea class="form-control" name="note_request" id="note_request"></textarea>
    </div>
    <div class="mb-3">
        <label class="form-label subtitle-pages">COMPOSIÇÃO PEDIDO</label>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 10,00</label>
                <input class="form-control values-input" type="number" class="element" onchange="generateValue(this)" attr-value="10" name="qt_10" id="qt_10" placeholder="0" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" class="input_text" readonly disabled name="qt_text_10" id="qt_text_10" placeholder="0,00" /> 
            </div>
        </div>
         <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 20,00</label>
                <input class="form-control values-input" type="number" class="element" onchange="generateValue(this)" attr-value="20" name="qt_20" id="qt_20" placeholder="0" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" class="input_text" readonly disabled name="qt_text_20" id="qt_text_20" placeholder="0,00" /> 
            </div>
        </div>
         <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 50,00</label>
                <input class="form-control values-input" type="number" class="element" onchange="generateValue(this)" attr-value="50" name="qt_50" id="qt_50" placeholder="0" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" class="input_text" readonly disabled name="qt_text_50" id="qt_text_50" placeholder="0,00" /> 
            </div>
        </div>
         <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 100,00</label>
                <input class="form-control values-input" type="number" class="element" onchange="generateValue(this)" attr-value="100" name="qt_100" id="qt_100" placeholder="0" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" class="input_text" readonly disabled name="qt_text_100" id="qt_text_100" placeholder="0,00" /> 
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">TOTAL</label>
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" readonly disabled name="value_total" id="value_total" />
            </div>
        </div>
    </div>
    <div class="mb-3">
        <button class="btn btn-success" type="submit">
            <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
        </button>
    </div>
</form>
<?php $render('footer'); ?> 