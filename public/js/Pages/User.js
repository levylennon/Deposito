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

  if ($("#Password").val() != $("#Password1").val()) {
    Swal.fire("Erro!", "Senhas não correspodem!", "error");
    return;
  }

  let Data = $("#form_add");

  xmlHttpPost(
    "Api/AddUser",
    () => {
      success(() => {
        let response = xhttp.responseText;

        if (response == "success") {
          Swal.fire("Sucesso!", "Usuário Adicionado!", "success");
          $("#form_add")[0].reset();
          $("a:contains(Pesquisar)").click();
        } else if (response == "Userregistered") {
          Swal.fire("Erro!", "Já existe esse usuário!", "error");
        } else if (response == "ErrorOccurred") {
        } else {
          Swal.fire("Erro!", "Ocorreu um erro, tente novamente!", "error");
        }
      });
    },
    Data.serialize()
  );
});

function edit(_id) {
  xmlHttpGet(
    "/Api/User/",
    () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);

        $(".modal-title").html("Editar Usuário");
        $("#EditForm").html(EditUser(response));
      });
    },
    _id
  );
}

function EditUser(Data) {
  let form = ``;

  Data.forEach((element) => {
    form = `
    <input type="hidden" class="form-control form-control-center" name="_id" value='${element._id}'>
    
    <div class="form-group row">
      <label for="NameUpdade" class="col-sm-3 col-form-label">Nome</label>
      <div class="col-sm-9">
          <input type="text" class="form-control form-control-center" id="NameUpdade"
              placeholder="Digite aqui..." name="NameUpdate" value='${element.Name}' required=''>
      </div>
    </div>

    <div class="form-group row">
        <label for="UsernameUpdade" class="col-sm-3 col-form-label">Usuário</label>
        <div class="col-sm-9">
            <input type="text" class="form-control form-control-center" placeholder="Digite aqui..."
                id="UsernameUpdade" name="UsernameUpdate" value='${element.Username}'>
        </div>
    </div>

    <div class="form-group row">
        <label for="PermissionUpdate" class="col-sm-3 col-form-label">Permissão</label>
        <div class="col-sm-9">
          <select class="form-control form-control-center" name='LevelUpdate' id="PermissionUpdate">
`;
    if (element.Level == 0) {
      form += `
          <option value="0" selected>Funcionário</option>
          <option value="1" >Motorista</option>
          <option value="2">Administrador</option>`;
    } else if (element.Level == 1) {
      form += `     
          <option value="0" >Funcionário</option>
          <option value="1" selected>Motorista</option>
          <option value="2">Administrador</option>`;
    } else if (element.Level == 2) {
      form += `     
          <option value="0" selected>Funcionário</option>
          <option value="1" >Motorista</option>
          <option value="2" selected>Administrador</option>`;
    }
  });
  form += `
    </select>
  </div>
</div>
  <button type="submit" class="btn col-12 btn-primary">Atualizar</button>`;
  return form;
}

$("form#EditForm").submit((e) => {
  e.preventDefault();

  let Data = $("#EditForm");

  xmlHttpPost(
    "Api/EditUser",
    () => {
      success(() => {
        let response = xhttp.responseText;

        if (response == "success") {
          Swal.fire("Sucesso!", "Usuário atualizado!", "success");
          $("#EditForm")[0].reset();
          $("a:contains(Pesquisar)").click();
        } else if (response == "not found") {
          Swal.fire("Erro!", "Usuário não encontrado!", "error");
        } else {
          Swal.fire("Erro!", "Ocorreu um erro, tente novamente!", "error");
        }
      });
    },
    Data.serialize()
  );
});

// to do yet
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
        "/Api/DeleteUser/",
        () => {
          success(() => {
            let response = xhttp.responseText;
            if (response == "success") {
              Swal.fire("Usuário Deletado!", "", "success");
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

$("a:contains(Pesquisar)").click(() => {
  xmlHttpGet("/Api/User", () => {
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
  <td>${e.Username}</td>
  `;
    if (e.Level == 0) {
      Grid += `  <td>Funcionário</td>`;
    } else if (e.Level == 1) {
      Grid += `<td>Motorista</td>`;
    } else if (e.Level == 2) {
      Grid += ` <td>Administrador</td>`;
    }
    Grid += ` 
  <td>
      <div class="table-actions">
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
