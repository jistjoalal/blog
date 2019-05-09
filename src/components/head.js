import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

export default ({ title }) => {
  const siteTitle = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
        }
      }
    }
  `).site.siteMetadata.title
  return (
    <Helmet>
      <title>{`${siteTitle} | ${title}`}</title>
    </Helmet>
  )
}
