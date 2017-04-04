# Gaia Exercise

A NodeJS project that exposes a RESTful endpoint that returns preview video data fetched and reduced from multiple Gaia backend points.

## Solution Description

How to run this solution: (given Git, NodeJS, NPM, Gulp, Docker are installed)

+ git clone https://github.com/cprebble/gaia-exercise.git
+ run ```npm install```
+ run ```node server.js```
+ in a browser navigate to http://localhost:3000/terms/26681/longest-preview-media-url

To make a Docker image:
+ gulp dist
+ docker build -t gaia-service:1.0.0 . 

To run a Docker container:
+ docker run -d -p 3000:3000 -e "NODE_ENV=production" gaia-service:1.0.0
+ in a browser navigate to http://127.0.0.1:3000/terms/26681/longest-preview-media-url

To run the Docker container with specific environment variables, like logLevel: ```docker run -d -p 3000:3000 -e "NODE_ENV=production" -e "logLevel=debug" gaia-service:1.0.0```

#### Config
Configuration uses nconf which will look first in arguments, then environment variables, then in config/common.env. The backend urls are defined in common.env. They can be changed by adding an environment variable: ```export mediaUrl=http://d6api.gaia.com/giant-posters/{gpid}``` or by providing a process arg. e.g. ```vocabularyUrl=http://d6api.gaia.com/vocabulary/42/{tid} node server.js```

#### Logging
Bunyan logger produces JSON, and has plugins for streaming to ElasticSearch, Syslog, etc. The default stream is stdout but I've also implemented a rotatingFile stream. Change streams by changing your environment variable: ```export loggerStreams=rotatingFile``` or by providing a process arg: ```loggerStreams=stdout,rotatingFile node server.js``` Bunyan writes to both streams in the comma separated example.

Log level default is ```info```, and can be modified: ```logLevel=debug node server.js```

The logger is defined in helpers/logger.js. Each HTTP request is intercepted by ```connect-logger``` and output when logLevel=DEBUG.

#### Tests
I prefer to keep tests separate from source code; the easier to deploy to production without them. Unit and integration tests are in the test folder. ```npm test``` runs unit tests and coverage report. Other test scripts are included in package.json, e.g. ```npm run test-integration```.

I did not take the time at this time to test to 100% coverage. I hope this sampling suffices to demonstrate my abilities.

#### My Comments
I structured the code with readability, testability and maintainability in mind. Even though this is an exercise, the purpose of exposing an endpoint indicates a web service and the potentiality of exposing more endpoints in this service. Those new endpoints could be added to the existing controller or exposed in new controllers. More data points, i.e. endpoints, would help expose the service abstraction and criteria for best responsibility and encapsulation. Refactoring is a constant activity.

I separated out into their own classes vocabulary, videos and media to encapsulate access to the different object structures returned from the Gaia backend endpoints. Please note my ignorance of the organization of Gaia backend content. 

I've made some guesses about how this service might grow which impacted my decisions about what constitutes over-architecting vs creating enough structure to make it readable and extensible.

No authentication nor authorizations are included in this project. Except that offered by Github.

I took the opportunity to update the testing tools I use (I was using Mocha with QUnit syntax, and Rewire.js to stub out dependencies). I consider your suggestions to be recommendations. I still use Rewire for those hard-to-test controllers that depend on ExpressJS; where I want to unit test methods but don't really want to separate them into a different file from their dependencies; where testability competes with readability.

My past experience with linting has been less than useful. Eslint-plugin-promise was helpful in this exercise. I turned on eslint-config-standard and got over 4000 messages about spaces around my braces, extra semi-colons and blank lines. I took it out. The saga of 'just right' syntax continues. I leave it for another day.

I'm developing on a 13 inch MacBook Pro, v10.11.6. Docker v1.12.6 (v17.03.1-ce seems to have network bridge issues). Visual Studio Code.


## Opportunity Description
### Backend Code Challenge

Create an express application exposing a single endpoint (/terms/{tid}/longest-preview-media-url) that returns the longest preview media URL. The term id ({tid}) will be used to supply an initial, internal API call to the Gaia backend.

Your response from the endpoint should look something like this:

```
{
  "bcHLS": "https://www.gaia.com/api/brightcove/proxy/96371/master.m3u8?expiration=1455832800&token=c522231dbad02ae0d5a9676c8c9f9d8df86d2181280df53b46ab0b24b257458a",
  "titleNid": 100176,
  "previewNid": 96371,
  "previewDuration": 90
}
```
There are three endpoints you will need to use to accomplish this task: 
+ http://d6api.gaia.com/vocabulary/1/{tid}
+ http://d6api.gaia.com/videos/term/{tid} 
+ http://d6api.gaia.com/media/{previewNid}

Calls to the endpoints above should include the header Accept: application/json.

First, you’ll need to hit http://d6api.gaia.com/vocabulary/1/{tid} using the {tid} URL parameter in your endpoint path. Use 26681 for a testing {tid}. From this response, you’ll need to grab the first tid (26686) from the first object in the array from the terms property.

Second, you’ll hit http://d6api.gaia.com/videos/term/{tid} and supply {tid} with 26686 (retrieved programmatically).

Third, you’ll need to iterate over the response from http://d6api.gaia.com/videos/term/26686 and identify the preview node id (nid) (titles[i].preview.nid) that has the longest duration value (titles[i].preview.duration) from the array of objects from the titles property. note: this endpoint is paginated, but for this exercise you can use the first page of results

Finally, you’ll hit http://d6api.gaia.com/media/{nid} with the appropriate preview nid you determined in step 3. You’ll want to capture the URL from mediaUrls.bcHLS to include in your endpoint response.

Requirements:

+ Create a Github repo
+ Must run on Node LTS/boron
+ Must use Express library
+ Endpoint must return JSON
+ Errors must be handled and appropriate HTTP status codes returned

Here are some additional suggestions based upon our stack and coding practices:

+ Demonstrate knowledge of ES2015+ language features (include transpilation if necessary)
+ Demonstrate a firm grasp of asynchronous coding patterns (callbacks, promises, generators, async/await, whatever you prefer, but be consistent)
+ Demonstrate familiarity with testing node applications (both unit & integration tests as well as code coverage, we use mocha/chai/sinon/istanbul, but feel free to use whatever stack you're comfortable with)
+ Demonstrate a solid understanding of best practices regarding code/project organization and programming principles (SOLID, GRASP, 12 Factor App, etc)
+ Include a Dockerfile with instructions for testing & running