$(".table-header").on("click", ".add-category", function () {
  $("#category-modal").modal("show");
  $("#category-modal .modal-body input").val("");
  $("#category-modal").attr("category-id", 0);
});

$.ajax({
  url: "https://api.tech-it.az/api/get-categories",
  headers: {
    Accept: "application/json",
  },
  type: "POST",
  data: { candidate_id: 25 },
  success: function (response) {
    $("tbody").html("");
    response.categories.forEach((data, index) => {
      $("tbody").append(`
      <tr class="table-row" data-id="${data.id}">
        <td class="column column-1">${index + 1}</td>
        <td class="column column-2">${data.name}</td>
        <td class="column column-3">
          <button class="btn btn-edit"><i class="fa fa-pencil"></i></button>
          <button class="btn btn-remove"><i class="fa fa-trash"></i></button>
        </td>
      </tr>
    `);
    });
  },
  error: function (response) {
    console.log(response);
  },
});

function addCategoryToTable(category_name, id) {
  $("tbody").append(`
      <tr class="table-row" data-id="${id}">
        <td class="column column-1">.</td>
        <td class="column column-2">${category_name}</td>
        <td class="column column-3">
          <button class="btn btn-edit"><i class="fa fa-pencil"></i></button>
          <button class="btn btn-remove"><i class="fa fa-trash"></i></button>
        </td>
      </tr>
    `);
  sirala();
}

$("#category-modal .modal-footer").on("click", ".btn-add", function () {
  $(".category-msg").remove();
  var category_name = $(
    "#category-modal .modal-body input[name='category-name']"
  ).val();
  var id = $("#category-modal").attr("category-id");
  var obj = {
    name: category_name,
    candidate_id: 25,
    id: id,
  };

  $.ajax({
    url: "https://api.tech-it.az/api/add-edit-category",
    headers: {
      Accept: "application/json",
    },
    type: "POST",
    data: obj,
    success: function (response) {
      addCategoryToTable(category_name, response.last_id);
      Toastify({
        text: "Kateqoriya əlavə edildi",
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #22c1c3, #F39A36)",
        },
        css: {
          animation: "fadeIn ease-in-out 0.5s",
        },
      }).showToast();
    },
    error: function (response) {
      Toastify({
        text: "Error!",
        duration: 2000,
        gravity: "top",
        position: "right",
        style: { background: "#F39A36" },
        stopOnFocus: true,
        css: {
          animation: "fadeIn ease-in-out 0.5s",
        },
      }).showToast();
    },
  });
});

function sirala() {
  var i = 0;
  $("tbody tr").each(function () {
    $(this).find("td:eq(0)").text(++i);
  });
}

function removeCategoryFromTable(tr) {
  var id = tr.attr("data-id");
  $.ajax({
    url: "https://api.tech-it.az/api/delete-category",
    headers: {
      Accept: "application/json",
    },
    type: "POST",
    data: { id, candidate_id: 25 },
    success: function (response) {
      tr.remove();
      sirala();
    },
    error: function (response) {
      console.log(response);
    },
  });
}

$("tbody").on("click", ".btn-remove", function () {
  var tr = $(this).parents("tr");
  Swal.fire({
    title: "Silmək istədiyinizə əminsiniz ?",
    text: "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F39A36",
    cancelButtonColor: "#8CB7A4",
    confirmButtonText: "Bəli!",
    cancelButtonText: "Xeyr!",
  }).then((result) => {
    if (result.isConfirmed) {
      removeCategoryFromTable(tr);
      Swal.fire({
        title: "Silmə uğurla başa çatdı!",
        icon: "success",
        customClass: {
          confirmButton: "custom-ok-button-class",
        },
        buttonsStyling: false,
      });
    }
  });
});

$("tbody").on("click", ".btn-edit", function () {
  var tr = $(this).closest("tr");
  var name = tr.find("td:eq(1)").text();

  tr.find("td:eq(1)").data("old-value", name);

  tr.find("td:eq(1)").html(
    `<input class="form-control" name="name" value="${name}">`
  );

  tr.find("td:eq(2)").html(`
        <button type="button" class="btn btn-check"><i class="fa-solid fa-check"></i></button>
        <button type="button" class="btn btn-times"><i class="fa-solid fa-times"></i></button>
    `);
});

$("table tbody").on("click", ".btn-check", function () {
  var tr = $(this).parents("tr");
  var id = tr.attr("data-id");
  var newName = tr.find("td:eq(1) input").val();
  tr.find("td:eq(1)").text(newName);
  tr.find("td:eq(2)").html(`
            <button type="button" class="btn btn-edit"><i class="fa-solid fa-pencil"></i></button>
            <button type="button" class="btn btn-remove"><i class="fa-solid fa-trash"></i></button>
        `);

  $.ajax({
    url: "https://api.tech-it.az/api/add-edit-category",
    headers: {
      Accept: "application/json",
    },
    type: "POST",
    data: { id, candidate_id: 25, name: newName },
    success: function (response) {
      Toastify({
        text: "Redaktə edildi!",
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #22c1c3, #F39A36)",
        },
        css: {
          animation: "fadeIn ease-in-out 0.5s",
        },
      }).showToast();
    },
    error: function (response) {
      Toastify({
        text: "Error!",
        duration: 2000,
        gravity: "top",
        position: "right",
        style: { background: "#F39A36" },
        stopOnFocus: true,
        css: {
          animation: "fadeIn ease-in-out 0.5s",
        },
      }).showToast();
    },
  });
});

$("table tbody").on("click", ".btn-times", function () {
  var tr = $(this).closest("tr");

  var oldName = tr.find("td:eq(1)").data("old-value");

  tr.find("td:eq(1)").text(oldName);
  tr.find("td:eq(2)").html(`
          <button type="button" class="btn btn-edit"><i class="fa-solid fa-pencil"></i></button>
          <button type="button" class="btn btn-remove"><i class="fa-solid fa-trash"></i></button>
      `);
});
