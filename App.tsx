import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import TimerScreen from './src/screens/TimerScreen';
import styles from './App.styles.ts';

const HomeScreen = () => (
    <View style={styles.navbarElement}>
        <Text>Home Screen</Text>
    </View>
);

const CalendarScreen = () => (
    <View style={styles.navbarElement}>
        <Text>Calendar Screen (Coming Soon)</Text>
    </View>
);

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Home" component={HomeScreen}/>
                    <Tab.Screen name="Timer" component={TimerScreen}/>
                    <Tab.Screen name="Calendar" component={CalendarScreen}/>
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default App;
