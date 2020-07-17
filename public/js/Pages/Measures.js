$("#data_table").DataTable({
  responsive: true,
  aoColumnDefs: [
    {
      bSortable: false,
      aTargets: ["nosort"],
    },
  ],
});

$("form#form_add").submit((e) => {
  e.preventDefault();
  let Data = $("#form_add");

  xmlHttpPost(
    "Api/AddMeasure",
    () => {
      success(() => {
        let response = xhttp.responseText;

        if (response == "success") {
          Swal.fire("Sucesso!", "Medida Adicionada!", "success");
          $("#form_add")[0].reset();
          $("a:contains(Pesquisar)").click();
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
  AllMeasure();
});

function AllMeasure() {
  xmlHttpGet("/Api/Measures", () => {
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
  <td>${element.Abbreviation}</td>
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

function view(_id) {
  xmlHttpGet(
    "/Api/Measures/",
    () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);
        $(".modal-title").html("Detalhes Medida");
        $("#EditForm").html(viewProduct(response));
      });
    },
    _id
  );
}
function edit(_id) {
  xmlHttpGet(
    "/Api/Measures/",
    () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);
        $(".modal-title").html("Editar Medida");
        $("#EditForm").html(EditMeasure(response));
      });
    },
    _id
  );
}
function EditMeasure(Data) {
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
        <label class="col-sm-3 col-form-label">Abreviação</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" value="${e.Abbreviation}" name='Abbreviation'>
        </div>
    </div>`;
  });
  form += `
  <button type="submit" class="btn col-12 btn-primary">Atualizar</button>`;
  return form;
}

function delet(_id) {
  Swal.fire({
    title: "Deletar Medida?",
    text: "Não será possível reverter.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim",
  }).then((result) => {
    if (result.value) {
      xmlHttpGet(
        "/Api/DeletMeasure/",
        () => {
          success(() => {
            let response = xhttp.responseText;
            if (response == "success") {
              Swal.fire("Medida Deletada!", "", "success");
              AllMeasure();
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
        <label class="col-sm-3 col-form-label">Abreviação</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" value="${e.Abbreviation}" readonly>
        </div>
    </div>
</form>`;
  });
  return form;
}

$("form#EditForm").submit((e) => {
  e.preventDefault();
  let Data = $("#EditForm");

  xmlHttpPost(
    "Api/EditMeasure",
    () => {
      success(() => {
        let response = xhttp.responseText;

        if (response == "success") {
          Swal.fire("Sucesso!", "Medida Atualizada!", "success");
          $("#modal").modal("hide");
        } else if (response == "not found") {
          Swal.fire("Erro!", "Medida não existe!", "error");
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
