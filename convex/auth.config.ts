const auth =  {
    providers: [
      {
        domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
        applicationID: "convex",
      },
    ]
  };

  export default auth;