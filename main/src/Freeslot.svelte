<script>
  // Import relevant files
  import AcademicYear from "./backend/database/start_date.json";
  import VenueInfo from "./backend/database/venues.json";
  import config from "./config.json";

  // Variable Declaration
  var free_slot_generated = true;
  var num_links = 1;
  var loading = false;
  let free_slot_arr = [];
  var venue_slot = [];
  var buttons = "";
  var filterText;
  var wrongSemester = false;
  let submitHasBeenClicked = false;

  var long = "1.2966";
  var lat = "103.7764";
  var active_venue;
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

  var query_semester;

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
    weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12", "Week 13"];
  } 
  else 
  {
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

  // This portion add the number of links, link count add by 1
  const addField = () => {
    num_links += 1;
  };

  // This portion remove the number of links, link count substract by 1
  const removeField = (div) => {
    num_links -= 1;
  };

  let list_of_modules = new Map();
  // Semester dict
  const semester = { "sem-1": "semester1", "sem-2": "semester2", "st-i": "specialterm1", "st-ii": "specialterm2"};

  // Lesson type dict
  const lesson_type = {LEC: "Lecture", TUT: "Tutorial", SEC: "Sectional Teaching", LAB: "Laboratory", PTUT: "Packaged Tutorial", PLEC: "Packaged Lecture"};

  // Lesson slot start with an initial value of ["0800", "0800"]
  var lesson_slot = { Monday: [["0800", "0800"]], Tuesday: [["0800", "0800"]], Wednesday: [["0800", "0800"]], Thursday: [["0800", "0800"]], Friday: [["0800", "0800"]]};

  // This portion is computed when the button is click. To find the timeslot available
  async function submitLink() {

    if (submitHasBeenClicked) {
      return;
    }

    // Initialise the variables
    free_slot_generated = false;
    wrongSemester = false;
    submitHasBeenClicked = true;
    error_message_no_rooms = "";
    empty_count = 0;
    error_message_empty = "";
    error_message_wrong_sem = "";
    error_message_invalid_timetable = "";    
    free_slot_arr = [];
    venue_slot = [];
    message = "";
    

    // Variable Declaration
    let list_of_modules = new Map();
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
    const el = document.querySelector("#start_periods_div");
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
    });

    var response;
    (async () => {
      // const ay = "2022-2023"; // Manually keyed in if json file doesnt load.
      const ay = AcademicYear.AY;
      message = "";

      // This part here will be the error checking.
      for (var i = 0; i < nus_tt_links.length; i += 1) {
        if (nus_tt_links[i] == "") {
          empty_count += 1;
        } 
        else 
        {
          each_timetable_module = nus_tt_links[i].split("?");

          // A valid timetable will be able to successfuly split into 2
          if (each_timetable_module.length != 2) 
          {
            // So if it's not a valid timetable, stop the process
            error_message_invalid_timetable = "Please insert a valid timetable.";
            wrongSemester = true;
            free_slot_generated = true;
            submitHasBeenClicked = false;
          } 
          else 
          {
            // Check for any matching
            var sem = each_timetable_module[0].match("(sem-1)|(sem-2)|(st-ii)|(st-i)")[0];

            if ( sem != "sem-1" && sem != "sem-2" && sem != "st-ii" && sem != "st-i") 
            {
              // If there is no matching semester, generate error message for valid timetable
              error_message_invalid_timetable = "Please insert a valid timetable.";
              wrongSemester = true;
              free_slot_generated = true;
              submitHasBeenClicked = false;
            } 
            else 
            {
              // If semesrter is wrong, ask for correct semester
              if (checkSemester[sem] != query_semester) {
                error_message_wrong_sem = "Please use timetable that corresponds to the correct semester.";
                wrongSemester = true;
                free_slot_generated = true;
                submitHasBeenClicked = false;
              }
            }
          }
        }
      }

      // This 2 if function will check for the error. If there is error, no processing will be done.
      if (empty_count == nus_tt_links.length) {
        error_message_empty = "Please insert in at least one text field.";
        free_slot_generated = true;
        const el = document.querySelector("#end_of_error_div");
        if (!el) return;
        el.scrollIntoView({
          behavior: "smooth",
        });
        return;
      }

      if (wrongSemester) {
        const el = document.querySelector("#end_of_error_div");
        if (!el) return;
        el.scrollIntoView({
          behavior: "smooth",
        });

        return;
      }

      //This for-loop is for each links.
      for (let i = 0; i < nus_tt_links.length; i += 1) {
        if (nus_tt_links[i] != "") {
          //Splitting the links into 2 parts. The first part contains the semester while the second part contains the timetable itself
          each_timetable_module = nus_tt_links[i].split("?");
          //Splitting the timetable into each individual modules
          var each_module_class = each_timetable_module[1].split("&");

          
          var sem = each_timetable_module[0].match("(sem-1)|(sem-2)|(st-ii)|(st-i)")[0];

          wrongSemester = false;
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

              // data is the response from API call
              var data = await response.json();

              // Push each of the timeslot into the specific day
              for ( var class_num = 0; class_num < data["result"].length; class_num += 1) 
              {
                lesson_slot[data["result"][class_num]["LessonDay"]].push([data["result"][class_num]["StartTime"], data["result"][class_num]["endTime"],]);
              }
            }
          }

          // Clear the module list
          module_list.clear();
        }
      }

      for (const [key, value] of Object.entries(lesson_slot)) {
        //2200 is the end of the search. Can be change to differnt class timing. But take note that the class in NUS ends latest at 9pm
        lesson_slot[key].push(["2200", "2200"]);
        value.sort();

        //Check through the classes each day
        for (var i = 0; i < value.length - 1; i += 1) {
          //Check if there is any slots in between each classes
          if (parseInt(value[i][1]) < parseInt(value[i + 1][0])) {
            //Append the message if there is a free slot
            if (!free_slot_arr.includes({slotid: key, start: value[i][1], end: value[i + 1][0],}))
            {
              free_slot_arr.push({slotid: key, start: value[i][1], end: value[i + 1][0],});
              free_slot_arr = [...free_slot_arr];
              num_timeslots += 1;
            }   
          }
        }
      }
      const el = document.querySelector("#end_of_error_div");
      if (!el) return;
      el.scrollIntoView({
        behavior: "smooth",
      });
      // Stop the generation and the loading animation
      free_slot_generated = true;
      submitHasBeenClicked = false;
    })();
  }

  // The portion that generates the google map
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

    // If there's no venue, then show none
    if (VenueInfo[venue] == null || VenueInfo[venue].location.y == null || VenueInfo[venue].location.x == null) 
    {
      embbed_map = "none";
    } 
    else 
    {
      // Else show the venue through embed map variable
      long = VenueInfo[venue].location.y;
      lat = VenueInfo[venue].location.x;
      embbed_map = "<iframe style='filter: invert(85%)' class='w-full h-96' src='https://www.google.com/maps/embed/v1/place?q=" + long + "," + lat + "&amp;key=" + config["MAP_API_KEY"] + "&center=" + long + "," + lat + "&zoom=19'></iframe>";
    }
    const el = document.querySelector("#end_of_error_div");
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
    });
  }

  // This portion gets the location of the selected venue
  async function getLocation( freeslot_day, starttime, endtime, selected_semester, week) 
  {
    // Initialise variable
    venue_slot = [];
    loading = true;
    error_message_no_rooms = "";
   
    // This portion will show the user which button is selected

    // Remove the current active 
    if (document.getElementsByClassName("freeslot_active").length == 1) {
      let current = document.getElementsByClassName("freeslot_active");
      current[0].className = current[0].className.replace(" freeslot_active","");
    }

    // Add the active freeslot
    document.getElementsByClassName(freeslot_day + "_" + starttime + "_" + endtime)[0].className += " freeslot_active";

    // Does an API Call
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

    // data is the api response 
    var data = await response.json();
    buttons = "";
    for (var i = 0; i < data["result"].length; i += 1) {
      for (var j = 0; j < data["result"][i]["Availability Timeslot"].length; j += 1) 
      {
        // If the venue fits
        if ( data["result"][i]["Availability Timeslot"][0][0] <= starttime && data["result"][i]["Availability Timeslot"][0][1] >= endtime && data["result"][i]["Day"] == freeslot_day) 
        {
          if (!venue_slot.includes(data["result"][i]["Venue"])) {
            venue_slot.push(data["result"][i]["Venue"]);
            venue_slot = [...venue_slot];
          }
        }
      }
    }

    // If the length of the venue is 0, it means there are no rooms available.
    if (venue_slot.length == 0) {
      error_message_no_rooms = "There are no rooms available";
    } 
    else 
    {
      // Else append the buttons with the elements
      for (var i = 0; i < venue_slot.length; i += 1) 
      {
        buttons += "<button class='VenueButton' id = '" + venue_slot[i] + "'>" + venue_slot[i] + "</button>";
      }

      const el = document.querySelector("#end_of_error_div");
      if (!el) return;
      el.scrollIntoView({
        behavior: "smooth",
      });
    }
    loading = false;

    const el = document.querySelector("#end_of_error_div");
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
    });
  }

  // Function to go to the NUSMods
  async function visitNUSMODS() {
    const checkSemesterInv = { "Semester 1": "sem-1", "Semester 2": "sem-2", "Special Term 1": "st-i", "Special Term 2": "st-ii",};

    let url = "https://nusmods.com/timetable/" + checkSemesterInv[query_semester];

    window.open(url);
  }
