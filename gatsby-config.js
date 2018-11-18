module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data/`
      }
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-sharp`
    },
    "gatsby-transformer-excel",
    {
      resolve: `gatsby-plugin-emotion`,
      options: {}
    }
  ]
};
