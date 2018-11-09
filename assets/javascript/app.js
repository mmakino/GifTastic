/*
  == GifTastic ==
  * Use the GIPHY API to make a dynamic web page that populates with gifs
*/

//
// Theme Buttons
//
class Theme {
  constructor() {
    this.topics = this.defaultTopics();
  }

  //
  // Initial default topics
  //
  defaultTopics() {
    return ['dog', 'cat', 'bear', 'tiger', 'elephant', 'giraffe']
  }

  //
  // Create a new button with the name
  // <button topic=name type="button" class="btn btn-info btn-sm">name</button>
  //
  aNewButton(name) {
    let button = $("<button>");
    button.attr("topic", name);
    button.attr("type", "button");
    button.addClass("btn btn-info btn-sm m-1");
    button.addClass("search-topic");
    button.text(name);

    return button;
  }

  //
  // Populate the header with buttons of topics
  //
  populateButtons() {
    $("#topic-buttons").empty();
    this.topics.forEach((topic) => {
      $("#topic-buttons").append(this.aNewButton(topic));
    });
  }

  //
  //  Add a new topic
  //
  addTopic(event) {
    let self = event.data;
    let newTopic = $("#new-topic").val().trim();

    event.preventDefault();

    if (!self.theme.topics.includes(newTopic.toLowerCase()) && newTopic.length !== 0) {
      let button = self.theme.aNewButton(newTopic);

      self.theme.topics.push(newTopic);
      button.bind("click", self, self.searchTopic);
      $("#topic-buttons").append(button);
      $("#new-topic").val("");

      return true;
    }

    return false;
  }
}

//
// A class for using GIPHY API
//
class Giphy {
  constructor() {
    this.url = 'https://api.giphy.com/';
    this.search = 'v1/gifs/search?';
    this.apiKey = 'GQKXP5s0SrfYcb9Q2OjQRd6CCHUL19qj';
  }

  //
  // Construct a search query string
  //
  queryString(item, limit = 10) {
    return this.url + this.search + [`api_key=${this.apiKey}`,
      `q=${item.replace(/\s+/g, '+')}`,
      `limit=${limit}`
    ].join('&');
  }

  //
  // Retrieve images from Giphy
  //
  fetchGIF(item, numImages = 10) {
    let queryURL = this.queryString(item, numImages);

    console.log('query string: ' + queryURL);

    $.ajax({
      url: this.queryString(item, numImages),
      method: 'GET'
    }).then((response) => {
      this.displayImages(response);
    });
  }

  //
  // Display returned images to #img-section
  //
  displayImages(response, clearBefore = true) {
    let records = response.data;

    // console.log(records);

    if (clearBefore) {
      $("#img-section").empty();
    }
    records.forEach((item) => {
      $("#img-section").prepend(this.aNewImgElem(item));
    });
    $(".gif").on("click", this.toggleImg);
  }

  //
  // Construct a new image element
  //
  aNewImgElem(item) {
    let div = $('<div>');
    let h3 = $('<h3>');
    let img = $('<img>');

    div.addClass('image-item float-left');
    h3.text(`Rating: ${item.rating.toUpperCase()}`);
    img.attr('src', item.images.fixed_height_still.url);
    img.attr('still-gif', item.images.fixed_height_still.url);
    img.attr('animate-gif', item.images.fixed_height.url);
    img.attr('alt', 'animal image');
    img.addClass('gif rounded float-left m-1');
    div.append(h3).append(img);

    return div;
  }

  //
  // Toggle btw still and animated images
  //
  toggleImg() {
    let currentImg = $(this).attr('src');

    if (currentImg === $(this).attr('still-gif')) {
      $(this).attr('src', $(this).attr('animate-gif'));
    } else if (currentImg === $(this).attr('animate-gif')) {
      $(this).attr('src', $(this).attr('still-gif'));
    }
  }
}

//
// A main app wrapper class
//
class GifTastic {
  constructor() {
    this.giphy = new Giphy();
    this.theme = new Theme();
  }

  //
  // Run GifTastic app
  //
  run() {
    this.theme.populateButtons();
    $("#add-topic").on("click", this, this.theme.addTopic);
    $(".search-topic").on("click", this, this.searchTopic);
  }

  //
  // search-topic button event handler to query Giphy 
  //
  searchTopic(event) {
    let topic = $(this).attr("topic");
    let self = event.data;

    console.log("Search Topic: " + topic);
    self.giphy.fetchGIF(topic, 10);
  }

}