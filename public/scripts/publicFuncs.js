// use it when make a new order in restaurant/show
function getPrice() {
	var selected = document.getElementById("selectedFood").options;
	var amount = document.getElementById("selectedFoodAmount").value;
	var value = selected[selected.selectedIndex].value;
	var arr = value.split("-");
	var totalDisplay = document.getElementById("totalPrice");
	totalDisplay.innerHTML = "$" + (arr[1] * amount).toFixed(2);
	var selectedFoodTotalPrice = document.getElementById("selectedFoodTotalPrice");
	selectedFoodTotalPrice.value = (arr[1] * amount).toFixed(2);
	var selectedFoodName = document.getElementById("selectedFoodName");
	selectedFoodName.value = arr[0];
			//return arr[1] * amount;
}

// used when make a new order in restaurant/show
function checkNewOrderTime() {
	var alert = document.getElementById("overTimeAlert");
	var button = document.getElementById("addToCart");
	var flag = checkTime();
	if(flag === true) {
		button.disabled = true;
		alert.innerHTML = "点餐时间已过，请明天再来!"
	}
}

// used when check my order today
function checkOrderTime() {
	var modify = document.getElementById("modify");
	var error = document.getElementById("errorMessage");
	var flag = checkTime();
	if(flag === true) {
		modify.style.display = "none";
	}
}

function checkTime() {
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
	return flag;
}





function toggle(){
	$(".delete").toggle()
}

