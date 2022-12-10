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

async function getPosts(count, search = null) {
  const feeds = document.getElementById("feeds");
  let postsArray = [];

  if (search) {
    console.log("searching");
    const res = await fetch(`https://dummyjson.com/posts/search?q=${search}`);
    const data = await res.json();
    postsArray = data.posts;
  } else if (count > 9) {
    const res = await fetch(`https://dummyjson.com/posts?limit=${count}`);
    const data = await res.json();
    postsArray = data.posts;
    console.log("counting");
  }

  console.log(postsArray.length);

  for (let i = 0; i < postsArray.length; i++) {
    const feed = `<div class="feed">
                   <div class="head">
             </div>
     <div class="user">
         <div class="profile-pic">
             <img src="/" alt="">
         </div>
         <div class="info">
             <h3>Lana Rose</h3>
             <small>Dubai, 15 MINUTES AGO</small>
         </div >
         <span class="edit"><i class="uil uil-ellipsis-h"></i></>
     </div>

     <div class="photo">
         <img src="images/feed-1.jpg" alt="">
     </div>

     <div class="action-button">
         <div class="interaction-button">
             <span><i class="uil uil-thumbs-up"></i></span>
             <span><i class="uil uil-comment" style="cursor: pointer;"></i></span>
             <span><i class="uil uil-share"></i></span>
         </div>
         <div class="bookmark">
             <span><i class="uil uil-bookmark"></i></span>
         </div>
     </div>

     <div class="comment">
        <!-- <label for="comment">Write Your Comment</label> -->
        <input type="text" id="comment" placeholder="Your Comment">
        <button class=""></button>
     </div>

     <div class="liked-by" style="padding: 3px 0;">
         <span><img src="images/profile-15.jpg"></span>
         <span><img src="images/profile-16.jpg"></span>
         <span><img src="images/profile-17.jpg"></span>
         ,<p>Liked by  <b>2</b> <b>People</b></p>
     </div>

     <div class="caption">
         <p>
        <span class="hash-tag">#lifestyle</span>
        <span class="hash-tag">#lifestyle</span>
        <span class="hash-tag">#lifestyle</span></p>
     </div>
     <div class="comments text-muted">${postsArray[i].title}</div> 
</div>`;
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
    loadMore.style.display = "block"
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

