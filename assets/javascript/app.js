/*
  == GifTastic ==
  * Use the GIPHY API to make a dynamic web page that populates with gifs
*/

//
// Topics Buttons
//
class Topics {
  constructor() {
    this.topics = this.defaultTopics();
  }

  //
  // Initial default topics
  //
  defaultTopics() {
    return ['dog', 'cat', 'rabbit', 'mouse', 'bear', 'tiger', 'elephant',
      'giraffe', 'lion', 'penguin', 'flamingo', 'sea lion', 'bold eagle'
    ]
  }

  //
  // Create a new button with the name
  // <button topic=name type="button" class="btn btn-info btn-sm">name</button>
  //
  aNewButton(name) {
    let button = $("<button>");
    button.attr("topic", name);
    button.attr("type", "button");
    button.addClass("btn btn-info btn-sm topic");
    button.text(name);

    return button;
  }

  //
  // Populate the header with buttons of topics
  //
  populateButtons() {
    this.topics.forEach((topic) => {
      $("#topic-buttons").append(this.aNewButton(topic));
    });
  }

  //
  //  Add a new topic
  //
  addTopic(event) {
    let self = event.data;
    event.preventDefault();
    let newTopic = $("#new-topic").val().trim();

    if (!self.topics.includes(newTopic.toLowerCase())) {
      self.topics.push(newTopic);
      $("#topic-buttons").append(self.aNewButton(newTopic));
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
  searchQuery(item, limit = 10) {
    return this.url + this.search + 
    [`api_key=${this.apiKey}`,
      `q=${item}`,
      `limit=${limit}`
    ].join('&');
  }
}

//
// Run GifTastic app
//
function runTheApp() {
  let topics = new Topics();
  let giphy = new Giphy();

  topics.populateButtons();

  $(".topic").on("click", function () {
    var topic = $(this).attr("topic");
    alert(topic);
  });

  $("#add-topic").on("click", topics, topics.addTopic);
}