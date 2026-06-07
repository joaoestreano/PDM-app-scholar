import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS } from '../styles/theme';

export default function Card({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginVertical: SPACING.xs,
    elevation: 2,
    alignItems: 'center',
  },
  icon: { fontSize: 32, marginRight: SPACING.md },
  title: { fontSize: 16, fontWeight: FONTS.bold, color: COLORS.text },
  subtitle: { fontSize: 12, color: COLORS.textLight },
});