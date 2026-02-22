// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "list.bullet": "list",
  "location.fill": "location-on",
  "dollarsign.circle.fill": "attach-money",
  "person.fill": "person",
  "phone.fill": "phone",
  "envelope.fill": "email",
  "map.fill": "map",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  "clock.fill": "schedule",
  "car.fill": "directions-car",
  "camera.fill": "camera-alt",
  "bell.fill": "notifications",
  "gear": "settings",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "plus.circle.fill": "add-circle",
  "minus.circle.fill": "remove-circle",
  "star.fill": "star",
  "heart.fill": "favorite",
  "share": "share",
  "download": "download",
  "upload": "upload",
  "trash.fill": "delete",
  "pencil": "edit",
  "magnifyingglass": "search",
  "exclamationmark.triangle.fill": "warning",
  "info.circle.fill": "info",
  "eye.fill": "visibility",
  "eye.slash.fill": "visibility-off",
  "lock.fill": "lock",
  "unlock.fill": "lock-open",
}

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
