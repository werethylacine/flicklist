

var model = {
  watchlistItems: [],
  browseItems: []
}


var api = {

  root: "https://api.themoviedb.org/3",
  token: "a910d1e0bc83771f71769959aaaa9506", //api key

  /**
   * Given a movie object, returns the url to its poster image
   */
  posterUrl: function(movie) {
    // TODA 4b
    // implement this function
    url = "http://image.tmdb.org/t/p/w300/" + movie.poster_path;
    console.log(url);
    return url;
    //return "http://images5.fanpop.com/image/photos/25100000/movie-poster-rapunzel-and-eugene-25184488-300-450.jpg"
  }
}


/**
 * Makes an AJAX request to themoviedb.org, asking for some movies
 * if successful, updates the model.browseItems appropriately, and then invokes
 * the callback function that was passed in
 */
function discoverMovies(callback) {
  $.ajax({
    url: api.root + "/discover/movie",
    data: {
      api_key: api.token
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
      //console.log(response);
    }
  });
}


/**
 * Makes an AJAX request to the /search endpoint of the API, using the
 * query string that was passed in
 *
 * if successful, updates model.browseItems appropriately and then invokes
 * the callback function that was passed in
 */
function searchMovies(query, callback) {
  $.ajax({
    url: api.root + "/search/movie",
    data: {
      api_key: api.token,
      query: query
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
    }
  });
}


/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {

  // clear everything
  $("#section-watchlist ul").empty();
  $("#section-browse ul").empty();

  // insert watchlist items
  model.watchlistItems.forEach(function(movie) {
    var title = $("<h6></h6>").text(movie.original_title);
    console.log(movie);
    // TODA 1
    // add an "I watched it" button and append it below the title
    // Clicking should remove this movie from the watchlist and re-render
    var watchedButton = $("<button>I watched it</button>")
    .click(function() {
      var index = model.watchlistItems.indexOf(movie);
      model.watchlistItems.splice(index, 1);
      render();
    });
    title.append(watchedButton);

    // TODA 2i
    // apply the classes "btn btn-danger" to the "I watched it button"
    watchedButton.addClass("btn btn-danger");

    // TODA 4a
    // add a poster image and append it inside the
    // panel body above the button
    var posterIMG = $("<img></img>").attr("src", api.posterUrl(movie));

    // TODA 2g
    // re-implement the li as a bootstrap panel with a heading and a body
    var itemView = $("<li></li>")
      .attr("class", "item-watchlist")


    var panelDiv = $("<div class='panel panel-default'></div>");
    var panelHead = $("<div class='panel-heading'></div>").text(movie.original_title);
    var panelBody = $("<div class='panel-body'></div>").append(posterIMG).append(watchedButton);

    panelDiv.append(panelHead);
    panelDiv.append(panelBody);
    itemView.append(panelDiv);

    $("#section-watchlist ul").append(itemView);
  });

  // insert browse items
  model.browseItems.forEach(function(movie) {

    // TODA 2d continued
    // style this list item to look like the demo
    // You'll also need to make changes in index.html.
    // use the following BS classes:
    // "list-group", "list-group-item", btn", "btn-primary",

    var title = $("<h4></h4>").text(movie.original_title);

    var button = $("<button class='btn btn-primary'></button>")
      .text("Add to Watchlist")
      .click(function() {
        model.watchlistItems.push(movie);
        render();
      })
      .prop("disabled", model.watchlistItems.indexOf(movie) !== -1);

    var overview = $("<p></p>").text(movie.overview);

    // append everything to itemView, along with an <hr/>
    var itemView = $("<li class='list-group-item'></li>")
      .append(title)
      .append(overview)
      .append(button);

    // append the itemView to the list
    $("#section-browse ul").append(itemView);
  });

}


// When the HTML document is ready, we call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function() {
  discoverMovies(render);
});
