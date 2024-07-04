export const constants = {
  payments: {
    paymentLinks: {
      basicPlan:
        process.env.NODE_ENV === 'development'
          ? 'https://buy.stripe.com/28o7uK9JQ4EI8ucbII'
          : 'https://buy.stripe.com/test_fZe3ehd07dXK0Te7ss'
    },
    apiPublicKey:
      process.env.NODE_ENV === 'development'
        ? 'pk_test_51PYNjmRu43g6D6XNIisoEA7lgJvNGTxv5t2Q4EAaLDJPyM22GH1iFXCbekFnX1BXqFTucZLILtpqDgYc3E6Zv2lc00FUS5ERYP'
        : 'pk_test_51PYNjmRu43g6D6XNIisoEA7lgJvNGTxv5t2Q4EAaLDJPyM22GH1iFXCbekFnX1BXqFTucZLILtpqDgYc3E6Zv2lc00FUS5ERYP'
  }
};
