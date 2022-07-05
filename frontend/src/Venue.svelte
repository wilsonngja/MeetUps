<script>
    import config from "./config.json";
    import VenueInfo from "./backend/database/venues.json";

    let day;
    let startTime;
    let endTime;
    let venue_slot = [];
    var buttons = "";
    let map_center = { lat: 1.297, lng: 103.776 };
    var selected_sem_venue = "Semester 1";
    var loading = false;
    var week;
    var weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];

    var errorMessage_empty_field = "";
    var errorMessage_wrong_input = "";
    var errorMessage_no_rooms = "";

    const apiURL = config["API_LINK"];
    let long = "1.2966";
    let lat = "103.7764";
    let url = "";

    $: if (
        selected_sem_venue == "Semester 1" ||
        selected_sem_venue == "Semester 2"
    ) {
        weeks = [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6",
        "Week 7",
        "Week 8",
        "Week 9",
        "Week 10",
        "Week 11",
        "Week 12",
        "Week 13",
        ];
    } else {
        weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
    }
    // let url = "http://maps.google.com/maps?q=1.2966,103.7764"; // Default Map location.
    //This function does an API call for the Google Map

    //Add
    async function getMap({ venue }) {
        //reset the values before search
        url = "";
        long = "1.2966";
        lat = "103.7764";

        if (
        VenueInfo[venue] == null ||
        VenueInfo[venue].location.y == null ||
        VenueInfo[venue].location.x == null
        ) {
        alert("Currently unable to display location on Google Map.");
        } else {
        long = VenueInfo[venue].location.y;
        lat = VenueInfo[venue].location.x;

        //Find Json File and , modify and extract out venue data
        alert("Close this pop up to view " + venue + "'s location.");
        url = "http://maps.google.com/maps?q=" + long + "," + lat;

        window.open(url);
        }
    }

    // This function does an API call for venue
    async function getVenue() {
        errorMessage_empty_field = "";
        errorMessage_wrong_input = "";
        errorMessage_no_rooms = "";
        venue_slot = [];

        if (
        startTime == "" ||
        endTime == "" ||
        startTime == undefined ||
        endTime == undefined
        ) {
        if (
            (startTime == "" || startTime == undefined) &&
            endTime != "" &&
            endTime != undefined
        ) {
            errorMessage_empty_field = "Please fill in the start time.";

            if (endTime.match("\\d{4}") != endTime) {
            errorMessage_wrong_input =
                "Please insert only 4 digits for the end time.";
            }
        } else if (
            (endTime == "" || endTime == undefined) &&
            startTime != "" &&
            startTime != undefined
        ) {
            errorMessage_empty_field = "Please fill in the end time.";

            if (startTime.match("\\d{4}") != startTime) {
            errorMessage_wrong_input =
                "Please insert only 4 digits for the start time.";
            }
        } else if (
            (startTime == "" || startTime == undefined) &&
            (endTime == "" || endTime == undefined)
        ) {
            errorMessage_empty_field = "Please fill in the start and end time.";
        }
        } else {
        if (
            startTime.match("\\d{4}") != startTime &&
            endTime.match("\\d{4}") == endTime
        ) {
            errorMessage_wrong_input =
            "Please insert only 4 digits for the start time.";
        } else if (
            startTime.match("\\d{4}") == startTime &&
            endTime.match("\\d{4}") != endTime
        ) {
            errorMessage_wrong_input =
            "Please insert only 4 digits for the end time.";
        } else if (
            startTime.match("\\d{4}") != startTime &&
            endTime.match("\\d{4}") != endTime
        ) {
            errorMessage_wrong_input =
            "Please insert only 4 digits for the start and end time.";
        } else {
            loading = true;

            const response = await fetch(apiURL, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "venue",
                semester: selected_sem_venue,
                req_week: week,
            }),
            });
            var data = await response.json();
            buttons = "";
            for (let i = 0; i < data["result"].length; i += 1) {
            for (
                let j = 0;
                j < data["result"][i]["Availability Timeslot"].length;
                j += 1
            ) {
                if (
                data["result"][i]["Availability Timeslot"][0][0] <= startTime &&
                data["result"][i]["Availability Timeslot"][0][1] >= endTime &&
                data["result"][i]["Day"] == day
                ) {
                if ((data["result"][i]["Availability Timeslot"][0][0] != "0800") || (data["result"][i]["Availability Timeslot"][0][1] != "2359"))
                {
                    if (!venue_slot.includes(data["result"][i]["Venue"])) 
                    {
                    venue_slot.push(data["result"][i]["Venue"]);
                    venue_slot = [...venue_slot];
                    
                    }
                }
                }
            }
            }

            if (venue_slot.length == 0)
            {
            
            errorMessage_no_rooms = "There are no rooms available.";
            } else {
            
                venue_slot.sort();
                for (let i = 0; i < venue_slot.length; i += 1) {
                    buttons +=
                    "<button class='VenueButton' id = '" +
                    venue_slot[i] +
                    "'>" +
                    venue_slot[i] +
                    "</button>";
                    // buttons += "<button class='VenueButton' id = '{ venue_slot[i]} '>" + venue_slot[i] + "</button>";
                }
            }
            loading = false;
        }
        }
    }
