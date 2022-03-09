// 버튼활성화
const btnLogin = document.querySelector("#btn_login");
const formLogin = document.querySelector(".form_login");
const email = document.querySelector("#inp_loginEmail");
const pwd = document.querySelector("#inp_loginPw");

formLogin.addEventListener("input", () => {
  btnAttrChange();
});
//
function btnAttrChange() {
  if (email.value && pwd.value) {
    btnLogin.disabled = false;
  } else {
    btnLogin.disabled = true;
  }
}
// 비동기 통신을 사용한 로그인 기능
async function login() {
  const url = "https://api.mandarin.cf";
  const loginData = {
    user: {
      email: email.value,
      password: pwd.value,
    },
  };

  const res = await fetch(url + "/user/login", {
    //메소드 구분
    method: "POST",
    //헤더
    headers: {
      "Content-type": "application/json",
    },
    // JSON으로 보내면 받을 수 없다. 문자열로 바꿔줘야 한다. 문자열로 바꾸는 것
    body: JSON.stringify(loginData),
  });
  // console.log(res);
  const json = await res.json(); // res.json()도 비동기. await을 해줘야한다.
  // console.log(json);
  if (json.message) {
    document.querySelector(
      ".txt_loginWarn"
    ).innerText = `*이메일 또는 비밀번호가 일치하지 않습니다`;
  }
  console.log(json);
  // 토큰 => 접속판단, 어카운트네임 => 회원정보 판단
  localStorage.setItem("Token", json.user.token);
  localStorage.setItem("Accountname", json.user.accountname);
  location.href = "home.html";
}
const $loginBtn = document.querySelector("#btn_login");
$loginBtn.addEventListener("click", login);
