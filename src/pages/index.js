import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Head from "../components/head"
import PostTitle from "../components/PostTitle"

export default ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  return (
    <Layout>
      <Head title="Home" />
      <h2>Jist</h2>
      <ul>
        <li>
          <em>Gist</em> means “essence” or “the main point.”
        </li>
        <li>
          <em>Jist</em> is a common misspelling of gist.
        </li>
      </ul>
      <h2>Latest Post</h2>
      <PostTitle node={edges[0].node} />
    </Layout>
  )
}

export const indexQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 1
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM Do, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
