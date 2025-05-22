import React, {useEffect, useMemo, useState} from 'react';
import {Alert, InteractionManager, Modal, Text, TextInput, TouchableOpacity, View} from 'react-native';
import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import styles, {getCategoryStyles} from './TimerScreen.styles';
import {TimerItem} from '../types/timer';
import {CATEGORIES} from '../types/category';

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

const defaultCategoryId = () => CATEGORIES.find(c => c.id >= 0)?.id ?? 0;
const formatTime = (total: number) => {
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    return hrs > 0
        ? `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const TimerScreen: React.FC = () => {
    const [timers, setTimers] = useState<TimerItem[]>(INITIAL_PRESETS);
    const [selectedId, setSelectedId] = useState<number>(INITIAL_PRESETS[0].id);
    const [seconds, setSeconds] = useState<number>(INITIAL_PRESETS[0].duration);
    const [isActive, setIsActive] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [newMinutes, setNewMinutes] = useState('25');
    const [newCategory, setNewCategory] = useState<number>(defaultCategoryId());

    useEffect(() => {
        const sel = timers.find(t => t.id === selectedId);
        if (sel) {
            setSeconds(sel.duration);
        }
        setIsActive(false);
    }, [selectedId, timers]);

    useEffect(() => {
        if (!isActive || seconds <= 0) {
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
    }, [isActive, seconds]);

    const toggleTimer = () => {
        if (selectedId === ADD_NEW_TIMER_VALUE) {
            return;
        }
        if (seconds === 0 && !isActive) {
            const sel = timers.find(t => t.id === selectedId);
            if (sel) {
                setSeconds(sel.duration);
            }
        }
        setIsActive(p => !p);
    };

    const resetTimer = () => {
        if (selectedId === ADD_NEW_TIMER_VALUE) {
            return;
        }
        const sel = timers.find(t => t.id === selectedId);
        if (sel) {
            setSeconds(sel.duration);
            setIsActive(false);
        }
    };

    const items = useMemo(() => {
        const defaultCat = CATEGORIES.find(c => c.id === 0) || CATEGORIES[0];
        const source: TimerItem[] = [
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
            } as CustomDropdownItem;
        });
    }, [timers]);

    const openAddModal = () => {
        setNewLabel('');
        setNewMinutes('25');
        setNewCategory(defaultCategoryId());
        setModalVisible(true);
    };

    const handleDropdownValueChange = (
        val: number | ((p: number) => number) | null
    ) => {
        if (val === null) {
            return;
        }
        const newVal = typeof val === 'function' ? val(selectedId) : val;
        if (newVal === ADD_NEW_TIMER_VALUE) {
            setOpenDropdown(false);
            InteractionManager.runAfterInteractions(openAddModal);
        } else {
            setSelectedId(newVal);
        }
    };

    const onSaveNewTimer = () => {
        const mins = parseInt(newMinutes, 10);
        if (!newLabel.trim()) {
            Alert.alert('Error', 'Please enter a name.');
            return;
        }
        if (isNaN(mins) || mins <= 0) {
            Alert.alert('Error', 'Enter a duration > 0.');
            return;
        }
        const newId = (timers.length ? Math.max(...timers.map(t => t.id)) : 0) + 1;
        const newTimer: TimerItem = {
            id: newId,
            label: newLabel.trim(),
            duration: mins * 60,
            categoryId: newCategory,
        };
        setTimers(prev => [...prev, newTimer]);
        setSelectedId(newId);
        setModalVisible(false);
    };

    const selectedItem = items.find(i => i.value === selectedId);
    const catId = selectedItem?.categoryId ?? defaultCategoryId();
    const timerStyles = getCategoryStyles(catId);

    return (
        <View style={styles.screenContainer}>
            {!isModalVisible && (
                <DropDownPicker
                    style={styles.dropDownContainer}
                    open={openDropdown}
                    value={selectedId}
                    items={items}
                    setOpen={setOpenDropdown}
                    setValue={handleDropdownValueChange}
                    placeholder="Choose a timer"
                    dropDownContainerStyle={styles.dropDownListStyle}
                    listMode="SCROLLVIEW"
                    scrollViewProps={{keyboardShouldPersistTaps: 'handled'}}
                    zIndex={3000}
                    zIndexInverse={1000}
                    renderListItem={({item, label, onPress}) => {
                        const it = item as CustomDropdownItem;
                        const isAdd = it.value === ADD_NEW_TIMER_VALUE;
                        const containerStyle = isAdd
                            ? styles.addNewTimerContainer
                            : [styles.renderListItemContainer, {borderLeftColor: it.accentColor, borderLeftWidth: 4}];
                        const textStyle = isAdd
                            ? styles.addNewTimerLabel
                            : [styles.renderListItemLabel, {color: it.accentColor}];
                        return (
                            <TouchableOpacity key={it.value} onPress={() => onPress(it)} style={containerStyle}>
                                <Text style={textStyle}>{label}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

            <View style={styles.timerDisplayWrapper}>
                <View style={[styles.timerDisplayContainer, timerStyles.container]}>
                    <Text style={[styles.timerText, timerStyles.label]}>
                        {formatTime(seconds)}
                    </Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, {backgroundColor: selectedItem?.accentColor ?? '#888888'}]}
                    onPress={toggleTimer}
                    disabled={selectedId === ADD_NEW_TIMER_VALUE || (seconds === 0 && !isActive)}
                >
                    <Text style={styles.buttonText}>
                        {isActive ? 'Pause' : seconds === 0 ? 'Restart' : 'Start'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, {backgroundColor: selectedItem?.accentColor ?? '#888888'}]}
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
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Timer</Text>

                        <View style={{width: '100%', paddingVertical: 10}}>
                            <Text style={styles.inputLabel}>Timer Name:</Text>
                            <TextInput
                                value={newLabel}
                                onChangeText={setNewLabel}
                                placeholder="e.g. Pomodoro"
                                style={styles.textInput}
                            />

                            <Text style={styles.inputLabel}>Duration (minutes):</Text>
                            <TextInput
                                value={newMinutes}
                                onChangeText={setNewMinutes}
                                placeholder="25"
                                keyboardType="numeric"
                                style={styles.textInput}
                            />

                            <Text style={styles.inputLabel}>Category:</Text>
                            <View style={styles.catGrid}>
                                {CATEGORIES.filter(c => c.id >= 0).map(cat => {
                                    const sel = newCategory === cat.id;
                                    return (
                                        <TouchableOpacity
                                            key={cat.id}
                                            onPress={() => setNewCategory(cat.id)}
                                            style={[
                                                styles.catChip,
                                                {borderColor: cat.accentColor},
                                                sel && {backgroundColor: `${cat.accentColor}33`, borderWidth: 2},
                                            ]}
                                        >
                                            <Text style={[styles.catChipText, {color: cat.accentColor}]}>
                                                {cat.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onSaveNewTimer} style={styles.saveButton}>
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
