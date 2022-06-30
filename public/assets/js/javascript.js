// FUNÇÕES DA TELA Request@add
function generateValue(element) {
  const partial = "qt_";
  const partialText = "qt_text_";
  let attribute = element.getAttribute("attr-value");
  let elementText = document.getElementById(partialText + attribute);

  elementText.value = (element.value * attribute).toLocaleString("pt-br", {
    minimumFractionDigits: 2,
  });
  toUpdateValueTotal();
}

function toUpdateValueTotal() {
  elements = document.querySelectorAll(".input_text");
  let valueTotal = 0.0;
  elements.forEach((item) => {
    if (item.value !== "") {
      valueTotal = valueTotal + parseFloat(getMoney(item.value));
    }
    document.getElementById("value_total").value = valueTotal.toLocaleString(
      "pt-br",
      { minimumFractionDigits: 2 }
    );
  });
}

function getMoney(str) {
  return str
    .replace(/[^\d,]+/g, "") // Remove caracteres desnecessários.
    .replace(",", "."); // Troca o separador decimal (`,` -> `.`)
}

function getShippingById(element) {
  let value_input = element.value;
  let attr = element.getAttribute("attr-value");

  $("#id_" + attr)
    .find("option")
    .each(function () {
      let vl = $(this).val();
      if (vl == value_input) {
        $(this).attr("selected", true);
      }
    });
}

function functionConfirmChek(url) {
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
  });

  if (checados.length == 0) {
    document.getElementById("msg").innerHTML =
      "Precisa selecionar algum dos pedidos!";
  } else {
    let string = "";
    checados.map((item, index) => {
      if (index + 1 < checados.length) {
        string += item + ",";
      } else {
        string += item;
      }
    });

    let dateInitial = document.getElementById("date_initial").value;
    let dateFinal = document.getElementById("date_final").value;
    string = {
      checados: string,
      dateInitial: dateInitial,
      dateFinal: dateFinal,
    };

    $.ajax({
      url: url + "/request/search/ajax",
      type: "POST",
      data: string,
    })
      .done(function (response) {
        console.log(response);
        window.location.replace(url + "/request/search");
        $("#date_initial").val(dateInitial);
        $("#date_final").val(dateFinal);
        document.getElementById("pesquisar").click();
      })
      .fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      })
      .always(function () {
        console.log("completou");
      });
  }
}

function functionConfirmPartial(url) {
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
  });
  if (checados.length > 0) {
    let string = "";
    checados.map((item, index) => {
      if (index + 1 < checados.length) {
        string += item + ",";
      } else {
        string += item;
      }
    });

    let dateInitial = document.getElementById("date_initial").value;
    let dateFinal = document.getElementById("date_final").value;

    let array = [];

    stringValus = "";
    let cassA = document.getElementById("modal_10").value;
    let cassB = document.getElementById("modal_20").value;
    let cassC = document.getElementById("modal_50").value;
    let cassD = document.getElementById("modal_100").value;
    stringValus += cassA != "" ? "cass_A=" + cassA + "&" : "cass_A=0&";
    stringValus += cassB != "" ? "cass_B=" + cassB + "&" : "cass_B=0&";
    stringValus += cassC != "" ? "cass_C=" + cassC + "&" : "cass_C=0&";
    stringValus += cassD != "" ? "cass_D=" + cassD : "cass_D=0";

    string = {
      checados: string,
      dateInitial: dateInitial,
      dateFinal: dateFinal,
      values: stringValus,
    };

    $.ajax({
      url: url + "/request/search/partial",
      type: "POST",
      data: string,
    })
      .done(function (response) {
        console.log(response);
        window.location.replace(url + "/request/search");
        $("#date_initial").val(dateInitial);
        $("#date_final").val(dateFinal);
        document.getElementById("pesquisar").click();
      })
      .fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      })
      .always(function () {
        console.log("completou");
      });
  } else {
    closeModal();
  }
}

function openModalConfirmParcial(url) {
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
    console.log(this);
  });
  console.log(checados.length);
  if (checados.length > 0) {
    $("#modal").css({ opacity: "1" });
    $("#modal").css({ display: "block" });
    $("#modal").css({ pointerEvents: "auto" });
  } else {
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }
}

