// ================> html elements 👇
var productNameInput = document.getElementById("productNameInput");
var productCategoryInput = document.getElementById("productCategoryInput");
var productPriceInput = document.getElementById("productPriceInput");
var productDescriptionInput = document.getElementById(
  "productDescriptionInput",
);
var productImageInput = document.getElementById("productImageInput");

var productsContainers = document.getElementById("productsContainers");

var searchInput = document.getElementById("searchInput");
var submitProductBtn = document.getElementById("submitProductBtn");

/** @type {number | null} index in productList being edited, or null for add */
var editingProductIndex = null;

//^ ================> variables 👇
// if (localStorage.getItem('products') !== null) {
//     var productList = JSON.parse(localStorage.getItem("products"))
//     displayAllProducts()
// } else {
//     var productList = []
// }
var productNameRegex = /^[A-z][a-z 0-9 A-Z]{3,}$/;
var productCategoryRegex = /^[A-z][a-z0-9A-Z]{3,}$/;
var productPriceRegex = /^[1-9]\d*(\.\d{1,2})?$/;
var productDescriptionRegex = /^[A-Z][a-z0-9A-Z ]{25,}$/;

var productList = JSON.parse(localStorage.getItem("products")) || [];
displayAllProducts();

//&================> functions 👇
function addProduct() {
  var isValid =
    validate(productNameRegex, productNameInput) &&
    validate(productCategoryRegex, productCategoryInput) &&
    validate(productPriceRegex, productPriceInput) &&
    validate(productDescriptionRegex, productDescriptionInput);
  if (isValid !== true) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
    return;
  }

  var imageUrl =
    productImageInput.files.length > 0
      ? productImageInput.files[0].name
      : "";

  if (editingProductIndex !== null) {
    var prev = productList[editingProductIndex];
    productList[editingProductIndex] = {
      name: productNameInput.value,
      category: productCategoryInput.value,
      price: productPriceInput.value,
      description: productDescriptionInput.value,
      imageUrl: imageUrl || prev.imageUrl,
    };
    localStorage.setItem("products", JSON.stringify(productList));
    editingProductIndex = null;
    submitProductBtn.textContent = "Add product";
    resetAddProductForm();
    refreshProductsView();
    Swal.fire({
      title: "Product updated",
      icon: "success",
      draggable: true,
    });
    return;
  }

  var product = {
    name: productNameInput.value,
    category: productCategoryInput.value,
    price: productPriceInput.value,
    description: productDescriptionInput.value,
    imageUrl: imageUrl,
  };
  productList.push(product);
  localStorage.setItem("products", JSON.stringify(productList));
  displayProduct(productList.length - 1);
  resetAddProductForm();
  Swal.fire({
    title: "Your product had been added",
    icon: "success",
    draggable: true,
  });
}

function startEditProduct(index) {
  var p = productList[index];
  if (!p) return;
  productNameInput.value = p.name;
  productCategoryInput.value = p.category;
  productPriceInput.value = p.price;
  productDescriptionInput.value = p.description;
  productImageInput.value = "";
  validate(productNameRegex, productNameInput);
  validate(productCategoryRegex, productCategoryInput);
  validate(productPriceRegex, productPriceInput);
  validate(productDescriptionRegex, productDescriptionInput);
  editingProductIndex = index;
  submitProductBtn.textContent = "Save changes";
  productNameInput.focus();
  productNameInput.scrollIntoView({ behavior: "smooth", block: "center" });
}

function refreshProductsView() {
  productsContainers.innerHTML = "";
  var keyword = searchInput.value.trim();
  if (keyword) {
    searchProducts();
  } else {
    displayAllProducts();
  }
}

function displayProduct(index) {
  var cardMarkUp = ` <div class="col-md-4 col-sm-6 col-xl-3">
            <div class="product-card rounded-3 overflow-hidden">
              <img src="./assets/img/${productList[index].imageUrl}" alt="" class="w-100" />
              <div class="product-info px-3 py-4 ">
                <div class="d-flex justify-content-between align-items-center ">
                  <h3 class="h5">${productList[index].name}</h3>
                  <span class="h5">${productList[index].price} $</span>
                </div>
                <div class="d-flex  align-items-center mb-3">
                    <i class="fa-solid fa-layer-group"></i>
                    <span>${productList[index].category}</span>
                </div>
                <p class="text-secondary">${productList[index].description}</p>
                <div class="d-flex justify-content-around ">
                    <button type="button" class="btn btn-outline-warning mx-3" onclick="startEditProduct(${index})">Update</button> 
                    <button class="btn btn-outline-danger" onclick="deleteProduct(${index})" >delete</button> 
                </div>
              </div>
            </div>
          </div>`;
  productsContainers.innerHTML += cardMarkUp;
}

function displayAllProducts() {
  for (var i = 0; i < productList.length; i++) {
    displayProduct(i);
  }
}

function deleteProduct(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // delete element from array by splice it take the (start , how many thing it delete)
      productList.splice(index, 1);
      // update the local storage
      localStorage.setItem("products", JSON.stringify(productList));
      if (editingProductIndex === index) {
        editingProductIndex = null;
        submitProductBtn.textContent = "Add product";
        resetAddProductForm();
      } else if (
        editingProductIndex !== null &&
        editingProductIndex > index
      ) {
        editingProductIndex -= 1;
      }
      refreshProductsView();
      Swal.fire({
        title: "Deleted!",
        text: "Your product  has been deleted.",
        icon: "success",
      });
    }
  });
}

function searchProducts() {
  productsContainers.innerHTML = "";
  var keyword = searchInput.value;
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].name.toLowerCase().includes(keyword.toLowerCase())) {
      displayProduct(i);
    }
  }
}

function resetAddProductForm() {
  var fields = [
    productNameInput,
    productCategoryInput,
    productPriceInput,
    productDescriptionInput,
  ];
  for (var i = 0; i < fields.length; i++) {
    fields[i].value = "";
    fields[i].classList.remove("is-valid", "is-invalid");
    var hint = fields[i].nextElementSibling;
    if (hint && hint.classList.contains("error")) {
      hint.classList.add("d-none");
    }
  }
  productImageInput.value = "";
}

function validate(regex, element) {
  if (regex.test(element.value)) {
    element.nextElementSibling.classList.add("d-none");
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
    return true;
  } else {
    element.nextElementSibling.classList.remove("d-none");
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    return false;
  }
}
