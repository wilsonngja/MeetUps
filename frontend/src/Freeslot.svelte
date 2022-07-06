<script>
  import { each } from "svelte/internal";

  import App from "./App.svelte";
  import AcademicYear from "./backend/database/start_date.json";
  import VenueInfo from "./backend/database/venues.json";
  import config from "./config.json";

  var free_slot_generated = true;
  var num_links = 1;
  var loading = false;
  let links = "";
  let free_slot_arr = [];
  var venue_slot = [];
  var buttons = "";
  var url = "";
  var wrongSemester = false;
  var long = "1.2966";
  var lat = "103.7764";
  var embbed_map = "";
  $: num_free_slot = free_slot_arr.length; // if theres more than 1 free slot in the free_slot_arr. become true

  var today_date = new Date();
  var sem1_start_date = AcademicYear["Sem 1"].split("-");
  var sem1 = new Date(
    sem1_start_date[0],
    sem1_start_date[1] - 1,
    sem1_start_date[2]
  );
  var sem2_start_date = AcademicYear["Sem 2"].split("-");
  var sem2 = new Date(
    sem2_start_date[0],
    sem2_start_date[1] - 1,
    sem2_start_date[2]
  );
  var st1_start_date = AcademicYear["Special Term 1"].split("-");
  var st1 = new Date(
    st1_start_date[0],
    st1_start_date[1] - 1,
    st1_start_date[2]
  );
  var st2_start_date = AcademicYear["Special Term 2"].split("-");
  var st2 = new Date(
    st2_start_date[0],
    st2_start_date[1] - 1,
    st2_start_date[2]
  );
  var query_semester = "";

  const apiURL = config["API_LINK"];

  // This section will check the current date today and see if the date corresponds to which semester.
  if (today_date >= sem1_start_date && today_date < sem2_start_date) {
    query_semester = "Semester 1";
  } else if (today_date >= sem2_start_date && today_date < st1_start_date) {
    query_semester = "Semester 2";
  } else if (today_date >= st1_start_date && today_date < st2_start_date) {
    query_semester = "Special Term 1";
  } else {
    query_semester = "Special Term 2";
  }

  // IF it's semester 1 or 2, there will be 13 weeks, else there will be 6 weeks
  var week;
  var weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
  $: if (query_semester == "Semester 1" || query_semester == "Semester 2") {
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

  // This will be the semester that will be checked from the timetable
  const checkSemester = {
    "sem-1": "Semester 1",
    "sem-2": "Semester 2",
    "st-i": "Special Term 1",
    "st-ii": "Special Term 2",
  };

  // Count the number of text field that is empty
  var empty_count = 0;

  //Message will be the message that will be printed out
  var message = "";
  var error_message_empty = "";
  var error_message_wrong_sem = "";
  var error_message_invalid_timetable = "";
  var error_message_no_rooms = "";

  const addField = () => {
    num_links += 1;
  };

  const removeField = (div) => {
    num_links -= 1;
  };

  let list_of_modules = new Map();
  const semester = {
    "sem-1": "semester1",
    "sem-2": "semester2",
    "st-i": "specialterm1",
    "st-ii": "specialterm2",
  };
  const lesson_type = {
    LEC: "Lecture",
    TUT: "Tutorial",
    SEC: "Sectional Teaching",
    LAB: "Laboratory",
    PTUT: "Packaged Tutorial",
    PLEC: "Packaged Lecture",
  };
  var lesson_slot = {
    Monday: [["0800", "0800"]],
    Tuesday: [["0800", "0800"]],
    Wednesday: [["0800", "0800"]],
    Thursday: [["0800", "0800"]],
    Friday: [["0800", "0800"]],
  };
  async function submitLink() {
    error_message_no_rooms = "";
    empty_count = 0;
    error_message_empty = "";
    error_message_wrong_sem = "";
    error_message_invalid_timetable = "";

    wrongSemester = false;
    free_slot_arr = [];

    //Variable Declaration
    message = "";
    let list_of_modules = new Map();

    free_slot_generated = false;

    var each_module = [];
    var module_list = new Map();
    var temp_str = "";

    let num_timeslots = 0; // UnusedGlobal variable for use to generate out timetable.

    const tt_inputs = document.querySelectorAll("#ttLink");

    let nus_tt_links = [];
    let each_timetable_module = "";

    //Add text fields into array
    let loop_count = "";
    for (let i = 0; i < num_links; i += 1) {
      const val = document.getElementById(`link_` + i).value;

      nus_tt_links.push(val);
    }

    var response;
    (async () => {
      // const ay = "2022-2023"; // Manually keyed in if json file doesnt load.
      const ay = AcademicYear.AY;
      message = "";

      // This part here will be the error checking.
      for (var i = 0; i < nus_tt_links.length; i += 1) {
        if (nus_tt_links[i] == "") {
          empty_count += 1;
        } else {
          each_timetable_module = nus_tt_links[i].split("?");

          if (each_timetable_module.length != 2) {
            error_message_invalid_timetable = "Unrecognised timetable.\n";
            wrongSemester = true;
            free_slot_generated = true;
          } else {
            var sem = each_timetable_module[0].match(
              "(sem-1)|(sem-2)|(st-ii)|(st-i)"
            )[0];

            if (
              sem != "sem-1" &&
              sem != "sem-2" &&
              sem != "st-ii" &&
              sem != "st-i"
            ) {
              error_message_invalid_timetable = "Unrecognised timetable.\n";
              wrongSemester = true;
              free_slot_generated = true;
            } else {
              if (checkSemester[sem] != query_semester) {
                error_message_wrong_sem =
                  "Please use timetable that corresponds to the correct semester.";
                wrongSemester = true;
                free_slot_generated = true;
              }
            }
          }
        }
      }

      // This 2 if function will check for the error. If there is error, no processing will be done.
      if (empty_count == nus_tt_links.length) {
        error_message_empty = "Please insert in at least one text field.";
        free_slot_generated = true;
        return;
      }

      if (wrongSemester) {
        return;
      }

      //This for-loop is for each links.
      for (let i = 0; i < nus_tt_links.length; i += 1) {
        if (nus_tt_links[i] != "") {
          //Splitting the links into 2 parts. The first part contains the semester while the second part contains the timetable itself
          each_timetable_module = nus_tt_links[i].split("?");
          //Splitting the timetable into each individual modules
          var each_module_class = each_timetable_module[1].split("&");

          var sem = each_timetable_module[0].match(
            "(sem-1)|(sem-2)|(st-ii)|(st-i)"
          )[0];

          wrongSemester = false;
          // var = semester[(each_timetable_module[0]).match(/\w+-\w/)[0]];
          //For loop to iterate through each of the modules
          for (let j = 0; j < each_module_class.length; j += 1) {
            //Splitting each of the module into their module code and their classes (At this point the class code and class type is still not split)
            var splitted_module_slot = each_module_class[j].split("=");

            //Split the class into different types (Lab, Tut) etc
            var module_slot_timetable = splitted_module_slot[1].split(",");
            var module_lesson_type = new Map();

            //Loop into each of the module timetable
            for (let l = 0; l < module_slot_timetable.length; l += 1) {
              //Split the class type and store into module_lesson_type (which is a map containing their class)
              var split = module_slot_timetable[l].split(":");
              module_lesson_type.set(split[0], split[1]);
            }

            //After all the classes type has been configured into a map, store into the module list where the module list will contain
            //the module code as the key and the map of class type and class code as the value
            module_list.set(splitted_module_slot[0], module_lesson_type);
            for (var [key, value] of module_lesson_type.entries()) {
              // Get the timetable info from the database through the server.
              const response = await fetch(config["API_LINK"], {
                method: "post",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  type: "free slot",
                  module_code: splitted_module_slot[0],
                  class_type: lesson_type[key],
                  class_code: value,
                  semester: semester[sem],
                }),
              });

              var data = await response.json();

              for (
                var class_num = 0;
                class_num < data["result"].length;
                class_num += 1
              ) {
                lesson_slot[data["result"][class_num]["LessonDay"]].push([
                  data["result"][class_num]["StartTime"],
                  data["result"][class_num]["endTime"],
                ]);
              }
            }
          }

          module_list.clear();
        }
      }

      for (const [key, value] of Object.entries(lesson_slot)) {
        //2359 is the end of the search. Can be change to differnt class timing. But take note that the class in NUS ends latest at 9pm
        lesson_slot[key].push(["2359", "2359"]);
        value.sort();

        //Check through the classes each day
        for (var i = 0; i < value.length - 1; i += 1) {
          //Check if there is any slots in between each classes
          if (parseInt(value[i][1]) < parseInt(value[i + 1][0])) {
            //Append the message if there is a free slot
            // message +=
            //   key + ": " + value[i][1] + "-" + value[i + 1][0] + "<br/>";
            free_slot_arr.push({
              slotid: key,
              start: value[i][1],
              end: value[i + 1][0],
            });
            free_slot_arr = [...free_slot_arr];
            num_timeslots += 1;
          }
        }
        //
      }

      // Stop the generation and the loading animation
      free_slot_generated = true;
    })();
  }

  // The portion that generates the google map
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
    // {
    // alert("Currently unable to display location on Google Map.");
    // } else {
    // long = VenueInfo[venue].location.y;
    // lat = VenueInfo[venue].location.x;

    // //Find Json File and , modify and extract out venue data
    // alert("Close this pop up to view " + venue + "'s location.");
    // url = "http://maps.google.com/maps?q=" + long + "," + lat;

    // window.open(url);
    // }
  }

  async function getLocation(
    freeslot_day,
    starttime,
    endtime,
    selected_semester,
    week
  ) {
    venue_slot = [];
    loading = true;

    const response = await fetch(apiURL, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "venue",
        semester: selected_semester,
        req_week: week,
      }),
    });

    var data = await response.json();
    buttons = "";
    for (var i = 0; i < data["result"].length; i += 1) {
      for (
        var j = 0;
        j < data["result"][i]["Availability Timeslot"].length;
        j += 1
      ) {
        if (
          !(
            data["result"][i]["Availability Timeslot"][0][0] == "0800" &&
            data["result"][i]["Availability Timeslot"][0][1] == "2359"
          ) ||
          (data["result"][i]["Availability Timeslot"][0][0] <= starttime &&
            data["result"][i]["Availability Timeslot"][0][1] >= endtime &&
            data["result"][i]["Day"] == freeslot_day)
        ) {
          if (!venue_slot.includes(data["result"][i]["Venue"])) {
            venue_slot.push(data["result"][i]["Venue"]);
            venue_slot = [...venue_slot];
          }
        }
      }
    }

    if (venue_slot.length == 0) {
      error_message_no_rooms = "There are no rooms available";
    } else {
      for (var i = 0; i < venue_slot.length; i += 1) {
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
</script>

<!-- <div
  class="h-screen rounded-lg bg-gradient-to-tr from-gray-900 via-stone-900 to-gray-800"
> -->
<div>
  <!-- <div
      class="object-cover 2xl:h-48 2xl:w-96 xl:h-36 xl:w-64  
    lg:h-36 lg:w-48
    md:h-36 md:w-24
    h-0 w-0 "
    >
      <img clas="object-contain " src="topleftcorner.png" />
    </div> -->
  <div class="text-center font-extrabold ">
    <div
      class="font-extrabold 2xl:mt-40 2xl:mb-10 xl:mt-40 xl:mb-10 lg:mt-32 lg:mb-5 mt-16 mb-2"
    >
      <span
        class=" 2xl:text-5xl lg:text-3xl  md:text-2xl text-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-sky-500"
        ><strong
          >Free Period Search For Current Sem: (<u>{query_semester}</u>)
        </strong></span
      >
    </div>
  </div>
  <p
    class="text-gray-400 text-center font-extrabold mt-10 mb-4
  2xl:text-3xl lg:text-2.5xl md:text-2xl text-1xl 
  "
  >
    This function helps you (or your teammates) to find the timeslots to meet up
    in the current semester.
  </p>

  <p
    class="text-gray-400 text-center   2xl:text-3xl lg:text-2xl md:text-1xl text-1xl "
  >
    To find the free periods, enter the <strong>NUSMODS timetable link</strong> in
    the textbox below.
  </p>
  <p
    class="text-gray-400 text-center   2xl:text-3xl lg:text-2xl md:text-1xl text-1xl "
  >
    To add on more timetables, click on "Add link".
  </p>
  <p
    class="text-gray-400 text-center mb-8   2xl:text-3xl lg:text-2xl md:text-1xl text-1xl "
  >
    Click on "Find Time" to find free periods!
  </p>
  <!-- <h4 class="lg:text-2xl md:text-xl sm:text-md text-white" >{query_semester}</h4> -->
</div>

<!-- <div class = "grid grid-cols-1 gap-4"> -->
<!-- <div  class = "grid grid-cols-2 gap-4" > 
      <h4 class="text-right lg:text-2xl md:text-xl sm:text-md"><strong>Current Semester: </strong></h4> 
      <h4 class="lg:text-2xl md:text-xl sm:text-md" >{query_semester}</h4>
    </div> -->

<!-- </div> -->

{#each Array(num_links) as _, i}
  <div class="grid grid-cols-1 gap-4 text-center lg:mx-64 md:mx-32">
    <input
      class=" appearance-none border-2 border-gray-300 rounded-md  focus:outline-none focus:border-sky-500 bg-[#202124] text-center lg:text-2xl md:text-xl sm:text-md my-1 text-sky-500 focus:placeholder-sky-500 focus:bg-[#202124] "
      autocomplete="off"
      name="DynamicField"
      type="text"
      id={`link_${i}`}
      placeholder="https://nusmods.com/timetable/sem-1/share?CS1010=LEC:01"
    />
  </div>
{/each}

<div class=" text-center">
  {#if num_links > 1}
    <input
      type="button"
      value="- Remove last timetable link"
      class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      on:click={removeField}
    />
  {/if}

  {#if num_links < 5}
    <button
      on:click|preventDefault={addField}
      class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >+ Add link</button
    >
  {/if}

  <button
    on:click|preventDefault={submitLink}
    class="mt-14 py-2.5 px-5 mb-2 text-sm bg-gradient-to-r from-pink-600 to-sky-600 rounded-lg border-none text-gray-50 font-bold hover:from-sky-600 hover:to-teal-600"
  >
    <strong>Find Time</strong></button
  >
</div>
<div class="grid grid-cols-1 justify-items-center">
  {#if !free_slot_generated}
    <br />
    <img src="loading_bar.svg" alt="" />
    <!-- <p>{message}</p> -->
  {/if}

  {#if num_free_slot}
    <!-- <div class="divide-x-2"><p class="text-white">Select week number:</p></div> -->

    <div class="grid grid-cols-1 justify-items-center">
      <div class="grid grid-cols-2">
        <p
          class="text-white font-semibold text-end mr-4 2xl:text-xl 2xl:mt-10 2xl:mb-3 xl:text-xl xl:mt-10 xl:mb-3 lg:text-xl lg:mt-10 lg:mb-3 text-lg mt-5 mb-1.5 inline-block align-bottom"
        >
          Select week number:
        </p>
        <select
          class="border border-gray-300 bg-[#202124] text-white rounded-lg border-1 block 2xl:text-xl 2xl:mt-10 2xl:mb-3 xl:text-xl xl:mt-10 xl:mb-3 lg:text-xl lg:mt-10 lg:mb-3 text-lg mt-5 mb-1 max-h-full focus:outline-none focus:border-sky-500 my-0.5 "
          bind:value={week}
        >
          {#each weeks as week_num}
            <option>{week_num}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}

  <br />

  <div class="justify-items-center mb-5" contenteditable="false">
    {#each free_slot_arr as { slotid, start, end }}
      <button
        class=" TimingButton mb-3 text-lg font-medium text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white"
        id={slotid + "_" + start + "_" + end}
        on:click={getLocation(slotid, start, end, query_semester, week)}
      >
        {slotid + ": " + start + " - " + end}
      </button>
      <br />
    {/each}
  </div>
</div>
<!-- <div class="button_div" contenteditable="false" bind:innerHTML={buttons} /> -->
<div class="grid grid-cols-1 justify-items-center">
  {#if loading}
    <img src="loading_bar.svg" alt="" />
  {/if}
</div>

<!-- 
<div>
  {#each venue_slot as venue}
    <button
      class="VenueButton"
      id={venue}
      contenteditable="false"
      on:click={() => getMap({ venue })}
    >
      {venue}
    </button>
  {/each}
</div> -->

<div class="2xl:invisible xl:invisible lg:invisible">
  {#if embbed_map != "none" && embbed_map != ""}
    <h3 class="text-sky-200 text-center md:text-xl sm:text-xl mt-5">
      Please scroll down to view the map...
    </h3>
    <br /><br />
  {/if}
</div>

{#if venue_slot.length != 0}
  <div class="grid grid-cols-1 justify-items-center mb-3">
    <p
      class="font-extrabold 2xl:text-5xl lg:text-5xl  md:text-3xl text-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-sky-500 "
    >
      Available Venues
    </p>
  </div>
  <div class="grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 grid-cols-1">
    <div
      class="border-2 grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-4 grid-cols-2 overflow-y-auto h-96 mb-10 overscroll-y-none"
    >
      {#each venue_slot as venue}
        <button
          class="VenueButton py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white"
          contenteditable="false"
          on:click={() => getMap({ venue })}
        >
          {venue}
        </button>
      {/each}
    </div>

    <div class="mx-10 md:mb-10 sm:mb-10">
      {#if embbed_map == ""}
        <p class="text-white text-center">
          Please click on any of the venues to view the map
        </p>
      {/if}

      {#if embbed_map == "none"}
        <p class="text-white text-center">
          Sorry the map is currently unavailable.
        </p>
      {/if}

      {#if embbed_map != "none" && embbed_map != ""}
        <div bind:innerHTML={embbed_map} contenteditable="false" />
      {/if}
    </div>
  </div>
{/if}

<h3
  class="text-center text-red-700 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"
>
  <strong>{error_message_empty}</strong>
</h3>
<h3
  class="text-center text-red-700 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"
>
  <strong>{error_message_invalid_timetable}</strong>
</h3>
<h3
  class="text-center text-red-700 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"
>
  <strong>{error_message_wrong_sem}</strong>
</h3>
<h3
  class="text-center text-red-700 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl"
>
  <strong>{error_message_no_rooms}</strong>
</h3>

<!-- </div> -->
<style>
  /* button {
    background: #533a7b;
    color: white;
    border: none;
    font-size: 1em;
    padding: 8px 12px;
    border-radius: 2px;
    text-align: center;
  } */

  /* .tl_corner{


  } */

  .TimingButton {
    /* font-size: 1em; */

    border-radius: 2px;
    text-align: center;
    border: none;
  }

  .VenueButton {
    /* background: #202124; */

    font-size: 1em;
    padding: 1px 1px;
    border-radius: 2px;
    text-align: center;
    border: none;
  }

  /* .freeslot_div{
    float:left;
    width:20%;
  } */
</style>
