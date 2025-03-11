import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen
        name="timer/start"
        options={{
          href: null, // This prevents the tab from showing in the tab bar
        }}
      />
        <Tabs.Screen
        name="timer/active"
        options={{
          href: null, // This prevents the tab from showing in the tab bar
        }}
      />
      <Tabs.Screen
        name="timer/completion"
        options={{
          href: null, // This prevents the tab from showing in the tab bar
        }}
      />
    </Tabs>
  );
}