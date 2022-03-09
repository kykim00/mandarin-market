let userId = "";
let nameInput = document.getElementById("username");
let accountInput = document.getElementById("accountname");
const btnSave = document.querySelector(".btn-save");
let nameFlag = false;
let idFlag = false;

// 기존 계정 정보 불러오기
async function getUserData() {
  const token = localStorage.getItem("Token");
  const accountName = localStorage.getItem("Accountname");
  const res = await fetch(`https://api.mandarin.cf/profile/${accountName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  console.log(json.profile);
  const userImg = document.getElementById("label-img");
  const intro = document.getElementById("intro");
  const userImgUrl = json.profile.image;
  userImg.style.backgroundImage = `url(${userImgUrl})`;
  // console.log(userImg);
  nameInput.value = json.profile.username;
  accountInput.value = accountName;
  intro.value = json.profile.intro;
  // console.log(json.profile._id);
  userId = json.profile._id;
  nameTest();
  idTest();
  nameInput.focus(); //페이지 로드될 때 nameInput에 focus 되도록 하고, 이때 유효성 검사 일어남.
}
getUserData();

// 이전 페이지로 이동
const btnBack = document.querySelector(".btn-back");
btnBack.addEventListener("click", () => {
  window.history.back();
});

//유효성 검사
function nameTest() {
  const RegExp1 = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,10}$/;
  if (!RegExp1.test(nameInput.value)) {
    nameInput.focus();
    nameFlag = false;
  } else {
    nameFlag = true;
  }
  warnUsername();
}
function idTest() {
  const RegExp2 = /^[a-zA-Z0-9_,]+$/;
  if (!RegExp2.test(accountInput.value)) {
    accountInput.focus();
    idFlag = false;
  } else {
    idFlag = true;
  }
  warnAccountname();
}

//화면이 로딩될 때, nameInput에 focus가 되도록 했고, 이때 바로 유효성 검사가 되도록 함.
nameInput.addEventListener("focus", function () {
  nameTest();
  idUniqueTest();
  btnAttrChange();
});

nameInput.addEventListener("keyup", function () {
  nameTest();
  btnAttrChange();
});

accountInput.addEventListener("keyup", function () {
  idTest();
  idUniqueTest();
  btnAttrChange();
});

//id(accountname) 중복 검사
let uniqueFlag = true;
async function idUniqueTest() {
  const accountname = accountInput.value;
  const res = await fetch(`https://api.mandarin.cf/user`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  const json = await res.json();
  console.log(json);
  userIDs = [];

  //안되는 코드
  // json.map((user) => userIDs.push(user.accountname));
  // const flag = userIDs.find((x) => x === accountname);
  // console.log(!!flag);
  // if(!!flag) {
  //     uniqueFlag = false;
  // } else {
  //     uniqueFlag = true;
  // }

  //되는 코드
  json.map((user) => {
    userIDs.push({ account: user.accountname, id: user._id });
  });
  console.log(userIDs);
  const flag = userIDs.find(
    (x) => x.account === accountname && x.id !== userId
  );
  console.log(`이미 존재하는 id입니다 : ${!!flag}`);

  if (!!flag) {
    uniqueFlag = false;
  } else {
    uniqueFlag = true;
  }
  console.log(`존재하는 id이면 flase가 나올거임 : ${uniqueFlag}`);
  wanrAccountUnique();
  btnAttrChange();
}

// 저장 버튼 활성화 및 비활성화
function btnAttrChange() {
  if (nameFlag && idFlag && uniqueFlag) {
    console.log(`이게 출력되면 abled인거!, ${uniqueFlag}`);
    btnSave.removeAttribute("disabled");
  } else {
    console.log(`이게 출력되면 disabled인거!, ${uniqueFlag}`);
    btnSave.setAttribute("disabled", "disabled");
  }
}

//경고 문구
function warnUsername() {
  const warning = document.getElementById("username-test-warning");
  if (nameFlag === true) {
    warning.style.display = "none";
  } else {
    warning.style.display = "block";
  }
}

function warnAccountname() {
  const warning = document.getElementById("accountname-test-warning");
  if (idFlag === true) {
    warning.style.display = "none";
  } else {
    warning.style.display = "block";
  }
}

function wanrAccountUnique() {
  const warning = document.getElementById("accountname-unique-warning");
  if (uniqueFlag === true) {
    warning.style.display = "none";
  } else {
    warning.style.display = "block";
  }
}

// 프로필 사진 변경
document.querySelector("#input-img").addEventListener("change", profileImage);
let imgPreview = document.getElementById("label-img");

async function profileImage(e) {
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
  const userName = nameInput.value;
  const accountName = accountInput.value;
  const intro = document.querySelector("#intro").value;
  const userImgUrl = imgPreview.style.backgroundImage.slice(5, -2); //url()을 잘라주기 위해서.
  const token = localStorage.getItem("Token");
  try {
    const res = await fetch(`https://api.mandarin.cf/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username: userName,
          accountname: accountName,
          intro: intro,
          image: userImgUrl,
        },
      }),
    });
    const json = await res.json();
    if (res.status == 200) {
      localStorage.setItem("Accountname", json.user.accountname);
      location.href = "./myprofile.html";
    } else {
      console.log(json);
    }
  } catch (err) {
    alert(err);
  }
}
