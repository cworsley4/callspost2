# callspost2 api*

###### Status - WIP
###### Last Updated - 5/8/16

### Idea
Map the IVRs ([Interactive Voice Response](https://en.wikipedia.org/wiki/Interactive_voice_response)) of Customer Service lines (1-800 numbers). For example, if I want to get to the Billing Department for Company A how do I get there? Well this system figures out that you need to call and press 5 to get there. The business application is having a web application that allows customers to "skip the line." It does that by accepting a customers phone number and the desired destination, billing. An automated system will call in, traverse the IVR until the desired location is reached then conference in the customer.

### Services Used
 - [Twilio](https://twilio.com)
   - Used to call and record calls.
 - [Speechmatics](https://speechmatics.com)
   - Used to Transcribe audio recorded by Twilio.
 - [IBM Watson: Speech to Text](https://ibm.com)
   - Just testing this out. Might do some A/B testing with Speechmatics
   
### Completed:
 - [x] Basic API to initiate phone calls.
 - [x] HTTP callbacks for Twilio Service
   
### TODO:
 - [ ] HTTP Callbacks for Speechmatics
 - [ ] Processing of speech text
 - [ ] DB schema and models for map persistance
   
`* => callspost2 is a nod to an old job of mine where callspost2 was the name of a file that managed incoming calls and initialized the IVR`
