import React from 'react';
import { View, FlatList } from 'react-native';
import IngredientBox from '../IngredientBox';

const Ingredients = ({ ingredients }) => {
    return (
        <FlatList
            data={ingredients}
            style={{ marginTop: 5, flex: 1 }}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingBottom: 15, marginTop: 5 }}
            ItemSeparatorComponent={() => <View style={{ marginVertical: 7 }} />}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
                return (
                    <IngredientBox
                        key={index}
                        index={index}
                        title={item.title}
                        amount={item.amount}
                        unit={item.unit}
                    />
                )
            }}
        />
    )
}

export default Ingredients;