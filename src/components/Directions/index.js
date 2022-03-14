import React from 'react';
import { FlatList } from 'react-native';
import DirectionBox from '../DirectionBox';

const Directions = ({ directions }) => {
    return (
        <FlatList
            data={directions}
            style={{ marginTop: 5 }}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{ paddingBottom: 15, marginTop: 5 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
                return (
                    <DirectionBox
                        key={index}
                        index={index}
                        value={item}
                        size={directions.length}
                    />
                )
            }}
        />
    )
}

export default Directions;