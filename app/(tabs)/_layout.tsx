import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import { BellIcon } from "@/components/icons/Bell";
import { CartIcon } from "@/components/icons/Cart";
import { HeartIcon } from "@/components/icons/Heart";
import { HomeIcon } from "@/components/icons/Home";
import { Badge } from "@/components/ui/Badge";
import { CustomHeader } from "@/components/ui/CustomeHeader";
import { Typography } from "@/components/ui/Typography";
import { COLORS } from "@/constants/color";
import { useProductsCartStore } from "@/stores/cartProductsStore";

export default function TabLayout() {
  const { getTotalItems } = useProductsCartStore();
  const cartItemCount = getTotalItems();

  return (
    <Tabs
      screenOptions={{
        header: (props) => <CustomHeader {...(props as any)} />,
        tabBarStyle: {
          backgroundColor: COLORS.white,
        },
        sceneStyle: { backgroundColor: COLORS.white },
        tabBarActiveTintColor: COLORS.black[900],
        tabBarInactiveTintColor: COLORS.black[400],

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          fontFamily: "GeneralSans-Medium",
        },

        tabBarLabel: ({ focused, children }) => (
          <Typography
            font={focused ? "semibold" : "regular"}
            style={{
              fontSize: 11,
              textAlign: "center",
            }}
          >
            {children}
          </Typography>
        ),

        headerTitleAlign: "left",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Hyber ",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
          headerRight: () => <BellIcon size={24} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarLabel: "Saved",
          tabBarIcon: ({ color }) => <HeartIcon size={24} color={color} />,
          headerRight: () => <BellIcon size={24} />,
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ color }) => (
            <View style={{ position: "relative" }}>
              <CartIcon size={24} color={color} />
              <Badge count={cartItemCount} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
