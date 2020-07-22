window.onload = function () {
  "use strict";

  $("form").on("submit", function (e) {
    e.preventDefault();

    let Transition = $("#SelectTransition").val();
    let Description = $("#DescriptionTransition").val().trim();
    let CheckStock = $("#Stock").is(":checked");
    let CheckBilling = $("#Billing").is(":checked");

    if (Description == "") return alert("Preencha a descrição cacete");

    let JsonData = {
      Description: Description,
      Transition: Transition,
      Options: {
        CheckBilling: CheckBilling,
        CheckStock: CheckStock,
      },
    };

    xmlHttpPostJson(
      "/Api/Transaction/New",
      () => {
        success(() => {
          let response = xhttp.responseText;

          if (response == "saved") {
            alert("Success");
          }else{
            alert('err ' + response)
          }
        });
      },
      JSON.stringify(JsonData)
    );
  });
};
