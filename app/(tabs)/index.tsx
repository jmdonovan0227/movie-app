import { View, Image, ActivityIndicator, Text, FlatList } from "react-native";
import { useCallback } from "react";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
  // Memoize the fetch function to prevent infinite re-renders
  const fetchMoviesFunction = useCallback(() => fetchMovies({ query: "" }), []);

  // we call useFetch function and pass a callback function which is fetchFunction
  // so we can essentially use useFetch with any fetch function we want!
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(fetchMoviesFunction);

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(getTrendingMovies);

  return (
    <View className="flex-1 px-5 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

      {moviesLoading || trendingMoviesLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : moviesError || trendingMoviesError ? (
        <Text className="text-red-500 text-center mt-10">
          Error: {moviesError?.message || trendingMoviesError?.message}
        </Text>
      ) : (
        <View className="flex-1 mt-5">
          <>
            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>

                <FlatList
                  horizontal
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}
            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Latest Movies
            </Text>

            <FlatList
              data={movies} // the data to render in the list
              renderItem={(
                { item } // how to render each item in the list
              ) => <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()} // this is used to identify the item in the list
              numColumns={3} // show in 3 columns
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
            />
          </>
        </View>
      )}
    </View>
  );
}
