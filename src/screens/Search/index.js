import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, StatusBar, Text, SafeAreaView, TextInput, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { EvilIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import update from 'immutability-helper';
import { AnimatedFlatList } from '../../components';
import { background, primary, placeholder } from '../../utils/palette';
import { addNewSearchTerm } from '../../redux/actions/searchTerms';
import { setRecentSearchTerms } from '../../utils/AsyncStorageHandler';

const SearchScreen = ({ route }) => {
    const { size } = route.params;
    const [keyword, setKeyword] = useState('');
    const [isSearched, setIsSearched] = useState(false);
    const recipes = useSelector(state => state.recipes);
    const searchTerms = useSelector(state => state.searchTerms);
    const dispatch = useDispatch();
    const keywordRef = useRef(null);
    let result = recipes.filter((recipe) => recipe.name.includes(keyword));

    const handleSearch = (key) => {
        setIsSearched(true);
        // Check if keyword exists in search terms array
        if (!searchTerms.includes(key.trim())) {
            const updated = update(searchTerms, { $push: [key] });
            setRecentSearchTerms(JSON.stringify(updated)); // Update AsyncStorage
            dispatch(addNewSearchTerm(key)); // Update store
        }
    }

    const handleTermSelect = (term) => {
        setKeyword(term);
        setIsSearched(true);
    }

    const onResetSearch = () => {
        setIsSearched(false);
        setKeyword('');
        keywordRef.current?.focus();
    }

    useEffect(() => {
        keywordRef.current?.focus();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
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
                    onSubmitEditing={() => handleSearch(keyword)}
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
            {isSearched ?
                <View style={{ flex: 1 }}>
                    {result.length > 0 ?
                        <View style={{ flex: 1 }}>
                            <View style={styles.wrapper}>
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
                        <View style={styles.messageContainer}>
                            <Image
                                source={require('../../../assets/images/loupe.png')}
                                resizeMode='cover'
                                style={styles.image}
                            />
                            <Text style={[styles.text, styles.message]}>{`לא נמצאה התאמה ל"${keyword}"`}</Text>
                        </View>
                    }
                </View>
                :
                <View style={[styles.wrapper, styles.recentTermsWrapper]}>
                    {searchTerms.length > 0 &&
                        <View style={{ height: '100%', flex: 1 }}>
                            <Text style={styles.text}>חיפושים אחרונים</Text>
                            <FlatList
                                data={searchTerms}
                                style={{ paddingTop: 10, flex: 1 }}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                keyExtractor={(item) => item}
                                ItemSeparatorComponent={() => <View style={{ paddingVertical: 5 }} />}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => handleTermSelect(item)}
                                            style={styles.searchBox}
                                            activeOpacity={0.5}
                                        >
                                            <View style={styles.searchBoxIcon}>
                                                <MaterialIcons name="history" size={20} color="#FFFFFF80" />
                                            </View>
                                            <Text style={styles.text}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    }
                </View>
            }
        </SafeAreaView>
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
    messageContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    message: {
        textAlign: 'center'
    },
    wrapper: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    recentTermsWrapper: {
        height: '100%',
        flex: 1
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchBoxIcon: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primary,
        borderRadius: 17.5,
        marginRight: 10
    },
    image: {
        height: 100,
        width: 100,
        marginBottom: 10
    }
});