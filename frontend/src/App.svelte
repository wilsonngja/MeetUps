<script>
  // Import required files
  import Venue from "./Venue.svelte";
  import Freeslot from "./Freeslot.svelte";
  import Venue_Availability from "./VenueAvailability.svelte"
  
  

  // 3 different webpages. 
  const webpages = [
    { name: "Free Period Search", component: Freeslot },
    { name: "Venue Search", component: Venue },
    { name: "Venue Availability", component: Venue_Availability},
  ];

  // Loads an object in webpages array
  var selectedPage = webpages[0];
  // Display Free Period Search by default
  var selected = "Free Period Search";

  // Have to use obj as arg. so value can be a class
  const loadPage = (obj) => {
    selectedPage = obj;
    selected = obj.name;
  };
</script>

<main>
  <!-- This portion is the navigation bar -->
  <div class="grid 2xl:grid-cols-6 xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-4 grid-cols-3 mt-5">

    <!-- Styling if selected component is free period search -->
    {#if selected == "Free Period Search"}

      <button class="border-0 text-sky-500 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 underline underline-offset-4 decoration-2 border-r-2 border-sky-500 active:text-[#202124] font-normal active:font-semibold" title={webpages[0].name} on:click={() => loadPage(webpages[0])}> 
        {webpages[0].name}
      </button>

      <button class="border-0 text-gray-300 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 active:text-[#202124] font-normal active:font-semibold" title={webpages[1].name} on:click={() => loadPage(webpages[1])}>
        {webpages[1].name}
      </button>

      <button class="border-0 text-gray-300 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 border-l-2 border-sky-500 active:text-[#202124] font-normal active:font-semibold" title={webpages[2].name} on:click={() => loadPage(webpages[2])}>
        {webpages[2].name}
      </button>

    {/if}

    <!-- Styling if selected component is venue search -->
    {#if selected == "Venue Search"}
      <button class="border-0 text-gray-300 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 border-r-2 border-sky-500 active:text-[#202124] font-normal active:font-semibold" title={webpages[0].name} on:click={() => loadPage(webpages[0])}>
        {webpages[0].name}
      </button>

      <button class="border-0 text-sky-500 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 underline underline-offset-4 decoration-2 active:text-[#202124] font-normal active:font-semibold" title={webpages[1].name} on:click={() => loadPage(webpages[1])}>
        {webpages[1].name}
      </button>

      <button class="border-0 text-gray-300 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 border-l-2 border-sky-500 active:text-[#202124] font-normal active:font-semibold" title={webpages[2].name} on:click={() => loadPage(webpages[2])}>
        {webpages[2].name}
      </button>
      
    {/if}

    <!-- Styling if selected component is venue availability -->
    {#if selected == "Venue Availability"}
      <button class="border-0 text-gray-300 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 border-r-2 border-sky-500 active:text-[#202124] font-normal active:font-semibold" title={webpages[0].name} on:click={() => loadPage(webpages[0])}>
        {webpages[0].name}
      </button>

      <button class="border-0 text-gray-300 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 active:text-[#202124] font-normal active:font-semibold" title={webpages[1].name} on:click={() => loadPage(webpages[1])}>
        {webpages[1].name}
      </button>

      <button class="border-0 text-sky-500 bg-[#202124] hover:bg-[#2e3036] 2xl:text-xl xl:text-lg lg:text-lg md:text-md text-lg h-12 border-l-2 border-sky-500 underline underline-offset-4 decoration-2 active:text-[#202124] font-normal active:font-semibold" title={webpages[2].name} on:click={() => loadPage(webpages[2])}>
        {webpages[2].name}
      </button>


    {/if}
  </div>

  <!-- Load the component -->
  <svelte:component this={selectedPage.component} />
</main>

<style>
  :global(body) {
    background-color: #242124;
  }
</style>
