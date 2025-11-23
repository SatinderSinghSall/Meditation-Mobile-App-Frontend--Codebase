import { Easing } from "react-native-reanimated";

export const BAR_ANIMATION = {
  duration: 600,
  easing: Easing.out(Easing.exp),
};
export const LABEL_ANIMATION = {
  duration: 450,
  easing: Easing.out(Easing.quad),
};
export const TOOLTIP_ANIMATION = {
  duration: 200,
  easing: Easing.linear,
};
