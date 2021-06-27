const { ApolloServer, gql } = require('apollo-server');

class Deck {
  numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
  symbols = ["♣", "♦", "♥", "♠"];

  cards = [];
  randomTable = [];

  constructor() {
    this.symbols.forEach((symbol) => {
      this.numbers.forEach((number) => {
        this.cards.push({number, symbol});
      });
    });
  }

  dispatchCards(size) {
    return new Array(size)
      .fill()
      .map(
        () =>
          this.cards.splice(parseInt(Math.random() * this.cards.length), 1)[0]
      );
  }

  random(){
    return new Array(5)
      .fill()
      .map(
        () =>
          this.cards.splice(parseInt(Math.random() * this.cards.length), 1)[0]
      );
  }
}

const typeDefs = gql`
  type Card {
    number: String
    symbol: String
  }

  type Query {
    cards: [Card]
    getCards(cards: Int): [Card]
    table: [Card]
  }

  type Mutation {
    restoreCards: String
  }
`;

let deck = new Deck()
let table = deck.dispatchCards(5)

const resolvers = {
  Query: {
    cards: () => deck.cards,
    getCards: (_, { cards }) =>{
      return deck.dispatchCards(cards)
    },
    table: () => {
      return table
    }
  },
  Mutation: {
    restoreCards: () =>{
      deck = new Deck()
      table = deck.dispatchCards(5)
      return 'OK'
    },
  }
};


const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});