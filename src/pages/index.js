import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'

export default () =>
  <Layout>
    <h1>hello.</h1>
    <h2>this is a blog written by a person</h2>
    <p>Need a developer? <Link to="/contact">Contact me</Link></p>
  </Layout>
