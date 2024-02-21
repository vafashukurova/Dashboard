// $(document).ready(function () {
//   flatpickr("#birthday", {
//     dateFormat: "d-m-Y",
//     maxDate: new Date(),
//   });
// });

$(".table-header").on("click", ".add-auth", function () {
  $("#auth-modal").modal("show");
  $("#auth-modal .modal-body input").val("");
  $("#auth-modal").attr("auth-id", 0);
});

$.ajax({
  url: "https://api.tech-it.az/api/get-authors",
  headers: {
    Accept: "application/json",
  },
  type: "POST",
  data: { candidate_id: 25 },
  success: function (response) {
    response.authors.forEach((author, index) => {
      $("tbody").append(`
      <tr class="table-row d-flex justify-content-between" data-id="${
        author.id
      }">
      <td class="column ">${index + 1}</td>
      <td class="column ">${author.name}</td>
      <td class="column ">${author.surname}</td>
      <td class="column ">${author.degree}</td>
      <td class="column ">${author.birthday}</td>
      <td class="column ">
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

function addAuthToTable(name, surname, degree, birthday, id) {
  $("tbody").append(`
    <tr class="table-row d-flex justify-content-between" data-id="${id}">
    <td class="column ">.</td>
    <td class="column ">${name}</td>
    <td class="column ">${surname}</td>
    <td class="column ">${degree}</td>
    <td class="column ">${birthday}</td>
    <td class="column ">
        <button class="btn btn-edit"><i class="fa fa-pencil"></i></button>
        <button class="btn btn-remove"><i class="fa fa-trash"></i></button>
    </td>

</tr>
      `);
  sirala();
}

$("#auth-modal .modal-footer").on("click", ".btn-add", function () {
  var name = $("#auth-modal .modal-body input[name='name']").val();
  var surname = $('#auth-modal .modal-body input[name="surname"]').val();
  var degree = $('#auth-modal .modal-body input[name="degree"]').val();
  var birthday = $('#auth-modal .modal-body input[name="birthday"]').val();
  var id = $("#auth-modal").attr("auth-id");
  var obj = {
    candidate_id: 25,
    name,
    surname,
    degree,
    birthday,
    id,
  };

  $.ajax({
    url: "https://api.tech-it.az/api/add-edit-author",
    headers: {
      Accept: "application/json",
    },
    type: "POST",
    data: obj,
    success: function (response) {
      addAuthToTable(name, surname, degree, birthday, response.last_id);
      Toastify({
        text: "Müəllif əlavə edildi",
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
      console.log(response);
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

function removeAuthFromTable(tr) {
  var id = tr.attr("data-id");

  $.ajax({
    url: "https://api.tech-it.az/api/delete-author",
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
      removeAuthFromTable(tr);
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
  var id = tr.attr("data-id");
  var name = tr.find("td:eq(1)").text().trim();
  var surname = tr.find("td:eq(2)").text().trim();
  var degree = tr.find("td:eq(3)").text().trim();
  var birthday = tr.find("td:eq(4)").text().trim();
  $('#edit-modal .modal-body input[name="name"]').val(name);
  $('#edit-modal .modal-body input[name="surname"]').val(surname);
  $('#edit-modal .modal-body input[name="degree"]').val(degree);
  $('#edit-modal .modal-body input[name="birthday"]').val(birthday);
  $("#edit-modal").attr("tr-id", id);
  $("#edit-modal").modal("show");
});

$("#edit-modal .modal-footer").on("click", ".btn-add", function () {
  var tr = $(this).parents("tr");
  var id = tr.attr("data-id");

  var new_name = $('#edit-modal .modal-body input[name="name"]').val();
  var new_surname = $('#edit-modal .modal-body input[name="surname"]').val();
  var new_degree = $('#edit-modal .modal-body input[name="degree"]').val();
  var new_birthday = $('#edit-modal .modal-body input[name="birthday"]').val();

  var tr_id = $("#edit-modal").attr("tr-id");
  var tr = $("tbody").find(`tr[data-id="${tr_id}"]`);
  tr.find("td:eq(1)").text(new_name);
  tr.find("td:eq(2)").text(new_surname);
  tr.find("td:eq(3)").text(new_degree);
  tr.find("td:eq(4)").text(new_birthday);

  var obj = {
    candidate_id: 25,
    name: new_name,
    surname: new_surname,
    degree: new_degree,
    birthday: new_birthday,
    id: tr_id,
  };

  $.ajax({
    url: "https://api.tech-it.az/api/add-edit-author",
    headers: {
      Accept: "application/json",
    },
    type: "POST",
    data: obj,
    success: function (response) {
      Toastify({
        text: "Redakt edildi!",
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
