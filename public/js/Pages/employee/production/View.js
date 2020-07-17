function ShowImage(image) {
  // Get the modal
  let modal = document.getElementById("myModal");

  // Get the image and insert it inside the modal - use its "alt" text as a caption

  let modalImg = document.getElementById("img01");

  modal.style.display = "block";
  modal.style.zIndex = "9999";

  modalImg.src = image;

  // Get the <span> element that closes the modal
  let span = document.getElementsByClassName("close_img")[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };
}

$("#Terminar").on("click", function () {
  let Data = {
    _id: $("#_id").val(),
    User: $("#userDropdown").text().trim(),
  };

  xmlHttpPostJson(
    "Terminar",
    () => {
      success(() => {
        let response = xhttp.responseText;
        if (response == "success") {
          window.location.href = "/Funcionario";
        }
      });
    },
    JSON.stringify(Data)
  );
});
