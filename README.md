# Driver Drowsiness Detector
This repo contains the prototype of the admin page of a driver drowsiness detection software.

# API Documentation
## GET Methods
1. `/`\
Standard GET to check status of server.

2. `/getEverything`\
Get complete profiles of all drivers.

3. `/getProfileOf`\
Get complete profile of a single driver.

## POST Methods
1. `/addActivity`\
Send the activity of a certain driver. Follow the format:
```
payload = {
    "id" : id,
    "time": timestamp,
    "isDrowsy": isDrowsy
  }

```
