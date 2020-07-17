var JsonRecipe = [];

$("#SelectProduct").on("change", () => {
  let value = $("#SelectProduct").val();
  SelectProduct(value);
});

function buttons(option) {
  let value = $("#SelectProduct").val();
  if (option == "N") {
    // without recipe
    $("#Buttons").html(
      `<li class='nav-item pr-2'><button class='btn btn-outline-primary btn-lg' type='button' onclick='FormRecipe()'>Novo</button></li>`
    );
  } else if (option == "S") {
    // with recipe
    $("#Buttons").html(`
    <li class="nav-item pr-2">
      <button class="btn btn-outline-primary btn-lg" type="button" onclick="HeaderRecipe()" id='EditBtn'>Editar</button>
    </li>
    <li class="nav-item pr-2">
      <button class="btn btn-outline-danger btn-lg" type="button"  onclick="Remove('${value}')">Remover</button>
    </li>
    `);
  } else if (option == "C") {
    // cancel option
    $("#Buttons").html(`
    <li class="nav-item pr-2">
      <button class="btn btn-outline-warning btn-lg" type="button" onclick="Cancel('C')" id='CancelBtn'>Cancel</button>
    </li>
    `);
  } else if (option == "E") {
    // edit option
    $("#Buttons").html(`
    <li class="nav-item pr-2">
      <button class="btn btn-outline-warning btn-lg" type="button" onclick="Cancel('E')" id='CancelBtn'>Cancel</button>
    </li>
    <li class="nav-item pr-2">
      <button class="btn btn-outline-danger btn-lg" type="button"  onclick="Remove('${value}')">Remover</button>
    </li>
    `);
  }
}

function TableData(Data) {
  // function create table with 2 columns
  let form = `
  <div class="card mt-3">
    <div id='header'></div>
      <form>
        <table class="table table-hover table-borderless">
          <thead class="thead-light">
            <tr id='TR_Table'>
            <th class="text-center">Matéria-Prima</th>
            <th class="text-center">Quantidade</th>
            <th class="text-center">Unidade Medida</th>
            </tr>
        </thead>
        <tbody id='RowsTable'>`;
  Data.forEach((Json) => {
    form += `
          <tr>
            <td class="text-center">${Json.NameFeedStock}</td>
            <td class="text-center">${Json.Quantity}</td>
            <td class="text-center">${Json.AbbreviationMeasure}</td>
          </tr>`;
  });
  form += `</tbody>
        </table>
      </form>
    </div>
  </div>`;

  return form;
}

function FormRecipe() {
  // get all feedstock
  xmlHttpGet("/Api/AllSeedStock", () => {
    success(() => {
      let Data = JSON.parse(xhttp.responseText);

      $("#HeaderTable").html(Form(Data));
    });
  });
  // buttons
  $("#Buttons").html(buttons("C"));
}

function SelectProduct(id) {
  if (id != "Selecione...") {
    xmlHttpGet(
      "/Api/Recipe/",
      () => {
        beforeSend(() => {
          $("#HeaderTable").empty();
          ClearJson();
        });
        success(() => {
          let response = JSON.parse(xhttp.responseText);

          JsonRecipe = response.Recipe;

          // Count how much index the Product have
          let count = Object.keys(response.Recipe).length;

          if (count != 0) {
            $("#Buttons").html(buttons("S"));
            $("#HeaderTable").html(TableData(response.Recipe));
          } else {
            $("#Buttons").html(buttons("N"));
          }
        });
      },
      id
    );
  } else {
    $("#Buttons").empty();
    $("#HeaderTable").empty();
  }
}

function HeaderRecipe() {
  buttons("E");
  // fill header with feedstock
  xmlHttpGet("/Api/AllSeedStock", () => {
    beforeSend(() => {
      // spinner
      $("#HeaderTable").html(
        `<div class="d-flex justify-content-center mt-5"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>`
      );
    });
    success(() => {
      // response feedstock
      const Data = JSON.parse(xhttp.responseText);

      
      $("#HeaderTable").html(HeaderFormEdit(Data));

      
      // fill rows data table
      $("#RowsTable").html(DoRowsTable(JsonRecipe));
    });
  });
}