function openModalRelaunch(url) {
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
    console.log(this);
  });

  if (checados.length > 0) {
    $("#modalDate").css({ opacity: "1" });
    $("#modalDate").css({ display: "block" });
    $("#modalDate").css({ pointerEvents: "auto" });
  } else {
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }
}

function generateValueInModal(element) {
  const partialText = "modal_text_";
  let attribute = element.getAttribute("attr-value");
  let elementText = document.getElementById(partialText + attribute);

  elementText.value = (element.value * attribute).toLocaleString("pt-br", {
    minimumFractionDigits: 2,
  });
  toUpdateValueTotalInModal();
}

function viewRequest(url){
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
  });

  if (checados.length > 1) {
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Para essa função só pode ser selecionado 1 elemento!'
    console.log(boxMsg.innerHTML)
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }else if(checados.length == 1){
    window.location.replace(url + "/request/view/"+checados[0]); 
  } else {
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }
}

function toUpdateValueTotalInModal() {
  elements = document.querySelectorAll(".input_modal_text");
  let valueTotal = 0.0;
  elements.forEach((item) => {
    if (item.value !== "") {
      valueTotal = valueTotal + parseFloat(getMoney(item.value));
    }
    document.getElementById("value_total_modal").value =
      valueTotal.toLocaleString("pt-br", { minimumFractionDigits: 2 });
  });
}

function closeModal(element) {
  el = element.getAttribute("attr-name");
  $("#" + el).css({ opacity: "0" });
  $("#" + el).css({ pointerEvents: "none" });
}

function cancelSupplieSelecteds(url) {
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
  });
  if (checados.length == 0) {
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  } else {
    let string = "";
    checados.map((item, index) => {
      if (index + 1 < checados.length) {
        string += item + ",";
      } else {
        string += item;
      }
    });
    let shipping = document.getElementById("id_shipping").value;
    string = {
      checados: string,
      shipping: shipping,
    };

    $.ajax({
      url: url + "/supplie/cancel",
      type: "POST",
      data: string,
    })
      .done(function (response) {
        console.log(response);
        window.location.replace(url + "/supplie/view/" + shipping);
      })
      .fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      })
      .always(function () {
        console.log("completou");
      });
    //TERMINAR FUNCAO
  }
}

function devideInAtms(url) {
  let atms = [],
    val;
  $("#id_atm option").each(function () {
    (val = $(this).val()) && atms.push(val);
  });

  if (atms.length == 0) {
    document.getElementById("msg").innerHTML =
      "Sem itens para serem selecionados!";
  } else {
    let string = "";
    atms.map((item, index) => {
      if (index + 1 < atms.length) {
        string += item + ",";
      } else {
        string += item;
      }
    });

    let id_shipping = document.getElementById("id_shipping").value;
    let date = document.getElementById("date_supplie").value;
    data = {
      atms: string,
      date_supplie: date,
      shipping: id_shipping,
    };

    $.ajax({
      url: url + "/supplie/devide",
      type: "POST",
      data: data,
    })
      .done(function (response) {
        console.log(response);
        window.location.replace(url + "/supplie/view/" + id_shipping);
      })
      .fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      })
      .always(function () {
        console.log("completou");
      });
  }
}

function openForSearch(event, url) {
  event.preventDefault();

  let id_shipping = document.getElementById("id_shipping").value;
  console.log(id_shipping);
  window.location.replace(url + "/shipping/edit/" + id_shipping);
}

function saveNewDate(url) {
  let newDate = document.getElementById("new-date");
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
  });
  let string = "";
  checados.map((item, index) => {
    if (index + 1 < checados.length) {
      string += item + ",";
    } else {
      string += item;
    }
  });
  data = {
    new_date: newDate.value,
    checados: string,
  };

  let data_initial = document.getElementById("date_initial").value;
  let date_final = document.getElementById("date_final").value;

  $.ajax({
    url: url + "/request/new_date",
    type: "POST",
    data: data,
  })
    .done(function (response) {
      console.log(response);
      window.location.replace(url + "/request/search");
      $("#date_initial").val(dateInitial);
      $("#date_final").val(dateFinal);
      document.getElementById("pesquisar").click();
    })
    .fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    })
    .always(function () {
      console.log("completou");
    });
}

