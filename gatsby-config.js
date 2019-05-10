module.exports = {
  siteMetadata: {
    title: "Jist",
    author: "Jist",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "src",
        path: `${__dirname}/blog/`,
      },
    },
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          "gatsby-remark-relative-images",
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
            },
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 750,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "language-",
            },
          },
        ],
      },
    },
  ],
}
