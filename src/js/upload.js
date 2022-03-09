const form = document.querySelector(".form_upload");

// 뒤로가기
const btnBack = document.querySelector(".btn_back");
btnBack.addEventListener("click", () => {
  window.history.back();
});

// 버튼 활성화
function send() {
  const textarea = form.querySelector(".inp_textarea");
  const file = form.querySelector(".inp_file");
  const btn = form.querySelector(".btn_upload");

  textarea.addEventListener("keyup", () => {
    if (textarea.value != "") {
      btn.removeAttribute("disabled");
      btn.style.backgroundColor = "#F26E22";
    } else if (textarea.value == "" && file.value == "") {
      btn.setAttribute("disabled", "disabled");
      btn.style.backgroundColor = "#FFC7A7";
    }
  });
  file.addEventListener("change", () => {
    if (file.value != "") {
      btn.removeAttribute("disabled");
      btn.style.backgroundColor = "#F26E22";
    } else {
      btn.setAttribute("disabled", "disabled");
    }
  });
}
send();

// 게시글 입력창
const textarea = form.querySelector(".inp_textarea");
textarea.addEventListener("keyup", () => {
  textarea.style.height = "1px";
  textarea.style.height = 12 + textarea.scrollHeight + "px";
});

// 사진 미리보기 출력
const inputImg = form.querySelector(".inp_file");
const listImg = form.querySelector(".list_img");
const btnImg = form.querySelector(".btn_imgLoad");
function previewImg(e) {
  if (inputImg.files.length <= 3) {
    for (var image of e.target.files) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.setAttribute("src", e.target.result);
        listImg.appendChild(img);
        if (inputImg.files.length > 1) img.setAttribute("class", "img_upload");
      };
      reader.readAsDataURL(image);
    }
  } else {
    alert("사진은 3장을 초과할 수 없습니다.");
    return false;
  }
}
inputImg.addEventListener("change", previewImg);

// 사진버튼을 누르면 사진 초기화 및 재선택
btnImg.addEventListener("click", () => {
  const img = listImg.querySelectorAll("img");
  inputImg.value = "";
  img.forEach((i) => {
    i.remove();
  });
});

// API
const $image = document.querySelector(".inp_file");
const $content = document.querySelector(".inp_textarea");
const $submitBtn = document.querySelector(".btn_upload");

async function imageUpload(files, index) {
  const formData = new FormData();
  formData.append("image", files[index]);
  const res = await fetch(`https://api.mandarin.cf/image/uploadfile`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  const productImgName = data["filename"];
  return productImgName;
}

async function createPost(e) {
  const url = "https://api.mandarin.cf";
  const token = localStorage.getItem("Token");
  const contentText = $content.value;
  const imageUrls = [];
  const files = $image.files;

  if (files.length <= 3) {
    for (let index = 0; index < files.length; index++) {
      const imgurl = await imageUpload(files, index);
      imageUrls.push(url + "/" + imgurl);
    }
    const res = await fetch(url + "/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        post: {
          content: contentText,
          image: imageUrls + "",
        },
      }),
    });
  } else {
    alert("이미지가 3장을 초과했습니다.");
  }
}

$submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createPost();
  window.history.back();
});
