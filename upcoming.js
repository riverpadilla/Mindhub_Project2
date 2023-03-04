
let cardsTemplate = '';
for (let event of data.events){
    if (event.date > data.currentDate){
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
}
document.getElementById('upcomingCards').innerHTML=cardsTemplate;




