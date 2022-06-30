<?php $render('header');  ?>
<div>
    <h1 class="title-pages"><?php echo $title_page; ?></h1>
    <div class="box-buttons">
        <a class="btn btn-info" href="<?php echo $base; ?>/request/payment_vacation">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
    <form method="POST" action="<?php echo $base; ?>/request/payment_vacation/edit/<?php echo $payment[0]['id_shipping']; ?>">
        <div class="mb-3">
            <label class="form-label">TRANSPORTADORA</label>
               <input class="form-control values-input" readonly disabled type="text" name="name_shipping" id="name_shipping"
               value="<?php echo $payment[0]['name_shipping']; ?>"
               />
               <input class="form-control values-input" readonly disabled type="hidden" name="id_shipping" id="id_shipping"
               value="<?php echo $payment[0]['id_shipping']; ?>"
               />
        </div>
            <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 10,00</label>
                <input class="form-control values-input" type="number" attr-value="10" name="qt_10" id="qt_10" onchange="generateValue(this)" placeholder="0"
                value="<?php echo $payment[0]['cass_A']; ?>"
                />
                <label class="form-label rotule-values">R$</label>
                <input class="input_text form-control values-input" type="text" readonly disabled name="qt_text_10" id="qt_text_10" placeholder="0,00"  />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 20,00</label>
                <input class="form-control values-input"  type="number" attr-value="20" name="qt_20" id="qt_20" onchange="generateValue(this)" placeholder="0"
                value="<?php echo $payment[0]['cass_B']; ?>"
                />
                <label class="form-label rotule-values">R$</label>
                <input class="input_text form-control values-input" type="text" readonly disabled name="qt_text_20" id="qt_text_20" placeholder="0,00"  />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 50,00</label>
                <input class="form-control values-input"  type="number" attr-value="50" name="qt_50" id="qt_50" onchange="generateValue(this)" placeholder="0"
                value="<?php echo $payment[0]['cass_C']; ?>"
                />
                <label class="form-label rotule-values">R$</label>
                <input class="input_text form-control values-input"  type="text" readonly disabled name="qt_text_50" id="qt_text_50" placeholder="0,00"  />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 100,00</label>
                <input class="form-control values-input"  type="number" attr-value="100" name="qt_100" id="qt_100" onchange="generateValue(this)" placeholder="0"
                value="<?php echo $payment[0]['cass_D']; ?>"
                />
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
            <button class="btn btn-primary">
            <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
            </button>
        </div>
    </form>
</div>
<script type="text/javascript">
    let text = 'qt_text_'
    let value = 0
    $(window).on("load", function(){
        let inputs = document.querySelectorAll('input[type="number"]');
       for(x=0; x<inputs.length;x++){
           atrib = inputs[x].getAttribute('attr-value')

            let destiny = document.getElementById(text+atrib)
            destiny.value = (inputs[x].value * atrib).toLocaleString('pt-br', {minimumFractionDigits: 2})
            value = value + inputs[x].value * atrib
        }
        document.getElementById('value_total').value = value.toLocaleString('pt-br', {minimumFractionDigits: 2})
    })
</script>
<?php $render('footer');  ?>