function Cancel(_id) {
  let ID = $("#SelectProduct").val();
  if (_id != "C") {
    SelectProduct(ID);
  } else if (_id == "E") {
    $("#Buttons").html(buttons("E"));
    SelectProduct(ID);
  } else {
    $("#Buttons").html(buttons("N"));
    $("#HeaderTable").empty();
  }
}

function HeaderFormEdit(Data) {
  let header = `
  <div class="card mt-3">
    <div class="card-header">
            <h4 class="mb-0">Recipe</h4>
    </div>
    <div class="card-body">
      <form class="form" role="form" autocomplete="off">

        <div class="form-group row">

          <label class="col-lg-3 col-form-label form-control-label">Matéria-Prima</label>
         
          <div class="col-5">
            <select class="form-control" name='SelecteedStock' id='SelectSeedStock' onchange='GetMeasure(this.value)'>
              <option selected>Selecione...</option>`;
  Data.forEach((Data) => {
    header += `<option value='${Data._id}'>${Data.Description}</option>`;
  });
  header += ` 
            </select>
          </div>

          <label class="col-2 col-form-label form-control-label">Unidade Medida</label>
          <input class="form-control col-2" type="text" id='MeasureFeedStock' readonly>

        </div>
        <div class="form-group row">
          <label class="col-lg-3 col-form-label form-control-label">Quantidade</label>
          <div class="col-lg-9">
            <input class="form-control" type="number" value="0" name='NumberSeedStock' id='NumberSeedStock'>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-lg-3 col-form-label form-control-label"></label>
          <div class="col-lg-9">
            <input type="button" class="btn btn-primary" value="Adicionar" onclick="AddRecipe()">
            <input type="reset" class="btn btn-secondary" value="Limpar">
          </div>
        </div>
      </form>
        <hr>
          <table class="table table-hover table-borderless">
            <thead class="thead-light">
              <tr>
                <th class="text-center">Matéria-Prima</th>
                <th class="text-center">Quantidade</th>
                <th class="text-center">Unidade Medida</th>
                <th class="text-center">&nbsp;</th>
              </tr>
            </thead>
            <tbody id='RowsTable'>
            </tbody>
          </table>
          <div class="text-center"><input type="button" value="Atualizar" class="btn btn-primary btn-block rounded-0 py-2" id="ButtonSave" disabled="" onclick="SaveRecipe()"></div>
    </div>
  </div>`;

  return header;
}

function GetMeasure(id) {
  if (id != "Selecione...") {
    xmlHttpGet(
      "/Api/GetMeasureFeedStock/",
      () => {
        success(() => {
          let response = JSON.parse(xhttp.responseText);
          $("#MeasureFeedStock").val(response[0].Measure[0].Abbreviation);
        });
      },
      id
    );
  } else {
    $("#MeasureFeedStock").val("");
  }
}

function Form(Data) {
  let form = `
  <div class="card mt-3">
    <div class="card-body">
      <form class="form" role="form" autocomplete="off">
        <div class="form-group row">

          <label class="col-3 col-form-label form-control-label">Matéria-Prima</label>

          <div class="col-5">
            <select class="form-control" name='SelectSeedStock' id='SelectSeedStock' onchange='GetMeasure(this.value)'>
              <option selected>Selecione...</option>`;
  Data.forEach((Data) => {
    form += ` <option value='${Data._id}'>${Data.Description}</option>`;
  });
  form += ` </select>
          </div>

          <label class="col-2 col-form-label form-control-label">Unidade Medida</label>
          <input class="form-control col-2" type="text" id='MeasureFeedStock' readonly>

        </div>

        <div class="form-group row">
          <label class="col-lg-3 col-form-label form-control-label">Quantidade</label>
          <div class="col-lg-9">
            <input class="form-control" type="number" value="0" name='NumberSeedStock' id='NumberSeedStock'>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-lg-3 col-form-label form-control-label"></label>
          <div class="col-lg-9">
            <input type="button" class="btn btn-primary" value="Adicionar" onclick="AddRecipe()">
            <input type="reset" class="btn btn-secondary" value="Limpar">
          </div>
        </div>

      </form>

      <hr>

      <form>
        <table class="table table-hover table-borderless">
          <thead class="thead-light">
            <tr>
              <th class="text-center">Matéria-Prima</th>
              <th class="text-center">Quantidade</th>
              <th class="text-center">Unidade Medida</th>
              <th class="text-center">&nbsp;</th>
            </tr>
          </thead>
          <tbody id='RowsTable'>
            <tr>
              <td colspan="4" class='text-center'>Sem dados</td>
            </tr>
          </tbody>
        </table>

        <div class="text-center">
          <input type="button" value="Gravar" class="btn btn-primary btn-block rounded-0 py-2" id='ButtonSave' disabled onclick="SaveRecipe()">
        </div>
      </form>
    </div>
  </div>`;

  return form;
}

