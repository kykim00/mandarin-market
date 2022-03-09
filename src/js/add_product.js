// 이전 페이지로 이동
const btnBack = document.querySelector(".btn-back");
btnBack.addEventListener("click", () => {
  window.history.back();
});

//유효성 검사
const nameInput = document.getElementById("item-name");
const priceInput = document.getElementById("item-price");
const linkInput = document.getElementById("item-link");
const btnSave = document.querySelector(".btn-save");
let nameFlag = false;
let linkFlag = false;

function nameTest() {
  const RegExp1 = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,15}$/;
  if (!RegExp1.test(nameInput.value)) {
    nameInput.focus();
    nameFlag = false;
  } else {
    nameFlag = true;
  }
  warnName();
}

function priceTest() {
  const RegExp2 = /[^0-9]/gi;
  priceInput.value = priceInput.value.replace(RegExp2, "");
}

function priceChange() {
  priceInput.value = priceInput.value.replace(
    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
    ","
  );
}

function linkTest() {
  const RegExp3 = /(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi;
  if (!RegExp3.test(linkInput.value)) {
    linkInput.focus();
    linkFlag = false;
  } else {
    linkFlag = true;
  }
  warnLink();
}
nameInput.focus();
nameInput.addEventListener("focus", function () {
  nameTest();
  btnAttrChange();
});

nameInput.addEventListener("keyup", function () {
  nameTest();
  btnAttrChange();
});

priceInput.addEventListener("keyup", function () {
  priceTest();
  btnAttrChange();
});

priceInput.addEventListener("blur", priceChange);

linkInput.addEventListener("keyup", function () {
  linkTest();
  btnAttrChange();
});

// 저장 버튼 활성화 및 비활성화
function btnAttrChange() {
  if (nameFlag && priceInput.value && linkFlag) {
    btnSave.removeAttribute("disabled");
  } else {
    btnSave.setAttribute("disabled", "disabled");
  }
}

//경고 문구
function warnName() {
  const warning = document.getElementById("itemname-test-warning");
  if (nameFlag === true) {
    warning.style.display = "none";
  } else {
    warning.style.display = "block";
  }
}

function warnLink() {
  const warning = document.getElementById("itemlink-test-warning");
  if (linkFlag === true) {
    warning.style.display = "none";
  } else {
    warning.style.display = "block";
  }
}

// 상품 사진 변경
document.querySelector("#input-img").addEventListener("change", poductImage);
let imgPreview = document.getElementById("label-img");

async function poductImage(e) {
  const files = e.target.files;
  const result = await imageUpload(files);
  imgPreview.style.backgroundImage = `url(https://api.mandarin.cf/${result})`;
}

async function imageUpload(files) {
  const formData = new FormData();
  formData.append("image", files[0]);

  const res = await fetch(`https://api.mandarin.cf/image/uploadfile`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  const imgFileName = data["filename"];
  return imgFileName;
}

//작성된 내용을 서버에 전송
btnSave.addEventListener("click", formSubmit);

async function formSubmit() {
  const itemName = nameInput.value;
  const itemPrice = parseInt(priceInput.value.replaceAll(",", ""), 10); //number로 변환
  const itemLink = linkInput.value;
  const itemImage = imgPreview.style.backgroundImage.slice(5, -2); //url()을 잘라주기 위해서.
  const token = localStorage.getItem("Token");
  try {
    const res = await fetch(`https://api.mandarin.cf/product`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        product: {
          itemName: itemName,
          price: itemPrice,
          link: itemLink,
          itemImage: itemImage,
        },
      }),
    });
    const json = await res.json();
    if (res.status == 200) {
      location.href = "./myprofile.html";
    } else {
      console.log(json);
    }
  } catch (err) {
    alert(err);
  }
}
