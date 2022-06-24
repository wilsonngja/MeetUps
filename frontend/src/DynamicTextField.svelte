<script>

// import { start } from "repl";

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
  $: num_free_slot = free_slot_arr.length; // if theres more than 1 free slot in the free_slot_arr. become true


  var today_date = new Date();
  var sem1_start_date = AcademicYear['Sem 1'].split('-');
  var sem1 = new Date(sem1_start_date[0], sem1_start_date[1] - 1, sem1_start_date[2]);
  var sem2_start_date = AcademicYear['Sem 2'].split('-');
  var sem2 = new Date(sem2_start_date[0], sem2_start_date[1] - 1, sem2_start_date[2]);
  var st1_start_date = AcademicYear['Special Term 1'].split('-');
  var st1 = new Date(st1_start_date[0], st1_start_date[1] - 1, st1_start_date[2]);
  var st2_start_date = AcademicYear['Special Term 2'].split('-');
  var st2 = new Date(st2_start_date[0], st2_start_date[1] - 1, st2_start_date[2]);
  var query_semester = "";
  
  const apiURL = config["API_LINK"];

  if ((today_date >= sem1_start_date) && (today_date < sem2_start_date))
  {
    query_semester = "Semester 1";
  } else if ((today_date >= sem2_start_date) && (today_date < st1_start_date))
  {
    query_semester = "Semester 2";
  }
  else if ((today_date >= st1_start_date) && (today_date < st2_start_date))
  {
    query_semester = "Special Term 1";
  }
  else
  {
    query_semester = "Special Term 2";
  }




  var week;
  var weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
  $: if (
    query_semester == "Semester 1" ||
    query_semester == "Semester 2"
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

  const checkSemester = {
    "sem-1": "Semester 1",
    "sem-2": "Semester 2",
    "st-i": "Special Term 1",
    "st-ii": "Special Term 2",
  };

  //Message will be the message that will be printed out
  var message = "";
  var error_message = "";

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

      if (
        val.match(
          "(https://nusmods.com/timetable/)((st-ii)|(st-i)|(sem-2)|(sem-1))(/share?)(.{1,})"
        ) == null
      ) {
        error_message =
          "Please enter timetable in the correct format or remove empty text field.";
        free_slot_generated = true;
        return;
      } else {
        error_message = "";
        nus_tt_links.push(val);
      }
    }

    var response;
    (async () => {
      // const ay = "2022-2023"; // Manually keyed in if json file doesnt load.
      const ay = AcademicYear.AY;
      message = "";

      for (var i = 0; i < nus_tt_links.length; i += 1)
      {
        each_timetable_module = nus_tt_links[i].split("?");
        //Splitting the timetable into each individual modules
        var each_module_class = each_timetable_module[1].split("&");
        var sem = each_timetable_module[0].match(
          "(sem-1)|(sem-2)|(st-ii)|(st-i)"
        )[0];


        if (checkSemester[sem] != query_semester)
        {
          error_message = "Please use timetable that corresponds to the correct semester.";
          wrongSemester = true;
          free_slot_generated = true;
        }
        
        if (wrongSemester)
        {
          return;
        }
      }
      
      //This for-loop is for each links.
      for (let i = 0; i < nus_tt_links.length; i += 1) {
        
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
    
      for (const [key, value] of Object.entries(lesson_slot)) {
        //2359 is the end of the search. Can be change to differnt class timing. But take note that the class in NUS ends latest at 9pm
        lesson_slot[key].push(["2359", "2359"]);
        value.sort();

        //Check through the classes each day
        for (var i = 0; i < value.length - 1; i += 1) {
          //Check if there is any slots in between each classes
          if (parseInt(value[i][1]) < parseInt(value[i + 1][0])) {
            //Append the message if there is a free slot
            // temp_str = "";
            // temp_str =
            //   id : key + ":" + value[i][1] + "-" + value[i + 1][0] + "<br/>";

            message +=
              key + ": " + value[i][1] + "-" + value[i + 1][0] + "<br/>";
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
      
    
      free_slot_generated = true;
    })();
  }


  async function getMap({ venue }) {
    //reset the values before search
    url = "";
    

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

  async function getLocation(freeslot_day , starttime , endtime, selected_semester, week){
    venue_slot = [];
    error_message = "";
    loading = true;

    const response = await fetch(apiURL, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "venue",
        semester: selected_semester,
        req_week: week
      }),
    });

    var data = await response.json();
    buttons = "";
    for (var i = 0; i <data["result"].length; i += 1)
    {
      for (var j = 0; j < data["result"][i]["Availability Timeslot"].length; j += 1)
      {
        if ((data["result"][i]["Availability Timeslot"][0][0] <= starttime) && 
        data["result"][i]["Availability Timeslot"][0][1] >= endtime && data["result"][i]["Day"] == freeslot_day)
        {
          if (!venue_slot.includes(data["result"][i]["Venue"]))
          {
            venue_slot.push(data["result"][i]["Venue"]);
            venue_slot = [...venue_slot];
          }
        }
      }
    }

    if (venue_slot.length == 0)
    {
      error_message = "There are no rooms available";
      
    }
    else
    {
      for (var i = 0; i < venue_slot.length; i += 1)
      {
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


<div>
  <h3><strong>Free Period Search For Current Semester</strong></h3>
  <h4><strong>Current Semester: {query_semester}</strong></h4> 
  <p>Find your Time and Space !</p>
</div>

{#each Array(num_links) as _, i}
  <div>
    <input
      class="ttLink"
      name="DynamicField"
      type="text"
      size="121"
      id={`link_${i}`}
      placeholder="Enter Timetable Link!"
    />
  </div>
{/each}

{#if num_links > 1}
  <input
    type="button"
    value="- Remove last timetable link"
    on:click={removeField}
  />
{/if}

{#if num_links < 5}
  <button on:click|preventDefault={addField}>+ Add link</button>
{/if}

<button on:click|preventDefault={submitLink}>
  <strong>Find Time</strong></button
>
{#if !free_slot_generated}
  <br />
  <img src="dual_ring.svg" alt="" />
  <!-- <p>{message}</p> -->
{/if}

<!-- <div class="freeslot_div" contenteditable="false" bind:innerHTML={message}>
  <p>{message}</p>
</div> -->
{#if num_free_slot}
  <!-- svelte-ignore a11y-label-has-associated-control -->
   
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <select bind:value={week}>
    {#each weeks as week_num}
      <option>{week_num}</option>
    {/each}
  </select>
{/if}

<br>
<br>


<div class="freeslot_div" contenteditable="false">
  <!-- <p>button outputs</p> -->
  {#each free_slot_arr as { slotid, start, end }}
    <button id={slotid + "_" + start + "_" + end} on:click={getLocation(slotid, start ,end, query_semester, week)}>
      {slotid + ": " + start + " - " + end}
    </button>
    <br />
  {/each}
</div>





<!-- <div class="button_div" contenteditable="false" bind:innerHTML={buttons} /> -->
<div class="VenueDiv">
  {#if loading}
    <img src="dual_ring.svg" alt="" />
  {/if}

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
</div>
<h3><strong>{error_message}</strong></h3>

<style>
  button {
    background: #533a7b;
    color: white;
    border: none;
    font-size: 1em;
    padding: 8px 12px;
    border-radius: 2px;
    text-align: center;
  }

  h3 {
    color: #377395;
    font-size: 1.5em;
    font-weight: 100;
    text-align: center;
  }

  h4 {
    font-size: 20px;
    color: #377395;
  }

  /* .freeslot_div{
    float:left;
    width:20%;
  } */
</style>
