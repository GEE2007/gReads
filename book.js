const book = JSON.parse(localStorage.getItem("selectedBook"));

if (!book) {
  window.location.href = "index.html";
}

const img = document.querySelector(".book-img");
const title = document.querySelector(".book-title");
const desc = document.querySelector(".book-desc");
const genres = document.querySelector(".tags");

img.src = book.image;
title.textContent = book.title;
desc.textContent = book.desc;

// show genres
book.genre.forEach(g => {
  const span = document.createElement("span");
  span.textContent = g;
  span.classList.add("genre-tag");
  genres.appendChild(span);
});
const tbrBtn = document.querySelector(".tbr-btn");

tbrBtn.addEventListener("click", () => {
  let tbr = JSON.parse(localStorage.getItem("tbr")) || [];

  const exists = tbr.some(item => item.title === book.title);

  if (!exists) {
    tbr.push(book);
    localStorage.setItem("tbr", JSON.stringify(tbr));
    tbrBtn.textContent = "Added 💖";
  } else {
    tbrBtn.textContent = "Already Added ";
  }
});
const tropesBox = document.querySelector(".tropes");

if(book.tropes){
  book.tropes.forEach(trope=>{
    const span=document.createElement("span");
    span.textContent=trope;
    span.classList.add("trope-tag");
    tropesBox.appendChild(span);
  });
}
const author = document.querySelector(".author");
author.textContent = "by " + book.author;
const tropesBox = document.querySelector(".tropes");

book.tropes.forEach(trope=>{
 const span=document.createElement("span");
 span.textContent=trope;
 span.classList.add("trope-tag");
 tropesBox.appendChild(span);
});