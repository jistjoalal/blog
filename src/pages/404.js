import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Head from "../components/head"

export default () => (
  <Layout>
    <Head title="404" />
    <h1>Page not found</h1>
    <Link to="/">Home</Link>
  </Layout>
)
