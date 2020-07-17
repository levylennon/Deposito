$("#data_table").DataTable({
  responsive: true,
  aoColumnDefs: [
    {
      bSortable: false,
      aTargets: ["nosort"],
    },
  ],
});

$("a:contains(Estoque)").click(() => {
  xmlHttpGet("/Api/StockAll", () => {
    success(() => {
      let response = JSON.parse(xhttp.responseText);
      $("#GridStock").html(GridStock(response));
    });
  });
});

$("a:contains(Gerenciar)").click(() => {
  xmlHttpGet("/Api/AllProduct", () => {
    success(() => {
      let response = JSON.parse(xhttp.responseText);
      $("#Product").html(ManagerProducts(response));
    });
  });
});

function ManagerProducts(Data) {
  let Form = "<option value='null' selected>Selecione...</option>";

  Data.forEach((element) => {
    Form += `  <option value='${element._id}'>${element.Description}</option>`;
  });
  return Form;
}


$("form#form_add").submit((e) => {
  e.preventDefault();
  let Data = {
    Product: $("#Product").val(),
    Quantity: $("#Quantity").val(),
    Operation: $('input[name="Operation"]:checked').val(),
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
          // $('input[name="Operation"]:checked').prop("checked", false)
        } else if (response == "not found") {
          Swal.fire("Atenção!", "Produto não existe!", "error");
        } else {
          Swal.fire(
            "Atenção!",
            "Entre em contato com o administrador!",
            "warning"
          );
        }
      });
    },
    JSON.stringify(Data)
  );
});


// $("form#form_add").submit((e) => {
//   e.preventDefault();
//   let Data = $("#form_add");

//   xmlHttpPost(
//     "Api/UpdateStock",
//     () => {
//       success(() => {
//         let response = xhttp.responseText;

//         if (response == "success") {
//           Swal.fire("Sucesso!", "Estoque atualizado!", "success");
//           $("#form_add")[0].reset();
//         } else if (response == "not found") {
//           Swal.fire("Atenção!", "Produto não existe!", "error");
//         } else {
//           Swal.fire(
//             "Atenção!",
//             "Entre em contato com o administrador!",
//             "warning"
//           );
//           console.log(response);
//         }
//       });
//     },
//     Data.serialize()
//   );
// });

function HistoryProduct(_id) {
  // alert(_id)
  xmlHttpGet(
    "/Api/HistoryProduct/",
    () => {
      success(() => {
        let Data = JSON.parse(xhttp.responseText);

        $("tbody#history").html(ModalHistoryProduct(Data));
      });
    },
    _id
  );
}

function ModalHistoryProduct(Data) {
  var table = "";

  Data[0].Stock.forEach((e) => {
    if (e.Operation == "E") {
      table +=
        `
      <tr class="table-success">
        <th>Entrada</th>
        <th>${e.Quantity}</th>
        <th>${moment(e.CreatedAt).format("DD/MM/YYYY - hh:mm:ss")}</th>
        <th>${e.User}</th>`;
    } else if (e.Operation == "O") {
      table +=
        `
      <tr class="table-danger">
        <th>Saida</th>
        <th>${e.Quantity}</th>
        <th>${moment(e.CreatedAt).format("DD/MM/YYYY - hh:mm:ss")}</th>
        <th>${e.User}</th>`;
    } else if (e.Operation == "P") {
      table +=
        `
      <tr class="table-info">
        <th>Entrada Produção</th>
        <th>${e.Quantity}</th>
        <th>${moment(e.CreatedAt).format("DD/MM/YYYY - hh:mm:ss")}</th>
        <th>${e.User}</th>`;
    } else if (e.Operation == "SP") { 
      table +=
        `
      <tr class="table-danger">
        <th>Saida Produção</th>
        <th>${e.Quantity}</th>
        <th>${moment(e.CreatedAt).format("DD/MM/YYYY - hh:mm:ss")}</th>
        <th>${e.User}</th>`;
    } else if (e.Operation == "D") {
      table +=
        `
      <tr class="table-danger">
        <th>Entrega Produção</th>
        <th>${e.Quantity}</th>
        <th>${moment(e.CreatedAt).format("DD/MM/YYYY - hh:mm:ss")}</th>
        <th>${e.User}</th>`;
    } 
    else if (e.Operation == "C") {
      table +=
        `
        <tr>
        <th  colspan="3" class="text-center">Cadastrado dia ${moment(e.CreatedAt).format("DD/MM/YYYY - hh:mm:ss")}</th>
        <th>${e.User}</th>`;
    }
    table += `</tr>`;
  });

  return table;
}


function GridStock(Data) {
  let Grid = "";

  Data.forEach((e) => {
    Grid += `  <tr>
    <td>${e._id.Description}</td>
    <td>${e._id.CurrentQuantity}</td>
    <td>
        <div class="table-actions">
            <button type="button" class="btn btn-icon btn-primary"
                onclick="HistoryProduct('${e._id._id}')" data-toggle="modal"
                data-target="#Modal"><i class="fas fa-history"></i></button>
        </div>
    </td>
</tr>`;
  });
  return Grid;
}
