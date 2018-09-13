export async function getOpenTickets(key, baseUri, call) {
  console.log('lookup tickets:', call);

  let ticketData
  let digitsOnlyPhoneNumber = call.from.replace(/\D/g, "")

  let userResbyPhone = await fetch(baseUri + "/api/v2/contacts?phone=" + digitsOnlyPhoneNumber, {
      headers: {
        'Authorization': 'Basic ' + btoa(key + ":blankPass"),
        "Content-Type": "application/json"
      }, 
      method: 'get'
  }).then(res =>{
    return res.json()
  }).catch(e =>{
    console.error("Issue creating ticket: ", e)
  })

  let userResByMobile = await fetch(baseUri + "/api/v2/contacts?mobile=" + digitsOnlyPhoneNumber, {
    headers: {
      'Authorization': 'Basic ' + btoa(key + ":blankPass"),
      "Content-Type": "application/json"
    }, 
    method: 'get'
  }).then(res =>{
    return res.json()
  }).catch(e =>{
    console.error("Issue creating ticket: ", e)
  })

  if(userResByMobile.length > 0){
    let tickets = await fetch(baseUri + "/api/v2/tickets?requester_id=" + userResByMobile[0].id, {
      headers: {
        'Authorization': 'Basic ' + btoa(key + ":blankPass"),
        "Content-Type": "application/json"
      }, 
      method: 'get'
    }).then(res =>{
      return res.json()
    }).catch(e =>{
      console.error("Issue creating ticket: ", e)
    })

    if(tickets[0].status != 4 && tickets[0].status != 5){
      ticketData = tickets[0]
    }
  }

  if(userResbyPhone.length > 0){
    let tickets = await fetch(baseUri + "/api/v2/tickets?requester_id=" + userResByMobile[0].id, {
      headers: {
        'Authorization': 'Basic ' + btoa(key + ":blankPass"),
        "Content-Type": "application/json"
      }, 
      method: 'get'
    }).then(res =>{
      return res.json()
    }).catch(e =>{
      console.error("Issue creating ticket: ", e)
    })

    if(tickets[0].status != 4 && tickets[0].status != 5){
      ticketData = tickets[0]
    }
  }

  console.log("Ticket data: " , ticketData)

  if(ticketData){
    return ticketData
  }else {
    return
  }
}

export async function getMeOnAnswer(key, baseUri){
  let me = await fetch(baseUri + "/api/v2/agents/me", {
    headers: {
      'Authorization': 'Basic ' + btoa(key + ":blankPass"),
      "Content-Type": "application/json"
    }, 
    method: 'get'
  }).then(res =>{
    return res.json()
  }).catch(e =>{
    console.error("Issue creating ticket: ", e)
  }) 

  return me
}

export async function createTicket(key, baseUri, call, me) {
  console.log('create ticket:', call);
  console.log("me: ", me)
  let ticketBody = {	
    description: "Phone Call", // Standardized Description - Worth deciding what we want this to be. 
    subject: "Inbound Phone Call to " + call.to, // Generic
    phone: call.from, // This is used by FreshDesk to search for the customer record
    priority: 1, // Lowest priority. Goes up to 4 which is Urgent. Leaving as '1' for now. 
    status: 2, // Open Status. 
    name: "Unknown", // Not used by FreshDesk to search for the customer record
    source: 3, // Phone call source
    type: "Incident", // Default Type.
    tags: ["Phone Call", call.to], // Tags used for searching. Phone Call, and the number they called
    group_id: 43000093974, // Hard coded group ID provided. NOT FOR PRODUCTION, but a group ID on the RC test freshdesk account. will need to be hardcoded for customer account when moving to their production
    responder_id: me.id // ensure responder (person who took call) is setup using the ID of the person that answered
  }

  let ticketData = await fetch(baseUri + "/api/v2/tickets", {
      headers: {
        'Authorization': 'Basic ' + btoa(key + ":blankPass"),
        "Content-Type": "application/json"
      }, 
      method: 'post',
      body: JSON.stringify(ticketBody)
  }).then(res =>{
    return res.json()
  }).catch(e =>{
    console.error("Issue creating ticket: ", e)
  })

  console.log(ticketData)
  return ticketData // returns ticket data to the web phone so it can track that ticket was created, and use its ID to update the ticket with call length
}

export async function updateTicket(key, baseUri, ticketId, call) {
  console.debug("Call data: ", call)
  // setup duration of call to determine call length, and put into a custom field on the ticket. length becomes a decimal, which is the only option that works with freshdesk for custom fields
  let duration = 0
  let endTime = new Date(call.endedTime)
  let startTime = new Date(call.startTime)
  duration = (endTime - startTime)/60000

  let udpateBody = {
    custom_fields: {
      cf_call_length: duration
    }
  }

  let ticketUpdate = await fetch(baseUri + "/api/v2/tickets/" + ticketId, {
      headers: {
      'Authorization': 'Basic ' + btoa(key + ":blankPass"),
      "Content-Type": "application/json"
    }, 
    method: 'put',
    body: JSON.stringify(udpateBody)
  }).then(res =>{
    return res
  }).catch(e =>{
    console.error("Issue updating ticket: ", e)
    return e
  })

  console.log(ticketUpdate)

  // let webphone know that ticket was successfully updated
  return ticketUpdate
}
