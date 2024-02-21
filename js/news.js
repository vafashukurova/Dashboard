$(document).ready(function () {
  $.ajax({
    url: "https://api.tech-it.az/api/get-categories",
    headers: {
      Accept: "application/json",
    },
    type: "POST",
    data: { candidate_id: 25 },
    success: function (response) {
      console.log(response);

      response.categories.forEach((category, index) => {
        const option = `
        <option value="${category.id}">${category.name}</option>
        `;

        $(".select-category").append(option);
      });
    },
    error: function (response) {
      console.log(response);
    },
  });

  $.ajax({
    url: "https://api.tech-it.az/api/get-authors ",
    headers: {
      Accept: "application/json",
    },
    type: "POST",
    data: { candidate_id: 25 },
    success: function (response) {
      console.log(response);

      response.authors.forEach((author, index) => {
        const option = `
          <option value="${author.id}">${author.name}</option>
          `;
        $(".select-author").append(option);
      });
    },
    error: function (response) {
      console.log(response);
    },
  });
});

$(".table-header").on("click", ".add-news", function () {
  $("#news-modal").modal("show");
  $("#news-modal .modal-body input").val("");
  $("#news-modal").attr("news-id", 0);
  $("#news-modal .modal-body #summernote").summernote("code", " ");
  $("#news-modal .modal-body select").val("");
});

$("#summernote").summernote({
  height: 150,
  placeholder: "Xəbərin Məzmunu",
  toolbar: [
    ["style", ["bold", "italic", "underline", "clear"]],
    ["font", ["strikethrough", "superscript", "subscript"]],
    ["fontsize", ["fontsize"]],
    ["color", ["color"]],
    ["para", ["ul", "ol", "paragraph"]],
    ["height", ["height"]],
  ],
});

$.prototype.getInfo = function () {
  var description = $(this).data("description");
  console.log(description);
  $("#description-modal .modal-body").text(description);
  $("#description-modal").modal("show");
};

function allNews() {
  $.ajax({
    url: "https://api.tech-it.az/api/get-all-news",
    headers: {
      Accept: "application/json",
    },
    type: "POST",
    data: { candidate_id: 25 },
    success: function (response) {
      console.log(response);
      $("tbody").html("");
      response.allNews.forEach((news, index) => {
        console.log("allnews",news.category_name);
        $("tbody").append(`
        <tr class="table-row d-flex justify-content-between" data-id="${
          news.id
        }">
          <td class="column ">${index + 1}</td>
          <td class="column "><img src="${
            news.cover
          }" style="width: 50px; height: 50px;"></td>
          <td class="column ">${news.category_name}</td>
          <td class="column ">${news.title}</td>
          <td class="column ">${news.author_name}</td>
          <td class="column ">${news.date}</td>
          <td class="column-description" style="display: none;">${
            news.description
          }</td>
          <td class="column ">
            <button class="btn btn-info" onclick="$(this).getInfo()" data-description="${
              news.description
            }"><i class="fa-solid fa-circle-info"></i></button>
            <button class="btn btn-edit" onclick="$(this).editNews()"><i class="fa fa-pencil"></i></button>
            <button class="btn btn-remove"><i class="fa fa-trash"></i></button>
          </td>
        </tr>
      `);
        sirala();
      });
    },
    error: function (response) {
      console.log(response);
    },
  });
}
allNews();

