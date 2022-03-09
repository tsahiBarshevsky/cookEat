import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { selected, unSelected } from '../../utils/palette';

const Selector = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.flatlist}
                contentContainerStyle={{ justifyContent: 'center' }}
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
                            style={[styles.button, (selectedCategory === item) ? styles.selected : styles.unselected]}
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
        borderRadius: 15
    },
    selected: {
        backgroundColor: selected,
    },
    unselected: {
        backgroundColor: unSelected
    }
});