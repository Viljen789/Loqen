import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './TimerScreen.styles';
import {TimerItem} from '../types/timer';

// ---- Preset definitions ----
const PRESETS: TimerItem[] = [
    {id: 0, label: 'Study Session', duration: 25 * 60},
    {id: 1, label: 'Short Break', duration: 5 * 60},
    {id: 2, label: 'Long Break', duration: 15 * 60},
];

const TimerScreen = () => {
    // ---- State ----
    const [selectedId, setSelectedId] = useState<number>(PRESETS[0].id);
    const [seconds, setSeconds] = useState<number>(PRESETS[0].duration);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [items, setItems] = useState(
        PRESETS.map(({id, label}) => ({label, value: id})),
    );

    // ---- Dropdown value handler ----
    const handleSetValue = (valueOrCb: number | ((prev: number) => number)) => {
        const newVal =
            typeof valueOrCb === 'function' ? valueOrCb(selectedId) : valueOrCb;
        setSelectedId(newVal);
    };

    // ---- Sync seconds when preset changes ----
    useEffect(() => {
        const preset = PRESETS.find(p => p.id === selectedId);
        if (preset) {
            setSeconds(preset.duration);
            setIsActive(false);
        }
    }, [selectedId]);

    // ---- Countdown ----
    useEffect(() => {
        if (!isActive) {return;}

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

    // ---- Button actions ----
    const toggleTimer = () => {
        if (seconds === 0) {
            const preset = PRESETS.find(p => p.id === selectedId);
            if (preset) {setSeconds(preset.duration);}
        }
        setIsActive(prev => !prev);
    };

    const resetTimer = () => {
        const preset = PRESETS.find(p => p.id === selectedId);
        if (preset) {
            setSeconds(preset.duration);
            setIsActive(false);
        }
    };

    // ---- Helpers ----
    const formatTime = (total: number) => {
        const minutes = Math.floor(total / 60);
        const secs = total % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    // ---- UI ----
    return (
        <View style={styles.screenContainer}>
            <DropDownPicker
                style={styles.dropDownContainer}
                open={open}
                value={selectedId}
                items={items}
                setOpen={setOpen}
                setValue={handleSetValue}
                setItems={setItems}
                placeholder="Choose a timer"
                dropDownContainerStyle={styles.dropDownListStyle}
                maxHeight={150}
                zIndex={3000}
                zIndexInverse={1000}
                listMode="SCROLLVIEW"
            />

            <View style={styles.timerDisplayContainer}>
                <Text style={styles.timerText}>{formatTime(seconds)}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleTimer}>
                    <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={resetTimer}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TimerScreen;
