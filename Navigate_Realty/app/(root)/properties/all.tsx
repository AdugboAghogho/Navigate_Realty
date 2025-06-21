import {
  ActivityIndicator,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";

import { Card, FeaturedCard } from "@/components/Cards";
import NoResults from "@/components/NoResults";
import { useAppwrite } from "@/lib/useAppwrite";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import Filters from "@/components/Filters";
import icons from "@/constants/icons";

const AllProperties = () => {
  const params = useLocalSearchParams<{ type?: string }>();

  const isFeatured = params.type === "featured";

  const {
    data: properties,
    refetch,
    loading,
  } = useAppwrite({
    fn: isFeatured ? getLatestProperties : getProperties,
    params: isFeatured
      ? undefined
      : {
          limit: 100, // adjust as needed
        },
  });

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-5 pt-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
          >
            <Image source={icons.backArrow} className="size-5" />
          </TouchableOpacity>

          <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
            {isFeatured ? "All Featured Properties" : "All Properties"}
          </Text>

          <Image source={icons.shield} className="w-6 h-6" />
        </View>

        <View className="px-5 pt-5">
          <Text className="text-2xl font-rubik-bold text-black-300">
            Found {properties?.length} Properties
          </Text>
    
          <Filters />
        </View>

        {loading ? (
          <ActivityIndicator size="large" className="text-primary-300 mt-5" />
        ) : !properties || properties.length === 0 ? (
          <NoResults />
        ) : (
          <FlatList
            data={properties}
            renderItem={({ item }) =>
              isFeatured ? (
                <FeaturedCard
                  item={item}
                  onPress={() => handleCardPress(item.$id)}
                />
              ) : (
                <Card item={item} onPress={() => handleCardPress(item.$id)} />
              )
            }
            keyExtractor={(item) => item.$id}
            numColumns={isFeatured ? 1 : 2}
            contentContainerClassName="gap-5 px-5 pb-32"
            columnWrapperClassName={isFeatured ? "" : "gap-5"}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AllProperties;
