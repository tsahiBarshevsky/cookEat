import React from 'react';
import { View, Text, FlatList } from 'react-native';
import DirectionBox from '../IngredientBox';

const Directions = ({ directions }) => {
    return (
        <FlatList
            data={directions}
            style={{ marginTop: 5 }}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingBottom: 10 }}
            ItemSeparatorComponent={() => <View style={{ marginVertical: 7 }} />}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
                return (
                    <DirectionBox
                        key={index}
                        index={index}
                        value={item.value}
                    />
                )
            }}
        />
    )
}

export default Directions;