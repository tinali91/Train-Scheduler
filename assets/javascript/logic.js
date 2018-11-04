// Initialize Firebase
var config = {
    apiKey: "AIzaSyChCI2Lnhzo8j6aB11uBOprtP8Y0mOx3mI",
    authDomain: "train-scheduler-8b421.firebaseapp.com",
    databaseURL: "https://train-scheduler-8b421.firebaseio.com",
    projectId: "train-scheduler-8b421",
    storageBucket: "train-scheduler-8b421.appspot.com",
    messagingSenderId: "495966873103"
};

firebase.initializeApp(config);

var database = firebase.database();

//Setting global variables
var trainName = "";
var destination = "";
var firstTime = "";
var frequency = "";

//Setting up event listener for when someone submits a new train
$("#submitBtn").on("click", function(event) {
    event.preventDefault();

    trainName = $("#newTrainName").val().trim();
    destination = $("#newDestination").val().trim();
    firstTime = $("#firstTrainTime").val().trim();
    frequency = $("#newFrequency").val().trim();

    //push to database
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    });
});

// Firebase watcher and initial loader
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTime);
    console.log(childSnapshot.val().frequency);
    
    var firstTime = childSnapshot.val().firstTime;
    var freqency = childSnapshot.val().frequency;

    //First Time
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    //Current Time
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));

    //Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in Time: " + diffTime);

    //Time apart
    var tRemainder = diffTime % freqency;
    console.log(tRemainder);

    //Minutes until train
    var minutesTillTrain = freqency - tRemainder;
    console.log("Minutes till train: " + minutesTillTrain);

    //Next Train
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

    //populating items in the table
    $("tbody").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().destination + "</td><td>" + freqency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + minutesTillTrain + "</td></tr>")
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

