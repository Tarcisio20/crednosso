<?php $render('header'); ?>
    <h1 class="title-pages"><?php echo $title_page;?></h1>
    <div class="mb-3 box-buttons">
         <a class="btn btn-info" href="<?php echo $base; ?>/shipping">
            <i class="fa-solid fa-angles-left f-s-b-20"></i> Voltar
        </a>
    </div>
    <form method="POST" action="<?php echo $base; ?>/shipping/add">
        <div class="mb-3">
            <label class="form-label">ID</label>
            <input class="form-control" type="number" name="id_shipping" id="id_shipping" />
        </div>
        <div class="mb-3">
            <label class="form-label">NOME</label>
            <input class="form-control" type="text" name="name_shipping" id="name_shipping" />
        </div>
        <div class="mb-3">
            <div class="container-for-text">
                <label class="form-label">E-MAILS</label>
                <small class="form-label text-small">Coloque todos os emails separados por ";".</small>
            </div>
            <textarea class="form-control" name="emails_shipping" id="emails_shipping" placeholder="email@email.com,email2@email.com" ></textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">REGIÃO</label>
            <div class="container-for-values">
                <input class="form-control rotule-for-input" type="number" attr-value="region" onchange="getShippingById(this)" />
                <select class="form-select" name="id_region" id="id_region">
                    <option value="0"></option>
                    <?php foreach($regions as $region): ?>
                        <option value="<?php echo $region['id_region']; ?>" >
                            <?php echo $region['id_region'].' - '.$region['name']; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">GMCORE</label>
            <input class="form-control" type="text" name="gmcore_shipping" id="gmcore_shipping" />
        </div>
        <div class="mb-3">
            <label class="form-label">STATUS</label>
            <select class="form-select" name="active_shipping" id="active_shipping">
                <option value="Y" >ATIVO</option>
                <option value="N" >INATIVO</option>
            </select>
        </div>
         <div class="mb-3">
            <label class="form-label">TIPO</label>
            <select class="form-select" name="type_shipping" id="type_shipping">
                <?php foreach($types as $type): ?>
                    <option value="<?php echo $type['id']; ?>"
                        <?php if($type['id'] == 2){ echo 'selected';} ?>
                    >
                        <?php echo $type['name']; ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">EMPRESA</label>
            <select class="form-select" name="company_shipping" id="company_shipping">
                    <option value="2">MATEUS</option>
                    <option value="15">POSTERUS</option>
            </select>
        </div>
        <div class="mb-3" class="box-buttons">
            <button class="btn btn-success" type="submit" >
                <i class="fa-solid fa-cloud-arrow-up f-s-b-20"></i> Salvar
            </button>
        </div>
    </form>
    <?php $render('footer'); ?>