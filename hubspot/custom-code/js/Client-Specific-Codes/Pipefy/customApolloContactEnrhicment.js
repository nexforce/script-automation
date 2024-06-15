const axios = require('axios');

exports.main = async (event, callback) => {
  console.log('Starting main function');

  const email = event.inputFields['email'];
  const firstName = event.inputFields['first_name'];
  const lastName = event.inputFields['last_name'];

  console.log('Input fields:', { email, firstName, lastName });

  const apiUrl = 'https://api.apollo.io/v1/people/match';
  const apiKey = 'H3ngsGWvy86I0dRsdk0QgQ'; 
  
  try {
    console.log('Making API request to:', apiUrl);

    const response = await axios.post(apiUrl, {
      api_key: apiKey,
      first_name: firstName,
      last_name: lastName,
      email: email
    });

    
    const person = response.data.person;

    let outputFields = {
      APO_City: person.city,
      APO_Company_Name: person.organization.name,
      APO_Company_Size: person.organization.estimated_num_employees,
      APO_Country: person.country,
      APO_Job_Title: person.title,
      APO_Last_Name: person.title,
      APO_Linkedin_url: person.linkedin_url,
      APO_State: person.state      
    };

    console.log('Output fields:', outputFields);

    callback({
      outputFields: outputFields
    });
  } catch (error) {
    console.error('Error calling Apollo API:', error);
    callback(error);
  }
};