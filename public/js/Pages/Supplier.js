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

    if (Tipo != "PJ") {
      return Swal.fire("Aviso!", "Não é possível pesquisar CPF!", "warning");
    }
    xmlHttpGet(
      "/Api/Supplier/GetCNPJ/",
      () => {
        success(() => {
          let response = JSON.parse(xhttp.responseText);

          console.log(response);

          if (response.Status == "error") {
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
            }, 500);
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
            Cidades += `<option value="${response[0].cidades[i].nome_municipio
              .toUpperCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")}">${
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
    $("#SelectTipo").val("PJ").change(),
      $("#InputRazaoSocial").val(""),
      $("#InputNomeFantasia").val(""),
      $("#InputCNPJ").val(""),
      $("#InputInscEstadual").val(""),
      $("#InputInscMun").val(""),
      $("#InputCelular").val(""),
      $("#InputCelularAlt").val(""),
      $("#InputEmail").val(""),
      $("#InputCEP").val(""),
      $("#InputLogradouro").val("");
    $("#InputNumero").val(""),
      $("#InputComplemento").val(""),
      $("#InputBairro").val(""),
      $("#SelectEstado").val(""),
      $("#SelectCidade").val("");
  }

  $("#ButtonAdd").on("click", function () {
    let JsonData = {};

    JsonData = {
      Tipo: $("#SelectTipo").val(),
      RazaoSocial: $("#InputRazaoSocial").val().trim(),
      NomeFantasia: $("#InputNomeFantasia").val().trim(),
      CNPJ: $("#InputCNPJ").val().trim(),
      InscEstadual: $("#InputInscEstadual").val().trim(),
      InscMun: $("#InputInscMun").val().trim(),
      Celular: $("#InputCelular").val().trim(),
      CelularAlt: $("#InputCelularAlt").val().trim(),
      Email: $("#InputEmail").val().trim(),
      CEP: $("#InputCEP").val().trim(),
      Logradouro: $("#InputLogradouro").val().trim(),
      Numero: $("#InputNumero").val().trim(),
      Complemento: $("#InputComplemento").val().trim(),
      Bairro: $("#InputBairro").val().trim(),
      Estado: $("#SelectEstado").val().trim(),
      Cidade: $("#SelectCidade").val().trim(),
    };

    if (JsonData.CNPJ.length < 18 && JsonData.Tipo === "PJ") {
      return alert("erro CNPJ");
    }
    if (JsonData.Estado === "") {
      return alert("Preencha o Estado");
    }

    xmlHttpPostJson(
      "/Api/Supplier/Add",
      () => {
        success(() => {
          let response = xhttp.responseText;

          if (response == "saved") {
            ClearAllFields();
            return Swal.fire("Sucesso!", "Fornecedor cadastrado!", "success");
          } else {
            return Swal.fire(
              "Erro!",
              "Verifique os campos e tente novamente!",
              "error"
            );
          }
        });
      },
      JSON.stringify(JsonData)
    );
  });

  $("a:contains(Pesquisar)").on("click", function () {
    xmlHttpGet("/Api/Supplier/Grid", () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);

        $("tbody").html("");

        for (let i = 0; i < response.length; i++) {
          let LINE = document.createElement("tr");
          let RZ = document.createElement("td");
          let NF = document.createElement("td");
          let CNPJ = document.createElement("td");
          let UF = document.createElement("td");
          let CIDADE = document.createElement("td");
          let ACTIONS = document.createElement("td");
          let DivActions = document.createElement("div");
          let BtnView = document.createElement("button");
          let BtnRemove = document.createElement("button");

          RZ.setAttribute("class", "text-center");
          NF.setAttribute("class", "text-center");
          CNPJ.setAttribute("class", "text-center");
          UF.setAttribute("class", "text-center");
          CIDADE.setAttribute("class", "text-center");
          ACTIONS.setAttribute("class", "text-center");
          DivActions.setAttribute("class", "table-actions");

          BtnView.type = "button";
          BtnView.value = response[i]._id;
          BtnView.setAttribute("class", "btn btn-icon btn-primary");
          BtnView.innerHTML = '<i class="ik ik-eye"></i>'

          BtnRemove.type = "button";
          BtnRemove.value = response[i]._id;
          BtnRemove.setAttribute("class", "btn btn-icon btn-danger");
          BtnRemove.innerHTML = '<i class="ik ik-trash-2"></i>'


          RZ.innerHTML = response[i].RazaoSocial;
          NF.innerHTML = response[i].NomeFantasia;
          CNPJ.innerHTML = response[i].CNPJ;
          UF.innerHTML = response[i].Estado;
          CIDADE.innerHTML = response[i].Cidade;

          DivActions.append(BtnView);
          DivActions.append(BtnRemove);
          
          ACTIONS.append(DivActions);

          LINE.append(RZ);
          LINE.append(NF);
          LINE.append(CNPJ);
          LINE.append(UF);
          LINE.append(CIDADE);
          LINE.append(ACTIONS);

          $("tbody").append(LINE);
        }
      });
    });
  });

  $("#InputCNPJ").mask("00.000.000/0000-00", { reverse: true });
  $("#InputCEP").mask("00000-000");
  $("#InputCelular").mask("(00) 0 00000000");
  $("#InputCelularAlt").mask("(00) 0 00000000");
});
