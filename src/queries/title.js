import { useStaticQuery, graphql } from "gatsby"

export default () =>
  useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
        }
      }
    }
  `).site.siteMetadata.title