</script>


<div class = " text-center">
    <div class="font-extrabold 2xl:mt-40 2xl:mb-10 xl:mt-40 xl:mb-10 lg:mt-32 lg:mb-5 mt-16 mb-2">
        <span class=" 2xl:text-8xl lg:text-8xl md:text-7xl text-6xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-sky-500" ><strong>Venue Search</strong></span>
    </div>
    <p class=" font-extrabold text-gray-400 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center ">This function allows you to search for available venues in the specified time range</p>
    <p class=" font-extrabold text-gray-400 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center ">Start Time should be 0800 hrs or after. </p>
    <p class="font-extrabold text-gray-400 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center mb-5">End Time should be before 0000. </p>

    <div class = "grid grid-cols-1 justify-items-center">
        
        <div class= "grid grid-cols-2">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="text-end mr-4"><strong>Semester</strong></label>
            <select bind:value={selected_sem_venue} class ="text-sm border border-gray-300 bg-[#202124] text-white text-md rounded-lg border-2 block  h-8 max-h-full focus:outline-none focus:border-sky-500 my-0.5 ">
                <option>Semester 1</option>
                <option>Semester 2</option>
                <option>Special Term 1</option>
                <option>Special Term 2</option>
            </select>
        </div>

        <div class= "grid grid-cols-2">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="text-end mr-4"><strong>Week</strong></label>
            <select bind:value={week} class ="border border-gray-300 bg-[#202124] text-white text-sm rounded-lg border-2 block h-8 focus:outline-none focus:border-sky-500 my-0.5 text-md">
                {#each weeks as week_num}
                <option >{week_num}</option>
                {/each}
            </select>
        </div>

        <div class = "grid grid-cols-2">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="text-end mr-4"><strong>Day</strong></label>
            <select bind:value={day}   class ="border border-gray-300 bg-[#202124] text-md text-white rounded-lg border-2 block h-8 focus:outline-none focus:border-sky-500 my-0.5">
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
            </select>
        </div>


        <div class = "grid grid-cols-2">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="text-end mr-4"><strong>Start Time</strong></label>
            <input class ="border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-500 " bind:value={startTime} placeholder=" 0800"  required/>
        </div>

        <div  class = "grid grid-cols-2">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="text-end mr-4"><strong>End Time</strong></label>
            <input  class ="border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-500" bind:value={endTime} placeholder=" 2359" required />
        </div>

        <div class = "grid grid-cols-1">
            <button on:click={getVenue} class ="my-2 py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"><strong>Find Venue</strong></button>
        </div>

        {#if loading}
            <img src="loading_bar.svg" alt=""/>
        {/if}

        
        
        <h3 class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"><strong>{errorMessage_empty_field}</strong></h3>
        <h3 class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"><strong>{errorMessage_wrong_input}</strong></h3>
        <h3 class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"><strong>{errorMessage_no_rooms}</strong></h3>
        <br />
    </div>
</div>

<div class = "grid 2xl:grid-cols-10 xl:grid-cols-8 lg:grid-cols-8 grid-cols-6">
    {#each venue_slot as venue}
        <button class = "VenueButton py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white"
        contenteditable="false"
            on:click={() => getMap({ venue })}
        >
        {venue}
        </button>
    {/each}
</div>





<style>
  

  .VenueButton {
    /* background: #202124; */
   
    font-size: 1em;
    padding: 8px 12px;
    border-radius: 2px;
    text-align: center;
    border:none;
  }

  


  :global(.button_div) {
    justify-content: center;
    text-align: center;
  }

 

 

  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  label{
    color: white;
  }

 

  label{
    margin-top: 5%;
  }

  input{
    background-color: #202124;
    margin-top: 5%;
    color: white;
  }

  
</style>