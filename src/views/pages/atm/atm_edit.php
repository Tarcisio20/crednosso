<?php $render('header');  ?>
<h1 class="title-pages"><?php echo $title_page;  ?></h1>
<div class="mb-3 box-buttons">
    <a class="btn btn-info" href="<?php echo $base; ?>/atm">
        <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
    </a>
</div>
<form method="POST" action="<?php echo $base; ?>/atm/edit/<?php echo $atm[0]['id_atm'];  ?>" >
    <div class="mb-3">
        <label class="form-label">ID</label>
        <input class="form-control" type="number" name="id_atm" id="id_atm" value="<?php echo $atm[0]['id_atm']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">NOME</label>
        <input class="form-control" type="text" name="name_atm" id="name_atm" value="<?php echo $atm[0]['name_atm']; ?>" />
    </div>
    <div class="mb-3">
        <label class="form-label">NOME REDUZIDO</label>
        <input class="form-control" type="text" name="shortened_atm" id="shortened_atm" value="<?php echo $atm[0]['shortened_name_atm']; ?>" />
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
        <label class="form-label">STATUS</label>
        <select class="form-select" name="status_atm" id="status_atm">
                <option value="Y" <?php if($atm[0]['status'] == 'Y'){ echo 'selected';} ?> >ATIVO</option>
                <option value="N" <?php if($atm[0]['status'] == 'N'){ echo 'selected';} ?> >INATIVO</option>
        </select>
    </div>
    <div class="mb-3">
        <label class="form-label">TIPO</label>
        <select class="form-select" name="type_atm" id="type_atm">
            <?php foreach($types as $tp): ?>
                <option value="<?php echo $tp['id']; ?>" 
                <?php if($atm[0]['id_type'] == $tp['id']){ echo 'selected';} ?> >
                    <?php echo $tp['name'];  ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="mb-3">
        <label class="form-label subtitle-pages">CONFIGURAÇÃO CASSETES</label>
        <div class="mb-3">
            <label class="form-label">CASSETE A</label>
            <select class="form-select" name="cass_A" id="cass_A">
                <option value="10" <?php if($atm[0]['cass_A'] == 10){echo 'selected';} ?>>R$ 10,00</option>
                <option value="20" <?php if($atm[0]['cass_A'] == 20){echo 'selected';} ?>>R$ 20,00</option>
                <option value="50" <?php if($atm[0]['cass_A'] == 50){echo 'selected';} ?>>R$ 50,00</option>
                <option value="100" <?php if($atm[0]['cass_A'] == 100){echo 'selected';} ?>>R$ 100,00</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">CASSETE B</label>
            <select class="form-select" name="cass_B" id="cass_B">
                <option value="10" <?php if($atm[0]['cass_B'] == 10){echo 'selected';} ?>>R$ 10,00</option>
                <option value="20" <?php if($atm[0]['cass_B'] == 20){echo 'selected';} ?>>R$ 20,00</option>
                <option value="50" <?php if($atm[0]['cass_B'] == 50){echo 'selected';} ?>>R$ 50,00</option>
                <option value="100" <?php if($atm[0]['cass_B'] == 100){echo 'selected';} ?>>R$ 100,00</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">CASSETE C</label>
            <select class="form-select" name="cass_C" id="cass_C">
                <option value="10" <?php if($atm[0]['cass_C'] == 10){echo 'selected';} ?>>R$ 10,00</option>
                <option value="20" <?php if($atm[0]['cass_C'] == 20){echo 'selected';} ?>>R$ 20,00</option>
                <option value="50" <?php if($atm[0]['cass_C'] == 50){echo 'selected';} ?>>R$ 50,00</option>
                <option value="100" <?php if($atm[0]['cass_C'] == 100){echo 'selected';} ?>>R$ 100,00</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">CASSETE D</label>
            <select class="form-select" name="cass_D" id="cass_D">
                <option value="10" <?php if($atm[0]['cass_D'] == 10){echo 'selected';} ?>>R$ 10,00</option>
                <option value="20" <?php if($atm[0]['cass_D'] == 20){echo 'selected';} ?>>R$ 20,00</option>
                <option value="50" <?php if($atm[0]['cass_D'] == 50){echo 'selected';} ?>>R$ 50,00</option>
                <option value="100" <?php if($atm[0]['cass_D'] == 100){echo 'selected';} ?>>R$ 100,00</option>
            </select>
        </div>
    </div>
    <div class="mb-3 box-buttons">
        <button class="btn btn-primary" type="submit">
            <i class="fa-regular fa-pen-to-square f-s-b-20"></i> Editar
        </button>
    </div>
</form>
<?php $render('footer');  ?>