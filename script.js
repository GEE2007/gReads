const books = [
  {
    title: "Fourth Wing",
    image: "images/fourthwing.png",
    desc: "Dragons, danger, and enemies who might ruin you",
    genre: ["Romance","Fantasy"],
    tropes: ["Enemies to Lovers", "Dragons", "War College", "Slow Burn"],
    author: "Rebecca Yarros",
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "Atomic Habits",
    image: "images/atomichabits.jpg",
    desc: "Fix your life one tiny habit at a time",
    genre: ["Self-Help"],
    tropes: ["Habit Formation", "Behavior Change", "Self-Improvement", "Productivity"],
    author: "James Clear",
     playlist:"https://open.spotify.com/playlist/abc123"

  },
  {
    title: "The Right Move",
    image: "images/rightmove.jpg",
    desc: "Grumpy x sunshine with slow-burn tension",
    genre: ["Romance"],
    tropes: ["Grumpy x Sunshine", "Slow Burn", "Fake Dating", "Second Chance Romance"],
    author: "Liz Tomforde",
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "Harry Potter",
    image: "images/harry potter.png",
    desc: "Magic, friendship, and a world you won’t leave",
    genre:  ["Fantasy","Young Adult"],
    tropes: ["Magic School", "Chosen One", "Friendship", "Adventure"],
    author: "J.K. Rowling",
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "A Good Girl's Guide to Murder",
    image: "images/girl'sGuideToMurder.png",
    desc: "A gripping mystery with a strong female protagonist",
    genre:  ["Thriller","Mystery"],
    tropes: ["Gripping Mystery", "Strong Female Protagonist"],
    author: "Holly Jackson",
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "Iron Flame",
    image: "images/ironflame.png",
    desc: "A thrilling tale of magic and adventure",
    genre: ["Fantasy","Romance"],
    tropes: ["Magic", "Adventure", "Romance"],
    author: "Rebecca Yarros",
    playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "No Excuses",
    image: "images/noExcuses.png",
    desc: "Discipline over motivation. No shortcuts",
    genre:  ["Self-Help"],
    tropes: ["Discipline", "Motivation", "Self-Improvement"],
    author: "Ryan Holiday",
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "We'll Always Have Summer",
    image: "images/alwaysHaveSummer.png",
    desc: "Love, heartbreak, and choices that hurt",
    genre: ["Young Adult","Romance"],
    tropes: ["Love", "Heartbreak", "Choices"],
    author: "Jenny Han",
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "People We Meet on Vacation",
    image: "images/peopleWeMeetOnVacation.png",
    desc: "Best friends, missed chances, and one last trip",
    genre: ["Romance"],
    tropes: ["Best Friends", "Missed Chances", "Last Trip"],
    author: "Emily Henry",
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "Powerless",
    image: "images/powerless.png",
    desc: "Forbidden power and a world that wants you gone",
    genre: ["Romance","Fantasy"],
    tropes: ["Forbidden Power", "Dystopian World", "Romance"],
    author: "Emily Henry",
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "The Emperor",
    image: "images/emperor.webp",
    desc: "A romance where staying alive and staying in love are equally risky",
    genre: ["Romance","Thriller"],
    tropes: ["Romance", "Thriller", "Survival", "Dangerous Love"],
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "Better Than the Movies",
    image: "images/betterThanMovies.png",
    desc: "A rom-com girlie chasing her movie moment… but life said plot twist",
    genre: ["Young Adult","Romance"],
    tropes: ["Rom-Com", "Chasing Dreams", "Plot Twist", "Young Adult Romance"],
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "The 48 Laws of Power",
    image: "images/power.png",
    desc: "Play the game… or get played",
    genre: ["Self-Help"],
    tropes: ["Power Dynamics", "Strategy", "Manipulation", "Self-Improvement"],
      playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "The Summer I Turned Pretty",
    image: "images/summerITurnedPretty.png",
    desc: "Summer love, messy feelings, growing up",
    genre: ["Young Adult","Romance"],
    tropes: ["Summer Love", "Messy Feelings", "Growing Up"],
     playlist:"https://open.spotify.com/playlist/abc123"
  },
  {
    title: "The Housemaid",
    image: "images/theHousemaid.png",
    desc: "She knows too much… and it’s terrifying",
    genre: ["Mystery","Thriller"],
    tropes: ["Mystery", "Thriller", "Suspense", "Dark Secrets"],
     playlist:"https://open.spotify.com/playlist/abc123" 
  }

];

let cards = [];
let current = 0;
let popup;

window.onload = () => {

  function renderCards(bookList){
    const wrapper = document.querySelector(".swipe-wrapper");

    wrapper.innerHTML = '<div class="tbr-popup">Added to TBR 💖</div>';

    bookList.forEach((book, index) => {
      const card = document.createElement("div");
      card.classList.add("swipe-card");

      if(index === 0) card.classList.add("active");

      card.innerHTML = `
        <img src="${book.image}">
        <div class="visit-btn">Visit Book 📖</div>
        <h3>${book.title}</h3>
        <p>${book.desc}</p>
      `;

      card.querySelector(".visit-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        localStorage.setItem("selectedBook", JSON.stringify(book));
        window.location.href = "book.html";
      });

      wrapper.appendChild(card);
    });

    cards = document.querySelectorAll(".swipe-card");
    popup = document.querySelector(".tbr-popup");
    current = 0;
  }

  function swipeLeft() {
    cards[current].classList.add("swipe-left");
    setTimeout(nextCard, 600);
  }

  function nextCard() {
    cards[current].classList.remove("active", "swipe-right", "swipe-left");
    current++;

    if(current < cards.length){
      cards[current].classList.add("active");
    } else {
      renderCards(books);
    }
  }

  function showPopup(){
    popup.classList.remove("show");
    void popup.offsetWidth;
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
    }, 2200);
  }
  function swipeRight() {
  let tbr = JSON.parse(localStorage.getItem("tbr")) || [];

  const currentBook = books[current];

  const exists = tbr.some(item => item.title === currentBook.title);

  if (!exists) {
    tbr.push(currentBook);
    localStorage.setItem("tbr", JSON.stringify(tbr));
    popup.textContent = "Added to TBR 💖";
  } else {
    popup.textContent = "Already in TBR ";
  }

  showPopup();

  setTimeout(() => {
    cards[current].classList.add("swipe-right");
  }, 400);

  setTimeout(() => {
    nextCard();
    popup.classList.remove("show");
  }, 900);
}
  renderCards(books);

  document.addEventListener("keydown", (e)=>{
    if (e.key === "ArrowRight") swipeRight();
    if (e.key === "ArrowLeft") swipeLeft();
  });
};