$(document).ready(function () {
    console.log("ready!");
    init();
});
function init() {

    var container = $(".container");

    var ghours = new Array();
    // create an array for hours 8am to 6pm in 24hr format
    for (let i = 0; i < 11; i++) {
        ghours.push(800 + (i * 100))
    }

    // boot strap css for input groups === input-group-append input-group-text
    ghours.forEach(element => {
        var slotParentDiv = $("<div>");
        var hourDiv = $("<div>");
        var Input = $("<textarea>");
        var saveBtn = $("<span>");
        var currentDay = $("#currentDay");
        hourDiv.attr("class", "input-group hourDiv");
        slotParentDiv.attr("class", "input-group-prepend parentDiv");
        Input.attr("class", "input-group-text textArea");

        hourDiv.text(element);

        // add the hour to the parent div
        slotParentDiv.append(hourDiv);
        // add textarea to parent div
        slotParentDiv.append(Input);

        // check local storage? call getAppointments()
        var appts = getAppointments();

        // returns array
        var thisHoursAppt = findAppointment(appts, element);
        if (!thisHoursAppt) {
            // do nothing
        } else {
            // got an appt for this hour.
            // append elements so we can see text in the hour.
            Input.val(thisHoursAppt.title);
        }

        // create and add a save button for each hour row.
        saveBtn.attr("class", "input-group-append btn-primary saveBtn");
        // set the ID of savebutton to include the hour.
        saveBtn.text("SAVE");
        currentDay.text(new Date().toDateString());
        // anonymous function keeps the click event from
        // being called on each hour on create!
        saveBtn.click(function () {
            saveButtonClicked(this);
        });

        slotParentDiv.append(saveBtn);

        container.append(slotParentDiv);

        // color corresponding to hour
        // if greater than current hour set color to pink
        var dt = new Date();
        var time = dt.getHours() * 100;
        if (time < element) {
            Input.css("background-color", "#55AC42");
        } if (element === time) {
            Input.css("background-color", "#fff");
        } if (time > element) {
            Input.css("background-color", "#ffcc00");

        }
    })

};

// find an appt by hour.  returns null if not found.
function findAppointment(appts, hour) {
    return appts.find(a => a.hour == hour);
}

// color corresponding to current hour
// save userinput in local storage
function getAppointments() {
    // read from local storage
    // default to empty array if needed.
    // return array
    var dateVariable = new Date().toDateString();
    var appts = JSON.parse(localStorage.getItem("appts" + dateVariable)); // get list of all scores from storage.
    if (!appts) {
        appts = new Array();
    }
    return appts;
}

// save the appt array to storage.
function saveAppointments(appts) {
    // save new array to local storage.
    // return nothing.
    var dateVariable = new Date().toDateString();
    localStorage.setItem("appts" + dateVariable, JSON.stringify(appts));
}



/**
 * 
 * eventSource is the reference to 'this'
 */
function saveButtonClicked(eventSource) {


    // get the title from the clicked save button
    var title = $(eventSource).parent().children("textarea").val();
    // get the current hour (next to textarea) from the clicked save button
    var currentHour = $(eventSource).parent().children(".hourDiv").text();

    // get any existing appts
    var apptList = getAppointments();

    // do we have an appointment for this hour?
    var savedAppt = findAppointment(apptList, currentHour);


    var newAppt = {
        hour: currentHour,
        title: title
    };


    if (savedAppt == null) {
        // new appt
        apptList.push(newAppt);
        saveAppointments(apptList);
    } else {
        // if the saved appt's title matches the  textbox  title, no point in saving anything. ===========================================================
        if (savedAppt.title === title) {
            // SKIP 

        }
        else {

            // loop through the appt list and check for a duplicate, if so, replace it.
            for (let i = 0; i < apptList.length; i++) {
                // if the current appts hour == current hour, remove it. 
                if (apptList[i].hour === currentHour) {
                    // remove it
                    apptList[i] = newAppt;
                    // quit looping.
                    saveAppointments(apptList);
                    break;
                }
            }
        }
    }
}
