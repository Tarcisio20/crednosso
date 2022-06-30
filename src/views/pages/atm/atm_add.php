<?php $render('header');  ?>
<h1 class="title-pages"><?php echo $title_page;  ?></h1>
<div class="mb-3 box-buttons">
    <a class="btn btn-info" href="<?php echo $base; ?>/atm">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
</div>
<form method="POST" action="<?php echo $base; ?>/atm/add">
    <div class="mb-3">
        <label class="form-label">ID</label>
        <input class="form-control" type="number" name="id_atm" id="id_atm" />
    </div>
    <div class="mb-3">
        <label class="form-label">NOME</label>
        <input class="form-control" type="text" name="name_atm" id="name_atm" />
    </div>
    <div class="mb-3">
        <label class="form-label">NOME REDUZIDO</label>
        <input class="form-control" type="text" name="shortened_atm" id="shortened_atm" />
    </div>
    <div class="mb-3">
        <label class="form-label">TRANSPORTADORA</label>
        <div class="mb-3 container-for-values">
            <input class="form-control rotule-for-input" class="form-control" type="number"  id="input_id_atm" attr-value="treasury" onchange="getShippingById(this)" />
            <select class="form-select" name="id_treasury" id="id_treasury">
                <option value="0"></option>
                <?php foreach($shippings as $shipping): ?>
                    <option value="<?php echo $shipping['id_shipping']; ?>" ><?php echo $shipping['name_shipping']; ?></option>
                <?php endforeach; ?>
            </select>
        </div>
    </div>
    <div class="mb-3">
        <label class="form-label">TIPO DE EQUIPAMENTO</label>
        <select class="form-select" name="id_type" id="id_type">
            <?php foreach($types as $tp): ?>
                <option value="<?php echo $tp['id']; ?>" ><?php echo $tp['name']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="mb-3">
        <label class="form-label subtitle-pages">CONFIGURAÇÃO DOS CASSETES</label>
        <div class="mb-3">
            <label class="form-label">CASSETE A</label>
            <select class="form-select" name="cass_A" id="cass_A">
                <option value="10" selected>R$ 10,00</option>
                <option value="20">R$ 20,00</option>
                <option value="50">R$ 50,00</option>
                <option value="100">R$ 100,00</option>
            </select>
        </div>
         <div class="mb-3">
            <label class="form-label">CASSETE B</label>
            <select class="form-select" name="cass_B" id="cass_B">
                <option value="10" >R$ 10,00</option>
                <option value="20" selected>R$ 20,00</option>
                <option value="50">R$ 50,00</option>
                <option value="100">R$ 100,00</option>
            </select>
        </div>
         <div class="mb-3">
            <label class="form-label">CASSETE C</label>
            <select class="form-select" name="cass_C" id="cass_C">
                <option value="10" >R$ 10,00</option>
                <option value="20">R$ 20,00</option>
                <option value="50" selected>R$ 50,00</option>
                <option value="100">R$ 100,00</option>
            </select>
        </div>
         <div class="mb-3">
            <label class="form-label">CASSETE D</label>
            <select class="form-select" name="cass_D" id="cass_D">
                <option value="10" >R$ 10,00</option>
                <option value="20">R$ 20,00</option>
                <option value="50">R$ 50,00</option>
                <option value="100" selected>R$ 100,00</option>
            </select>
        </div>
    </div>
    <div class="mb-3" class="box-buttons">
        <button class="btn btn-success" type="submit">
            <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
        </button>
    </div>
</form>

<?php $render('footer');  ?>