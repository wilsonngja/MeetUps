<script>
  import { get } from "svelte/store";
  // import TopBackground from "./BackgroundTop.svelte";
  import Venue from "./Venue.svelte";
  import Freeslot from "./Freeslot.svelte";
  import VenueInfo from "./backend/database/venues.json";
  import config from "./config.json";






  const webpages = [
		{ name: "Free Period Search", component: Freeslot},
		{ name: "Venue Search", component: Venue }
	];

  // Loads an object in webpages array
	let selectedPage = webpages[0];
	$: console.dir(selectedPage)
	
	// Have to use obj as arg. so value can be a class
	const loadPage = (obj) => selectedPage = obj;
  
</script>
<main>

  <!-- Nav ba -->
<div class = "grid grid-cols-2">
	
  {#each webpages as webpageObj}
	<button class = "inline-block m-0 border-0 text-blue-600 bg-gray-100 rounded-t-2xl mr-2 bg-gray-800  dark:text-sky-600 hover:bg-gray-700 hover:text-white 2xl:text-2xl xl:text-xl lg:text-lg text-md" 
					title={webpageObj.name}
					on:click={() => loadPage(webpageObj)}>{webpageObj.name}</button>
{/each}

</div>

<!-- Loaded component/webpage -->
<svelte:component this={selectedPage.component} />


  
  
</main>



<style>
  :global(body){
    background-color: #242124;
  }
</style>
