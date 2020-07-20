$(document).ready(function () {
  "use strict";

  $(".file-upload-info").on("click", function () {
    $("#form_entrada").trigger("reset");
    $("tbody").html("");
    $("#total_produto").html("");

    // get Input and click him
    let file = $(this).parent().parent().find(".file-upload-default");
    file.trigger("click");
  });

  $(".file-upload-default").on("change", function () {
    $(".file-upload-info").val(this.files[0].name);

    FillInputsXml();
  });

  function FillInputsXml() {
    // Inputs
    let NrNFe = $("#NrNFe");
    let Fornecedor = $("#Fornecedor");
    let CNPJ = $("#CNPJ");
    let IE = $("#IE");
    let Endereco = $("#Endereco");
    let Bairro = $("#Bairro");
    let CEP = $("#CEP");
    let Municipio = $("#Municipio");
    let Emissao = $("#Emissao");
    let Entrada = $("#Entrada");
    let total_produto = $("#total_produto");

    var FileXML = document.getElementById("FileXML");
    var XML = FileXML.files[0];

    if (XML.type.indexOf("xml") == -1) return;

    var url = URL.createObjectURL(XML);

    xmlHttpGet(url, () => {
      success(() => {
        var NFe = xhttp.responseXML;
        var ArrayProdutos = NFe.getElementsByTagName("prod");
        var tbody = document.querySelector("tbody");

        NrNFe.val(NFe.getElementsByTagName("cNF")[0].innerHTML);
        Fornecedor.val(NFe.getElementsByTagName("xNome")[0].innerHTML);
        CNPJ.val(NFe.getElementsByTagName("CNPJ")[0].innerHTML);
        IE.val(NFe.getElementsByTagName("IE")[0].innerHTML);
        Endereco.val(NFe.getElementsByTagName("xLgr")[0].innerHTML);
        Bairro.val(NFe.getElementsByTagName("xBairro")[0].innerHTML);
        CEP.val(NFe.getElementsByTagName("CEP")[0].innerHTML);
        Municipio.val(NFe.getElementsByTagName("xMun")[0].innerHTML);
        Emissao.val(
          moment(NFe.getElementsByTagName("dhEmi")[0].innerHTML).format(
            "DD/MM/YYYY"
          )
        );
        Entrada.val(
          moment(NFe.getElementsByTagName("dhSaiEnt")[0].innerHTML).format(
            "DD/MM/YYYY"
          )
        );
        total_produto.html(NFe.getElementsByTagName("vNF")[0].innerHTML);

        for (let i = 0; i < ArrayProdutos.length; i++) {
          var tr = document.createElement("tr");
          let td1 = document.createElement("td");
          let td2 = document.createElement("td");
          let td3 = document.createElement("td");
          let td4 = document.createElement("td");
          let td5 = document.createElement("td");
          let td6 = document.createElement("td");
          let td7 = document.createElement("td");

          let BtnView = document.createElement("button");
          BtnView.type = "button";
          BtnView.setAttribute("class", "btn btn-link btn-rounded");
          // BtnView.setAttribute("data-toggle", "modal");
          // BtnView.setAttribute("data-target", "#Modal");
          BtnView.setAttribute("onclick", "teste(this)");
          BtnView.innerHTML = '<i class="fas fa-ellipsis-v"></i>';

          td1.innerHTML = NFe.getElementsByTagName("cProd")[i].innerHTML;
          td2.innerHTML = NFe.getElementsByTagName("xProd")[i].innerHTML;
          td3.innerHTML = NFe.getElementsByTagName("uCom")[i].innerHTML;
          td4.innerHTML = NFe.getElementsByTagName("qCom")[i].innerHTML;
          td5.innerHTML = NFe.getElementsByTagName("vUnCom")[i].innerHTML;
          td6.innerHTML = NFe.getElementsByTagName("vProd")[i].innerHTML;
          td7.append(BtnView);

          tr.append(td1);
          tr.append(td2);
          tr.append(td3);
          tr.append(td4);
          tr.append(td5);
          tr.append(td6);
          tr.append(td7);
          tbody.append(tr);
        }
      });
    });
    setTimeout(() => {
      xmlHttpGet(
        "/Api/Supplier/",
        () => {
          success(() => {
            if (xhttp.responseText === "") {
              return Swal.fire(
                "Aviso!",
                "Fornecedor não cadastrado!",
                "warning"
              );
            }
          });
        },
        $("#CNPJ").val()
      );
    }, 500);
  }

  window.teste = function (e) {
    let CodFor = e.parentElement.parentElement.firstElementChild.innerHTML;

    $("#CodFor").val(CodFor);
    $("#SelectProduct")[0].selectedIndex = 0;
    $("#myModal").modal();
  };
  // load all products and fill the select modal
  xmlHttpGet("/Api/AllProduct", () => {
    success(() => {
      let response = JSON.parse(xhttp.responseText);
      let Products = "";
      for (let i = 0; i < response.length; i++) {
        Products += `<option value="${response[i]._id}">${response[i].Description}</option>`;
      }
      $("#SelectProduct").html(Products);
    });
  });

  $("#Btn_Vincular").on("click", function () {
    let Data = {
      CNPJSupplier: $('#CNPJ').val(),
      CodSupplier: $("#CodFor").val(),
      IdProduct: $("#SelectProduct").val(),
    };

    xmlHttpPostJson(
      "/Api/LinkProduct",
      () => {
        success(() => {
          let response = xhttp.responseText;

          if(response === 'success'){
            alert('Product Linked successful')
          }else[
            alert('error' + response)
          ]
        });
      },
      JSON.stringify(Data)
    );

    // close Modal
    $("#myModal").modal("toggle");
  });
});
