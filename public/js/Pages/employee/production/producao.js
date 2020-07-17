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
