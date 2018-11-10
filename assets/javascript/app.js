/*
  == GifTastic ==
  * Use the GIPHY API to make a dynamic web page that populates with gifs
*/

//
// A main app wrapper class
//
class GifTastic {
  constructor(maxNumRec = 10) {
    this.giphy = new Giphy();
    this.theme = new Theme();
    this.topic = ""; // current topic
    this.limit = maxNumRec;
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
    let self = event.data;
    let topic = $(this).attr("topic");
    let isSameTopic = (topic === self.topic) ? true : false;

    if (topic !== self.topic) {
      self.topic = topic;
      self.offset = 0;
    }

    console.log("Search Topic: " + self.topic);
    self.giphy.fetchGIF(self.topic, self.limit, !isSameTopic);
  }
}

//
// A class for buttons
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
    this.offset = 0;  // offset for fetching images
  }

  //
  // Construct a search query string
  //
  queryString(item, limit = 10) {
    let stmt = this.url + this.search;

    stmt += [
      `api_key=${this.apiKey}`,
      `q=${item.replace(/\s+/g, '+')}`,
      `offset=${this.offset}`,
      `limit=${limit}`
    ].join('&');

    this.offset += limit;

    return stmt;
  }

  //
  // Retrieve images from Giphy
  //
  fetchGIF(item, numImages = 10, clearBefore = true) {
    let queryURL = this.queryString(item, numImages);

    console.log('query string: ' + queryURL);

    $.ajax({
      url: this.queryString(item, numImages),
      method: 'GET'
    }).then((response) => {
      this.displayImages(response, clearBefore);
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
    let img = $('<img>');
    let meta1 = $('<h3>');
    let meta2 = $('<h3>');
    let meta3 = $('<h3>');
    let icon = $("<i>");
    let link = $("<a>"); // for html5 download

    meta1.text(`Title: ${item.title}`);
    meta2.text(`Dimension: W${item.images.original.width} x
                H${item.images.original.height}`);
    meta3.text(`Rating: ${item.rating.toUpperCase()}`);
    icon.addClass("fa fa-download").attr("aria-hidden", "true");
    // link.attr("href", item.images.original.url);
    link.attr("href", item.images.fixed_height_still.url);
    link.attr("download", "giphy.gif");
    link.attr("target", "_blank");
    link.append(icon);
    meta3.append(link);
    // icon.bind("click", () => { window.open(item.images.original.url); });       
    // meta3.append(icon);
    img.attr('src', item.images.fixed_height_still.url);
    img.attr('still-gif', item.images.fixed_height_still.url);
    img.attr('animate-gif', item.images.fixed_height.url);
    img.attr('alt', 'animal image');
    img.addClass('gif rounded float-left m-1');
    div.addClass('image-item float-left');
    div.append(meta1).append(meta2).append(meta3).append(img);

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

