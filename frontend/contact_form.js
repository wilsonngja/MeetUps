// Handles the submission of contact form to supabase database


const { createClient } = supabase
      supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
      

      const form = document.querySelector('#contact-form')
      form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const formInputs = form.querySelectorAll('input,  textarea')

        let submission = {}

        formInputs.forEach(element => {
          const { value, name } = element
          if (value) {
            submission[name] = value
          }
        })
      

        //ATTEMPTS to insert submission values into database,
        //If cannot store items into supabase, 
        //then error messages would be generated.
        const { error } = await supabase.from('meetups_user_feedback').insert([submission], { returning: 'minimal' })

        if (error) {
          alert('There was an error please try again')
        } else {
          alert('Thanks for contacting us')
        }
        //Empties the text fields
        formInputs.forEach(element => element.value = '')

      })