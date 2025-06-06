import { AdapterAnthropic } from "@gqlpt/adapter-anthropic";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { describe, test } from "@jest/globals";
import dotenv from "dotenv";

import { GQLPTClient } from "../src";
import { assertMatchesVariation } from "./utils";

dotenv.config();

const TEST_OPENAI_API_KEY = process.env.TEST_OPENAI_API_KEY as string;
const TEST_ANTHROPIC_API_KEY = process.env.TEST_ANTHROPIC_API_KEY as string;

const adapters = [
  {
    name: "OpenAI",
    adapter: new AdapterOpenAI({ apiKey: TEST_OPENAI_API_KEY }),
  },
  {
    name: "Anthropic",
    adapter: new AdapterAnthropic({ apiKey: TEST_ANTHROPIC_API_KEY }),
  },
];

const typeDefs = /* GraphQL */ `
  type Query {
    composabase: Composabase
    swapi_subgraph: swapi_subgraphQuery!
    music_subgraph: music_subgraphQuery!
    hello(name: String, isImportant: Boolean): String!
    helloCustom(input: MyCustomInput): String!
    holiday(provider: AIProvider!, model: String!, type: HolidayType): String!
    foodRecipe(
      dish: String
      maxIngredients: Int
      showImage: Boolean
    ): FoodRecipe!
    textToQuery(text: [String!]!): TextToQueryResponse!
  }

  scalar Boolean

  scalar Float

  scalar ID

  scalar Int

  scalar JSON

  scalar String

  enum AIProvider {
    openai
    anthropic
  }

  enum HolidayType {
    casual
    geek
    scifi
  }

  interface swapi_Node {
    id: ID!
  }

  type Composabase {
    version: String
    id: String
    name: String
    machineName: String
  }

  type FoodRecipe {
    description: String!
    ingredients: [FoodRecipeIngredient!]!
    steps: [String!]!
    suggestion: FoodRecipeSuggestion!
    image: String
  }

  type FoodRecipeIngredient {
    name: String!
    amount: String!
  }

  type FoodRecipeSuggestion {
    starter: String!
    drink: String!
    dessert: String!
  }

  type music_subgraphQuery {
    allArtists(
      after: String
      first: Int
      before: String
      last: Int
    ): music_ArtistsConnection
    artist(id: ID): music_Artist
    allAlbums(
      after: String
      first: Int
      before: String
      last: Int
    ): music_AlbumsConnection
    album(id: ID): music_Album
    allTracks(
      after: String
      first: Int
      before: String
      last: Int
    ): music_TracksConnection
    track(id: ID): music_Track
    allGenres(
      after: String
      first: Int
      before: String
      last: Int
    ): music_GenresConnection
    genre(id: ID): music_Genre
    searchMusic(query: String!): music_SearchResults!
  }

  interface music_Node {
    id: ID!
  }

  type music_Artist implements music_Node {
    id: ID!
    name: String!
    biography: String
    formed: String
    disbanded: String
    genres: [music_Genre!]
    albums(
      after: String
      first: Int
      before: String
      last: Int
    ): music_ArtistAlbumsConnection
    tracks(
      after: String
      first: Int
      before: String
      last: Int
    ): music_ArtistTracksConnection
    monthlyListeners: Int
    created: String
    edited: String
  }

  type music_Album implements music_Node {
    id: ID!
    title: String!
    artist: music_Artist!
    releaseDate: String
    genres: [music_Genre!]
    tracks(
      after: String
      first: Int
      before: String
      last: Int
    ): music_AlbumTracksConnection
    duration: Int
    created: String
    edited: String
  }

  type music_Track implements music_Node {
    id: ID!
    title: String!
    artist: music_Artist!
    album: music_Album
    duration: Int
    genres: [music_Genre!]
    featuredArtists: [music_Artist!]
    lyrics: String
    created: String
    edited: String
  }

  type music_Genre implements music_Node {
    id: ID!
    name: String!
    description: String
    artists(
      after: String
      first: Int
      before: String
      last: Int
    ): music_GenreArtistsConnection
    albums(
      after: String
      first: Int
      before: String
      last: Int
    ): music_GenreAlbumsConnection
    tracks(
      after: String
      first: Int
      before: String
      last: Int
    ): music_GenreTracksConnection
    created: String
    edited: String
  }

  type music_SearchResults {
    artists: [music_Artist!]!
    albums: [music_Album!]!
    tracks: [music_Track!]!
  }

  type music_ArtistsConnection {
    pageInfo: swapi_PageInfo!
    edges: [music_ArtistsEdge]
    totalCount: Int
    artists: [music_Artist]
  }

  type music_ArtistsEdge {
    node: music_Artist
    cursor: String!
  }

  type music_AlbumsConnection {
    pageInfo: swapi_PageInfo!
    edges: [music_AlbumsEdge]
    totalCount: Int
    albums: [music_Album]
  }

  type music_AlbumsEdge {
    node: music_Album
    cursor: String!
  }

  type music_TracksConnection {
    pageInfo: swapi_PageInfo!
    edges: [music_TracksEdge]
    totalCount: Int
    tracks: [music_Track]
  }

  type music_TracksEdge {
    node: music_Track
    cursor: String!
  }

  type music_GenresConnection {
    pageInfo: swapi_PageInfo!
    edges: [music_GenresEdge]
    totalCount: Int
    genres: [music_Genre]
  }

  type music_GenresEdge {
    node: music_Genre
    cursor: String!
  }

  type music_ArtistAlbumsConnection {
    pageInfo: swapi_PageInfo!
    edges: [music_AlbumsEdge]
    totalCount: Int
    albums: [music_Album]
  }

  type music_ArtistTracksConnection {
    pageInfo: swapi_PageInfo!
    edges: [music_TracksEdge]
    totalCount: Int
    tracks: [music_Track]
  }

  type music_AlbumTracksConnection {
    pageInfo: swapi_PageInfo!
    edges: [music_TracksEdge]
    totalCount: Int
    tracks: [music_Track]
  }

  type music_GenreArtistsConnection {
    pageInfo: swapi_PageInfo!
    edges: [music_ArtistsEdge]
    totalCount: Int
    artists: [music_Artist]
  }

  type music_GenreAlbumsConnection {
    pageInfo: swapi_PageInfo!
    edges: [music_AlbumsEdge]
    totalCount: Int
    albums: [music_Album]
  }

  type music_GenreTracksConnection {
    pageInfo: swapi_PageInfo!
    edges: [music_TracksEdge]
    totalCount: Int
    tracks: [music_Track]
  }

  type swapi_Film implements swapi_Node {
    title: String
    episodeID: Int
    openingCrawl: String
    director: String
    producers: [String]
    releaseDate: String
    speciesConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_FilmSpeciesConnection
    starshipConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_FilmStarshipsConnection
    vehicleConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_FilmVehiclesConnection
    characterConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_FilmCharactersConnection
    planetConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_FilmPlanetsConnection
    created: String
    edited: String
    id: ID!
  }

  type swapi_FilmCharactersConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_FilmCharactersEdge]
    totalCount: Int
    characters: [swapi_Person]
  }

  type swapi_FilmCharactersEdge {
    node: swapi_Person
    cursor: String!
  }

  type swapi_FilmPlanetsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_FilmPlanetsEdge]
    totalCount: Int
    planets: [swapi_Planet]
  }

  type swapi_FilmPlanetsEdge {
    node: swapi_Planet
    cursor: String!
  }

  type swapi_FilmsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_FilmsEdge]
    totalCount: Int
    films: [swapi_Film]
  }

  type swapi_FilmsEdge {
    node: swapi_Film
    cursor: String!
  }

  type swapi_FilmSpeciesConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_FilmSpeciesEdge]
    totalCount: Int
    species: [swapi_Species]
  }

  type swapi_FilmSpeciesEdge {
    node: swapi_Species
    cursor: String!
  }

  type swapi_FilmStarshipsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_FilmStarshipsEdge]
    totalCount: Int
    starships: [swapi_Starship]
  }

  type swapi_FilmStarshipsEdge {
    node: swapi_Starship
    cursor: String!
  }

  type swapi_FilmVehiclesConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_FilmVehiclesEdge]
    totalCount: Int
    vehicles: [swapi_Vehicle]
  }

  type swapi_FilmVehiclesEdge {
    node: swapi_Vehicle
    cursor: String!
  }

  type swapi_PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type swapi_PeopleConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_PeopleEdge]
    totalCount: Int
    people: [swapi_Person]
  }

  type swapi_PeopleEdge {
    node: swapi_Person
    cursor: String!
  }

  type swapi_Person implements swapi_Node {
    name: String
    birthYear: String
    eyeColor: String
    gender: String
    hairColor: String
    height: Int
    mass: Float
    skinColor: String
    homeworld: swapi_Planet
    filmConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_PersonFilmsConnection
    species: swapi_Species
    starshipConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_PersonStarshipsConnection
    vehicleConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_PersonVehiclesConnection
    created: String
    edited: String
    id: ID!
  }

  type swapi_PersonFilmsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_PersonFilmsEdge]
    totalCount: Int
    films: [swapi_Film]
  }

  type swapi_PersonFilmsEdge {
    node: swapi_Film
    cursor: String!
  }

  type swapi_PersonStarshipsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_PersonStarshipsEdge]
    totalCount: Int
    starships: [swapi_Starship]
  }

  type swapi_PersonStarshipsEdge {
    node: swapi_Starship
    cursor: String!
  }

  type swapi_PersonVehiclesConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_PersonVehiclesEdge]
    totalCount: Int
    vehicles: [swapi_Vehicle]
  }

  type swapi_PersonVehiclesEdge {
    node: swapi_Vehicle
    cursor: String!
  }

  type swapi_Planet implements swapi_Node {
    name: String
    diameter: Int
    rotationPeriod: Int
    orbitalPeriod: Int
    gravity: String
    population: Float
    climates: [String]
    terrains: [String]
    surfaceWater: Float
    residentConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_PlanetResidentsConnection
    filmConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_PlanetFilmsConnection
    created: String
    edited: String
    id: ID!
  }

  type swapi_PlanetFilmsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_PlanetFilmsEdge]
    totalCount: Int
    films: [swapi_Film]
  }

  type swapi_PlanetFilmsEdge {
    node: swapi_Film
    cursor: String!
  }

  type swapi_PlanetResidentsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_PlanetResidentsEdge]
    totalCount: Int
    residents: [swapi_Person]
  }

  type swapi_PlanetResidentsEdge {
    node: swapi_Person
    cursor: String!
  }

  type swapi_PlanetsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_PlanetsEdge]
    totalCount: Int
    planets: [swapi_Planet]
  }

  type swapi_PlanetsEdge {
    node: swapi_Planet
    cursor: String!
  }

  type swapi_Species implements swapi_Node {
    name: String
    classification: String
    designation: String
    averageHeight: Float
    averageLifespan: Int
    eyeColors: [String]
    hairColors: [String]
    skinColors: [String]
    language: String
    homeworld: swapi_Planet
    personConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_SpeciesPeopleConnection
    filmConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_SpeciesFilmsConnection
    created: String
    edited: String
    id: ID!
  }

  type swapi_SpeciesConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_SpeciesEdge]
    totalCount: Int
    species: [swapi_Species]
  }

  type swapi_SpeciesEdge {
    node: swapi_Species
    cursor: String!
  }

  type swapi_SpeciesFilmsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_SpeciesFilmsEdge]
    totalCount: Int
    films: [swapi_Film]
  }

  type swapi_SpeciesFilmsEdge {
    node: swapi_Film
    cursor: String!
  }

  type swapi_SpeciesPeopleConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_SpeciesPeopleEdge]
    totalCount: Int
    people: [swapi_Person]
  }

  type swapi_SpeciesPeopleEdge {
    node: swapi_Person
    cursor: String!
  }

  type swapi_Starship implements swapi_Node {
    name: String
    model: String
    starshipClass: String
    manufacturers: [String]
    costInCredits: Float
    length: Float
    crew: String
    passengers: String
    maxAtmospheringSpeed: Int
    hyperdriveRating: Float
    MGLT: Int
    cargoCapacity: Float
    consumables: String
    pilotConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_StarshipPilotsConnection
    filmConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_StarshipFilmsConnection
    created: String
    edited: String
    id: ID!
  }

  type swapi_StarshipFilmsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_StarshipFilmsEdge]
    totalCount: Int
    films: [swapi_Film]
  }

  type swapi_StarshipFilmsEdge {
    node: swapi_Film
    cursor: String!
  }

  type swapi_StarshipPilotsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_StarshipPilotsEdge]
    totalCount: Int
    pilots: [swapi_Person]
  }

  type swapi_StarshipPilotsEdge {
    node: swapi_Person
    cursor: String!
  }

  type swapi_StarshipsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_StarshipsEdge]
    totalCount: Int
    starships: [swapi_Starship]
  }

  type swapi_StarshipsEdge {
    node: swapi_Starship
    cursor: String!
  }

  type swapi_subgraphQuery {
    allFilms(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_FilmsConnection
    film(id: ID, filmID: ID): swapi_Film
    allPeople(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_PeopleConnection
    person(id: ID, personID: ID): swapi_Person
    allPlanets(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_PlanetsConnection
    planet(id: ID, planetID: ID): swapi_Planet
    allSpecies(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_SpeciesConnection
    species(id: ID, speciesID: ID): swapi_Species
    allStarships(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_StarshipsConnection
    starship(id: ID, starshipID: ID): swapi_Starship
    allVehicles(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_VehiclesConnection
    vehicle(id: ID, vehicleID: ID): swapi_Vehicle
    node(id: ID!): swapi_Node
  }

  type swapi_Vehicle implements swapi_Node {
    name: String
    model: String
    vehicleClass: String
    manufacturers: [String]
    costInCredits: Float
    length: Float
    crew: String
    passengers: String
    maxAtmospheringSpeed: Int
    cargoCapacity: Float
    consumables: String
    pilotConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_VehiclePilotsConnection
    filmConnection(
      after: String
      first: Int
      before: String
      last: Int
    ): swapi_VehicleFilmsConnection
    created: String
    edited: String
    id: ID!
  }

  type swapi_VehicleFilmsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_VehicleFilmsEdge]
    totalCount: Int
    films: [swapi_Film]
  }

  type swapi_VehicleFilmsEdge {
    node: swapi_Film
    cursor: String!
  }

  type swapi_VehiclePilotsConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_VehiclePilotsEdge]
    totalCount: Int
    pilots: [swapi_Person]
  }

  type swapi_VehiclePilotsEdge {
    node: swapi_Person
    cursor: String!
  }

  type swapi_VehiclesConnection {
    pageInfo: swapi_PageInfo!
    edges: [swapi_VehiclesEdge]
    totalCount: Int
    vehicles: [swapi_Vehicle]
  }

  type swapi_VehiclesEdge {
    node: swapi_Vehicle
    cursor: String!
  }

  type TextToQueryResponse {
    query: String!
    variables: String
    data: JSON!
  }

  input MyCustomInput {
    name: String
    isImportant: Boolean
  }
`;

