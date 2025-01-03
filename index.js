 
const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorScreen=document.querySelector(".error-container")

let oldTab=userTab;
const API_KEY="d54351521414457157debf2d92a3e318";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");
   
    if(!searchForm.classList.contains("active")){
        // kya search form wala container is invisible,if yes then make it visible
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        // main pehle search wale tab pr tha, ab your waether tab visible krna hai
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        // in order to display weather,check local storage first for coordinates,if wer have saved them
        getfromSessionStorage();
    }
    }
}
userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    //pass clicked tab as input paramater
    switchTab(searchTab);
});

// check if coordinates are present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if (!localCoordinates){
        //agar local coordinates nhi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active"); 
    //API call
    try{
        const response=await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        errorScreen.classList.add("active");
    }
}  

function renderWeatherInfo(weatherInfo){
//firstly,we have to fetch the element
  const cityName=document.querySelector("[data-cityName]");
  const countryIcon=document.querySelector("[data-countryIcon]");
  const desc=document.querySelector("[data-weatherDesc]");
  const weatherIcon=document.querySelector("[data-weatherIcon]");
  const temp=document.querySelector("[data-temp]");
  const windspeed=document.querySelector("[data-windspeed]");
  const humidity=document.querySelector("[data-humidity]");
  const cloudiness=document.querySelector("[data-cloudiness]"); 
  //optional chaining operator //?.
  console.log(weatherInfo);
  cityName.innerText=weatherInfo?.name;
  countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText=weatherInfo?.weather?.[0]?.description;
  weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText=`${weatherInfo?.main?.temp}°C`;
  windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText=`${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
} 

function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show alert for no geoloaction support available
    }  
}

function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let cityName=searchInput.value;
    if (cityName==="") return;
    else
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try{
     const response=await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data=await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err){
    errorScreen.classList.add("active");
  }
}