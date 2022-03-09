import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { selected, unSelected } from '../../utils/palette';

const Selector = ({ categories, selectedCategory, setSelectedCategory }) => {
    const allRecipes = ['כל המתכונים'];

    return (
        <View style={styles.container}>
            <FlatList
                data={allRecipes.concat(categories).reverse()}
                keyExtractor={(item) => item}
                horizontal
                inverted
                initialScrollIndex={categories.length}
                showsHorizontalScrollIndicator={false}
                style={styles.flatlist}
                ItemSeparatorComponent={() => <View style={{ paddingHorizontal: 5 }} />}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                if (item !== 'כל המתכונים')
                                    setSelectedCategory(item);
                                else
                                    setSelectedCategory('');
                            }}
                            style={[
                                styles.button,
                                (selectedCategory === item ||
                                    (selectedCategory === '' && item === 'כל המתכונים')) ?
                                    styles.selected
                                    :
                                    styles.unselected
                            ]}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.text}>{item}</Text>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

export default Selector;

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 3
    },
    text: {
        color: 'white'
    },
    flatlist: {
        marginHorizontal: 15
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 15,
        elevation: 3
    },
    selected: {
        backgroundColor: selected,
    },
    unselected: {
        backgroundColor: unSelected
    }
});