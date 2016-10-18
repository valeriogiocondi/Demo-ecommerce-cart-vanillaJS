var ecommerce = function() {

	var istance = {};
	var productsList;
	var cartList;

	istance.start = function() {

		istance.init();
		istance.getProductListFromJSONfile();
	}

	istance.init = function() {

		document.getElementById("button-cart").addEventListener("click", function(e){

		  e.preventDefault();
		  istance.openCartList("pushstate");
		});

		document.getElementById("cart-list").getElementsByClassName("back")[0].addEventListener("click", function() {

		  istance.closeCartList("pushstate");
		});

		document.addEventListener("keydown", function(e){

		  if (e.keyCode == 27)
		    istance.closeCartList("pushstate");
		});

		window.addEventListener('popstate', function(event) {

			if (location.href.endsWith("cart/"))
					istance.openCartList();
			else
				istance.closeCartList();
		});

		document.getElementsByClassName("menu")[0].getElementsByClassName("grid-vew")[0].addEventListener("click", function() {
		  
		  document.getElementById("products-list").classList.remove("list-view");
		  document.getElementById("products-list").classList.add("grid-view");
		});

		document.getElementsByClassName("menu")[0].getElementsByClassName("list-vew")[0].addEventListener("click", function() {

		  document.getElementById("products-list").classList.remove("grid-view");
		  document.getElementById("products-list").classList.add("list-view");
		});

		istance.openCartList = function() {

			if (arguments.length > 0)
				window.history.pushState({}, "", "/ex-machina/cart/");

			document.getElementsByTagName("body")[0].style.overflowY = "hidden";
			document.getElementById("cart-list").classList.add("fadeIn");
		}

		istance.closeCartList = function() {

			if (arguments.length > 0)
				window.history.pushState({}, "", "/ex-machina/");

			document.getElementById("cart-list").classList.remove("fadeIn");
			document.getElementsByTagName("body")[0].style.overflowY = "visible";
		}
	}

	istance.getProductListFromJSONfile = function() {

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		  
		  if (this.readyState == 4 && this.status == 200) {

		    productsList = JSON.parse(this.responseText);
			istance.viewProductsList();
		  }
		};

		xhttp.open("GET", "products.json", true);
		xhttp.send();
	}

	istance.viewProductsList = function() {

		var times = 0, quantity = 8;
		istance.appendProductToProductsList(times, quantity)
		times++;

		window.onscroll = function() {

			(function() {

			    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			        
					try {

						istance.appendProductToProductsList(times, quantity)
						times++;

					} 
					catch (err) {

						if (productsList.length/(times*quantity) > 1)
							times++;

					}
			    }

			})();		    

		}
	}

	istance.appendProductToProductsList = function(start, quantity) {

		for (var i=start*quantity; i<=(start+1)*quantity-1; i++) {

			var product = document.createElement("div");
			product.classList.add("product");
			product.id = "product-"+productsList[i]["id"];
			product.dataset.id = productsList[i]["id"];

			var imageNode = document.createElement("div");
			imageNode.classList.add("image");
			product.appendChild(imageNode);

			var imgNode = document.createElement("img");
			imgNode.src = productsList[i]["image"];
			imageNode.appendChild(imgNode);

			var infoNode = document.createElement("div");
			infoNode.classList.add("info");
			product.appendChild(infoNode);

			var nameNode = document.createElement("div");
			var text = document.createTextNode(productsList[i]["name"]);
			nameNode.appendChild(text);
			nameNode.classList.add("name");
			infoNode.appendChild(nameNode);

			var priceNode = document.createElement("div");
			var text = document.createTextNode("€ "+productsList[i]["price"].toFixed(2));
			priceNode.appendChild(text);
			priceNode.dataset.value = productsList[i]["price"].toFixed(2);
			priceNode.classList.add("price");
			infoNode.appendChild(priceNode);

			var buttonNode = document.createElement("button");
			var text = document.createTextNode("ADD TO CART");
			buttonNode.appendChild(text);
			buttonNode.classList.add("button");
			buttonNode.classList.add("add-to-cart");
			infoNode.appendChild(buttonNode);

			// 	addCart eventListener

			product.getElementsByClassName("add-to-cart")[0].addEventListener("click", function() {

				var productJSON = {
				  "id": this.parentNode.parentNode.dataset.id,
				  "name": this.parentNode.getElementsByClassName("name")[0].textContent, 
				  "price": this.parentNode.getElementsByClassName("price")[0].dataset.value,
				  "image": this.parentNode.parentNode.getElementsByTagName("img")[0].src
				};

				istance.addProductToCartList(productJSON);
			});

			document.getElementById("products-list").appendChild(product);
		}
	}

	istance.addProductToCartList = function(product){

		if (cartList == null) {

		  cartList = [];
		  product["quantity"] = 1;
		  cartList[0] = product;
		  istance.addProductToViewCartList(product);

		} else {

		  if (!istance.isProductInCartYet(product["id"])) {

		    product["quantity"] = 1;
		    cartList.push(product);
			istance.addProductToViewCartList(product);
		  }
		}

		istance.openCartList("pushstate");
	}

	istance.isProductInCartYet = function(id) {

		for (var i=0, n=cartList.length; i<n; i++) {

		  if (cartList[i]["id"] == id) {

		    cartList[i]["quantity"] += 1;
		    return true;
		  }
		}

		return false;
	}

	istance.addProductToViewCartList = function(obj) {

	  product = document.createElement("div");
	  product.classList.add("product");
	  product.dataset.id = obj["id"];
	  product.id = "product-"+obj["id"];

	  var imageNode = document.createElement("div");
	  imageNode.classList.add("col");
	  imageNode.classList.add("top");
	  imageNode.classList.add("thumb-image");
	  product.appendChild(imageNode);
	  var imgNode = document.createElement("img");
	  imgNode.src = obj["image"];
	  imageNode.appendChild(imgNode);

	  var infoNode = document.createElement("div");
	  infoNode.classList.add("col");
	  infoNode.classList.add("top");
	  product.appendChild(infoNode);

	  var nameNode = document.createElement("div");
	  var text = document.createTextNode(obj["name"]);
	  nameNode.appendChild(text);
	  nameNode.classList.add("name");
	  infoNode.appendChild(nameNode);

	  var priceNode = document.createElement("div");
	  var text = document.createTextNode("€ "+parseInt(obj["price"]).toFixed(2));
	  priceNode.appendChild(text);
	  priceNode.classList.add("price");

	  infoNode.appendChild(priceNode);

	  var buttonNode = document.createElement("button");
	  var text = document.createTextNode("Remove");
	  buttonNode.appendChild(text);
	  buttonNode.classList.add("link");
	  buttonNode.classList.add("underline-hover");
	  buttonNode.classList.add("remove");
	  infoNode.appendChild(buttonNode);
	  
	  document.getElementById("cart-list").getElementsByClassName("table-list")[0].appendChild(product);

	  buttonNode.addEventListener("click", function(){

	    istance.removeProductFromViewCartList(this.parentNode.parentNode.dataset.id);

	    var child = document.getElementById(this.parentNode.parentNode.id);
	    child.parentNode.removeChild(child);

	  });
	}

	istance.removeProductFromViewCartList = function(id) {

		var temp = [];

		for (var i=0, j=0, n=cartList.length; i<n; i++) {

		  if (cartList[i]["id"] != id) {

		    temp[j] = cartList[i];
		    j++;
		  }
		}

		cartList = temp;
	}

	return istance;
}

var SPA = ecommerce();
SPA.start();