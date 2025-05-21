// TimerScreen.styles.js
import {StyleSheet} from 'react-native';
import {CATEGORIES} from '../types/category';

export default StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        justifyContent: 'space-between',
    },
    dropDownContainer: {
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        borderColor: '#cccccc',
        elevation: 5,
    },
    renderListItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fafafa',
        borderRadius: 6,
        marginVertical: 2,
    },

    dropDownListStyle: {
        borderColor: '#e0e0e0',
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    timerDisplayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
        backgroundColor: 'white',
        borderRadius: 16,
        width: 220,
        height: 220,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    timerText: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#2c3e50',
        letterSpacing: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        marginTop: 20,
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#4361ee',
        paddingVertical: 14,
        paddingHorizontal: 35,
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    renderListItemLabel: {
        fontSize: 16,
        color: '#333333',
    },
    renderListItemDuration: {
        fontSize: 14,
        color: '#666666',
    },

    dropdownItemSelected: {
        backgroundColor: '#f0f0f0',
    },
    dropdownItemColorBar: {
        width: 4,
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
    },
    dropdownItemIconContainer: {
        marginRight: 10,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownItemIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },

    addNewTimerContainer: {
        backgroundColor: '#eafbee',
        borderRadius: 6,
        borderLeftWidth: 4,
        borderLeftColor: '#4caf50',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    addNewTimerLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4caf50',
    },

    containerDesignNew: {
        backgroundColor: '#e0f7fa',
        borderColor: '#00796b',
        borderWidth: 1,
    },
    labelDesignNew: {
        color: '#00796b',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalForm: {
        width: '100%',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
        backgroundColor: '#cccccc',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButton: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: '#4361ee',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelText: {color: '#333333'},
    saveText: {color: '#ffffff'},

    textInput: {
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#ffffff',
        fontSize: 16,
        width: '100%',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333333',
    },
    dropdownInputStyle: {
        marginVertical: 10,
        borderColor: '#cccccc',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    categoryDropdownListStyle: {
        borderColor: '#e0e0e0',
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fafafa',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    colorDot: {
        marginRight: 10,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorDotInner: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    categoryItemText: {
        fontSize: 16,
        color: '#333333',
    },
});

export const getCategoryStyles = (categoryId: number) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    const accentColor = category?.accentColor ?? '#888888';

    return {
        container: {
            borderLeftWidth: 4,
            borderLeftColor: accentColor,
        },
        label: {
            color: accentColor,
            fontWeight: '600',
        },
        screenBackground: {
            backgroundColor: `${accentColor}10`,
        },
        icon: {
            backgroundColor: accentColor,
        },
        dropdownItem: {
            backgroundColor: `${accentColor}08`,
        },
    };
};
