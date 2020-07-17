window.onload = () => {
  $("form#form_add").submit((e) => {
    e.preventDefault();
    let Data = {
      Product: $("#Product").val(),
      Quantity: $("#Quantity").val(),
      Operation: "E",
      motive: $("#motive").val(),
      user: $("#userDropdown").text().trim(),
    };

    xmlHttpPostJson(
      "/Api/UpdateStock",
      () => {
        success(() => {
          let response = xhttp.responseText;

          if (response == "success") {
            Swal.fire("Sucesso!", "Estoque atualizado!", "success");
            $("#form_add")[0].reset();
          } else if (response == "not found") {
            Swal.fire("Atenção!", "Produto não existe!", "error");
          } else {
            Swal.fire(
              "Atenção!",
              "Entre em contato com o administrador!",
              "warning"
            );
            console.log(response)
          }
        });
      },
      JSON.stringify(Data)
    );
  });
};
