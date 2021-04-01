if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", loadRender);
} else {
  loadRender();
} // Arrancar la funcion principal cuando cargue la pagina

let time = new Date(); // Hora
let timeClock = document.querySelector(".time");
let mainContainer = document.querySelector(".cart-layout"); // Layout principal
let totalForCart = document.querySelector(".cartTotal"); // Campo del Total
let total = 0; // Valor por defecto del total
let purchaseBtn = document.querySelector(".purchaseBtn"); // Boton de COMPRAR
let cartList = document.querySelector(".cartList"); // Lista de ITEMS
let mainData = []; // Donde se almacena la DATA principal

let moviePool = [
  "tt0848228",
  "tt0120338",
  "tt0458290",
  "tt0790636",
  "tt0816692",
  "tt1980929",
  "tt0993846",
  "tt2543164",
  "tt0241527",
]; // Lista de PELICULAS
let randomPrices = [
  12.99,
  19.99,
  20.1,
  32.05,
  9.99,
  10.99,
  4.99,
  40.0,
  45.99,
  11.99,
]; // Precios random GENERABLES

function getAllMoviesData(arr = []) {
  // Se hace FETCH de los datos de cada una y se construye cada card dinámicamente
  arr.forEach(async (v) => {
    const resp = await fetch(`http://www.omdbapi.com/?apikey=ec1b758c&i=${v}`);
    const data = await resp.json();

    let newMovie = document.createElement("div");
    newMovie.classList.add("ml-4");
    newMovie.innerHTML = `
    <div class='col-4 '>
    <div class="card itemCard ml-4" style="width: 18rem;">
    <div class="card-body">
        <img src=${data.Poster} class="imageIcon1" />
        <h5 class="card-title d-flex justify-content-center text-yellow mt-3 item-title">${
          data.Title
        }</h5>
        <p class="card-text item-description"> <strong>Dir</strong>: ${
          data.Director
        }, <strong>Year</strong>: ${data.Year}
        </p>
        <div style="margin-top: 20px">
        <button class="btn btn-primary rounded-pill addButton" onClick="addItem();"><i class="fas fa-plus-circle"></i> Add to Cart</button>
        <span class="bg-success rounded-pill text-white p-2 ml-2 item-price"><i class="fas fa-coins"></i>
            $${
              randomPrices[Math.floor(Math.random() * randomPrices.length)]
            }</span>
        </div>
    </div>
</div>
</div>`;
    newMovie.querySelector(".addButton").addEventListener("click", addItem);
    mainContainer.append(newMovie);
    cartImg = data.poster;
  });
}

function loadRender() {
  let currentTime = time.getHours() + ":" + time.getMinutes(); // Crear hora actual
  timeClock.innerHTML = `<i class="far fa-clock"></i> ` + currentTime; // Insertar hora actual

  // Activar funciones de agregado y borrado
  let deleteButton = document.querySelectorAll(".deleteButton");
  deleteButton.forEach((v) => {
    v.addEventListener("click", removeItem);
  });

  let addButton = document.querySelectorAll(".addButton");
  addButton.forEach((v) => {
    v.addEventListener("click", addItem);
  });

  purchaseBtn.addEventListener("click", purchaseFunc); // Evento de COMPRAR
}

function purchaseFunc() {
  // Funcion de COMPRAR
  let numOfMovies = cartList.childElementCount;
  let finalTotal = Math.round(total * 100) / 100;
  if (numOfMovies === 1) {
    playCashRegisterSound();
    alert(
      `Congrats! You've purchased ${numOfMovies} movie, your total was $${finalTotal}`
    );
    window.location.reload();
  }
  if (numOfMovies > 0 && numOfMovies !== 1) {
    playCashRegisterSound();
    alert(
      `Congrats! You've purchased ${numOfMovies} movies, your total was $${finalTotal}`
    );
    window.location.reload();
  }
}

function removeItem(e) {
  // Funcion de REMOVER items (y actualizar total según ello)
  let btnClicked = e.target;
  let currentItem = btnClicked.parentElement.parentElement;
  let priceEl = currentItem.querySelectorAll(".item-price")[0].innerText;
  let priceNum = parseFloat(priceEl.replace("$", ""));
  currentItem.classList.add("animate__animated", "animate__bounceOutDown");
  total = total - priceNum;
  totalForCart.innerHTML = `<h4 class=" cartTotal text-white mt-3 mb-2 bg-blue rounded-pill ml-2 d-flex justify-content-start w-75">
  <i class="fas fa-wallet"></i>
  &nbsp;
  Total
  $ ${Math.round(total * 100) / 100}
</h4>`;
  currentItem.remove();
  document.querySelector(".quantityBubble").innerHTML =
    cartList.childElementCount;
}

function addItem(e) {
  // Funcion de AGREGAR items (y actualizar total según ello)
  purchaseBtn.addEventListener("click", purchaseFunc);
  let cartList = document.querySelector(".cartList");
  let btnClicked = e.target;
  let currentItem = btnClicked.parentElement.parentElement;
  let title = currentItem.querySelectorAll(".item-title")[0].innerText;
  let description = currentItem.querySelectorAll(".item-description")[0]
    .innerText;
  let priceEl = currentItem.querySelectorAll(".item-price")[0].innerText;
  let priceNum = parseFloat(priceEl.replace("$", ""));
  total = total + priceNum;

  let newAdded = document.createElement("li");
  newAdded.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  newAdded.innerHTML = `<div class="col-8">
  <img class="imageIcon2" src="popcorn.png" />
  <div class="fw-bold"><strong>${title}</strong></div>
  ${description}
</div>
<div class="col-2">
  <span class="bg-success text-white p-2 rounded-pill px-4 item-price"> <i class="fas fa-coins"></i> 
      </i>${priceEl}</span>
</div>
<div class="col-2">
  <button class="btn btn-danger btn-md text-white rounded-pill px-4 deleteButton"><i class="fas fa-minus-circle"></i> REMOVE</button>
</div>`;

  cartList.appendChild(newAdded);
  newAdded.querySelector(".deleteButton").addEventListener("click", removeItem);

  totalForCart.innerHTML = `<h4 class=" cartTotal text-white mt-3 mb-2 bg-blue rounded-pill ml-2 d-flex justify-content-start w-75">
  <i class="fas fa-wallet"></i>
  &nbsp;
  Total
  $ ${Math.round(total * 100) / 100}
</h4>`;

  document.querySelector(".quantityBubble").innerHTML =
    cartList.childElementCount;
  document
    .querySelector(".quantityBubble")
    .classList.add("animate__bounce", "animate__fast");
  document
    .querySelector(".quantityBubble")
    .addEventListener("animationend", () => {
      document
        .querySelector(".quantityBubble")
        .classList.remove("animate__bounce", "animate__fast");
    });
}

getAllMoviesData(moviePool); // Llamar los datos de las peliculas a partir del Array creado

let cashSound = new Audio("/cash.wav");

function playCashRegisterSound() {
  cashSound.play();
}
