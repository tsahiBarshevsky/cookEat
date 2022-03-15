import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { selected, unSelected } from '../../utils/palette';

const Selector = ({ categories, selectedCategory, setSelectedCategory }) => {
    const allRecipes = ['כל המתכונים'];
    const [data, setData] = useState([]);
    const flatlistRef = useRef(null);

    useEffect(() => {
        setData(categories);
    }, [categories]);

    return (
        <View style={styles.container}>
            <FlatList
                data={allRecipes.concat(data).reverse()}
                ref={flatlistRef}
                keyExtractor={(item) => item}
                horizontal
                inverted
                showsHorizontalScrollIndicator={false}
                style={styles.flatlist}
                ItemSeparatorComponent={() => <View style={{ paddingHorizontal: 5 }} />}
                onLayout={() => flatlistRef.current?.scrollToEnd({ animated: true })}
                onContentSizeChange={() => {
                    setTimeout(() => {
                        flatlistRef.current?.scrollToEnd({ animated: true });
                    }, 200);
                }}
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