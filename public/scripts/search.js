$('#restaurant-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/restaurants?' + search, function(data) {
    $('#restaurant-grid').html('');
    data.forEach(function(restaurant) {
      $('#restaurant-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ restaurant.image }">
            <div class="caption">
              <h4>${ restaurant.name }</h4>
            </div>
            <p>
              <a href="/restaurants/${ restaurant._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#restaurant-search').submit(function(event) {
  event.preventDefault();
});