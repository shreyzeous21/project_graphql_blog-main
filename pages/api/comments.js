import { GraphQLClient, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export default async function asynchandler(req, res) {
  try {
    // Create a new GraphQLClient instance
    const graphQLClient = new GraphQLClient(graphqlAPI, {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
      },
    });

    // Define the GraphQL mutation query
    const mutationQuery = gql`
      mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!) {
        createComment(data: {name: $name, email: $email, comment: $comment, post: {connect: {slug: $slug}}}) {
          id
        }
      }
    `;

    // Execute the GraphQL mutation
    const result = await graphQLClient.request(mutationQuery, {
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      slug: req.body.slug,
    });

    // Check for errors in the response
    if (result.errors && result.errors.length > 0) {
      console.error('GraphQL errors:', result.errors);
      return res.status(400).json({ error: 'GraphQL errors', details: result.errors });
    }

    // Send a successful response
    return res.status(200).json(result);
  } catch (error) {
    // Handle other errors
    console.error('Error creating comment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
