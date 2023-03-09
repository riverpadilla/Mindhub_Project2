
document.getElementById('categories').innerHTML=categoryFilter();

function cardFilter(eventType){
    const allEvents = data.events;
    let filteredEvents=[];
    let cardsTemplate = '';


    switch (eventType){
        case 1:
            filteredEvents = allEvents.filter(oneEvent => oneEvent.date < data.currentDate)
            break;
        case 2:
            filteredEvents = allEvents.filter(oneEvent => oneEvent.date > data.currentDate)
            break;
        default:
            filteredEvents = allEvents;
        }

    console.log(filteredEvents);

    for (let event of filteredEvents){
            cardsTemplate += 
            `
            <div class="card col-2">
                <img src=${event.image} height=40%>
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text">${event.description}</p>
                    <div class="d-flex align-middle justify-content-between">
                        <span class="price">Price: ${event.price}</span>
                        <a href="details.html" class="btn btn-danger">View Details</a>
                    </div>
                </div>
            </div>
            `
    }

    return cardsTemplate;
}

function categoryFilter(){

    let listCategories=[];

    for (let event of data.events){
        listCategories.push(event.category);
    }

    listCategories = new Set(listCategories);

    let categoriesTemplate = '';
    for (const category of listCategories){
        categoriesTemplate += `
        <div class="form-check col-4">
        <input class="form-check-input" type="checkbox" value="" id="flexCheck1">
            <label class="form-check-label" for="flexCheck1">
                ${category}
            </label>
        </div>
        `
    }

    return categoriesTemplate;
}

