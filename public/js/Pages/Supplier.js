$(document).ready(function() {
    "use strict";

    $("#ButtonCEP").on("click", function () {
        let CEP = $("#InputCEP").val();
      
        xmlHttpGet("https://viacep.com.br/ws/" + CEP + "/json", () => {
          success(() => {
            let response = xhttp.responseText;
            console.log(response);
          });
        });
      
      //   {
      //     "cep": "13612-280",
      //     "logradouro": "Rua Luiz Corrêa Almeida",
      //     "complemento": "",
      //     "bairro": "Jardim Letícia",
      //     "localidade": "Leme",
      //     "uf": "SP",
      //     "unidade": "",
      //     "ibge": "3526704",
      //     "gia": "4157"
      //   }
      
      });
      



    function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
        $("#rua").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#uf").val("");
        $("#ibge").val("");
    }
    
    //Quando o campo cep perde o foco.
    $("#InputCEP").blur(() => {
let test = $(this).val().replace(/\D/g, '')
        //Nova variável "cep" somente com dígitos.
        alert(test)

        //Verifica se campo cep possui valor informado.
        // if (cep != "") {

        //     //Expressão regular para validar o CEP.
        //     var validacep = /^[0-9]{8}$/;

        //     //Valida o formato do CEP.
        //     if(validacep.test(cep)) {

        //         //Preenche os campos com "..." enquanto consulta webservice.
        //         $("#rua").val("...");
        //         $("#bairro").val("...");
        //         $("#cidade").val("...");
        //         $("#uf").val("...");
        //         $("#ibge").val("...");

        //         //Consulta o webservice viacep.com.br/
        //         $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

        //             if (!("erro" in dados)) {
        //                 //Atualiza os campos com os valores da consulta.
        //                 $("#rua").val(dados.logradouro);
        //                 $("#bairro").val(dados.bairro);
        //                 $("#cidade").val(dados.localidade);
        //                 $("#uf").val(dados.uf);
        //                 $("#ibge").val(dados.ibge);
        //             } //end if.
        //             else {
        //                 //CEP pesquisado não foi encontrado.
        //                 limpa_formulário_cep();
        //                 alert("CEP não encontrado.");
        //             }
        //         });
        //     } //end if.
        //     else {
        //         //cep é inválido.
        //         limpa_formulário_cep();
        //         alert("Formato de CEP inválido.");
        //     }
        // } //end if.
        // else {
        //     //cep sem valor, limpa formulário.
        //     limpa_formulário_cep();
        // }
    });
});
