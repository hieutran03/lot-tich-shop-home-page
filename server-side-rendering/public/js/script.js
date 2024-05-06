const logout_form = document.querySelector("#logout_form");
if (logout_form) {
  const logout_btn = document.querySelector("#logout_btn");
  if (logout_btn) {
    logout_btn.addEventListener("click", (e) => {
      logout_form.submit();
    });
  }
}
function incQuantity() {
  var value = parseInt(document.getElementById("product-quantity").value, 10);
  value = isNaN(value) ? 1 : value;
  value++;
  document.getElementById("product-quantity").value = value;
}

function decQuantity() {
  var value = parseInt(document.getElementById("product-quantity").value, 10);
  value = isNaN(value) ? 1 : value;
  value = value <= 1 ? 1 : value - 1;
  document.getElementById("product-quantity").value = value;
}

// tăng giảm sản phẩm ở /cart
// function dec_Quantity(productId) {
//   var quantityInput = document.getElementById("product-quantity-" + productId);
//   var currentQuantity = parseInt(quantityInput.value);

//   if (currentQuantity > 1) {
//     quantityInput.value = currentQuantity - 1;
//   }
// }

// function inc_Quantity(productId) {
//   var quantityInput = document.getElementById("product-quantity-" + productId);
//   var currentQuantity = parseInt(quantityInput.value);

//   quantityInput.value = currentQuantity + 1;
//   console.log(productId);
// }
function dec_Quantity(productId) {
  var quantityInput = document.getElementById("product-quantity-" + productId);
  var currentQuantity = parseInt(quantityInput.value);

  if (currentQuantity > 1) {
    quantityInput.value = currentQuantity - 1;
    updateQuantity(productId, currentQuantity - 1); // Gọi hàm cập nhật số lượng
  }
}

function inc_Quantity(productId) {
  var quantityInput = document.getElementById("product-quantity-" + productId);
  var currentQuantity = parseInt(quantityInput.value);

  quantityInput.value = currentQuantity + 1;
  updateQuantity(productId, currentQuantity + 1); // Gọi hàm cập nhật số lượng
}

async function updateQuantity(productId, newQuantity) {
  try {
    const response = await fetch(`/cart/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to update quantity");
    }

    // Nếu yêu cầu thành công, làm mới lại trang /cart hoặc cập nhật giao diện theo ý của bạn
    window.location.reload(); // Làm mới lại trang
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
}

const btnAddToCart = document.querySelector("#add-to-cart");
if (btnAddToCart) {
  console.log(btnAddToCart);
  const formUserService = document.querySelector("#form-user-service");
  if (formUserService) {
    btnAddToCart.addEventListener("click", (e) => {
      const productId = formUserService.getAttribute("data-product-id");
      formUserService.action = `/cart/${productId}`;
      formUserService.submit();
    });
  }
}
