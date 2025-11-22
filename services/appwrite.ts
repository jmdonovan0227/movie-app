// track the searches made by a user
import { Client, TablesDB, Query, ID } from "react-native-appwrite";
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const MET_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_MET_TABLE_ID!;

const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);

const database = new TablesDB(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  // check if record of that search already exists
  // if a row is found, increment the count
  // if no row is found, create a new row with the search query and the movie id
  // increment the count
  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: MET_TABLE_ID,
      queries: [Query.equal("searchTerm", query)],
    });

    if (result.total > 0) {
      const existingMovie = result.rows[0];

      // Increment the count for existing row
      await database.incrementRowColumn({
        databaseId: DATABASE_ID,
        tableId: MET_TABLE_ID,
        rowId: existingMovie.$id,
        column: "count",
        value: 1,
      });
    } else {
      // Create a new row with initial data
      await database.createRow({
        databaseId: DATABASE_ID,
        tableId: MET_TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          count: 1,
          title: movie.title,
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: MET_TABLE_ID,
      queries: [
        // return the top 5 most searched movies
        Query.limit(5),
        Query.orderDesc("count"),
      ],
    });

    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
