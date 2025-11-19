import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const MovieDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Details for movie with id: {id}</Text>
    </View>
  );
};

export default MovieDetails;
