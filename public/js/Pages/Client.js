$("#data_table").DataTable({
  responsive: true,
  select: true,
  aoColumnDefs: [
    {
      bSortable: false,
      aTargets: ["nosort"],
    },
  ],
});

$("a:contains(Pesquisar)").click(() => {
  xmlHttpGet("/Api/AllClient", () => {
    success(() => {
      let response = JSON.parse(xhttp.responseText);
      $("tbody").html(Grid(response));
    });
  });
});

function Grid(Data) {
  let Grid = "";
  Data.forEach((e) => {
    Grid += `
  <tr>
  <td>${e.Name}</td>
  <td>${e.Nickname}</td>
  <td>${e.CPF}</td>
  <td>
    <div class="table-actions">
      <button type="button" class="btn btn-icon btn-primary" onclick="view('${e._id}')"
      data-toggle="modal" data-target="#Modal"><i class="ik ik-eye"></i></button>
      <button type="button" class="btn btn-icon btn-success" onclick="edit('${e._id}')"
      data-toggle="modal" data-target="#Modal"><i
      class="ik ik-edit-2"></i></button>
      <button type="button" class="btn btn-icon btn-danger"
      onclick="delet('${e._id}')"><i class="ik ik-trash-2"></i></button>
    </div>
  </td>
</tr>
  `;
  });
  return Grid;
}

$("form#form_add").submit((e) => {
  e.preventDefault();
  let Data = $("#form_add");

  xmlHttpPost(
    "Api/AddClient",
    () => {
      success(() => {
        let response = xhttp.responseText;

        if (response == "success") {
          Swal.fire("Sucesso!", "Cliente Adicionado!", "success");
          $("#form_add")[0].reset();
          $("a:contains(Pesquisar)").click();
        } else {
          Swal.fire("Erro!", "Ocorreu um erro, tente novamente!", "error");
          console.log(response);
        }
      });
    },
    Data.serialize()
  );
});

function view(_id) {
  xmlHttpGet(
    "/Api/Client/",
    () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);

        $(".modal-title").html("Detalhes Cliente");
        $("#EditForm").html(ViewClient(response));
      });
    },
    _id
  );
}

function edit(_id) {
  xmlHttpGet(
    "/Api/Client/",
    () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);

        $(".modal-title").html("Atualizar Cliente");
        $("#EditForm").html(UpdateClient(response));
      });
    },
    _id
  );
}

function ViewClient(Data) {
  let form = ``;

  Data.forEach((element) => {
    form = `    
    <div class="form-group row">
      <label class="col-sm-3 col-form-label">Nome</label>
      <div class="col-sm-9">
          <input type="text" class="form-control form-control-center" value='${element.Name}' readonly>
      </div>
    </div>

    <div class="form-group row">
        <label class="col-sm-3 col-form-label">CPF</label>
        <div class="col-sm-9">
            <input type="text" class="form-control form-control-center" value='${element.CPF}' readonly>
        </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-3 col-form-label">Apelido</label>
      <div class="col-sm-9">
          <input type="text" class="form-control form-control-center" value='${element.Nickname}' readonly>
      </div>
    </div>
    
    <div class="form-group row">
      <label class="col-sm-3 col-form-label">Endereço</label>
      <div class="col-sm-9">
          <input type="text" class="form-control form-control-center" value='${element.Address}' readonly>
      </div>
    </div>`;
  });
  return form;
}

function UpdateClient(Data) {
  let form = ``;

  Data.forEach((element) => {
    form = `    
    <input type="hidden" class="form-control form-control-center" value='${element._id}' required='' name='_id'>
    <div class="form-group row">
      <label for="NameUpdade" class="col-sm-3 col-form-label">Nome</label>
      <div class="col-sm-9">
          <input type="text" class="form-control form-control-center" value='${element.Name}' required='' id='NameUpdade' name='NameUpdade'>
      </div>
    </div>

    <div class="form-group row">
        <label for="CPFUpdate" class="col-sm-3 col-form-label">CPF</label>
        <div class="col-sm-9">
            <input type="text" class="form-control form-control-center" value='${element.CPF}' required='' id='CPFUpdate' name='CPFUpdate'>
        </div>
    </div>

    <div class="form-group row">
      <label for="ApelidoUpdate" class="col-sm-3 col-form-label">Apelido</label>
      <div class="col-sm-9">
          <input type="text" class="form-control form-control-center" value='${element.Nickname}' required='' id='ApelidoUpdate' name='ApelidoUpdate'>
      </div>
    </div>
    
    <div class="form-group row">
      <label for="AddressUpdate" class="col-sm-3 col-form-label">Endereço</label>
      <div class="col-sm-9">
          <input type="text" class="form-control form-control-center" value='${element.Address}' required='' id='AddressUpdate' name='AddressUpdate'>
      </div>
    </div>
    
    <button type="submit" class="btn col-12 btn-primary">Atualizar</button>`;
  });
  return form;
}

$("form#EditForm").submit((e) => {
  e.preventDefault();

  let Data = $("#EditForm");

  xmlHttpPost(
    "Api/EditClient",
    () => {
      success(() => {
        let response = xhttp.responseText;

        if (response == "success") {
          Swal.fire("Sucesso!", "Cliente atualizado!", "success");
          $("#EditForm")[0].reset();
          $("a:contains(Pesquisar)").click();
        } else if (response == "not found") {
          Swal.fire("Erro!", "Cliente não encontrado!", "error");
        } else {
          Swal.fire("Erro!", "Ocorreu um erro, tente novamente!", "error");
        }
      });
    },
    Data.serialize()
  );
});

function delet(_id) {
  Swal.fire({
    title: "Deletar Cliente?",
    text: "Não será possível reverter.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim",
  }).then((result) => {
    if (result.value) {
      xmlHttpGet(
        "/Api/DeletClient/",
        () => {
          success(() => {
            let response = xhttp.responseText;
            if (response == "success") {
              Swal.fire("Cliente Deletado!", "", "success");
              $("a:contains(Pesquisar)").click();
            } else {
              Swal.fire("Erro!", response, "error");
            }
          });
        },
        _id
      );
    }
  });
}