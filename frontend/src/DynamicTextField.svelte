<script>
  import AcademicYear from "./backend/database/start_date.json";

  var num_links = 1;
  let links = "";
  //Message will be the message that will be printed out
  var message = "";

  const addField = () => {
    num_links += 1;
    console.log(num_links);
  };

  const removeField = (div) => {
    num_links -= 1;
  };

  let list_of_modules = new Map();
  const semester = { "sem-1": 1, "sem-2": 2, "st-i": 3, "st-ii": 4 };
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
  const submitLink = () => {
    //Variable Declaration
    message = "";
    let list_of_modules = new Map();

    var each_module = [];
    var module_list = new Map();

    let num_timeslots = 0; // UnusedGlobal variable for use to generate out timetable.

    const tt_inputs = document.querySelectorAll("#ttLink");

    let nus_tt_links = [];
    let each_timetable_module = "";

    //Add text fields into array
    let loop_count = "";
    for (let i = 0; i < num_links; i += 1) {
      const val = document.getElementById(`link_` + i).value;
      nus_tt_links.push(val);
      // console.log(val);
    }

    // console.log(nus_tt_links);

    var response;
    (async () => {
      // const ay = "2022-2023"; // Manually keyed in if json file doesnt load.
      const ay = AcademicYear.AY;
      

      //This for-loop is for each links.
      for (let i = 0; i < nus_tt_links.length; i += 1) {
        //Splitting the links into 2 parts. The first part contains the semester while the second part contains the timetable itself
        each_timetable_module = nus_tt_links[i].split("?");
        //Splitting the timetable into each individual modules
        var each_module_class = each_timetable_module[1].split("&");

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
          console.log(i);
        }

        //Iterate into each of the modules
        for (const [key, value] of module_list.entries()) {
          //A sample API request
          var request_query =
            "https://api.nusmods.com/v2/" + ay + "/modules/" + key + ".json";
          response = await fetch(request_query, { method: "GET" }).then(
            (response) => response.json()
          );

          //Iterate into the json response (which contains the crucial part)
          for (const [key2, value2] of Object.entries(response.semesterData)) {
            for (const [key3, value3] of Object.entries(value2)) {
              //Check that the current dict is the right semester (Checked based on regex)
              if (
                value3 == semester[each_timetable_module[0].match(/\w+-\w/)[0]]
              ) {
                //If it's the right semester, iterate further
                for (const [key4, value4] of Object.entries(value2.timetable)) {
                  for (const [key5, value5] of value.entries()) {
                    //Check that the lesson type and class code is correct
                    if (
                      value4.classNo == value5 &&
                      value4["lessonType"] == lesson_type[key5]
                    ) {
                      //If it's the correct class, append into a class list where it stores the lesson time
                      lesson_slot[value4.day].push([
                        value4.startTime,
                        value4.endTime,
                      ]);
                    }
                  }
                }
              }
            }
          }
        }
        //After iterating one timetable, clear the module list and restart
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
            message += key + ": " + value[i][1] + "-" + value[i + 1][0] + "<br/>";
            num_timeslots += 1;
          }
        }
      }
      // console.log(num_timeslots);
      // alert(message);


    })();
  };
</script>

<div>
  <br />
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

<div class = "freeslot_div" contenteditable="true" bind:innerHTML={message}>
  <p>{message}</p> 
</div>


<style>
</style>
