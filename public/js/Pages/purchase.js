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

        // Fill header form with supplier information 
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

        // check if the supplier is registered
        xmlHttpGet(
          "/Api/Supplier/",
          () => {
            success(() => {
              let response = JSON.parse(xhttp.responseText);
              console.log(response);
              if (response.length === 0) {
                return Swal.fire(
                  "Aviso!",
                  "Fornecedor não cadastrado!",
                  "warning"
                );
              } 
              else 
              {
                // Clear Data Table
                $('tbody').html('')

                for (let i = 0; i < ArrayProdutos.length; i++) {
                  let tr = document.createElement("tr");
                  let td1 = document.createElement("td");
                  let td2 = document.createElement("td");
                  let td3 = document.createElement("td");
                  let td4 = document.createElement("td");
                  let td5 = document.createElement("td");
                  let td6 = document.createElement("td");
                  let td7 = document.createElement("td");
                    // Create a button viewer
                  let BtnView = document.createElement("button");
                  BtnView.type = "button";
                  BtnView.setAttribute("class", "btn social-btn btn-dribbble");
                  BtnView.setAttribute("onclick", "LinkProduct(this)");
                  BtnView.innerHTML = '<i class="ik ik-paperclip"></i>';


                  td1.innerHTML = NFe.getElementsByTagName("cProd")[i].innerHTML;

                  if(response[0].Product == undefined){
                    tr.setAttribute("class", "table-danger");
                    td2.innerHTML = NFe.getElementsByTagName("xProd")[i].innerHTML;
                  }
                  else{
                    for (let ii = 0; ii < response.length; ii++) {
                      if (response[ii].Product.CodSupplier ==  NFe.getElementsByTagName("cProd")[i].innerHTML) {
                        BtnView.setAttribute("class", "btn btn-icon btn-outline-primary");
                        BtnView.innerHTML = '<i class="ik ik-edit-2"></i>'; 
  
                        BtnView.value = response[ii].Product.CodProduct;
                        td2.innerHTML = response[ii].Product.Description;
                        tr.classList.remove("table-danger");
                        break;
                      } else {
                        tr.setAttribute("class", "table-danger");
                        td2.innerHTML = NFe.getElementsByTagName("xProd")[i].innerHTML;
                      }
                    }
                  }
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
                // footer Data Table with total value
                total_produto.html(
                  NFe.getElementsByTagName("vNF")[0].innerHTML
                );
              }
            });
          },
          NFe.getElementsByTagName("CNPJ")[0].innerHTML
        );
      });
    });
  }

  window.LinkProduct = function (e) {
    let CodFor = e.parentElement.parentElement.firstElementChild.innerHTML;
    let Class = e.className;
    let NameProduct = e.parentElement.parentElement.getElementsByTagName('td')[1].innerHTML;

    
    if(Class === 'btn btn-icon btn-outline-warning')
    {
      $("#SelectProduct")[0].selectedIndex = 0;
    }
    else if(Class === 'btn btn-icon btn-outline-primary')
    {
      for (let i = 0; i < $('option').length; i++) {
        if(e.value === $('option')[i].value){
          $("#SelectProduct")[0].selectedIndex = [i];
          break
        } 
      }
    }

    $('.modal-title').html('[ ' + NameProduct + ' ]')
    $("#CodFor").val(CodFor);
    $("#myModal").modal()
    
  };

  $("#Btn_Vincular").on("click", function () {
    let Data = {
      CNPJSupplier: $("#CNPJ").val(),
      CodSupplier: $("#CodFor").val(),
      IdProduct: $("#SelectProduct").val(),
    };

    xmlHttpPostJson(
      "/Api/LinkProduct",
      () => {
        success(() => {
          let response = xhttp.responseText;

          if (response === "success") {
            alert("Product Linked successful");
            FillInputsXml();
          } else [alert("error" + response)];
        });
      },
      JSON.stringify(Data)
    );

    
    // close Modal
    $("#myModal").modal("toggle");
  });

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
});
