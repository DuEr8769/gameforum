import algoliasearch from "algoliasearch";

const client =  algoliasearch("65OAN0Y5F8", "107f126e7ff48bbd211f9c03abe30209");

const algolia = client.initIndex("gameforum");

export default algolia;