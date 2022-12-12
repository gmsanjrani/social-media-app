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

// Function for Logout
const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.replace("./index.html");
});

// set Username and image in navbar
let userData = JSON.parse(localStorage.getItem("user"));
let userName = document.getElementById("username");
let userImage = document.getElementById("profile-photo");
userName.innerText = `${userData.firstName}`;
userImage.src = `${userData.image}`;


// This the main Function where all apis get called
async function getPosts(skip = 0, search = null, userSearch = false) {
  const feeds = document.getElementById("feeds");

  // Getting users data
  let users = [];
  const res = await fetch("https://dummyjson.com/users?limit=100");
  const userData = await res.json();
  users = userData.users;


  // conditions on search
  let postsArray = [];
  if (userSearch == false && search) { // for search by post
    console.log("searching");
    const res = await fetch(`https://dummyjson.com/posts/search?q=${search}`);
    const data = await res.json();
    feeds.innerHTML = "";
    postsArray = data.posts;
  } else if (skip >= 0 && !search) { // for normal case
    if (skip == 0) {
      feeds.innerHTML = "";
    }
    const res = await fetch(
      `https://dummyjson.com/posts?limit=10&skip=${skip}`
    );
    const data = await res.json();
    postsArray = data.posts;
    console.log("counting");
  } else if (search && userSearch == true) {  // for search by username
    console.log("searching user");
    let userId;
    for (let su = 0; su < users.length; su++) {
      if (users[su].username == search) {
        userId = users[su].id;
      }
    }
    console.log(userId);
    const res = await fetch(`https://dummyjson.com/posts/user/${userId}`);
    const data = await res.json();
    feeds.innerHTML = "";
    postsArray = data.posts;
  }


  // Loop over posts data and displaying all the posts
  for (let i = 0; i < postsArray.length; i++) {

    // getting user for each post
    let user;
    for (let u = 0; u < users.length; u++) {
      if (postsArray[i].userId == users[u].id) {
        user = users[u];
      }
    }

    // getting comments for each post
    let comments = [];
    let res = await fetch(
      `https://dummyjson.com/posts/${postsArray[i].id}/comments`
    );
    let data = await res.json();
    comments = data.comments;

    // HTML for a POST
    const feed = `
  <div class="feed">

    <div class="user">
        <div class="profile-pic">
            <img src="${user.image}" alt="${user.id}">
        </div>

        <div class="info">
            <h3>${user.username}</h3>
            <small>${user.firstName}</small>
        </div>
    </div>
        
     
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
            return `<span class="hash-tag">#${tag}</span>`;})}     
        </div>

        <div class="create-post">
            <div class="profile-pic">
                <img src="images/profile-9.jpg" alt="">
            </div>
            <input type="text" id="enter-comment" placeholder="Write a Public Comment" id="create-post">
            <button value="Post" class="btn btn-primary"> Post</button>
        </div>

        <div class="comment-section" id="comment-section">
        ${comments.map((com, index) => { // displaying comments

          // getting images of comments
          let images = "";
          for (let c = 0; c < users.length; c++) {
            if (com.user.id == users[c].id) {
              images = users[c].image;
            }
          }
        return `
        <div class="all-comments"  >
          <div class="user" id="users-comments">
              <div class="profile-pic">
                  <img src="${images}" alt="">
              </div>
              <div class="info">
                  <h4>${com.user.username}</h4>
                  <p>${com.body}</p>
              </div>
              <div class="edit-comments">
                  <span class="edit" style="cursor:pointer;" id="show-comments-btn" onclick="open(${com.id})"><i class="uil uil-ellipsis-h"></i></span>
                  <div class="comment-buttons" id="edit-delete-btn">
                      <button class="btn btn-primary" >Edit</button>
                      <button class="btn btn-primary" >Delete</button>
                  </div>
              </div>
            </div>
          </div>`
        })}
        
        </div>
  </div>`;
  
    feeds.innerHTML += feed;
  }  //loop end
} // post function end

  


// calling getPost function for different cases like search by post/ search by username
let search = document.getElementById("search").value.trim();

let skip = 0;
if (!search) { // for normal case with load more button
  getPosts(skip);
  const loadMore = document.getElementById("load-more");
  loadMore.addEventListener("click", () => {
    if (skip < 20) {
      skip += 10;
      getPosts(skip);
    }
    if (skip == 20) {
      loadMore.style.display = "none";
    }
    console.log("click");
  });
}


// search by post logic
let searchPost = document.getElementById("search-post");
searchPost.addEventListener("click", () => {
  let search = document.getElementById("search").value.trim();
  const loadMore = document.getElementById("load-more");
  console.log(search);
  if (search) {
    loadMore.style.display = "none";
    console.log("clik search");
    skip = 0;
    getPosts(-1, search);
  } else {
    getPosts(skip);
    const loadMore = document.getElementById("load-more");
    loadMore.style.display = "block";
    loadMore.addEventListener("click", () => {
      if (skip < 20) {
        skip += 10;
        getPosts(skip);
      }
      if (skip == 20) {
        loadMore.style.display = "none";
      }
      console.log("click");
    });
  }
});


// search by username logic
let searchUser = document.getElementById("search-user");
searchUser.addEventListener("click", () => {
  let search = document.getElementById("search").value.trim();
  const loadMore = document.getElementById("load-more");
  console.log(search);
  if (search) {
    loadMore.style.display = "none";
    console.log("clik search");
    skip = 0;
    getPosts(-1, search, true);
  } else {
    getPosts(skip);
    const loadMore = document.getElementById("load-more");
    loadMore.style.display = "block";
    loadMore.addEventListener("click", () => {
      if (skip < 20) {
        skip += 10;
        getPosts(skip);
      }
      if (skip == 20) {
        loadMore.style.display = "none";
      }
      console.log("click");
    });
  }
});