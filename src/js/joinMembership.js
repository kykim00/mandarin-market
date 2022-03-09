// ------------------ 이메일 비밀번호 섹션 -------------------
// 유효성검사와 버튼활성화
const btnNext = document.querySelector(".btn_next");
const formSignIn = document.querySelector(".form_signIn");
const email = document.querySelector("#inp_loginEmail");
const pwd = document.querySelector("#inp_loginPw");

const pwdWarn = document.querySelector(".txt_pwdWarn");
const emailWarnRegExp = document.querySelector(".txt_emailWarn.RegExp");
// 이메일 유효성검사 정규표현식
const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
email.addEventListener("input", () => {
  if (exptext.test(email.value) == false) {
    emailWarnRegExp.style.display = "inline";
  } else if (exptext.test(email.value) == true) {
    emailWarnRegExp.style.display = "none";
  }
});

// 비밀번호 유효성검사 (6자 이상)
pwd.addEventListener("input", () => {
  if (pwd.value.length < 6) {
    pwdWarn.style.display = "inline";
  } else {
    pwdWarn.style.display = "none";
  }
});

// 버튼활성화 => disabled 쓰기
formSignIn.addEventListener("input", () => {
  btnAttrChange();
});
function btnAttrChange() {
  if (exptext.test(email.value) && pwd.value.length > 5) {
    btnNext.disabled = false;
  } else {
    btnNext.disabled = true;
  }
}
// 프로필설정으로 넘어가기
const $signIn = document.querySelector(".signIn");
const $setProfile = document.querySelector(".set_profile");

// 이메일 중복체크 함수
const url = "https://api.mandarin.cf";
async function checkEmailValid(email) {
  const emailData = {
    user: {
      email: email,
    },
  };
  const res = await fetch(url + "/user/emailvalid", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emailData),
  });
  const json = await res.json();
  return json.message == "사용 가능한 이메일 입니다." ? true : false;
}

btnNext.addEventListener("click", async () => {
  const emailVal = email.value;
  const emailValid = await checkEmailValid(emailVal);
  if (emailValid) {
    $signIn.style.display = "none";
    $setProfile.style.display = "block";
  } else {
    document.querySelector(".txt_emailWarn.Duplicate").style.display = "inline";
  }
});

// 경고문구 처리
email.addEventListener("keyup", () => {
  document.querySelector(".txt_emailWarn.Duplicate").style.display = "none";
});
// 데이터(사진) 보내기

const imgPre = document.querySelector("#img_pre");
async function imageUpload(files) {
  const formData = new FormData();
  formData.append("image", files[0]); //formData.append("키이름","값")
  const res = await fetch(`https://api.mandarin.cf/image/uploadfile`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  const productImgName = data["filename"];
  return productImgName;
}

// 사진을 응답받은 값으로 뿌리기
async function profileImage(e) {
  const files = e.target.files;
  const result = await imageUpload(files);
  imgPre.src = url + "/" + result;
}
// 인풋에 변화가 생기면 해당 태그의 소스값을 서버에서 받아온다
document.querySelector("#inp_img").addEventListener("change", profileImage);

// 유효성검사
const userName = document.querySelector("#inp_name");
const warnLength = document.querySelector("#warn_length");
userName.addEventListener("keyup", nameCheck);

function nameCheck() {
  if (
    userName.value.replace(/(\s*)/g, "").length < 2 ||
    userName.value.replace(/(\s*)/g, "").length > 10
  ) {
    warnLength.style.display = "inline";
    nameFlag = false;
  } else {
    warnLength.style.display = "none";
    nameFlag = true;
  }
}

let nameFlag = false;
let idFlag = false;

// 계정 아이디 => 영문,숫자,특수문자(.),(_)
const userId = document.querySelector("#inp_Id");
userId.addEventListener("input", idCheck);
userId.addEventListener("input", () => {
  warnDuplicate.style.display = "none";
});

function idCheck() {
  const exptext = /^[A-Za-z0-9_.]{1,}$/;
  const warnExp = document.querySelector("#warn_valid");
  if (!exptext.test(userId.value)) {
    warnExp.style.display = "inline";
    idFlag = false;
  } else if (exptext.test(userId.value)) {
    warnExp.style.display = "none";
    idFlag = true;
  }
}
// 시작하기 버튼 활성화
userName.addEventListener("input", btnActive);
userId.addEventListener("input", btnActive);
function btnActive() {
  if (nameFlag && idFlag) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}
// 종합으로 내 프로필설정값 보내기
const submitBtn = document.querySelector(".btn_start");
const warnDuplicate = document.querySelector("#warn_userdId");

async function join() {
  const email = document.querySelector("#inp_loginEmail").value;
  const password = document.querySelector("#inp_loginPw").value;
  const userName = document.querySelector("#inp_name").value;
  const userId = document.querySelector("#inp_Id").value;
  const intro = document.querySelector("#inp_intro").value;
  const imageUrl = document.querySelector("#img_pre").src;

  try {
    const res = await fetch("https://api.mandarin.cf/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          email: email,
          password: password,
          username: userName,
          accountname: userId,
          intro: intro,
          image: imageUrl,
        },
      }),
    });
    const json = await res.json();
    const message = json.message;
    if (res.status == 200) {
      location.href = "./loginEmail.html";
    } else {
      warnDuplicate.style.display = "inline";
    }
  } catch (err) {
    alert(err);
  }
}
submitBtn.addEventListener("click", join);
