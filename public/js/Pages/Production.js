let JsonProducts = [];

$("form#form_add").submit((e) => {
  e.preventDefault();

  let Client = $("#client").val();
  let Priority = $("input[type='radio']:checked").val();
  let StartDate = $("#StartDate").val();
  let DeliveryDate = $("#DeliveryDate").val();
  let AdressDelivery = $("#AdressDelivery").val();

  if (Client == "null") {
    Swal.fire("Atenção!", "Selecione o Cliente", "warning");
    return;
  }
  if (Priority == undefined) {
    Swal.fire("Atenção!", "Selecione a Prioridade", "warning");
    return;
  }

  if (StartDate == "" || StartDate > DeliveryDate) {
    Swal.fire(
      "Atenção!",
      "Data de inicio deve ser inferior a data de entrega",
      "warning"
    );
    return;
  }
  if (DeliveryDate == "") {
    Swal.fire("Atenção!", "Preencha a data de entrega", "warning");
    return;
  }
  if (AdressDelivery == "") {
    Swal.fire("Atenção!", "Preencha o endereço de entrega", "warning");
    return;
  }

  // disable all form's input
  $("input[type=text]").prop("disabled", true);
  $("input[type=date]").prop("disabled", true);
  $("input[type=radio]").prop("disabled", true);
  // disable submit button
  $("button[type=submit]").prop("disabled", true);
  // add button cancel
  $("#form_add").append(
    '<button class="btn btn-warning col-12 mt-4" type="button"  onclick="EditHeader()" >Cancel</button>'
  );

  // show grid
  $("#ProductList").show();

  JsonProducts = {
    Client: Client,
    Priority: Priority,
    StartDate: StartDate,
    DeliveryDate: DeliveryDate,
    AdressDelivery: AdressDelivery,
    Product: [],
  };
});

$("#Add_products").click(() => {
  let Data;

  let Type = $("#SelectType :selected").val();
  let IdProduct = $("#SelectProduct").val();
  let DescriptionProduct = $("#DescriptionProduct").val();
  let ProductQuantity = $("#ProductQuantity").val();
  let ProductPrice = $("#ProductPrice").val();

  if (ProductPrice <= 0) {
    Swal.fire("Error!", "Preencha o valor do Produto ", "warning");
    return;
  }
  if (Type == "Null") {
    return;
  }

  if (Type == "C") {
    if (DescriptionProduct == "") {
      Swal.fire("Error!", "Preencha o Produto ", "error");
      return;
    }
  }

  if (ProductQuantity == "" || ProductQuantity === 0) {
    Swal.fire("Error!", "Preencha a quantidade ", "error");
    return;
  }

  if (Type == "C") {
    let get_image = document.querySelectorAll("output span img");
    if (get_image.length > 0) {
      Data = {
        Type: Type,
        IdProduct: DescriptionProduct,
        DescriptionProduct: DescriptionProduct,
        ProductQuantity: ProductQuantity,
        Image: get_image[0].src,
        Price: ProductPrice,
      };
    } else {
      Data = {
        Type: Type,
        IdProduct: DescriptionProduct,
        DescriptionProduct: DescriptionProduct,
        ProductQuantity: ProductQuantity,
        Price: ProductPrice,
      };
    }
  } else if (Type == "N") {
    Data = {
      Type: Type,
      IdProduct: IdProduct,
      DescriptionProduct: $("#SelectProduct option:selected").text(),
      ProductQuantity: ProductQuantity,
      Price: ProductPrice,
    };
  }

  JsonProducts.Product.push(Data);

  $("#table_products").html(table(JsonProducts.Product));
  UpdateFooter();
  if (JsonProducts.Product != 0) {
    $("#btn_gravar").prop("disabled", false);
  }
  ClearFields();
});

