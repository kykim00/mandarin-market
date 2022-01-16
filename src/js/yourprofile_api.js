const followers = document.querySelector(".followers_main");
const followings = document.querySelector(".followings_main");
const info = document.querySelector(".info_user");
const myAccountName = localStorage.getItem("Accountname");
const searchedUserAccountName = localStorage.getItem("searchedUserAccountname");
const profileImage = document.querySelector(".profile_image");
const followBtn = document.querySelector(".follow_user");
const productList = document.querySelector(".productlist_card");
const feedList = document.querySelector(".card_wrap");
const token = localStorage.getItem("Token");

if (myAccountName === searchedUserAccountName) {
  location.href = "./myprofile.html";
}
async function getProfile() {
  const url = `http://146.56.183.55:5050/profile/${searchedUserAccountName}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  followers.textContent = json.profile.follower.length;
  followings.textContent = json.profile.following.length;
  const { username, image, accountname, intro } = json.profile;
  profileImage.src = image;
  info.innerHTML += `
    <strong>${username}</strong>
    <span class="id_user">@ ${accountname}</span>
    <span class="desc_user">${intro}</span>
  `;
}

async function isFollowingProfile() {
  const url = `http://146.56.183.55:5050/profile/${myAccountName}/following`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  json.forEach((data) => {
    if (data.accountname === searchedUserAccountName) {
      followBtn.classList.add("following");
      followBtn.textContent = "팔로잉";
      main.classList.add("following");
    }
  });
}

async function getFollow() {
  const url = `http://146.56.183.55:5050/profile/${searchedUserAccountName}/follow`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  followBtn.classList.add("following");
  followBtn.textContent = "팔로잉";
  main.classList.add("following");
  followers.textContent = +followers.textContent + 1;
}

async function getUnFollow() {
  const url = `http://146.56.183.55:5050/profile/${searchedUserAccountName}/unfollow`;
  await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  followBtn.classList.remove("following");
  followBtn.textContent = "팔로우";
  main.classList.remove("following");
  followers.textContent = +followers.textContent - 1;
}

followBtn.addEventListener("click", () => {
  if (followBtn.classList.contains("following")) {
    getUnFollow();
  } else {
    getFollow();
  }
});

async function getProductList() {
  const url = `http://146.56.183.55:5050/product/${searchedUserAccountName}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  json.product.forEach((item) => {
    let { itemName, itemImage, price } = item;
    itemImage = "http://146.56.183.55:5050/" + itemImage;
    productList.innerHTML += `
      <article class="product_card">
        <img
          src=${itemImage}
          alt=""
        />
        <h4>${itemName}</h4>
        <span>${price}원</span>
      </article>
  `;
  });
}

async function getFeed() {
  const url = `http://146.56.183.55:5050/post/${searchedUserAccountName}/userpost`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  const { image, username, accountname } = json.post[0].author;
  console.log(json);
  const userImage = image;
  json.post.forEach((post) => {
    let { content, image, heartCount, commentCount, hearted, createdAt } = post;
    const div = document.createElement("div");
    const images = image.split(",");
    if (images[0]) {
      images.forEach((img) => {
        div.innerHTML += `
        <img
        src=${img} 
        alt=""
        class="image_feed"
        />
        `;
      });
      div.className = "imagelist_feed";
    }
    createdAt = createdAt.split("-");
    createdAt =
      createdAt[0] +
      "년 " +
      createdAt[1] +
      "월 " +
      createdAt[2].slice(0, 2) +
      "일";
    feedList.innerHTML += `
      <article class="card_feed">
        <h4 class="sr-only">피드</h4>
        <img class="profile_feed" src="${userImage}" alt="" />
        <div class="content_feed">
            <strong>${username}</strong>
          <span>@ ${accountname}</span>
          <p>${content}</p>
            ${
              images[0]
                ? `<img src=${images[0]} alt="" class="image_feed">`
                : ""
            }
          <div class="icon_feed">
            <img class="like_feed" src="${
              hearted
                ? `../images/icon/icon-heart-active.png`
                : `../images/icon/icon-heart.png`
            }" alt="" />
            <span class="likecount_feed">${heartCount}</span>
            <img class="comment_feed" src="../images/icon/icon-message-circle.png" alt="" />
            <span class="messagecount_feed">${commentCount}</span>
          </div>
          <span class="date_feed">${createdAt}</span>
        </div>
      </article>
    `;
  });

  const likeBtns = document.querySelectorAll(".like_feed");
  likeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const likedPostContent =
        e.target.parentNode.parentNode.querySelector("p").textContent;
      const likedPost = json.post.filter(
        (post) => post.content === likedPostContent
      );
      const likeCount = e.target.parentNode.querySelector(".likecount_feed");
      if (e.target.src.includes("/images/icon/icon-heart-active.png")) {
        getUnLike(likedPost[0].id);
        btn.src = btn.src.replace("heart-active", "heart");
        likeCount.textContent = +likeCount.textContent - 1;
      } else {
        getLike(likedPost[0].id);
        btn.src = btn.src.replace("heart", "heart-active");
        likeCount.textContent = +likeCount.textContent + 1;
      }
    });
  });
  const commentBtns = document.querySelectorAll(".comment_feed");
  const feedImages = document.querySelectorAll(".image_feed");
  commentBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {});
  });
}

async function getProductList() {
  const url = `http://146.56.183.55:5050/product/${searchedUserAccountName}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  json.product.forEach((item) => {
    let { itemName, itemImage, price } = item;
    itemImage = "http://146.56.183.55:5050/" + itemImage;
    productList.innerHTML += `
      <article class="product_card">
        <img
          src=${itemImage}
          alt=""
        />
        <h4>${itemName}</h4>
        <span>${price}원</span>
      </article>
  `;
  });
}

async function getLike(postId) {
  const url = `http://146.56.183.55:5050/post/${postId}/heart`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
}

async function getUnLike(postId) {
  const url = `http://146.56.183.55:5050/post/${postId}/unheart`;
  await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
}
getFeed();
getProductList();
getProfile();
isFollowingProfile();
