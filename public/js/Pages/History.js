function chooseProduct(_id) {
  if (_id == "Choose...") {
    $("#TableHistory").html("");
    return;
  }
  {
    xmlHttpGet(
      "/Api/History/",
      () => {
        success(() => {
          let Data = JSON.parse(xhttp.responseText);
          $("#TableHistory").html(table(Data));
        });
      },
      _id
    );
  }
}

function table(Data) {
  let table = ''

  Data[0].Stock.forEach((Data) => {
    table += `<tr>`;
    if (Data.Operation == "E") {
      table += `<th>Entrada</th>`;
      table += `<th>${Data.Quantity}</th>`;
      table += `<th>` + DateBr(Data.CreatedAt) + `</th>`;
    } else if (Data.Operation == "O") {
      table += `<th>Saida</th>`;
      table += `<th>${Data.Quantity}</th>`;
      table += `<th>` + DateBr(Data.CreatedAt) + `</th>`;
    } else if (Data.Operation == "P") {
      table += `<th>Produção</th>`;
      table += `<th>${Data.Quantity}</th>`;
      table += `<th>` + DateBr(Data.CreatedAt) + `</th>`;
    } else if (Data.Operation == "C") {
      table +=
        `<th  colspan="3" class="text-center">Cadastrado dia  ` +
        DateBr(Data.CreatedAt) +
        `</th>`;
    }
    table += `</tr>`;
  });

  table += `</tbody>`;
  table += `</table>`;

  return table;
}


