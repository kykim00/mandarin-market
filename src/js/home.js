const feedImages = document.querySelectorAll(".imagelist_feed");
const feedCard = document.querySelector(".card_wrap");
const article = document.querySelector(".card_feed");
const feedSection = document.querySelector(".feed_section");
const moreImageBtn = document.querySelectorAll(".more_image");
const modal = document.querySelector(".modal");
const modalProfile = document.querySelector(".modal_profile");
const closeBtn = modal.querySelector(".close-area");
const logoutProfile = document.querySelector(".logout_profile");
const modalContent = document.querySelector(".content");
const token = localStorage.getItem("Token");
const contentFeed = document.querySelector(".content_feed");

// 팔로잉 리스트 가져오기
async function getFollowing() {
  const url = "https://api.mandarin.cf";
  const accountName = localStorage.getItem("Accountname");
  const res = await fetch(
    url + `/profile/${accountName}/following?limit=Number&skip=Number`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );

  const json = await res.json();
  getNumber(json.length);
}

getFollowing();

// 피드 불러오기
async function getFeed() {
  const url = "https://api.mandarin.cf";
  const token = localStorage.getItem("Token");
  const res = await fetch(url + "/post/feed/?limit=Number&skip=Number", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  const posts = json.posts;

  imgLoad(posts);
  getDataPost(posts);
  heartedCheck(posts);
  heartChange(json);

  const article = document.querySelectorAll("article");
  const headerHeight = document
    .querySelector(".home_header")
    .getBoundingClientRect().height;
  const pageHeight =
    article[article.length - 1].getBoundingClientRect().bottom + headerHeight;
  //console.log(article[article.length - 1].getBoundingClientRect());
  const postOption = document.querySelectorAll(".btn_postOption");
  const section = document.querySelector(".feed_section");
  for (let i = 0; i < postOption.length; i++) {
    postOption.item(i).addEventListener("click", () => {
      modalProfile.style.display = "block";
      modalProfile.style.height = `${pageHeight}px`;
      section.classList.add("modal_active");
    });
  }

  modalProfile.addEventListener("click", (e) => {
    //console.log(e.target);
    if (e.target.classList.contains("modal-overlay")) {
      modalProfile.style.display = "none";
      section.classList.remove("modal_active");
    }
  });
}

function imgLoad(posts) {
  //console.log(posts);
  let imgNumber = 0;
  let imgSrc = "";
  posts.forEach((post, index) => {
    const authorImage = post.author.image;
    const authorAccount = post.author.accountname;
    const authorName = post.author.username;
    const image = post.image;
    const commentCount = post.commentCount;
    const content = post.content;
    const heartCount = post.heartCount;
    const hearted = post.hearted;
    const postId = post.id;
    const postCreatedAt = post.createdAt;
    const substring = postCreatedAt.substring(0, 10);
    const dateArr = substring.split("-");
    const postDate = `${dateArr[0]}년 ${dateArr[1]}월 ${dateArr[2]}일`;

    if (image === undefined) {
      return;
    }
    const imgArray = image.split(",");

    let imgTag = "";

    // numberGet(imgNumber);
    if (image === "") {
      imgTag = "";
    } else {
      for (let i = 0; i < imgArray.length; i++) {
        imgSrc = imgArray[i];
        if (i === 0) {
          imgTag = `<img src= "${imgSrc}" alt="" class="image_feed img_visible" id="${i}" onerror="this.src='../images/basic-profile-img.png';" />`;
        } else {
          imgTag =
            imgTag +
            `<img src= "${imgSrc}" alt="" class="image_feed img_invisible" id="${i}" onerror="this.src='../images/basic-profile-img.png';" />`;
        }
      }
    }

    //이미지 태그 만들고 첫번째 제외하고 class넣고, 클릭할 때 class제거

    const imgLength = imgArray.length;
    const btnImgSelect = document.querySelectorAll(".btn_imgSlide");

    let imgSelectBtn = "";

    if (imgLength > 1) {
      for (let i = 0; i < imgLength; i++) {
        if (i === 0) {
          imgSelectBtn =
            imgSelectBtn +
            `
          <li class="imgSlide">
            <button class="btn_imgSlide btn_imgSelected" data-num="${i}">
            </button>
          </li>
          `;
        } else {
          imgSelectBtn =
            imgSelectBtn +
            `
          <li class="imgSlide">
            <button class="btn_imgSlide" data-num="${i}">
            </button>
          </li>
          `;
        }
      }
    } else {
      imgSelectBtn = "";
    }

    document.querySelector(".feed_section").innerHTML += `
    <article class="card_feed">
    <h4 class="sr-only">피드</h4>
    <img class="profile_feed" src="${authorImage}" alt="${authorAccount}님의 프로필 사진" />
    <div data-id="${postId}" class="content_feed">
    <div class="content_nav">
    <strong class="profileName">${authorName}</strong>
    <button type="button" class="btn_postOption">
    <img src="../images/icon/s-icon-more-vertical.png" alt="게시물 옵션" class="edit_feed" />
    </button>
    </div>
    <span class="data_account">@${authorAccount}</span>
    <p class="postText">
    ${content}
    </p>
    <div class="img_wrap">
      <ul class="imagelist_feed">
      ${imgTag}
      </ul>
      <ul class="imgSelectBtnList">
        ${imgSelectBtn}
      </ul>
    </div>
    
    <div class="icon_feed">
    <img src="../images/icon/icon-heart.png" alt="" class="like_feed"/>
    <span class="likecount_feed">${heartCount}</span>
    <img src="../images/icon/icon-message-circle.png" alt="" class="img_comment"/>
    <span class="messagecount_feed">${commentCount}</span>
    </div>
    <span class="date_feed">${postDate}</span>
    </div>
    </article>
    `;
  });

  // 버튼 누르면 해당 이미지로 넘어가는 기능, 버튼 선택하면 색 주황색으로 변화하는 기능
  const ul_list = document.querySelectorAll(".imgSelectBtnList");
  for (let i = 0; i < ul_list.length; i++) {
    ul_list.item(i).addEventListener("click", (event) => {
      const target = event.target;
      //console.log(target.parentNode.parentNode, "버튼타겟의부모의 부모")
      if (target.tagName !== "BUTTON") {
        return;
      }

      const targetBtn =
        target.parentNode.parentNode.querySelector(".btn_imgSlide");

      const num = event.target.dataset.num;
      const imgWrapGet =
        event.target.parentNode.parentNode.parentNode.querySelector(
          ".imagelist_feed"
        );
      const selectBtnList =
        event.target.parentNode.parentNode.parentNode.querySelector(
          ".imgSelectBtnList"
        ).children;
      const imgTagList = imgWrapGet.children;

      //console.log(selectBtnList[0].children);
      const btnImgSlide = document.querySelector(".btn_imgSlide");

      for (let i = 0; i < selectBtnList.length; i++) {
        if (i === Number(num)) {
          selectBtnList[i].children[0].classList.add("btn_imgSelected");
          selectBtnList[i].children[0].classList.remove("btn_unSelect");
        } else {
          selectBtnList[i].children[0].classList.remove("btn_imgSelected");
          selectBtnList[i].children[0].classList.add("btn_unSelect");
        }
      }

      for (let i = 0; i < imgTagList.length; i++) {
        if (imgTagList[i].id === num) {
          imgTagList[i].classList.add("img_visible");
          imgTagList[i].classList.remove("img_invisible");
        } else {
          imgTagList[i].classList.add("img_invisible");
          imgTagList[i].classList.remove("img_visible");
        }
      }

      for (let i = 0; i < imgTagList.length; i++) {
        //console.log(imgTagList);
        if (i === Number(num)) {
          btnImgSlide.style.backgroundColor = "#F26E22";
        } else {
          btnImgSlide.style.backgroundColor = "#FFFFFF";
        }
      }
    });
  }
}

// 팔로워 수를 가져와서 0이면 초기화면, 피드를 보여주기
function getNumber(num) {
  if (num > 0) {
    getFeed();
  } else {
    getFistPage();
  }
}

// 초기 화면 보여주는 함수
function getFistPage() {
  const main = document.querySelector(".main_start");
  const article = document.createElement("article");
  article.setAttribute("class", "article_guide");
  const img = document.createElement("img");
  img.setAttribute("class", "img_logo");
  img.setAttribute("src", "../images/symbol-logo-gray.png");
  const p = document.createElement("p");
  p.innerText = "유저를 검색해 팔로우 해보세요!";
  const a = document.createElement("a");
  a.setAttribute("class", "link_searchMain");
  a.setAttribute("href", "./search.html");
  a.innerHTML = "<span>검색하기</span>";
  article.appendChild(img);
  article.appendChild(p);
  article.appendChild(a);
  main.prepend(article);
}

// 클릭하면 해당 포스트로 이동

// 글 클릭하면 해당 포스트로 이동
function getDataPost(posts) {
  const postText = document.querySelectorAll(".postText");

  postText.forEach((p) => {
    p.addEventListener("click", () => {
      let userPost = p.parentNode.parentNode;
      let userPostId = userPost.querySelector("div").dataset.id;
      posts.find((post) => {
        if (post.id == userPostId) {
          const postId = post.id;
          localStorage.setItem("postId", postId);
          location.href = "./post.html";
        }
      });
    });
  });

  // 그림 클릭하면 해당 포스트로 이동
  // const dataImg = document.querySelectorAll('.image_feed');

  // dataImg.forEach((img) => {
  //   img.addEventListener('click', () => {
  //     posts.find((post) => {
  //       if (post.image === undefined) {
  //         return;
  //       }
  //       if (post.image.split(',')[0] == img.src) {
  //         const postId = post.id;
  //         localStorage.setItem("postId", postId);
  //         location.href = './post.html'
  //       }
  //     })
  //   })
  // })

  // 댓글 클릭하면 해당 포스트로 이동
  const btnComment = document.querySelectorAll(".img_comment");
  btnComment.forEach((i) => {
    i.addEventListener("click", () => {
      let secComment = i.parentNode.parentNode;
      let userPostId = secComment.dataset.id;
      posts.find((post) => {
        if (post.id == userPostId) {
          const postId = post.id;
          localStorage.setItem("postId", postId);
          location.href = "./post.html";
        }
      });
    });
  });

  //피드에 프로필사진, 아이디, 닉네임 클릭시 프로필로 이동
  const articlePost = document.querySelectorAll(".card_feed");
  articlePost.forEach((element) => {
    element.addEventListener("click", (e) => {
      if (e.target.className === "profile_feed") {
        const postTarget = e.target.parentNode;
        const accountname = postTarget
          .querySelector(".data_account")
          .textContent.substr(1);
        localStorage.setItem("searchedUserAccountname", accountname);
        location.href = "./yourProfile.html";
      } else if (e.target.className === "profileName") {
        const postTarget = e.target.parentNode.parentNode;
        const accountname = postTarget
          .querySelector(".data_account")
          .textContent.substr(1);
        localStorage.setItem("searchedUserAccountname", accountname);
        location.href = "./yourProfile.html";
      } else if (e.target.className === "data_account") {
        const accountname = e.target.textContent.substr(1);
        localStorage.setItem("searchedUserAccountname", accountname);
        location.href = "./yourProfile.html";
      }
    });
  });
}

// 하트 수 변화하는 함수
async function heartChange(json) {
  const posts = json.posts;
  const content = json.content;

  const likeBtns = document.querySelectorAll(".like_feed");
  likeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const likedPostContent = e.target.parentNode.parentNode
        .querySelector("p")
        .textContent.trim();
      const likedPost = json.posts.filter(
        (post) => post.content === likedPostContent
      );
      const likeNumber = e.target.parentNode.querySelector(".likecount_feed");

      if (!likedPost[0].hearted) {
        e.target.src = `../images/icon/icon-heart-active.png`;
        getLike(likedPost[0].id);
        likedPost[0].hearted = true;
        likeNumber.innerText = Number(likeNumber.innerText) + 1;
      } else {
        e.target.src = `../images/icon/icon-heart.png`;
        getUnLike(likedPost[0].id);
        likedPost[0].hearted = false;
        likeNumber.innerText = Number(likeNumber.innerText) - 1;
      }
    });
  });
}

function heartedCheck(posts) {
  const article = document.querySelectorAll("article");
  posts.forEach((e, index) => {
    if (index >= article.length) {
      return;
    }
    if (e.hearted) {
      const heartedContent = document.querySelector(
        `article:nth-child(${index + 1})`
      );
      const heartImg = heartedContent.children[2]
        .querySelector(".icon_feed")
        .querySelector(".like_feed");
      heartImg.src = `../images/icon/icon-heart-active.png`;
    }
  });
}

//게시물 좋아요
async function getLike(postId) {
  const url = `https://api.mandarin.cf/post/${postId}/heart`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
}

// 게시물 싫어요
async function getUnLike(postId) {
  const url = `https://api.mandarin.cf/post/${postId}/unheart`;
  await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
}
