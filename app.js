var config = {
    apiKey: "AIzaSyAaW6YuY2DQu7QmlEyW8tZo7zViT7_9rZg",
    authDomain: "train-tracker-2ee14.firebaseapp.com",
    databaseURL: "https://train-tracker-2ee14.firebaseio.com",
    projectId: "train-tracker-2ee14",
    storageBucket: "train-tracker-2ee14.appspot.com",
    messagingSenderId: "126093210825"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function () {

    var currentTime = moment();

    // when the submit button is clicked, grab the inputs and push to Firebase
    $('#submit-train-info').on("click", function (event) {
        event.preventDefault();

        // Grabs user inputs
        var trainName = $('#train-name-input').val().trim();
        var destination = $('#train-destination-input').val().trim();
        var firstTrainTime = moment($('#first-train-time-input').val().trim(), "hh:mm a").format("hh:mm a");
        var trainFrequency = moment($('#train-frequency-input').val().trim(), "mm").format("mm");

        // Creates local "temporary" object for holding new train data
        var newTrain = {
            name: trainName,
            destination: destination,
            start: firstTrainTime,
            frequency: trainFrequency
        };

        // pushes new train data to the database
        database.ref().push(newTrain);
    });

    // creates the newest data row from storage and adds to html
    database.ref().on("child_added", function (childSnapshot) {
        
        // grabbing the snapshots from Firebase
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var firstTrainTime = childSnapshot.val().start;
        var trainFrequency = childSnapshot.val().frequency;

        // calculates next arrival less than the current time
        var nextArrival = moment(firstTrainTime, "HH:mm");
        while (nextArrival < currentTime) {
            nextArrival.add(trainFrequency, "minutes");
        }

        // calculate the minutes until the next train (from the current time)
        var minutesAway = nextArrival.diff(currentTime, "minutes");

        // create the newest data row
        var newRow = $('<div class="row">').append(
            $('<div class="col-md-3">').text(trainName),
            $('<div class="col-md-3">').text(destination),
            $('<div class="col-md-2">').text(trainFrequency),
            $('<div class="col-md-2">').text(nextArrival.format("hh:mm a")),
            $('<div class="col-md-2">').text(minutesAway),
        );

        // appending your new train row to the card-body container
        $('#upcoming-trains').append(newRow);
    });
});