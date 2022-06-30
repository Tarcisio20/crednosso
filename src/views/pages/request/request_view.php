<?php $render('header');  ?>
<h1 class="title-pages"><?php echo $title_page;  ?></h1>
<div class="box-buttons">
    <a class="btn btn-warning" href="<?php echo $base; ?>/request/search">
        <i class="fa-solid fa-magnifying-glass f-s-b-20"></i> Tela de pesquisa
    </a>
    <a class="btn btn-info" href="<?php echo $base; ?>/request">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
</div>
<form method="POST" action="<?php echo $base; ?>/request/view/edit/<?php echo $request[0]['id']; ?>">
    <div class="mb-3">
        <label class="form-label">ID</label>
        <input class="form-control" type="number" readonly disabled name="id_requet" id="id_request" value="<?php echo $request[0]['id']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">LOTE</label>
        <input class="form-control" type="text" readonly disabled value="<?php echo $batch[0]['batch']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">TIPO DE OPERAÇÃO</label>
        <select class="form-select" name="operation_type" id="operation_type" class="element" >
            <?php foreach($operation_types as $operation): ?>
                <option value="<?php echo $operation['id']; ?>"
                    <?php if($operation['id'] == $request[0]['id_operation_type']){echo 'selected';} ?>
                ><?php echo $operation['name']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="mb-3">
        <label class="form-label">ORIGEM</label>
        <div class="mb-3">
            <input class="form-control" type="number"  id="input_id_origin" attr-value="origin" onchange="getShippingById(this)"  value="<?php echo $request[0]['id_origin']; ?>" />
            <select class="form-select" name="id_origin" id="id_origin" class="element">
                <?php foreach($shippings as $shipping): ?>
                    <option value="<?php echo $shipping['id_shipping']; ?>"
                        <?php if($shipping['id_shipping'] == $request[0]['id_origin']){ echo 'selected';} ?>
                    ><?php echo $shipping['name_shipping']; ?></option>
                <?php endforeach; ?>
            </select>
        </div>
    </div>
    <div class="mb-3">
        <label class="form-label">DESTINO</label>
        <div class="mb-3">
            <input class="form-control" type="number"  id="input_id_destiny" attr-value="destiny" onchange="getShippingById(this)" value="<?php echo $request[0]['id_destiny']; ?>" />
            <select class="form-select" name="id_destiny" id="id_destiny" class="element" >
                <option value="0"></option>
                <?php foreach($shippings as $shipping): ?>
                    <option value="<?php echo $shipping['id_shipping']; ?>"
                    <?php if($shipping['id_shipping'] == $request[0]['id_destiny']){ echo 'selected';} ?>
                    ><?php echo $shipping['name_shipping']; ?></option>
                <?php endforeach; ?>
            </select>
        </div>
    </div>
    <div class="mb-3">
        <label class="form-label">DATA</label>
        <input class="form-control" type="date" name="date_request" id="date_request" class="element" value="<?php echo $request[0]['date_request']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">TIPO DE ORDEM</label>
        <select class="form-select" name="order_request" id="order_request" class="element">
            <?php foreach($order_types as $order): ?>
                <option value="<?php echo $order['id']; ?>"
                    <?php if($order['id'] == $request[0]['id_order_type']){ echo 'selected';} ?>
                ><?php echo $order['name']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="mb-3">
        <label class="form-label">OBSERVAÇÃO</label>
        <textarea class="form-control" name="note_request" id="note_request"><?php echo $request[0]['note']; ?></textarea>
    </div>
    <div class="mb-3">
        <label class="form-label subtitle-pages">COMPOSIÇÃO PEDIDO</label>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 10,00</label>
                <input class="form-control values-input" type="number" class="element" onchange="generateValue(this)" attr-value="10" name="qt_10" id="qt_10" placeholder="0" value="<?php echo $request[0]['qt_10']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" class="input_text" readonly disabled name="qt_text_10" id="qt_text_10" placeholder="0,00" /> 
            </div>
        </div>
         <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 20,00</label>
                <input class="form-control values-input" type="number" class="element" onchange="generateValue(this)" attr-value="20" name="qt_20" id="qt_20" placeholder="0" value="<?php echo $request[0]['qt_20']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" class="input_text" readonly disabled name="qt_text_20" id="qt_text_20" placeholder="0,00" /> 
            </div>
        </div>
         <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 50,00</label>
                <input class="form-control values-input" type="number" class="element" onchange="generateValue(this)" attr-value="50" name="qt_50" id="qt_50" placeholder="0" value="<?php echo $request[0]['qt_50']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input" type="text" class="input_text" readonly disabled name="qt_text_50" id="qt_text_50" placeholder="0,00" /> 
            </div>
        </div>
         <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 100,00</label>
                <input class="form-control values-input" type="number" class="element" onchange="generateValue(this)" attr-value="100" name="qt_100" id="qt_100" placeholder="0" value="<?php echo $request[0]['qt_100']; ?>" />
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
        <button class="btn btn-primary" type="submit">
            <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
        </button>
    </div>
    </div>
</form>
<script type="text/javascript">
    $(window).on("load", function(){
        $vA = $('#qt_10').val();
       $vAtext = ($vA*10) 
       $('#qt_text_10').val($vAtext.toLocaleString('pt-br', {minimumFractionDigits: 2}))

       $vB = $('#qt_20').val();
       $vBtext = ($vB*20)
       $('#qt_text_20').val($vBtext.toLocaleString('pt-br', {minimumFractionDigits: 2}))
       
       $vC = $('#qt_50').val();
       $vCtext = ($vC*50)
       $('#qt_text_50').val($vCtext.toLocaleString('pt-br', {minimumFractionDigits: 2}))
       
       $vD = $('#qt_100').val();
       $vDtext = ($vD*100)
       $('#qt_text_100').val($vDtext.toLocaleString('pt-br', {minimumFractionDigits: 2}))
       $total = $vAtext + $vBtext  + $vCtext + $vDtext
       $('#value_total').val($total.toLocaleString('pt-br', {minimumFractionDigits: 2}))
    })
</script>
<?php $render('footer');  ?>