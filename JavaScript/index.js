
const addBtn = document.getElementById('add');
const siteName = document.getElementById("bookmarkName");
const siteURL = document.getElementById("bookmarkUrl");
const submitBtn = document.getElementById("submitBtn");
const tableContent = document.getElementById("tableContent");
const closeBtn = document.getElementById("closeBtn");
const boxModal = document.querySelector(".error");


siteName.addEventListener('click', function(){

siteName.classList.remove('bookmarkName');
siteURL.classList.remove('bookmarkUrl');
submitBtn.classList.remove('submitBtn');
});
addBtn.addEventListener("click", function(){

  document.getElementById('firstPage').classList.add('d-none');
  document.getElementById('secondPage').classList.remove('d-none');
  document.getElementById('overlay').classList.add('fade');

});

var bookmarks = [];

function displayBookmark(index) {
  const { siteURL, siteName } = bookmarks[index];
  const httpsRegex = /^https?:\/\//g;
  const newBookmark = `
    <tr>
      <td class="pb-3 normal-font">${index + 1}</td>
      <td class="pb-3">${siteName}</td>              
      <td class="pb-3">
        <button data-index="${index}" class="visitBtn">
          <i class="fa-solid fa-eye pe-2"></i>Visit
        </button>
      </td>
      <td class="pb-3">
        <button data-index="${index}" class="deleteBtn">
          <i class="fa-solid fa-trash-can pe-2"></i>Delete
        </button>
      </td>
    </tr>
  `;
  tableContent.innerHTML += newBookmark;
}

function firstCap(string) {

  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

function clearInputs() {

  siteName.value = "";
  siteURL.value = "";
}

if (localStorage.getItem("bookmarksList")) {

  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  bookmarks.forEach((_, index) => displayBookmark(index));
}


submitBtn.addEventListener("click", () => {
  if (siteName.classList.contains("is-valid") && siteURL.classList.contains("is-valid")) {
    const bookmark = {
      siteName: firstCap(siteName.value),
      siteURL: siteURL.value,
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    displayBookmark(bookmarks.length - 1);
    clearInputs();
    document.getElementById('t-content').classList.add('appear');
    document.getElementById('t-content').classList.remove('d-none');

    siteURL.classList.remove("is-valid");
    siteName.classList.remove("is-valid");
  } else {
    boxModal.classList.remove("d-none");
  }
});

tableContent.addEventListener("click", (e) => {

  if (e.target.closest(".deleteBtn")) {
    deleteBookmark(e);
  } else if (e.target.closest(".visitBtn")) {
    visitWebsite(e);
  }

});

function deleteBookmark(e) {
  const index = e.target.closest("button").dataset.index;
  bookmarks.splice(index, 1);
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
  tableContent.innerHTML = "";

  bookmarks.forEach((_, index) => displayBookmark(index));
}

function visitWebsite(e) {
  const index = e.target.closest("button").dataset.index;
  const { siteURL } = bookmarks[index];
  const httpsRegex = /^https?:\/\//g;

var url;

if (/^https?:\/\//.test(siteURL)) {
  url = siteURL;
} else {
  url = `https://${siteURL}`;
}

window.open(url, "_blank");
}

function validate(element, regex) {

  switch (regex.test(element.value)) {
    case true:
      element.classList.add("is-valid");
      element.classList.remove("is-invalid");
      break;
    case false:
      element.classList.add("is-invalid");
      element.classList.remove("is-valid");
      break;
  }
}


siteName.addEventListener("input", () => validate(siteName, /^\w{3,}(\s+\w+)*$/));
siteURL.addEventListener("input", () => validate(siteURL, /^(https?:\/\/)?([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/));

function closeModal() {
  boxModal.classList.add("d-none");
}

closeBtn.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("box-info")) closeModal();
});

