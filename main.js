// Llamado a funcion categories() y se inyecta valor retornado a HTML




function categories(){

    let listCategories = categoryList();

    let categoriesTemplate = '';
    let checkId;
    let labelId;
    let i=0;
    for (const category of listCategories){     
        checkId="checkBoxId"+i;
        labelId="checkLabelId"+i;
        categoriesTemplate += `
        <div class="form-check col-4">
        <input class="form-check-input" 
            type="checkbox" 
            value=${i} 
            id=${checkId}>
            <label class="form-check-label" id=${labelId} for=${checkId}>
                ${category}
            </label>
        </div>
        `
        i+=1;
    }

    return categoriesTemplate;
}



function searchBar(){

    let searchBarStr=
    `
    <input class="form-control border-end-0 rounded-end-0 pe-0"
        type="text" 
        placeholder="Search  by Event's Name" 
        aria-label="Search" 
        spellcheck="false" 
        data-ms-editor="true"
        aria-describedby="search"
        id="searchInput">
    <button class="btn bg-dark text-white rounded-start-0 py-0" type="button" title="btn-search" id="searchBtn">
        <i class="fa-solid fa-magnifying-glass fa-lg"></i>
    </button>
    `

    return searchBarStr
}



//Funcion que 
function cardList(eventType){

    const allEvents = data.events;
    let filteredEvents=[];
    
    switch (eventType){
        case "web1":
            filteredEvents = allEvents.filter(oneEvent => oneEvent.date < data.currentDate)
            break;
        case "web2":
            filteredEvents = allEvents.filter(oneEvent => oneEvent.date > data.currentDate)
            break;
        default:
            filteredEvents = allEvents;
        }

    return filteredEvents
}

function eventsCards(){

    let TitleId = document.querySelector('main').id;
    let filteredEvents=[]

    filteredEvents = cardList(TitleId)

    filteredEvents = categoryFilter(filteredEvents);

    filteredEvents = searchFilter(filteredEvents);


    let cardsTemplate = '';

    for (let event of filteredEvents){

            cardsTemplate += 
            `
            <div class="card col-2" id="cardID_${event._id}">
                <img src=${event.image} class ="card-img-top" height=40%>
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text">${event.description}</p>
                    <div class="d-flex align-middle justify-content-between">
                        <span class="price">Price: ${event.price}</span>
                        <a href="details.html?id=${event._id}" class="btn btn-danger" id="buttonID_${event._id}">View Details</a>
                    </div>
                </div>
            </div>
            `
    }

    return cardsTemplate;
}

function categoryList(){

    let listCategories=[];

    for (let event of data.events){
        listCategories.push(event.category);
    }

    listCategories = new Set(listCategories);

    return listCategories;
}

function categoryFilter(filteredEvents){

    let newfilteredEvents=filteredEvents;
    const categoryNode = document.querySelectorAll('.form-check-input');
    
    const check = Array.from(categoryNode).some(category => category.checked);
    
    if (check){
        newfilteredEvents=[];
        let tempEvents=[]
        for(category of categoryNode){
            tempEvents = filteredEvents.filter(events =>{
                if ((category.checked) && (events.category==category.labels[0].innerText)){
                    return true
                } else {
                    return false
                }
            })
            newfilteredEvents=newfilteredEvents.concat(tempEvents);
        } 
    }
          
    return newfilteredEvents
}

function searchFilter(filteredEvents){
    
    let newfilteredEvents = filteredEvents;
    let searchCheck=false;
    if (searchInput.value){
        let searchStr='';
        let searchTarget=searchInput.value.toLowerCase();

        newfilteredEvents = filteredEvents.filter(events =>{
            searchStr=events.name.toLowerCase();
            searchCheck=searchStr.indexOf(searchTarget);
            if(searchCheck!=-1){
                return true
                
            }else {
                return false
                
            }
        })
    }
    return newfilteredEvents;
}


function drawCards(){
    document.getElementById('eventsCards').innerHTML=eventsCards();
}

function eventDetails(cardId){

    const detailedEvent = data.events.filter(dEvent => dEvent._id==cardId)[0];
    console.log(detailedEvent); 
    detailsStr=
        `
        <div class="container-fluid d-flex row justify-content-center gap-2">
            <div class="card details-card d-flex justify-content-center col-5">
                <img src="${detailedEvent.image}" class="img-fluid" alt="${detailedEvent.name}" >
            </div>
            <div class="card details-card d-flex col-5">
                <div class="card-body border border-3 border-danger rounded">
                    <h5 class="card-title">${detailedEvent.name}</h5>
                    <p>Date: ${detailedEvent.date}</p>
                    <p>Description: ${detailedEvent.description}</p>
                    <p>Category: ${detailedEvent.category}</p>
                    <p>Place:${detailedEvent.place}</p>
                    <p>Capacity: ${detailedEvent.capacity} participants</p>
                    <p>Assistence: ${detailedEvent.assistance} participants</p>
                    <p>Price: ${detailedEvent.price}</p>
                </div>
            </div>
        </div>

        ` 
    document.querySelector('main').innerHTML = detailsStr;
}


const TitleId = document.querySelector('main').id;

switch(TitleId){

    case "web0":
    case "web1":
    case "web2":

        document.getElementById('categories').innerHTML = categories();
        document.querySelector('.searchBar').innerHTML = searchBar();
        
        const categoryCheck = document.getElementById('categories');
        const searchInput = document.querySelector('#searchInput');
        const searchBtn = document.querySelector('#searchBtn');
        const eventCards = document.getElementById('eventsCards');
        
        document.getElementById('eventsCards').innerHTML=eventsCards()

        searchBtn.addEventListener('click',drawCards);
        categoryCheck.addEventListener('click',drawCards)
        
        eventCards.addEventListener('click',(e)=> {
            searchInput.value="";
            drawCards()
        });
        break;
    case "web4":
      const queryString = location.search;
      const params = new URLSearchParams(queryString);
      const id=params.get("id");
      eventDetails(id);
}











