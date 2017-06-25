# url2pic
A web service for fetching url and converting into image using headless Chromium.

## Introduction
This project is inspired by [url2png](https://www.url2png.com/).

I have no idea what technology behind that. But taking advantage of
[Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome), It quite easy to setup a
micro-service like it.

schnerd's [post](https://medium.com/@dschnr/using-headless-chrome-as-an-automated-screenshot-tool-4b07dffba79a) and
[repo](https://github.com/schnerd/chrome-headless-screenshots) help a lot.

## Usage

### Linux

#### Setup
// TODO

#### Run
// TODO

### Docker
// TODO

## Development

### prepare

#### yarn

````
brew install yarn
```

#### Global Binary
```
yarn global add pm2
```

### dev

start chromium headless rpc on your own (to avoid repeatedly restarting)
```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless --remote-debugging-port=9222
```

```
yarn dev
```