import React from "react"

import Posts from "../queries/posts"

import Layout from "../components/layout"
import Head from "../components/head"
import PostTitle from "../components/PostTitle"

export default () => {
  const latestPost = Posts()[0].node
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
      <PostTitle node={latestPost} />
    </Layout>
  )
}
