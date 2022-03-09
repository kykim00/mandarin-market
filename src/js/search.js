const input = document.querySelector(".input_search");
const userListContainer = document.querySelector(".list_searchResult");

async function keyUpHandler() {
  const inputSearch = input.value;
  const data = await getSearchedUserProfile(inputSearch);
  userListContainer.innerHTML = "";
  if (!inputSearch) return;
  data.forEach((user) => {
    const accountname = user.accountname;
    const username = user.username;
    if (accountname.includes(inputSearch) || username.includes(inputSearch)) {
      const image = user.image;
      userListContainer.innerHTML += `
        <li class="list_user">
          <img src="${image}" alt="" onerror="this.src='../images/basic-profile-img.png';" />
          <div class="user_wrap">
            <p>${username}</p>
            <span>@ ${accountname}</span>
          </div>
        </li>             
        `;
    }
  });
}

async function getSearchedUserProfile(searchedText) {
  const url = "https://api.mandarin.cf";
  const token = localStorage.getItem("Token");
  const res = await fetch(url + `/user/searchuser/?keyword=${searchedText}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  return json;
}

userListContainer.addEventListener("click", (e) => {
  if (e.target.tagName !== "UL") {
    const accountname = e.target.parentNode
      .querySelector("span")
      .textContent.substr(2);
    localStorage.setItem("searchedUserAccountname", accountname);
    location.href = "./yourprofile.html";
  }
});

input.addEventListener("keyup", keyUpHandler);
