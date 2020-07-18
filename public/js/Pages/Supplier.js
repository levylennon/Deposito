$(document).ready(function () {
  "use strict";

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
            Cidades += `<option value="${response[0].cidades[i].nome_municipio}">${response[0].cidades[i].nome_municipio}</option>`;
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
});