adapters.forEach(({ name, adapter }) => {
  describe(`Local Schema with ${name} Adapter`, () => {
    test("should generateQueryAndVariables with inline (find first 10 species and their homeworld)", async () => {
      const gqlpt = new GQLPTClient({
        adapter,
        typeDefs,
        excludedQueries: ["textToQuery"],
      });

      await gqlpt.connect();

      const result = await gqlpt.generateQueryAndVariables(
        "find first 10 species and their homeworld",
      );

      assertMatchesVariation(result, [
        {
          query: /* GraphQL */ `
            query ($first: Int) {
              swapi_subgraph {
                allSpecies(first: $first) {
                  species {
                    homeworld {
                      id
                      name
                    }
                    id
                    name
                  }
                }
              }
            }
          `,
          variables: { first: 10 },
        },
        {
          query: /* GraphQL */ `
            query ($first: Int) {
              swapi_subgraph {
                allSpecies(first: $first) {
                  species {
                    homeworld {
                      name
                    }
                    id
                    name
                  }
                }
              }
            }
          `,
          variables: { first: 10 },
        },
        {
          query: /* GraphQL */ `
            query ($first: Int!) {
              swapi_subgraph {
                allSpecies(first: $first) {
                  species {
                    homeworld {
                      id
                      name
                    }
                    id
                    name
                  }
                }
              }
            }
          `,
          variables: { first: 10 },
        },
      ]);
    });

    test("should generateQueryAndVariables with inline (find first 10 album and their artist)", async () => {
      const gqlpt = new GQLPTClient({
        adapter,
        typeDefs,
        excludedQueries: ["textToQuery"],
      });

      await gqlpt.connect();

      const result = await gqlpt.generateQueryAndVariables(
        "find first 10 album and their artist",
      );

      assertMatchesVariation(result, [
        {
          query: /* GraphQL */ `
            {
              music_subgraph {
                allAlbums(first: 10) {
                  albums {
                    artist {
                      name
                    }
                    title
                  }
                }
              }
            }
          `,
          variables: {},
        },
        {
          query: /* GraphQL */ `
            query ($first: Int) {
              music_subgraph {
                allAlbums(first: $first) {
                  albums {
                    artist {
                      id
                      name
                    }
                    id
                    title
                  }
                }
              }
            }
          `,
          variables: {
            first: 10,
          },
        },
        {
          query: /* GraphQL */ `
            {
              music_subgraph {
                allAlbums(first: 10) {
                  albums {
                    artist {
                      id
                      name
                    }
                    id
                    title
                  }
                }
              }
            }
          `,
        },
        {
          query: /* GraphQL */ `
            {
              music_subgraph {
                allAlbums(first: 10) {
                  edges {
                    node {
                      artist {
                        name
                      }
                      title
                    }
                  }
                }
              }
            }
          `,
        },
        {
          query: /* GraphQL */ `
            {
              music_subgraph {
                allAlbums(first: 10) {
                  albums {
                    artist {
                      name
                    }
                    id
                    title
                  }
                }
              }
            }
          `,
        },
        {
          query: /* GraphQL */ `
            {
              music_subgraph {
                allAlbums(first: 10) {
                  albums {
                    artist {
                      id
                      name
                    }
                    title
                  }
                }
              }
            }
          `,
        },
      ]);
    });
  });
});
