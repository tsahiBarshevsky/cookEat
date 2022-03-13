import React, { useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import RecipeCard from '../RecipeCard';

const ITEM_SIZE = 260;

const AnimatedFlatList = ({ recipes, origin }) => {
    const scorllY = useRef(new Animated.Value(0)).current;

    return (
        <Animated.FlatList
            data={recipes}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scorllY } } }],
                { useNativeDriver: true }
            )}
            style={{ marginTop: 10, marginBottom: 5 }}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentContainerStyle}
            ItemSeparatorComponent={() => <View style={styles.sperator} />}
            renderItem={({ item, index }) => {
                const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)];
                const opacityInputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)];
                const scale = scorllY.interpolate({
                    inputRange,
                    outputRange: [1, 1, 1, 0]
                });
                const opacity = scorllY.interpolate({
                    inputRange: opacityInputRange,
                    outputRange: [1, 1, 1, 0]
                });
                return (
                    <Animated.View style={{ transform: [{ scale }], opacity }}>
                        <RecipeCard origin={origin} item={item} />
                    </Animated.View>
                )
            }}
        />
    )
}

export default AnimatedFlatList;

const styles = StyleSheet.create({
    sperator: {
        paddingVertical: 5
    },
    contentContainerStyle: {
        marginTop: 2,
        paddingBottom: 5,
        paddingHorizontal: 15
    }
});