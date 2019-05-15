import { graphql, useStaticQuery } from "gatsby"

export default () =>
  useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          author
        }
      }
    }
  `).site.siteMetadata.author
