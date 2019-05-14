---
title: "A Blog"
date: "2019-05-14"
---

# Create a Gatsby Blog

Gatsby is a web framework for generating JAMStack-ready static files. It uses React for the front-end and GraphQL queries at build time for "content" (not-so-dynamic data). It's a cool new tech and a blog is a good use case for trying it out. Since my posts will be mostly programming related, I needed some features:

- I like writing with [**Markdown**](https://en.wikipedia.org/wiki/Markdown)
  - Gatsby has a [way](https://www.gatsbyjs.org/docs/adding-markdown-pages/) of generating pages from markdown files in a very declarative way.
- Syntax Highlighting is a must have.
  - Gatsby has a plugin for [PrismJS](https://prismjs.com/), a syntax highlighter library.

## Create a new Gatsby project

Gatsby has a whole library of [starters](https://www.gatsbyjs.org/starters/?v=2). Clone one to get started w/ a new project.

```sh
gatsby new gatsby-bootcamp https://github.com/gatsbyjs/gatsby-starter-hello-world
```

## GraphQL playground instead of GraphiQL

[GraphQL playground](https://github.com/prisma/graphql-playground) by prisma is an improved GraphiQL (with dark theme!!) Only a few steps to enable it in Gatsby:

1. Create `.env` file in root of project

```yml
# .env
GATSBY_GRAPHQL_IDE=playground
```

2. Install env-cmd package

```
npm i --save-dev env-cmd
```

3. Edit package.json start script

```json
"develop": "env-cmd .env gatsby develop",
```

## markdown file to html pages

### 1. serve markdown files over graphql

```sh
npm i --save-dev gatsby-source-filesystem gatsby-transformer-remark
```

edit `gatsby-config.json`:

```js
plugins: [
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "src",
      path: `${__dirname}/src/`,
    },
  },
  "gatsby-transformer-remark",
],
```

Markdown files in `src` dir can now be queried w/ GraphQL:

```graphql
{
  allMarkdownRemark {
    edges {
      node {
        id
        frontmatter {
          title
          date
        }
        html
        excerpt
        fields { //
          slug   // comes from gatsby-node.js
        }        //
      }
    }
  }
}
```

### 2. create post template file `src/templates/blog.js`

```jsx
import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

export const query = graphql`
  query($slug: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
      }
      html
    }
  }
`

export default ({ data }) => (
  <Layout>
    <h1>{data.markdownRemark.frontmatter.title}</h1>
    <p>{data.markdownRemark.frontmatter.date}</p>
    <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
  </Layout>
)
```

### 3. generate page for each post

Create new file `gatsby-node.js` in root of project

```js
const path = require("path")

module.exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === "MarkdownRemark") {
    const slug = path.basename(node.fileAbsolutePath, ".md")
    createNodeField({
      node,
      name: "slug",
      value: slug,
    })
  }
}

module.exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const blogTemplate = path.resolve("src/templates/blog.js")
  const res = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  res.data.allMarkdownRemark.edges.forEach(edge => {
    createPage({
      component: blogTemplate,
      path: `/blog/${edge.fields.slug}`,
      context: {
        slug: edge.fields.slug,
      },
    })
  })
}
```

### 4. render images in markdown pages

```sh
npm i gatsby-plugin-sharp gatsby-remark-images gatsby-remark-relative-images
```

`gatsby-config.js`

```js
// plugins:
"gatsby-plugin-sharp",
{
  resolve: "gatsby-transformer-remark",
  options: {
    plugins: [
      "gatsby-remark-relative-images",
      {
        resolve: "gatsby-remark-images",
        options: {
          maxWidth: 750,
          linkImagesToOriginal: false,
        },
      },
    ],
  },
},
```

In source markdown file, specify path relative to the markdown file:

```md
![Image](./image.png)
```

## use SCSS w/ gatsby

```sh
npm install --save node-sass gatsby-plugin-sass
```

## use css modules to style react components

React:

```jsx
import styles from "./component.module.scss"
export default () => <h1 className={styles.header}>Hooray</h1>
```

`component.module.scss` (same dir as component)

```scss
.header {
  color: black;
}
```

## markdown syntax highlighting using [prismjs](https://prismjs.com/)

```sh
npm install --save gatsby-remark-prismjs prismjs
```

```js
// gatsby-config.js
// - plugins:
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      `gatsby-remark-prismjs`,
    ]
  }
}

// gatsby-browser.js
require("prismjs/themes/prism-okaidia.css")
// more themes @ https://github.com/PrismJS/prism/tree/master/themes
```
