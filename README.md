# My Test #

This is a personal test using React. 

The test require see below.

* Create a basic server in Node that returns whatever JSON is posted to it.

* Using React, create a web app with tow inputs:
     a. Toggle Queue 
     b. Send Request 

* "Toggle Queue" can be a checkbox or button, but it should control a Boolean variable. If it's true, then requests are added to a queue until there's 10 items in the queue, at which point they will all be sent simultaneously, but responses should be captured in the order they were added to the queue. If it is false, then reuqests should execute immediately.

* "Send Request" is a button that will send an AJAX request that contains POST data to the server. This can be any data, so long as the order it was sent in can be identified. It should always create an AJAX request to send to the server - whether or not it is executed should be left up to the queue manager. 

* Upon receiving responses, the response data should be displayed somewhere on the page.

### Installation ###
> You should start by cloning the repository into your local machine.
```bash
git clone https://github.com/songliqiangcn/my-test
cd my-test
npm install
npm start
```

### To Do ###
> You need to update the API URL to your API path.
The API function could be pretty simple, just returns JSON format data with prefix 'hello' to whatever is posted to it.
> Below is my PHP function using Slim.
```bash
public function myTest(Request $request, Response $response, array $args) {
    $data = $request->getParsedBody();

    $res =  "hello " . $data['requestKey'];
    return $response->withJSON($res);
}
```
