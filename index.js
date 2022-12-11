// check token onload on body

// Left sidebar click background change function
const menuItems = document.querySelectorAll(".menu-item");
const changeActiveItem = () => {
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });
};

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    changeActiveItem();
    item.classList.add("active");
  });
});

// logout function
const profileClick = document.getElementById("profile-click");
// console.log(profileClick)

profileClick.addEventListener("click", () => {
  const logout = document.getElementById("logout");
  if (logout.style.display === "none") {
    logout.style.display = "block";
  } else {
    logout.style.display = "none";
  }
});

const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.replace("http://127.0.0.1:5500/login.html");
});

// set Username and image in navbar
let userData = JSON.parse(localStorage.getItem("user"));
let userName = document.getElementById("username");
let userImage = document.getElementById("profile-photo");
userName.innerText = `${userData.firstName}`;
userImage.src = `${userData.image}`;

// get all posts
let show = false
async function getPosts(count, search = null) {
  const feeds = document.getElementById("feeds");
  let postsArray = [];

  if (search) {
    console.log("searching");
    const res = await fetch(`https://dummyjson.com/posts/search?q=${search}`);
    const data = await res.json();
    feeds.innerHTML = ""
    postsArray = data.posts;
  } else if (count > 9) {
    const res = await fetch(`https://dummyjson.com/posts?limit=${count}`);
    const data = await res.json();
    feeds.innerHTML =""
    postsArray = data.posts;
    console.log("counting");
  }

  console.log(postsArray.length);
  let users = [];
  const res = await fetch("https://dummyjson.com/users");
  const userData = await res.json();
  users = userData.users;
  // console.log(users);

  for (let i = 0; i < postsArray.length; i++) {
    let comments = [];
    let res = await fetch(
      `https://dummyjson.com/posts/${postsArray[i].id}/comments`
    );
    let data = await res.json();
    comments = data.comments;

    // console.log(user.firstName);
    
    const feed = `
  <div class="feed">
    <div class="user">
        <div class="profile-pic">
            <img src="/images/profile-14.jpg" alt="">
        </div>
        <div class="info">
            <h3>Ghulam Muhammad ${i + 1}</h3>
            <small>Dubai, 15 MINUTES AGO</small>
        </div>
        <span class="edit"><i class="uil uil-ellipsis-h"></i></></div>
        <div class="photo">
            <h2>${postsArray[i].title}</h2>
            <p style="font-size: 0.9rem;">${postsArray[i].body}</p>
        </div>

        <div class="action-button">
            <div class="interaction-button">
                <span><i class="uil uil-thumbs-up"></i></span>
                <span><i id="comment-toggle" class="uil uil-comment" style="cursor: pointer;"></i></span>
                <span><i class="uil uil-share"></i></span>
            </div>
            <div class="bookmark">
                <span><i class="uil uil-bookmark"></i></span>
            </div>
        </div>

        <div class="liked-by" style="padding: 3px 0;">
            <span><img src="images/profile-15.jpg"></span>
            <span><img src="images/profile-16.jpg"></span>
            <span><img src="images/profile-17.jpg"></span>
            <p>Liked by <b>${+postsArray[i].reactions}</b> <b>People</b></p>
        </div>

        <div class="caption">
        ${postsArray[i].tags.map((tag) => {
          return `<span class="hash-tag">#${tag}</span>`;
        })}     
        </div>

        <form class="create-post">
            <div class="profile-pic">
                <img src="images/profile-9.jpg" alt="">
            </div>
            <input type="text" placeholder="Write a Public Comment" id="create-post">
            <button value="Post" class="btn btn-primary"> Post</button>
        </form>

        <div class="comment-section" id="comment-section">
        ${comments.map((com) => {
          return `<div class="all-comments"  >
          <div class="user" id="users-comments">
              <div class="profile-pic">
                  <img src="./images/profile-12.jpg" alt="">
              </div>
              <div class="info">
                  <h4>${com.user.username}</h4>
                  <p>${com.body}</p>
              </div>
              <div class="edit-comments">
                  <span class="edit" style="cursor:pointer;"><i
                          class="uil uil-ellipsis-h"></i></span>
                  <div class="comment-buttons">
                      <button class="btn btn-primary">Edit</button>
                      <button class="btn btn-primary">Delete</button>
                  </div>
              </div>
          </div>
          </div> `;
        })}
            
        </div>
    </div>
    `;
    feeds.innerHTML += feed;
  }

  // console.log(data.posts);
}

let search = document.getElementById("search").value.trim();

let count = 10;
if (!search) {
  getPosts(count);
  const loadMore = document.getElementById("load-more");
  loadMore.addEventListener("click", () => {
    if (count < 30) {
      count += 10;
      getPosts(count);
    }
    if (count == 30) {
      loadMore.style.display = "none";
    }
    console.log("click");
  });
}

let searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", () => {
  let search = document.getElementById("search").value.trim();
  const loadMore = document.getElementById("load-more");
  console.log(search);
  if (search) {
    loadMore.style.display = "none";
  } else {
    let count = 10;
    getPosts(count);
    const loadMore = document.getElementById("load-more");
    loadMore.style.display = "block";
    loadMore.addEventListener("click", () => {
      if (count < 30) {
        count += 10;
        getPosts(count);
      }
      if (count == 30) {
        loadMore.style.display = "none";
      }
      console.log("click");
    });
  }
  console.log("clik search");
  getPosts(3, search);
});

const commentSection = document.getElementById("comment-section")






