import React, { useRef } from 'react';

export const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
    const bottomSheetRef = useRef(null);

    const open = async () => {
        bottomSheetRef.current?.open();
    }

    const close = async () => {
        bottomSheetRef.current?.close();
    }

    return (
        <AppContext.Provider value={{ bottomSheetRef, open, close }}>
            {children}
        </AppContext.Provider>
    )
}