function table(Data) {
  let table = "";

  Data.forEach((Data) => {
    table += `<tr>`;
    if (Data.Type == "N") {
      table += `<th>Normal</th>`;
    } else {
      table += `<th>Custom</th>`;
    }
    table += `<th class="text-center">${Data.DescriptionProduct}</th>`;
    table += `<th class='text-center'>${Data.Price}</th>`;
    table += `<th class='quantity_table text-center'>${Data.ProductQuantity}</th>`;
    table += `<th class='price_table text-center'>${Data.ProductQuantity * Data.Price}</th>`;
    if (Data.Image != undefined) {
      table += `<th>
          <button type="button" onclick="ShowImage('${Data.IdProduct}')" class="btn btn-link btn-sm">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-image" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12z"/>
              <path d="M10.648 7.646a.5.5 0 0 1 .577-.093L15.002 9.5V14h-14v-2l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71z"/>
              <path fill-rule="evenodd" d="M4.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
            </svg>
        </button>
      </th>`;
    } else {
      table += `<th>
        <button type="button" class="btn btn-link btn-sm" disabled>
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-image" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12z"/>
              <path d="M10.648 7.646a.5.5 0 0 1 .577-.093L15.002 9.5V14h-14v-2l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71z"/>
              <path fill-rule="evenodd" d="M4.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
            </svg>
        </button>
      
      </th>`;
    }
    table += `
    <td>
      <button type="button" onclick="RemoveProduct('${Data.IdProduct}')" class="btn btn-link btn-sm">
        <svg class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="red" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"></path>
        </svg>
      </button>
    </td>`;
    table += `</tr>`;
  });

  return table;
}

window.RemoveProduct = (id) => {
  // find index Recipe
  let index = JsonProducts.Product.findIndex((obj) => obj.IdProduct == id);
  // remove index from json
  JsonProducts.Product.splice(index, 1);

  if (JsonProducts.Product == 0) {
    $("#btn_gravar").prop("disabled", true);
  }

  $("#table_products").html(table(JsonProducts.Product));
  UpdateFooter();
};

function ProductOperation(value) {
  if (value == "Null") {
    $("#Operation").html(
      '<input class="form-control" type="text" name="ProductAdd" disabled></input>'
    );
    $("output").remove();

    $("#ProductPrice").prop("disabled", true);
    $("#ProductQuantity").prop("disabled", true);
    $("#Add_products").prop("disabled", true);
    $("#ProductPrice").val("");
    $("#ProductQuantity").val("");
  } else if (value == "C") {
    $("#Operation").html(`
      <input class="form-control col-9" type="text" name="ProductAdd" id="DescriptionProduct"></input>
      <label for="file-image" class='btn btn-primary ml-2 col-2' style="height: 41px;">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-image-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094L15.002 9.5V13a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-1zm5-6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>
      </label>
      <input type="file" id="file-image" style="display: none;" accept="image/*" onchange="showPreview(event);" >
    `);
    $("#ProductPrice").prop("disabled", false);
    $("#ProductQuantity").prop("disabled", false);
    $("#Add_products").prop("disabled", false);

    $("#ProductPrice").val("");
    $("#ProductQuantity").val("");

    $("form#form_add_product").append(`
    <output style="text-align: center;display: block;" id="list"></output>`);
  } else if (value == "N") {
    $("output").remove();
    xmlHttpGet("/api/AllProduct", () => {
      success(() => {
        let Data = JSON.parse(xhttp.responseText);
        $("#Operation").html(Cmb_Product(Data));
      });
    });
  }

  // for accept more pictures multiple="multiple"
}

function GetPrice(_id) {
  if (_id != "null") {
    xmlHttpGet(
      "/Api/ProductGetPrice/",
      () => {
        success(() => {
          let Data = JSON.parse(xhttp.responseText);
          $("#ProductPrice").val(Data.Value);
        });
      },
      _id
    );

    $("#ProductPrice").prop("disabled", false);
    $("#ProductQuantity").prop("disabled", false);
    $("#Add_products").prop("disabled", false);
  } else {
    $("#ProductPrice").prop("disabled", true);
    $("#ProductQuantity").prop("disabled", true);
    $("#Add_products").prop("disabled", true);

    $("#ProductPrice").val("");
    $("#ProductQuantity").val("");
  }
}

