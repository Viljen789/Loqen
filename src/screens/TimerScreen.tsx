import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleProp,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import styles, {getCategoryStyles} from './TimerScreen.styles';
import {TimerItem} from '../types/timer';
import {CATEGORIES, Category} from '../types/category';

const INITIAL_PRESETS: TimerItem[] = [
    {id: 1, label: 'Study Session', duration: 1500, categoryId: 0},
    {id: 2, label: 'Short Break', duration: 300, categoryId: 1},
    {id: 3, label: 'Long Break', duration: 900, categoryId: 2},
];
const ADD_NEW_TIMER_VALUE = -1;

interface CustomDropdownItem extends ItemType<number> {
    accentColor: string;
    categoryId?: number;
}

const TimerScreen = () => {

    const [timers, setTimers] = useState<TimerItem[]>(INITIAL_PRESETS);
    const [selectedId, setSelectedId] = useState<number>(timers[0].id);
    const [seconds, setSeconds] = useState<number>(timers[0].duration);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);


    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [newLabel, setNewLabel] = useState<string>('');
    const [newMinutes, setNewMinutes] = useState<string>('');
    const [newCategory, setNewCategory] = useState<number>(CATEGORIES[0].id);
    const [catOpen, setCatOpen] = useState<boolean>(false);

    const formatTime = useCallback((total: number) => {
        const hrs = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        const secs = total % 60;
        return hrs > 0
            ? `${hrs}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            : `${minutes}:${secs.toString().padStart(2, '0')}`;
    }, []);


    const items = useMemo(() => {
        const defaultCat = CATEGORIES[0];
        const source = [
            ...timers,
            {id: ADD_NEW_TIMER_VALUE, label: '➕ Add New Timer', duration: 0, categoryId: -1},
        ];
        return source.map(timer => {
            const cat = CATEGORIES.find(c => c.id === timer.categoryId) || defaultCat;
            return {
                label: `${timer.label}${timer.duration > 0 ? ` (${formatTime(timer.duration)})` : ''}`,
                value: timer.id,
                accentColor: cat.accentColor,
                categoryId: timer.categoryId,
            };
        });
    }, [timers, formatTime]);

    const handleSetValue = (val: number | ((prev: number) => number)) => {
        const newVal = typeof val === 'function' ? val(selectedId) : val;
        setSelectedId(newVal);
    };


    useEffect(() => {
        const item = items.find(i => i.value === selectedId);
        if (item && item.value !== ADD_NEW_TIMER_VALUE) {
            const p = timers.find(t => t.id === selectedId);
            if (p) {
                setSeconds(p.duration);
            }
        }
        setIsActive(false);
    }, [selectedId, items, timers]);


    useEffect(() => {
        if (!isActive) {
            return;
        }
        const id = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(id);
                    setIsActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [isActive]);

    const toggleTimer = () => {
        if (selectedId === ADD_NEW_TIMER_VALUE) {
            return;
        }
        if (seconds === 0) {
            const p = timers.find(t => t.id === selectedId);
            if (p) {
                setSeconds(p.duration);
            }
        }
        setIsActive(prev => !prev);
    };

    const resetTimer = () => {
        if (selectedId === ADD_NEW_TIMER_VALUE) {
            return;
        }
        const p = timers.find(t => t.id === selectedId);
        if (p) {
            setSeconds(p.duration);
            setIsActive(false);
        }
    };


    const onAddNewTimer = () => setModalVisible(true);


    const onCancel = () => {
        setModalVisible(false);
        setNewLabel('');
        setNewMinutes('');
        setNewCategory(CATEGORIES[0].id);
    };


    const onSave = () => {
        handleSaveNew();
    };

    const handleSaveNew = () => {
        const mins = parseInt(newMinutes, 10);
        if (!newLabel) {
            Alert.alert('Error', 'Please enter a name for the timer');
            return;
        }

        if (isNaN(mins) || mins <= 0) {
            Alert.alert('Error', 'Please enter a valid duration (greater than 0)');
            return;
        }

        const newId = Math.max(...timers.map(t => t.id), 0) + 1;
        const newTimer: TimerItem = {
            id: newId,
            label: newLabel,
            duration: mins * 60,
            categoryId: newCategory,
        };

        setTimers(prev => [...prev, newTimer]);
        setSelectedId(newId);
        setModalVisible(false);
        setNewLabel('');
        setNewMinutes('');
    };

    const categoryItems = CATEGORIES.map((c: Category) => ({label: c.name, value: c.id}));

    const selectedItem = items.find(i => i.value === selectedId) as CustomDropdownItem | undefined;
    const dynamicStyle = selectedItem ? getCategoryStyles(selectedItem.categoryId ?? 0) : {};

    return (
        <View style={styles.screenContainer}>
            {/* Main Timer Picker */}
            <DropDownPicker
                style={styles.dropDownContainer}
                open={open}
                value={selectedId}
                items={items}
                setOpen={setOpen}
                setValue={handleSetValue}
                placeholder="Choose a timer"
                dropDownContainerStyle={styles.dropDownListStyle}
                listMode="SCROLLVIEW"
                renderListItem={({item, label, onPress}) => {
                    const typed = item as CustomDropdownItem;
                    const isAdd = typed.value === ADD_NEW_TIMER_VALUE;
                    const catStyle = getCategoryStyles(typed.categoryId ?? 0);
                    const container: StyleProp<ViewStyle> = isAdd
                        ? [styles.addNewTimerContainer, {backgroundColor: '#eafbee', borderRadius: 6}]
                        : [styles.renderListItemContainer, catStyle.container];
                    const textStyle: StyleProp<TextStyle> = isAdd
                        ? styles.addNewTimerLabel
                        : [styles.renderListItemLabel, catStyle.label];
                    const handlePress = () => (isAdd ? onAddNewTimer() : onPress(typed));
                    return (
                        <TouchableOpacity onPress={handlePress} style={container}>
                            <Text style={textStyle}>{label}</Text>
                        </TouchableOpacity>
                    );
                }}
            />

            {/* Timer Display */}
            <View style={[styles.timerDisplayContainer, dynamicStyle.container]}>
                <Animated.Text style={styles.timerText}>{formatTime(seconds)}</Animated.Text>
            </View>

            {/* Control Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, {backgroundColor: selectedItem?.accentColor}]}
                    onPress={toggleTimer}
                    disabled={selectedId === ADD_NEW_TIMER_VALUE}
                >
                    <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, {backgroundColor: selectedItem?.accentColor}]}
                    onPress={resetTimer}
                    disabled={selectedId === ADD_NEW_TIMER_VALUE}
                >
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Timer</Text>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={{width: '100%'}}
                        >
                            <ScrollView
                                contentContainerStyle={styles.modalForm}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={{width: '100%', paddingBottom: 20}}>
                                    <Text style={styles.inputLabel}>Timer Name:</Text>
                                    <TextInput
                                        value={newLabel}
                                        onChangeText={setNewLabel}
                                        placeholder="Enter timer name"
                                        style={styles.textInput}
                                    />

                                    <Text style={styles.inputLabel}>Duration (minutes):</Text>
                                    <TextInput
                                        value={newMinutes}
                                        onChangeText={setNewMinutes}
                                        placeholder="Enter minutes"
                                        keyboardType="numeric"
                                        style={styles.textInput}
                                    />

                                    <Text style={styles.inputLabel}>Category:</Text>
                                    <View style={{zIndex: 3000, marginBottom: 20}}>
                                        <DropDownPicker
                                            open={catOpen}
                                            value={newCategory}
                                            items={categoryItems}
                                            setOpen={setCatOpen}
                                            setValue={setNewCategory}
                                            placeholder="Select a category"
                                            style={styles.dropdownInputStyle}
                                            dropDownContainerStyle={styles.categoryDropdownListStyle}
                                            zIndex={3000}
                                            zIndexInverse={1000}
                                            listMode="SCROLLVIEW"
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onSave} style={styles.saveButton}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TimerScreen;
