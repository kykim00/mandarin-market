const followers = document.querySelector(".followers_main");
const followings = document.querySelector(".followings_main");
const info = document.querySelector(".info_user");
const myAccountName = localStorage.getItem("Accountname");
const profileImage = document.querySelector(".profile_image");
const productList = document.querySelector(".productlist_card");
const feedList = document.querySelector(".card_wrap");
const deleteFeed = document.querySelector(".delete_feed");
const modifyFeed = document.querySelector(".modify_feed");
const token = localStorage.getItem("Token");

document.title = "감성82 | " + myAccountName;

productList.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  productList.classList.add("active");

  startX = e.pageX - productList.offsetLeft;
  scrollLeft = productList.scrollLeft;
});

productList.addEventListener("mouseleave", () => {
  isMouseDown = false;
  productList.classList.remove("active");
});

productList.addEventListener("mouseup", () => {
  isMouseDown = false;
  productList.classList.remove("active");
});

productList.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;

  e.preventDefault();
  const x = e.pageX - productList.offsetLeft;
  const walk = (x - startX) * 1;
  productList.scrollLeft = scrollLeft - walk;
});

async function getProfile() {
  const url = `https://api.mandarin.cf/profile/${myAccountName}`;
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

async function getProductList() {
  const url = `https://api.mandarin.cf/product/${myAccountName}`;
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
    itemImage = "https://api.mandarin.cf/" + itemImage;
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
  const url = `https://api.mandarin.cf/post/${myAccountName}/userpost/?limit=100&skip=0`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  const { image, username, accountname } = json.post[0].author;
  const userImage = image;
  json.post.forEach((post) => {
    let { content, image, heartCount, commentCount, hearted, createdAt } = post;
    const div = document.createElement("div");
    if (!image) image = "";
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
          <div>
            <strong>${username}</strong>
            <img
              src="../images/icon/s-icon-more-vertical.png"
              alt=""
              class="edit_feed"
            />
          </div>  
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
  commentBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const commentPostContent =
        e.target.parentNode.parentNode.querySelector("p").textContent;
      const commentPost = json.post.filter(
        (post) => post.content === commentPostContent
      );
      localStorage.setItem("selectedPostId", commentPost[0].id);
      location.href = "./post.html";
    });
  });
  const feedImages = document.querySelectorAll(".image_feed");
  feedImages.forEach((img) => {
    img.addEventListener("click", (e) => {
      const imagePostContent =
        e.target.parentNode.querySelector("p").textContent;
      const imagePost = json.post.filter(
        (post) => post.content === imagePostContent
      );
      localStorage.setItem("selectedPostId", imagePost[0].id);
      location.href = "./post.html";
    });
  });
  const feedEditBtns = document.querySelectorAll(".edit_feed");

  feedEditBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      modalFeedEdit.style.display = "block";
      const editPostContent =
        e.target.parentNode.parentNode.querySelector("p").textContent;
      const editPost = json.post.filter(
        (post) => post.content === editPostContent
      );
      deleteFeed.addEventListener("click", () => {
        getDeleteFeed(editPost[0].id);
        location.reload();
      });
      modifyFeed.addEventListener("click", () => {
        localStorage.setItem("selectedPostId", editPost[0].id);
        location.href = "./upload.html";
      });
    });
  });
}

async function getProductList() {
  const url = `https://api.mandarin.cf/product/${myAccountName}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  json.product.forEach((item) => {
    let { itemName, itemImage, price, link } = item;
    itemImage = itemImage.includes("https://api.mandarin.cf/")
      ? itemImage
      : "https://api.mandarin.cf/" + itemImage;
    productList.innerHTML += `
      <article class="product_card">
        <a ${link.includes("http") ? `href=${link}` : ``}>
          <img
            src=${itemImage}
            alt=""
          />
        </a>
        <h4>${itemName}</h4>
        <span>${price}원</span>
      </article>
  `;
  });
}

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

async function getDeleteFeed(postId) {
  const url = `https://api.mandarin.cf/post/${postId}`;
  await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
}

followers.addEventListener("click", () => {
  location.href = "./followers.html";
});
getFeed();
getProductList();
getProfile();