function SaveRecipe() {
  let _idProduct = $("#SelectProduct").val();
  let Recipe = { _id: _idProduct, Recipe: [JsonRecipe] };

  xmlHttpPostJson(
    "Api/SaveRecipe",
    () => {
      success(() => {


        Swal.fire("Sucesso!", "Receita cadastrada", "success");
        SelectProduct(_idProduct);

      });
    },
    JSON.stringify(Recipe)
  );
}

function Remove(_id) {
  let _idProduct = document.querySelector("#SelectProduct").value;
  let Product = { _id: _idProduct };

  Swal.fire({
    title: "Você tem certeza?",
    text: "Não será possível reverter!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim",
    cancelButtonText: "Não!",
  }).then((result) => {
    if (result.value) {
      xmlHttpPostJson(
        "Api/DeletRecipe",
        () => {
          success(() => {
            Swal.fire("Sucesso!", "Produto Removido!", "success");
            SelectProduct(_idProduct);
          });
        },
        JSON.stringify(Product)
      );
    }
  });
}

function AddRecipe() {
  let Select = $("#SelectSeedStock").val();
  let SelectText = $("#SelectSeedStock option:selected").text();
  let Number = $("#NumberSeedStock").val();
  let AbbreviationMeasure = $('#MeasureFeedStock').val();

  let Verify = JsonRecipe.findIndex((obj) => obj.IdFeedstock == Select);

  if (Verify >= 0) {
    return Swal.fire(
      "Erro!",
      "Matéria-Prima já adicionada, se necessário, altere a quantidade.",
      "error"
    );
  }

  if (Select == "Selecione...") {
    return;
  }

  if (Number <= 0) {
    return Swal.fire("Atenção!", "Preencha a quantidade", "warning");
  }

  let Recipe = {
    IdFeedstock: Select,
    NameFeedStock: SelectText,
    Quantity: Number,
    AbbreviationMeasure: AbbreviationMeasure
  };

  JsonRecipe.push(Recipe);


  $("#RowsTable").html(DoRowsTable(JsonRecipe));

  ClearFields();

  IndexsJson();
}

function DoRowsTable(Json) {
  let count = Object.keys(JsonRecipe).length;
  let Rows = ``;

  if (count <= 0) {
    Rows += `<tr>
              <td colspan="4" class="text-center">Sem dados</td>
             </tr>`;
  } else {
    Json.forEach((Json) => {
      Rows += ` <tr>
                  <td class="text-center">${Json.NameFeedStock}</td>
                  <td class="text-center">${Json.Quantity}</td>
                  <td class="text-center">${Json.AbbreviationMeasure}</td>
                  <td class="text-center">
                    <button type="button" onclick="RemoveRecipe('${Json.IdFeedstock}')" class="btn btn-outline-danger btn-sm" >
                      <svg class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>`;
    });
  }
  return Rows;
}

function ClearFields() {
  document.getElementById("SelectSeedStock").selectedIndex = "0";
  $('#NumberSeedStock').val(0);
  $('#MeasureFeedStock').val('');
}

window.RemoveRecipe = (id) => {
  // find index Recipe
  var index = JsonRecipe.findIndex((obj) => obj.IdFeedstock == id);
  // remove index from json
  JsonRecipe.splice(index, 1);
  // function DataTable, passing the json
  RowsTable.innerHTML = DoRowsTable(JsonRecipe);
  // functoin button save, disable or enable
  IndexsJson();
};

function IndexsJson() {
  var count = Object.keys(JsonRecipe).length;
  if (count <= 0) {
    $("#ButtonSave").prop("disabled", true);
  } else {
    $("#ButtonSave").prop("disabled", false);
  }
}

function ClearJson() {
  JsonRecipe = [];
}
