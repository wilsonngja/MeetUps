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
  var embbed_map = "";
  var element = document.getElementById("VenueID");

  var errorMessage_empty_field = "";
  var errorMessage_wrong_input = "";
  var errorMessage_wrong_input2 = "";
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

    // This part of the function is to have a selected effect with same background and text colour as hover
    if (document.getElementsByClassName("active").length == 1) {
      let current = document.getElementsByClassName("active");

      current[0].className = current[0].className.replace(" active", "");
    }
    document.getElementsByClassName(venue)[0].className += " active";

    if (
      VenueInfo[venue] == null ||
      VenueInfo[venue].location.y == null ||
      VenueInfo[venue].location.x == null
    ) {
      embbed_map = "none";
    } else {
      long = VenueInfo[venue].location.y;
      lat = VenueInfo[venue].location.x;
      console.log(embbed_map);
      embbed_map =
        "<iframe class='w-full h-96' src='https://www.google.com/maps/embed/v1/place?q=" +
        long +
        "," +
        lat +
        "&amp;key=" +
        config["MAP_API_KEY"] +
        "&center=" +
        long +
        "," +
        lat +
        "&zoom=19'></iframe>";
    }
  }

  // This function does an API call for venue
  async function getVenue() {
    errorMessage_empty_field = "";
    errorMessage_wrong_input = "";
    errorMessage_wrong_input2 = "";
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
        startTime < "0800" ||
        startTime > "2200" ||
        endTime < "0800" ||
        endTime > "2200"
      ) {
        if (startTime < "0800") {
          errorMessage_wrong_input = "Start time must be after 0800.";
        } else if (startTime > "2200") {
          errorMessage_wrong_input = "Start time must be before 2200";
        }

        if (endTime < "0800") {
          errorMessage_wrong_input2 = "End time must be after 0800.";
        } else if (endTime > "2200") {
          errorMessage_wrong_input2 = "End time must be before 2200";
        }
      } else if (
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
              if (
                data["result"][i]["Availability Timeslot"][0][0] != "0800" ||
                data["result"][i]["Availability Timeslot"][0][1] != "2200"
              ) {
                if (!venue_slot.includes(data["result"][i]["Venue"])) {
                  venue_slot.push(data["result"][i]["Venue"]);
                  venue_slot = [...venue_slot];
                }
              }
            }
          }
        }

        if (venue_slot.length == 0) {
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
          }
        }
        loading = false;
      }
    }
  }
</script>

