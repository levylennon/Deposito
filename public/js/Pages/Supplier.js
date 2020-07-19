$(document).ready(function () {
  "use strict";

  $("#SelectTipo").on("change", function () {
    if (this.value == "PJ") {
      document.getElementById(
        "InputCNPJ"
      ).parentElement.parentElement.firstElementChild.innerHTML = "CNPJ";
      $("#InputCPNJ").mask("00.000.000/0000-00", { reverse: true }).val("");
    } else if (this.value == "PF") {
      document.getElementById(
        "InputCNPJ"
      ).parentElement.parentElement.firstElementChild.innerHTML = "CPF";
      $("#InputCPNJ").mask("000.000.000-00").val("");
    }
  });
  $("#ButtonCEP").on("click", function () {
    let CEP = $("#InputCEP").val();

    xmlHttpGet("https://viacep.com.br/ws/" + CEP + "/json", () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);
        if (response.erro == true) {
          return Swal.fire("Erro!", "CEP inválido!", "error");
        } else {
          $("#SelectEstado").val(response.uf).change();

          $("#InputLogradouro").val(response.logradouro);
          $("#InputComplemento").val(response.complemento);
          $("#InputBairro").val(response.bairro);
          setTimeout(() => {
            $("#SelectCidade").val(response.localidade).change();
          }, 100);
        }
      });
    });
  });

  $("#ButtonCNPJ").on("click", function () {
    let Tipo = $("#SelectTipo").val();
    let CNPJ = $("#InputCNPJ")
      .val()
      .replace(/[^0-9]/g, "");
    console.log(CNPJ);
    if (Tipo != "PJ") {
      return Swal.fire("Aviso!", "Não é possível pesquisar CPF!", "warning");
    }
    xmlHttpGet(
      "/Api/Supplier/CNPJ/",
      () => {
        success(() => {
          let response = JSON.parse(xhttp.responseText);

          if (response.Status == 'error') {
            return Swal.fire(
              "Erro!",
              "Não foi possível consultar este CNPJ!",
              "error"
            );
          } else {
            // Primary Data
            $("#InputRazaoSocial").val(response.name);
            $("#InputNomeFantasia").val(response.alias);
            $("#InputInscEstadual").val(response.federal_entity);
            // $("#InputInscMun").val("response.name");
            $("#InputCelular").val(response.phone);
            $("#InputCelularAlt").val(response.phone_alt);
            $("#InputEmail").val(response.email);
            // Data Address
            $("#InputCEP").val(response.address.zip);
            $("#SelectEstado").val(response.address.state).change();
            setTimeout(() => {
              $("#SelectCidade").val(response.address.city).change();
            }, 2000);

            $("#InputLogradouro").val(response.address.street);
            $("#InputNumero").val(response.address.number);
            $("#InputBairro").val(response.address.neighborhood);
          }
        });
      },
      CNPJ
    );
  });

  $("#SelectEstado").on("change", function () {
    xmlHttpGet(
      "Api/Estado/",
      () => {
        beforeSend(() => {});
        success(() => {
          let response = JSON.parse(xhttp.responseText);
          let Select = $("#SelectCidade");
          let Cidades;

          for (let i = 0; i < response[0].cidades.length; i++) {
            Cidades += `<option value="${response[0].cidades[
              i
            ].nome_municipio.toUpperCase()}">${
              response[0].cidades[i].nome_municipio
            }</option>`;
          }
          Select.html(Cidades);
        });
      },
      this.value
    );
  });

  function ClearAllFields() {
    $("#SelectEstado").val("");
    $("#SelectCidade").val("");
    $("#InputLogradouro").val("");
    $("#InputNumero").val("");
    $("#InputComplemento").val("");
    $("#InputBairro").val("");
  }

  $("#InputCNPJ").mask("00.000.000/0000-00", { reverse: true });
  $("#InputCEP").mask("00000-000");
  $("#InputTelefone").mask("(00) 0000-0000");
  $("#InputCelular").mask("(00) 0 00000000");
});
