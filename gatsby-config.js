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
    {
      resolve: `gatsby-transformer-excel`,
      options: {
        raw: false
      }
    },
    {
      resolve: `gatsby-plugin-emotion`,
      options: {}
    }
  ]
};
