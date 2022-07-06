<script>
  import { get } from "svelte/store";
  // import TopBackground from "./BackgroundTop.svelte";
  import Venue from "./Venue.svelte";
  import Freeslot from "./Freeslot.svelte";
  import VenueInfo from "./backend/database/venues.json";
  import config from "./config.json";


  var selected = "Free Period Search";

  const webpages = [
		{ name: "Free Period Search", component: Freeslot},
		{ name: "Venue Search", component: Venue }
	];

  // Loads an object in webpages array
	let selectedPage = webpages[0];
	$: console.dir(selectedPage)
	
	// Have to use obj as arg. so value can be a class
	const loadPage = (obj) => {
    selectedPage = obj;
    selected = obj.name;
    console.log(selected);
  }
  
</script>
<main>

  <!-- Nav ba -->
<div class = "grid 2xl:grid-cols-6 xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-4 grid-cols-2 mt-5">
    
    {#if selected == "Free Period Search"}
      
      <button class = "border-0 text-sky-500 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 underline underline-offset-4 decoration-2 border-r-2 border-sky-500" 
                    title={webpages[0].name} on:click={() => loadPage(webpages[0])}>
                    {webpages[0].name}</button>

      <button class = "border-0 text-gray-300 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12" 
                      title={webpages[1].name} on:click={() => loadPage(webpages[1])}>
                      {webpages[1].name}</button>
    {/if}


    {#if selected == "Venue Search"}
    
      <button class = "border-0 text-gray-300 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 border-r-2 border-sky-500" 
                      title={webpages[0].name} on:click={() => loadPage(webpages[0])}>
                      {webpages[0].name}</button>
      
      <button class = "border-0 text-sky-500 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 underline underline-offset-4 decoration-2" 
                      title={webpages[1].name} on:click={() => loadPage(webpages[1])}>
                      {webpages[1].name}</button>
    {/if}
    
              
</div>

<!-- Loaded component/webpage -->
<svelte:component this={selectedPage.component} />


  
  
</main>



<style>
  :global(body){
    background-color: #242124;
  }
</style>
