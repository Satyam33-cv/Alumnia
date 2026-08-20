// apps/mobile/src/config.js
// API base URL resolution:
//  1. API_URL injected at build time by EAS Build (see eas.json / app.json extra)
//  2. Local dev: use the Expo host for physical devices, emulator bridge for Android,
//     and localhost for iOS simulator / web.
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
const DEV_FALLBACK = expoHost && Platform.OS !== 'web'
	? `http://${expoHost}:4000`
	: Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export const API_URL = process.env.API_URL || DEV_FALLBACK;

export const APP_NAME = 'Alumnia';
