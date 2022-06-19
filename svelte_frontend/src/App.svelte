<script>
  //   export let name;
  import TopBackground from "./BackgroundTop.svelte";
  import DynamicTextField from "./DynamicTextField.svelte";
  // <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
</script>

<main>
  <TopBackground />
  <DynamicTextField />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
