import { View, Image, FlatList, ActivityIndicator, Text } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { images } from "@/constants/images";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { updateSearchCount } from "@/services/appwrite";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMoviesFunction = useCallback(
    () => fetchMovies({ query: searchQuery }),
    [searchQuery]
  );

  const {
    data: movies,
    loading,
    refetch: loadMovies,
    reset: resetMovies,
    error,
  } = useFetch(fetchMoviesFunction, false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        resetMovies();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps
  // KEY DETAIL: We don't need to include loadMovies and resetMovies in the dependency array because we are using the refetch and reset methods
  // from the useFetch hook which are memoized and will not change unless the fetchMoviesFunction changes.
  // fetchMoviesFunction is memoized and will not change unless the searchQuery changes. Which
  // causes useFetch to refetch data as the callback is a dependency of useFetch. So in short,
  // searchQuery is the only dependency that is needed to be included in the dependency array.

  useEffect(() => {
    (async () => {
      if (movies?.length > 0 && movies?.[0]) {
        await updateSearchCount(searchQuery, movies[0]);
      }
    })();
  }, [movies, searchQuery]);

  // columnWrapperStyle is used to style the wrapper of the columns
  // which is the columns that are displayed in the list (we specify 3 columns)
  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className="text-xl text-white font-bold">
                Search Results for{" "}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <Text className="text-center text-gray-500">
              {searchQuery.trim() ? "No movies found" : "Search for a movie"}
            </Text>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
