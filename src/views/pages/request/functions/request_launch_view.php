<?php $render('header');  ?>
<div class="Content" id="Content" >
    <div class="container-name-date">
        <div>   
            <h1 class="title-pages"><?php echo $title_page; ?>
            <span id="name_request"></span></h1>
        </div>
        <div id="date"></div>
    </div>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr class="align-bottom">
                    <td scope="col" >CONTA</td>
                    <td scope="col" >TESOURARIA</td>
                    <td scope="col" >REGIÃO</td>
                    <td scope="col" >VALOR</td>
                    <td scope="col" >OBSERVAÇÃO</td>
                </tr>
            </thead>
            <tbody id="corpo">
                
            </tbody>
        </table>
    </div>
</div>
<script type="text/javascript">
    let ids = "<?php echo $requests; ?>"
    let url = "<?php echo $base; ?>"
    let newIds = ids.split('-')
    let string = ''
    newIds.map((item, index) => {
      if (index + 1 < newIds.length) {
        string += item + ",";
      } else {
        string += item;
      }
    })
    data = {
        checados: string,
    };
  $.ajax({
    url: url + "/request/functions/launch_action",
    type: "POST",
    data: data,
  })
    .done(function (response) {
        const elements = JSON.parse(response)
        console.log(elements)
        let mateusAndPosterus = elements.filter(item => {
            if(item.name_operation == 'Retirada loja' || 
            item.name_operation == 'Transferencia entre custodia'){
                return item
            }
        })

        let mateus = mateusAndPosterus.filter(item => {
            if(item.gmcore_origin != '15'){
                return item
            }
        })

        let posterus = mateusAndPosterus.filter(item => {
            if(item.gmcore_origin == '15'){
                return item
            }
        })

        let entreTesourarias = elements.filter(item => {
            if(item.name_operation == 'Entre tesourarias'){
                return item
            }
        })

        let banco = elements.filter(item => {
            if(item.name_operation == 'Santander' || item.name_operation == 'Seret BB'){
                return item
            }
        })

        if(mateus.length > 0){
            let html = ''
            let dataRequest
            let valueTotal = 0
            mateus.map((item, index)=> {
                let value = item.value_request
                valueTotal = valueTotal + parseFloat(item.value_request)
                dataRequest = item.date_request
                value = parseFloat(value).toLocaleString('pt-br', {minimumFractionDigits: 2})
                html = html + `<tr>
                    <td>${item.account_origin}</td>
                    <td>${item.shipping_origin}</td>
                    <td>${item.region_origin}</td>
                    <td>R$ ${value}</td>
                    <td>${item.note_request}</td>
                </tr>`
            })

            valueTotal = valueTotal.toLocaleString('pt-br', {minimumFractionDigits: 2})

            html = html + `<tr class="row-value-total">
                <td>VALOR TOTAL</td>
                <td></td>
                <td></td>
                <td>R$ ${valueTotal}</td>
                <td></td>
            </tr>`

            document.getElementById('date').innerHTML = dataRequest.split('-').reverse().join('/')
            document.getElementById('name_request').innerHTML = 'Mateus'
            let corpo = document.getElementById('corpo')
            corpo.innerHTML = html

            let archiveName = 'pedido-'+dataRequest.split('-').reverse().join('')+'-mateus'

            let element = document.getElementById('Content')

            generatePDF(element, archiveName)
 
        }

        let html = ''
        let dataRequest
        let valueTotal = 0

        if(posterus.length > 0){
            posterus.map((item, index)=> {
                let value = item.value_request
                valueTotal = valueTotal + parseFloat(item.value_request)
                dataRequest = item.date_request
                value = parseFloat(value).toLocaleString('pt-br', {minimumFractionDigits: 2})
                html = html + `<tr>
                    <td>${item.account_origin}</td>
                    <td>${item.shipping_origin}</td>
                    <td>${item.region_origin}</td>
                    <td>R$ ${value}</td>
                    <td>${item.note_request}</td>
                </tr>`
            })
            valueTotal = valueTotal.toLocaleString('pt-br', {minimumFractionDigits: 2})

            html = html + `<tr class="row-value-total">
                <td>VALOR TOTAL</td>
                <td></td>
                <td></td>
                <td>R$ ${valueTotal}</td>
                <td></td>
            </tr>`

            document.getElementById('date').innerHTML = dataRequest.split('-').reverse().join('/')
            document.getElementById('name_request').innerHTML = 'Posterus'
            let corpo = document.getElementById('corpo')
            corpo.innerHTML = html

            let archiveName = 'pedido-'+dataRequest.split('-').reverse().join('')+'-posterus'

            let element = document.getElementById('Content')

            generatePDF(element, archiveName)
        }

        if(entreTesourarias.length > 0){
            array['entre-tesourarias'] = entreTesourarias
            cont = cont + 1
        }

        if(banco.length > 0){
            array['banco'] = banco
            cont = cont + 1
        }
      

    //  window.location.replace(url + "/request/search")
    })
    .fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    })
    .always(function () {
      console.log("completou");
    });

</script>
<?php $render('footer');  ?>