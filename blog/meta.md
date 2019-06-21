---
title: "Meta"
date: "2019-06-20T22:10:03.867Z"
---

We've reached new levels of meta. I've successfully programmed a tool that is useful to my programming endeavors, including the tool itself!

## The Problem

I like to include a demo screenshot in the readme files of my projects. Maybe I'll eventually make something useful enough that other people will want to use, and it would be nice to show my fellow programmers the [Jist](/) of what they're looking at on GitHub. It's even pretty nice for my own dumb sake, I've got probably a dozen or so projects I develop off and on.

![Screenshot](https://jist-screenshotter.herokuapp.com/desktop/https://github.com/jistjoalal/blog/blob/master/README.md)

The problem arose when I started adopting [Continuous Delivery/Deployment](https://en.wikipedia.org/wiki/Continuous_delivery) practices in my projects. Rapid iteration with automated tests and deployments doesn't just speed up my workflow, it's actually a lot of fun. So I try to get my apps in production as soon as possible, and don't really consider a change to be truly made until it's verified in production (or at least in a staging environment). It could be something as simple as adding a "Share", PWA "Install" button to an app, or just a link to the source code in the navbar.

![Screenshot](https://jist-screenshotter.herokuapp.com/desktop/https://cube-time.netlify.com/)

My latest project is a rubik's cube timer that is just a simple [CRA](https://github.com/facebook/create-react-app) app on [Netlify](https://www.netlify.com/) so I had very little hesitation pushing small changes (shit is fast). Unfortunately I get a bit OCD about the screenshot in the readme not reflecting the current state of the app, so I found myself repeatedly replacing it:

1. Implement changes and deploy
2. Become sad that my readme screenshot is out of date
3. Take a new screenshot with the Win10 snipping tool
4. Upload to imgur
5. Re-paste the image link from imgur into the readme
6. Re-deploy changes :/

That last step was the one really triggering me. Yeah I could setup branch deploys or something more involved so that every push to master wouldn't trigger a deploy (even just readme update, ugh). But my deploy sequence was so simple in VSCode, I was hesitant to do so. I mean just look at this:

1. Add+Commit all w/ "Ctrl+Enter"
2. Click Push

That's it. Changes online in less than 30 seconds, or maybe a couple minutes for dynamic apps.

Plenty of developers just stick their screenshots right in the repo, and that would have saved me a few steps. But "Bah!" I say, only code gets to live in the repo.

## The Solution (Promised Land)

In the beginning, it was just a dream. What if I had the images stored online somewhere so I wouldn't have to update the link? Even better, what if I had some magical link that would update the image itself? What would that even entail? I would need to create some magical web API capable of screenshotting web pages.

Let's take it even further. Some of my apps are really dynamic, updating content to the home page periodically/dynamically. I want those changes in the readme too. I want the screenshot to look _exactly like my app_. I want the screenshot to update _every time the screenshot for that app is requested_. So that's what I did.

## The Implementation

After a bit of research I decided to use [Puppeteer](https://pptr.dev/), a NodeJS library from Google for automating and controlling the Chrome/Chromium browser. It basically has everything I can imagine and more. If anything, my screenshotting project was just an introduction to this awesome library. You can use it for SSR, integration tests, diagnostics, and reports for your web app, although I had no idea when I first started using it.

Puppeteer on it's own is freaking dope, but my mythical web API needs to live and communicate with the web. For this I went with [Express](https://expressjs.com/) to keep it simple.

## The App

Here's the code for the Express app, just a boilerplate web API pretty much, simple as possible:

```js
// "./env" exports environment vars
const { port, root } = require("./env")

// express
const express = require("express")
const app = express()

// static
app.use(express.static(__dirname + "/public"))

// routes
const routes = require("./routes")
app.use("/v1", routes)
app.use("/", routes)

app.listen(port, () => {
  console.log(`app running @ ${root}...`)
})
```

## The Screenshotter

This code came straight from the Puppeteer documentation, with a little optimization to avoid re-initializing the browser every time we take a screenshot. This actually saved like 1-3 seconds per screenshot in production!

```js
// browser.js
let browser = null
const initBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      // launch options mandatory for running on Heroku
      // where I deployed
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
  }
  return browser
}

// screenshotter.js
const screenshot = async (url, pageSetup) => {
  try {
    const browser = await initBrowser()
    const page = await browser.newPage()
    await pageSetup(page)

    await page.goto(url)
    const shot = await page.screenshot()
    await page.close()
    // returns PNG data buffer
    return shot
  } catch (err) {
    return err
  }
}
```

`pageSetup` is to allow for easy alteration of the page size, zoom, or even mobile device emulation. For example, to create a mobile-screenshot function:

```js
const mobileSetup = async page => {
  await page.emulate(puppeteer.devices["iPhone 6"])
}
const mobile = async url => await screenshot(url, mobileSetup)
```

That's it, Puppeteer is sick!

## The Routes

I might [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) myself out a bit, but hey I'm just learning and I really like clean code. Let's build a [higher-order function](https://en.wikipedia.org/wiki/Higher-order_function) to get rid of some of the express boilerplate.

```js
const route = async (match, render) => {
  router.get(match, async (req, res) => {
    try {
      const url = validateUrl(req.url)
      await render(url, res)
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: error.toString() })
    }
  })
}
```

![mirrors](https://i.imgur.com/KgEUvSi.jpg)

`validateUrl` is a simple RegEx assertion while also checking for the level of self-reference, to prevent crazy levels of screenshotting a screenshot of the screenshotter, etc. It reminded me of that movie Inception, or two mirrors back-to-back.

```js
const validateUrl = path => {
  // parse
  const splitIdx = path.slice(1).indexOf("/")
  const url = path.slice(splitIdx + 2)
  // validate
  if (!URL_REGEX.test(url)) {
    throw "Invalid URL"
  }
  // ROOT is defined in "./env"
  const inceptionLevel = (url.match(new RegExp(`${ROOT}`, "g")) || []).length
  if (inceptionLevel > MAX_INCEPTION) throw "Inception Level Exceeded"
  return url
}
```

Cool! Now we have a way of easily defining routes that will automatically validate URLs and return errors. Here's how we define our mobile screenshot route:

```js
route("/mobile/*", async (url, res) => {
  const png = await mobile(url)
  // make sure to set the MIME type
  res.type("image/png").send(png)
})
```

## A Preview

Let's scrap up a quick front end with template strings to generate and preview our screenshots, leaving out some redundancy+boilerplate.

```js
/**
 * routes.js
 */
route("/previews/*", async (url, res) => {
  const html = await previews(url)
  res.send(html)
})

/**
 * previews.js
 */
const preview = (url, text) => `
  <div class="preview">
    <div class="preview__info">
      <h1>${text}</h1>
      ${embedMarkdown(url)}
      ${embedHtml(url)}
    </div>

    ${previewImg(url)}
  </div>
`

// To save myself some more time
// easy as copy-paste!
const embedMarkdown = url => `
  <p>Markdown</p>
  <code>
    ![Screenshot](${ROOT}${url})
  </code>
`

const embedHtml = url => `
  <p>HTML</p>
  <code>
    &lt;img src="${ROOT}${url}" alt="Screenshot" /&gt;
  </code>
`

const previewImg = url => `
  <a href="${url}" class="preview__img"> 
    <img src="${url}" />
    <span class="spinner"></span>
  </a>
`
```

```html
<!-- index.html -->
<!-- ... -->
<section>
  <h2>Screenshot Previews</h2>
  <code>/previews/:url</code>
  <form id="previews">
    <input type="url" name="url" placeholder="URL" autocomplete="off" />
    <button type="submit">Generate</button>
  </form>
</section>
<!-- ... -->
<script>
  document.body.onload = () => {
    const routes = ["mobile", "..."]
    routes.forEach(route => {
      const form = document.querySelector(`#${route}`)
      form.addEventListener("submit", submit(`/${route}/`))
    })
  }

  const submit = prefix => e => {
    e.preventDefault()
    const url = e.target.url.value
    window.open(prefix + url, "_blank")
  }
</script>
```

Here's what that page ended up looking like, with the Desktop preview as well:

![Screenshot](https://jist-screenshotter.herokuapp.com/desktop/https://jist-screenshotter.herokuapp.com/previews/https://duckduckgo.com/)

## The Disappointment

I left out a lot of details. Many mistakes were made just getting to this point. The next day when I woke up I was excited to continue working on this project and exploring Puppeteer. I decided it might be wise to actually look at other "Screenshot-as-a-service" apps out there and there were countless, all much prettier and with more features than mine. I also figured it was a good idea to watch the [intro video](https://youtu.be/lhZOFUY1weo) on Puppeteer's home page. It's a talk from Eric Bidelman at Google I/O '18 showing off many of the cool things you can do with headless chrome. Near the end of the talk, he shows off his "puppeteer-as-a-service" app that he threw together that does everything my app did and more.

I felt dumb. Apparently what I had struggled to create was already out there, and surely much better, right? I went to check out [pptraas](https://github.com/GoogleChromeLabs/pptraas.com) on GitHub and try it out. For some reason, the site was down. Maybe he just took it offline because too many people were using it, I don't know.

I started looking through the code. Maybe I'm still too nooby to understand why, but it looked a lot messier than mine. All of the functionality was crammed into a `server.js` file with a ton of redundancy. It's probably because this was just a quick project for someone as experienced as Eric, but I started to feel less dumb.

My code was mine. I understood it perfectly, and guess what? It worked. It's online and all for me. No API keys to authenticate, no overly complex URL parameters or caching mechanisms to fiddle with. It was disappointing at first, but I ultimately decided I was gonna keep at it. I was gonna make the cleanest, simplest screenshotting API that did exactly what I needed it to. Who cares if it's not revolutionary? I learned so much the first day, let's keep at it.

## The Next Level

Eric's version took PDF screenshots, server-side rendered pages, generated metrics and Lighthouse reports. Let's knock those out. But first let's write some tests to avoid regression. After installing [Mocha](https://mochajs.org/) as a test runner, I added a test script and got to work:

```json
// package.json
// ...
  "scripts": {
    // ...
    "test": "nodemon --exec mocha",
  },
//...
```

```js
// test/screenshotter.test.js
describe("Screenshotter", () => {
  // ...desktop test...

  describe("Mobile Screenshot", () => {
    let res = null

    it("Should screenshot github.com", async function() {
      this.timeout(10000)
      const url = "https://github.com"
      res = await mobile(url)
    })

    it("Should return PNG", () => {
      const header = res.toString("ascii", 1, 4)
      assert.equal(header, "PNG")
    })

    it("Should be correct size", () => {
      const width = res.readIntBE(16, 4)
      assert.equal(width, 750)
      const height = res.readIntBE(20, 4)
      assert.equal(height, 1334)
    })
  })
})
```

This was more learning than I thought it would be. I spent some time on the [PNG wikipedia page](https://en.wikipedia.org/wiki/Portable_Network_Graphics#File_header) figuring out how to test PNG data.

Now for the route tests! I hadn't tested an express server before, but [Supertest](https://github.com/visionmedia/supertest) makes it easy. The assertions got a little more complex here, so I installed [Chai](https://www.chaijs.com/) as a dev dependency as well.

```js
// test/routes.test.js
const express = require("express")
const request = require("supertest")
const { expect } = require("chai")

const routes = require("../src/routes")

const app = express()
app.use("/", routes)

// runs assertion on url with timeout of 10s
// round trips (route => screenshot => response)
// usually take around 2s (default timeout)
const routeTest = (assertion, url) =>
  function(done) {
    this.timeout(10000)
    request(app)
      .get(url)
      .expect(assertion)
      .end(done)
  }

// asserts properties of PNG responses
const pngRoute = res => {
  const { headers, status } = res
  expect(headers["content-type"]).to.equal("image/png")
  expect(headers["cache-control"]).to.equal("no-cache")
  const expires = new Date(headers["expires"])
  expect(expires).to.be.below(new Date())
  expect(status).to.equal(200)
  return res
}

const htmlRoute = res => {
  const { headers, status } = res
  expect(headers["content-type"]).to.contain("html")
  expect(status).to.equal(200)
  return res
}
```

Higher order functions and helpers make everything awesome. Here's our actual tests:

```js
describe("Routes", () => {
  it("/desktop", routeTest(pngRoute, "/desktop/https://google.com"))
  it("/mobile", routeTest(pngRoute, "/mobile/https://github.com"))
  it("/previews", routeTest(htmlRoute, "/previews/https://reddit.com"))
})
```

## CI/CD

Now that we got some tests, let's automate our testing and deployment process with [Travis-CI](https://travis-ci.com/). I wrote a [post](/blog/meteor-e2e-ci) about doing exactly that with Meteor, but for this project all it takes with travis is adding a production/staging script and a .travis.yml file.

```json
// package.json
// ...
  "scripts": {
    // ...
    "test:prod": "mocha --exit"
  },
// ...
```

```yml
# .travis.yml
language: node_js
node_js:
  - 10.15.3
cache: npm
script:
  - npm run test:prod
deploy:
  provider: heroku
  app: jist-screenshotter
  api_key:
    secure: # travis encrypt $(heroku auth:token) --add deploy.api_key
```

One minor pain in the ass was Travis' free/pro split. If you're working with a private github repo and Travis-ci.**org**, you need to use the `--org` flag while generating your heroku token. If you're working with a public repo and Travis-ci.**com**, you need to use the `--pro` flag.

![Screenshot](https://jist-screenshotter.herokuapp.com/desktop/https://github.com/jistjoalal/screenshotter/blob/master/README.md)

Now our code pushes trigger our test suite in the staging environment, which if successful, triggers a deployment on heroku. Something about that build status badge is so satisfying.

## The Real Bummer

It didn't take long to notice that my screenshots weren't actually updating in the readme on github. Embarrassingly, I hadn't considered that GitHub would cache my images if they came from the outside world. Looking in the network tab, the images we're set to expire in 1 year!

But wait, how did those status badges for my CI builds always update so fast? There must be a way. And indeed there was! Thank god for StackOverflow and the majestic and wonderful user b85411 who got a measly 2 upvotes for his [answer](https://stackoverflow.com/a/27893930).

> By setting the no-cache and having the cache expire in the past, I have found that GitHub's CDN updates the images automatically on every refresh.

Another google to get the express function for setting headers (it was obvious), and bam! Time over space and mind over matter, GitHub.

```js
// in our route HOF after url validation and before render
res.setHeader("Cache-Control", "no-cache")
res.setHeader("Expires", new Date(Date.now() - 1).toUTCString())
```

## The Bells & Whistles

More! Puppeteer has a `page.metrics()` method that gives us some stats about page load times.

```js
// metrics.js
const metrics = async url => {
  try {
    const browser = await initBrowser()
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "networkidle0" })
    const result = await page.metrics()
    await page.close()
    return result
  } catch (err) {
    return err
  }
}

// routes.js
route("/metrics/*", async (url, res) => {
  const result = await metrics(url)
  res.type("application/json").send(JSON.stringify(result))
})
```

Implementing a PDF screenshot route is just as easy with `page.pdf()`. Don't forget to set the mime type in the route. I wrote unit and route tests for each of these that closely resembled the tests for our screenshot route.

Next up, let's generate a [Lighthouse report](https://developers.google.com/web/tools/lighthouse/) for our app. I installed the [lighthouse package](https://www.npmjs.com/package/lighthouse), wired it up to our Puppeteer browser instance, and routed the result as HTML.

```js
const lighthouseReport = async url => {
  try {
    const browser = await initBrowser()
    const result = await lighthouse(url, {
      port: new URL(browser.wsEndpoint()).port,
      output: "html",
    })
    return result.report
  } catch (err) {
    throw err
  }
}
```

Next up is our SSR route, which I basically just copied from Eric's example. It's simply a matter of returning `page.content()`, but we can't forget to inject a base tag so relative resources properly. We also remove non-data scripts from the page to avoid double renders.

```js
const ssr = async url => {
  try {
    const browser = await initBrowser()
    const page = await browser.newPage()

    await page.goto(url, { waitUntil: "networkidle0" })

    // inject base so relative resources load properly
    await page.evaluate(url => {
      const base = document.createElement("base")
      const slash = url.endsWith("/") ? "" : "/"
      base.href = url + slash
      document.head.prepend(base)
    }, url)

    // remove scripts (except structured data) and imports
    await page.evaluate(() => {
      const elements = document.querySelectorAll(
        'script:not([type="application/ld+json"]), link[rel="import"]'
      )
      elements.forEach(e => e.remove())
    })

    // return html as string
    const html = await page.content()
    await page.close()
    return html
  } catch (err) {
    return err
  }
}
```

I'm definitely still learning on this one. I would love to try to use it to render one of my CRA apps, because hours of attempting to independently "proxy SSR" sites resulted in lots of weird render and CORS issues. Maybe that's the next promised land, an "SSR-as-a-service" app.

Some more tests and our homemade puppeteer-as-a-service app is off to the races.

![Screenshot](https://jist-screenshotter.herokuapp.com/desktop/https://jist-screenshotter.herokuapp.com/)

## The Meta

Now for the reward! As I pasted in the generated markdown for the screenshot (above) of a cool little tool I made in the readme of the tool itself _for the last time_, I felt pretty proud. It's cool to make things that are useful, even for just me. And it's really cool to make things that are useful to themselves.

Maybe my next project will be a text editor or a VSCode extension or something. Enhancing my own learning/workflow is empowering. I had to go through all my favorite projects and update the readme _for the last time_, it was a blast.

And yes, the screenshots in this blog post are all live-generated with my new tool. Go ahead, refresh the page. That screenshot is all yours.

![Screenshot](https://jist-screenshotter.herokuapp.com/desktop/https://jist-blog.netlify.com/blog/meta)

;) can't help myself.