</script>


<div>
  <!-- Title portion -->
  <div class="text-center font-extrabold ">
    <div class="font-extrabold 2xl:mt-40 2xl:mb-10 xl:mt-40 xl:mb-10 lg:mt-32 lg:mb-5 mt-16 mb-2 mx-2.5">
      <span class=" 2xl:text-6xl xl:text-5xl lg:text-5xl md:text-4xl text-3xl bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-sky-600">
        <strong>Free Period Search</strong>
      </span>
    </div>
  </div>

  <!-- Overview -->
  <p class="text-gray-400 text-center font-extrabold mt-10 mb-4 2xl:text-3xl xl:text-3xl lg:text-2xl md:text-xl text-lg mx-4">
    This function helps teams with different timetable to find suitable timeslots to meet up.
  </p>
  <br />

  <!-- Instructions -->
  <div>
    <p class="text-white text-center font-bold   2xl:text-3xl lg:text-2xl md:text-xl text-xl mx-4">
      STEPS TO RETRIEVE TIMETABLE LINKS:
    </p>
    <br />
    <!-- Select Semester Portion -->
    <div class="flex justify-center">
      <label for = "select_semester" class="text-gray-300 2xl:text-3xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-medium bg mr-4">1. Select Semester</label>
      <!-- Dropdown to select semester -->
      <select id="semester" class="border border-gray-300 bg-[#202124] text-white rounded-lg border-2 2xl:text-3xl xl:text-3xl lg:text-2xl md:text-xl text-lg" bind:value={query_semester}>
        <option>Semester 1</option>
        <option>Semester 2</option>
        <option>Special Term 1</option>
        <option>Special Term 2</option>
      </select>
    </div>

    <!-- The link portion to bring to the selected semester -->
    <div class="text-sky-500 text-center">
      <button title="Click to visit NUSMODS!" class=" text-center border-none 2xl:text-3xl xl:text-3xl lg:text-2xl md:text-xl text-lg mx-4 font-bold hover:text-white active:text-[#3f3f46]" on:click={visitNUSMODS}>
        <u>2. Visit NUSMODS in {query_semester}!</u>
        <i class="fa fa-exclamation-circle"/>
      </button>
    </div>
    
    <!-- 3rd instruction -->
    <p class="text-gray-400 text-center   2xl:text-3xl xl:text-3xl lg:text-2xl md:text-xl text-lg mx-4">
      3. Click on Share/Sync button and click on copy link logo beside the link.
    </p>

    <!-- 4th instruction -->
    <p class="text-gray-400 text-center   2xl:text-3xl xl:text-3xl lg:text-2xl md:text-xl text-lg mx-4">
      4. Paste it in the text field shown below.
    </p>

    <!-- 5th instruction -->
    <p class="text-gray-400 text-center mb-8   2xl:text-3xl xl:text-3xl lg:text-2xl md:text-xl text-lg mx-4">
      5. Click on 'Add more links' to generate more text field. Otherwise, click on 'Find Time' to start computation.
    </p>
  </div>
