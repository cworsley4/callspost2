package main

import "fmt"
import "time"
// import revel "github.com/revel/revel"
import twiliogo "github.com/carlosdp/twiliogo"

twilioClientId := 

func main() {

  client := twilio.NewClient("<ACCOUNT_SID>", "<AUTH_TOKEN>")
  var companies = []string{"+18007779898", "+18008924357"}

  for i := 0; i < len(companies); i++ {
    var phone = companies[i]
    call, err := twilio.NewCall(client, phone, "+16502354600", nil)

    timer := time.NewTimer(time.Minute)

    go func() {
      <-timer.C
      fmt.Println("Timer 2 expired")
    }()
  }

  select{}
}

