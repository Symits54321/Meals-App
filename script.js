
// Basic id fetched for use
let searchInput = document.querySelector('#input-text');
let searchSuggestion = document.querySelector('#dropdown>ul');


// let favorites=[];
// // let meals=[];

//-----------------API fetching-------------------

const API_URL = 'https://www.themealdb.com/api/json/v1/1/';


let fav = JSON.parse(localStorage.getItem("favorites")) || [];





//-----------********------FUNCTIONS-------*******------------




// this function manages display meals in list form below search box (as Google does)
async function displaySearchList(meals){

    searchSuggestion.innerHTML = '';
        
        meals.forEach(item => {    

            let list = document.createElement('LI');
            list.setAttribute('id', item.idMeal);
                list.innerHTML = `

                    <div class="list-image" id="${item.idMeal}"style="background-image:url(${item.strMealThumb});"></div>

                    <div class="list-name" id="${item.idMeal}">${item.strMeal}</div>
                    <div class="list-category" id="${item.idMeal}">${item.strCategory}</div>
                    <div class="list-fav" id="${item.idMeal}" style=" cursor: pointer;">Add favorites</div>
                
                `;
        
            searchSuggestion.appendChild(list);
        });


}

// filter  meals objects with its idname letter substring same as 'text' string.. ('text' is the input text of searchinput)
async function filterMeals(meals,text){
       
    let filteredMeals = await meals.filter(m => 
        m.strMeal.substring(0,text.length).toLowerCase() === text.toLowerCase());

    return filteredMeals;

}

// gives meal object from API (having meals name starting with first letter of searchinput) and diplay management
async function giveSuggestion(text){

    let dataFetchedFirstLetter = await fetch(`${API_URL}search.php?f=${text.charAt(0)}`);
    let data = await dataFetchedFirstLetter.json();
    let meals = await filterMeals(data.meals,text);

    displaySearchList(meals);



}