function openForSearchAtm(event, url) {
  event.preventDefault();

  let id_atm = document.getElementById("id_atm").value;
  window.location.replace(url + "/atm/edit/" + id_atm);
}

function SearchContestation(event, url) {
  event.preventDefault();
  let text = document.getElementById("search_contestation").value;
  if (text != "") {
    window.location.replace(url + "/contestation/view/" + text);
  } else {
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }
}

function SearchGeneric(event, url) {
  event.preventDefault();
  let batch = document.getElementById("search_batch").value;
  if (batch != "") {
    window.location.replace(url + "/batch/search/" + batch);
  } else {
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }
}

function SearchTreasury(event, url) {
  event.preventDefault();
  let treasury = document.getElementById("id_treasury").value;
  if (treasury != "0") {
    window.location.replace(url + "/treasury/add/" + treasury);
  } else {
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }
}

function selectAll(element) {
  let checkboxs = document.querySelectorAll(".setados");
  if (element.checked) {
    for ($x = 0; $x < checkboxs.length; $x++) {
      checkboxs[$x].checked = true;
    }
  } else {
    for ($x = 0; $x < checkboxs.length; $x++) {
      checkboxs[$x].checked = false;
    }
  }
}


function generateLaunch(url){
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
  });

  if(checados.length > 0){
    let string = "";
    checados.map((item, index) => {
      if (index + 1 < checados.length) {
        string += item + ",";
      } else {
        string += item;
      }
    });
    
    check = {
      checados : string
    }

    $.ajax({
      url: url + "/request/functions/launch_action",
      type: "POST",
      data: check,
    })
      .done(function (response) {
        let res = JSON.parse(response)
        res = res.integrity.replace('.', '-')
        window.location.replace(url + "/request/pdf/view/" + res);
      })
      .fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      })
      .always(function () {
        console.log("completou");
      });

   
  }else{
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }
}

async function generatePDF(element, name){

    let opt = {
      margin: 1,
      filename : name,
      pagebreak: { mode: 'avoid' },
      html2canvas : { scale : 2 },
      jsPDF : {
        unit : 'in',
        format : 'a4',
        orientation : 'landscape' //landscape | portrait 
      }
    }

    await html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf){

    /*const perBlob = pdf.output('blob');

    var formData = new FormData();
    formData.append('file', perBlob, opt.filename);
    await $.ajax({
      url: "http://localhost/crednosso/public/request/functions/generate_pdf",
      type: "POST",
      data: formData,
    })
      .done(function (response) {
        console.log(response);
        
      })
      .fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      })
      .always(function () {
        console.log("completou");
      });*/
  }).save();
  await setTimeout(function(){

  }, 3000)
}

function downloadFileAll(url, integrity){
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
  });

  if(checados.length > 0){ 
    let inte = integrity.replace('.', '-')
    window.location.replace(url + "/request/pdf/download_all/"+inte);
    
  }else{
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }
}

function gerateReport(url){
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
  });

  if(checados.length > 0){ 
    let string = "";
    checados.map((item, index) => {
      if (index + 1 < checados.length) {
        string += item + "-";
      } else {
        string += item;
      }
    });
    
    window.location.replace(url + "/request/pdf/report/"+string);
    
  }else{
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }
}

function generatePaymment(url){
  let checados = [];
  $.each($("input[name='setados[]']:checked"), function () {
    checados.push($(this).val());
  });

  if(checados.length > 0){ 
    let string = "";
    checados.map((item, index) => {
      if (index + 1 < checados.length) {
        string += item + "-";
      } else {
        string += item;
      }
    });
    console.log(checados)
    window.location.replace(url + "/request/pdf/paymment/"+string);
    
  }else{
    let boxMsg = document.querySelector('.text-messege')
    boxMsg.innerHTML = 'Precisamos que seja selecionado algum item para proseguir!'
    $("#modalError").css({ opacity: "1" });
    $("#modalError").css({ display: "block" });
    $("#modalError").css({ pointerEvents: "auto" });
  }

}