$("#news-modal .modal-footer").on("click", ".btn-add", function () {
  var cover = $('input[name="image"]')[0].files[0];
  var category_id = $(
    '#news-modal select[name="category"] option:selected'
  ).val();

  var title = $('#news-modal .modal-body input[name="title"]').val();
  var description = $("#news-modal .modal-body #summernote").summernote("code");
  var author_id = $('select[name="auth"] option:selected').val();
  var date = $('#news-modal .modal-body input[name="date"]').val();
  var id = $("#news-modal").attr("news-id");

  var formData = new FormData();
  formData.append("candidate_id", 25);
  formData.append("category_id", category_id);
  formData.append("author_id", author_id);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("date", date);
  formData.append("cover", cover);
  formData.append("id", id);

  $.ajax({
    url: "https://api.tech-it.az/api/add-edit-news",
    headers: {
      Accept: "application/json",
    },
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    cache: false,
    success: function (response) {
      console.log(response);
      allNews();
      Toastify({
        text: "Xəbər əlavə edildi",
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

function removeNewsFromTable(tr) {
  var id = tr.attr("data-id");

  $.ajax({
    url: "https://api.tech-it.az/api/delete-news",
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
      removeNewsFromTable(tr);
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

$("#news-modal .modal-footer").on("click", ".btn-delete", function () {
  $("#news-modal").modal("hide");
});

$("#description-modal .modal-footer").on("click", ".btn-delete", function () {
  $("#description-modal").modal("hide");
});

$.prototype.editNews = function () {
  $("#edit-modal").modal("show");
  var tr = $(this).closest("tr");
  var id = tr.attr("data-id");
  var category = tr.find("td:eq(2)").text().trim();
  var title = tr.find("td:eq(3)").text().trim();
  var author = tr.find("td:eq(4)").text().trim();
  var date = tr.find("td:eq(5)").text().trim();
  var description = tr.find("td:eq(6)").text().trim();

  $(
    '#edit-modal select[name="category"] option:contains("' + author + '")'
  ).prop("selected", true);

  $(
    '#edit-modal select[name="category"] option:contains("' + category + '")'
  ).prop("selected", true);
  $("#edit-modal .modal-body input[name='title']").val(title);
  $("#edit-modal .modal-body #summernote").summernote("code", description);
  $("#edit-modal .modal-body input[name='date']").val(date);
  $("#edit-modal").attr("tr-id", id);
};

$("#edit-modal .modal-footer").on("click", ".btn-delete", function () {
  $("#edit-modal").modal("hide");
});


$(".select-category").on('change', function() {
  $(".select-category option").removeClass('selected');
  const selectedOption = $(".select-category option:selected");
  selectedOption.addClass('selected');  
  console.log("Selected Category ID:", selectedOption.val());
})

$("#edit-modal .modal-footer").on("click", ".btn-add", function () {
  $("#description-modal .modal-body").text(" ");
  var tr = $(this).parents("tr");
 

  // var new_category_id = $('select[name="category"] option:selected').val();
  var new_category_id = $('select[name="category"] option:selected').val();
  // console.log(new_category_id);
  // var new_category_name = $(
  //   `#edit-modal .modal-body select[name='category'] option[value='${new_category_id}']`
  // ).text();
  console.log("id", new_category_id);
  var new_category_name = $(
    "#edit-modal .modal-body select[name='category'] option:selected"
  ).text();

  var new_title = $("#edit-modal .modal-body input[name='title']").val();
  var new_description = $("#edit-modal .modal-body #summernote").summernote(
    "code"
  );

  var new_auth_name = $(
    "#edit-modal .modal-body select[name='auth'] option:selected"
  ).text();
  var new_auth_id = $('select[name="auth"] option:selected').val();

  var new_date = $("#edit-modal .modal-body input[name='date']").val();
  var new_category_name = $(
    `#edit-modal .modal-body select[name='category'] option:selected`
  ).text();
  console.log(new_category_name);

  var tr_id = $("#edit-modal").attr("tr-id");
  var tr = $("tbody").find(`tr[data-id="${tr_id}"]`);

  var obj = {
    candidate_id: 25,
    title: new_title,
    description: new_description,
    date: new_date,
    category_id: new_category_id,
    author_id: new_auth_id,
    id: tr_id,
  };

  $.ajax({
    url: "https://api.tech-it.az/api/add-edit-news",
    headers: {
      Accept: "application/json",
    },
    type: "POST",
    data: obj,
    success: function (response) {
      tr.find("td:eq(2)").text(new_category_name);
      tr.find("td:eq(3)").text(new_title);
      tr.find("td:eq(4)").text(new_auth_name);
      tr.find("td:eq(5)").text(new_date);
      tr.find("td:eq(6)").text(new_description);
      $("#description-modal .modal-body").text(new_description);
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

