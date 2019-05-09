import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import Layout from "../components/layout"
import Head from "../components/head"

import styles from "./blog.module.css"

export default () => {
  const posts = useStaticQuery(graphql`
    {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              title
              date
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `).allMarkdownRemark.edges

  return (
    <Layout>
      <Head title="Blog" />
      <h1>blog</h1>
      <ol className={styles.posts}>{posts.map(PostTitle)}</ol>
    </Layout>
  )
}

const PostTitle = ({ node }) => (
  <li key={node.id} className={styles.post}>
    <Link className={styles.link} to={`/blog/${node.fields.slug}`}>
      <h2 className={styles.title}>{node.frontmatter.title}</h2>
      <p className={styles.date}>{node.frontmatter.date}</p>
    </Link>
  </li>
)
