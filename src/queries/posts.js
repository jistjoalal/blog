import { useStaticQuery, graphql } from "gatsby"

export default () =>
  useStaticQuery(graphql`
    {
      allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        limit: 10
      ) {
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