function Cmb_Product(Data) {
  var table = `<select id="SelectProduct" class="form-control" name='ProductAdd' onchange="GetPrice(this.value)">
  <option value='null'>Selecione...</option>`;
  Data.forEach((Data) => {
    table += `<option value='${Data._id}'>${Data.Description}</option>`;
  });
  table += `</select>`;
  return table;
}

function showPreview(event) {
  var fileList = [];
  let QuantityImages = $("#list > span").length;

  if (QuantityImages >= 1) {
    alert("No máximo 1 imagem");
    return;
  }

  // Verificar quantidade de imagens
  if (event.target.files.length > 1) {
    alert("No máximo 1 imagem");
    return;
  }

  for (var i = 0; i < event.target.files.length; i++) {
    fileList.push(event.target.files[i]);
  }

  for (var i = 0, f; (f = fileList[i]); i++) {
    // Only process image files.
    if (!f.type.match("image.*")) {
      continue;
    }

    var reader = new FileReader();

    reader.onload = (function (theFile) {
      return function (e) {
        (function () {
          var image = new Image();
          image.addEventListener(
            "load",
            function () {
              // real size
              var canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");
              // coordenadas origem (source)

              // size
              var MAX_WIDTH = 400;
              var MAX_HEIGHT = 400;
              var width = this.width;
              var height = this.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(this, 0, 0, width, height);

              let ext = theFile.name.split(".");
              // get image
              var dataurl = canvas.toDataURL("image/" + ext[ext.length - 1]);

              var span = document.createElement("span");
              span.setAttribute("style", "position: relative;");
              span.setAttribute("id", theFile.name);
              span.setAttribute("class", "span_images");

              span.innerHTML = [
                '<img class="img-thumbnail" src="',
                dataurl,
                '" title="',
                escape(theFile.name),
                '"/>',
                '<a href="#" onclick="Remove_Image(this);" class="btn btn-danger rmv_button">REMOVE</a>',
              ].join("");
              document.getElementById("list").insertBefore(span, null);
            },
            false
          );
          image.src = e.target.result;
        })();
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
}

function Remove_Image(element) {
  $(element).parent().remove();
}

function ShowImage(id) {
  // Get the modal
  let modal = document.getElementById("myModal");

  // Get the image and insert it inside the modal - use its "alt" text as a caption

  let modalImg = document.getElementById("img01");

  let index = JsonProducts.Product.findIndex((obj) => obj.IdProduct == id);

  modal.style.display = "block";
  modal.style.zIndex = "9999";

  modalImg.src = JsonProducts.Product[index].Image;

  // Get the <span> element that closes the modal
  let span = document.getElementsByClassName("close_img")[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };
}

$("#btn_gravar").on("click", () => {
  xmlHttpPostJson(
    "/api/AddProduction",
    () => {
      success(() => {
        let response = xhttp.responseText;
        if (response == "saved") {
          Swal.fire("Success!", "Pedido de Produção Lançada ", "success");
          // clear started and delivery dates and clear all fields
          newProduction();
          // enable all inputs from header
          EditHeader();
          // clear json
          JsonProducts = [];
          $("#table_products").html(table(JsonProducts));

          $("a:contains(Pesquisar)").click();
        }
      });
    },
    JSON.stringify(JsonProducts)
  );
});

function UpdateFooter() {
  let ValueTotal = 0;
  let quantity = 0;
  let ArrayPrice = Array.from(document.getElementsByClassName("price_table"));
  let ArrayQuantity = Array.from(
    document.getElementsByClassName("quantity_table")
  );
  ArrayPrice.forEach((e) => {
    // console.log(e.innerHTML);
    ValueTotal += parseFloat(e.innerHTML);
  });

  ArrayQuantity.forEach((e) => {
    // console.log(e.innerHTML);
    quantity += parseFloat(e.innerHTML);
  });

  if(ValueTotal == 0){
    ValueTotal = '';
  }
  if(quantity == 0){
    quantity = '';
  }

  document
    .getElementsByTagName("tfoot")[0]
    .getElementsByTagName("th")[4].innerHTML = ValueTotal;
  document
    .getElementsByTagName("tfoot")[0]
    .getElementsByTagName("th")[3].innerHTML = quantity;
}

window.EditHeader = () => {
  // Enable all form's input
  $("input[type=text]").prop("disabled", false);
  $("input[type=date]").prop("disabled", false);
  $("input[type=radio]").prop("disabled", false);
  // Enable submit button
  $("button[type=submit]").prop("disabled", false);
  // remove button cancel
  $("button").remove(":contains('Cancel')");
  // hide List Products
  $("#ProductList").hide();
};

function newProduction() {
  $("input[type=text], input[type=date]").val("");
  ClearFields();
}

function ClearFields() {
  // remove pictures
  $("output").remove();
  // select type index 0
  $("select#SelectType").prop("selectedIndex", 0);
  // edit div product
  ProductOperation("Null");
  $("#ProductPrice").val();
  $("#ProductQuantity").val();
}

$("a:contains(Todos)").click(() => {
  xmlHttpGet(
    "api/Production/",
    () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);
        $("#Grid_Todos").html(Grid(response));
      });
    },
    "T"
  );
});

