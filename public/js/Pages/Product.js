// $("#data_table").DataTable({
//   responsive: true,
//   aoColumnDefs: [
//     {
//       bSortable: false,
//       aTargets: ["nosort"],
//     },
//   ],
// });

function view(_id) {
  xmlHttpGet(
    "/Api/Product/",
    () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);
        $(".modal-title").html("Detalhes Produto");
        $("#EditForm").html(viewProduct(response));
      });
    },
    _id
  );
}
function edit(_id) {
  let Measure;

  xmlHttpGet("/Api/Measures/", () => {
    success(() => {
      let responseMeasures = JSON.parse(xhttp.responseText);
      Measure = responseMeasures;

      xmlHttpGet(
        "/Api/Product/",
        () => {
          success(() => {
            let response = JSON.parse(xhttp.responseText);
            $(".modal-title").html("Editar Produto");
            $("#EditForm").html(EditProduct(response, Measure));
          });
        },
        _id
      );
    });
  });
}

function delet(_id) {
  Swal.fire({
    title: "Deletar Produto?",
    text: "Não será possível reverter.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim",
  }).then((result) => {
    if (result.value) {
      xmlHttpGet(
        "/Api/DeletProduct/",
        () => {
          success(() => {
            let response = xhttp.responseText;
            if (response == "success") {
              Swal.fire("Produto Deletado!", "", "success");
              AllProducts();
            } else {
              alert(response);
            }
          });
        },
        _id
      );
    }
  });
}

function AllProducts() {
  xmlHttpGet("/Api/AllProduct", () => {
    success(() => {
      let response = JSON.parse(xhttp.responseText);
      $("tbody").html(MontarGrid(response));
    });
  });
}

function MontarGrid(Data) {
  let Grid = "";

  Data.forEach((element) => {
    Grid += `  <tr> 
  <td>${element.Description}</td>
  <td>${element.Barcode}</td>
  <td>${element.Value}</td>
  <td>
    <div class="table-actions">
      <button type="button" class="btn btn-icon btn-primary" onclick="view('${element._id}')" data-toggle="modal"
        data-target="#Modal"><i class="ik ik-eye"></i></button>
      <button type="button" class="btn btn-icon btn-success" onclick="edit('${element._id}')" data-toggle="modal"
      data-target="#Modal"><i
          class="ik ik-edit-2"></i></button>
      <button type="button" class="btn btn-icon btn-danger" onclick="delet('${element._id}')"><i
          class="ik ik-trash-2"></i></button>
    </div>
  </td>
</tr>
`;
  });
  return Grid;
}

function viewProduct(Data) {
  let form = "";

  Data.forEach((e) => {
    form += `
    <form class="forms-sample">
    <div class="form-group row">
        <label class="col-sm-3 col-form-label">Descrição</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" value="${e.Description}" readonly>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-3 col-form-label">Código de Barras</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" value="${e.Barcode}" readonly>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-3 col-form-label">Unidade de Medida</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" value="${e.Measure[0].Description}" readonly>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-3 col-form-label">Tipo</label>
        <div class="col-sm-9">`;
    if (e.Type == "R") {
      form += `            <input type="text" class="form-control" value="Venda" readonly>`;
    } else if (e.Type == "S") {
      form += `            <input type="text" class="form-control" value="Matéria-Prima" readonly>`;
    } else if (e.Type == "B") {
      form += `            <input type="text" class="form-control" value="Venda / Matéria-Prima" readonly>`;
    }
    form += `</div>
    </div>
    <div class="form-group row">
        <label class="col-sm-3 col-form-label">Preço</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" value="${e.Value}" readonly>
        </div>
    </div>
</form>`;
  });
  return form;
}

function EditProduct(Data, Measure) {
  let form = ``;
  Data.forEach((e) => {
    form += `
    <div class="form-group row">
      <input type="hidden" class="form-control" value="${e._id}" name='_id'>
        <label class="col-sm-3 col-form-label">Descrição</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" value="${e.Description}" name='Description'>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-3 col-form-label">Código de Barras</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" value="${e.Barcode}" name='Barcode'>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-3 col-form-label">Unidade de Medida</label>
        <div class="col-sm-9">
        <select class="form-control form-control-center" name='Measure'> `;
    Measure.forEach((Measure) => {
      if (e.Measure[0]._id == Measure._id) {
        form += `  <option value='${Measure._id}' selected>${Measure.Description}</option> `;
      }
      form += `  <option value='${Measure._id}'>${Measure.Description}</option> `;
    });
    form += `</select>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-3 col-form-label">Tipo</label>
        <div class="col-sm-9">
        <select class="form-control form-control-center" name='Type'>`;
    if (e.Type == "R") {
      form += `      
            <option value='R' selected>Venda</option>
            <option value='S'>Matéria-Prima</option>
            <option value='B'>Venda / Matéria-Prima</option>
            `;
    } else if (e.Type == "S") {
      form += `
            <option value='R'>Venda</option>
            <option value='S' selected>Matéria-Prima</option>
            <option value='B'>Venda / Matéria-Prima</option>
            `;
    } else if (e.Type == "B") {
      form += `           
            <option value='R'>Venda</option>
            <option value='S'>Matéria-Prima</option>
            <option value='B' selected>Venda / Matéria-Prima</option>
            `;
    }
    form += `</select>
    </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-3 col-form-label">Preço</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" value="${e.Value}" name='Value'>
        </div>
    </div>`;
  });
  form += `
  <button type="submit" class="btn col-12 btn-primary">Atualizar</button>`;
  return form;
}

$("form#form_add").submit((e) => {
  e.preventDefault();
  let Data = {
    Description: $("#Description").val().trim(),
    Barcode: $("#Barcode").val().trim(),
    Measure:  $("#Measure").val(),
    Type: $("#Type").val(),
    Value: $("#Value").val().trim(),
    User: $('#userDropdown').text().trim()
  };

  xmlHttpPostJson(
    "/Api/AddProduct",
    () => {
      success(() => {
        let response = xhttp.responseText;

        if (response == "success") {
          Swal.fire("Sucesso!", "Produto Adicionado!", "success");
          $("#form_add")[0].reset();
          $("a:contains(Pesquisar)").click();
        } else {
          console.log(response);
        }
      });
    },
    JSON.stringify(Data)
  );


});

$("form#EditForm").submit((e) => {
  e.preventDefault();
  let Data = $("#EditForm");

  xmlHttpPost(
    "Api/EditProduct",
    () => {
      success(() => {
        let response = xhttp.responseText;

        if (response == "success") {
          Swal.fire("Sucesso!", "Produto Atualizado!", "success");
          $("#modal").modal("hide");
        } else if (response == "not found") {
          Swal.fire("Erro!", "Produto não existe!", "error");
          alert(response);
        } else {
          Swal.fire("Erro!", "Entre em contato com o administrador", "error");
          console.log(response);
        }
      });
    },
    Data.serialize()
  );
});

$("a:contains(Pesquisar)").click(() => {
  AllProducts();
});