<div class=" text-center">
  <div
    class="font-extrabold 2xl:mt-24 2xl:mb-10 xl:mt-24 xl:mb-10 lg:mt-16 lg:mb-5 mt-12 mb-4"
  >
    <span
      class=" 2xl:text-8xl lg:text-8xl md:text-7xl text-6xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-sky-500"
      ><strong>Venue Search</strong></span
    >
  </div>
  <p
    class=" font-extrabold text-gray-300 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center mx-4"
  >
    This function allows you to search for available venues in the specified
    time range
  </p>
  <p
    class=" font-extrabold text-gray-300 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center mx-4"
  >
    Start Time should be 0800 hrs or after.
  </p>
  <p
    class="font-extrabold text-gray-300 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center mb-5 mx-4"
  >
    End Time should be before 2200.
  </p>

  <p
    class="font-semibold text-orange-700 2xl:text-lg xl:text-lg lg:text-md text-sm text-center mx-4"
  >
    Note: Sunday is not available for booking since the rooms will all be
    locked.
  </p>
  <p
    class="font-semibold text-orange-700 2xl:text-lg xl:text-lg lg:text-md text-sm text-center mx-4"
  >
    This is because there are no lessons on Sunday, thus no rooms will be
    unlocked.
  </p>

  <div class="grid grid-cols-1 justify-items-center">
    <div class="grid grid-cols-2">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label
        class="font-semibold text-end mr-4 2xl:text-xl 2xl:mt-10 2xl:mb-3 xl:text-xl xl:mt-10 xl:mb-3 lg:text-xl lg:mt-10 lg:mb-3 text-lg mt-5 mb-1.5 inline-block align-bottom"
        >Semester</label
      >
      <select
        bind:value={selected_sem_venue}
        class="border border-gray-300 bg-[#202124] text-white rounded-lg border-2 block 2xl:text-xl 2xl:mt-10 2xl:mb-3 xl:text-xl xl:mt-10 xl:mb-3 lg:text-xl lg:mt-10 lg:mb-3 text-lg mt-5 mb-1.5 max-h-full focus:outline-none focus:border-sky-500 my-0.5 "
      >
        <option>Semester 1</option>
        <option>Semester 2</option>
        <option>Special Term 1</option>
        <option>Special Term 2</option>
      </select>
    </div>

    <div class="grid grid-cols-2">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label
        class="font-semibold text-end mr-4 2xl:text-xl 2xl:mt-3 2xl:mb-5 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 inline-block align-bottom"
        >Week</label
      >
      <select
        bind:value={week}
        class="border border-gray-300 bg-[#202124] text-white rounded-lg border-2 block  2xl:text-xl 2xl:mt-3 2xl:mb-3 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 max-h-full focus:outline-none focus:border-sky-500 my-0.5 text-md"
      >
        {#each weeks as week_num}
          <option>{week_num}</option>
        {/each}
      </select>
    </div>

    <div class="grid grid-cols-2">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label
        class="font-semibold text-end mr-4 2xl:text-xl 2xl:mt-3 2xl:mb-5 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 inline-block align-bottom"
        >Day</label
      >
      <select
        bind:value={day}
        class="border border-gray-300 bg-[#202124] text-white rounded-lg border-2 block 2xl:text-xl 2xl:mt-3 2xl:mb-3 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 max-h-full focus:outline-none focus:border-sky-500 my-0.5"
      >
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
        <option>Saturday</option>
      </select>
    </div>

    <div class="grid grid-cols-2 ">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label
        class="font-semibold text-end mr-4 2xl:text-xl 2xl:mt-3 2xl:mb-5 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 inline-block align-bottom"
        >Start Time</label
      >
      <input
        class="border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-500 2xl:text-xl 2xl:mt-3 2xl:mb-3 2xl:w-40 xl:text-xl xl:mt-3 xl:mb-3 xl:w-40 lg:text-xl lg:mt-3 lg:mb-3 lg:w-32 md:w-24 w-20 text-lg mt-1.5 mb-1.5 bg-[#202124] placeholder-stone-700 focus:placeholder-opacity-50 placeholder-opacity-75 focus:text-sky-500"
        bind:value={startTime}
        placeholder=" 0800"
        required
      />
    </div>

    <div class="grid grid-cols-2">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label
        class="font-semibold text-end mr-4 2xl:text-xl 2xl:mt-3 2xl:mb-5 xl:text-xl xl:mt-3 xl:mb-3 lg:text-xl lg:mt-3 lg:mb-3 text-lg mt-1.5 mb-1.5 inline-block align-bottom"
        >End Time</label
      >
      <input
        class="border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-500 2xl:text-xl 2xl:mt-3 2xl:mb-3 2xl:w-40 xl:text-xl xl:mt-3 xl:mb-3 xl:w-40 lg:text-xl lg:mt-3 lg:mb-3 lg:w-32 md:w-24 w-20 text-lg mt-1.5 mb-1.5 bg-[#202124] placeholder-stone-700 focus:placeholder-opacity-50 placeholder-opacity-75 focus:text-sky-500"
        bind:value={endTime}
        placeholder=" 2200"
        required
      />
    </div>

    <div class="grid grid-cols-1">
      <button
        on:click={getVenue}
        class="mt-14 py-2.5 px-5 mb-2 text-sm bg-gradient-to-r from-pink-600 to-sky-600 rounded-lg border-none text-gray-50 font-bold hover:from-sky-600 hover:to-teal-600"
        ><strong>Find Venue</strong></button
      >
    </div>

    {#if loading}
      <img src="loading_bar.svg" alt="" />
    {/if}

    <h3
      class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"
    >
      <strong>{errorMessage_empty_field}</strong>
    </h3>
    <h3
      class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"
    >
      <strong>{errorMessage_wrong_input}</strong>
    </h3>
    <h3
      class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"
    >
      <strong>{errorMessage_wrong_input2}</strong>
    </h3>
    <h3
      class="text-center text-red-800 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"
    >
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
  <div class="grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 grid-cols-1">
    <!-- Button portion -->
    <div
      class="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-4 grid-cols-2 overflow-y-auto h-96 mb-10 overscroll-y-none"
    >
      {#each venue_slot as venue}
        <button
          class="VenueButton py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue}"
          contenteditable="false"
          on:click={() => getMap({ venue })}
        >
          {venue}
        </button>
      {/each}
    </div>

    <!-- Map portion -->
    <div class="md:mb-10 sm:mb-10 ">
      {#if embbed_map == ""}
        <div
          class="text-sky-500 2xl:text-2xl xl:text-xl lg:text-xl md:text-xl text-lg text-center"
        >
          Please click on any of the class to view the map
        </div>
      {/if}

      {#if embbed_map == "none"}
        <div
          class="text-sky-500 2xl:text-2xl xl:text-xl lg:text-xl md:text-xl text-lg text-center"
        >
          Sorry the map is currently unavailable.
        </div>
      {/if}

      {#if embbed_map != "none" && embbed_map != ""}
        <div bind:innerHTML={embbed_map} contenteditable="false" />
      {/if}
    </div>
  </div>
{/if}

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

  input {
    background-color: #202124;
    margin-top: 5%;
    color: white;
  }

  .active {
    background-color: #0284c7;
    color: white;
  }
</style>
