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
      Emissao.val(NFe.getElementsByTagName("dhEmi")[0].innerHTML);
      Entrada.val(NFe.getElementsByTagName("dhSaiEnt")[0].innerHTML);
      total_produto.html(NFe.getElementsByTagName("vNF")[0].innerHTML);



      for (let i = 0; i < ArrayProdutos.length; i++) {
        var tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        let td5 = document.createElement("td");
        let td6 = document.createElement("td");

        td1.innerHTML = NFe.getElementsByTagName("cProd")[i].innerHTML;
        td2.innerHTML = NFe.getElementsByTagName("xProd")[i].innerHTML;
        td3.innerHTML = NFe.getElementsByTagName("uCom")[i].innerHTML;
        td4.innerHTML = NFe.getElementsByTagName("qCom")[i].innerHTML;
        td5.innerHTML = NFe.getElementsByTagName("vUnCom")[i].innerHTML;
        td6.innerHTML = NFe.getElementsByTagName("vProd")[i].innerHTML;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tbody.appendChild(tr);
      }

      
    });
  });
}
