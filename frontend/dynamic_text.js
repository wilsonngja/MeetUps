//This script dynamically adds or remove the text fields. 

// AddSuggestionCart() calls for GetDynamicSuggestionCart(), which
// would generate a text field with a "remove" button 


var num_links = 1;
      function GetDynamicSuggestionCart(value) {
        return '<input name = "DynamicSuggestionCart" type="text" size =111  id =tt_link  placeholder="Enter next timetable link! " value =  "' + value + '" />' +
          '<input type="button" value="Remove" onclick = "RemoveSuggestionCart(this)" />'
      }

      //  Adds up to 10 new divisions inclusive of the dynamic text field .
      function AddSuggestionCart() {
        if (num_links < 10) {
          var div = document.createElement('DIV');
          div.innerHTML = GetDynamicSuggestionCart("");
          document.getElementById("tt_space").appendChild(div); // Append timetable space
          num_links += 1;
        }
        else {
          alert('Max 10 timetable links') 
        }
      }

      //Removes the entire division inclusive of it's text field. 
      function RemoveSuggestionCart(div) {
        document.getElementById("tt_space").removeChild(div.parentNode);
        num_links -= 1;
      }



      //Unnecessary code for future reference


      // function RecreateDynamicTextboxes() {
      //   var comments_data = eval('<%=Values%>');
      //   if (comments_data != null) {
      //     var html = "";
      //     for (var i = 0; i < comments_data.length; i++) {
      //       html += "<div>" + GetDynamicSuggestionCart(comments_data[i]) + "</div>";
      //     }
      //     document.getElementById("tt_space").innerHTML = html;
      //   }
      // }
      // window.onload = RecreateDynamicTextboxes;
