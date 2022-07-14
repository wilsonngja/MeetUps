<script>
  import config from "./config.json";
  import VenueInfo from "./backend/database/venues.json";

  var selected_semester;
  var selected_week;
  var semester_venue = [];
  var loading;
  var day_loading;
  var weeks = [];
  var error_message_no_input;
  var error_message_no_timeslot;
  var filterText;
  var active_venue;
  var day_availability = {};
  var entries = Object.entries(day_availability);
  var embbed_map;
  var long;
  var lat;
  var venue_completed;
  var completed_process;

  const apiURL = config["API_LINK"];

  $: if (
    selected_semester == "Semester 1" ||
    selected_semester == "Semester 2"
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
  } else if (
    selected_semester == "Special Term 1" ||
    selected_semester == "Special Term 2"
  ) {
    weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
  } else {
    weeks = [];
  }

  async function findVenue() {
    error_message_no_input = "";
    semester_venue = [];
    loading = true;
    venue_completed = false;
    completed_process = false;
    entries = [];

    if (document.getElementsByClassName("active").length == 1) {
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
    }

    active_venue = undefined;

    if (
      selected_semester != undefined &&
      selected_semester != "" &&
      selected_week != undefined &&
      selected_week != ""
    ) {
      const response = await fetch(apiURL, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "venue",
          semester: selected_semester,
          req_week: selected_week,
        }),
      });
      var data = await response.json();

      for (let i = 0; i < data["result"].length; i += 1) {
        if (!semester_venue.includes(data["result"][i]["Venue"])) {
          semester_venue.push(data["result"][i]["Venue"]);
          semester_venue = [...semester_venue];
        }
      }

      semester_venue.sort();
      venue_completed = true;
    } else {
      error_message_no_input = "Please ensure all entries are selected";
    }
    loading = false;
  }

  async function findFreeSlot({ venue }) {
    day_availability = {};
    entries = [];
    day_loading = true;
    completed_process = false;

    if (document.getElementsByClassName("active").length == 1) {
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
    }

    document.getElementsByClassName(venue)[0].className += " active";
    active_venue = venue;

    const response = await fetch(apiURL, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "venue timeslot",
        semester: selected_semester,
        req_week: selected_week,
        venue: venue,
      }),
    });
    var data = await response.json();
    console.log(data);
    for (let i = 0; i < data["result"].length; i += 1) {
      if (day_availability[data["result"][i]["Day"]] == undefined) {
        day_availability[data["result"][i]["Day"]] = [];
      }

      for (
        let j = 0;
        j < data["result"][i]["Availability Timeslot"].length;
        j += 1
      ) {
        day_availability[data["result"][i]["Day"]].push(
          data["result"][i]["Availability Timeslot"][j]
        );
      }
    }

    const sorter = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    entries = Object.entries(day_availability);
    entries.sort(function sortByDay(a, b) {
      var day1 = a[0];
      var day2 = b[0];
      return sorter[day1] - sorter[day2];
    });

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
        "<iframe style='filter: invert(85%)' class='w-full h-96' src='https://www.google.com/maps/embed/v1/place?q=" +
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

    day_loading = false;
    completed_process = true;
  }
</script>

