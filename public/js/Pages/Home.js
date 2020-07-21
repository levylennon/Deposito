window.onload = function () {
  xmlHttpGet("Api/Home", () => {
    success(() => {
      let response = JSON.parse(xhttp.responseText);
      Widgets(response);
    });
  });

  function Widgets(Data) {
    for (let i = 0; i < 4; i++) {
      document.getElementsByTagName("h2")[i].innerText = Data[i];
    }
  }
};
