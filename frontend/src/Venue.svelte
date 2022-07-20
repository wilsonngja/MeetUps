<script>
  import config from "./config.json";
  import VenueInfo from "../../backend/database/venues.json";

  // Variable Declaration
  let day;
  let clockStartTime;
  let startTime;
  let clockEndTime;
  let endTime;
  let venue_slot = [];
  var buttons = "";
  var selected_sem_venue = "Semester 1";
  var loading = false;
  var week;
  var weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
  var embbed_map = "";
  var element = document.getElementById("VenueID");
  var filterText;
  var active_venue;

  // Error message variable
  var errorMessage_empty_field = "";
  var errorMessage_wrong_input = "";
  var errorMessage_wrong_input2 = "";
  var errorMessage_no_rooms = "";

  // API URL and longtidude and latitude
  const apiURL = config["API_LINK"];
  let long = "1.2966";
  let lat = "103.7764";

  $: if (selected_sem_venue == "Semester 1" || selected_sem_venue == "Semester 2") 
  {
    weeks = [ "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12", "Week 13"];
  } 
  else 
  {
    weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
  }

  //Get the map of the venue
  async function getMap({ venue }) {
    //reset the values before search
    long = "1.2966";
    lat = "103.7764";

    // This part of the function is to have a selected effect with same background and text colour as hover
    if (document.getElementsByClassName("active").length == 1) {
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
    }
    document.getElementsByClassName(venue)[0].className += " active";
    active_venue = venue;

    // If venue is available, show the map, else change variable to 'none'
    if (VenueInfo[venue] == null || VenueInfo[venue].location.y == null || VenueInfo[venue].location.x == null) 
    {
      embbed_map = "none";
    } 
    else 
    {
      long = VenueInfo[venue].location.y;
      lat = VenueInfo[venue].location.x;
      console.log(embbed_map);
      embbed_map = "<iframe style='filter: invert(85%)' class='w-full h-96' src='https://www.google.com/maps/embed/v1/place?q=" + long + "," + lat + "&amp;key=" + config["MAP_API_KEY"] + "&center=" + long + "," + lat + "&zoom=19'></iframe>";

      const el = document.querySelector("#endOfPage");
      if (!el) return;
      el.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  // This function does an API call for venue
  async function getVenue() {
    const el = document.querySelector("#endOfPage");
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
    });

    // Initialise error message to be empty
    errorMessage_empty_field = "";
    errorMessage_wrong_input = "";
    errorMessage_wrong_input2 = "";
    errorMessage_no_rooms = "";

    // Initialise venue slot to be empty
    venue_slot = [];

    // Error checking for empty inputs
    if (clockStartTime == undefined || clockEndTime == undefined) {
      if (clockStartTime == undefined && clockEndTime != undefined) {
        errorMessage_empty_field = "Please fill in the start time.";
      } else if (clockEndTime == undefined && clockStartTime != undefined) {
        errorMessage_empty_field = "Please fill in the end time.";
      } else if (clockStartTime == undefined && clockEndTime == undefined) {
        errorMessage_empty_field = "Please fill in the start and end time.";
      }
    } 
    else 
    {
      // Remove the colon for start and end time
      startTime = clockStartTime[0] + clockStartTime[1] + clockStartTime[3] + clockStartTime[4];
      endTime = clockEndTime[0] + clockEndTime[1] + clockEndTime[3] + clockEndTime[4];

      // Check for start and end time
      if ( startTime < "0800" || startTime > "2200" || endTime < "0800" || endTime > "2200") 
      {
        // If start time is earlier than 8am
        if (startTime < "0800") {
          errorMessage_wrong_input = "Start time must be after 0800.";
        }
        // If start time is later than 10pm 
        else if (startTime > "2200") 
        {
          errorMessage_wrong_input = "Start time must be before 2200";
        }

        // If end time is earlier than 8am
        if (endTime < "0800") {
          errorMessage_wrong_input2 = "End time must be after 0800.";
        }
        // If end time is later than 10pm 
        else if (endTime > "2200") 
        {
          errorMessage_wrong_input2 = "End time must be before 2200";
        }
      } 
      // If end timing is earlier than start timing
      else if (endTime < startTime) 
      {
        errorMessage_wrong_input = "End time cannot be earlier than start time.";
      } 
      else 
      {
        // If no error
        loading = true;

        // API fetch
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

        // data is the response of the API Call
        var data = await response.json();
        buttons = "";
        for (let i = 0; i < data["result"].length; i += 1) {
          for (let j = 0; j < data["result"][i]["Availability Timeslot"].length; j += 1) 
          {
            if (data["result"][i]["Availability Timeslot"][0][0] <= startTime && data["result"][i]["Availability Timeslot"][0][1] >= endTime && data["result"][i]["Day"] == day) 
            {
              // If the time slot fits the search and it's within the day, the push into the array
              if (!venue_slot.includes(data["result"][i]["Venue"])) {
                venue_slot.push(data["result"][i]["Venue"]);
                venue_slot = [...venue_slot];
              }
            }
          }
        }

        // If the length is 0, it means there is no rooms available.
        if (venue_slot.length == 0) {
          errorMessage_no_rooms = "There are no rooms available.";
        } 
        else 
        {
          // Sort the venues
          venue_slot.sort();
          for (let i = 0; i < venue_slot.length; i += 1) 
          {
            // Append the button text
            buttons += "<button class='VenueButton' id = '" + venue_slot[i] + "'>" + venue_slot[i] + "</button>";
          }
        }
        
        loading = false;
        
        el.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }
</script>



<div class=" text-center">
  <div class="font-extrabold 2xl:mt-24 2xl:mb-10 xl:mt-24 xl:mb-10 lg:mt-16 lg:mb-5 mt-12 mb-4">
    <!-- This portion is the title -->
    <span class=" 2xl:text-8xl lg:text-8xl md:text-7xl text-6xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-sky-500">
      <strong>Venue Search</strong>
    </span>
  </div>

  <!-- Overview -->
  <p class=" font-extrabold text-gray-300 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center mx-4">
    This function allows you to search for available venues in the specified time range
  </p>

  <!-- Instruction part 1 -->
  <p class=" font-extrabold text-gray-300 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center mx-4">
    Start Time should be 0800 hrs or after.
  </p>

  <!-- Instruction part 2 -->
  <p class="font-extrabold text-gray-300 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center mb-5 mx-4">
    End Time should be before 2200.
  </p>

  <!-- Instruction part 3 -->
  <p class="font-semibold text-orange-700 2xl:text-lg xl:text-lg lg:text-md text-sm text-center mx-4">
    Note: Sunday is not available for booking since the rooms will all be locked.
  </p>

  <!-- Instruction part 4 -->
  <p class="font-semibold text-orange-700 2xl:text-lg xl:text-lg lg:text-md text-sm text-center mx-4">
    This is because there are no lessons on Sunday, thus no rooms will be unlocked.
  </p>

  <!-- Input portion -->
  <div class="grid grid-cols-1 justify-items-center">
    <div class="grid grid-cols-2">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <!-- Label for semester -->
      <label class="font-semibold text-end mr-4 2xl:text-xl 2xl:mt-10 2xl:mb-3 xl:text-xl xl:mt-10 xl:mb-3 lg:text-xl lg:mt-10 lg:mb-3 text-lg mt-5 mb-1.5 inline-block align-bottom">
        Semester
      </label>

      <!-- Dropdown to select the semester -->
      <select bind:value={selected_sem_venue} class="border border-gray-300 bg-[#202124] text-white rounded-lg border-2 block 2xl:text-xl 2xl:mt-10 2xl:mb-3 xl:text-xl xl:mt-10 xl:mb-3 lg:text-xl lg:mt-10 lg:mb-3 text-lg mt-5 mb-1.5 max-h-full focus:outline-none focus:border-sky-500 my-0.5 ">
        <option>Semester 1</option>
        <option>Semester 2</option>
        <option>Special Term 1</option>
        <option>Special Term 2</option>
      </select>
    </div>

    <!-- Dropdown portion for Week -->
    <div class="grid grid-cols-2">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <!-- Label for Week -->
      <label class="font-semibold text-end mr-4 2xl:text-xl 2xl:mt-3 2xl:mb-5 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 inline-block align-bottom">
        Week
      </label>
      <select bind:value={week} class="border border-gray-300 bg-[#202124] text-white rounded-lg border-2 block  2xl:text-xl 2xl:mt-3 2xl:mb-3 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 max-h-full focus:outline-none focus:border-sky-500 my-0.5 text-md">
        <!-- The number of weeks is dependent on the semester -->
        {#each weeks as week_num}
          <option>{week_num}</option>
        {/each}
      </select>
    </div>

    <!-- Dropdown portion for Day -->
    <div class="grid grid-cols-2">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="font-semibold text-end mr-4 2xl:text-xl 2xl:mt-3 2xl:mb-5 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 inline-block align-bottom">
        Day
      </label>
      <select bind:value={day} class="border border-gray-300 bg-[#202124] text-white rounded-lg border-2 block 2xl:text-xl 2xl:mt-3 2xl:mb-3 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 max-h-full focus:outline-none focus:border-sky-500 my-0.5">
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
        <option>Saturday</option>
      </select>
    </div>

    <!-- Input portion for start time -->
    <div class="grid grid-cols-2 ">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <!-- Label -->
      <label class="font-semibold text-end mr-4 2xl:text-xl 2xl:mt-3 2xl:mb-5 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 inline-block align-bottom">
        Start Time
      </label>
      
      <!-- Time input -->
      <input type="time" class="border-2 border-gray-300 rounded-md focus:outline-none 2xl:text-xl 2xl:mt-3 2xl:mb-3 2xl:w-40 xl:text-xl xl:mt-3 xl:mb-3 xl:w-40 lg:text-xl lg:mt-3 lg:mb-3 lg:w-32 md:w-24 w-20 text-lg mt-1.5 mb-1.5 bg-[#202124]" step="1800" bind:value={clockStartTime} required/>
    </div>

    <!-- Input portion for end time -->
    <div class="grid grid-cols-2">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="font-semibold text-end mr-4 2xl:text-xl 2xl:mt-3 2xl:mb-5 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 inline-block align-bottom">
        End Time
      </label>
    
      <!-- Time input -->
      <input type="time" class="border-2 border-gray-300 rounded-md focus:outline-none 2xl:text-xl 2xl:mt-3 2xl:mb-3 2xl:w-40 xl:text-xl xl:mt-3 xl:mb-3 xl:w-40 lg:text-xl lg:mt-3 lg:mb-3 lg:w-32 md:w-24 w-20 text-lg mt-1.5 mb-1.5 bg-[#202124]" step="1800" bind:value={clockEndTime} required />
    </div>

    <!-- Button portion to find venue -->
    <div class="grid grid-cols-1">
      <button on:click={getVenue} class="mt-14 py-2.5 px-5 mb-2 text-sm bg-gradient-to-r from-pink-600 to-sky-600 rounded-lg border-none text-gray-50 font-bold hover:from-sky-600 hover:to-teal-600">\
        <strong>Find Venue</strong>
      </button>
    </div>

    <!-- Loading bar when loading -->
    {#if loading}
      <img src="loading_bar.svg" alt="" />
    {/if}

    <!-- Error message for empty field -->
    <h3 class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl">
      <strong>{errorMessage_empty_field}</strong>
    </h3>

    <!-- Error message for wrong input -->
    <h3 class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl">
      <strong>{errorMessage_wrong_input}</strong>
    </h3>

    <!-- Error message for second wrong input -->
    <h3 class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl">
      <strong>{errorMessage_wrong_input2}</strong>
    </h3>
    
    <!-- Error message if there is no room -->
    <h3 class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl">
      <strong>{errorMessage_no_rooms}</strong>
    </h3>

    <br />
  </div>
</div>

<!-- If the screen size is smth, show the text to ask viewer to scroll down to view the map -->
<div class="2xl:invisible xl:invisible lg:invisible">
  {#if embbed_map != "none" && embbed_map != ""}
    <h3 class="text-sky-500 text-center md:text-xl sm:text-xl ">
      Please scroll down to view the map...
    </h3>
  {/if}
</div>

<!-- Genereate the button and the map -->
{#if venue_slot.length != 0}
  <div class="grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 mx-4">
    <!-- Button portion -->
    <div class="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-4 grid-cols-2 overflow-y-auto mb-10 overscroll-y-none h-96">
      <!-- Search bar -->
      <input type="text" bind:value={filterText} class="font-semibold text-sky-500 focus:placeholder-gray-600 bg-[#202124] border-2 border-sky-500 focus:outline-none text-sky-500 2xl:col-span-5 xl:col-span-4 lg:col-span-4 col-span-2 h-6 mx-5 mt-2" placeholder=" Enter the venue..."/>
      {#if filterText != "" && filterText != undefined}
        <!-- If there is text in search bar  -->
        {#each venue_slot as venue}

          {#if venue.toLowerCase().includes(filterText.toLowerCase())}
            <!-- If the text in the text field is included in the venue -->
            <button class="VenueButton py-2.5 px-5 mr-2 mb-2 text-sm font-medium h-8 text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue}" contenteditable="false" on:click={() => getMap({ venue })}>
                {venue}
            </button>
          {/if}
        {/each}
      {:else}
        
        {#each venue_slot as venue}
          <!-- If there is a current active venue, then continue to make it active else normal button-->
          {#if venue == active_venue}
            <button class="VenueButton py-2.5 px-5 mr-2 mb-2 text-sm font-medium h-8 text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue} active" contenteditable="false" on:click={() => getMap({ venue })}>
              {venue}
            </button>
          {:else}
            <button class="VenueButton py-2.5 px-5 mr-2 mb-2 text-sm font-medium h-8 text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue}" contenteditable="false" on:click={() => getMap({ venue })}>
              {venue}
            </button>
          {/if}
        {/each}
      {/if}
    </div>

    <!-- Map portion -->
    <div id="startOfMap" class="md:mb-10 sm:mb-10 ">
      <!-- No map has been selected yet -->
      {#if embbed_map == ""}
        <div class="text-sky-500 2xl:text-2xl xl:text-xl lg:text-xl md:text-xl text-lg text-center">
          Please click on any of the class to view the map
        </div>
      {/if}

      <!-- If map is none, means there is no map available -->
      {#if embbed_map == "none"}
        <div class="text-red-800 2xl:text-2xl xl:text-xl lg:text-xl md:text-xl text-lg text-center font-bold">
          Sorry the map is currently unavailable.
        </div>
      {/if}

      <!-- If there is map, show the map -->
      {#if embbed_map != "none" && embbed_map != ""}
        <div class="border-2 border-sky-500 ml-2 my-4" bind:innerHTML={embbed_map} contenteditable="false"/>
      {/if}
    </div>
  </div>
{/if}

<div id="endOfPage" />

<style>
  .VenueButton {
    /* background: #202124; */

    font-size: 1em;
    padding: 8px 12px;
    border-radius: 2px;
    text-align: center;
    border: none;
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

  label {
    color: white;
  }

  input[type="time"] {
    background-color: #202124;
    margin-top: 5%;
    color: white;
  }

  .active {
    background-color: #0284c7;
    color: white;
  }

  input[type="time"]::-webkit-calendar-picker-indicator {
    filter: invert(89%) sepia(9%) saturate(134%) hue-rotate(177deg)
      brightness(97%) contrast(87%);
  }
</style>