<div class="text-center">
  <div
    class="font-extrabold 2xl:mt-24 2xl:mb-10 xl:mt-24 xl:mb-10 lg:mt-16 lg:mb-5 mt-12 mb-4"
  >
    <span
      class=" 2xl:text-7xl lg:text-7xl md:text-6xl text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-sky-500"
    >
      <strong>Venue Availability</strong>
    </span>
  </div>
  <p
    class=" font-extrabold text-gray-300 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center mx-4"
  >
    This page will show available timings of venues based on the week and
    semester indicated.
  </p>

  <div class="mt-5">
    <p
      class=" font-semibold text-gray-300 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center mx-4"
    >
      Start using by indicating the semester and the week before clicking the
      'Retrieve Venue' button.
    </p>
    <p
      class=" font-semibold text-gray-300 2xl:text-2xl xl:text-xl lg:text-xl text-md text-center mx-4"
    >
      The venues available for use during the selected periods will then be
      shown.
    </p>
  </div>

  <div
    class="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-6 lg:grid-cols-4 grid-cols-2"
  >
    <div class="2xl:col-start-3 xl:col-start-3 lg:col-start-2">
      <label for="semester" class="text-white text-lg font-medium bg"
        >Select the semester:</label
      >
      <select
        id="semester"
        class="border border-gray-300 bg-[#202124] text-white rounded-lg border-2 mt-2"
        bind:value={selected_semester}
      >
        <option disabled selected value> -- Select a Semester -- </option>
        <option value="Semester 1">Semester 1</option>
        <option value="Semester 2">Semester 2</option>
        <option value="Special Term 1">Special Term 1</option>
        <option value="Special Term 2">Special Term 2</option>
      </select>
    </div>
    <div class="2xl:col-start-4 xl:col-start-4 lg:col-start-3">
      <label for="week" class="text-white text-lg font-medium"
        >Select the week:</label
      >
      <select
        id="semester"
        class="border border-gray-300 bg-[#202124] text-white rounded-lg border-2 mt-2"
        bind:value={selected_week}
      >
        <option disabled selected value> -- Select the week -- </option>
        {#each weeks as week_num}
          <option>{week_num}</option>
        {/each}
      </select>
    </div>
  </div>
  <button
    class="mt-10 py-2.5 px-5 mb-2 text-sm bg-gradient-to-r from-pink-600 to-sky-600 rounded-lg border-none text-gray-50 font-bold hover:from-sky-600 hover:to-teal-600"
    on:click={findVenue}>Retrieve Venue</button
  >
  <br />
  {#if error_message_no_input != "" && error_message_no_input != undefined}
    <p
      class="2xl:text-3xl 2xl:mt-10 xl:text-3xl xl:mt-10 lg:text-2xl lg:mt-8 md:text-2xl mt-4 text-xl text center text-red-500"
    >
      {error_message_no_input}
    </p>
  {/if}
  <br />

  {#if loading}
    <img class="m-auto" src="loading_bar.svg" alt="" />
  {/if}
  <br />
  {#if venue_completed}
    <div
      class="grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 2xl:mx-10 xl:mx-10 lg:mx-5 mx-2 gap-y-10"
    >
      <!-- All the available Venues displayed here -->
      <div
        class="h-96 overflow-y-auto 2xl:border-r-2 xl:border-r-2 lg:border-r-2 border-0 border-sky-500"
      >
        {#if semester_venue.length != 0}
          <div
            class="grid 2xl:grid-cols-5 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 grid-cols-2"
          >
            <input
              type="text"
              bind:value={filterText}
              class="font-semibold text-sky-500 focus:placeholder-gray-600 bg-[#202124] border-2 border-sky-500 focus:outline-none text-sky-500 2xl:col-span-5 xl:col-span-3 lg:col-span-3 md:col-span-3 col-span-2 h-6 mx-5 my-2"
              placeholder=" Enter the venue..."
            />
            {#if filterText != "" && filterText != undefined}
              {#each semester_venue as venue}
                {#if venue.toLowerCase().includes(filterText.toLowerCase())}
                  <button
                    class="VenueButton border-0 py-2.5 px-5 mr-2 mb-2 text-sm font-medium h-8 text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue}"
                    contenteditable="false"
                    on:click={() => findFreeSlot({ venue })}>{venue}</button
                  >
                {/if}
              {/each}
            {:else}
              {#each semester_venue as venue}
                {#if venue == active_venue}
                  <button
                    class="VenueButton border-0 py-2.5 px-5 mr-2 mb-2 text-sm font-medium h-8 text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue} active"
                    contenteditable="false"
                    on:click={() => findFreeSlot({ venue })}>{venue}</button
                  >
                {:else}
                  <button
                    class="VenueButton border-0 py-2.5 px-5 mr-2 mb-2 text-sm font-medium h-8 text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue}"
                    contenteditable="false"
                    on:click={() => findFreeSlot({ venue })}>{venue}</button
                  >
                {/if}
              {/each}
            {/if}
          </div>
        {/if}
      </div>

      <!-- This part will show the timeslot that is available -->
      <div class="mx-4 h-96 overflow-y-auto">
        {#each entries as [key, value]}
          {#if value.length != 0}
            <div
              class="text-left text-slate-200 2xl:text-2xl xl:text-2xl lg:text-2xl text-xl border-b-2 border-slate-500 mx-2 mb-2 mt-5"
            >
              {key}
            </div>
            <div class="grid grid-cols-4 mt-5">
              {#each value as [startTime, endTime]}
                <div class="text-slate-200 text-md text-left mx-2">
                  {startTime}-{endTime}
                </div>
              {/each}
            </div>
          {/if}
        {/each}

        {#if day_loading}
          <img class="mx-auto my-20" src="loading_bar.svg" alt="" />
        {:else if loading == false && !completed_process}
          <p
            class="2xl:text-3xl xl:text-3xl lg:text-2xl text-xl my-40 text-center text-sky-500"
          >
            Please select the venue to see the time slots.
          </p>
        {/if}
      </div>

      <div class="2xl:col-span-2 xl:col-span-2 lg:col-span-2 mb-5">
        {#if embbed_map != "none" && embbed_map != ""}
          <p />
          <div
            class="border-2 border-sky-500 2xl:mx-10 xl:mx-10 lg:mx-10 "
            bind:innerHTML={embbed_map}
            contenteditable="false"
          />
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .active {
    background-color: #0284c7;
    color: white;
  }
</style>
