import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, StatusBar, Text, SafeAreaView, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { AnimatedFlatList } from '../../components';
import { background, primary, placeholder } from '../../utils/palette';

const SearchScreen = ({ navigation, route }) => {
    const { size } = route.params;
    const [keyword, setKeyword] = useState('');
    const [isSearched, setIsSearched] = useState(false);
    const recipes = useSelector(state => state.recipes);
    const keywordRef = useRef(null);

    let result = recipes.filter((recipe) => recipe.name.includes(keyword));

    const onResetSearch = () => {
        setIsSearched(false);
        setKeyword('');
        keywordRef.current?.focus();
    }

    useEffect(() => {
        keywordRef.current?.focus();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <EvilIcons name="search" size={24} color="white" />
                <TextInput
                    style={styles.textInput}
                    value={keyword}
                    ref={keywordRef}
                    placeholder={`חיפוש מתכון מבין ${size} מתכונים...`}
                    placeholderTextColor={placeholder}
                    selectionColor={placeholder}
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => setKeyword(text)}
                    returnKeyType='search'
                    onSubmitEditing={() => setIsSearched(true)}
                />
                {keyword.length > 0 &&
                    <TouchableOpacity
                        onPress={() => onResetSearch()}
                        style={styles.button}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="close" size={18} color="white" />
                    </TouchableOpacity>
                }
            </View>
            {isSearched &&
                <View style={{ flex: 1 }}>
                    {result.length > 0 ?
                        <View style={{ flex: 1 }}>
                            <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    {result.length > 1 ?
                                        `${result.length} מתכונים נמצאו`
                                        :
                                        `נמצא מתכון אחד`
                                    }
                                </Text>
                            </View>
                            <AnimatedFlatList
                                origin={'search'}
                                recipes={result}
                            />
                        </View>
                        :
                        <View style={styles.message}>
                            <Text style={styles.text}>לא נמצאו מתכונים</Text>
                        </View>
                    }
                </View>
            }
        </View>
    )
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: background
    },
    text: {
        color: 'white'
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: primary,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        height: 50,
        elevation: 2
    },
    textInput: {
        flex: 1,
        textAlign: 'right',
        color: 'white',
        borderRadius: 15,
        marginHorizontal: 10
    },
    button: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#696969',
    },
    message: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15
    }
});