// this function manages displaying favorate items (from local storage)
async function displayfavList(){
    let favorateList = document.querySelector('#fav-list>ul');
    fav = JSON.parse(localStorage.getItem("favorites")) || [];
  
    


   
    let favMealsId = fav;
    favorateList.innerHTML = '';
    for (let itemId of favMealsId) {
        let eachFavMealFetched =  await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${itemId}`);
        let eachFavMealJson = await eachFavMealFetched.json();
        let item = eachFavMealJson.meals[0];

        let list = document.createElement('LI');
        list.setAttribute('id', item.idMeal);
        list.innerHTML = `
            <div class="fav-list-image" id="${item.idMeal}" style="background-image: url(${item.strMealThumb});"></div>

            <div class="fav-list-name" id="${item.idMeal}"> ${item.strMeal} </div>
            <div class="fav-list-category" id="${item.idMeal}"> ${item.strCategory} </div>
            <div class="fav-list-removebtn" id="${item.idMeal}" style=" cursor: pointer;">  </div>
        `;
       
        favorateList.appendChild(list);
    }
}

// these function deletes  favourates(having id='mealid') from localstorage
async function deletefav(mealId){

    // Fetch the favorite meals present in local storage in an array form
         let storageFetched = localStorage.getItem("favorites");

    // If favorites is empty then add new array or else parse the array 
           let storage = storageFetched ? JSON.parse(storageFetched) : [];
 
    // Remove the meal from storage
          storage = storage.filter(id => id !== mealId);

          //stringify storage

          strstorage=JSON.stringify(storage)
 
    // Update local storage  
          localStorage.setItem("favorites", strstorage);
}



// this function add meals id to local storage
function addfav(mealId){

    // Fetched the favorate meals present in local storage in an array form
           let storageFetched = localStorage.getItem("favorites");

   // If favorates is empty then add new array or else parse the array 
           let storage = storageFetched ? JSON.parse(storageFetched) : [];
 
   // Add new meal in storage
            if(!storage.includes(mealId)){
                        storage.push(mealId);
            }

   // Update local storage  
           localStorage.setItem("favorites",JSON.stringify(storage));

}

// this function creates meal page for Mealdetail.html for the corresponding mealid='id'.
async function createMealPage(id){
    let mealNamingArea = document.querySelector('nav');
    let mealCentralArea = document.querySelector('#mealmiddlesection');
    let mealBottomArea = document.querySelector('#meal-bottom-section');

    let mealFetchedById =  await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let mealFetchedByIdJson = await mealFetchedById.json();
    let meal = mealFetchedByIdJson.meals[0];

   

            mealNamingArea.innerHTML=`
            <div id="back-button">Home</div>
            <div id="meal-name">${meal.strMeal}</div>
            `;


            mealCentralArea.innerHTML=`
            <div id="meal-image" style="background-image: url(${meal.strMealThumb});"></div>
         <div id="meal-detail">
            <ul>
                <li>
                    Category &nbsp; <span>${meal.strCategory}</span> 
                </li>
                <li>
                Area&emsp;&emsp;&nbsp; <span>${meal.strArea}</span>
                </li>
                <li>
                Tags&emsp;&emsp;&nbsp;&nbsp;<span>${meal.strTags}</span> 
                </li>
                <li>
                    <div id="youtube-link-button">
                       <a href="${meal.strYoutube}"> Watch on Youtube
                       </a>
                    </div>
                </li>
            </ul>
         </div>
            `;


            mealBottomArea.innerHTML=`
            <h3>Instruction</h3>
            <div id="meal-instruction">
              <p>${meal.strInstructions}</p>
            </div>
            `;
    
    
    


}




//--------*************---- Eventlisteners -------******************-----




// Event listener function for search input
if(searchInput){
searchInput.addEventListener('keyup', async (e) => {

    let inputText = e.target.value;

    if(inputText){
        let meals = await
        giveSuggestion(inputText);
    }else{
        searchSuggestion.innerHTML = ''; 
    }
   
});
}



//Event Listener function for mouseclicks
function allInputClick(e){
   
   
    let clicked = e.target;

    // favorite button
    if (clicked.classList.contains('list-fav')) {
        let favId = clicked.id;
        addfav(favId);
        clicked.style.backgroundColor = '#d40303';
        console.log(favId);
      }

    // My favorate page button  

      if(clicked.id === 'myfav'){
        // Open new webpage /favorites.html
        window.location.href = "./favorites.html";
        
      }

    // back button  

      if(clicked.id === 'back-button'){
        // Open new webpage /favorites.html
        window.location.href = "./index.html";
      }
    

    // remove button
    
    if (clicked.classList.contains('fav-list-removebtn')) {
        //fetched the id to be removed
        let removeId =  clicked.id;
        //then delete 
        deletefav(removeId).then(                 
             //then refresh
             displayfavList()
            );
    }

     // Mealdetailpage Open
     if((clicked.parentNode.tagName === 'LI' || clicked.tagName === 'LI') && !clicked.classList.contains('list-fav') ){ 

        if(clicked.classList.contains('fav-list-removebtn')){
            return;
        }
        // open mealdetail.html page
          ( async ()=> {
            if(searchInput){
            searchInput.value="";
            }

            
            window.location.href = `./mealdetail.html?id=${clicked.id}`;
            let params = new URLSearchParams(window.location.search);
           
            console.log("refered");
          })();
       
        
    }
    
    
   
           
            
        
     

    
    console.log(clicked);

}


//Actual event listener on click
document.addEventListener('click',allInputClick);





//---------*******-------Miscellaneous------********--------

// onload only in favorites.html page
if(document.getElementById('favorite-page')){

    window.onload =  function() {
        displayfavList();
    }
}

// onload only in mealdetail.html page
if(document.querySelector('#mealmiddlesection')){

    window.onload =  function() {
        let params = new URLSearchParams(window.location.search);
        let id = params.get('id');
        createMealPage(id);
    }
}

//   Checks if internet is connected or not (if no internet nothing 
// can be fetched from api and the required pages will be null)
setInterval(function() {
    if(!navigator.onLine) {
        alert('You are not connected to the internet.');
    }
}, 2000);

