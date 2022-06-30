<?php $render('header'); ?>
<h1 class="title-pages"><?php echo $title_page; ?></h1>
<div>
    
        <div class="mb-3">
            <label class="form-label">ID</label>
            <input class="form-control"  type="text" readonly disabled name="id_treasury" id="id_treasury" value="<?php echo $treasury[0]['id_shipping']; ?>" />
        </div>
        <div class="mb-3">
            <label class="form-label">NOME TRANSPORTADORA</label>
            <input class="form-control"  type="text" readonly disabled name="name_treasury" id="name_treasury" value="<?php echo $treasury[0]['name_shipping']; ?>" />
        </div>
    
    <div class="mb-3">
        <label class="form-label subtitle-pages">SALDO ATUAL</label>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 10,00</label>
                <input class="form-control values-input"  type="number" readonly disabled attr-value="10" name="value-10" id="value-10"  value="<?php echo $treasury[0]['a_10']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input"  type="text" readonly disabled name="value-text-10" id="value-text-10" value="<?php echo number_format(($treasury[0]['a_10']*10), 2); ?>" />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 20,00</label>
                <input class="form-control values-input"  type="number" readonly disabled attr-value="20" name="value-20" id="value-20" value="<?php echo $treasury[0]['b_20']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input"  type="text" readonly disabled name="value-text-20" id="value-text-20" value="<?php echo number_format(($treasury[0]['b_20']*20), 2); ?>" />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 50,00</label>
                <input class="form-control values-input"  type="number" readonly disabled attr-value="50" name="value-50" id="value-50" value="<?php echo $treasury[0]['c_50']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input"  type="text" readonly disabled name="value-text-50" id="value-text-50" value="<?php echo number_format(($treasury[0]['c_50']*50), 2); ?>" />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">R$ 100,00</label>
                <input class="form-control values-input"  type="number" readonly disabled attr-value="100" name="value-100" id="value-100" value="<?php echo $treasury[0]['d_100']; ?>" />
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input"  type="text" readonly disabled name="value-text-100" id="value-text-100" value="<?php echo number_format(($treasury[0]['d_100']*100), 2); ?>" />
            </div>
        </div>
        <div class="mb-3">
            <div class="container-for-values">
                <label class="form-label rotule-values">TOTAL</label>
                <label class="form-label rotule-values">R$</label>
                <input class="form-control values-input"  type="text" readonly disabled name="value-total" id="value-total" 
                value="<?php echo number_format((($treasury[0]['a_10']*10)+($treasury[0]['b_20']*20)+($treasury[0]['c_50']*50)+($treasury[0]['d_100']*100)), 2); ?>" />
            </div>
        </div>
    </div>
</div>
<form method="POST" action="<?php echo $base; ?>/treasury/add/<?php echo $treasury[0]['id_shipping']; ?>">
    <label class="form-label subtitle-pages">MOVIMENTAÇÃO DE SALDO</label>
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
    <div class="mb-3">
        <label class="form-label">TIPO</label>
        <select class="form-select" name="type_move" id="type_move">
            <option value="adc">ADICIONAR</option>
            <option value="sub">SUBTRAIR</option>
        </select>
    </div>
    <div class="mb-3 box-buttons">
        <button class="btn btn-success" type="submit">
            <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
        </button>
        <a class="btn btn-info" href="<?php echo $base; ?>/shipping">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
</form>
<?php $render('footer'); ?>