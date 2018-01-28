// use it when make a new order in restaurant/show
function getPrice() {
	var selected = document.getElementById("selectedFood").options;
	var amount = document.getElementById("selectedFoodAmount").value;
	var value = selected[selected.selectedIndex].value;
	var arr = value.split("-");
	var totalDisplay = document.getElementById("totalPrice");
	totalDisplay.innerHTML = "$" + arr[1] * amount;
	var selectedFoodTotalPrice = document.getElementById("selectedFoodTotalPrice");
	selectedFoodTotalPrice.value = arr[1] * amount;
	var selectedFoodName = document.getElementById("selectedFoodName");
	selectedFoodName.value = arr[0];
			//return arr[1] * amount;
}

// use it when make a new order in restaurant/show
function chechTime() {
	var date = new Date();
	var alert = document.getElementById("overTimeAlert");
	var button = document.getElementById("addToCart");
	var flag = false;
	if(date.getHours() == 11) {
		if(date.getMinutes() > 19) {
			flag = true;
		}
	}
	if(date.getHours() > 11) {
		flag = true;
	}
	if(flag === true) {
		button.disabled = true;
		alert.innerHTML = "点餐时间已过，请明天再来!"
	}
}