$("a:contains(Pendentes)").click(() => {
  xmlHttpGet(
    "api/Production/",
    () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);
        $("#Grid_Pendente").html(Grid(response));
      });
    },
    "A"
  );
});

$("a:contains(Em Produção)").click(() => {
  xmlHttpGet(
    "api/Production/",
    () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);
        $("#Grid_Production").html(Grid(response));
      });
    },
    "P"
  );
});

$("a:contains(Finalizados)").click(() => {
  xmlHttpGet(
    "api/Production/",
    () => {
      success(() => {
        let response = JSON.parse(xhttp.responseText);
        $("#Grid_Finalizado").html(Grid(response));
      });
    },
    "F"
  );
});

function SelectClient(id) {
  xmlHttpGet(
    "/api/Client/",
    () => {
      success(() => {
        var Data = JSON.parse(xhttp.responseText);
        $("#AdressDelivery").val(Data[0].Address);
      });
    },
    id
  );
}

function Grid(Data) {
  let grid = "";
  Data.forEach((e) => {
    grid += `
<tr>
  <td>${e.Client[0].Name}</td>
  <td>${moment(e.DeliveryDate).format("DD/MM/YYYY")}</td>
`;
    if (e.Priority === "H") {
      grid += `<td>Alta</td>`;
    } else if (e.Priority === "L") {
      grid += `<td>Baixa</td>`;
    } else if (e.Priority === "A") {
      grid += `<td>Média</td>`;
    }

    if (e.Status.Status === "A") {
      grid += `<td>Pendente</td>`;
    } else if (e.Status.Status === "P") {
      grid += `<td>Em Produção</td>`;
    } else if (e.Status.Status === "F") {
      grid += `<td>Finalizado</td>`;
    } else if (e.Status.Status === "E") {
      grid += `<td>Entregue</td>`;
    }

    // if (e.Status.Status === "F") {
    //   grid += `<td>&nbsp;</td>`;
    // } else {
      grid += `
        <td>
        <div class="table-actions">
            <button type="submit" name='id' value='${e._id}'
                class="btn btn-icon btn-primary"><i
                    class="ik ik-eye"></i></button>
        </div>
        </td>
      </tr>`;
    
  });
  return grid;
}
