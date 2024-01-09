const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const imageshow = document.querySelector(".error-img");

let currentTab = userTab;
let API_KEY = "aa6e4adb9401f1a5f7e2e245cdd7aadc";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=  clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            imageshow.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove('active');
            imageshow.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click" ,() =>{
    //pass clicked tab as input
    switchTab(userTab);
});

searchTab.addEventListener("click" , () =>{
    switchTab(searchTab);
});

//check if coordinates are already present in local storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
        if(!localCoordinates){
            grantAccessContainer.classList.add("active");
        }
        else{
            const coordinates = JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);

        }
}


 async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const res = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        const data = await res.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-watherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText =weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} % `;
}

function  getlocation(){

    if (navigator.geolocation) {
        console.log("entered get locaton1");
        navigator.geolocation.getCurrentPosition(showPosition);
        
      } else {
         //handle hte alse
      }
    }
    
    function showPosition(position) {
        const userCoordinates ={
      lat :  position.coords.latitude ,
      lon : position.coords.longitude,
        }

        sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
        console.log("entered get locaton 2");
        fetchUserWeatherInfo(userCoordinates);
    }

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getlocation);

let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" ,(e) =>{
    e.preventDefault();
    let cityName = searchInput.value;
    console.log(cityName);
    if(cityName==="") return ;

    else 
     fetchSearchWeatherInfo(cityName);

})


console.log(imageshow);

function render404page(){
    console.log("entered error");
    loadingScreen.classList.remove("active");
    imageshow.classList.add("active");
}

async function fetchSearchWeatherInfo(city){
     
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessButton.classList.remove("active");
        imageshow.classList.remove("active");

        try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            if(response.status != 200){
                render404page();
                return ;
            }

            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
        catch(err){

        }

}










// async function showWeather(){
//     let latitude = 15.3333;
//     let longitide = 16.333;

//     let city="goa";
    

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//         const data = await response.json();

//         console.log(data);
// }









