---
title: JAM Stack
date: "2019-05-11"
---

After months of learning programming and web development, I finally have a blog! Nothing special, it will be a way of centralizing my notes and learning experiences, as well as some practice with [Gatsby](https://gatsbyjs.org), the tech this blog is built with. Web development is a rapidly moving field and I'm just beginning to catch up to the modern "tech stack" as we call it.

Gatsby is a framework for building web sites and apps. It's like a web starter kit, similar to Meteor or Rails, tools included. React is the front-end library of choice and React's functional principles are clearly an influence. Gatsby is at the forefront of a new idea behind building software for the web: The [JAMStack](https://jamstack.org/).

JAM stands for:

- Javascript
- APIs
- Markup

To me, this is an essential abstraction over the application layer of the internet. I'm still new to programming, but I've been working with computers and specfically networks almost my whole life. In the networking world we have the "Application Layer" or the "Human Layer" which represents the vast amount of highly abstracted data (that humans actually interact with) travelling over the infrastructure of the internet.

The JAMStack doesn't concern itself with operating systems, servers, or load balancers. It is the best development environment for living as close to the user as possible. I find it beneficial to restate JAM the following way:

- Behavior (Javascript)
- Data (APIs)
- Appearance (Markup)

Therefore if there is a "User Layer", the JAMStack seems to be a development strategy that removes as many other "lower (technical) layers" as possible.

- What does the user do? (Javascript)
- What information is involved? (APIs)
- How does it look? (Markup)

So it's basically the promised land. As a web developer, you can make web sites, not devops scripts and delicate server-client surgery. This abstraction is great, but how is it possible?

Gatsby and the JAMStack in general put emphasis on serving **static**, **ready-to-use**, files to the client. The server is interchangable and that is a big part of what makes this stack so viable (and powerful) now. With CDNs and cloud hosting providers that exist today, deploying is as simple as "upload and go".

The obvious concern is the data layer. Where does business logic fit into a _static_ site? Well, javascript is a _static_ asset, but it's effects are anything but. Lucky for me, I didn't get involved in web development until last year so I get brand new shiny javascript without any of the traumatic memories. The root of this issue can be put simply: "Asynchronous Code", or "Requests".

I hear tales of wicked beasts such as callback functions and promise chains that go off the page; Undocumented APIs, overfetching, underfetching... truly the stuff of nightmares.

With modern Javascript and this fancy new thing called GraphQL, these concerns are diminishing rapidly. All I can do is be grateful to those who came before me.

This post is supposed to be about Gatsby, so I won't talk too much about GraphQL, a query language used for transferring data b/w client and server. But in essence it is an interface for back-end and front-end, not the tech but the developers. I've never worked on a team but it certainly seems that GraphQL is venturing to solve far more than a technical problem. To have self-documenting, type-safe APIs is a tremendous boon for the front-end and represents a trend towards functional programming principles.

Gatsby tries to use GraphQL where ever possible. It runs a graphql server by default and by adding and configuring plugins one can auto-magically generate queries/mutations for all kinds of content. The simplest example is configuring the `siteMetadata` in `gatsby-config.js`:

```js
// gatsby-config.js
module.exports = {
  siteMetadata: {
    title: "Jist",
    author: "Jist",
  },
}
```

which can be queried the following way:

```graphql
{
  site {
    siteMetadata {
      title
    }
  }
}
```

Seems useless, right? Why serve this seemingly very static data over an entire graphql API? It's about standardizing the way the client interacts with data. We seek to establish GraphQL as a "single source of truth" ([SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth)). This is a common design pattern that many are suprised the web didn't adopt earlier. It provides many technical benefits, and I just can't help but notice every seemingly revolutionary web tech over the last few years has been influenced by SSOT and functional principles. React and Redux are a prime example.

I should point out that Gatsby has [plugins](https://www.gatsbyjs.org/plugins/) that can connect your graphql server to many different sources, not just simply the above config file.

So what's the big idea behind Gatsby? It's a **modern web framework**. The modern web has many faces, many sources of truth, and we want to make it the same experience across the board. Not just the user experience, but the developer experience as well. We design reusable UI's with React, declaratively. We make standardized declarative requests to multiple sources all from the same place: GraphQL within the Javascript client. We deploy static files to multiple servers.

The key concept here is **reusable software is declarative**. There are no side effects to keep track of, no server state and the data is completely pushed to the side. This allows the user and the developer to focus on what matters: their personal level of abstraction.

It's funny because I've noticed when solving a programming problem I often begin with curly braces, for loops, and weird state. How could I ever solve a difficult problem without being able to tinker and finely adjust the mechanics of my design? But as I start to see the problem more clearly, I have this unshakeable urge to isolate side effects, use recursion over for loops, and even remove all curly braces from my code. Here's an example:

```js
const sumt = n => {
  let ttl = n
  while (n > 0) {
    ttl += --n
  }
  return ttl
}
// vs:
const sumt = n => (n > 0 ? n + sumt(n - 1) : 0)
// or even:
const sumt = n => +(n && n + sumt(n - 1))
```

My example is simple, but in the context of a web application there are many more variables to keep track of. Some live on the server, some on the client. To isolate your functions (behavior) from your data can help debug, test, and understand complex code. I do think it's amazing however that even this contrived example illustrates the nature of the two programming styles. One is under the hood with greasy hands and a wrench making it work, the other is neatly polishing a functional item, ensuring your messy work doesn't interfere with anything else.

One thing to notice is that the top function can have incorrect values of `ttl`. If we weren't just returning the value, but continuously rendering it to the screen, our user with bad connection could end up in some pretty strange states. The functional examples can be stopped at any time and will either represent the result or a function pointing to the result. Again, this is a contrived example but we can start to see how defining operations functionally instead of imperatively could make it easier to code/debug the asynchronous interaction between client and server in a web application. We don't need to define extra variables such as "loading" and "error", they are built in to the declarative request tools we are using.

My intuition is that this dichotomy is something like adjusting magnification. Do I wish to clearly see the details or the big picture? Do I want to know what this code does or how it works?

The answers to these questions seem obvious over the course of developing a project. Once you get it working, wrap it all up with a bow so you can see what it does later on when you forget. But that's the real trick.

Amazing things come from successful abstractions. It enables everyone to do more. The JAMStack is the latest phase of an eternally evolving hierarchy of abstraction from 0's and 1's to consumable content and useful tools on the web. Many of the problems the JAMStack solves, I will never have to face. I can now see a bit further, build a bit more, and worry less than those that built the web before me. I'm both grateful and tremendously curious as to how they did it.
