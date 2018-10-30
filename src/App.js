import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import BackgroundGeolocation from "react-native-background-geolocation";
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './screens/Home';
import Tipo from './screens/Tipo';
import AddPedido from './screens/AddPedido';
import Cliente from './screens/Cliente';
import Articulo from './screens/Articulo';
import Promocion from './screens/Promocion';
import Settings from './screens/Settings';
import Login from './screens/Login';
import AuthLoading from './screens/AuthLoading';

const mainStack = createStackNavigator({
  Home: {
    screen: Home
  },
  Tipo: {
    screen: Tipo
  },
  Add: {
    screen: AddPedido
  },
  Cliente: {
    screen: Cliente
  },
  Articulo: {
    screen: Articulo
  },
  Promocion: {
    screen: Promocion
  }
}, {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f44336',
      },
      headerTintColor: '#fff',
    }
  });

const settingsStack = createStackNavigator({
  Settings: {
    screen: Settings
  }
});

const appStack = createBottomTabNavigator({
  Main: mainStack,
  Settings: settingsStack
}, {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let icon;

        if (routeName === 'Main') {
          icon = `ios-home`;
        } else if (routeName === 'Settings') {
          icon = `ios-options`;
        }

        return <Ionicons name={icon} size={horizontal ? 20 : 25} color={tintColor} />
      }
    }),
    tabBarOptions: {
      activeTintColor: '#fff',
      inactiveTintColor: '#b7160a',
      style: {
        backgroundColor: '#f44336',
      },
      showLabel: false
    }
  });

const authStack = createStackNavigator({
  Login: {
    screen: Login
  }
});

const RootStack = createSwitchNavigator({
  App: appStack,
  Auth: authStack,
  AuthLoading: AuthLoading
}, { initialRouteName: 'AuthLoading' });

export default class App extends Component {
  componentWillMount() {
    BackgroundGeolocation.onLocation(this.onLocation, this.onError);
    BackgroundGeolocation.onMotionChange(this.onMotionChange);

    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        ////
        // 3. Start tracking!
        //
        BackgroundGeolocation.start(function () {
          console.log("- Start success");
        });
      }
    });
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }
  
  onLocation(location) {
    console.log('[location] -', location);
  }

  onError(error) {
    console.warn('[location] ERROR -', error);
  }

  onMotionChange(event) {
    console.log('[motionchange] -', event.isMoving, event.location);
  }

  render() {
    return (
      <RootStack />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)'
  }
});
