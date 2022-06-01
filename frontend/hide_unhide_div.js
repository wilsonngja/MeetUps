//  Called when the the free periods has been successfully computer 
    
      function unhide_venues_div() {
        let x = document.getElementById("venues_disp_div");
        if (x.style.display === "none") {
          x.style.display = "block";
        } //else {
          //x.style.display = "none"; // to toggle back the screen
        //}
      }
     