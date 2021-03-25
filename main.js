if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", loadRender);
} else {
  loadRender();
} // Arrancar la funcion principal cuando cargue la pagina

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
let randomPrices = [12.99, 19.99, 20.10, 32.50, 9.99, 10.50, 4.99, 50.0, 45.99, 100.99]; // Precios random GENERABLES

function getAllMoviesData(arr = []) { // Se hace FETCH de los datos de cada una y se construye cada card dinámicamente
  arr.forEach(async (v) => {
    const resp = await fetch(`http://www.omdbapi.com/?apikey=ec1b758c&i=${v}`);
    const data = await resp.json();

    let newMovie = document.createElement("div");
    newMovie.classList.add('col-4');
    newMovie.innerHTML = `
    <div class='col-4'>
    <div class="card itemCard " style="width: 18rem;">
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
        <button class="btn btn-primary rounded-pill addButton" onClick="addItem();">Add to Cart</button>
        <span class="bg-success rounded-pill text-white p-3 ml-3 item-price"><i
                class="fas fa-money-bill-wave"></i>
            $${
              randomPrices[Math.floor(Math.random() * randomPrices.length)]
            }</span>
        </div>
    </div>
</div>
</div>`;
    newMovie.querySelector(".addButton").addEventListener("click", addItem);
    mainContainer.append(newMovie);
  });
}

function loadRender() {
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

function purchaseFunc() { // Funcion de COMPRAR
  let numOfMovies = cartList.childElementCount;
  let finalTotal = Math.round(total * 100) / 100;
  if (numOfMovies === 1) {
    alert(
      `Congrats! You've purchased ${numOfMovies} movie, your total was $${finalTotal}`
    );
    window.location.reload();
  }
  if (numOfMovies > 0 && numOfMovies !== 1) {
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
  total = total - priceNum;
  totalForCart.innerHTML = `<h4 class=" cartTotal text-white mt-3 mb-2 bg-blue rounded-pill ml-2 d-flex justify-content-start w-75">
  <i class="fas fa-wallet"></i>
  &nbsp;
  Total
  $ ${Math.round(total * 100) / 100}
</h4>`;
  currentItem.classList.add("animate__animated", "animate__bounceOutDown");
  currentItem.remove();
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
  <span class="bg-success text-white p-2 rounded-pill px-4 item-price"> <i class="fas fa-money-bill-wave"> &nbsp;
      </i>${priceEl}</span>
</div>
<div class="col-2">
  <button class="btn btn-danger btn-md text-white rounded-pill px-4 deleteButton">REMOVE</button>
</div>`;

  cartList.appendChild(newAdded);
  newAdded.querySelector(".deleteButton").addEventListener("click", removeItem);

  totalForCart.innerHTML = `<h4 class=" cartTotal text-white mt-3 mb-2 bg-blue rounded-pill ml-2 d-flex justify-content-start w-75">
  <i class="fas fa-wallet"></i>
  &nbsp;
  Total
  $ ${Math.round(total * 100) / 100}
</h4>`;
}

getAllMoviesData(moviePool); // Llamar los datos de las peliculas dadsa

fetch("http://www.omdbapi.com/?apikey=ec1b758c&i=tt0120338")
.then(resp => resp.json())
.then(data => console.log(data))