</div>
<br />

<!-- Text field to display dynamically the textfield -->
{#each Array(num_links) as _, i}
  <div class="grid grid-cols-1 gap-4 text-center lg:mx-64 md:mx-32">
    <input class=" appearance-none border-2 border-gray-300 rounded-md  focus:outline-none focus:border-sky-500 bg-[#202124] text-center lg:text-2xl md:text-xl sm:text-md my-1 text-sky-500 focus:placeholder-stone-700/50 focus:bg-[#202124] mx-4" autocomplete="off" name="DynamicField" type="text" id={`link_${i}`} placeholder="https://nusmods.com/timetable/sem-1/share?CS1010=LEC:01" />
  </div>
{/each}


<div class=" text-center content-center">
  <!-- If there is more than 1 link, then have a button to remove link -->
  {#if num_links > 1}
    <input type="button" value="- Remove last timetable link" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium bg-gradient-to-r from-pink-600 to-sky-600 rounded-lg border-none text-gray-50 font-bold hover:from-sky-600 hover:to-teal-600" on:click={removeField}/>
  {/if}

  <!-- If there is less than 5 links, then have a button to add link -->
  {#if num_links < 5}
    <button on:click|preventDefault={addField} class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium bg-gradient-to-r from-pink-600 to-sky-600 rounded-lg border-none text-gray-50 font-bold hover:from-sky-600 hover:to-teal-600">
      + Add more links
    </button>
  {/if}

  <!-- Button to find time -->
  <button on:click|preventDefault={submitLink} class="mt-8 py-2.5 px-5 mb-2 text-sm font-medium bg-sky-500 border-none text-white font-bold rounded-md shadow-lg shadow-sky-500/50 hover:bg-cyan-500 hover:shadow-cyan-500/50">
    <strong>Find Time</strong>
  </button>
</div>


<div class="grid grid-cols-1 justify-items-center" id="start_periods_div">
  <!-- If the free slot is not generated, then have a loading bar -->
  {#if !free_slot_generated}
    <br />
    <img src="loading_bar.svg" alt="" />
  {/if}

  <!-- If there is free slots then run -->
  {#if num_free_slot}
    <!-- Dropdown to select week number -->
    <div class="grid grid-cols-1 justify-items-center">
      <div class="grid grid-cols-2">
        <p class="text-white font-semibold text-end mr-4 2xl:text-xl 2xl:mt-10 2xl:mb-3 xl:text-xl xl:mt-10 xl:mb-3 lg:text-xl lg:mt-10 lg:mb-3 text-lg mt-5 mb-1.5 inline-block align-bottom">
          Select week number:
        </p>
        <select class="border border-gray-300 bg-[#202124] text-white rounded-lg border-1 block 2xl:text-xl 2xl:mt-10 2xl:mb-3 xl:text-xl xl:mt-10 xl:mb-3 lg:text-xl lg:mt-10 lg:mb-3 text-lg mt-5 mb-1 max-h-full focus:outline-none focus:border-sky-500 my-0.5 " bind:value={week}>
          <!-- Show the number of weeks -->
          {#each weeks as week_num}
            <option>{week_num}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}

  <br />

  <!-- Show the free slot -->
  <div class="justify-items-center mb-5" contenteditable="false">
    {#each free_slot_arr as { slotid, start, end }}
      <!-- Show each of the free slot in terms of button -->
      <button class=" TimingButton mb-3 text-lg font-medium text-sky-600 hover:rounded-lg hover:text-white {slotid}_{start}_{end}" id={slotid + "_" + start + "_" + end} on:click={getLocation(slotid, start, end, query_semester, week)}>
        {slotid + ": " + start + " - " + end}
      </button>
      <br />
    {/each}
  </div>
</div>


<div class="grid grid-cols-1 justify-items-center">
  <!-- if loading, show loading bar -->
  {#if loading}
    <img src="loading_bar.svg" alt="" />
  {/if}
</div>

<!-- Show this part only if screen size is medium and small -->
<div class="2xl:invisible xl:invisible lg:invisible">
  {#if embbed_map != "none" && embbed_map != ""}
    <h3 class="text-sky-200 text-center md:text-xl sm:text-xl mt-5">
      Please scroll down to view the map...
    </h3>
    <br /><br />
  {/if}
</div>

<!-- Genereate the button and the map -->
{#if venue_slot.length != 0}
  <div class="grid grid-cols-1 justify-items-center mb-3">
    <!-- Title -->
    <p class="font-extrabold 2xl:text-5xl lg:text-5xl  md:text-3xl text-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-sky-500 ">
      Available Venues
    </p>
  </div>

  <div class="grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 mx-4">
    <!-- Button portion -->
    <div class="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-4 grid-cols-2 overflow-y-auto mb-10 overscroll-y-none h-96">
      <!-- Search Bar -->
      <input type="text" bind:value={filterText} class="font-semibold text-sky-500 focus:placeholder-gray-600 bg-[#202124] border-2 border-sky-500 focus:outline-none text-sky-500 2xl:col-span-5 xl:col-span-4 lg:col-span-4 col-span-2 h-6 mx-5 mt-2" placeholder=" Enter the venue..."/>

      
      {#if filterText != "" && filterText != undefined}
        <!-- If there is something in the search bar -->
        {#each venue_slot as venue}
          {#if venue.toLowerCase().includes(filterText.toLowerCase())}
            <!-- Produce a button if venue match the search bar -->

            {#if venue == active_venue}
              <button class="VenueButton py-2.5 px-5 mr-2 mb-2 text-sm font-medium h-8 text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue} active" contenteditable="false" on:click={() => getMap({ venue })}>
                {venue}
              </button>
            {:else}
              <button class="VenueButton py-2.5 px-5 mr-2 mb-2 text-sm font-medium h-8 text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue}" contenteditable="false" on:click={() => getMap({ venue })}>
                {venue}
              </button>
            {/if}
            
              
          {/if}
        {/each}
      {:else}
        <!-- There is nothing in the search bar -->
        {#each venue_slot as venue}
          {#if venue == active_venue}
            <!-- Active button -->
            <button class="VenueButton py-2.5 px-5 mr-2 mb-2 text-sm font-medium h-8 text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue} active" contenteditable="false" on:click={() => getMap({ venue })}>
                {venue}
            </button>
          {:else}
            <!-- Non active button -->
            <button class="VenueButton py-2.5 px-5 mr-2 mb-2 text-sm font-medium h-8 text-sky-600 hover:rounded-lg hover:bg-sky-600 hover:text-white {venue}" contenteditable="false" on:click={() => getMap({ venue })}>
              {venue}
            </button>
          {/if}
        {/each}
      {/if}
    </div>

    <!-- Map portion -->
    <div class="md:mb-10 sm:mb-10 ">
      <!-- Button has not been pressed -->
      {#if embbed_map == ""}
        <div class="text-sky-500 2xl:text-2xl xl:text-xl lg:text-xl md:text-xl text-lg text-center">
          Please click on any of the class to view the map
        </div>
      {/if}

      <!-- Map not available -->
      {#if embbed_map == "none"}
        <div class="text-red-800 2xl:text-2xl xl:text-xl lg:text-xl md:text-xl text-lg text-center font-bold">
          Sorry the map is currently unavailable.
        </div>
      {/if}

      <!-- Map available -->
      {#if embbed_map != "none" && embbed_map != ""}
        <div
          class="border-2 border-sky-500 ml-2"
          bind:innerHTML={embbed_map}
          contenteditable="false"
        />
      {/if}
    </div>
  </div>
{/if}

<!-- Error message empty field -->
<h3 class="text-center text-red-700 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl">
  <strong>{error_message_empty}</strong>
</h3>

<!-- Error message invalid timetable -->
<h3 class="text-center text-red-700 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl">
  <strong>{error_message_invalid_timetable}</strong>
</h3>

<!-- Error message wrong semester -->
<h3 class="text-center text-red-700 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl">
  <strong>{error_message_wrong_sem}</strong>
</h3>

<!-- Error message no rooms -->
<h3 class="text-center text-red-700 text-xl 3xl:text-3xl xl:text-3xl lg:text-2xl md:text-2xl">
  <strong>{error_message_no_rooms}</strong>
</h3>

<br /><br /><br />
<div id="end_of_error_div" />

<style>
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

  .freeslot_active {
    color: white;
  }

  .active {
    background-color: #0284c7;
    color: white;
  }


</style>
