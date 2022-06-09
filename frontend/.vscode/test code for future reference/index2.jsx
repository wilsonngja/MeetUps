import React from 'react';


var NewComponent = React.createClass({
  render: function () {
    return (
      <div>
        <title>W3.CSS Template</title>
        <meta charSet="UTF-8" />
        {/* <link rel="stylesheet" href="https://pyscript.net/alpha/pyscript.css"/> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css" />
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossOrigin="anonymous" />
          //  Linked to personal .css folder
        <link rel="stylesheet" href="style.css" />
        {/* Navbar (sit on top) */}
        {/* On click of the icons, would shift site layout to that division*/}&gt;
        <div className="w3-top w3-white">
          <div className="w3-bar " id="myNavbar">
            <a className="w3-bar-item w3-button w3-hover-black w3-hide-medium w3-hide-large w3-right" href="javascript:void(0);" onclick="toggleFunction()" title="Toggle Navigation Menu">
              <i className="fa fa-bars" />
            </a>
            <a href="#home" className="w3-bar-item w3-button">HOME</a>
            <a href="#about" className="w3-bar-item w3-button w3-hide-small"><i className="fa fa-user" /> ABOUT</a>
            {/* <a href="#portfolio" class="w3-bar-item w3-button w3-hide-small"><i class="fa fa-th"></i> PORTFOLIO</a> */}
            <a href="#contact" className="w3-bar-item w3-button w3-hide-small"><i className="fa fa-envelope" /> CONTACT</a>
            <a href="#find_space" className="w3-bar-item w3-button w3-hide-small"><i className="fa fa-pencil" /> FIND A TIME AND
              SPACE</a>
          </div>
          {/* Navbar on small screens */}
          <div id="navDemo" className="w3-bar-block w3-white w3-hide w3-hide-large w3-hide-medium">
            <a href="#about" className="w3-bar-item w3-button" onclick="toggleFunction()">ABOUT</a>
            {/* <a href="#portfolio" class="w3-bar-item w3-button" onclick="toggleFunction()">PORTFOLIO</a> */}
            <a href="#contact" className="w3-bar-item w3-button" onclick="toggleFunction()">CONTACT</a>
            <a href="#find_space" className="w3-bar-item w3-button" onclick="toggleFunction()">FIND A TIME AND SPACE</a>
            {/* <a href="#" class="w3-bar-item w3-button">SEARCH</a> */}
          </div>
        </div>
        {/* First Parallax Image with Logo Text */}
        <div className="bgimg-1 w3-display-container w3-opacity-min" id="home">
          <div className="w3-display-middle" style={{ whiteSpace: 'nowrap' }}>
            <span className="w3-center w3-padding-large w3-black w3-xlarge w3-wide w3-animate-opacity">
              MeetUps</span>
          </div>
        </div>
        {/* Container (Booking Section) */}
        <div className="w3-content w3-container w3-padding-64" id="find_space">
          <h3 className="w3-center"> Find your time and space!</h3>
          <form id="tt_link_process" action="/action_page.php" target="_blank">
            <div className="w3-row-padding" style={{ margin: '0 -16px 8px -16px' }}>
            </div>
            {/* For future reference regarding dynamic text fields*/}
            {/* https://stackoverflow.com/questions/50746868/how-to-add-input-fields-on-button-click */}
            <div>
              <input name="DynamicSuggestionCart" type="text" size={121} id="tt_link" placeholder="Enter NUSMods Timetable Link!" />
            </div>
            <div id="tt_space" />
            <input className="w3-button w3-black w3-section " type="button" id="btnAdd" onclick="AddSuggestionCart();" defaultValue="ADD TIMETABLES" />
            <button className="w3-button w3-black w3-right w3-section" type="button" id=" check_ava" onclick="checkAvaAPI();">
              <i className="fa fa-pencil" /> CHECK AVAILABILITIES
            </button>
          </form>
        </div>
        {/* Container (Free Period Output + weekly timetable) */}
        <div>
          <div style={{ width: '40%', float: 'left' }}>
            <h1 id="outputH1" />
            <h2 id="outputH2" />
          </div>
          {/*  Insert timetable on right */}
          <div style={{ width: '60%', float: 'right' }}>
              //---  Insert freeslots timetable on right
            {/* nusmods/website/src/views/timetable/Timetable.scss */}
            {/* https://www.sliderrevolution.com/resources/html-calendar/  > */}
          </div>
        </div>
        {/* Container (About Section) */}
        <div className="w3-content w3-container w3-padding-64" id="about">
          <hr />
          <h1 className="w3-center"> ABOUT MEETUPS</h1>
          <div className="w3-row ">
            <div className=" w3-center m6  w3-padding-large">
              <img src="wilson_ng.png" className="w3-round w3-image w3-opacity w3-hover-opacity-off" alt="Photo of Wilson" width={100} height={100} />
            </div>
            {/* Hide this text on small devices */}
            <div className=" m6 w3-hide-small w3-padding-large w3-center">
              <p>
                {/* Welcome to Meetups!<br>  */}
                Meetups is an NUS Orbital project founded by Wilson and Chin Han.<br />Meetups aim to make searching for unused
                NUS facilities easier through the integration of NUSMODS features! <br />
                We are both NUS Computer Engineering Major and we loveeee to code! <br />
                <strong>Fun fact:</strong> We were both from Singapore Polytechnic!!!
              </p>
            </div>
          </div>
          {/* Modal for full size images on click*/}
          <div id="modal01" className="w3-modal w3-black" onclick="this.style.display='none'">
            <span className="w3-button w3-large w3-black w3-display-topright" title="Close Modal Image"><i className="fa fa-remove" /></span>
            <div className="w3-modal-content w3-animate-zoom w3-center w3-transparent w3-padding-64">
              <img id="img01" className="w3-image" />
              <p id="caption" className="w3-opacity w3-large" />
            </div>
          </div>
          <div className="w3-row w3-center  w3-padding-16" />
          <hr />
          {/* Container (Contact Section) */}
          <div className="w3-content w3-container w3-padding-64 " id="contact">
            <h1 className="w3-center title"><strong>CONTACT US!</strong></h1>
            <div className="w3-row w3-padding-32 w3-section">
              <div className="w3-col m4 w3-container">
                <img src="meetups.png" className="w3-image w3-round" style={{ width: '100%' }} />
              </div>
              <div className="w3-col m8 w3-panel w3-center ">
                <div className="w3-large w3-margin-bottom">
                  <i className="fa fa-map-marker fa-fw w3-hover-text-black w3-xlarge w3-margin-right" /> National University of
                  Singapore <br />
                  <i className="fa fa-phone fa-fw w3-hover-text-black w3-xlarge w3-margin-right" /> Phone (Chin Han): 8723
                  0501<br />
                  <i className="fa fa-envelope fa-fw w3-hover-text-black w3-xlarge w3-margin-right" /> Email:
                  e0726814@u.nus.edu<br />
                </div>
                <p>Swing by for a cup of <i className="fa fa-coffee" />, or leave us a note:</p>
                <section className="section container">
                  <form name="contact" id="contact-form">
                    <h3 className="title " id="contact"><strong>Contact</strong></h3>
                    <div className="field">
                      <label className="label" htmlFor="name">Name</label>
                      <div className="control">
                        <input required className="input" type="text" placeholder="Name" name="name" />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="email">Email</label>
                      <div className="control has-icons-left">
                        <input className="input" type="email" required placeholder="Email" name="email" />
                        <span className="icon is-small is-left">
                          <i className="fas fa-envelope" />
                        </span>
                      </div>
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="message">Message</label>
                      <div className="control">
                        <textarea required className="textarea" placeholder="Feedback" name="message" defaultValue={""} />
                      </div>
                    </div>
                    <div className="field is-grouped">
                      <div className="control">
                        <button className="button is-primary" type="submit_feedback">Submit</button>
                      </div>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </div>
          {/*  */}
        </div></div>
    );
  }
});