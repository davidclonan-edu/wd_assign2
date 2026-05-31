var restaurantInfo = {
    "cherryhill": {
        "friendlyname": "Cherry Hill Tavern",
        "vegetarian": true,
        "vegan": true,
        "glutenfree": true,
        "lactosefree": true,
        "halal": true,
        "minprice": 30,
        "maxprice": 60,
        "diningstyles": ["family", "date", "casual"],
    },
    "bocca": {
        "friendlyname": "Bocca",
        "vegetarian": true,
        "vegan": true,
        "glutenfree": true,
        "lactosefree": false,
        "halal": true,
        "minprice": 15,
        "maxprice": 40,
        "diningstyles": ["date", "family"]
    },
    "pancakeparlour": {
        "friendlyname": "Pancake Parlour",
        "vegetarian": true,
        "vegan": false,
        "glutenfree": false,
        "lactosefree": false,
        "halal": true,
        "minprice": 17,
        "maxprice": 35,
        "diningstyles": ["family", "casual"]
    },
    "sushihub": {
        "friendlyname": "Sushi Hub",
        "vegetarian": true,
        "vegan": true,
        "glutenfree": true,
        "lactosefree": true,
        "halal": false,
        "minprice": 9,
        "maxprice": 20,
        "diningstyles": ["casual", "takeaway"]
    },
    "mcdonalds": {
        "friendlyname": "McDonald's",
        "vegetarian": true,
        "vegan": false,
        "glutenfree": false,
        "lactosefree": false,
        "halal": false,
        "minprice": 10,
        "maxprice": 20,
        "diningstyles": ["quick", "takeaway", "family"]
    },
    "kfc": {
        "friendlyname": "KFC",
        "vegetarian": false,
        "vegan": false,
        "glutenfree": false,
        "lactosefree": true,
        "halal": false,
        "minprice": 12,
        "maxprice": 25,
        "diningstyles": ["quick", "takeaway", "family"]
    },
};

function recommend(event) {
    event.preventDefault();

    var dietaryPreferences = [];
    var minimumPrice = $("#minprice").val();
    var maximumPrice = $("#maxprice").val();
    var diningStyle = null;

    var errorWarning = "";

    // Dietary preferences
    if ($("#dp_vegetarian").prop("checked")) {
        dietaryPreferences.push("vegetarian");
    }
    if ($("#dp_vegan").prop("checked")) {
        dietaryPreferences.push("vegan");
    }
    if ($("#dp_glutenfree").prop("checked")) {
        dietaryPreferences.push("glutenfree");
    }
    if ($("#dp_lactosefree").prop("checked")) {
        dietaryPreferences.push("lactosefree");
    }
    if ($("#dp_halal").prop("checked")) {
        dietaryPreferences.push("halal");
    }

    if ($("#ds_family").prop("checked")) {
        diningStyle = "family";
    } else if ($("#ds_date").prop("checked")) {
        diningStyle = "date";
    } else if ($("#ds_casual").prop("checked")) {
        diningStyle = "casual";
    } else if ($("#ds_takeaway").prop("checked")) {
        diningStyle = "takeaway";
    } else if ($("#ds_quick").prop("checked")) {
        diningStyle = "quick";
    }

    var viableRestaurants = [];
    for (var restaurant in restaurantInfo) {
        var info = restaurantInfo[restaurant];
        var matches = true;

        for (var i = 0; i < dietaryPreferences.length; i++) {
            if (!info[dietaryPreferences[i]]) {
                matches = false;
                break;
            }
        }

        if (info.minprice > maximumPrice || info.maxprice < minimumPrice) {
            matches = false;
        }

        if (diningStyle && info.diningstyles.indexOf(diningStyle) === -1) {
            matches = false;
        }

        if (matches) {
            viableRestaurants.push(restaurant);
        }
    }

    if (viableRestaurants.length > 0) {
        var recommendationsHtml = "<p>Here are some restaurants you might like:</p><ul>";
        for (var i = 0; i < viableRestaurants.length; i++) {
            recommendationsHtml += "<li><a href='reservation.html?restaurant=" + encodeURIComponent(viableRestaurants[i]) + "'>" + restaurantInfo[viableRestaurants[i]].friendlyname + "</a></li>";
        }
        recommendationsHtml += "</ul>";
        $("#recommendations").html(recommendationsHtml);
    } else {
        $("#recommendations").html("<p>No restaurants match your criteria.</p>");
    }
}

