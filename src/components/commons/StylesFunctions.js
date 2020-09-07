import {Dimensions} from "react-native";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export function wp (percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}

export function hp (percentage) {
  const value = (percentage * screenHeight) / 100;
  return Math.round(value);
}

export function screenH () {
  return screenHeight;
};

export function screenW () {
  return screenWidth;
};

