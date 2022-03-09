(function () {
  const btnBack = document.querySelector(".btn-back");
  btnBack.addEventListener("click", () => {
    window.history.back();
  });
})();

async function getFollowingData() {
  const token = localStorage.getItem("Token");
  const accountName = localStorage.getItem("Accountname");
  const followingIdArray = [];
  const followingRes = await fetch(
    `https://api.mandarin.cf/profile/${accountName}/following?limit=100&skip=0`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  const followingjson = await followingRes.json();
  followingjson.map((following) => {
    followingIdArray.push(following._id);
  });
  getFollowerData(followingIdArray, token, accountName);
}

async function getFollowerData(followingIdArray, token, accountName) {
  const followerRes = await fetch(
    `https://api.mandarin.cf/profile/${accountName}/follower?limit=100&skip=0`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );

  const followerjson = await followerRes.json();
  followerjson.map((follower) => {
    const followerId = follower._id;
    const userName = follower.username;
    const intro = follower.intro;
    const image = follower.image;
    const followerAccountName = follower.accountname;
    document.querySelector(".list-followers").innerHTML += `
                <li>
                <img src="${image}" onerror="this.src='../images/basic-profile-img.png'" class="img_profile" />
                <strong>
                ${userName}
                <small class="txt_preview txt_ellipsis">${intro}</small>
                </strong>
                <button id="${followerAccountName}" class="btn-follow" ></button>
                </li>
                `;

    const followFlag = followingIdArray.find((x) => x === followerId);
    const followBtn = document.getElementById(followerAccountName);
    if (!!followFlag) {
      followBtn.classList.add("following");
      followBtn.textContent = "취소";
    } else {
      followBtn.textContent = "팔로우";
    }
  });

  const followBtns = document.querySelectorAll(".btn-follow");
  for (const followBtn of followBtns) {
    followBtn.addEventListener("click", () => {
      const accountName = followBtn.getAttribute("id");
      if (followBtn.classList.contains("following")) {
        UnFollow(followBtn, accountName, token);
      } else {
        Follow(followBtn, accountName, token);
      }
    });
  }
}

async function UnFollow(followBtn, accountName, token) {
  const res = await fetch(
    `https://api.mandarin.cf/profile/${accountName}/unfollow`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  if (res.status == 200) {
    followBtn.textContent = "팔로우";
    followBtn.classList.toggle("following");
  }
}

async function Follow(followBtn, accountName, token) {
  const res = await fetch(
    `https://api.mandarin.cf/profile/${accountName}/follow`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  if (res.status == 200) {
    followBtn.textContent = "취소";
    followBtn.classList.add("following");
  }
}

(function () {
  const followerListContainer = document.querySelector("ul");
  followerListContainer.addEventListener("click", (e) => {
    if (e.target.tagName !== "LI" && e.target.tagName !== "BUTTON") {
      const accountname = e.target.parentNode
        .querySelector(".btn-follow")
        .getAttribute("id");
      localStorage.setItem("searchedUserAccountname", accountname);
      location.href = "./yourprofile.html";
    }
  });
})();

getFollowingData();