function register() {
    var username = $("#username").val();
    var email = $("#email").val();
    var phoneNumber = $("#phonenumber").val();
    var password = $("#password").val();
    var passwordConfirm = $("#passwordconfirm").val();
    var gender = $("#gender").val();
    var vegetarian = $("#vegetarian").prop("checked");
    var vegan = $("#vegan").prop("checked");
    var halal = $("#halal").prop("checked");

    var errorWarning = "";

    if (username.length < 5) {
        errorWarning += "Please enter a username that's at least 5 characters long.\n";
    }
    if (!username.matches(/^[A-Za-z0-9_]+$/)) {
        errorWarning += "Please enter a valid username (letters, numbers, and underscores only).\n";
    }
    if (email == "") {
        errorWarning += "Please enter an email address.\n";
    }
    if (!email.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errorWarning += "Please enter a valid email address.\n";
    }
    if (phoneNumber == "") {
        errorWarning += "Please enter a phone number.\n";
    }
    if (!phoneNumber.matches(/^\d{8,15}$/)) {
        errorWarning += "Please enter a valid phone number.\n";
    }
    if (!password.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/)) {
        errorWarning += "Please enter a password with at least 10 characters, and it must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.\n";
    }
    if (password != passwordConfirm) {
        errorWarning += "Passwords do not match.\n";
    }
    if (gender == "") {
        errorWarning += "Please select a gender.\n";
    }

    if (errorWarning != "") {
        alert(errorWarning);
        return false;
    }
}

function handleRecommendationToReservation() {
    var urlParams = new URLSearchParams(window.location.search);
    var restaurant = urlParams.get("restaurant");

    if (restaurant && restaurantInfo[restaurant]) {
        $("#selectedrestaurant").val(restaurant);
        reservationUpdate();
    }
}

function reservationUpdate() {
    var restaurant = $("#selectedrestaurant").val();
    var depositAmountField = $("#depositamount");
    var depositMethod = $("#depositmethod").val();

    var cardFields = $(".carddetails");
    var cardDetailsFields = $(".carddetailsinput");

    var billingEmail = $("#billingemail");
    var sameAsEmailCheckbox = $("#sameasemail");

    if (restaurant && restaurantInfo[restaurant]) {
        var info = restaurantInfo[restaurant];
        var deposit = info.deposit || 0;
        depositAmountField.val(deposit);
    } else {
        depositAmountField.val("");
    }

    if (depositMethod == "voucher") {
        cardFields.hide();
        cardDetailsFields.hide();
        cardDetailsFields.prop("required", false);
    } else if (depositMethod == "online") {
        cardFields.show();
        cardDetailsFields.show();
        cardDetailsFields.prop("required", true);
    } else {
        cardFields.hide();
        cardDetailsFields.hide();
        cardDetailsFields.prop("required", false);
    }

    if (sameAsEmailCheckbox.prop("checked")) {
        billingEmail.val($("#email").val());
        billingEmail.prop("disabled", true);
    } else {
        billingEmail.prop("disabled", false);
    }
}

function reservation() {
    var errorWarning = "";

    var email = $("#email").val();
    var phoneNumber = $("#phonenumber").val();

    var reservationDate = $("#reservationdate").val();
    var reservationTime = $("#reservationtime").val();

    if (email == "") {
        errorWarning += "Please enter an email address.\n";
    }
    if (!email.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errorWarning += "Please enter a valid email address.\n";
    }
    if (phoneNumber == "") {
        errorWarning += "Please enter a phone number.\n";
    }
    if (!phoneNumber.matches(/^\d{8,15}$/)) {
        errorWarning += "Please enter a valid phone number.\n";
    }

    var currentDate = new Date();
    var selectedDateTime = new Date(reservationDate + "T" + reservationTime);
    if (selectedDateTime < currentDate) {
        errorWarning += "Please select a date and time in the future.\n";
    }

    if (errorWarning != "") {
        alert(errorWarning);
        return false;
    }
}

function init() {
    $("#regform").submit(register);
    $("#recommendform").submit(recommend);
    handleRecommendationToReservation();
    reservationUpdate();
    $("#reservationform").on("change", reservationUpdate);
    $("#reservationform").submit(reservation);

    var minPriceSlider = $("#minprice");
    var maxPriceSlider = $("#maxprice");

    minPriceSlider.on("input", function() {
        var minValue = parseInt(minPriceSlider.val());
        var maxValue = parseInt(maxPriceSlider.val());
        if (minValue > maxValue) {
            maxPriceSlider.val(minValue);
            $("#maxpricevalue").text(maxValue);
        }
        $("#minpricevalue").text(minValue);
    });

    maxPriceSlider.on("input", function() {
        var minValue = parseInt(minPriceSlider.val());
        var maxValue = parseInt(maxPriceSlider.val());
        if (maxValue < minValue) {
            minPriceSlider.val(maxValue);
            $("#minpricevalue").text(minValue);
        }
        $("#maxpricevalue").text(maxValue);
    });
}

$(document).ready(init);