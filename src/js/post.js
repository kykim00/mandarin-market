const post = document.querySelector(".sec_post");
const form = document.querySelector(".form_comment");
const btnMore = document.querySelectorAll(".btn_more");
const btnClose = document.querySelectorAll(".btn_close");
// 뒤로가기
const btnBack = document.querySelector(".btn_back");
btnBack.addEventListener("click", () => {
  window.history.back();
});

// 모달 출력: 개인 계정 설정
function modalSet() {
  const btnMenu = document.querySelector(".btn_menu");
  const modalSet = document.querySelector(".modal_set");

  btnMenu.addEventListener("click", () => {
    modalSet.classList.toggle("on");
  });
  btnClose[0].addEventListener("click", () => {
    modalSet.classList.toggle("on");
  });
}
modalSet();

// 모달 출력: 신고하기
function modalNotify() {
  const modalNotify = document.querySelector(".modal_notify");

  btnMore.forEach((i) => {
    i.addEventListener("click", () => {
      modalNotify.classList.toggle("on");
    });
  });
  btnClose[2].addEventListener("click", () => {
    modalNotify.classList.toggle("on");
  });
}
modalNotify();

// 이미지 3장
function imgShow() {
  const img = post.querySelectorAll(".item_img");
  const btnSlide = post.querySelectorAll(".btn_slide");

  btnSlide[0].classList.add("on");
  img[0].classList.add("on");
  if (btnSlide.length == 3) {
    btnSlide[0].addEventListener("click", () => {
      img[0].style.display = "block";
      img[1].style.display = "none";
      img[2].style.display = "none";
      btnSlide[0].style.backgroundColor = "#F26E22";
      btnSlide[1].style.backgroundColor = "#FFFFFF";
      btnSlide[2].style.backgroundColor = "#FFFFFF";
    });
    btnSlide[1].addEventListener("click", () => {
      img[0].style.display = "none";
      img[1].style.display = "block";
      img[2].style.display = "none";
      btnSlide[0].style.backgroundColor = "#FFFFFF";
      btnSlide[1].style.backgroundColor = "#F26E22";
      btnSlide[2].style.backgroundColor = "#FFFFFF";
    });
    btnSlide[2].addEventListener("click", () => {
      img[0].style.display = "none";
      img[1].style.display = "none";
      img[2].style.display = "block";
      btnSlide[0].style.backgroundColor = "#FFFFFF";
      btnSlide[1].style.backgroundColor = "#FFFFFF";
      btnSlide[2].style.backgroundColor = "#F26E22";
    });
  } else if (btnSlide.length == 2) {
    btnSlide[0].addEventListener("click", () => {
      img[0].style.display = "block";
      img[1].style.display = "none";
      btnSlide[0].style.backgroundColor = "#F26E22";
      btnSlide[1].style.backgroundColor = "#FFFFFF";
    });
    btnSlide[1].addEventListener("click", () => {
      img[0].style.display = "none";
      img[1].style.display = "block";
      btnSlide[0].style.backgroundColor = "#FFFFFF";
      btnSlide[1].style.backgroundColor = "#F26E22";
    });
  }
}

// 입력창 활성화
function send() {
  const textarea = form.querySelector(".inp_comment");
  const btn = form.querySelector(".btn_comment");

  textarea.addEventListener("keyup", () => {
    if (textarea.value != "") {
      btn.removeAttribute("disabled");
      btn.style.color = "#F26E22";
    } else if (textarea.value == "") {
      btn.hasAttribute("disabled");
      btn.style.color = "#C4C4C4";
    }
  });
}
send();

// API
async function getPostData() {
  const url = "https://api.mandarin.cf";
  const postId = localStorage.getItem("postId");
  const token = localStorage.getItem("Token");
  const res = await fetch(url + `/post/${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  const post = json.post;
  // 데이터 호출
  const profileImage = post.author.image;
  const username = post.author.username;
  const accountname = post.author.accountname;
  const content = post.content;
  const image = post.image;
  const postImgLength = image.split(",").length;
  const heartCount = post.heartCount;
  const commentCount = post.commentCount;
  const hearted = post.hearted;
  const createdAt = post.createdAt.split("-");
  // 데이터 입력
  const secPost = document.querySelector(".sec_post");
  const postProfile = secPost.querySelector(".img_profile");
  const postName = secPost.querySelector(".data_name");
  const postAccount = secPost.querySelector(".data_account");
  const postContent = secPost.querySelector(".data_content");
  const postImg = secPost.querySelector(".data_img");
  const postHeart = secPost.querySelector(".data_heart");
  const postComment = secPost.querySelector(".data_comment");
  const postCreate = secPost.querySelector(".data_create");
  const btnSlide = secPost.querySelector(".list_btnSlide");
  const listImg = secPost.querySelector(".list_img");
  // 데이터 출력
  postProfile.style.backgroundImage = `url(${profileImage})`;
  postName.textContent = username;
  postAccount.textContent = accountname;
  postContent.textContent = content;
  postHeart.textContent = heartCount;
  postComment.textContent = commentCount;
  postCreate.textContent = `${createdAt[0]}년 ${
    createdAt[1]
  }월 ${createdAt[2].slice(0, 2)}일`;

  if (postImgLength > 1) {
    btnSlide.style.display = "flex";
    for (let i = 0; i < postImgLength; i++) {
      secPost.querySelector(".list_btnSlide").innerHTML += `
      <li><button type="button" class="btn_slide"></button></li>
      `;
      secPost.querySelector(".list_img").innerHTML += `
      <li class="item_img"><img src="${
        image.split(",")[i]
      }" alt="" class="data_img"></li>
      `;
    }
    imgShow();
  } else {
    btnSlide.style.display = "none";
    secPost.querySelector(".list_img").innerHTML += `
    <li class="item_img on"><img src="${image}" alt="" class="data_img"></li>
    `;
  }
}
getPostData();

// 댓글 불러오기
async function getCommentData() {
  const url = "https://api.mandarin.cf";
  const postId = localStorage.getItem("postId");
  const token = localStorage.getItem("Token");
  const res = await fetch(url + `/post/${postId}/comments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const jsonComment = await res.json();
  const comments = jsonComment.comments;
  // 데이터 호출/출력
  comments.forEach((comment) => {
    const listComment = document.querySelector(".list_comment");
    const commentImg = comment.author.image;
    const commentName = comment.author.username;
    const commentCreated = comment.createdAt.split("-");
    const commentContent = comment.content;

    listComment.innerHTML += `
      <li>
        <a href="" class="item_comment">
          <img src="${commentImg}" class="img_profile">
          <div class="wrap_txt_comment">
            <strong>${commentName}</strong>
            <small class="txt_date">${commentCreated[0]}년 ${
      commentCreated[1]
    }월 ${commentCreated[2].slice(0, 2)}일</small>
          </div>
        </a>
        <button type="button" class="btn_more"><img src="../images/icon/icon-more-vertical.png" alt=""></button>
        <p>${commentContent}</p>
      </li>
    `;
  });
}
getCommentData();

// 좋아요
// async function getLike(postId) {
//   const url = `https://api.mandarin.cf/post/${postId}/heart`;
//   await fetch(url, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-type": "application/json",
//     },
//   });
// }
// async function getUnLike(postId) {
//   const url = `https://api.mandarin.cf/post/${postId}/unheart`;
//   await fetch(url, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-type": "application/json",
//     },
//   });
// }
